<?php
header('Content-Type: application/json; charset=UTF-8');
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

// Spécifier l'encodage UTF-8 pour la connexion MySQL
$conn->set_charset("utf8mb4");

// Déterminer quelle action est demandée
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'getPiedData') {
    $response = [];
    
    $result = $conn->query("SELECT DISTINCT description FROM pied");
    if ($result) {
        $response['fk_pied'] = [];
        while ($row = $result->fetch_assoc()) {
            $response['fk_pied'][] = $row['description'];
        }
    } else {
        $response['error'] = $conn->error;
    }

    // Répondre avec les données récupérées
    echo json_encode($response);
} else {
    // Action non supportée
    echo json_encode(['error' => 'Action non supportée']);
}

// Fermer la connexion à la base de données
$conn->close();
?>
