const gameBoard = document.querySelector(".container");
const moves = document.querySelector(".moves");
const timer = document.querySelector(".timer");
const winner = document.querySelector(".winner");
const timeout = document.querySelector(".timeout");
const buttons = document.querySelectorAll(".button");
const levelButtons = document.querySelectorAll(".level-btn");


const defaultNumberOfPairs = 6;
let currentPairs = defaultNumberOfPairs;

const cardFrontImageSrc = "Images/lotus-flower.png";

const levelSettings = {
  6: 60,
  8: 90,
  10: 120
};

let gameCards = [];
let timeLeft = levelSettings[currentPairs];
let moveCounter = 0;
let timerInterval = null;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;

async function fetchCards() {
  try {
    const response = await fetch("/cards");
    if (!response.ok) throw new Error("Failed to fetch cards");

    return await response.json();
  } catch (error) {
    console.error("API error:", error);

    return [];
  }
}

function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function createElement(tag, className, attributes = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;

  Object.entries(attributes).forEach(([key, value]) => {
    element[key] = value;
  });

  return element;
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (totalSeconds % 60).toString().padStart(2, "0");

  return `Time left: ${mins}:${secs}`;
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    timeLeft--;
    timer.textContent = formatTime(timeLeft);

    if (timeLeft <= 0) {
      stopTimer();
      showTimeout();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function showTimeout() {
  lockBoard = true;
  timeout.style.display = "flex";
}

function incrementMoves() {
  moveCounter++;
  moves.textContent = `Reveals: ${moveCounter}`;
}

function revealCard(card) {
  card.classList.add("flipped");
  incrementMoves();
}

function flipCard(card) {
  if (lockBoard) return;
  if (card === firstCard) return;
  if (card.classList.contains("flipped") || card.classList.contains("matched"))
    return;

  revealCard(card);

  if (!timerInterval) startTimer();

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = card;

    return;
  }

  secondCard = card;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  lockBoard = true;

  setTimeout(() => {
    firstCard.style.transform = "scale(0.5) rotateY(180deg)";
    secondCard.style.transform = "scale(0.5) rotateY(180deg)";
    firstCard.style.opacity = "0";
    secondCard.style.opacity = "0";

    if (
      document.querySelectorAll(".flip-card-inner.matched").length ===
      gameCards.length
    ) {
      stopTimer();
      showWinner();
    }

    resetBoard();
  }, 1000);
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function setGridColumns(numberOfPairs = defaultNumberOfPairs) {
  const isMobile = window.innerWidth <= 600;
  let columns;

  if (isMobile) {
    columns = 4;
  } else {
  if (numberOfPairs <= 8) columns = 4;
  else if (numberOfPairs <= 10) columns = 5;
  else columns = 6;
  }

  gameBoard.style.setProperty("--columns", columns);
}

function renderGameBoard() {
  gameCards.forEach((card) => {
    const cardElement = createElement("div", "flip-card");
    const cardInner = createElement("div", "flip-card-inner");
    const cardFront = createElement("div", "flip-card-front");
    const cardBack = createElement("div", "flip-card-back");

    cardInner.dataset.name = card.name;
    cardBack.style.backgroundColor = card.color;

    const cardFrontImage = createElement("img", null, {
      src: cardFrontImageSrc,
      alt: "Lotus Flower",
    });

    const cardBackImage = createElement("img", null, {
      src: card.image,
      alt: card.alt,
    });

    cardFront.appendChild(cardFrontImage);
    cardBack.appendChild(cardBackImage);
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardElement.appendChild(cardInner);
    gameBoard.appendChild(cardElement);

    cardInner.addEventListener("click", () => flipCard(cardInner));
  });
}

async function createGame(numberOfPairs) {
  gameBoard.replaceChildren();
  winner.style.display = "none";
  timeout.style.display = "none";

  lockBoard = false; 
  hasFlippedCard = false;
  firstCard = null;
  secondCard = null;

  gameCards = [];
  moveCounter = 0;

  timeLeft = levelSettings[numberOfPairs]; 

  moves.textContent = `Reveals: 0`;
  timer.textContent = formatTime(timeLeft);
  stopTimer();

  setGridColumns(numberOfPairs);

  const cardsApi = await fetchCards();
  if (cardsApi.length === 0) return;

  const shuffleCards = shuffleArray([...cardsApi]);
  const selectedCards = shuffleCards.slice(0, numberOfPairs);
  gameCards = shuffleArray([...selectedCards, ...selectedCards]);

  renderGameBoard();
}

function showWinner() {
  const movesText = moves.textContent;
  const timerText = timer.textContent;

  const winnerMoves = winner.querySelector(".winner-moves");
  const winnerTime = winner.querySelector(".winner-time");

  if (winnerMoves) winnerMoves.textContent = movesText;
  if (winnerTime) winnerTime.textContent = timerText;

  winner.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {
  levelButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPairs = parseInt(btn.dataset.pairs, 10);

      levelButtons.forEach((level) => level.classList.remove("active"));
      btn.classList.add("active");

      createGame(currentPairs);
    });
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      createGame(currentPairs);
    });
  });

  moves.textContent = `Reveals: 0`;
  timer.textContent = formatTime(timeLeft);
  createGame(currentPairs);
});

window.addEventListener("resize", () => {
  setGridColumns(currentPairs);
});
