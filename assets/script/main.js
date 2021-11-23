/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ai.ts":
/*!*******************!*\
  !*** ./src/ai.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.AIv1 = void 0;
var game_model_1 = __webpack_require__(/*! ./game-model */ "./src/game-model.ts");
var AIv1 = /** @class */ (function () {
    function AIv1(grid) {
        this.grid = grid;
    }
    AIv1.prototype.play = function (symbol) {
        var emptyCells = this.grid.getEmptyCells();
        var priorities = [];
        for (var i = 0; i < emptyCells.length; ++i) {
            priorities[i] = 0;
        }
        priorities = this.prioritizeCells(emptyCells, priorities, symbol);
        var maxPriority = -1;
        var finalPosition;
        for (var i = 0; i < priorities.length; ++i) {
            if (priorities[i] == maxPriority && Math.random() > 0.7) {
                finalPosition = emptyCells[i];
            }
            else if (priorities[i] > maxPriority) {
                maxPriority = priorities[i];
                finalPosition = emptyCells[i];
            }
        }
        return finalPosition;
    };
    AIv1.prototype.prioritizeCells = function (cells, priorities, symbol) {
        var grid = this.grid;
        var opponentsSymbol = symbol == game_model_1.GameSymbol.X ? game_model_1.GameSymbol.O : game_model_1.GameSymbol.X;
        var opponentsCells = grid.getCellsWithSymbol(opponentsSymbol);
        opponentsCells.forEach(function (pos) {
            grid.getCellsAround(pos, 1).forEach(function (posAround) {
                for (var i = 0; i < cells.length; ++i) {
                    if (posAround.equals(cells[i])) {
                        priorities[i]++;
                    }
                }
            });
        });
        return priorities;
    };
    AIv1.prototype.getGrid = function () {
        return this.grid;
    };
    return AIv1;
}());
exports.AIv1 = AIv1;


/***/ }),

/***/ "./src/convert.ts":
/*!************************!*\
  !*** ./src/convert.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.indexToVector = exports.vectorToIndex = void 0;
var gomoku = __webpack_require__(/*! ./main */ "./src/main.ts");
var vector_1 = __webpack_require__(/*! ./vector */ "./src/vector.ts");
function coordsToIndex(x, y) {
    return y * gomoku.GRID_SIZE + x;
}
function getIndexX(index) {
    return index % gomoku.GRID_SIZE;
}
function getIndexY(index) {
    return Math.floor(index / gomoku.GRID_SIZE);
}
function vectorToIndex(vec) {
    return coordsToIndex(vec.getX(), vec.getY());
}
exports.vectorToIndex = vectorToIndex;
function indexToVector(index) {
    return new vector_1.Vector2(getIndexX(index), getIndexY(index));
}
exports.indexToVector = indexToVector;


/***/ }),

