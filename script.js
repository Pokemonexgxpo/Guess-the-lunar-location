
const lunarLocations = [
  {
    lat: 0,
    lon: 23.47,
    image: "https://www.nasa.gov/wp-content/uploads/2019/07/as11-40-5903.jpg",
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
    image: "https://www.nasa.gov/wp-content/uploads/2019/11/apollolandingsites.jpg",
    name: "Hadley Rille"
  }
];

let currentRound = 0;

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

function loadRound() {
  if (currentRound >= lunarLocations.length) {
    alert("Game over! Your final score is " + score);
    return;
  }

  const location = lunarLocations[currentRound];
  moonImage.src = location.image;
  moonImage.alt = "Lunar surface near " + location.name;

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

  const roundData = lunarLocations[currentRound - 1];
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