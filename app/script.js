const gameBoard = document.querySelector(".container");
const moves = document.querySelector(".moves");
const timer = document.querySelector(".timer");
const winner = document.querySelector(".winner");
const restartButton = document.querySelector(".button");

const defaultNumberOfPairs = 6;
const cardFrontImageSrc = "Images/lotus-flower.png";

let gameCards = [];
let elapsedTime = 0;
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
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const secs = (totalSeconds % 60).toString().padStart(2, '0');
  return `Time: ${mins}:${secs}`;
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    elapsedTime++;
    timer.textContent = formatTime(elapsedTime);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
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

  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  if (
    document.querySelectorAll(".flip-card-inner.matched").length ===
    gameCards.length
  ) {
    stopTimer();
    showWinner();
  }

  resetBoard();
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
    columns = 3;
  } else {
    if (numberOfPairs <= 6) columns = 4;
    else if (numberOfPairs <= 8) columns = 4;
    else if (numberOfPairs <= 9) columns = 3;
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
  gameCards = [];
  elapsedTime = 0;
  moveCounter = 0;

  moves.textContent = `Reveals: 0`;
  timer.textContent = formatTime(0);
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

restartButton.addEventListener("click", () => {
  createGame(defaultNumberOfPairs);
});

window.addEventListener("resize", () => {
  const currentPairs = gameCards.length > 0 ? gameCards.length / 2 : defaultNumberOfPairs;
  setGridColumns(currentPairs);
});

document.addEventListener("DOMContentLoaded", () => {
  moves.textContent = `Reveals: 0`;
  timer.textContent = formatTime(0);
  createGame(defaultNumberOfPairs);
});