/***/ "./src/game-model.ts":
/*!***************************!*\
  !*** ./src/game-model.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.GameModel = exports.GameGrid = exports.GameSymbol = void 0;
var vector_1 = __webpack_require__(/*! ./vector */ "./src/vector.ts");
var main_1 = __webpack_require__(/*! ./main */ "./src/main.ts");
var GameSymbol;
(function (GameSymbol) {
    GameSymbol["X"] = "x";
    GameSymbol["O"] = "o";
    GameSymbol["NONE"] = "";
})(GameSymbol = exports.GameSymbol || (exports.GameSymbol = {}));
var GameGrid = /** @class */ (function () {
    function GameGrid() {
        this.grid = [];
        for (var x = 0; x < main_1.GRID_SIZE; ++x) {
            this.grid[x] = [];
            for (var y = 0; y < main_1.GRID_SIZE; ++y) {
                this.grid[x][y] = GameSymbol.NONE;
            }
        }
    }
    GameGrid.prototype.getCellsWithSymbol = function (symbol) {
        var cells = [];
        for (var x = 0; x < main_1.GRID_SIZE; ++x) {
            for (var y = 0; y < main_1.GRID_SIZE; ++y) {
                if (this.grid[x][y] == symbol) {
                    cells.push(new vector_1.Vector2(x, y));
                }
            }
        }
        return cells;
    };
    GameGrid.prototype.getEmptyCells = function () {
        return this.getCellsWithSymbol(GameSymbol.NONE);
    };
    GameGrid.prototype.getCellsAround = function (pos, i, gameSymbol) {
        if (i === void 0) { i = 1; }
        if (gameSymbol === void 0) { gameSymbol = null; }
        var minX = Math.min(Math.max(pos.getX() - i, 0), main_1.GRID_SIZE);
        var maxX = Math.min(Math.max(pos.getX() + i, 0), main_1.GRID_SIZE);
        var minY = Math.min(Math.max(pos.getX() - i, 0), main_1.GRID_SIZE);
        var maxY = Math.min(Math.max(pos.getX() + i, 0), main_1.GRID_SIZE);
        var cells = [];
        for (var x = minX; x <= maxX; ++x) {
            for (var y = minY; y <= maxY; ++y) {
                if (gameSymbol === null || this.grid[x][y] == gameSymbol) {
                    cells.push(new vector_1.Vector2(x, y));
                }
            }
        }
        return cells;
    };
    GameGrid.prototype.findFiveInARow = function () {
        var xCells = this.getCellsWithSymbol(GameSymbol.X);
        var oCells = this.getCellsWithSymbol(GameSymbol.O);
        function findFiveInARow(cells) {
            var directions = [
                new vector_1.Vector2(1, 1),
                new vector_1.Vector2(0, 1),
                new vector_1.Vector2(1, 0),
                new vector_1.Vector2(1, -1)
            ];
            function exists(cell) {
                for (var _i = 0, cells_2 = cells; _i < cells_2.length; _i++) {
                    var c = cells_2[_i];
                    if (cell.equals(c)) {
                        return true;
                    }
                }
                return false;
            }
            for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
                var direction = directions_1[_i];
                for (var _a = 0, cells_1 = cells; _a < cells_1.length; _a++) {
                    var cell = cells_1[_a];
                    var row = 0;
                    var nextVector = void 0;
                    for (var i = 1 + (-main_1.GRID_SIZE); i < main_1.GRID_SIZE; ++i) {
                        nextVector = cell.addVector(direction.multiply(i));
                        if (nextVector.isOutOfBounds()) {
                            continue;
                        }
                        if (exists(nextVector)) {
                            row++;
                        }
                        else {
                            row = 0;
                        }
                        if (row === 5) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        if (findFiveInARow(xCells)) {
            return GameSymbol.X;
        }
        else if (findFiveInARow(oCells)) {
            return GameSymbol.O;
        }
        return GameSymbol.NONE;
    };
    GameGrid.prototype.addSymbol = function (pos, symbol) {
        this.grid[pos.getX()][pos.getY()] = symbol;
    };
    GameGrid.prototype.getSymbolAt = function (pos) {
        return this.grid[pos.getX()][pos.getY()];
    };
    return GameGrid;
}());
exports.GameGrid = GameGrid;
var GameModel = /** @class */ (function () {
    function GameModel(grid, symbolPlaying) {
    }
    return GameModel;
}());
exports.GameModel = GameModel;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.GRID_SIZE = void 0;
var convert_1 = __webpack_require__(/*! ./convert */ "./src/convert.ts");
var game_model_1 = __webpack_require__(/*! ./game-model */ "./src/game-model.ts");
var ai_1 = __webpack_require__(/*! ./ai */ "./src/ai.ts");
exports.GRID_SIZE = 15;
console.log("Starting the application");
var gameGrid = new game_model_1.GameGrid();
var playerSymbol = game_model_1.GameSymbol.X;
var aiSymbol = game_model_1.GameSymbol.O;
var playing = true;
// Handling click
$(function () {
    $(".cell").bind("click", function () {
        var element = $(this);
        var clickPosition = (0, convert_1.indexToVector)(element.index());
        // We cannot place symbol to cell which already has another one
        if (gameGrid.getSymbolAt(clickPosition) !== game_model_1.GameSymbol.NONE) {
            return;
        }
        if (!playing) {
            return;
        }
        displaySymbol(clickPosition, playerSymbol);
        saveSymbol(clickPosition, playerSymbol);
        if (gameGrid.findFiveInARow() === playerSymbol) {
            playing = false;
            console.log("Congrats! You have won the game!");
            return;
        }
        handleClick(clickPosition);
    });
});
// Display stuff
function displaySymbol(position, symbol) {
    $(".game-grid")
        .children()
        .eq((0, convert_1.vectorToIndex)(position))
        .addClass(symbol);
}
function saveSymbol(position, symbol) {
    gameGrid.addSymbol(position, symbol);
}
// Game stuff
function handleClick(clickPosition) {
    var aiMove = (new ai_1.AIv1(gameGrid)).play(aiSymbol);
    displaySymbol(aiMove, aiSymbol);
    saveSymbol(aiMove, aiSymbol);
    if (gameGrid.findFiveInARow() === aiSymbol) {
        playing = false;
        console.log("You lose");
    }
}


/***/ }),

/***/ "./src/vector.ts":
/*!***********************!*\
  !*** ./src/vector.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Vector2 = void 0;
var main_1 = __webpack_require__(/*! ./main */ "./src/main.ts");
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.add = function (x, y) {
        return new Vector2(this.x + x, this.y + y);
    };
    Vector2.prototype.addVector = function (vec) {
        return this.add(vec.x, vec.y);
    };
    Vector2.prototype.subtract = function (x, y) {
        return this.add(-x, -y);
    };
    Vector2.prototype.subtractVector = function (vec) {
        return this.add(-vec.x, -vec.y);
    };
    Vector2.prototype.multiply = function (i) {
        return new Vector2(this.x * i, this.y * i);
    };
    Vector2.prototype.divide = function (i) {
        return this.multiply(1 / i);
    };
    Vector2.prototype.equals = function (vec) {
        return this.x === vec.x && this.y === vec.y;
    };
    Vector2.prototype.isOutOfBounds = function () {
        return this.x < 0 || this.x >= main_1.GRID_SIZE || this.y < 0 || this.y >= main_1.GRID_SIZE;
    };
    Vector2.prototype.getX = function () {
        return this.x;
    };
    Vector2.prototype.getY = function () {
        return this.y;
    };
    return Vector2;
}());
exports.Vector2 = Vector2;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNyRGE7QUFDYixrQkFBa0I7QUFDbEIsZUFBZTtBQUNmLGFBQWEsbUJBQU8sQ0FBQyw2QkFBUTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZUFBZTs7Ozs7OztVQ3pDZjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2FpLnRzIiwid2VicGFjazovLy8uL3NyYy9jb252ZXJ0LnRzIiwid2VicGFjazovLy8uL3NyYy9nYW1lLW1vZGVsLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy92ZWN0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkFJdjEgPSB2b2lkIDA7XG52YXIgZ2FtZV9tb2RlbF8xID0gcmVxdWlyZShcIi4vZ2FtZS1tb2RlbFwiKTtcbnZhciBBSXYxID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFJdjEoZ3JpZCkge1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkO1xuICAgIH1cbiAgICBBSXYxLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24gKHN5bWJvbCkge1xuICAgICAgICB2YXIgZW1wdHlDZWxscyA9IHRoaXMuZ3JpZC5nZXRFbXB0eUNlbGxzKCk7XG4gICAgICAgIHZhciBwcmlvcml0aWVzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW1wdHlDZWxscy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcHJpb3JpdGllc1tpXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcHJpb3JpdGllcyA9IHRoaXMucHJpb3JpdGl6ZUNlbGxzKGVtcHR5Q2VsbHMsIHByaW9yaXRpZXMsIHN5bWJvbCk7XG4gICAgICAgIHZhciBtYXhQcmlvcml0eSA9IC0xO1xuICAgICAgICB2YXIgZmluYWxQb3NpdGlvbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmlvcml0aWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAocHJpb3JpdGllc1tpXSA9PSBtYXhQcmlvcml0eSAmJiBNYXRoLnJhbmRvbSgpID4gMC43KSB7XG4gICAgICAgICAgICAgICAgZmluYWxQb3NpdGlvbiA9IGVtcHR5Q2VsbHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChwcmlvcml0aWVzW2ldID4gbWF4UHJpb3JpdHkpIHtcbiAgICAgICAgICAgICAgICBtYXhQcmlvcml0eSA9IHByaW9yaXRpZXNbaV07XG4gICAgICAgICAgICAgICAgZmluYWxQb3NpdGlvbiA9IGVtcHR5Q2VsbHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbmFsUG9zaXRpb247XG4gICAgfTtcbiAgICBBSXYxLnByb3RvdHlwZS5wcmlvcml0aXplQ2VsbHMgPSBmdW5jdGlvbiAoY2VsbHMsIHByaW9yaXRpZXMsIHN5bWJvbCkge1xuICAgICAgICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgdmFyIG9wcG9uZW50c1N5bWJvbCA9IHN5bWJvbCA9PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5YID8gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTyA6IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLlg7XG4gICAgICAgIHZhciBvcHBvbmVudHNDZWxscyA9IGdyaWQuZ2V0Q2VsbHNXaXRoU3ltYm9sKG9wcG9uZW50c1N5bWJvbCk7XG4gICAgICAgIG9wcG9uZW50c0NlbGxzLmZvckVhY2goZnVuY3Rpb24gKHBvcykge1xuICAgICAgICAgICAgZ3JpZC5nZXRDZWxsc0Fyb3VuZChwb3MsIDEpLmZvckVhY2goZnVuY3Rpb24gKHBvc0Fyb3VuZCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2VsbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc0Fyb3VuZC5lcXVhbHMoY2VsbHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ldKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcmlvcml0aWVzO1xuICAgIH07XG4gICAgQUl2MS5wcm90b3R5cGUuZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZDtcbiAgICB9O1xuICAgIHJldHVybiBBSXYxO1xufSgpKTtcbmV4cG9ydHMuQUl2MSA9IEFJdjE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmluZGV4VG9WZWN0b3IgPSBleHBvcnRzLnZlY3RvclRvSW5kZXggPSB2b2lkIDA7XG52YXIgZ29tb2t1ID0gcmVxdWlyZShcIi4vbWFpblwiKTtcbnZhciB2ZWN0b3JfMSA9IHJlcXVpcmUoXCIuL3ZlY3RvclwiKTtcbmZ1bmN0aW9uIGNvb3Jkc1RvSW5kZXgoeCwgeSkge1xuICAgIHJldHVybiB5ICogZ29tb2t1LkdSSURfU0laRSArIHg7XG59XG5mdW5jdGlvbiBnZXRJbmRleFgoaW5kZXgpIHtcbiAgICByZXR1cm4gaW5kZXggJSBnb21va3UuR1JJRF9TSVpFO1xufVxuZnVuY3Rpb24gZ2V0SW5kZXhZKGluZGV4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoaW5kZXggLyBnb21va3UuR1JJRF9TSVpFKTtcbn1cbmZ1bmN0aW9uIHZlY3RvclRvSW5kZXgodmVjKSB7XG4gICAgcmV0dXJuIGNvb3Jkc1RvSW5kZXgodmVjLmdldFgoKSwgdmVjLmdldFkoKSk7XG59XG5leHBvcnRzLnZlY3RvclRvSW5kZXggPSB2ZWN0b3JUb0luZGV4O1xuZnVuY3Rpb24gaW5kZXhUb1ZlY3RvcihpbmRleCkge1xuICAgIHJldHVybiBuZXcgdmVjdG9yXzEuVmVjdG9yMihnZXRJbmRleFgoaW5kZXgpLCBnZXRJbmRleFkoaW5kZXgpKTtcbn1cbmV4cG9ydHMuaW5kZXhUb1ZlY3RvciA9IGluZGV4VG9WZWN0b3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkdhbWVNb2RlbCA9IGV4cG9ydHMuR2FtZUdyaWQgPSBleHBvcnRzLkdhbWVTeW1ib2wgPSB2b2lkIDA7XG52YXIgdmVjdG9yXzEgPSByZXF1aXJlKFwiLi92ZWN0b3JcIik7XG52YXIgbWFpbl8xID0gcmVxdWlyZShcIi4vbWFpblwiKTtcbnZhciBHYW1lU3ltYm9sO1xuKGZ1bmN0aW9uIChHYW1lU3ltYm9sKSB7XG4gICAgR2FtZVN5bWJvbFtcIlhcIl0gPSBcInhcIjtcbiAgICBHYW1lU3ltYm9sW1wiT1wiXSA9IFwib1wiO1xuICAgIEdhbWVTeW1ib2xbXCJOT05FXCJdID0gXCJcIjtcbn0pKEdhbWVTeW1ib2wgPSBleHBvcnRzLkdhbWVTeW1ib2wgfHwgKGV4cG9ydHMuR2FtZVN5bWJvbCA9IHt9KSk7XG52YXIgR2FtZUdyaWQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZUdyaWQoKSB7XG4gICAgICAgIHRoaXMuZ3JpZCA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG1haW5fMS5HUklEX1NJWkU7ICsreCkge1xuICAgICAgICAgICAgdGhpcy5ncmlkW3hdID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG1haW5fMS5HUklEX1NJWkU7ICsreSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZFt4XVt5XSA9IEdhbWVTeW1ib2wuTk9ORTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZ2V0Q2VsbHNXaXRoU3ltYm9sID0gZnVuY3Rpb24gKHN5bWJvbCkge1xuICAgICAgICB2YXIgY2VsbHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBtYWluXzEuR1JJRF9TSVpFOyArK3gpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgbWFpbl8xLkdSSURfU0laRTsgKyt5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZFt4XVt5XSA9PSBzeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbHMucHVzaChuZXcgdmVjdG9yXzEuVmVjdG9yMih4LCB5KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjZWxscztcbiAgICB9O1xuICAgIEdhbWVHcmlkLnByb3RvdHlwZS5nZXRFbXB0eUNlbGxzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsc1dpdGhTeW1ib2woR2FtZVN5bWJvbC5OT05FKTtcbiAgICB9O1xuICAgIEdhbWVHcmlkLnByb3RvdHlwZS5nZXRDZWxsc0Fyb3VuZCA9IGZ1bmN0aW9uIChwb3MsIGksIGdhbWVTeW1ib2wpIHtcbiAgICAgICAgaWYgKGkgPT09IHZvaWQgMCkgeyBpID0gMTsgfVxuICAgICAgICBpZiAoZ2FtZVN5bWJvbCA9PT0gdm9pZCAwKSB7IGdhbWVTeW1ib2wgPSBudWxsOyB9XG4gICAgICAgIHZhciBtaW5YID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLmdldFgoKSAtIGksIDApLCBtYWluXzEuR1JJRF9TSVpFKTtcbiAgICAgICAgdmFyIG1heFggPSBNYXRoLm1pbihNYXRoLm1heChwb3MuZ2V0WCgpICsgaSwgMCksIG1haW5fMS5HUklEX1NJWkUpO1xuICAgICAgICB2YXIgbWluWSA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRYKCkgLSBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBtYXhZID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLmdldFgoKSArIGksIDApLCBtYWluXzEuR1JJRF9TSVpFKTtcbiAgICAgICAgdmFyIGNlbGxzID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSBtaW5YOyB4IDw9IG1heFg7ICsreCkge1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IG1pblk7IHkgPD0gbWF4WTsgKyt5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGdhbWVTeW1ib2wgPT09IG51bGwgfHwgdGhpcy5ncmlkW3hdW3ldID09IGdhbWVTeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbHMucHVzaChuZXcgdmVjdG9yXzEuVmVjdG9yMih4LCB5KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjZWxscztcbiAgICB9O1xuICAgIEdhbWVHcmlkLnByb3RvdHlwZS5maW5kRml2ZUluQVJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHhDZWxscyA9IHRoaXMuZ2V0Q2VsbHNXaXRoU3ltYm9sKEdhbWVTeW1ib2wuWCk7XG4gICAgICAgIHZhciBvQ2VsbHMgPSB0aGlzLmdldENlbGxzV2l0aFN5bWJvbChHYW1lU3ltYm9sLk8pO1xuICAgICAgICBmdW5jdGlvbiBmaW5kRml2ZUluQVJvdyhjZWxscykge1xuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgMSksXG4gICAgICAgICAgICAgICAgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMCwgMSksXG4gICAgICAgICAgICAgICAgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgMCksXG4gICAgICAgICAgICAgICAgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgLTEpXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgZnVuY3Rpb24gZXhpc3RzKGNlbGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGNlbGxzXzIgPSBjZWxsczsgX2kgPCBjZWxsc18yLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IGNlbGxzXzJbX2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbC5lcXVhbHMoYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgZGlyZWN0aW9uc18xID0gZGlyZWN0aW9uczsgX2kgPCBkaXJlY3Rpb25zXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGRpcmVjdGlvbnNfMVtfaV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBjZWxsc18xID0gY2VsbHM7IF9hIDwgY2VsbHNfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBjZWxsc18xW19hXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0VmVjdG9yID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMSArICgtbWFpbl8xLkdSSURfU0laRSk7IGkgPCBtYWluXzEuR1JJRF9TSVpFOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRWZWN0b3IgPSBjZWxsLmFkZFZlY3RvcihkaXJlY3Rpb24ubXVsdGlwbHkoaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRWZWN0b3IuaXNPdXRPZkJvdW5kcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKG5leHRWZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA9PT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaW5kRml2ZUluQVJvdyh4Q2VsbHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gR2FtZVN5bWJvbC5YO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZpbmRGaXZlSW5BUm93KG9DZWxscykpIHtcbiAgICAgICAgICAgIHJldHVybiBHYW1lU3ltYm9sLk87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEdhbWVTeW1ib2wuTk9ORTtcbiAgICB9O1xuICAgIEdhbWVHcmlkLnByb3RvdHlwZS5hZGRTeW1ib2wgPSBmdW5jdGlvbiAocG9zLCBzeW1ib2wpIHtcbiAgICAgICAgdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldID0gc3ltYm9sO1xuICAgIH07XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldFN5bWJvbEF0ID0gZnVuY3Rpb24gKHBvcykge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldO1xuICAgIH07XG4gICAgcmV0dXJuIEdhbWVHcmlkO1xufSgpKTtcbmV4cG9ydHMuR2FtZUdyaWQgPSBHYW1lR3JpZDtcbnZhciBHYW1lTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZU1vZGVsKGdyaWQsIHN5bWJvbFBsYXlpbmcpIHtcbiAgICB9XG4gICAgcmV0dXJuIEdhbWVNb2RlbDtcbn0oKSk7XG5leHBvcnRzLkdhbWVNb2RlbCA9IEdhbWVNb2RlbDtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuR1JJRF9TSVpFID0gdm9pZCAwO1xudmFyIGNvbnZlcnRfMSA9IHJlcXVpcmUoXCIuL2NvbnZlcnRcIik7XG52YXIgZ2FtZV9tb2RlbF8xID0gcmVxdWlyZShcIi4vZ2FtZS1tb2RlbFwiKTtcbnZhciBhaV8xID0gcmVxdWlyZShcIi4vYWlcIik7XG5leHBvcnRzLkdSSURfU0laRSA9IDE1O1xuY29uc29sZS5sb2coXCJTdGFydGluZyB0aGUgYXBwbGljYXRpb25cIik7XG52YXIgZ2FtZUdyaWQgPSBuZXcgZ2FtZV9tb2RlbF8xLkdhbWVHcmlkKCk7XG52YXIgcGxheWVyU3ltYm9sID0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuWDtcbnZhciBhaVN5bWJvbCA9IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk87XG52YXIgcGxheWluZyA9IHRydWU7XG4vLyBIYW5kbGluZyBjbGlja1xuJChmdW5jdGlvbiAoKSB7XG4gICAgJChcIi5jZWxsXCIpLmJpbmQoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgICAgdmFyIGNsaWNrUG9zaXRpb24gPSAoMCwgY29udmVydF8xLmluZGV4VG9WZWN0b3IpKGVsZW1lbnQuaW5kZXgoKSk7XG4gICAgICAgIC8vIFdlIGNhbm5vdCBwbGFjZSBzeW1ib2wgdG8gY2VsbCB3aGljaCBhbHJlYWR5IGhhcyBhbm90aGVyIG9uZVxuICAgICAgICBpZiAoZ2FtZUdyaWQuZ2V0U3ltYm9sQXQoY2xpY2tQb3NpdGlvbikgIT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5U3ltYm9sKGNsaWNrUG9zaXRpb24sIHBsYXllclN5bWJvbCk7XG4gICAgICAgIHNhdmVTeW1ib2woY2xpY2tQb3NpdGlvbiwgcGxheWVyU3ltYm9sKTtcbiAgICAgICAgaWYgKGdhbWVHcmlkLmZpbmRGaXZlSW5BUm93KCkgPT09IHBsYXllclN5bWJvbCkge1xuICAgICAgICAgICAgcGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb25ncmF0cyEgWW91IGhhdmUgd29uIHRoZSBnYW1lIVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVDbGljayhjbGlja1Bvc2l0aW9uKTtcbiAgICB9KTtcbn0pO1xuLy8gRGlzcGxheSBzdHVmZlxuZnVuY3Rpb24gZGlzcGxheVN5bWJvbChwb3NpdGlvbiwgc3ltYm9sKSB7XG4gICAgJChcIi5nYW1lLWdyaWRcIilcbiAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgLmVxKCgwLCBjb252ZXJ0XzEudmVjdG9yVG9JbmRleCkocG9zaXRpb24pKVxuICAgICAgICAuYWRkQ2xhc3Moc3ltYm9sKTtcbn1cbmZ1bmN0aW9uIHNhdmVTeW1ib2wocG9zaXRpb24sIHN5bWJvbCkge1xuICAgIGdhbWVHcmlkLmFkZFN5bWJvbChwb3NpdGlvbiwgc3ltYm9sKTtcbn1cbi8vIEdhbWUgc3R1ZmZcbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKGNsaWNrUG9zaXRpb24pIHtcbiAgICB2YXIgYWlNb3ZlID0gKG5ldyBhaV8xLkFJdjEoZ2FtZUdyaWQpKS5wbGF5KGFpU3ltYm9sKTtcbiAgICBkaXNwbGF5U3ltYm9sKGFpTW92ZSwgYWlTeW1ib2wpO1xuICAgIHNhdmVTeW1ib2woYWlNb3ZlLCBhaVN5bWJvbCk7XG4gICAgaWYgKGdhbWVHcmlkLmZpbmRGaXZlSW5BUm93KCkgPT09IGFpU3ltYm9sKSB7XG4gICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJZb3UgbG9zZVwiKTtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLlZlY3RvcjIgPSB2b2lkIDA7XG52YXIgbWFpbl8xID0gcmVxdWlyZShcIi4vbWFpblwiKTtcbnZhciBWZWN0b3IyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFZlY3RvcjIoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBWZWN0b3IyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICsgeCwgdGhpcy55ICsgeSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5hZGRWZWN0b3IgPSBmdW5jdGlvbiAodmVjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZCh2ZWMueCwgdmVjLnkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoLXgsIC15KTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLnN1YnRyYWN0VmVjdG9yID0gZnVuY3Rpb24gKHZlYykge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoLXZlYy54LCAtdmVjLnkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICogaSwgdGhpcy55ICogaSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5kaXZpZGUgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseSgxIC8gaSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAodmVjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IHZlYy54ICYmIHRoaXMueSA9PT0gdmVjLnk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5pc091dE9mQm91bmRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54IDwgMCB8fCB0aGlzLnggPj0gbWFpbl8xLkdSSURfU0laRSB8fCB0aGlzLnkgPCAwIHx8IHRoaXMueSA+PSBtYWluXzEuR1JJRF9TSVpFO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZ2V0WCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmdldFkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnk7XG4gICAgfTtcbiAgICByZXR1cm4gVmVjdG9yMjtcbn0oKSk7XG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=