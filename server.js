const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { EVENTS } = require("./constants/constants");

const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let gameStarted = false;

// Player 1
let player1 = null;
let score1 = 0;

// Player 2
let player2 = null;
let score2 = 0;

// Spectators
let allSpectators = [];

// Max Score
const MAX_SCORE = 5;

const resetScores = () => {
  score1 = 0;
  score2 = 0;
};

const clearParticipants = () => {
  player1 = null;
  player2 = null;
  allSpectators = [];
};

const resetGame = (io) => {
  gameStarted = false;
  // Reset Scores
  resetScores();
  clearParticipants();
  // Emit game reset event
  io.sockets.emit(EVENTS.GAME_RESET, "Game reset");
};

/**
 * Server Responsibilities
 */
// Manage Player Connections
// Manage Game State (source of truth)
io.on("connection", (socket) => {
  console.log("Someone's connected!");

  // Manage connections and assign roles
  if (!player1) {
    player1 = socket.id; // unique id with every socket
    socket.emit(EVENTS.ASSIGN_PLAYER, "Player 1");
    io.sockets.emit(EVENTS.PLAYERS_UPDATED, {
      player1: "Player 1",
      player2: "",
    });
  } else if (!player2) {
    player2 = socket.id;
    socket.emit(EVENTS.ASSIGN_PLAYER, "Player 2");

    io.sockets.emit(EVENTS.PLAYERS_UPDATED, {
      player1: "Player 1",
      player2: "Player 2",
    });

    gameStarted = true;
    io.sockets.emit(EVENTS.GAME_START, gameStarted);
  } else {
    allSpectators.push(socket.id);
    io.sockets.emit(EVENTS.PLAYERS_UPDATED, {
      player1: "Player 1",
      player2: "Player 2",
      allSpectators,
    });
    // For anyone else connecting assign as spectator
    socket.emit(EVENTS.ASSIGN_PLAYER, "Spectator");
  }

  // Game interactions/State
  socket.on(EVENTS.CLICKED, () => {
    if (!gameStarted) {
      socket.emit(EVENTS.GAME_NOT_STARTED);
    }
    if (gameStarted) {
      // Button Visibility
      io.sockets.emit(EVENTS.HIDE_BUTTON, { visible: false });

      // Wait for a random duration and then show the button
      const randomMs = () => Math.floor(Math.random() * 3000) + 1000;

      setTimeout(() => {
        const width = Math.floor(Math.random() * 100) + 50;
        const height = Math.floor(Math.random() * 100) + 50;

        const positionAndSize = {
          width: Math.floor(Math.random() * 100) + 50,
          height: Math.floor(Math.random() * 100) + 50,
          minWidth: "100px",
          left: Math.floor(Math.random() * (300 - width)),
          top: Math.floor(Math.random() * (500 - height)),
        };

        io.sockets.emit(EVENTS.SHOW_BUTTON, positionAndSize);
      }, randomMs());

      // Player Score
      if (socket.id === player1) {
        score1++;
        io.sockets.emit(EVENTS.CLICKED, "Player 1");
      } else if (socket.id === player2) {
        io.sockets.emit(EVENTS.CLICKED, "Player 2");
        score2++;
      }

      io.sockets.emit(EVENTS.UPDATE_SCORE, {
        player1: score1,
        player2: score2,
      });

      if (score1 >= MAX_SCORE || score2 >= MAX_SCORE) {
        const winner = score1 > score2 ? "Player 1" : "Player 2";
        const loser = score1 < score2 ? "Player 1" : "Player 2";

        io.sockets.emit(EVENTS.GAME_OVER, { winner, loser });
        resetGame(io);
      }
    }
  });

  // Handle disconnects
  socket.on(EVENTS.DISCONNECT, () => {
    console.log("Someone dropped...");

    // Remove players
    if (socket.id === player1) {
      player1 = null;
    } else if (socket.id === player2) {
      player2 = null;
    } else {
      allSpectators = allSpectators?.filter(
        (spectator) => spectator != socket.id
      );
    }

    io.sockets.emit(EVENTS.PLAYERS_UPDATED, {
      player1: player1 ? "Player 1" : "",
      player2: player2 ? "Player 2" : "",
      allSpectators,
    });

    if (player1 == null || player2 == null) {
      // The game cannot continue if a player disconnects. Reset everything.
      gameStarted = false;
      resetScores();

      io.sockets.emit(EVENTS.GAME_RESET, "Game Reset");
    }
  });
});

server.listen(port, () => console.log("Listening on port: ", port));

/**
 * Client Responsibilities
 */
// User interaction
// User interface and display
// Manage individual player state
// Check score with server
