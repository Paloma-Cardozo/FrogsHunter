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
  10: 120,
};

let gameCards = [];
let timeLeft = levelSettings[defaultNumberOfPairs];
let endTime = null;
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

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
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

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetBoard() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}

function showTimeout() {
  lockBoard = true;
  resetBoard();
  timeout.style.display = "flex";
}

function startTimer() {
  if (timerInterval) return;

  endTime = Date.now() + timeLeft * 1000;

  timerInterval = setInterval(() => {
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

    timer.textContent = formatTime(remaining);

    if (remaining === 0) {
      stopTimer();
      showTimeout();
    }
  }, 250);
}

function incrementMoves() {
  moveCounter++;
  moves.textContent = `Reveals: ${moveCounter}`;
}

function revealCard(card) {
  card.classList.add("flipped");
  incrementMoves();
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
  lockBoard = true;

  const handleTransitionEnd = (e) => {
    if (e.propertyName !== "transform") return;

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    secondCard.removeEventListener("transitionend", handleTransitionEnd);

    const matchedCards = document.querySelectorAll(
      ".flip-card-inner.matched",
    ).length;

    if (matchedCards === gameCards.length) {
      stopTimer();
      showWinner();
    }

    resetBoard();
  };

  secondCard.addEventListener("transitionend", handleTransitionEnd);
}

function showWinner() {
  lockBoard = true;

  const winnerMoves = winner.querySelector(".winner-moves");
  const winnerTime = winner.querySelector(".winner-time");

  if (winnerMoves) winnerMoves.textContent = moves.textContent;
  if (winnerTime) winnerTime.textContent = timer.textContent;

  winner.style.display = "flex";
}

function flipCard(card) {
  if (
    lockBoard ||
    card === firstCard ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  )
    if (
      lockBoard ||
      card === firstCard ||
      card.classList.contains("flipped") ||
      card.classList.contains("matched")
    )
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

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    resetBoard();
  }, 1200);
}

function setGridColumns(numberOfPairs = defaultNumberOfPairs) {
  let columns = 4;
  if (numberOfPairs === 10) columns = 5;

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

  stopTimer();
  resetBoard();

  moveCounter = 0;
  moves.textContent = `Reveals: 0`;

  gameCards = [];

  if (levelSettings[numberOfPairs] !== undefined) {
    timeLeft = levelSettings[numberOfPairs];
  } else {
    timeLeft = 60;
  }

  timer.textContent = formatTime(timeLeft);

  setGridColumns(numberOfPairs);

  const cards = await fetchCards();
  if (cards.length === 0) return;
  const shuffleCards = shuffleArray([...cards]);
  const selectedCards = shuffleCards.slice(0, numberOfPairs);
  gameCards = shuffleArray([...selectedCards, ...selectedCards]);

  renderGameBoard();
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

  createGame(currentPairs);
});
