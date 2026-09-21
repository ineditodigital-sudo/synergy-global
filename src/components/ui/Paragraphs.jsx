/** Splits plain text on blank lines into <p> elements. */
export default function Paragraphs({ text, className = '' }) {
  const parts = String(text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.map((p, i) => (
    <p key={i} className={className}>
      {p.split('\n').map((line, j, arr) => (
        <span key={j}>
          {line}
          {j < arr.length - 1 && <br />}
        </span>
      ))}
    </p>
  ));
}
