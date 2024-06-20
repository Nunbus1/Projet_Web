document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const arbreId = urlParams.get('id');
  const nom = urlParams.get('nom');
  const hautTot = urlParams.get('haut_tot');
  const troncDiam = urlParams.get('tronc_diam');
  const remarquable = urlParams.get('remarquable');
  const latitude = urlParams.get('latitude');
  const longitude = urlParams.get('longitude');
  const prediction = urlParams.get('prediction');

  if (!arbreId || !nom || !hautTot || !troncDiam || !remarquable || !latitude || !longitude || !prediction) {
      alert("Données manquantes pour l'affichage des prédictions.");
      return;
  }

  document.querySelector("h3:nth-of-type(1)").textContent = `Espèce : ${nom}`;
  document.querySelector("h3:nth-of-type(2)").textContent = `Hauteur : ${hautTot}`;
  document.querySelector("h3:nth-of-type(3)").textContent = `Diamètre : ${troncDiam}`;
  document.querySelector("h3:nth-of-type(4)").textContent = `Remarquable : ${remarquable}`;
  document.querySelector("h3:nth-of-type(5)").textContent = `Latitude : ${latitude}`;
  document.querySelector("h3:nth-of-type(6)").textContent = `Longitude : ${longitude}`;
  document.querySelector("h3:nth-of-type(7)").textContent = `Âge prédit : ${prediction}`;
  
});
