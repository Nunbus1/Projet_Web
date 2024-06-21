<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once 'dbconnect.php';
require_once 'data_encode.php';

$conn = connectDB();

$numClusters = isset($_GET['numClusters']) ? intval($_GET['numClusters']) : 2;
$pythonScriptPath = escapeshellarg(__DIR__ . '/../script/cluster.py');
$jsonFilePath = __DIR__ . '/../script/clusters.json';
$arbreJsonPath = __DIR__ . '/../script/arbres.json';

$pythonInterpreter = 'python';

// Requête pour récupérer les 200 premiers arbres
$sql = "SELECT id_arbre, latitude, longitude FROM arbre LIMIT 200";
$result = $conn->query($sql);

if ($result === false) {
    sendError(500);
}

if ($result->num_rows > 0) {
    $arbres = [];
    while ($row = $result->fetch_assoc()) {
        $arbres[] = $row;
    }

    // Écrire les données des arbres dans un fichier JSON
    if (file_put_contents($arbreJsonPath, json_encode($arbres)) === false) {
        sendError(500);
    }
} else {
    sendError(404);
}

$command = "$pythonInterpreter $pythonScriptPath $numClusters 2>&1";
$output = shell_exec($command);

if ($output === null) {
    sendError(500);
}

if (file_exists($jsonFilePath) && is_readable($jsonFilePath)) {
    $jsonData = file_get_contents($jsonFilePath);
    sendJsonData(['message' => 'Python script executed successfully', 'num' => $numClusters, 'command' => $command, 'data' => json_decode($jsonData)], 200);
} else {
    sendError(500);
}

$conn->close();
?>
