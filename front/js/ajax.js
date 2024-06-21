function ajaxRequest(method, url, callback, data = null) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(JSON.parse(xhr.responseText));
            } else {
                console.error('Erreur lors de la requête AJAX:', xhr.status, xhr.statusText);
            }
        }
    };
    xhr.send(data);
}
