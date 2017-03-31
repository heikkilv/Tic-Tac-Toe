var squares = function () {
  var nx = 10;
  var ny = 10;
  var nwin = 5;
  var marks = [];
  var x_mark = "X";
  var o_mark = "O";
  var empty_mark = "";
  var nextMark = x_mark;
  var moves = 0;
  var gameOn = false;

  var setNextMark = function() {
    if (nextMark === x_mark) {
      nextMark = o_mark;
    } else {
      nextMark = x_mark;
    }
  };

  var checkForMove = function(nCheck, mark, connected, extraSpaces) {
    if (moves < nCheck) {
      return [];
    }

    var dx = [1, 0, -1, 1];
    var dy = [0, 1, 1, 1];

    var tiles = [];
    for (var x = 0; x < nx; ++x) {
      for (var y = 0; y < ny; ++y) {
        var id = (y * nx) + x;

        for (var d = 0; d < dx.length; ++d) {
          if (x + (nwin-1) * dx[d] < 0 || x + (nwin-1) * dx[d] >= nx ||
              y + (nwin-1) * dy[d] < 0 || y + (nwin-1) * dy[d] >= ny) {
                continue;
          }

          var n = 0;
          var nStart = -1;
          var nEnd = -1;
          var emptyTiles = [];
          for (var i = 0; i < nwin; ++i) {
            if (marks[id + i * (dx[d] + dy[d] * nx)] === mark) {
              ++n;
              if (n === 1) nStart = i;
              if (n === nCheck) nEnd = i;
            } else if (marks[id + i * (dx[d] + dy[d] * nx)] !== empty_mark) {
              n = -2 * nwin;
            } else {
              emptyTiles[emptyTiles.length] = id + i * (dx[d] + dy[d] * nx);
              if (n >= 0 && n < nCheck && connected) {
                n = 0;
              }
            }
          }

          if (n < nCheck) {
            continue;
          }

          var leftExtra = false;
          var rightExtra = false;
          if (nStart > 0 && x + (nStart-1) * dx[d] >= 0 && x + (nStart-1) * dx[d] < nx &&
              y + (nStart-1) * dy[d] >= 0 && y + (nStart-1) * dy[d] < ny &&
              marks[id + (nStart-1) * (dx[d] + dy[d] * nx)] === empty_mark &&
              x + (nStart-2) * dx[d] >= 0 && x + (nStart-2) * dx[d] < nx &&
              y + (nStart-2) * dy[d] >= 0 && y + (nStart-2) * dy[d] < ny &&
              marks[id + (nStart-2) * (dx[d] + dy[d] * nx)] === empty_mark) {
            leftExtra = true;
          }
          if (nEnd < nwin-1 && x + (nEnd+1) * dx[d] >= 0 && x + (nEnd+1) * dx[d] < nx &&
              y + (nEnd+1) * dy[d] >= 0 && y + (nEnd+1) * dy[d] < ny &&
              marks[id + (nEnd+1) * (dx[d] + dy[d] * nx)] === empty_mark &&
              x + (nEnd+2) * dx[d] >= 0 && x + (nEnd+2) * dx[d] < nx &&
              y + (nEnd+2) * dy[d] >= 0 && y + (nEnd+2) * dy[d] < ny &&
              marks[id + (nEnd+2) * (dx[d] + dy[d] * nx)] === empty_mark) {
            rightExtra = true;
          }

          if (extraSpaces === 2 && leftExtra && rightExtra && connected) {
            tiles[tiles.length] = id + (nStart-1) * (dx[d] + dy[d] * nx);
            tiles[tiles.length] = id + (nEnd+1) * (dx[d] + dy[d] * nx);
          } else if (extraSpaces === 1 && leftExtra && connected) {
            tiles[tiles.length] = id + (nStart-1) * (dx[d] + dy[d] * nx);
          } else if (extraSpaces === 1 && rightExtra && connected) {
            tiles[tiles.length] = id + (nEnd+1) * (dx[d] + dy[d] * nx);
          } else {
            for (var j = 0; j < emptyTiles.length; ++j) {
              tiles[tiles.length] = emptyTiles[j];
            }
          }
        }
      }
    }

    return tiles;
  };

  var findEmptySpaces = function(nearCenter) {
    var tiles = [];
    var start_x = (nearCenter) ? nx/2 - 3 : 0;
    var start_y = (nearCenter) ? ny/2 - 3 : 0;
    var end_x = (nearCenter) ? nx/2 + 2 : nx - 1;
    var end_y = (nearCenter) ? ny/2 + 2 : ny - 1;

    for (var x = start_x; x <= end_x; ++x) {
      for (var y = start_y; y <= end_y; ++y) {
        var id = (y * nx) + x;
        if (marks[id] === empty_mark) {
          tiles[tiles.length] = id;
        }
      }
    }
    return tiles;
  };

  var calculatePossibleMove = function() {
    if (!gameOn) {
      return [];
    }

    var otherMark = (nextMark === x_mark) ? o_mark : x_mark;
    var tiles = checkForMove(4, nextMark, false, 0);
    if (tiles.length > 0) return tiles;
    tiles = checkForMove(4, otherMark, false, 0);
    if (tiles.length > 0) return tiles;
    tiles = checkForMove(3, nextMark, true, 1);
    if (tiles.length > 0) return tiles;
    tiles = checkForMove(3, nextMark, false, 1);
    tiles = tiles.concat(checkForMove(3, otherMark, true, 1));
    if (tiles.length > 0) return tiles;
    tiles = checkForMove(3, otherMark, false, 1);
    tiles = tiles.concat(checkForMove(3, nextMark, false, 0));
    tiles = tiles.concat(checkForMove(3, otherMark, false, 0));
    if (tiles.length > 0) return tiles;
    tiles = checkForMove(2, nextMark, true, 2);
    tiles = tiles.concat(checkForMove(2, nextMark, false, 2));
    tiles = tiles.concat(checkForMove(2, nextMark, false, 1));
    tiles = tiles.concat(checkForMove(2, nextMark, false, 0));
    if (tiles.length > 0) return tiles;
    tiles = checkForMove(2, otherMark, true, 2);
    tiles = tiles.concat(checkForMove(2, otherMark, false, 2));
    tiles = tiles.concat(checkForMove(2, otherMark, false, 1));
    tiles = tiles.concat(checkForMove(2, otherMark, false, 0));
    if (tiles.length > 0) return tiles;
    tiles = checkForMove(1, nextMark, false, 2);
    tiles = tiles.concat(checkForMove(1, nextMark, false, 1));
    tiles = tiles.concat(checkForMove(1, nextMark, false, 0));
    if (tiles.length > 0) return tiles;
    tiles = checkForMove(1, otherMark, false, 2);
    tiles = tiles.concat(checkForMove(1, otherMark, false, 1));
    tiles = tiles.concat(checkForMove(1, otherMark, false, 0));
    if (tiles.length > 0) return tiles;
    if (moves === 0) return findEmptySpaces(true);
    else return findEmptySpaces(false);
  };

  return {
    startGame: function() {
      moves = 0;
      nextMark = x_mark;
      gameOn = true;
      for (var i = 0; i < nx * ny; ++i) {
        marks[i] = empty_mark;
      }
    },

    isGameStarted: function() {
      return gameOn;
    },

    getWidth: function()
    {
      return nx;
    },

    getHeight: function() {
      return ny;
    },

    setMark: function(id) {
      if (gameOn && id >= 0 && id < nx * ny && marks[id] === empty_mark) {
        marks[id] = nextMark;
        ++moves;
        setNextMark();
        if (moves >= nx * ny) {
          gameOn = false;
        }
        return true;
      } else {
        return false;
      }
    },

    getMark: function(id) {
      if (id < 0 || id >= nx * ny) {
        return empty_mark;
      } else {
        return marks[id];
      }
    },

    getMoves: function() {
      return moves;
    },

    getGameState: function() {
      var state = "";
      for (var y = 0; y < ny; ++y) {
        for (var x = 0; x < nx; ++x) {
          var id = (y * nx) + x;
          if (marks[id] !== empty_mark) {
            state += marks[id];
          } else {
            state += "-";
          }
        }
      }
      return state;
    },

    setState: function(state) {
      this.startGame();

      var x_marks = [];
      var o_marks = [];
      for (var x = 0; x < nx; ++x) {
        for (var y = 0; y < ny; ++y) {
          var id = (y * nx) + x;
           if (state[id] === x_mark) {
             x_marks[x_marks.length] = id;
           } else if (state[id] === o_mark) {
             o_marks[o_marks.length] = id;
           }
        }
      }

      while ((nextMark === x_mark && x_marks.length > 0) ||
             (nextMark === o_mark && o_marks.length > 0)) {
        if (nextMark === x_mark && this.setMark(x_marks[0])) {
          x_marks.splice(0, 1);
        } else if (nextMark === o_mark && this.setMark(o_marks[0])) {
          o_marks.splice(0, 1);
        } else {
          break;
        }
      }
    },

    checkForWin: function() {
      if (moves < nwin) {
        return [];
      }

      var dx = [1, 0, -1, 1];
      var dy = [0, 1, 1, 1];

      for (var x = 0; x < nx; ++x) {
        for (var y = 0; y < ny; ++y) {
          var id = (y * nx) + x;

          for (var d = 0; d < dx.length; ++d) {
            if (x + (nwin-1) * dx[d] < 0 || x + (nwin-1) * dx[d] >= nx ||
                y + (nwin-1) * dy[d] < 0 || y + (nwin-1) * dy[d] >= ny) {
                  continue;
            }

            var checkX = (marks[id] === x_mark);
            var checkO = (marks[id] === o_mark);
            var n = 1;
            while ((checkX || checkO) && n < nwin &&
                   marks[id + n * (dx[d] + dy[d] * nx)] !== empty_mark) {
              checkX = (checkX && marks[id + n * (dx[d] + dy[d] * nx)] === x_mark);
              checkO = (checkO && marks[id + n * (dx[d] + dy[d] * nx)] === o_mark);
              ++n;
            }

            if (n === nwin && (checkX || checkO)) {
              gameOn = false;
              var winSquares = [];
              for (n = 0; n < nwin; ++n) {
                winSquares[n] = id + n * (dx[d] + dy[d] * nx);
              }
              return winSquares;
            }
          }
        }
      }

      return [];
    },

    getPossibleMove: function() {
      return calculatePossibleMove();
    }
  };
};

