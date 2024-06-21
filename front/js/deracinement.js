$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id) {
    $.ajax({
      url: "../../back/php/prediction.php",
      type: "POST",
      data: { id: id, action: "deracinement" },
      dataType: "json",
      success: function (response) {
        console.log("Données reçues:", response);

        if (response.error) {
          alert("Erreur: " + response.error);
          return;
        }

        const data = response.data;

        $("#species").text(data.nom);
        $("#height").text(data.haut_tot);
        $("#diameter").text(data.tronc_diam);
        $("#remarkable").text(data.remarquable ? "Oui" : "Non");
        $("#latitude").text(data.latitude);
        $("#longitude").text(data.longitude);

        $("#predicted_uprooting").text(
          data.prediction === "true" ? "Oui" : "Non"
        );
      },
      error: function (xhr, status, error) {
        alert("Erreur lors de la prédiction.");
      },
    });
  } else {
    alert("Aucun arbre sélectionné.");
  }
});
