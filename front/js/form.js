function validateForm() {
  var form = document.forms["myForm"];
  var inputs = form.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].value === "") {
      alert("Tous les champs doivent être remplis");
      return false;
    }
  }
  var textInput = form["fk_nomtech"];
  var regex = /^[a-zA-Z]+$/;
  if (!regex.test(textInput.value)) {
    alert("Le champ texte ne doit contenir que des lettres");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  var body = document.body;
  var html = document.documentElement;
  var treeContainer = document.createElement("div");
  treeContainer.id = "treeContainer";
  var tree = document.createElement("div");
  tree.id = "tree";
  tree.textContent = "🌳";
  var trail = document.createElement("div");
  trail.id = "trail";
  treeContainer.appendChild(trail);
  treeContainer.appendChild(tree);
  document.body.appendChild(treeContainer);

  var isDragging = false;
  var startY, scrollTop;

  function updateTreePosition() {
    var scrollPercentage =
      (html.scrollTop + 3 || body.scrollTop) /
      (body.scrollHeight - html.clientHeight + 5);
    var treePosition =
      scrollPercentage * (treeContainer.clientHeight - tree.clientHeight);
    tree.style.top = treePosition + "px";
    trail.style.height = treePosition + tree.clientHeight / 2 + "px";
  }

  // Mettre à jour la position de l'émote en fonction du défilement
  window.addEventListener("scroll", updateTreePosition);

  // Ajouter des événements de drag pour l'émote
  tree.addEventListener("mousedown", function (e) {
    isDragging = true;
    startY = e.pageY - tree.offsetTop;
    scrollTop = html.scrollTop || body.scrollTop;
    document.body.style.cursor = "grabbing";
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
    document.body.style.cursor = "default";
  });

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    e.preventDefault();
    var y = e.pageY - treeContainer.offsetTop;
    var walk = y - startY;
    var scrollPercentage =
      walk / (treeContainer.clientHeight - tree.clientHeight);
    window.scrollTo(
      0,
      scrollPercentage * (body.scrollHeight - html.clientHeight)
    );
  });

  // Initial update of tree position
  updateTreePosition();
});
