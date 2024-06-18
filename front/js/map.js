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

document.addEventListener("DOMContentLoaded", function () {
  var tableContainer = document.getElementById("tableContainer");
  var treeContainer = document.getElementById("treeContainer");
  var tree = document.getElementById("tree");
  var trail = document.getElementById("trail");
  var isDragging = false;
  var startX, scrollLeft;

  function updateTreeContainerWidth() {
    treeContainer.style.width = tableContainer.scrollWidth + "px";
  }

  function updateTreePosition() {
    var scrollPercentage =
      tableContainer.scrollLeft /
      (tableContainer.scrollWidth - tableContainer.clientWidth);
    var treePosition =
      scrollPercentage * (tableContainer.scrollWidth - tree.clientWidth);
    tree.style.left = treePosition + "px";
    trail.style.width = treePosition + tree.clientWidth / 2 + "px";
  }

  // Mettre à jour la largeur de treeContainer et la position de l'émote en fonction du défilement
  tableContainer.addEventListener("scroll", updateTreePosition);
  window.addEventListener("resize", updateTreeContainerWidth);
  updateTreeContainerWidth();

  // Ajouter des événements de drag pour l'émote
  tree.addEventListener("mousedown", function (e) {
    isDragging = true;
    startX = e.pageX - tree.offsetLeft;
    scrollLeft = tableContainer.scrollLeft;
    document.body.style.cursor = "grabbing";
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
    document.body.style.cursor = "default";
  });

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    e.preventDefault();
    var x = e.pageX - treeContainer.offsetLeft;
    var walk = x - startX;
    var scrollPercentage =
      walk / (treeContainer.scrollWidth - tree.clientWidth);
    tableContainer.scrollLeft =
      scrollPercentage *
      (tableContainer.scrollWidth - tableContainer.clientWidth);
  });

  // Initial update of tree position
  updateTreePosition();
});
