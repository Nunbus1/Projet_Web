"use strict";

document.addEventListener("DOMContentLoaded", function () {
  async function fetchArbres() {
    try {
      const response = await fetch("../../back/php/map.php?action=getArbres");
      const arbres = await response.json();
      console.log("Données reçues:", arbres);

      if (arbres.error) {
        console.error("Error fetching arbres:", arbres.error);
        return;
      }

      displayMap(arbres);
      displayTable(arbres);
      setupPagination(arbres);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function displayMap(arbres) {
    const data = arbres.map((arbre) => ({
      type: "scattermapbox",
      lat: [arbre.latitude],
      lon: [arbre.longitude],
      mode: "markers",
      marker: {
        size: 14,
        symbol: "circle",
        color: arbre.remarquable ? "green" : "fuchsia",
      },
      text: [
        `Nom: ${arbre.nom}<br>Hauteur: ${arbre.haut_tot}m<br>Diamètre: ${
          arbre.tronc_diam
        }cm<br>Remarquable: ${arbre.remarquable ? "Oui" : "Non"}`,
      ],
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

  function displayTable(arbres) {
    const tableBody = document.querySelector("#arbreTable tbody");
    tableBody.innerHTML = "";

    arbres.slice(0, 5).forEach((arbre) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="arbre-checkbox" data-id="${
          arbre.id_arbre
        }"></td>
        <td>${arbre.nom}</td>
        <td>${arbre.haut_tot}</td>
        <td>${arbre.tronc_diam}</td>
        <td>${arbre.remarquable ? "Oui" : "Non"}</td>
        <td>${arbre.latitude}</td>
        <td>${arbre.longitude}</td>
      `;
      tableBody.appendChild(row);
    });

    setupCheckboxEventListeners();
  }

  function setupPagination(arbres) {
    const itemsPerPage = 5;
    const totalPages = Math.ceil(arbres.length / itemsPerPage);
    const pagination = document.getElementById("pagination");
    const tableBody = document.querySelector("#arbreTable tbody");

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement("button");
      pageLink.textContent = i;
      pageLink.addEventListener("click", function () {
        displayPage(i);
      });
      pagination.appendChild(pageLink);
    }

    function displayPage(page) {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageArbres = arbres.slice(start, end);

      tableBody.innerHTML = "";
      pageArbres.forEach((arbre) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="checkbox" class="arbre-checkbox" data-id="${
            arbre.id_arbre
          }"></td>
          <td>${arbre.nom}</td>
          <td>${arbre.haut_tot}</td>
          <td>${arbre.tronc_diam}</td>
          <td>${arbre.remarquable ? "Oui" : "Non"}</td>
          <td>${arbre.latitude}</td>
          <td>${arbre.longitude}</td>
        `;
        tableBody.appendChild(row);
      });

      setupCheckboxEventListeners();
    }

    displayPage(1);
  }

  function setupCheckboxEventListeners() {
    const checkboxes = document.querySelectorAll("#arbreTable .arbre-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const row = this.closest("tr");
        if (this.checked) {
          row.style.backgroundColor = "green";
          row.style.color = "white";
        } else {
          row.style.backgroundColor = "";
          row.style.color = "";
        }
      });
    });
  }

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

  tableContainer.addEventListener("scroll", updateTreePosition);
  window.addEventListener("resize", updateTreeContainerWidth);
  updateTreeContainerWidth();

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

  updateTreePosition();

  fetchArbres();
});
