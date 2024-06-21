$(document).ready(function() {
    // Appeler la fonction pour remplir les champs de sélection lors du chargement de la page
    $.ajax({
        type: 'GET',
        url: '../../back/php/filtre.php?action=getPiedData',
        dataType: 'json',
        encode: true
    }).done(function(data) {
        fillSelectFields(data); 
    }).fail(function(xhr, status, error) {
        alert('Erreur lors de la récupération des données.');
    });

    // Fonction pour remplir les champs de sélection
    function fillSelectFields(data) {
        // Remplir le sélecteur pour le filtre par pied
        $('#fk_pied_filter').empty().append($('<option>').text('Tous les pieds').attr('value', ''));
        data.fk_pied.forEach(function(pied) {
            $('#fk_pied_filter').append($('<option>').text(pied).attr('value', pied));
        });
    }

    // Écouteur d'événement pour le changement dans le selecteur de pied
    $('#fk_pied_filter').on('change', function() {
        var selectedPied = $(this).val(); // Valeur sélectionnée dans le select

        // Filtrer le tableau en fonction de la sélection
        $('#tableau_arbres tbody tr').each(function() {
            var piedValue = $(this).find('.pied_column').text(); // Valeur du pied dans la ligne
            if (selectedPied === '' || piedValue === selectedPied) {
                $(this).show(); // Afficher la ligne si elle correspond au filtre ou si aucun filtre n'est sélectionné
            } else {
                $(this).hide(); // Masquer la ligne si elle ne correspond pas au filtre
            }
        });

        // Réinitialiser l'affichage du tableau si aucun filtre n'est sélectionné
        if (selectedPied === '') {
            $('#tableau_arbres tbody tr').show(); // Afficher toutes les lignes du tableau
        }
    });
});