function makeAIMove() {
  var possibleTiles = game.getPossibleMove();
  var index = Math.floor(Math.random() * possibleTiles.length);
  var id = possibleTiles[index];
  game.setMark(id);
  $("#" + id).text(game.getMark(id));
  $("#" + id).addClass("AI");
  if (checkForGameEnd()) {
    $("#save_state").attr('disabled', true);
    $("#submit_score").attr('disabled', false);
  }

  // Show suggested moves to the human player
  /*
  for (var i = 0; i < game.getWidth() * game.getHeight(); ++i) {
    $("#" + i).removeClass("possible");
  }
  possibleTiles = game.getPossibleMove();
  for (var i = 0; i < possibleTiles.length; ++i) {
    $("#" + possibleTiles[i]).addClass("possible");
  }
  */
}

var game = {};
var score = 0;
var startTime = 0;
var loaded = false;

var moveScore = 10;
var winScore = 1000;
var tieScore = 500;
var loseScore = 0;
var loadScore = -100;
var maxTimeScore = 120;

function restartGame(clearGameArea) {
  game = squares();
  score = 0;
  loaded = false;
  game.startGame();

  if (clearGameArea) {
    for (var i = 0; i < game.getWidth() * game.getHeight(); ++i) {
      $("#" + i).removeClass("possible");
      $("#" + i).removeClass("win");
      $("#" + i).removeClass("AI");
      $("#" + i).removeClass("player");
      $("#" + i).text("");
    }
  } else {
    createGameArea(game.getWidth(), game.getHeight());
  }
  $("#GameEndInfo").text("");

  $("#submit_score").attr('disabled', true);
  $("#save_state").attr('disabled', true);

  startTime = Date.parse(new Date());
  makeAIMove();
  updateScore();
}

