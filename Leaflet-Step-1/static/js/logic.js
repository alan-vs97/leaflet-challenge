var mymap = L.map('map').setView([34.052235, -118.243683], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: mapBoxToken
}).addTo(mymap);


let url_data = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

d3.json(url_data, function (data) {

    function getColor(d) {
        return d > 5 ? '#800026' :
                    d > 4 ? '#BD0026' :
                        d > 3 ? '#E31A1C' :
                            d > 2 ? '#FC4E2A' :
                                d > 1 ? '#FD8D3C' :
                                    '#FFEDA0';
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup(`Magnitude: ${feature.properties.mag}, Place:${feature.properties.place}`);
    }

    L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {

            var geojsonMarkerOptions = {
                radius: feature.properties.mag * 5,
                fillColor: getColor(feature.properties.mag),
                color: getColor(feature.properties.mag),
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(mymap);

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0,1,2,3,4,5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(mymap);
});