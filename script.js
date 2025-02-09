  let map;
  let guessed = false; // Flag to track if player has already guessed
  
  const lunarLocations = [
    {
      lat: 0,
      lon: 23.47,
      image: "/gamePics/tranquility.jpg",
      name: "Sea of Tranquility"
    },
    {
      lat: -3.01,
      lon: -23.42,
      image: "/gamePics/twelve.png",
      name: "Ocean of Storms"
    },
    {
      lat: 26.13,
      lon: 3.63,
      image: "/gamePics/thirteen.png",
      name: "Hadley Rille"
    },
    {
      lat: -3.65,
      lon: -17.47,
      image: "/gamePics/fourteen.png",
      name: "Fra Mauro"
    },
    {
  lat: -3.65,
  lon: -17.47,
  image: "/gamePics/fifteen.png",
  name: "Hadley-Apennine"
  },
    {
      lat: 26.13,
      lon: 3.63,
      image: "/gamePics/sixteen.png",
      name: "Fra Mauro"
    },
    {
      lat: -8.97,
      lon: 15.50,
      image: "/gamePics/seventeen.png",
      name: "Fra Mauro"
    }

  ];
  
  let currentRound = 0;
  let score = 0;
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swapping
    }
  }
  
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
          "/" +
          zoom +
          "/" +
          normalizedCoord.x +
          "/" +
          (bound - normalizedCoord.y - 1) +
          ".jpg"
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
  
    // Add a click event listener to the map
    google.maps.event.addListener(map, 'click', function (event) {
      if (!guessed) { // Only allow guess if player hasn't guessed yet
        checkGuess(event.latLng.lat(), event.latLng.lng());
        guessed = true; // Set the flag to true after the first guess
      }
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
  
  function initGame() {
    shuffleArray(lunarLocations); // Shuffle the locations randomly
  
    if (!document.getElementById("moon-image") || 
        !document.getElementById("score") || 
        !document.getElementById("result") || 
        !document.getElementById("next-round")) {
      console.error("Some game elements are missing from the DOM");
      return;
    }
  
    guessed = false; // Reset the guess flag
    loadRound();
    document.getElementById("next-round").addEventListener("click", loadRound);
  }
  
  function loadRound() {
    if (currentRound >= lunarLocations.length) {
      alert("Game over! Your final score is " + score);
      currentRound = 0;
      score = 0;
      document.getElementById("score").textContent = "0";
      shuffleArray(lunarLocations); // Shuffle again for the next game
    }
  
    const location = lunarLocations[currentRound];
    document.getElementById("moon-image").src = location.image;
    document.getElementById("moon-image").alt = "Lunar surface near " + location.name;
  
    document.getElementById("result").textContent = "";
    currentRound++;
  
    guessed = false; // Reset the guess flag for the new round
  }
  
  function checkGuess(latitude, longitude) {
    const roundData = lunarLocations[currentRound - 1];
    const distance = Math.sqrt(
      Math.pow(latitude - roundData.lat, 2) +
      Math.pow(longitude - roundData.lon, 2)
    );
  
    new google.maps.Marker({
      position: { lat: roundData.lat, lng: roundData.lon },
      map: map,
      title: roundData.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#00FF00",
        fillOpacity: 0.8,
        strokeWeight: 1
      }
    });
  
    new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: "Your guess",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#FF0000",
        fillOpacity: 0.8,
        strokeWeight: 1
      }
    });
  
    if (distance < 10) {
      score += 10;
      document.getElementById("result").textContent = "Correct! Well done.";
    } else {
      document.getElementById("result").textContent = `Incorrect! The correct location was (${roundData.lat}, ${roundData.lon}).`;
    }
  
    document.getElementById("score").textContent = score;
  
    map.setCenter({ lat: roundData.lat, lng: roundData.lon });
    map.setZoom(4);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    initMap();
    initGame();
  });