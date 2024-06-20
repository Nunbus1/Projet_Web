<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once 'dbconnect.php';

$conn = connectDB();

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'getArbres') {
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $itemsPerPage = 5;
    $offset = ($page - 1) * $itemsPerPage;

    $totalQuery = "SELECT COUNT(*) AS total FROM arbre";
    $totalResult = $conn->query($totalQuery);
    $totalRow = $totalResult->fetch_assoc();
    $totalItems = $totalRow['total'];
    $totalPages = ceil($totalItems / $itemsPerPage);

    $sql = "SELECT a.id_arbre, a.latitude, a.longitude, a.haut_tot, a.tronc_diam, a.remarquable, n.nom
            FROM arbre a
            JOIN nom n ON a.id_arbre = n.id_arbre
            LIMIT $itemsPerPage OFFSET $offset";
    $result = $conn->query($sql);

    $arbres = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $arbres[] = $row;
        }
    } else {
        echo json_encode(['error' => 'Aucune donnée trouvée']);
        exit;
    }

    echo json_encode([
        'arbres_paginated' => $arbres,
        'totalPages' => $totalPages,
        'currentPage' => $page
    ]);
} else {
    echo json_encode(['error' => 'Action non supportée']);
}

$conn->close();
?>
