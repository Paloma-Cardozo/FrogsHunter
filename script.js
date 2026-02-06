const gameBoard = document.querySelector(".container");
const moves = document.querySelector(".moves");
const timer = document.querySelector(".timer");
const winner = document.querySelector(".winner");
const restartButton = document.querySelector(".button");
const defaultNumberOfPairs = 6;

let gameCards = [];

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

const cardFrontImageSrc = "Images/lotus-flower.png";

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

function createGame(defaultNumberOfPairs) {
  gameBoard.replaceChildren();

  const shuffleCards = shuffleArray([...availableCards]);

  const selectedCards = shuffleCards.slice(0, defaultNumberOfPairs);

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

restartButton.addEventListener("click", resetGame);
createGame(defaultNumberOfPairs);
