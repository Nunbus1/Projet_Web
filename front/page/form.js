$(document).ready(function() {
    // Fonction pour remplir les champs de sélection
    function fillSelectFields(data) {
        console.log("Données reçues:", data); // Vérifier les données reçues dans la console

        // Remplir le sélecteur fk_nomtech
        var fk_nomtechSelect = $('#fk_nomtech');
        fk_nomtechSelect.empty(); // Vide toutes les options actuelles

        $.each(data.fk_nomtech, function(index, value) {
            console.log("Valeur pour fk_nomtech:", value);
            fk_nomtechSelect.append($('<option>').text(value).attr('value', value));
        });

        // Remplir le sélecteur fk_arb_etat
        var fk_arb_etatSelect = $('#fk_arb_etat');
        fk_arb_etatSelect.empty();

        $.each(data.fk_arb_etat, function(index, value) {
            fk_arb_etatSelect.append($('<option>').text(value).attr('value', value));
        });

        // Remplir le sélecteur fk_stadedev
        var fk_stadedevSelect = $('#fk_stadedev');
        fk_stadedevSelect.empty();

        $.each(data.fk_stadedev, function(index, value) {
            fk_stadedevSelect.append($('<option>').text(value).attr('value', value));
        });

        // Remplir le sélecteur fk_port
        var fk_portSelect = $('#fk_port');
        fk_portSelect.empty();

        $.each(data.fk_port, function(index, value) {
            fk_portSelect.append($('<option>').text(value).attr('value', value));
        });

        // Remplir le sélecteur fk_pied
        var fk_piedSelect = $('#fk_pied');
        fk_piedSelect.empty();

        $.each(data.fk_pied, function(index, value) {
            fk_piedSelect.append($('<option>').text(value).attr('value', value));
        });
    }

    // Appeler la fonction pour remplir les champs de sélection lors du chargement de la page
    $.ajax({
        type: 'GET',
        url: 'request.php?action=getFormData',
        dataType: 'json',
        encode: true
    }).done(function(data) {
        console.log("Réponse AJAX réussie:", data); // Vérifier la réponse AJAX dans la console
        fillSelectFields(data); // Appel de la fonction pour remplir les champs de sélection
    }).fail(function(xhr, status, error) {
        console.error("Erreur AJAX:", status, error); // Gestion des erreurs AJAX
        alert('Erreur lors de la récupération des données.');
    });

    // Soumission du formulaire via AJAX
    $('#myForm').submit(function(event) {
        event.preventDefault(); // Empêche le rechargement de la page

        // Prépare les données du formulaire
        var formData = {
            fk_arb_etat: $('#fk_arb_etat').val(),
            fk_stadedev: $('#fk_stadedev').val(),
            fk_port: $('#fk_port').val(),
            fk_pied: $('#fk_pied').val()
        };

        // Envoie les données du formulaire via AJAX
        $.ajax({
            type: 'POST',
            url: 'request.php?action=addArbre',
            data: formData,
            dataType: 'json',
            encode: true
        }).done(function(data) {
            console.log("Réponse de soumission du formulaire:", data);

            try {
                if (data.success) {
                    alert('Arbre ajouté avec succès!');
                    $('#myForm')[0].reset(); // Réinitialiser le formulaire après une soumission réussie
                } else {
                    alert('Erreur: ' + data.error);
                }
            } catch (e) {
                console.error("Erreur d'analyse JSON:", e);
                alert('Erreur inattendue lors de la soumission du formulaire.');
            }
        }).fail(function(xhr, status, error) {
            console.error("Erreur AJAX:", status, error); // Gestion des erreurs AJAX
            alert('Erreur inattendue lors de la soumission du formulaire.');
        });
    });
});
$(document).ready(function() {
    // Fonction pour remplir les champs de sélection
    function fillSelectFields(data) {
        console.log("Données reçues:", data); // Vérifier les données reçues dans la console

       

        // Remplir le sélecteur fk_arb_etat
        var fk_arb_etatSelect = $('#fk_arb_etat');
        fk_arb_etatSelect.empty();

        $.each(data.fk_arb_etat, function(index, value) {
            fk_arb_etatSelect.append($('<option>').text(value).attr('value', value));
        });

        // Remplir le sélecteur fk_stadedev
        var fk_stadedevSelect = $('#fk_stadedev');
        fk_stadedevSelect.empty();

        $.each(data.fk_stadedev, function(index, value) {
            fk_stadedevSelect.append($('<option>').text(value).attr('value', value));
        });

        // Remplir le sélecteur fk_port
        var fk_portSelect = $('#fk_port');
        fk_portSelect.empty();

        $.each(data.fk_port, function(index, value) {
            fk_portSelect.append($('<option>').text(value).attr('value', value));
        });

        // Remplir le sélecteur fk_pied
        var fk_piedSelect = $('#fk_pied');
        fk_piedSelect.empty();

        $.each(data.fk_pied, function(index, value) {
            fk_piedSelect.append($('<option>').text(value).attr('value', value));
        });
    }

    // Appeler la fonction pour remplir les champs de sélection lors du chargement de la page
    $.ajax({
        type: 'GET',
        url: 'request.php?action=getFormData',
        dataType: 'json',
        encode: true
    }).done(function(data) {
        console.log("Réponse AJAX réussie:", data); // Vérifier la réponse AJAX dans la console
        fillSelectFields(data); // Appel de la fonction pour remplir les champs de sélection
    }).fail(function(xhr, status, error) {
        console.error("Erreur AJAX:", status, error); // Gestion des erreurs AJAX
        alert('Erreur lors de la récupération des données.');
    });
});
