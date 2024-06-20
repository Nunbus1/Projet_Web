"use strict";

document.addEventListener("DOMContentLoaded", function () {
  async function fetchClusters(numClusters = 2) {
    try {
      const response = await fetch(
        `../../back/php/cluster.php?numClusters=${numClusters}`
      );
      const clusters = await response.json();
      console.log("Données reçues:", clusters);

      if (clusters.error) {
        console.error("Error fetching clusters:", clusters.error);
        return;
      }

      displayMap(clusters.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function displayMap(clusters) {
    const colors = ["red", "blue", "green", "orange", "purple"];
    const data = clusters.map((cluster) => ({
      type: "scattermapbox",
      lat: [cluster.latitude],
      lon: [cluster.longitude],
      mode: "markers",
      marker: {
        size: 14,
        symbol: "circle",
        color: colors[cluster.cluster % colors.length],
      },
      text: [`ID: ${cluster.id_arbre}<br>Cluster: ${cluster.cluster}`],
      hoverinfo: "text",
    }));

    var layout = {
      dragmode: "zoom",
      mapbox: {
        style: "mapbox://styles/mapbox/streets-v11",
        center: { lat: 49.8486, lon: 3.2875 },
        zoom: 12,
      },
      margin: { r: 0, t: 0, b: 0, l: 0 },
      showlegend: false,
    };

    Plotly.newPlot("map", data, layout, {
      mapboxAccessToken:
        "pk.eyJ1IjoibnVuYnVzIiwiYSI6ImNseGppanZjdDFxdGoyanFwaG4wNjVtaG4ifQ.BXNSajM0Roj6pVMoUZc39A",
    });
  }

  document
    .getElementById("applyClusters")
    .addEventListener("click", function () {
      const numClusters = document.getElementById("numClusters").value;
      console.log(`Nombre de clusters sélectionné : ${numClusters}`); // Debug: afficher numClusters
      fetchClusters(numClusters);
    });

  fetchClusters();
});
