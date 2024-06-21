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

    $sql = "SELECT a.id_arbre, a.latitude, a.longitude, a.haut_tot, a.tronc_diam, a.remarquable, a.haut_tronc, n.nom,
           e.description as fk_arb_etat, 
           s.description as fk_stadedev, 
           p.description as fk_port, 
           pi.description as fk_pied
    FROM arbre a
    LEFT JOIN etat e ON a.id_arbre = e.id_arbre
    LEFT JOIN stade_dev s ON a.id_arbre = s.id_arbre
    LEFT JOIN port p ON a.id_arbre = p.id_arbre
    LEFT JOIN pied pi ON a.id_arbre = pi.id_arbre
    LEFT JOIN nom n ON a.id_arbre = n.id_arbre
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