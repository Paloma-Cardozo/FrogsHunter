const gameBoard = document.querySelector(".container");
const moves = document.querySelector(".moves");
const timer = document.querySelector(".timer");
const winner = document.querySelector(".winner");
const restartButton = document.querySelector(".button");
const defaultNumberOfPairs = 6;

let gameCards = [];
let cards = [];

const game = {
  gameStarted: false,
  totalReveals: 0,
  totalTime: 0,
  timerInterval: null,
  firstCard: null,
  secondCard: null,
  lockBoard: false,
  matchedPairs: 0,
};

const cardFrontImageSrc = "images/lotus-flower.png";

async function fetchCards() {
  try {
    const response = await fetch("http://localhost:3000/cards");
    const fetchedCards = await response.json();
    console.log("Fetched cards:", fetchedCards.length);
    return fetchedCards;
  } catch (error) {
    console.error("Error fetching cards:", error);
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

  if (className) {
    element.className = className;
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element[key] = value;
  });

  return element;
}

function revealCard(card) {
  card.classList.add("flipped");
  game.totalReveals++;
  moves.textContent = `Reveals: ${game.totalReveals}`;
}

function startGame() {
  game.gameStarted = true;
  game.timerInterval = setInterval(() => {
    game.totalTime++;

    timer.textContent = `Time: ${game.totalTime} s`;
  }, 1000);
}

function flipCard(card) {
  if (game.lockBoard) return;
  if (card === game.firstCard) return;
  if (card.classList.contains("flipped")) return;

  revealCard(card);

  if (!game.gameStarted) {
    startGame();
  }

  if (!game.firstCard) {
    game.firstCard = card;
    return;
  }

  game.secondCard = card;
  checkForMatch();
}

function endGame() {
  clearInterval(game.timerInterval);
  winner.style.display = "block";
}

function resetBoard() {
  game.lockBoard = false;
  game.firstCard = null;
  game.secondCard = null;
}

function disableCards() {
  game.firstCard.removeEventListener("click", flipCard);
  game.secondCard.removeEventListener("click", flipCard);

  game.matchedPairs++;

  if (game.matchedPairs === gameCards.length / 2) {
    endGame();
  }

  resetBoard();
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
      src: card.image_url,
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

function unflipCards() {
  game.lockBoard = true;

  setTimeout(function () {
    game.firstCard.classList.remove("flipped");
    game.secondCard.classList.remove("flipped");
    resetBoard();
  }, 1500);
}

function checkForMatch() {
  const isMatch = game.firstCard.dataset.name === game.secondCard.dataset.name;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function createGame(numberOfPairs) {
  gameBoard.replaceChildren();

  const shuffleCards = shuffleArray([...cards]);
  const selectedCards = shuffleCards.slice(0, numberOfPairs);
  gameCards = shuffleArray([...selectedCards, ...selectedCards]);

  renderGameBoard();
}

function resetGame() {
  clearInterval(game.timerInterval);

  game.gameStarted = false;
  game.totalReveals = 0;
  game.totalTime = 0;
  game.matchedPairs = 0;

  moves.textContent = `Reveals: 0`;
  timer.textContent = `Time: 0 s`;
  winner.style.display = "none";

  resetBoard();
  createGame(defaultNumberOfPairs);
}

async function initGame() {
  console.log("Initializing game...");
  cards = await fetchCards();

  if (cards && cards.length > 0) {
    console.log("Cards loaded successfully:", cards.length);
    createGame(defaultNumberOfPairs);
  } else {
    console.error("Failed to load cards");
  }
}

restartButton.addEventListener("click", resetGame);
createGame(defaultNumberOfPairs);

initGame();
