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
