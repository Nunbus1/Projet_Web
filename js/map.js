document.addEventListener('DOMContentLoaded', function() {
    var data = [];

    var layout = {
        mapbox: {
            style: 'mapbox://styles/mapbox/streets-v11',
            center: { lon: 3.2875, lat: 49.8486 },
            zoom: 12
        },
        margin: { r: 0, t: 0, b: 0, l: 0 }
    };

    var config = {
        mapboxAccessToken: 'pk.eyJ1IjoibnVuYnVzIiwiYSI6ImNseGppanZjdDFxdGoyanFwaG4wNjVtaG4ifQ.BXNSajM0Roj6pVMoUZc39A'
    };

    Plotly.newPlot('map', data, layout, config);
});