$(function() {
  createGameButtons();
  restartGame(false);

  $("#submit_score").click( function () {
    var msg = {
      "messageType": "SCORE",
      "score": score
    };
    console.log("submit: " + msg.messageType + "," + msg.score);
    window.parent.postMessage(msg, "*");
    $("#submit_score").attr('disabled', true);
  });

  $("#save_state").click( function () {
    var msg = {
      "messageType": "SAVE",
      "gameState": {
        state : game.getGameState()
      }
    };
    window.parent.postMessage(msg, "*");
  });

  $("#load_state").click( function () {
    var msg = {
      "messageType": "LOAD_REQUEST",
    };
    window.parent.postMessage(msg, "*");
  });

  $("#info").click( function () {
    var infoText = "Scoring system:\n\n";
    infoText += "1 move:\t\t";
    if (moveScore > 0) infoText +="+";
    infoText += moveScore + " points\n\n";
    infoText += "winner:\t\t";
    if (winScore > 0) infoText +="+";
    infoText += winScore + " points\n";
    infoText += "tie game:\t\t";
    if (tieScore > 0) infoText +="+";
    infoText += tieScore + " points\n";
    infoText += "loser:\t\t";
    if (loseScore > 0) infoText +="+";
    infoText += loseScore + " points\n\n";
    infoText += "game loaded:\t";
    if (loadScore > 0) infoText +="+";
    infoText += loadScore + " points\n\n";
    infoText += "time:\t\t+(" + maxTimeScore + "-s) points\n";
    infoText += " (timescore will only be added if it is positive\n";
    infoText += "  and the game was not loaded)";
    alert(infoText);
  });

  window.addEventListener("message", function(evt) {
    if(evt.data.messageType === "LOAD") {
      setGameState(evt.data.gameState);
    } else if (evt.data.messageType === "ERROR") {
      alert(evt.data.info);
    }
  });

  var message =  {
    messageType: "SETTING",
    options: {
    	"width": 530,
      "height": 650
    }
  };
  window.parent.postMessage(message, "*");
});

