/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ai.ts":
/*!*******************!*\
  !*** ./src/ai.ts ***!
  \*******************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.AIv2 = void 0;
var game_model_1 = __webpack_require__(/*! ./game-model */ "./src/game-model.ts");
function findIndex(pos, arr) {
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i].equals(pos)) {
            return i;
        }
    }
    return undefined;
}
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
var AIv2 = /** @class */ (function (_super) {
    __extends(AIv2, _super);
    function AIv2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AIv2.prototype.prioritizeCells = function (cells, priorities, symbol) {
        priorities = _super.prototype.prioritizeCells.call(this, cells, priorities, symbol);
        var threeInRow = (new game_model_1.GameModel(this.getGrid(), (0, game_model_1.opponentSymbol)(symbol))).getThreeInRow();
        if (threeInRow.length !== 0) {
            for (var _i = 0, threeInRow_1 = threeInRow; _i < threeInRow_1.length; _i++) {
                var row = threeInRow_1[_i];
                priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += 9;
                priorities[findIndex(row.row[2].addVector(row.direction), cells)] += 9;
            }
        }
        return priorities;
    };
    return AIv2;
}(AIv1));
exports.AIv2 = AIv2;


/***/ }),

/***/ "./src/convert.ts":
/*!************************!*\
  !*** ./src/convert.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.indexToVector = exports.vectorToIndex = exports.coordsToIndex = void 0;
var gomoku = __webpack_require__(/*! ./main */ "./src/main.ts");
var vector_1 = __webpack_require__(/*! ./vector */ "./src/vector.ts");
function coordsToIndex(x, y) {
    return y * gomoku.GRID_SIZE + x;
}
exports.coordsToIndex = coordsToIndex;
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
exports.GameModel = exports.SymbolRow = exports.GameGrid = exports.opponentSymbol = exports.GameSymbol = exports.DIRECTIONS = void 0;
var vector_1 = __webpack_require__(/*! ./vector */ "./src/vector.ts");
var main_1 = __webpack_require__(/*! ./main */ "./src/main.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
exports.DIRECTIONS = [
    new vector_1.Vector2(1, 1),
    new vector_1.Vector2(0, 1),
    new vector_1.Vector2(1, 0),
    new vector_1.Vector2(1, -1)
];
var GameSymbol;
(function (GameSymbol) {
    GameSymbol["X"] = "x";
    GameSymbol["O"] = "o";
    GameSymbol["NONE"] = "";
})(GameSymbol = exports.GameSymbol || (exports.GameSymbol = {}));
function opponentSymbol(symbol) {
    return symbol === GameSymbol.X ? GameSymbol.O : GameSymbol.X;
}
exports.opponentSymbol = opponentSymbol;
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
        var minY = Math.min(Math.max(pos.getY() - i, 0), main_1.GRID_SIZE);
        var maxY = Math.min(Math.max(pos.getY() + i, 0), main_1.GRID_SIZE);
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
        function findFiveInRow(cells) {
            function exists(cell) {
                for (var _i = 0, cells_2 = cells; _i < cells_2.length; _i++) {
                    var c = cells_2[_i];
                    if (cell.equals(c)) {
                        return true;
                    }
                }
                return false;
            }
            for (var _i = 0, DIRECTIONS_1 = exports.DIRECTIONS; _i < DIRECTIONS_1.length; _i++) {
                var direction = DIRECTIONS_1[_i];
                for (var _a = 0, cells_1 = cells; _a < cells_1.length; _a++) {
                    var cell = cells_1[_a];
                    var row = 0;
                    var nextVector = void 0;
                    for (var i = 1 - main_1.GRID_SIZE; i < main_1.GRID_SIZE; ++i) {
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
        if (findFiveInRow(xCells)) {
            return GameSymbol.X;
        }
        else if (findFiveInRow(oCells)) {
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
var SymbolRow = /** @class */ (function () {
    function SymbolRow(row, direction) {
        this.row = row;
        this.direction = direction;
    }
    return SymbolRow;
}());
exports.SymbolRow = SymbolRow;
var GameModel = /** @class */ (function () {
    function GameModel(grid, symbol) {
        this.twoInARow = [];
        this.threeInARow = [];
        this.grid = grid;
        this.symbol = symbol;
        this.analyseGrid();
    }
    GameModel.prototype.analyseGrid = function () {
        var symbols = this.grid.getCellsWithSymbol(this.symbol);
        var nextVector;
        var nextSymbol;
        for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
            var symbol = symbols_1[_i];
            for (var _a = 0, DIRECTIONS_2 = exports.DIRECTIONS; _a < DIRECTIONS_2.length; _a++) {
                var direction = DIRECTIONS_2[_a];
                var symbolsFound = [];
                var iteration = 0;
                var emptyCell = false;
                for (var i = 1 - main_1.GRID_SIZE; i < main_1.GRID_SIZE; ++i) {
                    nextVector = symbol.addVector(direction.multiply(i)); // next vector in the row
                    if (nextVector.isOutOfBounds()) { // if the vector is not inside of the grid, continue
                        continue;
                    }
                    nextSymbol = this.grid.getSymbolAt(nextVector); // symbol located at next vector
                    // cells are being counted from first non-empty cell so that we return either open or closed row
                    // if next symbol is ai's then we add them to the array when the condition (cell before is empty or we are not on first iteration)
                    if ((iteration !== 0 || emptyCell) && nextSymbol === this.symbol) {
                        iteration++;
                        symbolsFound.push(nextVector);
                        emptyCell = false;
                        console.log("Found " + iteration + ". symbol in a row");
                    }
                    if (nextSymbol !== this.symbol || nextVector.isEdgeCell()) {
                        var symbolRow = new SymbolRow(symbolsFound, direction);
                        switch (iteration) {
                            case 2:
                                this.twoInARow.push((0, utils_1.clone)(symbolRow));
                                break;
                            case 3:
                                this.threeInARow.push((0, utils_1.clone)(symbolRow));
                                console.log("s: " + symbolsFound.length + "; i: " + iteration);
                                break;
                        }
                    }
                    if (nextSymbol === GameSymbol.NONE) {
                        emptyCell = true;
                        iteration = 0;
                        symbolsFound = [];
                    }
                }
            }
        }
        console.log("Grid analysed");
        console.log(this.threeInARow);
    };
    GameModel.prototype.getTwoInRow = function () {
        return this.twoInARow;
    };
    GameModel.prototype.getThreeInRow = function () {
        return this.threeInARow;
    };
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
    var aiMove = (new ai_1.AIv2(gameGrid)).play(aiSymbol);
    displaySymbol(aiMove, aiSymbol);
    saveSymbol(aiMove, aiSymbol);
    if (gameGrid.findFiveInARow() === aiSymbol) {
        playing = false;
        console.log("You lose");
    }
}


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.cloneObjectArray = exports.clone = void 0;
function clone(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}
exports.clone = clone;
function cloneObjectArray(arr) {
    var cloneArr = [];
    for (var i = 0; i < arr.length; ++i) {
        cloneArr[i] = clone(arr[i]);
    }
    return cloneArr;
}
exports.cloneObjectArray = cloneObjectArray;


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
    Vector2.prototype.isEdgeCell = function () {
        return this.x === 0 || this.y === 0 || this.x + 1 === main_1.GRID_SIZE || this.y + 1 === main_1.GRID_SIZE;
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNyRGE7QUFDYixrQkFBa0I7QUFDbEIsd0JBQXdCLEdBQUcsYUFBYTtBQUN4QztBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLG9CQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7Ozs7Ozs7Ozs7O0FDZFg7QUFDYixrQkFBa0I7QUFDbEIsZUFBZTtBQUNmLGFBQWEsbUJBQU8sQ0FBQyw2QkFBUTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZUFBZTs7Ozs7OztVQzVDZjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2FpLnRzIiwid2VicGFjazovLy8uL3NyYy9jb252ZXJ0LnRzIiwid2VicGFjazovLy8uL3NyYy9nYW1lLW1vZGVsLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuQUl2MiA9IHZvaWQgMDtcbnZhciBnYW1lX21vZGVsXzEgPSByZXF1aXJlKFwiLi9nYW1lLW1vZGVsXCIpO1xuZnVuY3Rpb24gZmluZEluZGV4KHBvcywgYXJyKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKGFycltpXS5lcXVhbHMocG9zKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbnZhciBBSXYxID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFJdjEoZ3JpZCkge1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkO1xuICAgIH1cbiAgICBBSXYxLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24gKHN5bWJvbCkge1xuICAgICAgICB2YXIgZW1wdHlDZWxscyA9IHRoaXMuZ3JpZC5nZXRFbXB0eUNlbGxzKCk7XG4gICAgICAgIHZhciBwcmlvcml0aWVzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW1wdHlDZWxscy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcHJpb3JpdGllc1tpXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcHJpb3JpdGllcyA9IHRoaXMucHJpb3JpdGl6ZUNlbGxzKGVtcHR5Q2VsbHMsIHByaW9yaXRpZXMsIHN5bWJvbCk7XG4gICAgICAgIHZhciBtYXhQcmlvcml0eSA9IC0xO1xuICAgICAgICB2YXIgZmluYWxQb3NpdGlvbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmlvcml0aWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAocHJpb3JpdGllc1tpXSA9PSBtYXhQcmlvcml0eSAmJiBNYXRoLnJhbmRvbSgpID4gMC43KSB7XG4gICAgICAgICAgICAgICAgZmluYWxQb3NpdGlvbiA9IGVtcHR5Q2VsbHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChwcmlvcml0aWVzW2ldID4gbWF4UHJpb3JpdHkpIHtcbiAgICAgICAgICAgICAgICBtYXhQcmlvcml0eSA9IHByaW9yaXRpZXNbaV07XG4gICAgICAgICAgICAgICAgZmluYWxQb3NpdGlvbiA9IGVtcHR5Q2VsbHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbmFsUG9zaXRpb247XG4gICAgfTtcbiAgICBBSXYxLnByb3RvdHlwZS5wcmlvcml0aXplQ2VsbHMgPSBmdW5jdGlvbiAoY2VsbHMsIHByaW9yaXRpZXMsIHN5bWJvbCkge1xuICAgICAgICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgdmFyIG9wcG9uZW50c1N5bWJvbCA9IHN5bWJvbCA9PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5YID8gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTyA6IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLlg7XG4gICAgICAgIHZhciBvcHBvbmVudHNDZWxscyA9IGdyaWQuZ2V0Q2VsbHNXaXRoU3ltYm9sKG9wcG9uZW50c1N5bWJvbCk7XG4gICAgICAgIG9wcG9uZW50c0NlbGxzLmZvckVhY2goZnVuY3Rpb24gKHBvcykge1xuICAgICAgICAgICAgZ3JpZC5nZXRDZWxsc0Fyb3VuZChwb3MsIDEpLmZvckVhY2goZnVuY3Rpb24gKHBvc0Fyb3VuZCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2VsbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc0Fyb3VuZC5lcXVhbHMoY2VsbHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ldKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcmlvcml0aWVzO1xuICAgIH07XG4gICAgQUl2MS5wcm90b3R5cGUuZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZDtcbiAgICB9O1xuICAgIHJldHVybiBBSXYxO1xufSgpKTtcbnZhciBBSXYyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBSXYyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFJdjIoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgQUl2Mi5wcm90b3R5cGUucHJpb3JpdGl6ZUNlbGxzID0gZnVuY3Rpb24gKGNlbGxzLCBwcmlvcml0aWVzLCBzeW1ib2wpIHtcbiAgICAgICAgcHJpb3JpdGllcyA9IF9zdXBlci5wcm90b3R5cGUucHJpb3JpdGl6ZUNlbGxzLmNhbGwodGhpcywgY2VsbHMsIHByaW9yaXRpZXMsIHN5bWJvbCk7XG4gICAgICAgIHZhciB0aHJlZUluUm93ID0gKG5ldyBnYW1lX21vZGVsXzEuR2FtZU1vZGVsKHRoaXMuZ2V0R3JpZCgpLCAoMCwgZ2FtZV9tb2RlbF8xLm9wcG9uZW50U3ltYm9sKShzeW1ib2wpKSkuZ2V0VGhyZWVJblJvdygpO1xuICAgICAgICBpZiAodGhyZWVJblJvdy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgdGhyZWVJblJvd18xID0gdGhyZWVJblJvdzsgX2kgPCB0aHJlZUluUm93XzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRocmVlSW5Sb3dfMVtfaV07XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKSwgY2VsbHMpXSArPSA5O1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KHJvdy5yb3dbMl0uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IDk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByaW9yaXRpZXM7XG4gICAgfTtcbiAgICByZXR1cm4gQUl2Mjtcbn0oQUl2MSkpO1xuZXhwb3J0cy5BSXYyID0gQUl2MjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuaW5kZXhUb1ZlY3RvciA9IGV4cG9ydHMudmVjdG9yVG9JbmRleCA9IGV4cG9ydHMuY29vcmRzVG9JbmRleCA9IHZvaWQgMDtcbnZhciBnb21va3UgPSByZXF1aXJlKFwiLi9tYWluXCIpO1xudmFyIHZlY3Rvcl8xID0gcmVxdWlyZShcIi4vdmVjdG9yXCIpO1xuZnVuY3Rpb24gY29vcmRzVG9JbmRleCh4LCB5KSB7XG4gICAgcmV0dXJuIHkgKiBnb21va3UuR1JJRF9TSVpFICsgeDtcbn1cbmV4cG9ydHMuY29vcmRzVG9JbmRleCA9IGNvb3Jkc1RvSW5kZXg7XG5mdW5jdGlvbiBnZXRJbmRleFgoaW5kZXgpIHtcbiAgICByZXR1cm4gaW5kZXggJSBnb21va3UuR1JJRF9TSVpFO1xufVxuZnVuY3Rpb24gZ2V0SW5kZXhZKGluZGV4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoaW5kZXggLyBnb21va3UuR1JJRF9TSVpFKTtcbn1cbmZ1bmN0aW9uIHZlY3RvclRvSW5kZXgodmVjKSB7XG4gICAgcmV0dXJuIGNvb3Jkc1RvSW5kZXgodmVjLmdldFgoKSwgdmVjLmdldFkoKSk7XG59XG5leHBvcnRzLnZlY3RvclRvSW5kZXggPSB2ZWN0b3JUb0luZGV4O1xuZnVuY3Rpb24gaW5kZXhUb1ZlY3RvcihpbmRleCkge1xuICAgIHJldHVybiBuZXcgdmVjdG9yXzEuVmVjdG9yMihnZXRJbmRleFgoaW5kZXgpLCBnZXRJbmRleFkoaW5kZXgpKTtcbn1cbmV4cG9ydHMuaW5kZXhUb1ZlY3RvciA9IGluZGV4VG9WZWN0b3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkdhbWVNb2RlbCA9IGV4cG9ydHMuU3ltYm9sUm93ID0gZXhwb3J0cy5HYW1lR3JpZCA9IGV4cG9ydHMub3Bwb25lbnRTeW1ib2wgPSBleHBvcnRzLkdhbWVTeW1ib2wgPSBleHBvcnRzLkRJUkVDVElPTlMgPSB2b2lkIDA7XG52YXIgdmVjdG9yXzEgPSByZXF1aXJlKFwiLi92ZWN0b3JcIik7XG52YXIgbWFpbl8xID0gcmVxdWlyZShcIi4vbWFpblwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG5leHBvcnRzLkRJUkVDVElPTlMgPSBbXG4gICAgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgMSksXG4gICAgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMCwgMSksXG4gICAgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgMCksXG4gICAgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgLTEpXG5dO1xudmFyIEdhbWVTeW1ib2w7XG4oZnVuY3Rpb24gKEdhbWVTeW1ib2wpIHtcbiAgICBHYW1lU3ltYm9sW1wiWFwiXSA9IFwieFwiO1xuICAgIEdhbWVTeW1ib2xbXCJPXCJdID0gXCJvXCI7XG4gICAgR2FtZVN5bWJvbFtcIk5PTkVcIl0gPSBcIlwiO1xufSkoR2FtZVN5bWJvbCA9IGV4cG9ydHMuR2FtZVN5bWJvbCB8fCAoZXhwb3J0cy5HYW1lU3ltYm9sID0ge30pKTtcbmZ1bmN0aW9uIG9wcG9uZW50U3ltYm9sKHN5bWJvbCkge1xuICAgIHJldHVybiBzeW1ib2wgPT09IEdhbWVTeW1ib2wuWCA/IEdhbWVTeW1ib2wuTyA6IEdhbWVTeW1ib2wuWDtcbn1cbmV4cG9ydHMub3Bwb25lbnRTeW1ib2wgPSBvcHBvbmVudFN5bWJvbDtcbnZhciBHYW1lR3JpZCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBHYW1lR3JpZCgpIHtcbiAgICAgICAgdGhpcy5ncmlkID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbWFpbl8xLkdSSURfU0laRTsgKyt4KSB7XG4gICAgICAgICAgICB0aGlzLmdyaWRbeF0gPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgbWFpbl8xLkdSSURfU0laRTsgKyt5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkW3hdW3ldID0gR2FtZVN5bWJvbC5OT05FO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIEdhbWVHcmlkLnByb3RvdHlwZS5nZXRDZWxsc1dpdGhTeW1ib2wgPSBmdW5jdGlvbiAoc3ltYm9sKSB7XG4gICAgICAgIHZhciBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG1haW5fMS5HUklEX1NJWkU7ICsreCkge1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBtYWluXzEuR1JJRF9TSVpFOyArK3kpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ncmlkW3hdW3ldID09IHN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICBjZWxscy5wdXNoKG5ldyB2ZWN0b3JfMS5WZWN0b3IyKHgsIHkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNlbGxzO1xuICAgIH07XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldEVtcHR5Q2VsbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENlbGxzV2l0aFN5bWJvbChHYW1lU3ltYm9sLk5PTkUpO1xuICAgIH07XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldENlbGxzQXJvdW5kID0gZnVuY3Rpb24gKHBvcywgaSwgZ2FtZVN5bWJvbCkge1xuICAgICAgICBpZiAoaSA9PT0gdm9pZCAwKSB7IGkgPSAxOyB9XG4gICAgICAgIGlmIChnYW1lU3ltYm9sID09PSB2b2lkIDApIHsgZ2FtZVN5bWJvbCA9IG51bGw7IH1cbiAgICAgICAgdmFyIG1pblggPSBNYXRoLm1pbihNYXRoLm1heChwb3MuZ2V0WCgpIC0gaSwgMCksIG1haW5fMS5HUklEX1NJWkUpO1xuICAgICAgICB2YXIgbWF4WCA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRYKCkgKyBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBtaW5ZID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLmdldFkoKSAtIGksIDApLCBtYWluXzEuR1JJRF9TSVpFKTtcbiAgICAgICAgdmFyIG1heFkgPSBNYXRoLm1pbihNYXRoLm1heChwb3MuZ2V0WSgpICsgaSwgMCksIG1haW5fMS5HUklEX1NJWkUpO1xuICAgICAgICB2YXIgY2VsbHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IG1pblg7IHggPD0gbWF4WDsgKyt4KSB7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gbWluWTsgeSA8PSBtYXhZOyArK3kpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZVN5bWJvbCA9PT0gbnVsbCB8fCB0aGlzLmdyaWRbeF1beV0gPT0gZ2FtZVN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICBjZWxscy5wdXNoKG5ldyB2ZWN0b3JfMS5WZWN0b3IyKHgsIHkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNlbGxzO1xuICAgIH07XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmZpbmRGaXZlSW5BUm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgeENlbGxzID0gdGhpcy5nZXRDZWxsc1dpdGhTeW1ib2woR2FtZVN5bWJvbC5YKTtcbiAgICAgICAgdmFyIG9DZWxscyA9IHRoaXMuZ2V0Q2VsbHNXaXRoU3ltYm9sKEdhbWVTeW1ib2wuTyk7XG4gICAgICAgIGZ1bmN0aW9uIGZpbmRGaXZlSW5Sb3coY2VsbHMpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGV4aXN0cyhjZWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBjZWxsc18yID0gY2VsbHM7IF9pIDwgY2VsbHNfMi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSBjZWxsc18yW19pXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGwuZXF1YWxzKGMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIERJUkVDVElPTlNfMSA9IGV4cG9ydHMuRElSRUNUSU9OUzsgX2kgPCBESVJFQ1RJT05TXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IERJUkVDVElPTlNfMVtfaV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBjZWxsc18xID0gY2VsbHM7IF9hIDwgY2VsbHNfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBjZWxsc18xW19hXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0VmVjdG9yID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMSAtIG1haW5fMS5HUklEX1NJWkU7IGkgPCBtYWluXzEuR1JJRF9TSVpFOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRWZWN0b3IgPSBjZWxsLmFkZFZlY3RvcihkaXJlY3Rpb24ubXVsdGlwbHkoaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRWZWN0b3IuaXNPdXRPZkJvdW5kcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKG5leHRWZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA9PT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaW5kRml2ZUluUm93KHhDZWxscykpIHtcbiAgICAgICAgICAgIHJldHVybiBHYW1lU3ltYm9sLlg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZmluZEZpdmVJblJvdyhvQ2VsbHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gR2FtZVN5bWJvbC5PO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBHYW1lU3ltYm9sLk5PTkU7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuYWRkU3ltYm9sID0gZnVuY3Rpb24gKHBvcywgc3ltYm9sKSB7XG4gICAgICAgIHRoaXMuZ3JpZFtwb3MuZ2V0WCgpXVtwb3MuZ2V0WSgpXSA9IHN5bWJvbDtcbiAgICB9O1xuICAgIEdhbWVHcmlkLnByb3RvdHlwZS5nZXRTeW1ib2xBdCA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZFtwb3MuZ2V0WCgpXVtwb3MuZ2V0WSgpXTtcbiAgICB9O1xuICAgIHJldHVybiBHYW1lR3JpZDtcbn0oKSk7XG5leHBvcnRzLkdhbWVHcmlkID0gR2FtZUdyaWQ7XG52YXIgU3ltYm9sUm93ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN5bWJvbFJvdyhyb3csIGRpcmVjdGlvbikge1xuICAgICAgICB0aGlzLnJvdyA9IHJvdztcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBTeW1ib2xSb3c7XG59KCkpO1xuZXhwb3J0cy5TeW1ib2xSb3cgPSBTeW1ib2xSb3c7XG52YXIgR2FtZU1vZGVsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEdhbWVNb2RlbChncmlkLCBzeW1ib2wpIHtcbiAgICAgICAgdGhpcy50d29JbkFSb3cgPSBbXTtcbiAgICAgICAgdGhpcy50aHJlZUluQVJvdyA9IFtdO1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkO1xuICAgICAgICB0aGlzLnN5bWJvbCA9IHN5bWJvbDtcbiAgICAgICAgdGhpcy5hbmFseXNlR3JpZCgpO1xuICAgIH1cbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLmFuYWx5c2VHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3ltYm9scyA9IHRoaXMuZ3JpZC5nZXRDZWxsc1dpdGhTeW1ib2wodGhpcy5zeW1ib2wpO1xuICAgICAgICB2YXIgbmV4dFZlY3RvcjtcbiAgICAgICAgdmFyIG5leHRTeW1ib2w7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgc3ltYm9sc18xID0gc3ltYm9sczsgX2kgPCBzeW1ib2xzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3ltYm9sID0gc3ltYm9sc18xW19pXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgRElSRUNUSU9OU18yID0gZXhwb3J0cy5ESVJFQ1RJT05TOyBfYSA8IERJUkVDVElPTlNfMi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gRElSRUNUSU9OU18yW19hXTtcbiAgICAgICAgICAgICAgICB2YXIgc3ltYm9sc0ZvdW5kID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGl0ZXJhdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIGVtcHR5Q2VsbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxIC0gbWFpbl8xLkdSSURfU0laRTsgaSA8IG1haW5fMS5HUklEX1NJWkU7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0VmVjdG9yID0gc3ltYm9sLmFkZFZlY3RvcihkaXJlY3Rpb24ubXVsdGlwbHkoaSkpOyAvLyBuZXh0IHZlY3RvciBpbiB0aGUgcm93XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0VmVjdG9yLmlzT3V0T2ZCb3VuZHMoKSkgeyAvLyBpZiB0aGUgdmVjdG9yIGlzIG5vdCBpbnNpZGUgb2YgdGhlIGdyaWQsIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0U3ltYm9sID0gdGhpcy5ncmlkLmdldFN5bWJvbEF0KG5leHRWZWN0b3IpOyAvLyBzeW1ib2wgbG9jYXRlZCBhdCBuZXh0IHZlY3RvclxuICAgICAgICAgICAgICAgICAgICAvLyBjZWxscyBhcmUgYmVpbmcgY291bnRlZCBmcm9tIGZpcnN0IG5vbi1lbXB0eSBjZWxsIHNvIHRoYXQgd2UgcmV0dXJuIGVpdGhlciBvcGVuIG9yIGNsb3NlZCByb3dcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgbmV4dCBzeW1ib2wgaXMgYWkncyB0aGVuIHdlIGFkZCB0aGVtIHRvIHRoZSBhcnJheSB3aGVuIHRoZSBjb25kaXRpb24gKGNlbGwgYmVmb3JlIGlzIGVtcHR5IG9yIHdlIGFyZSBub3Qgb24gZmlyc3QgaXRlcmF0aW9uKVxuICAgICAgICAgICAgICAgICAgICBpZiAoKGl0ZXJhdGlvbiAhPT0gMCB8fCBlbXB0eUNlbGwpICYmIG5leHRTeW1ib2wgPT09IHRoaXMuc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRpb24rKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bWJvbHNGb3VuZC5wdXNoKG5leHRWZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1wdHlDZWxsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZvdW5kIFwiICsgaXRlcmF0aW9uICsgXCIuIHN5bWJvbCBpbiBhIHJvd1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFN5bWJvbCAhPT0gdGhpcy5zeW1ib2wgfHwgbmV4dFZlY3Rvci5pc0VkZ2VDZWxsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzeW1ib2xSb3cgPSBuZXcgU3ltYm9sUm93KHN5bWJvbHNGb3VuZCwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoaXRlcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnR3b0luQVJvdy5wdXNoKCgwLCB1dGlsc18xLmNsb25lKShzeW1ib2xSb3cpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocmVlSW5BUm93LnB1c2goKDAsIHV0aWxzXzEuY2xvbmUpKHN5bWJvbFJvdykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInM6IFwiICsgc3ltYm9sc0ZvdW5kLmxlbmd0aCArIFwiOyBpOiBcIiArIGl0ZXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0U3ltYm9sID09PSBHYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtcHR5Q2VsbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sc0ZvdW5kID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJHcmlkIGFuYWx5c2VkXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnRocmVlSW5BUm93KTtcbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuZ2V0VHdvSW5Sb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR3b0luQVJvdztcbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuZ2V0VGhyZWVJblJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhyZWVJbkFSb3c7XG4gICAgfTtcbiAgICByZXR1cm4gR2FtZU1vZGVsO1xufSgpKTtcbmV4cG9ydHMuR2FtZU1vZGVsID0gR2FtZU1vZGVsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5HUklEX1NJWkUgPSB2b2lkIDA7XG52YXIgY29udmVydF8xID0gcmVxdWlyZShcIi4vY29udmVydFwiKTtcbnZhciBnYW1lX21vZGVsXzEgPSByZXF1aXJlKFwiLi9nYW1lLW1vZGVsXCIpO1xudmFyIGFpXzEgPSByZXF1aXJlKFwiLi9haVwiKTtcbmV4cG9ydHMuR1JJRF9TSVpFID0gMTU7XG5jb25zb2xlLmxvZyhcIlN0YXJ0aW5nIHRoZSBhcHBsaWNhdGlvblwiKTtcbnZhciBnYW1lR3JpZCA9IG5ldyBnYW1lX21vZGVsXzEuR2FtZUdyaWQoKTtcbnZhciBwbGF5ZXJTeW1ib2wgPSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5YO1xudmFyIGFpU3ltYm9sID0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTztcbnZhciBwbGF5aW5nID0gdHJ1ZTtcbi8vIEhhbmRsaW5nIGNsaWNrXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiLmNlbGxcIikuYmluZChcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAgICB2YXIgY2xpY2tQb3NpdGlvbiA9ICgwLCBjb252ZXJ0XzEuaW5kZXhUb1ZlY3RvcikoZWxlbWVudC5pbmRleCgpKTtcbiAgICAgICAgLy8gV2UgY2Fubm90IHBsYWNlIHN5bWJvbCB0byBjZWxsIHdoaWNoIGFscmVhZHkgaGFzIGFub3RoZXIgb25lXG4gICAgICAgIGlmIChnYW1lR3JpZC5nZXRTeW1ib2xBdChjbGlja1Bvc2l0aW9uKSAhPT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGxheWluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXlTeW1ib2woY2xpY2tQb3NpdGlvbiwgcGxheWVyU3ltYm9sKTtcbiAgICAgICAgc2F2ZVN5bWJvbChjbGlja1Bvc2l0aW9uLCBwbGF5ZXJTeW1ib2wpO1xuICAgICAgICBpZiAoZ2FtZUdyaWQuZmluZEZpdmVJbkFSb3coKSA9PT0gcGxheWVyU3ltYm9sKSB7XG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbmdyYXRzISBZb3UgaGF2ZSB3b24gdGhlIGdhbWUhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGhhbmRsZUNsaWNrKGNsaWNrUG9zaXRpb24pO1xuICAgIH0pO1xufSk7XG4vLyBEaXNwbGF5IHN0dWZmXG5mdW5jdGlvbiBkaXNwbGF5U3ltYm9sKHBvc2l0aW9uLCBzeW1ib2wpIHtcbiAgICAkKFwiLmdhbWUtZ3JpZFwiKVxuICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAuZXEoKDAsIGNvbnZlcnRfMS52ZWN0b3JUb0luZGV4KShwb3NpdGlvbikpXG4gICAgICAgIC5hZGRDbGFzcyhzeW1ib2wpO1xufVxuZnVuY3Rpb24gc2F2ZVN5bWJvbChwb3NpdGlvbiwgc3ltYm9sKSB7XG4gICAgZ2FtZUdyaWQuYWRkU3ltYm9sKHBvc2l0aW9uLCBzeW1ib2wpO1xufVxuLy8gR2FtZSBzdHVmZlxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soY2xpY2tQb3NpdGlvbikge1xuICAgIHZhciBhaU1vdmUgPSAobmV3IGFpXzEuQUl2MihnYW1lR3JpZCkpLnBsYXkoYWlTeW1ib2wpO1xuICAgIGRpc3BsYXlTeW1ib2woYWlNb3ZlLCBhaVN5bWJvbCk7XG4gICAgc2F2ZVN5bWJvbChhaU1vdmUsIGFpU3ltYm9sKTtcbiAgICBpZiAoZ2FtZUdyaWQuZmluZEZpdmVJbkFSb3coKSA9PT0gYWlTeW1ib2wpIHtcbiAgICAgICAgcGxheWluZyA9IGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZyhcIllvdSBsb3NlXCIpO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuY2xvbmVPYmplY3RBcnJheSA9IGV4cG9ydHMuY2xvbmUgPSB2b2lkIDA7XG5mdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopKSwgb2JqKTtcbn1cbmV4cG9ydHMuY2xvbmUgPSBjbG9uZTtcbmZ1bmN0aW9uIGNsb25lT2JqZWN0QXJyYXkoYXJyKSB7XG4gICAgdmFyIGNsb25lQXJyID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY2xvbmVBcnJbaV0gPSBjbG9uZShhcnJbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gY2xvbmVBcnI7XG59XG5leHBvcnRzLmNsb25lT2JqZWN0QXJyYXkgPSBjbG9uZU9iamVjdEFycmF5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5WZWN0b3IyID0gdm9pZCAwO1xudmFyIG1haW5fMSA9IHJlcXVpcmUoXCIuL21haW5cIik7XG52YXIgVmVjdG9yMiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBWZWN0b3IyKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCArIHgsIHRoaXMueSArIHkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuYWRkVmVjdG9yID0gZnVuY3Rpb24gKHZlYykge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQodmVjLngsIHZlYy55KTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKC14LCAteSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5zdWJ0cmFjdFZlY3RvciA9IGZ1bmN0aW9uICh2ZWMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKC12ZWMueCwgLXZlYy55KTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAqIGksIHRoaXMueSAqIGkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZGl2aWRlID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoMSAvIGkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gKHZlYykge1xuICAgICAgICByZXR1cm4gdGhpcy54ID09PSB2ZWMueCAmJiB0aGlzLnkgPT09IHZlYy55O1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuaXNFZGdlQ2VsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0gMCB8fCB0aGlzLnkgPT09IDAgfHwgdGhpcy54ICsgMSA9PT0gbWFpbl8xLkdSSURfU0laRSB8fCB0aGlzLnkgKyAxID09PSBtYWluXzEuR1JJRF9TSVpFO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuaXNPdXRPZkJvdW5kcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA8IDAgfHwgdGhpcy54ID49IG1haW5fMS5HUklEX1NJWkUgfHwgdGhpcy55IDwgMCB8fCB0aGlzLnkgPj0gbWFpbl8xLkdSSURfU0laRTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmdldFggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLng7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy55O1xuICAgIH07XG4gICAgcmV0dXJuIFZlY3RvcjI7XG59KCkpO1xuZXhwb3J0cy5WZWN0b3IyID0gVmVjdG9yMjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9