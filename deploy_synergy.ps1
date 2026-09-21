# Synergy Global - safe deployment over FTP
#
#   npm run deploy            (or: powershell -ExecutionPolicy Bypass -File deploy_synergy.ps1)
#
# What it does:
#   1. Builds the site (npm run build) unless -SkipBuild is given.
#   2. Zips dist/ (never data/ or uploads/) with web-safe paths.
#   3. Uploads the zip and a one-time agent with a random name and token
#      (FTPS when the server supports it, plain FTP otherwise).
#   4. The agent extracts the files, backing up everything it replaces.
#   5. Checks the live site. If anything fails, it rolls back automatically.
#   6. On success, removes files from older deploys and the agent itself.
#
# Credentials are never stored in this file. Set them once per machine:
#   setx SYNERGY_FTP_HOST "ftp.your-host.com"
#   setx SYNERGY_FTP_USER "your-user"
#   setx SYNERGY_FTP_PASS "your-password"
# (open a new terminal afterwards), or pass -FtpHost/-FtpUser/-FtpPass.

param(
    [string]$FtpHost = $env:SYNERGY_FTP_HOST,
    [string]$FtpUser = $env:SYNERGY_FTP_USER,
    [string]$FtpPass = $env:SYNERGY_FTP_PASS,
    [string]$RemotePath = $(if ($env:SYNERGY_FTP_PATH) { $env:SYNERGY_FTP_PATH } else { '/public_html/synergy.inedito.digital' }),
    [string]$SiteUrl = $(if ($env:SYNERGY_SITE_URL) { $env:SYNERGY_SITE_URL } else { 'https://synergy.inedito.digital' }),
    [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$root = $PSScriptRoot
Set-Location $root
$SiteUrl = $SiteUrl.TrimEnd('/')

function Say($text, $color = 'Gray') { Write-Host $text -ForegroundColor $color }
function Fail($text) { Say "`n$text" 'Red'; exit 1 }

# ---------------------------------------------------------------- credentials
if (-not $FtpHost) { $FtpHost = Read-Host 'FTP host' }
if (-not $FtpUser) { $FtpUser = Read-Host 'FTP user' }
if (-not $FtpPass) {
    $secure = Read-Host 'FTP password' -AsSecureString
    $FtpPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}
if (-not $FtpHost -or -not $FtpUser -or -not $FtpPass) { Fail 'Missing FTP credentials.' }
$FtpHost = $FtpHost -replace '^(ftps?://)', '' -replace '/+$', ''

# ---------------------------------------------------------------------- build
if (-not $SkipBuild) {
    Say 'Building the site...' 'Cyan'
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { Fail 'Build failed. Nothing was uploaded.' }
}
$dist = Join-Path $root 'dist'
foreach ($required in @('index.html', 'index.php', 'api.php', '.htaccess', 'app\bootstrap.php', 'app\config.php', 'app\seed-content.json')) {
    if (-not (Test-Path (Join-Path $dist $required))) { Fail "dist\$required is missing. Run npm run build." }
}
if ((Get-Content (Join-Path $dist 'app\config.php') -Raw) -match "ADMIN_PASSWORD_HASH',\s*''") {
    Fail 'The admin password is not set. Run: php tools/generate_hash.php "your-password"'
}

# ------------------------------------------------------------------------ zip
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
function New-Hex([int]$bytes) {
    $b = New-Object byte[] $bytes
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
    return (($b | ForEach-Object { $_.ToString('x2') }) -join '')
}
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$rand = New-Hex 8
$zipName = "deploy-$stamp-$rand.zip"
$agentName = "deploy-$stamp-$rand.php"
$token = New-Hex 24
$work = Join-Path $env:TEMP "synergy-deploy-$stamp"
New-Item -ItemType Directory -Force $work | Out-Null
$zipPath = Join-Path $work $zipName
$agentPath = Join-Path $work $agentName

Say 'Packing files...' 'Cyan'
$distFull = (Resolve-Path $dist).Path.TrimEnd('\')
$manifest = New-Object System.Collections.Generic.List[string]
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
try {
    Get-ChildItem $dist -Recurse -File -Force | ForEach-Object {
        $rel = $_.FullName.Substring($distFull.Length + 1).Replace('\', '/')
        if ($rel -match '^(data|uploads)/') { return }
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, 'Optimal') | Out-Null
        $manifest.Add($rel)
    }
    $entry = $zip.CreateEntry('app/deploy-manifest.new.json')
    $writer = New-Object IO.StreamWriter($entry.Open())
    $writer.Write((ConvertTo-Json -InputObject $manifest.ToArray() -Compress))
    $writer.Dispose()
} finally {
    $zip.Dispose()
}
$zipMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 1)
Say "  $($manifest.Count) files, $zipMb MB"

$agent = Get-Content (Join-Path $root 'tools\deploy-agent.php') -Raw
$agent = $agent.Replace('__TOKEN__', $token).Replace('__ZIP__', $zipName)
[IO.File]::WriteAllText($agentPath, $agent, (New-Object Text.UTF8Encoding($false)))

# --------------------------------------------------------------------- upload
function Send-Ftp([string]$local, [string]$remoteName, [bool]$ssl) {
    $uri = "ftp://$FtpHost$($RemotePath.TrimEnd('/'))/$remoteName"
    $req = [Net.FtpWebRequest]::Create($uri)
    $req.Method = [Net.WebRequestMethods+Ftp]::UploadFile
    $req.Credentials = New-Object Net.NetworkCredential($FtpUser, $FtpPass)
    $req.EnableSsl = $ssl
    $req.UseBinary = $true
    $req.UsePassive = $true
    $req.KeepAlive = $false
    $req.Timeout = 600000
    $bytes = [IO.File]::ReadAllBytes($local)
    $req.ContentLength = $bytes.Length
    $stream = $req.GetRequestStream()
    try { $stream.Write($bytes, 0, $bytes.Length) } finally { $stream.Close() }
    $resp = $req.GetResponse()
    $resp.Close()
}

Say 'Uploading...' 'Cyan'
$useSsl = $true
try {
    Send-Ftp $agentPath $agentName $true
    Say '  secure connection (FTPS)'
} catch {
    $useSsl = $false
    Say '  FTPS not available, using plain FTP' 'Yellow'
    try { Send-Ftp $agentPath $agentName $false } catch { Fail "FTP upload failed: $($_.Exception.Message)" }
}
try { Send-Ftp $zipPath $zipName $useSsl } catch { Fail "FTP upload failed: $($_.Exception.Message)" }

# ----------------------------------------------------------------- run agent
function Invoke-Agent([string]$step) {
    $url = "$SiteUrl/$($agentName)?token=$token&step=$step"
    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 300
        return ($r.Content | ConvertFrom-Json)
    } catch {
        $body = ''
        if ($_.Exception.Response) {
            $sr = New-Object IO.StreamReader($_.Exception.Response.GetResponseStream())
            $body = $sr.ReadToEnd()
        }
        try { return ($body | ConvertFrom-Json) } catch { return [pscustomobject]@{ ok = $false; error = "$($_.Exception.Message) $body" } }
    }
}

Say 'Installing on the server...' 'Cyan'
$res = Invoke-Agent 'extract'
if (-not $res.ok) {
    Say "  Install failed: $($res.error) $($res.files)" 'Red'
    $rb = Invoke-Agent 'rollback'
    Fail "Rolled back ($($rb.restored) files restored). The site is unchanged."
}
Say "  $($res.files) files installed ($($res.new) new)"

# ------------------------------------------------------------ health check
Say 'Checking the live site...' 'Cyan'
$problems = @()
function Check([string]$path, [scriptblock]$test, [string]$label) {
    try {
        $r = Invoke-WebRequest -Uri "$SiteUrl$path" -UseBasicParsing -TimeoutSec 60 -Headers @{ 'Cache-Control' = 'no-cache' }
        if (-not (& $test $r)) { $script:problems += "$label ($path)" }
    } catch {
        $script:problems += "$label ($path): $($_.Exception.Message)"
    }
}
Check '/' { param($r) $r.StatusCode -eq 200 -and $r.Content -match 'synergy-content' } 'home page'
Check '/portfolio' { param($r) $r.StatusCode -eq 200 -and $r.Content -match '<title>' } 'properties page'
Check '/api.php' { param($r) $r.StatusCode -eq 200 -and ($r.Content | ConvertFrom-Json).settings } 'content API'
Check '/robots.txt' { param($r) $r.StatusCode -eq 200 -and $r.Content -match 'User-agent' } 'robots.txt'
Check '/admin' { param($r) $r.StatusCode -eq 200 } 'admin'

if ($problems.Count -gt 0) {
    Say '  Problems found:' 'Red'
    $problems | ForEach-Object { Say "   - $_" 'Red' }
    $rb = Invoke-Agent 'rollback'
    Fail "Rolled back automatically ($($rb.restored) files restored). The previous site is live again."
}
Say '  All checks passed' 'Green'

$fin = Invoke-Agent 'finalize'
if ($fin.ok) {
    Say "  Cleaned up $($fin.deleted) old files" 'Gray'
} else {
    Say "  Cleanup skipped: $($fin.error) (the new site is live)" 'Yellow'
}
Remove-Item $work -Recurse -Force -ErrorAction SilentlyContinue
Say "`nDeployment complete: $SiteUrl" 'Green'
