const board = ["pink", "blue", "red", "purple", "orange"];
const myBoard = [];
const tempBoard = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2,
  2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 3, 2, 2, 2, 2, 2, 2, 1, 1, 2,
  1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1,
  2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];
const keyz = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
};
const ghosts = [];
const g = {
  x: "",
  y: "",
  h: 50,
  size: 20,
  ghosts: 3,
  inplay: false,
  startGhost: 11,
};
const player = {
  pos: 32,
  speed: 6,
  cool: 0,
  pause: false,
  score: 0,
  lives: 1,
  level: 1,
  gameover: true,
  gamewin: false,
  powerup: false,
  powerCount: 0,
};
const player2 = {
  pos: 32,
  speed: 6,
  cool: 0,
  pause: false,
  level: 1,
  gameover: true,
  gamewin: false,
  powerup: false,
  powerCount: 0,
};

const startGame = document.querySelector(".btn");

///  --------- EVENT LISTENERS ---------
document.addEventListener("DOMContentLoaded", () => {
  g.grid = document.querySelector(".grid"); // this is the game board
  g.pacman = document.querySelector(".pacman"); // this is the pacman
  g.eye = document.querySelector(".eye");
  g.mouth = document.querySelector(".mouth");
  g.pacman2 = document.querySelector(".pacman2");
  g.eye2 = document.querySelector(".eye2");
  g.mouth2 = document.querySelector(".mouth2");
  g.ghost = document.querySelector(".ghost");
  g.score = document.querySelector(".score");
  g.lives = document.querySelector(".lives");
  g.level = document.querySelector(".level");

  g.pacman.style.display = "none";
  g.pacman2.style.display = "none";
  g.ghost.style.display = "none";
  g.grid.style.display = "none";
});

document.addEventListener("keydown", (e) => {
  if (e.code in keyz) {
    keyz[e.code] = true;
  }
  if (!g.inplay && !player.pause) {
    player.play = requestAnimationFrame(move);
    g.inplay = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code in keyz) {
    keyz[e.code] = false;
  }
});

startGame.addEventListener("click", boardBuilder);
function boardBuilder() {
  tempBoard.length = 0;
  let boxSize =
    document.documentElement.clientHeight < document.documentElement.clientWidth
      ? document.documentElement.clientHeight
      : document.documentElement.clientWidth;
  g.h = boxSize / g.size - boxSize / (g.size * 3.5);
  let tog = false;
  for (let x = 0; x < g.size; x++) {
    let wallz = 0;
    for (let y = 0; y < g.size; y++) {
      let val = 2;
      wallz--;
      if (wallz > 0 && (x - 1) % 2) {
        val = 1;
      } else {
        wallz = Math.floor(Math.random() * (g.size / 2));
      }
      if (x == 1 || x == g.size - 3 || y == 1 || y == g.size - 2) {
        val = 2; // place dots
      }
      if (x == g.size - 2) {
        if (!tog) {
          g.startGhost = tempBoard.length;
          tog = true;
        }
        val = 4;
      }
      if (y == 3 || y == g.size - 4) {
        if (x == 1 || x == g.size - 3) {
          val = 3;
        }
      }
      if (x == 0 || x == g.size - 1 || y == 0 || y == g.size - 1) {
        val = 1;
      }
      tempBoard.push(val);
    }
  }
  starterGame();
}

