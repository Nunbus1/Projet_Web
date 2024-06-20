$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id) {
    $.ajax({
      url: "../../back/php/age.php",
      type: "POST",
      data: { id: id },
      dataType: "json",
      success: function (response) {
        if (response.success) {
          const data = response.data;
          $("#species").text(data.nom);
          $("#height").text(data.haut_tot);
          $("#diameter").text(data.tronc_diam);
          $("#remarkable").text(data.remarquable ? "Non" : "Oui");
          $("#latitude").text(data.latitude);
          $("#longitude").text(data.longitude);
          $("#predicted_age").text(data.predicted_age.toFixed(2));
        } else {
          alert("Erreur: " + response.error);
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
