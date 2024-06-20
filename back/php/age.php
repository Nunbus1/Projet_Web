<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once 'dbconnect.php';

$id = isset($_POST['id']) ? intval($_POST['id']) : null;

if (!$id) {
    echo json_encode(['error' => 'L\'ID de l\'arbre est requis']);
    exit;
}

$pythonScriptPath = escapeshellarg(__DIR__ . '/../script/age.py');
$pythonInterpreter = 'python';
$command = "$pythonInterpreter $pythonScriptPath $id 2>&1";
$output = shell_exec($command);

if ($output === null) {
    echo json_encode(['error' => 'Failed to execute Python script.', 'command' => $command]);
    exit;
}

$result = json_decode($output, true);
if (isset($result['error'])) {
    echo json_encode(['error' => $result['error']]);
} else {
    // Fetch additional data from the database
    $query = "SELECT n.nom, a.latitude, a.longitude, a.remarquable
              FROM arbre a
              JOIN nom n ON a.id_arbre = n.id_arbre
              WHERE a.id_arbre = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($nom, $latitude, $longitude, $remarquable);
    $stmt->fetch();
    $stmt->close();

    // Add additional data to the result
    $result['nom'] = $nom;
    $result['latitude'] = $latitude;
    $result['longitude'] = $longitude;
    $result['remarquable'] = $remarquable;

    echo json_encode(['success' => true, 'data' => $result]);
}
