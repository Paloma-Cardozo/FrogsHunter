# 🐸 Frog Hunter – Memory Game

Frog Hunter is a browser-based memory game developed as part of the **Foundation Project at Hack Your Future**.

The game is inspired by the classic Memory Game and challenges players to find all matching pairs of cards by flipping them two at a time.
Our focus is on making the game work and building a smooth, intuitive, and enjoyable experience that encourages players to keep playing.

This project is developed incrementally, following a sprint-based approach, where functionality, structure, and complexity grow step by step.

---

## 🎮 About the Game

In Frog Hunter, players interact with a grid of cards showing frog-themed images.

- Cards start face down
- Players flip cards to reveal the images
- Only two cards can be revealed at the same time
- Matching cards remain revealed
- Non-matching cards flip back after a short delay
- The game ends once all matching pairs have been found
- The timer starts from when the player clicks their first card
- The counter shows how many times the player has revealed a card

Display a timer should start from when the player clicks their first card.

The game logic and interactions are designed to be clear, responsive, and easy to understand.

---

## 🛠️ Technologies & Approach

This project is built using:

**Frontend Technologies**
- **HTML** for structure
- **CSS** for layout and animations
- **JavaScript** for game logic and DOM manipulation

**Backend Technologies**
- **Node.js** for server-side code
- **Express.js** for building the API server
- **SQLite** for data persistence

**Development Tools**
- **Git & GitHub** - Version control and collaboration
- **npm (Node Package Manager)** - Dependency management and script running
- **VS Code** - Code editor with built-in Git integration

**Project Architecture**
- **Client-Server Model** - Separation of frontend (client) and backend (server)
- **RESTful API** - Communication between frontend and backend
- **File-based Database** - SQLite database stored as database.db

As part of the project milestones, the game evolves from a fully frontend-based implementation to a version that includes:

- Fetching card data from a backend API
- Storing card information in a database

These steps are introduced progressively as the project advances through the sprints.

---

## 📂 Project Structure
```
/frogHunter
├── app/
│   ├── Images/            
│   ├── index.html
│   ├── style.css
│   └── script.js
└── server/             
    ├── package.json    
    ├── index.js        
    └── database.db 
```

The structure is intentionally simple, allowing us to focus on core concepts such as game logic, state handling, and user interaction.

---

## 👩🏻‍💻👩🏼‍💻 Team

This project is developed as a pair-programming exercise, emphasizing collaboration, communication, and shared ownership of the codebase:

- **Paloma Cardozo**
- **Iryna Lopatina**
