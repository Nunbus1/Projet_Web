"use strict";

document.addEventListener("DOMContentLoaded", function () {
  let currentPage = 1;
  const itemsPerPage = 5;
  let arbresData = [];

  async function fetchArbres(page = 1) {
    try {
      const response = await fetch(`../../back/php/map.php?action=getArbres&page=${page}`);
      const data = await response.json();
      console.log("Données reçues:", data);

      if (data.error) {
        console.error("Error fetching arbres:", data.error);
        return;
      }

      arbresData = data.arbres_paginated; // Stocker les données des arbres
      displayMap(data.arbres_paginated);
      displayTable(data.arbres_paginated);
      setupPagination(data.totalPages, data.currentPage);
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
        `Nom: ${arbre.nom}<br>Hauteur: ${arbre.haut_tot}m<br>Diamètre: ${arbre.tronc_diam}cm<br>Remarquable: ${arbre.remarquable ? "Oui" : "Non"}`,
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
      mapboxAccessToken: "pk.eyJ1IjoibnVuYnVzIiwiYSI6ImNseGppanZjdDFxdGoyanFwaG4wNjVtaG4ifQ.BXNSajM0Roj6pVMoUZc39A",
    });
  }

  function displayTable(arbres) {
    const tableBody = document.querySelector("#arbreTable tbody");
    tableBody.innerHTML = "";

    arbres.forEach((arbre) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="radio" name="selectedArbre" class="arbre-checkbox" data-id="${arbre.id_arbre}"></td>
        <td>${arbre.nom}</td>
        <td>${arbre.haut_tot}</td>
        <td>${arbre.haut_tronc}</td>
        <td>${arbre.tronc_diam}</td>
        <td>${arbre.remarquable ? "Oui" : "Non"}</td>
        <td>${arbre.latitude}</td>
        <td>${arbre.longitude}</td>
        <td>${arbre.fk_arb_etat}</td>
        <td>${arbre.fk_stadedev}</td>
        <td>${arbre.fk_pied}</td>
        <td>${arbre.fk_port}</td>
      `;
      tableBody.appendChild(row);
    });

    setupCheckboxEventListeners();
  }

  function setupPagination(totalPages, currentPage) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const prevButton = document.createElement("button");
    prevButton.textContent = "Précédent";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", function () {
      if (currentPage > 1) {
        fetchArbres(currentPage - 1);
      }
    });

    const nextButton = document.createElement("button");
    nextButton.textContent = "Suivant";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", function () {
      if (currentPage < totalPages) {
        fetchArbres(currentPage + 1);
      }
    });

    pagination.appendChild(prevButton);
    pagination.appendChild(nextButton);
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

  $(document).ready(function() {
    // Appeler la fonction pour remplir les champs de sélection lors du chargement de la page
    $.ajax({
      type: 'GET',
      url: '../../back/php/filtre.php?action=getPiedData',
      dataType: 'json',
      encode: true
    }).done(function(data) {
      fillSelectFields(data);
    }).fail(function(xhr, status, error) {
      alert('Erreur lors de la récupération des données.');
    });

    // Fonction pour remplir les champs de sélection
    function fillSelectFields(data) {
      // Remplir le sélecteur pour le filtre par pied
      $('#fk_pied_filter').empty().append($('<option>').text('Tous les pieds').attr('value', ''));
      data.fk_pied.forEach(function(pied) {
        $('#fk_pied_filter').append($('<option>').text(pied).attr('value', pied));
      });
    }

    // Écouteur d'événement pour le changement dans le sélecteur de pied
    $('#fk_pied_filter').on('change', function() {
      const selectedPied = $(this).val(); // Valeur sélectionnée dans le select
      filterArbresByPied(selectedPied);
    });

    // Fonction pour filtrer les arbres en fonction de la valeur sélectionnée
    function filterArbresByPied(selectedPied) {
      const filteredArbres = selectedPied ? arbresData.filter(arbre => arbre.fk_pied === selectedPied) : arbresData;
      displayTable(filteredArbres); // Afficher les arbres filtrés
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
        (tableContainer.scrollWidth - tableContainer.client.clientWidth);
    });

    updateTreePosition();

    fetchArbres(currentPage);

    document.getElementById("predict-age-button").addEventListener("click", function () {
      const checkedCheckbox = document.querySelector('input[name="selectedArbre"]:checked');
      if (!checkedCheckbox) {
        alert("Veuillez sélectionner un arbre pour prédire l'âge.");
        return;
      }

      const selectedRow = checkedCheckbox.closest("tr");
      const arbreId = checkedCheckbox.dataset.id;
      const espece = selectedRow.cells[1].textContent;
      const hauteur = selectedRow.cells[2].textContent;
      const diametre = selectedRow.cells[3].textContent;
      const remarquable = selectedRow.cells[4].textContent === "Oui" ? 1 : 0;
      const latitude = selectedRow.cells[5].textContent;
      const longitude = selectedRow.cells[6].textContent;

      // Rediriger vers la page de prédiction en passant les informations de l'arbre sélectionné
      window.location.href = `age.html?id=${arbreId}&espece=${espece}&hauteur=${hauteur}&diametre=${diametre}&remarquable=${remarquable}&latitude=${latitude}&longitude=${longitude}`;
    });

    document.getElementById("predict-deracinement-button").addEventListener("click", function () {
      const checkedCheckbox = document.querySelector('input[name="selectedArbre"]:checked');
      if (!checkedCheckbox) {
        alert("Veuillez sélectionner un arbre pour prédire le déracinement.");
        return;
      }

      const selectedRow = checkedCheckbox.closest("tr");
      const arbreId = checkedCheckbox.dataset.id;
      const espece = selectedRow.cells[1].textContent;
      const hauteur = selectedRow.cells[2].textContent;
      const diametre = selectedRow.cells[3].textContent;
      const remarquable = selectedRow.cells[4].textContent === "Oui" ? 1 : 0;
      const latitude = selectedRow.cells[5].textContent;
      const longitude = selectedRow.cells[6].textContent;

      // Rediriger vers la page de déracinement en passant les informations de l'arbre sélectionné
      window.location.href = `deracinement.html?id=${arbreId}&espece=${espece}&hauteur=${hauteur}&diametre=${diametre}&remarquable=${remarquable}&latitude=${latitude}&longitude=${longitude}`;
    });
  });
});
