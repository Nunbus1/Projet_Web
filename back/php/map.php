<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once 'dbconnect.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$itemsPerPage = 5; // Nombre d'arbres par page
$offset = ($page - 1) * $itemsPerPage;

if ($action == 'getArbres') {
    // Récupérer les arbres pour la page actuelle du tableau et de la carte
   $sql_paginated = "
    SELECT a.id_arbre, a.latitude, a.longitude, a.haut_tot, a.tronc_diam, a.remarquable, a.haut_tronc, n.nom,
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
    $result_paginated = $conn->query($sql_paginated);

    $arbres_paginated = [];
    if ($result_paginated->num_rows > 0) {
        while ($row = $result_paginated->fetch_assoc()) {
            $arbres_paginated[] = $row;
        }
    }

    // Obtenir le nombre total d'arbres pour la pagination
    $totalArbresResult = $conn->query("SELECT COUNT(*) as total FROM arbre");
    $totalArbres = $totalArbresResult->fetch_assoc()['total'];
    $totalPages = ceil($totalArbres / $itemsPerPage);

    echo json_encode([
        'arbres_paginated' => $arbres_paginated,
        'totalPages' => $totalPages,
        'currentPage' => $page
    ]);
} else {
    echo json_encode(['error' => 'Action non supportée']);
}

$conn->close();
?>
