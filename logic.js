var key = "pk.eyJ1IjoiY2NrdXF1aSIsImEiOiJja2NwaDdodDgwdGU3MnJvMmwyd2RvZGpuIn0._Rc1PlKi_cacQMQXq7_G9g";

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openlightmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: 'mapbox/light-v10',
    accessToken: key
    });

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/satellite-v9",
    accessToken: key
});

var streetsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: key
});

var baseMaps = {
    "Streets Map": streetsmap,
    "Light Map": lightmap,
    "Satellite Map": satellitemap    
};

var layer_plates = new L.LayerGroup();
var layer_earthquakes = new L.LayerGroup();

var usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

function color(d) {
    return d > 5 ? '#fbb4ae' :
           d > 4 ? '#b3cde3' :
           d > 3 ? '#ccebc5' :
           d > 2 ? '#decbe4' :
           d > 1 ? '#fed9a6' :
                    '#ffffcc';
}

d3.json(platesUrl, function (data){
        
    L.geoJSON(data,{
        color: 'purple',
        weight: 2,
        fillOpacity: 0.01
    }).addTo(layer_plates);
    
    layer_plates.addTo(myMap);
});

d3.json(usgsUrl, function(data) {

    function popUp(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "<p> Magnitude: " + feature.properties.mag + "</p>");
    }
    
    function something(feature) {  
        var style = {
            opacity: 1,
            fillOpacity: 1,
            color: "black",
            fillColor: color(feature.properties.mag),
            radius: (feature.properties.mag * 8),
            stroke: true,
            weight: 1
        }
        return style
    }  
    
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: something,
        onEachFeature: popUp
    }).addTo(layer_earthquakes);

    layer_earthquakes.addTo(myMap);
});

// layer_earthquakes.bringToFront();

var myMap = L.map("map", {
    center: [20, 0],
    zoom: 3,
    layers: [
        streetsmap, 
        layer_plates,
        layer_earthquakes  
    ]
});

var overlayMaps = {
    "Tectonic Plates": layer_plates,
    Earthquakes: layer_earthquakes
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        mag = [0, 1, 2, 3, 4, 5],
        labels = [];

    div.innerHTML = "<h4>Earthquake<br>Magnitude</h4>";

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag.length; i++) {
        div.innerHTML +=
            '<i style="background:' + color(mag[i] + 1) + '"></i>' +
            mag[i] + (mag[i + 1] ? ' &ndash; ' + mag[i + 1] + '<br><br>' : ' +');
    }

    return div;
};

legend.addTo(myMap);