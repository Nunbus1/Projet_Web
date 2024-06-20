<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$numClusters = isset($_GET['numClusters']) ? intval($_GET['numClusters']) : 2;
$pythonScriptPath = escapeshellarg(__DIR__ . '/../script/cluster.py');
$jsonFilePath = __DIR__ . '/../script/clusters.json';

$pythonInterpreter = 'python';

$command = "$pythonInterpreter $pythonScriptPath $numClusters 2>&1";
$output = shell_exec($command);

if ($output === null) {
    echo json_encode(['error' => 'Failed to execute Python script.', 'command' => $command]);
    exit;
}

if (file_exists($jsonFilePath) && is_readable($jsonFilePath)) {
    $jsonData = file_get_contents($jsonFilePath);
    echo json_encode(['message' => 'ex', 'num' => $numClusters, 'command' => $command, 'data' => json_decode($jsonData)]);
} else {
    echo json_encode(['error' => 'Failed to generate clusters or read JSON file.', 'python_output' => $output]);
}
