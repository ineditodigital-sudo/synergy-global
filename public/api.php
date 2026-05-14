<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$file = 'content.json';

// Si es una petición GET, devolvemos el contenido actual
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo json_encode((object)[]);
    }
    exit;
}

// Si es una petición POST, guardamos el nuevo contenido
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    if ($json) {
        if (file_put_contents($file, $json)) {
            echo json_encode(['status' => 'success', 'message' => 'Content updated']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to write file']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No data received']);
    }
    exit;
}
?>
