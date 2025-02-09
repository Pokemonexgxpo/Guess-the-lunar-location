
const API_URL = (lat, lon) => 
  `https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd/1.0.0/default/default0288/10/${lon}/${lat}.png`;

const lunarData = [
  { lat: 170, lon: 395 }, 
  { lat: 160, lon: 390 },
  { lat: 180, lon: 400 },
];

let currentRound = 0;
let score = 0;

const moonImage = document.getElementById("moon-image");
const scoreDisplay = document.getElementById("score");
const result = document.getElementById("result");
const nextRoundButton = document.getElementById("next-round");
const guessInput = document.getElementById("guess-coordinates");
const submitGuessButton = document.getElementById("submit-guess");

function initGame() {
  loadRound();
  nextRoundButton.addEventListener("click", loadRound);
  submitGuessButton.addEventListener("click", checkGuess);
}

async function loadRound() {
  if (currentRound >= lunarData.length) {
    alert("Game over! Your final score is " + score);
    return;
  }

  const roundData = lunarData[currentRound];
  const imageUrl = API_URL(roundData.lat, roundData.lon);

  moonImage.onload = () => console.log("Image loaded successfully:", imageUrl);
  moonImage.onerror = () => {
    console.error("Failed to load image:", imageUrl);
    moonImage.src = "https://moon.nasa.gov/system/resources/detail_files/251_PIA13517.jpg";
  };

  moonImage.src = imageUrl;
  moonImage.alt = "Lunar surface image";

  result.textContent = "";
  guessInput.value = "";
  currentRound++;
}

function checkGuess() {
  const userGuess = guessInput.value.split(",").map(Number);
  if (userGuess.length !== 2) {
    result.textContent = "Please enter valid coordinates (latitude, longitude).";
    return;
  }

  const roundData = lunarData[currentRound - 1];
  const distance = Math.sqrt(
    Math.pow(userGuess[0] - roundData.lat, 2) +
    Math.pow(userGuess[1] - roundData.lon, 2)
  );

  if (distance < 10) {
    score += 10;
    result.textContent = "Correct! Well done.";
  } else {
    result.textContent = "Incorrect! The correct location was (" + roundData.lat + ", " + roundData.lon + ").";
  }

  scoreDisplay.textContent = score;
}

initGame();