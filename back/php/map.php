<?php
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
    die("Connection failed: " . $conn->connect_error);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'getArbres') {
    $sql = "SELECT a.latitude, a.longitude, a.haut_tot, a.tronc_diam, a.remarquable, n.nom
            FROM arbre a
            JOIN nom n ON a.id_arbre = n.id_arbre";
    $result = $conn->query($sql);

    $arbres = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $arbres[] = $row;
        }
    }
    echo json_encode($arbres);
} else {
    echo json_encode(['error' => 'Action non supportée']);
}

$conn->close();
?>
