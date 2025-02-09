let map;
let marsMap;

const lunarLocations = [
    {
        lat: 0,
        lon: 23.47,
        image: "/gamePics/tranquility.jpg",
        name: "Sea of Tranquility"
    },
    // Additional lunar locations...
];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        streetViewControl: false,
        mapTypeControlOptions: {
            mapTypeIds: ["moon"],
        },
    });

    const moonMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            const normalizedCoord = getNormalizedCoord(coord, zoom);
            if (!normalizedCoord) {
                return "";
            }
            const bound = Math.pow(2, zoom);
            return (
                "https://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw" +
                "/" + zoom + "/" + normalizedCoord.x + "/" + (bound - normalizedCoord.y - 1) + ".jpg"
            );
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 9,
        minZoom: 0,
        radius: 1738000,
        name: "Moon",
    });

    map.mapTypes.set("moon", moonMapType);
    map.setMapTypeId("moon");

    initMarsMap();  // Initialize Mars map here
}

function initMarsMap() {
    marsMap = new google.maps.Map(document.getElementById("mars-map"), {
        center: { lat: 0, lng: 0 },
        zoom: 1,
        streetViewControl: false,
        mapTypeControlOptions: {
            mapTypeIds: ["mars"],
        },
    });

    const marsMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            const normalizedCoord = getNormalizedCoord(coord, zoom);
            if (!normalizedCoord) {
                return "";
            }
            const bound = Math.pow(2, zoom);
            return (
                "https://mw1.google.com/mw-planetary/mars/visible" +
                "/" + zoom + "/" + normalizedCoord.x + "/" + (bound - normalizedCoord.y - 1) + ".jpg"
            );
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 9,
        minZoom: 0,
        radius: 3389500,
        name: "Mars",
    });

    marsMap.mapTypes.set("mars", marsMapType);
    marsMap.setMapTypeId("mars");

    google.maps.event.addListener(marsMap, 'click', function (event) {
        // Handle clicks on Mars map if needed
    });
}

function getNormalizedCoord(coord, zoom) {
    const y = coord.y;
    let x = coord.x;
    const tileRange = 1 << zoom;

    if (y < 0 || y >= tileRange) {
        return null;
    }

    if (x < 0 || x >= tileRange) {
        x = ((x % tileRange) + tileRange) % tileRange;
    }
    return { x: x, y: y };
}

// Include other functions and logic as necessary