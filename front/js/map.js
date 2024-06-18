"use strict";
document.addEventListener("DOMContentLoaded", function () {
  // Exemple de données statiques pour Saint-Quentin  
  var data = [
    {
      type: "scattermapbox",
      lat: ["49.8486"], // Latitude de Saint-Quentin
      lon: ["3.2875"], // Longitude de Saint-Quentin
      mode: "markers",
      marker: {
        size: 14,
        color: "fuchsia",
      },
      text: ["Saint-Quentin"],
    },
  ];

  // Configuration du layout de la carte avec couches de trafic
  var layout = {
    dragmode: "zoom",
    mapbox: {
      style: "mapbox://styles/mapbox/streets-v11",
      center: { lat: 49.8486, lon: 3.2875 },
      zoom: 12,
      layers: [
        {
          id: "traffic",
          type: "line",
          source: "mapbox",
          "source-layer": "traffic",
          layout: {
            visibility: "visible",
          },
          paint: {
            "line-width": 1.5,
            "line-color": [
              "case",
              ["==", ["get", "congestion"], "low"],
              "#8bff8b",
              ["==", ["get", "congestion"], "moderate"],
              "#ffff00",
              ["==", ["get", "congestion"], "heavy"],
              "#ff8b00",
              ["==", ["get", "congestion"], "severe"],
              "#ff0000",
              "#000000",
            ],
          },
        },
      ],
    },
    margin: { r: 0, t: 0, b: 0, l: 0 },
    showlegend: false,
  };

  // Initialisation de la carte avec Plotly
  Plotly.newPlot("map", data, layout, {
    mapboxAccessToken:
      "pk.eyJ1IjoibnVuYnVzIiwiYSI6ImNseGppanZjdDFxdGoyanFwaG4wNjVtaG4ifQ.BXNSajM0Roj6pVMoUZc39A",
  });
});
