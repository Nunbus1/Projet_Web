$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id) {
    ajaxRequest('POST', '../../back/php/prediction.php', function(data) {
      console.log("Données reçues:", data); // Ajoutez cette ligne pour le débogage

      if (data.error) {
        alert("Erreur: " + data.error);
        return;
      }

      $("#species").text(data.nom);
      $("#height").text(data.haut_tot);
      $("#diameter").text(data.tronc_diam);
      $("#remarkable").text(data.remarquable ? "Oui" : "Non");
      $("#latitude").text(data.latitude);
      $("#longitude").text(data.longitude);

      // Vérifiez si data.prediction est un nombre avant d'utiliser toFixed
      if (data.prediction) {
        $("#predicted_age").text(parseFloat(data.prediction).toFixed(2));
      }
    }, `id=${id}&action=age`);
  } else {
    alert("Aucun arbre sélectionné.");
  }
});
