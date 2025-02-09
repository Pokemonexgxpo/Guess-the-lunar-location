
const lunarLocations = [
  {
    lat: 0,
    lon: 23.47,
    image: "https://www.hq.nasa.gov/alsj/a11/AS11-40-5903HR.jpg",
    name: "Sea of Tranquility"
  },
  {
    lat: -3.01,
    lon: -23.42,
    image: "https://www.hq.nasa.gov/alsj/a12/AS12-47-6897HR.jpg",
    name: "Ocean of Storms"
  },
  {
    lat: 26.13,
    lon: 3.63,
    image: "https://www.hq.nasa.gov/alsj/a15/AS15-87-11849HR.jpg",
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
  if (moonImage && scoreDisplay && result && nextRoundButton && guessInput && submitGuessButton) {
    loadRound();
    nextRoundButton.addEventListener("click", loadRound);
    submitGuessButton.addEventListener("click", checkGuess);
  } else {
    console.error("Some game elements are missing from the DOM");
  }
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

  if (distance < 10) {
    score += 10;
    result.textContent = "Correct! Well done.";
  } else {
    result.textContent = `Incorrect! The correct location was (${roundData.lat}, ${roundData.lon}).`;
  }

  scoreDisplay.textContent = score;
}

// Initialize the game when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initGame);
