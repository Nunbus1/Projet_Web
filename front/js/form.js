$(document).ready(function() {
    // Fonction pour remplir les champs de sélection
    function fillSelectFields(data) {
        // Remplir les sélecteurs
        $('#fk_nomtech').empty().append(data.fk_nom.map(nom => $('<option>').text(nom).attr('value', nom)));
        $('#fk_arb_etat').empty().append(data.fk_arb_etat.map(etat => $('<option>').text(etat).attr('value', etat)));
        $('#fk_stadedev').empty().append(data.fk_stadedev.map(stade => $('<option>').text(stade).attr('value', stade)));
        $('#fk_port').empty().append(data.fk_port.map(port => $('<option>').text(port).attr('value', port)));
        $('#fk_pied').empty().append(data.fk_pied.map(pied => $('<option>').text(pied).attr('value', pied)));
    }

    // Appeler la fonction pour remplir les champs de sélection lors du chargement de la page
    $.ajax({
        type: 'GET',
        url: '../../back/php/request.php?action=getFormData',
        dataType: 'json',
        encode: true
    }).done(function(data) {
        fillSelectFields(data); 
    }).fail(function(xhr, status, error) {
        alert('Erreur lors de la récupération des données.');
    });

    $('#myForm').submit(function(event) {
        event.preventDefault(); // Empêche le rechargement de la page

        // Prépare les données du formulaire
        var formData = {
            fk_nomtech: $('#fk_nomtech').val(),
            haut_tronc: $('#haut_tronc').val(),
            tronc_diam: $('#tronc_diam').val(),
            haut_tot: $('#haut_tot').val(),
            remarquable: $('#remarquable').is(':checked') ? 1 : 0,
            latitude: $('#latitude').val(),
            longitude: $('#longitude').val(),
            fk_arb_etat: $('#fk_arb_etat').val(),
            fk_stadedev: $('#fk_stadedev').val(),
            fk_port: $('#fk_port').val(),
            fk_pied: $('#fk_pied').val()
        };

        $.ajax({
            type: 'POST',
            url: '../../back/php/request.php?action=addArbre',
            data: formData,
            dataType: 'json',
            encode: true
        }).done(function(data) {
            if (data.success) {
                alert('Arbre ajouté avec succès!');
                $('#myForm')[0].reset(); // Réinitialiser le formulaire après une soumission réussie
            } else {
                alert('Erreur: ' + data.error);
            }
        }).fail(function(xhr, status, error) {
            alert('Erreur inattendue lors de la soumission du formulaire.');
        });
    });
});