/// --------- MAIN GAMEPLAY ---------
function move() {
  if (g.inplay) {
    player.cool--; // player cool(slow)down
    player2.cool--;
    if (player.cool < 0 || player2.cool < 0) {
      // Placing movement of ghosts
      let tempPower = 0;
      // Player1
      if (player.powerup) {
        player.powerCount--;
        g.pacman.style.backgroundColor = "red";
        if (player.powerCount < 20) {
          g.pacman.style.backgroundColor = "orange";
          if (player.powerCount % 2) {
            g.pacman.style.backgroundColor = "white";
          }
        }
        if (player.powerCount <= 0) {
          player.powerup = false;
          g.pacman.style.backgroundColor = "yellow";
          tempPower = 1;
        }
      }
      let tempPower2 = 0;
      // Player2
      if (player2.powerup) {
        player2.powerCount--;
        g.pacman2.style.backgroundColor = "red";
        if (player2.powerCount < 20) {
          g.pacman2.style.backgroundColor = "orange";
          if (player2.powerCount % 2) {
            g.pacman2.style.backgroundColor = "white";
          }
        }
        if (player2.powerCount <= 0) {
          player2.powerup = false;
          g.pacman2.style.backgroundColor = "rgb(64, 226, 43)";
          tempPower2 = 1;
        }
      }
      ghosts.forEach((ghost) => {
        if (tempPower == 1 || tempPower2 == 1) {
          ghost.style.backgroundColor = ghost.defaultColor;
        } else if (player.powerCount > 0 || player2.powerCount > 0) {
          if (player.powerCount % 2 || player2.powerCount % 2) {
            ghost.style.backgroundColor = "white";
          } else {
            ghost.style.backgroundColor = "teal";
          }
        }
        myBoard[ghost.pos].append(ghost);
        ghost.counter--;

        let oldPos = ghost.pos; //original position of the ghost

        if (ghost.counter <= 0) {
          changeDir(ghost);
        } else {
          if (ghost.direction == 0) {
            ghost.pos -= g.size;
          } else if (ghost.direction == 1) {
            ghost.pos += g.size;
          } else if (ghost.direction == 2) {
            ghost.pos += 1;
          } else if (ghost.direction == 3) {
            ghost.pos -= 1;
          }
        }
        // Player1
        if (player.pos == ghost.pos) {
          if (player.powerCount > 0) {
            // You ate the ghost
            player.score += 100;
            ghost.stopped = 100;
            ghost.pos = g.startGhost;
          } else {
            player.lives--;
            gameReset();
          }
          updateScore();
        }

        // Player2
        if (player2.pos == ghost.pos) {
          if (player2.powerCount > 0) {
            // You ate the ghost
            player.score += 100;
            ghost.stopped = 100;
            ghost.pos = g.startGhost;
          } else {
            player.lives--;
            gameReset();
          }
          updateScore();
        }

        let valGhost = myBoard[ghost.pos]; //future position of the ghost
        if (valGhost.t == 1) {
          ghost.pos = oldPos;
          changeDir(ghost);
        }
        if (ghost.stopped > 0) {
          ghost.stopped--;
          ghost.pos = startPosPlayer(g.startGhost);
        }
        myBoard[ghost.pos].append(ghost);
      });

      // Keyboard events: movement of the players
      // Player1
      let tempPos = player.pos; // current position
      if (keyz.ArrowRight) {
        player.pos += 1;
        g.eye.style.left = "20%";
        g.mouth.style.left = "60%";
      } else if (keyz.ArrowLeft) {
        player.pos -= 1;
        g.eye.style.left = "60%";
        g.mouth.style.left = "0%";
      } else if (keyz.ArrowUp) {
        player.pos -= g.size;
      } else if (keyz.ArrowDown) {
        player.pos += g.size;
      }
      // selecting the future position
      let newPlace = myBoard[player.pos];
      if (newPlace.t == 1 || newPlace.t == 4) {
        player.pos = tempPos;
      }
      // powerup
      if (newPlace.t == 3) {
        player.powerCount = 100;
        player.powerup = true;
        myBoard[player.pos].innerHTML = "";
        player.score += 10;
        updateScore();
        newPlace.t = 0;
      }
      if (newPlace.t == 2) {
        // dot eaten
        myBoard[player.pos].innerHTML = "";
        // dots left
        let tempDots = document.querySelectorAll(".dot");
        if (tempDots.length == 0) {
          playerWins();
        }
        player.score++;
        updateScore();
        newPlace.t = 0;
      }
      if (player.pos != tempPos) {
        // check if pacmen moved
        // Open and close mouth function
        if (player.tog) {
          g.mouth.style.height = "25%";
          player.tog = false;
        } else {
          g.mouth.style.height = "10%";
          player.tog = true;
        }
      }
      player.cool = player.speed; // set cooldown

      // Player2
      let tempPos2 = player2.pos; // current position
      if (keyz.KeyD) {
        player2.pos += 1;
        g.eye2.style.left = "20%";
        g.mouth2.style.left = "60%";
      } else if (keyz.KeyA) {
        player2.pos -= 1;
        g.eye2.style.left = "60%";
        g.mouth2.style.left = "0%";
      } else if (keyz.KeyW) {
        player2.pos -= g.size;
      } else if (keyz.KeyS) {
        player2.pos += g.size;
      }

      // selecting the future position
      let newPlace2 = myBoard[player2.pos];
      if (newPlace2.t == 1 || newPlace2.t == 4) {
        player2.pos = tempPos2;
      }
      // powerup
      if (newPlace2.t == 3) {
        player2.powerCount = 100;
        player2.powerup = true;
        myBoard[player2.pos].innerHTML = "";
        player.score += 10;
        updateScore();
        newPlace2.t = 0;
      }
      if (newPlace2.t == 2) {
        // dot eaten
        myBoard[player2.pos].innerHTML = "";
        // dots left
        let tempDots = document.querySelectorAll(".dot");
        if (tempDots.length == 0) {
          playerWins();
        }
        player.score++;
        updateScore();
        newPlace2.t = 0;
      }
      if (player2.pos != tempPos2) {
        // check if pacmen moved
        // Open and close mouth function
        if (player2.tog) {
          g.mouth2.style.height = "25%";
          player2.tog = false;
        } else {
          g.mouth2.style.height = "10%";
          player2.tog = true;
        }
      }
      player2.cool = player2.speed; // set cooldown
    }
    if (!player.pause || !player2.pause) {
      myBoard[player.pos].append(g.pacman);
      myBoard[player2.pos].append(g.pacman2);
      player.play = requestAnimationFrame(move);
    }
  }
}

