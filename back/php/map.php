<?php
// Afficher toutes les erreurs PHP

echo "PHP is working!";

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bddstquentin";

// Créer une connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]));
}

$response = [];
$sql = "SELECT nom.nom, arbre.haut_tot, arbre.tronc_diam, arbre.remarquable, arbre.latitude, arbre.longitude FROM arbre JOIN nom ON arbre.id_arbre = nom.id_arbre";
$result = $conn->query($sql);

if ($result) {
    $response['arbres'] = [];
    while ($row = $result->fetch_assoc()) {
        $response['arbres'][] = $row;
    }
    echo json_encode($response);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}

$conn->close();
?>
