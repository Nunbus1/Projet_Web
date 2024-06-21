$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id) {
    $.ajax({
      url: "../../back/php/prediction.php",
      type: "POST",
      data: { id: id, action: "deracinement" },
      dataType: "json",
      success: function (data) {
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
          $("#predicted_uprooting").text(
            data.prediction === "true" ? "Non" : "Oui"
          );
        } else {
          $("#predicted_uprooting").text("N/A");
        }
      },
      error: function (xhr, status, error) {
        alert("Erreur lors de la prédiction.");
      },
    });
  } else {
    alert("Aucun arbre sélectionné.");
  }
});
