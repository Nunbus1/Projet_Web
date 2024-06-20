<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once 'dbconnect.php';

$id = $_POST['id'];
$action = $_POST['action'];

// Récupérer les données de l'arbre depuis la base de données
$query = "SELECT a.*, n.nom as species, e.description as etat, s.description as stade_dev, p.description as port, pi.description as pied 
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
$result = $stmt->get_result();
$arbre = $result->fetch_assoc();

if ($arbre) {
    $command = escapeshellcmd(sprintf(
        'python3 ../../python/predict_age.py -model knn -species %s -height %d -trunc_height %d -trunc_diameter %d -remarkable %d -latitude %f -longitude %f -id_state %d -id_stage %d -id_habit %d -id_base %d',
        escapeshellarg($arbre['species']),
        $arbre['haut_tot'],
        $arbre['haut_tronc'],
        $arbre['tronc_diam'],
        $arbre['remarquable'],
        $arbre['latitude'],
        $arbre['longitude'],
        1,  // id_state
        1,  // id_stage
        1,  // id_habit
        1   // id_base
    ));

    $output = shell_exec($command);
    $prediction = intval($output);

    echo json_encode([
        'species' => $arbre['species'],
        'height' => $arbre['haut_tot'],
        'trunc_diameter' => $arbre['tronc_diam'],
        'remarkable' => $arbre['remarquable'],
        'latitude' => $arbre['latitude'],
        'longitude' => $arbre['longitude'],
        'prediction' => $prediction
    ]);
} else {
    echo json_encode(['error' => 'Arbre non trouvé']);
}

$conn->close();
?>
