<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once 'dbconnect.php'; // Assurez-vous que le fichier dbconnect.php contient la connexion à la base de données
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
    echo json_encode(['error' => 'Failed to execute database query.', 'query' => $sql, 'db_error' => $conn->error]);
    exit;
}

if ($result->num_rows > 0) {
    $arbres = [];
    while ($row = $result->fetch_assoc()) {
        $arbres[] = $row;
    }

    // Écrire les données des arbres dans un fichier JSON
    if (file_put_contents($arbreJsonPath, json_encode($arbres)) === false) {
        echo json_encode(['error' => 'Failed to write trees to JSON file.']);
        exit;
    }
} else {
    echo json_encode(['error' => 'No trees found in the database.']);
    exit;
}

$command = "$pythonInterpreter $pythonScriptPath $numClusters 2>&1";
$output = shell_exec($command);

if ($output === null) {
    echo json_encode(['error' => 'Failed to execute Python script.', 'command' => $command, 'python_output' => $output]);
    exit;
}

if (file_exists($jsonFilePath) && is_readable($jsonFilePath)) {
    $jsonData = file_get_contents($jsonFilePath);
    echo json_encode(['message' => 'Python script executed successfully', 'num' => $numClusters, 'command' => $command, 'data' => json_decode($jsonData)]);
} else {
    echo json_encode(['error' => 'Failed to generate clusters or read JSON file.', 'python_output' => $output]);
}

$conn->close();
