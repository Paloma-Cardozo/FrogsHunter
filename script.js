const availableCards = [
  {
    name: "frog1",
    image: "Images/frog1.png",
    alt: "Smiling frog",
    color: "#ee76f8",
    matched: false,
  },
  {
    name: "frog2",
    image: "Images/frog2.png",
    alt: "Frog playing guitar",
    color: "#3a93f9",
    matched: false,
  },
  {
    name: "frog3",
    image: "Images/frog3.png",
    alt: "Frog with umbrella",
    color: "#f2ba49",
    matched: false,
  },
  {
    name: "frog4",
    image: "Images/frog4.png",
    alt: "Frog putting on makeup",
    color: "#5dcd5d",
    matched: false,
  },
  {
    name: "frog5",
    image: "Images/frog5.png",
    alt: "Dancing frog",
    color: "#db7866",
    matched: false,
  },
  {
    name: "frog6",
    image: "Images/frog6.png",
    alt: "Frog with a microphone",
    color: "#9566db",
    matched: false,
  },
  {
    name: "frog7",
    image: "Images/frog7.png",
    alt: "Frog with a walking stick",
    color: "#76f887",
    matched: false,
  },

  {
    name: "frog8",
    image: "Images/frog8.png",
    alt: "Frog eating",
    color: "#a476f8",
    matched: false,
  },
  {
    name: "frog9",
    image: "Images/frog9.png",
    alt: "Frog waving",
    color: "#fc6c56",
    matched: false,
  },
  {
    name: "frog10",
    image: "Images/frog10.png",
    alt: "Frog lying down",
    color: "#3d5fe3",
    matched: false,
  },
  {
    name: "frog11",
    image: "Images/frog11.png",
    alt: "Frog swimming",
    color: "#f876a6",
    matched: false,
  },
  {
    name: "frog12",
    image: "Images/frog12.png",
    alt: "Frog jumping",
    color: "#f2f876",
    matched: false,
  },
  {
    name: "frog13",
    image: "Images/frog13.png",
    alt: "Frog drinking a martini",
    color: "#768cf8",
    matched: false,
  },
  {
    name: "frog14",
    image: "Images/frog14.png",
    alt: "Singing frog",
    color: "#942e9e",
    matched: false,
  },
  {
    name: "frog15",
    image: "Images/frog15.png",
    alt: "Happy frog",
    color: "#3fe1f3",
    matched: false,
  },
  {
    name: "frog16",
    image: "Images/frog16.png",
    alt: "Frog saying goodbye",
    color: "#f87676",
    matched: false,
  },
  {
    name: "frog17",
    image: "Images/frog17.png",
    alt: "Frog sunbathing",
    color: "#f8e276",
    matched: false,
  },
  {
    name: "frog18",
    image: "Images/frog18.png",
    alt: "Frog catching a fish",
    color: "#8afd7b",
    matched: false,
  },
  {
    name: "frog19",
    image: "Images/frog19.png",
    alt: "Frog smelling a flower",
    color: "#43bef7",
    matched: false,
  },
  {
    name: "frog20",
    image: "Images/frog20.png",
    alt: "Frog playing a harmonica",
    color: "#fe67ae",
    matched: false,
  },
];

const cardFrontImageSrc = "Images/lotus-flower.png";

let moveCounter = 0;
let elapsedTime = 0;
let timerInterval = null;

const gameBoard = document.querySelector(".container");

let gameCards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;
let matchedCount = 0;

function startGame(numberOfPairs) {
  gameBoard.innerHTML = "";

  const shuffleCards = shuffleArray([...availableCards]);

  const selectedCards = shuffleCards.slice(0, numberOfPairs);

  gameCards = shuffleArray([...selectedCards, ...selectedCards]);

  renderGameBoard();
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function renderGameBoard() {
  gameCards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = "flip-card";

    const cardInner = document.createElement("div");
    cardInner.className = "flip-card-inner";
    cardInner.dataset.name = card.name;

    const cardFront = document.createElement("div");
    cardFront.className = "flip-card-front";

    const cardFrontImage = document.createElement("img");
    cardFrontImage.src = cardFrontImageSrc;
    cardFrontImage.alt = "Lotus Flower";

    const cardBack = document.createElement("div");
    cardBack.className = "flip-card-back";
    cardBack.style.backgroundColor = card.color;

    const cardBackImage = document.createElement("img");
    cardBackImage.src = card.image;
    cardBackImage.alt = card.alt;

    cardFront.appendChild(cardFrontImage);
    cardBack.appendChild(cardBackImage);
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardElement.appendChild(cardInner);
    gameBoard.appendChild(cardElement);

    cardInner.addEventListener("click", flipCard);
  });
}

function flipCard() {
  if (!timerInterval) startTimer();
  if (lockBoard) return;
  if (this.classList.contains("flipped") || this.classList.contains("matched"))
    return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  incrementMoves();

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
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

  
  matchedCount = (typeof matchedCount === "undefined" ? 0 : matchedCount) + 2;
  if (typeof gameCards !== "undefined" && matchedCount === gameCards.length) {
    clearInterval(timerInterval);
    timerInterval = null;
    const winnerEl = document.querySelector(".winner");
    if (winnerEl) winnerEl.style.display = "flex";
  }

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(function () {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `Time: ${mins}min ${secs}s`;
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    elapsedTime++;
    document.querySelector(".timer").textContent = formatTime(elapsedTime);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function incrementMoves() {
  moveCounter++;
  document.querySelector(".moves").textContent = `Moves: ${moveCounter}`;
}

document.querySelector(".button").addEventListener("click", () => {
  startGame(6);
  moveCounter = 0;
  elapsedTime = 0;
  document.querySelector(".moves").textContent = "Moves: 0";
  document.querySelector(".timer").textContent = formatTime(0);
  document.querySelector(".winner").style.display = "visible";
});

startGame(6);
