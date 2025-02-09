
let map;

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

const lunarLocations = [
  {
    lat: 0,
    lon: 23.47,
    image: "https://www.nasa.gov/wp-content/uploads/2019/07/apollo11-landing-site.jpg",
    name: "Sea of Tranquility"
  },
  {
    lat: -3.01,
    lon: -23.42,
    image: "https://www.nasa.gov/wp-content/uploads/2019/07/apollo12-landing-site.jpg",
    name: "Ocean of Storms"
  },
  {
    lat: 26.13,
    lon: 3.63,
    image: "https://www.nasa.gov/wp-content/uploads/2019/07/apollo15-landing-site.jpg",
    name: "Hadley Rille"
  }
];

let currentRound = 0;
let score = 0;

// Get DOM elements
const moonImage = document.getElementById("moon-image");
const scoreDisplay = document.getElementById("score");
const result = document.getElementById("result");
const nextRoundButton = document.getElementById("next-round");
const guessInput = document.getElementById("guess-coordinates");
const submitGuessButton = document.getElementById("submit-guess");

function initGame() {
  // Wait for elements to be available
  setTimeout(() => {
    moonImage = document.getElementById("moon-image");
    scoreDisplay = document.getElementById("score");
    result = document.getElementById("result");
    nextRoundButton = document.getElementById("next-round");
    guessInput = document.getElementById("guess-coordinates");
    submitGuessButton = document.getElementById("submit-guess");

    if (moonImage && scoreDisplay && result && nextRoundButton && guessInput && submitGuessButton) {
      loadRound();
      nextRoundButton.addEventListener("click", loadRound);
      submitGuessButton.addEventListener("click", checkGuess);
    } else {
      console.error("Some game elements are missing from the DOM");
    }
  }, 100);
}

function loadRound() {
  if (currentRound >= lunarLocations.length) {
    alert("Game over! Your final score is " + score);
    currentRound = 0;
    score = 0;
    scoreDisplay.textContent = "0";
  }

  const location = lunarLocations[currentRound];
  moonImage.src = location.image;
  moonImage.alt = "Lunar surface near " + location.name;

  result.textContent = "";
  guessInput.value = "";
  currentRound++;
}

function checkGuess() {
  const userGuess = guessInput.value.split(",").map(num => parseFloat(num.trim()));
  if (userGuess.length !== 2 || isNaN(userGuess[0]) || isNaN(userGuess[1])) {
    result.textContent = "Please enter valid coordinates (latitude, longitude).";
    return;
  }

  const roundData = lunarLocations[currentRound - 1];
  const distance = Math.sqrt(
    Math.pow(userGuess[0] - roundData.lat, 2) +
    Math.pow(userGuess[1] - roundData.lon, 2)
  );

  // Show marker for correct location
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

  // Show marker for user's guess
  new google.maps.Marker({
    position: { lat: userGuess[0], lng: userGuess[1] },
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
    result.textContent = "Correct! Well done.";
  } else {
    result.textContent = `Incorrect! The correct location was (${roundData.lat}, ${roundData.lon}).`;
  }

  scoreDisplay.textContent = score;
  
  // Center map on correct location
  map.setCenter({ lat: roundData.lat, lng: roundData.lon });
  map.setZoom(4);
}

// Initialize the game when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initGame);
