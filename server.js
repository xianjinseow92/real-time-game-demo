const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { EVENTS } = require("./constants/constants");

const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let gameStarted = false;
let player1 = null;
let score1 = 0;
let player2 = null;
let score2 = 0;

/**
 * Server Responsibilities
 */
// Manage Player Connections
// Manage Game State (source of truth)
// Mange Broadcast Events!
io.on("connection", (socket) => {
  console.log("Someone's connected!");

  // Manage connections and assign roles
  if (!player1) {
    player1 = socket.id; // unique id with every socket
    socket.emit(EVENTS.ASSIGN_PLAYER, "Player 1");
  } else if (!player2) {
    player2 = socket.id;
    socket.emit(EVENTS.ASSIGN_PLAYER, "Player 2");
    gameStarted = true;
    io.sockets.emit(EVENTS.GAME_START, "Let the games begin!");
  } else {
    // For anyone else connecting assign as spectator
    socket.emit(EVENTS.ASSIGN_SPECTATOR, "Spectator");
  }

  // Game interactions
  socket.on(EVENTS.CLICKED, () => {
    if (gameStarted) {
      if (socket.id === player1) {
        score1++;
        io.sockets.emit(EVENTS.UPDATE_SCORE, "Player 1 Scored");
      } else if (socket.id === player2) {
        score2++;
        io.sockets.emit(EVENTS.UPDATE_SCORE, "Player 2 Scored");
      }
    }
  });

  // Close game
  socket.on(EVENTS.GAME_OVER, () => {
    gameStarted = false;
    // Clear players
    player1 = null;
    player2 = null;
    io.sockets.emit(EVENTS.GAME_RESET, "Game reset");
  });

  // Handle disconnects
  socket.on(EVENTS.DISCONNECT, () => {
    console.log("Someone dropped...");

    // Remove players
    if (socket.id === player1) {
      player1 = null;
    } else if (socket.id === player2) {
      player2 = null;
    }

    if (player1 == null || player2 == null) {
      // The game cannot continue if a player disconnects. Reset everything.
      gameStarted = false;
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
