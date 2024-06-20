<?php
header('Content-Type: application/json');

require_once 'dbconnect.php';

$conn = connectDB();

$action = isset($_POST['action']) ? $_POST['action'] : '';
$id = isset($_POST['id']) ? intval($_POST['id']) : 0;

if ($id === 0) {
    echo json_encode(['error' => 'ID invalide']);
    exit;
}

$sql = "SELECT a.*, n.nom, e.id_etat, e.description AS etat, s.id_stadeDev, s.description AS stade_dev, p.id_port, p.description AS port, pi.id_pied, pi.description AS pied
        FROM arbre a
        JOIN nom n ON a.id_arbre = n.id_arbre
        JOIN etat e ON a.id_arbre = e.id_arbre
        JOIN stade_dev s ON a.id_arbre = s.id_arbre
        JOIN port p ON a.id_arbre = p.id_arbre
        JOIN pied pi ON a.id_arbre = pi.id_arbre
        WHERE a.id_arbre = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['error' => 'Arbre non trouvé']);
    exit;
}

$arbre = $result->fetch_assoc();

$model = 'knn'; // Vous pouvez choisir le modèle ici

if ($action == 'age') {
    $cmd = sprintf(
        'python3 ../script/age.py -m %s -species %s -height %d -trunc_height %d -trunc_diameter %d -remarkable %d -latitude %f -longitude %f -id_state %d -id_stage %d -id_habit %d -id_base %d',
        escapeshellarg($model),
        escapeshellarg($arbre['nom']),
        intval($arbre['haut_tot']),
        intval($arbre['haut_tronc']),
        intval($arbre['tronc_diam']),
        intval($arbre['remarquable']),
        floatval($arbre['latitude']),
        floatval($arbre['longitude']),
        intval($arbre['id_etat']),
        intval($arbre['id_stadeDev']),
        intval($arbre['id_port']),
        intval($arbre['id_pied'])
    );
} elseif ($action == 'deracinement') {
    $cmd = sprintf(
        'python3 ../script/uprooting.py -m %s -species %s -height %d -trunc_height %d -trunc_diameter %d -remarkable %d -latitude %f -longitude %f -id_state %d -id_stage %d -id_habit %d -id_base %d',
        escapeshellarg($model),
        escapeshellarg($arbre['nom']),
        intval($arbre['haut_tot']),
        intval($arbre['haut_tronc']),
        intval($arbre['tronc_diam']),
        intval($arbre['remarquable']),
        floatval($arbre['latitude']),
        floatval($arbre['longitude']),
        intval($arbre['id_etat']),
        intval($arbre['id_stadeDev']),
        intval($arbre['id_port']),
        intval($arbre['id_pied'])
    );
} else {
    echo json_encode(['error' => 'Action non supportée']);
    exit;
}

exec($cmd, $output, $return_var);

if ($return_var !== 0) {
    echo json_encode(['error' => 'Erreur lors de l\'exécution du script']);
    exit;
}

$prediction = $output[0];
if ($action == 'age') {
    $prediction .= ' ans';
} elseif ($action == 'deracinement') {
    $prediction = ($prediction === 'true') ? 'Oui' : 'Non';
}

echo json_encode([
    'nom' => $arbre['nom'],
    'haut_tot' => $arbre['haut_tot'],
    'tronc_diam' => $arbre['tronc_diam'],
    'remarquable' => $arbre['remarquable'] ? 'Oui' : 'Non',
    'latitude' => $arbre['latitude'],
    'longitude' => $arbre['longitude'],
    'prediction' => $prediction
]);
?>
