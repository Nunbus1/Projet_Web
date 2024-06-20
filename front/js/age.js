$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        $.ajax({
            url: '../../back/php/prediction.php',
            type: 'POST',
            data: { id: id, action: 'age' },
            dataType: 'json',
            success: function (data) {
                $('#species').text(data.species);
                $('#height').text(data.height);
                $('#diameter').text(data.trunc_diameter);
                $('#remarkable').text(data.remarkable ? 'Oui' : 'Non');
                $('#latitude').text(data.latitude);
                $('#longitude').text(data.longitude);
                $('#predicted_age').text(data.prediction);
            },
            error: function (xhr, status, error) {
                alert('Erreur lors de la prédiction.');
            }
        });
    } else {
        alert('Aucun arbre sélectionné.');
    }
});
