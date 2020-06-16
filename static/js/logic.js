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

var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/outdoors-v11",
    accessToken: key
});

var baseMaps = {
    "Outdoors Map": outdoorsmap,
    "Light Map": lightmap,
    "Satellite Map": satellitemap    
};

var layer_plates = new L.LayerGroup();
var layer_earthquakes = new L.LayerGroup();

var usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

d3.json(usgsUrl, function(data) {

    function popUp(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "<p> Magnitude: " + feature.properties.mag + "</p>");
    }
    
    function something(feature) {
        var color ='';
        if (feature.properties.mag > 5) {
            color = '#4CC9F0';
        } else if (feature.properties.mag > 4) {
            color = '#4361EE';
        } else if (feature.properties.mag > 3) {
            color = '#3A0CA3';
        } else if (feature.properties.mag > 2) {
            color = '#7209B7';
        } else if (feature.properties.mag > 1) {
            color = '#B5179E';
        } else {
            color = '#F72585';
        }
    
        var style = {
            opacity: 1,
            fillOpacity: 1,
            color: "black",
            fillColor: color,
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
    // console.log('hi');
});

d3.json(platesUrl, function (data){
        
    L.geoJSON(data,{
        color: 'purple',
        weight: 2,
        fillOpacity: 0.01
    }).addTo(layer_plates);
    
    layer_plates.addTo(myMap);
});

var myMap = L.map("map", {
    center: [20, 0],
    zoom: 3,
    layers: [
        outdoorsmap, 
        layer_earthquakes,
        layer_plates
    ]
});

var overlayMaps = {
    Earthquakes: layer_earthquakes,
    "Tectonic Plates": layer_plates
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);