///  --------- STARTING AND RESTARTING ---------
function starterGame() {
  myBoard.length = 0;
  ghosts.length = 0;
  g.grid.innerHTML = "";
  g.x = "";
  if (!player.gamewin || !player2.gamewin) {
    player.score = 0;
    player.lives = 3;
  } else if (player.gamewin || player2.gamewin) {
    player.level++;
  } else {
    player.gamewin = false;
  }
  player.gameover = false;
  player2.gameover = false;
  createGame(); // create game board
  updateScore();
  g.grid.focus();
  g.grid.style.display = "grid";
  startGame.style.display = "none";
  g.pacman.style.display = "block";
  g.pacman2.style.display = "block";
}

function playerWins() {
  player.gamewin = true;
  player2.gamewin = true;
  g.inplay = false;
  player.pause = true;
  player2.pause = true;
  startGame.style.display = "block";
}

function endGame() {
  player.gamewin = false;
  player2.gamewin = false;
  startGame.style.display = "block";
}

function gameReset() {
  window.cancelAnimationFrame(player.play);
  g.inplay = false;
  player.pause = true;
  player2.pause = true;
  if (player.lives <= 0) {
    player.gameover = true;
    player2.gameover = true;
    player.level = 1;
    player2.level = 1;
    endGame();
  }
  if (!player.gameover || !player.gameover) {
    setTimeout(startPos, 3000);
  }
}

function startPos() {
  // ghost and player start squares
  player.pause = false;
  player2.pause = false;
  let firstStartPos = 10;
  let firstStartPos2 = 358;
  player.pos = startPosPlayer(firstStartPos);
  player2.pos = startPosPlayer(firstStartPos2);
  myBoard[player.pos].append(g.pacman);
  myBoard[player2.pos].append(g.pacman2);
  ghosts.forEach((ghost) => {
    let temp = g.startGhost;
    ghost.pos = startPosPlayer(temp);
    myBoard[ghost.pos].append(ghost);
  });
}

function startPosPlayer(val) {
  if (myBoard[val].t != 1) {
    return val;
  }
  return startPosPlayer(val + 1);
}

/// --------- GAME UPDATES ---------
function updateScore() {
  if (player.lives <= 0) {
    player.gameover = true;
    player2.gameover = true;
    g.lives.innerHTML = "Game Over";
  } else {
    g.level.innerHTML = `Level ${player.level}`;
    g.score.innerHTML = `Score: ${player.score}`;
    g.lives.innerHTML = `Lives: ${player.lives}`;
  }
}

/// --------- GAME BOARD SETUP ---------
function createGhost() {
  let newGhost = g.ghost.cloneNode(true);
  newGhost.pos = g.startGhost;
  newGhost.style.display = "block";
  newGhost.counter = 0;
  newGhost.defaultColor = board[ghosts.length];
  newGhost.direction = Math.floor(Math.random() * 4);
  newGhost.style.backgroundColor = board[ghosts.length];
  newGhost.style.opacity = "0.8";
  newGhost.namer = board[ghosts.length] + "y";
  ghosts.push(newGhost);
}

function createGame() {
  for (let i = 0; i < g.ghosts; i++) {
    createGhost();
  }
  tempBoard.forEach((cell) => {
    createSquare(cell);
  });

  for (let i = 0; i < g.size; i++) {
    g.x += ` ${g.h}px `; // cell grid height
  }
  g.grid.style.gridTemplateColumns = g.x;
  g.grid.style.gridTemplateRows = g.x;
  startPos();
}

function createSquare(val) {
  const div = document.createElement("div");
  div.classList.add("box");
  if (val == 1) {
    div.classList.add("wall"); //adding wall element
  }
  if (val == 2) {
    const dot = document.createElement("div");
    dot.classList.add("dot"); //adding dot element
    div.append(dot);
  }
  if (val == 4) {
    div.classList.add("hideout"); //adding hideout element
    if (g.startGhost == 11) {
      g.startGhost = myBoard.length;
    }
  }
  if (val == 3) {
    const dot = document.createElement("div");
    dot.classList.add("superdot"); //adding superdot element
    div.append(dot);
  }

  g.grid.append(div);
  myBoard.push(div);
  div.t = val; //element type of content
  div.idVal = myBoard.length;
}

///  --------- GHOST THINKING ---------
function findDir(a) {
  let val = [a.pos % g.size, Math.ceil(a.pos / g.size)]; //col, row
  return val;
}

function changeDir(enemy) {
  let gg = findDir(enemy);
  let pp = findDir(player);
  let pp2 = findDir(player2);
  let ran = Math.floor(Math.random() * 3);

  // if Player1 is closer to the ghost
  if (Math.abs(gg[0] - pp[0]) < Math.abs(gg[0] - pp2[0])) {
    if (ran < 2) {
      // horizontal position of the enemy
      enemy.direction = gg[0] < pp[0] ? 2 : 3;
    } else {
      // vertical position of the enemy
      enemy.direction = gg[1] < pp[1] ? 1 : 0;
    }
  }
  // if Player2 is closer to the ghost
  else {
    if (ran < 2) {
      // horizontal position of the enemy
      enemy.direction = gg[0] < pp2[0] ? 2 : 3;
    } else {
      // vertical position of the enemy
      enemy.direction = gg[1] < pp2[1] ? 1 : 0;
    }
  }
  enemy.counter = Math.random() * 6 + 1;
}
