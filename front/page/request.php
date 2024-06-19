<?php
// request.php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "your_database_name";

// Créer une connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Déterminer quelle action est demandée
$action = $_GET['action'];

if ($action == 'getArbre') {
    $sql = "SELECT * FROM arbre";
    $result = $conn->query($sql);
    $arbreData = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $arbreData[] = $row;
        }
    }

    echo json_encode($arbreData);
}

if ($action == 'addArbre') {
    $longitude = $_POST['longitude'];
    $latitude = $_POST['latitude'];
    $haut_tot = $_POST['haut_tot'];
    $haut_tronc = $_POST['haut_tronc'];
    $age_estim = $_POST['age_estim'];
    $tronc_diam = $_POST['tronc_diam'];
    $remarquable = $_POST['remarquable'];

    $sql = "INSERT INTO arbre (longitude, latitude, haut_tot, haut_tronc, age_estim, tronc_diam, remarquable) VALUES ('$longitude', '$latitude', '$haut_tot', '$haut_tronc', '$age_estim', '$tronc_diam', '$remarquable')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "id" => $conn->insert_id]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
}

$conn->close();
?>
