// Store our API endpoint inside queryUrl
var usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

d3.json(usgsUrl, function(data) {
    createFeatures(data.features);
});

// d3.json(platesUrl, function (data){
//     thing(data.features);
// });

function createFeatures(earthquakeData) {

    function popUp(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "<p> Magnitude: " + feature.properties.mag + "</p>");
    }

    function something(feature) {
        var color ='';
        if (feature.properties.mag > 5) {
            color = '#472D30';
        } else if (feature.properties.mag > 4) {
            color = '#723D46';
        } else if (feature.properties.mag > 3) {
            color = '#E26D5C';
        } else if (feature.properties.mag > 2) {
            color = '#f1a782';
        } else if (feature.properties.mag > 1) {
            color = '#FFE1A8';
        } else {
            color = '#C9CBA3';
        }

        var style = {
            opacity: 1,
            fillOpacity: 1,
            color: "white",
            fillColor: color,
            radius: (feature.properties.mag * 10),
            stroke: true,
            weight: 0.5
        }
        
        return style
    }
    
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: something,
        onEachFeature: popUp
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openlightmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: 'mapbox/light-v10',
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Light Map": lightmap,
        "Satellite Map": satellitemap,
        "Outdoors Map": outdoorsmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
