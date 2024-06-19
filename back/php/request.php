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

if ($action == 'addArbre') {
    // Récupérer les données du formulaire
    $fk_nomtech = isset($_POST['fk_nomtech']) ? $_POST['fk_nomtech'] : '';
    $haut_tronc = isset($_POST['haut_tronc']) ? $_POST['haut_tronc'] : '';
    $tronc_diam = isset($_POST['tronc_diam']) ? $_POST['tronc_diam'] : '';
    $haut_tot = isset($_POST['haut_tot']) ? $_POST['haut_tot'] : '';
    $remarquable = isset($_POST['remarquable']) ? 1 : 0;
    $latitude = isset($_POST['latitude']) ? $_POST['latitude'] : '';
    $longitude = isset($_POST['longitude']) ? $_POST['longitude'] : '';
    $fk_arb_etat = isset($_POST['fk_arb_etat']) ? $_POST['fk_arb_etat'] : '';
    $fk_stadedev = isset($_POST['fk_stadedev']) ? $_POST['fk_stadedev'] : '';
    $fk_port = isset($_POST['fk_port']) ? $_POST['fk_port'] : '';
    $fk_pied = isset($_POST['fk_pied']) ? $_POST['fk_pied'] : '';

    // Préparer et exécuter la requête d'insertion dans la table 'arbre'
    $sql = "INSERT INTO arbre (longitude, latitude, haut_tot, haut_tronc, tronc_diam, remarquable)
            VALUES ('$longitude', '$latitude', '$haut_tot', '$haut_tronc', '$tronc_diam', '$remarquable')";

    if ($conn->query($sql) === TRUE) {
        $id_arbre = $conn->insert_id;

        // Insertion dans les autres tables liées à 'arbre'
        $conn->query("INSERT INTO nom (id_arbre, id_nom, nom) VALUES ('$id_arbre', '$id_arbre', '$fk_nomtech')");
        $conn->query("INSERT INTO etat (id_arbre, id_etat, description) VALUES ('$id_arbre', '$id_arbre', '$fk_arb_etat')");
        $conn->query("INSERT INTO stade_dev (id_arbre, id_stadeDev, description) VALUES ('$id_arbre', '$id_arbre', '$fk_stadedev')");
        $conn->query("INSERT INTO port (id_arbre, id_port, description) VALUES ('$id_arbre', '$id_arbre', '$fk_port')");
        $conn->query("INSERT INTO pied (id_arbre, id_pied, description) VALUES ('$id_arbre', '$id_arbre', '$fk_pied')");

        // Répondre avec succès et l'ID de l'arbre ajouté
        echo json_encode(["success" => true, "id" => $id_arbre]);
    } else {
        // En cas d'échec de l'insertion, répondre avec l'erreur SQL
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
} elseif ($action == 'getFormData') {
    $response = [];

    $result = $conn->query("SELECT DISTINCT nom FROM nom");
    if ($result) {
        $response['fk_nom'] = [];
        while ($row = $result->fetch_assoc()) {
            $response['fk_nom'][] = $row['nom'];
        }
    } else {
        $response['error'] = $conn->error;
    }

    $result = $conn->query("SELECT DISTINCT description FROM pied");
    if ($result) {
        $response['fk_pied'] = [];
        while ($row = $result->fetch_assoc()) {
            $response['fk_pied'][] = $row['description'];
        }
    } else {
        $response['error'] = $conn->error;
    }

    $result = $conn->query("SELECT DISTINCT description FROM stade_dev");
    if ($result) {
        $response['fk_stadedev'] = [];
        while ($row = $result->fetch_assoc()) {
            $response['fk_stadedev'][] = $row['description'];
        }
    } else {
        $response['error'] = $conn->error;
    }

    $result = $conn->query("SELECT DISTINCT description FROM port");
    if ($result) {
        $response['fk_port'] = [];
        while ($row = $result->fetch_assoc()) {
            $response['fk_port'][] = $row['description'];
        }
    } else {
        $response['error_port'] = $conn->error;
    }

    $result = $conn->query("SELECT DISTINCT description FROM etat");
    if ($result) {
        $response['fk_arb_etat'] = [];
        while ($row = $result->fetch_assoc()) {
            $response['fk_arb_etat'][] = $row['description'];
        }
    } else {
        $response['error_etat'] = $conn->error;
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