function createGameArea(nx, ny) {
  for (var y = 0; y < ny; ++y) {
    var squareText = "<tr>";
    for (var x = 0; x < nx; ++x) {
      var id = (y * nx) + x;
      squareText += '<td class="square" id="' + id +
                    '" onClick="makeHumanMove(' + id + ')"></td>';
    }
    squareText += "</tr>";
    $("#GameArea").append(squareText);
  }
}

function createGameButtons() {
  $("#GameButtons").append('<button id="info" class="button_left">Score Info</button>');
  $("#GameButtons").append('<button id="restart" class="button_left" onClick="restartGame(true)">Restart Game</button>');
  $("#GameButtons").append('<button id="load_state">Load Game</button>');
  $("#GameButtons").append('<button id="save_state">Save Game</button>');
  $("#GameButtons").append('<button id="submit_score" class="button_right">Submit Score</button>');
}

function checkForGameEnd() {
  var tiles = game.checkForWin();
  if (tiles.length > 0) {
    for (var i = 0; i < tiles.length; ++i) {
      $("#" + tiles[i]).addClass("win");
    }

    console.log(game.getMark(tiles[0]) + " won!");
    var time = Date.parse(new Date()) - startTime;
    var seconds = Math.floor(time/1000);
    var winnerMoves = Math.floor(game.getMoves() / 2);
    var endText = "";

    if (game.getMark(tiles[0]) === "X") {
      score += loseScore;
      endText = "AI won in " + (winnerMoves+1) + " moves";
      if (loaded) {
        endText += "!";
      } else {
        endText += " and " + seconds + " seconds!";
      }
    }
    else {
      score += winScore;
      endText = "You won in " + winnerMoves + " moves";
      if (loaded) {
        endText += "!";
      } else {
        if (seconds > 0 && seconds <= maxTimeScore) {
          score += Math.floor(maxTimeScore - seconds);
        }
        endText += " and " + seconds + " seconds!";
      }
    }

    updateScore();
    $("#GameEndInfo").text(endText);
    return true;
  }
  else if (!game.isGameStarted()) {
    console.log("Tie game");

    var tieTime = Date.parse(new Date()) - startTime;
    var tieSeconds = Math.floor(tieTime/1000);
    var tieMoves = Math.floor(game.getMoves() / 2) + 1;
    var tieEndText = "Game ended in a tie after " + tieMoves + " moves";

    score += tieScore;
    if (loaded) {
      tieEndText += "!";
    } else {
      if (tieSeconds > 0 && tieSeconds <= maxTimeScore) {
        score += Math.floor(maxTimeScore - tieSeconds);
      }
      tieEndText += " and " + tieSeconds + " seconds!";
    }
    $("#GameEndInfo").text(tieEndText);
    updateScore();
    return true;
  } else {
    return false;
  }
}

function makeHumanMove(id) {
  if (game.setMark(id)) {
    $("#" + id).text(game.getMark(id));
    $("#" + id).addClass("player");
    score += moveScore;
    updateScore();
    $("#load_state").attr('disabled', false);
    $("#save_state").attr('disabled', false);

    if (!checkForGameEnd()) {
      makeAIMove();
    } else {
      $("#save_state").attr('disabled', true);
      $("#submit_score").attr('disabled', false);
    }
  }
}

function updateScore() {
  $("#GameScore").text("Score: " + score);
}

function setGameState(gameState) {
  loaded = true;
  game.setState(gameState.state);
  score = Math.floor(game.getMoves() / 2) * moveScore;
  score += loadScore;
  updateScore();

  for (var i = 0; i < game.getWidth() * game.getHeight(); ++i) {
    $("#" + i).removeClass("possible");
    $("#" + i).removeClass("win");
    $("#" + i).removeClass("AI");
    $("#" + i).removeClass("player");

    var mark = game.getMark(i);
    if (mark === "O") {
      $("#" + i).text(mark);
      $("#" + i).addClass("player");
    } else if (mark === "X") {
      $("#" + i).text(mark);
      $("#" + i).addClass("AI");
    } else {
      $("#" + i).text("");
    }
  }
  $("#GameEndInfo").text("");

  $("#submit_score").attr('disabled', true);
  $("#load_state").attr('disabled', false);
  $("#save_state").attr('disabled', false);

  startTime = Date.parse(new Date());
}
