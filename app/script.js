const gameBoard = document.querySelector(".container");
const moves = document.querySelector(".moves");
const timer = document.querySelector(".timer");
const winner = document.querySelector(".winner");
const timeout = document.querySelector(".timeout");
const buttons = document.querySelectorAll(".button");
const levelButtons = document.querySelectorAll(".level-btn");

const levelSettings = {
  easy: { pairs: 6, time: 60, columns: 4 },
  medium: { pairs: 8, time: 90, columns: 4 },
  hard: { pairs: 10, time: 120, columns: 5 },
};

let defaultLevel = "easy";

const cardFrontImageSrc = "Images/lotus-flower.png";

const timerSettings = {
  milliseconds: 1000,
  updateFrequency: 250,
  flipBackDelay: 1200,
  matchedDelay: 800,
  hiddenDelay: 400,
};

let gameCards = [];
let timeLeft = levelSettings[defaultLevel].time;
let endTime = null;
let moveCounter = 0;
let timerInterval = null;

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
  firstCard = null;
  secondCard = null;
}

function showTimeout() {
  lockBoard = true;
  resetBoard();

  timeout.style.display = "flex";
  timeout.setAttribute("aria-hidden", "false");
}

function startTimer() {
  if (timerInterval) return;

  endTime = Date.now() + timeLeft * timerSettings.milliseconds;

  timerInterval = setInterval(() => {
    const remaining = Math.max(
      0,
      Math.ceil((endTime - Date.now()) / timerSettings.milliseconds),
    );

    timer.textContent = formatTime(remaining);

    if (remaining === 0) {
      stopTimer();
      showTimeout();
    }
  }, timerSettings.updateFrequency);
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
    lockBoard = true;

    setTimeout(() => {
      disableCards();
    }, timerSettings.hiddenDelay);
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add("matched", "matched-anim");
  secondCard.classList.add("matched", "matched-anim");

  setTimeout(() => {
    const matchedCards = document.querySelectorAll(
      ".flip-card-inner.matched",
    ).length;

    if (matchedCards === gameCards.length) {
      stopTimer();
      showWinner();
    }

    resetBoard();
    lockBoard = false;
  }, timerSettings.matchedDelay);
}

function showWinner() {
  lockBoard = true;

  const winnerMoves = winner.querySelector(".winner-moves");
  const winnerTime = winner.querySelector(".winner-time");

  if (winnerMoves) winnerMoves.textContent = moves.textContent;
  if (winnerTime) winnerTime.textContent = timer.textContent;

  winner.style.display = "flex";
  winner.setAttribute("aria-hidden", "false");
}

function flipCard(card) {
  if (
    lockBoard ||
    card === firstCard ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    return;
  }

  revealCard(card);

  if (!timerInterval) startTimer();

  if (!firstCard) {
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
    lockBoard = false;
  }, timerSettings.flipBackDelay);
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

function hideModals() {
  winner.style.display = "none";
  winner.setAttribute("aria-hidden", "true");

  timeout.style.display = "none";
  timeout.setAttribute("aria-hidden", "true");
}

async function createGame(level = defaultLevel) {
  document.body.classList.remove("level-easy", "level-medium", "level-hard");
  document.body.classList.add(`level-${level}`);

  const config = levelSettings[level];

  gameBoard.replaceChildren();

  winner.style.display = "none";
  winner.setAttribute("aria-hidden", "true");

  timeout.style.display = "none";
  timeout.setAttribute("aria-hidden", "true");

  stopTimer();
  resetBoard();
  lockBoard = true;

  moveCounter = 0;
  moves.textContent = `Reveals: 0`;
  gameCards = [];

  timeLeft = config.time;
  timer.textContent = formatTime(timeLeft);

  const cardsApi = await fetchCards();
  if (cardsApi.length === 0) return;

  const shuffledCards = shuffleArray([...cardsApi]);
  const selectedCards = shuffledCards.slice(0, config.pairs);
  gameCards = shuffleArray([...selectedCards, ...selectedCards]);

  renderGameBoard();
  hideModals();
  lockBoard = false;
}

function updateActiveLevel(selectedBtn) {
  levelButtons.forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed", "false");
  });

  selectedBtn.classList.add("active");
  selectedBtn.setAttribute("aria-pressed", "true");
}

function getCurrentLevel() {
  const activeBtn = document.querySelector(".level-btn.active");

  if (!activeBtn) {
    return defaultLevel;
  }

  return activeBtn.dataset.level;
}

function initializeGame() {
  levelButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      updateActiveLevel(btn);
      createGame(btn.dataset.level);
    });
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      createGame(getCurrentLevel());
    });
  });

  createGame(getCurrentLevel());
}

document.addEventListener("DOMContentLoaded", initializeGame);
