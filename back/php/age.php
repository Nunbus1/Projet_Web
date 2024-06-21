<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once 'dbconnect.php';

$id = isset($_POST['id']) ? intval($_POST['id']) : null;
$action = isset($_POST['action']) ? $_POST['action'] : '';

if (!$id) {
    echo json_encode(['error' => 'L\'ID de l\'arbre est requis']);
    exit;
}

$pythonScriptPath = escapeshellarg(__DIR__ . '/../script/age.py');
$pythonInterpreter = 'python';
$command = "$pythonInterpreter $pythonScriptPath -id $id 2>&1";
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
    $query = "SELECT n.nom, a.latitude, a.longitude, a.remarquable, a.haut_tot, a.tronc_diam, a.haut_tronc, e.description AS etat, s.description AS stade_dev, p.description AS port, pi.description AS pied
              FROM arbre a
              JOIN nom n ON a.id_arbre = n.id_arbre
              JOIN etat e ON a.id_arbre = e.id_arbre
              JOIN stade_dev s ON a.id_arbre = s.id_arbre
              JOIN port p ON a.id_arbre = p.id_arbre
              JOIN pied pi ON a.id_arbre = pi.id_arbre
              WHERE a.id_arbre = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($nom, $latitude, $longitude, $remarquable, $haut_tot, $tronc_diam, $haut_tronc, $etat, $stade_dev, $port, $pied);
    $stmt->fetch();
    $stmt->close();

    // Add additional data to the result
    $result['nom'] = $nom;
    $result['latitude'] = $latitude;
    $result['longitude'] = $longitude;
    $result['remarquable'] = $remarquable;
    $result['haut_tot'] = $haut_tot;
    $result['tronc_diam'] = $tronc_diam;
    $result['haut_tronc'] = $haut_tronc;
    $result['etat'] = $etat;
    $result['stade_dev'] = $stade_dev;
    $result['port'] = $port;
    $result['pied'] = $pied;

    echo json_encode(['success' => true, 'data' => $result]);
}
