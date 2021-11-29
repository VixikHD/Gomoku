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
exports.AIv2 = exports.AIResult = void 0;
var game_model_1 = __webpack_require__(/*! ./game-model */ "./src/game-model.ts");
function findIndex(pos, arr) {
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i].equals(pos)) {
            return i;
        }
    }
    return undefined;
}
var AIResult = /** @class */ (function () {
    function AIResult(priorities, finalPos) {
        this.priorities = priorities;
        this.finalPos = finalPos;
    }
    return AIResult;
}());
exports.AIResult = AIResult;
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
        return new AIResult(priorities, finalPosition);
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
        var gameModel = new game_model_1.GameModel(this.getGrid(), (0, game_model_1.opponentSymbol)(symbol));
        var threeInRow = gameModel.getOpenThreeInRow();
        for (var _i = 0, threeInRow_1 = threeInRow; _i < threeInRow_1.length; _i++) {
            var row = threeInRow_1[_i];
            priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += 9;
            priorities[findIndex(row.row[2].addVector(row.direction), cells)] += 9;
        }
        var fourInRow = gameModel.getClosedFourInRow();
        for (var _a = 0, fourInRow_1 = fourInRow; _a < fourInRow_1.length; _a++) {
            var row = fourInRow_1[_a];
            if ((!row.row[0].subtractVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction)) == game_model_1.GameSymbol.NONE) {
                priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += 100;
            }
            else if ((!row.row[0].addVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[0].addVector(row.direction)) == game_model_1.GameSymbol.NONE) {
                priorities[findIndex(row.row[0].addVector(row.direction), cells)] += 100;
            }
            else if ((!row.row[3].subtractVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[3].subtractVector(row.direction)) == game_model_1.GameSymbol.NONE) {
                priorities[findIndex(row.row[3].subtractVector(row.direction), cells)] += 100;
            }
            else if ((!row.row[3].addVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[3].addVector(row.direction)) == game_model_1.GameSymbol.NONE) {
                priorities[findIndex(row.row[3].addVector(row.direction), cells)] += 100;
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
var SymbolCollection = /** @class */ (function () {
    function SymbolCollection() {
        this.symbols = [];
    }
    SymbolCollection.prototype.addSymbol = function (symbol) {
        for (var _i = 0, _a = this.symbols; _i < _a.length; _i++) {
            var addedSymbol = _a[_i];
            if (addedSymbol.equals(symbol)) {
                return;
            }
        }
        this.symbols.push(symbol);
    };
    SymbolCollection.prototype.toSymbolRow = function (direction) {
        return new SymbolRow((0, utils_1.cloneObjectArray)(this.symbols), direction);
    };
    SymbolCollection.prototype.length = function () {
        return this.symbols.length;
    };
    return SymbolCollection;
}());
var GameModel = /** @class */ (function () {
    function GameModel(grid, symbol) {
        // 2
        this.twoInRow = [];
        // 3
        this.openThreeInRow = [];
        this.closedThreeInRow = [];
        this.openSplitThreeInRow = [];
        // 4
        this.openFourInRow = [];
        this.closedFourInRow = [];
        this.grid = grid;
        this.symbol = symbol;
        this.analyseGrid();
    }
    GameModel.canSaveRow = function (rows, row) {
        firstLoop: for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var current = rows_1[_i];
            if (row.row.length != current.row.length) {
                continue;
            }
            for (var i = 0; i < current.row.length; ++i) {
                if (!current.row[i].equals(row.row[i])) {
                    continue firstLoop;
                }
            }
            return false;
        }
        return true;
    };
    GameModel.prototype.analyseGrid = function () {
        // \/
        for (var x = 0; x < main_1.GRID_SIZE; ++x) {
            this.analyseRow(new vector_1.Vector2(x, 0), new vector_1.Vector2(0, 1));
        }
        // ->
        for (var y = 0; y < main_1.GRID_SIZE; ++y) {
            this.analyseRow(new vector_1.Vector2(0, y), new vector_1.Vector2(1, 0));
        }
        // _\|
        this.analyseRow(new vector_1.Vector2(0, 0), new vector_1.Vector2(1, 1));
        for (var diagonalA = 1; diagonalA < main_1.GRID_SIZE - 4; ++diagonalA) {
            this.analyseRow(new vector_1.Vector2(diagonalA, 0), new vector_1.Vector2(1, 1));
            this.analyseRow(new vector_1.Vector2(0, diagonalA), new vector_1.Vector2(1, 1));
        }
        // ˝/|
        this.analyseRow(new vector_1.Vector2(0, main_1.GRID_SIZE - 1), new vector_1.Vector2(1, -1));
        for (var diagonalB = 1; diagonalB < main_1.GRID_SIZE - 4; ++diagonalB) {
            this.analyseRow(new vector_1.Vector2(0, (main_1.GRID_SIZE - 1) - diagonalB), new vector_1.Vector2(1, -1));
            this.analyseRow(new vector_1.Vector2(diagonalB, main_1.GRID_SIZE - 1), new vector_1.Vector2(1, -1));
        }
    };
    GameModel.prototype.saveRow = function (row, closed, lastRow) {
        if (lastRow === void 0) { lastRow = null; }
        switch (row.row.length) {
            case 1:
                if (lastRow !== null && lastRow.row.length === 2) {
                    if (!closed) {
                        row.row.push(lastRow.row[0]);
                        row.row.push(lastRow.row[1]);
                        this.openSplitThreeInRow.push(row);
                    }
                }
                break;
            case 2:
                if (lastRow !== null && lastRow.row.length === 1) {
                    if (!closed) {
                        row.row.push(lastRow.row[0]);
                        this.openSplitThreeInRow.push(row);
                    }
                }
                break;
            case 3:
                if (closed) {
                    this.closedThreeInRow.push(row);
                }
                else {
                    this.openThreeInRow.push(row);
                }
                break;
            case 4:
                if (closed) {
                    this.closedFourInRow.push(row);
                }
                else {
                    this.openFourInRow.push(row);
                }
                break;
        }
    };
    GameModel.prototype.analyseRow = function (start, direction) {
        var currentRow = new SymbolCollection();
        var closed = true; // Closed because the iteration starts at end of the row
        var lastRow = null; // Last row represents last found row when it's not closed
        var nextCell;
        var nextSymbol;
        for (var i = 0; i < main_1.GRID_SIZE; ++i) {
            nextCell = start.addVector(direction.multiply(i));
            if (nextCell.isOutOfBounds()) {
                break;
            }
            nextSymbol = this.grid.getSymbolAt(nextCell);
            // Saving
            if (nextSymbol !== this.symbol && currentRow.length() !== 0) {
                if (!closed || nextSymbol === GameSymbol.NONE) {
                    this.saveRow(currentRow.toSymbolRow(direction), closed || nextSymbol == opponentSymbol(this.symbol), lastRow !== null ? lastRow.toSymbolRow(direction) : null);
                }
                if (nextSymbol === GameSymbol.NONE) {
                    lastRow = (0, utils_1.clone)(currentRow);
                    closed = false;
                }
                else {
                    if (closed) {
                        currentRow = new SymbolCollection();
                        continue;
                    }
                    closed = true;
                }
                currentRow = new SymbolCollection();
                continue;
            }
            if (currentRow.length() === 0) {
                if (nextSymbol === opponentSymbol(this.symbol)) {
                    closed = true;
                    lastRow = null;
                }
                else {
                    if (nextSymbol === GameSymbol.NONE) {
                        closed = false;
                        lastRow = null;
                    }
                    else {
                        currentRow.addSymbol(nextCell);
                    }
                }
                continue;
            }
            currentRow.addSymbol(nextCell);
        }
    };
    GameModel.prototype.getTwoInRow = function () {
        return this.twoInRow;
    };
    GameModel.prototype.getOpenThreeInRow = function () {
        return this.openThreeInRow;
    };
    GameModel.prototype.getClosedFourInRow = function () {
        return this.closedFourInRow;
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
var vector_1 = __webpack_require__(/*! ./vector */ "./src/vector.ts");
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
function displayPriority(position, priority) {
    $(".game-grid")
        .children()
        .eq((0, convert_1.vectorToIndex)(position))
        .text(priority.toString());
}
function saveSymbol(position, symbol) {
    gameGrid.addSymbol(position, symbol);
}
// Game stuff
function handleClick(clickPosition) {
    var aiResult = (new ai_1.AIv2(gameGrid)).play(aiSymbol);
    displaySymbol(aiResult.finalPos, aiSymbol);
    saveSymbol(aiResult.finalPos, aiSymbol);
    var vec;
    var i = 0;
    for (var x = 0; x < exports.GRID_SIZE; ++x) {
        for (var y = 0; y < exports.GRID_SIZE; ++y) {
            vec = new vector_1.Vector2(x, y);
            if (gameGrid.getSymbolAt(vec) === game_model_1.GameSymbol.NONE || vec.equals(aiResult.finalPos)) {
                displayPriority(vec, aiResult.priorities[i++]);
            }
            else {
                displayPriority(vec, -1);
            }
        }
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzNDLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN6RWE7QUFDYixrQkFBa0I7QUFDbEIsd0JBQXdCLEdBQUcsYUFBYTtBQUN4QztBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLG9CQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7Ozs7Ozs7Ozs7O0FDZFg7QUFDYixrQkFBa0I7QUFDbEIsZUFBZTtBQUNmLGFBQWEsbUJBQU8sQ0FBQyw2QkFBUTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZUFBZTs7Ozs7OztVQzVDZjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2FpLnRzIiwid2VicGFjazovLy8uL3NyYy9jb252ZXJ0LnRzIiwid2VicGFjazovLy8uL3NyYy9nYW1lLW1vZGVsLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuQUl2MiA9IGV4cG9ydHMuQUlSZXN1bHQgPSB2b2lkIDA7XG52YXIgZ2FtZV9tb2RlbF8xID0gcmVxdWlyZShcIi4vZ2FtZS1tb2RlbFwiKTtcbmZ1bmN0aW9uIGZpbmRJbmRleChwb3MsIGFycikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmIChhcnJbaV0uZXF1YWxzKHBvcykpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG52YXIgQUlSZXN1bHQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQUlSZXN1bHQocHJpb3JpdGllcywgZmluYWxQb3MpIHtcbiAgICAgICAgdGhpcy5wcmlvcml0aWVzID0gcHJpb3JpdGllcztcbiAgICAgICAgdGhpcy5maW5hbFBvcyA9IGZpbmFsUG9zO1xuICAgIH1cbiAgICByZXR1cm4gQUlSZXN1bHQ7XG59KCkpO1xuZXhwb3J0cy5BSVJlc3VsdCA9IEFJUmVzdWx0O1xudmFyIEFJdjEgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQUl2MShncmlkKSB7XG4gICAgICAgIHRoaXMuZ3JpZCA9IGdyaWQ7XG4gICAgfVxuICAgIEFJdjEucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbiAoc3ltYm9sKSB7XG4gICAgICAgIHZhciBlbXB0eUNlbGxzID0gdGhpcy5ncmlkLmdldEVtcHR5Q2VsbHMoKTtcbiAgICAgICAgdmFyIHByaW9yaXRpZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbXB0eUNlbGxzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBwcmlvcml0aWVzW2ldID0gMDtcbiAgICAgICAgfVxuICAgICAgICBwcmlvcml0aWVzID0gdGhpcy5wcmlvcml0aXplQ2VsbHMoZW1wdHlDZWxscywgcHJpb3JpdGllcywgc3ltYm9sKTtcbiAgICAgICAgdmFyIG1heFByaW9yaXR5ID0gLTE7XG4gICAgICAgIHZhciBmaW5hbFBvc2l0aW9uO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByaW9yaXRpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChwcmlvcml0aWVzW2ldID09IG1heFByaW9yaXR5ICYmIE1hdGgucmFuZG9tKCkgPiAwLjcpIHtcbiAgICAgICAgICAgICAgICBmaW5hbFBvc2l0aW9uID0gZW1wdHlDZWxsc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHByaW9yaXRpZXNbaV0gPiBtYXhQcmlvcml0eSkge1xuICAgICAgICAgICAgICAgIG1heFByaW9yaXR5ID0gcHJpb3JpdGllc1tpXTtcbiAgICAgICAgICAgICAgICBmaW5hbFBvc2l0aW9uID0gZW1wdHlDZWxsc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEFJUmVzdWx0KHByaW9yaXRpZXMsIGZpbmFsUG9zaXRpb24pO1xuICAgIH07XG4gICAgQUl2MS5wcm90b3R5cGUucHJpb3JpdGl6ZUNlbGxzID0gZnVuY3Rpb24gKGNlbGxzLCBwcmlvcml0aWVzLCBzeW1ib2wpIHtcbiAgICAgICAgdmFyIGdyaWQgPSB0aGlzLmdyaWQ7XG4gICAgICAgIHZhciBvcHBvbmVudHNTeW1ib2wgPSBzeW1ib2wgPT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuWCA/IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk8gOiBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5YO1xuICAgICAgICB2YXIgb3Bwb25lbnRzQ2VsbHMgPSBncmlkLmdldENlbGxzV2l0aFN5bWJvbChvcHBvbmVudHNTeW1ib2wpO1xuICAgICAgICBvcHBvbmVudHNDZWxscy5mb3JFYWNoKGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgICAgIGdyaWQuZ2V0Q2VsbHNBcm91bmQocG9zLCAxKS5mb3JFYWNoKGZ1bmN0aW9uIChwb3NBcm91bmQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNlbGxzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NBcm91bmQuZXF1YWxzKGNlbGxzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdGllc1tpXSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJpb3JpdGllcztcbiAgICB9O1xuICAgIEFJdjEucHJvdG90eXBlLmdldEdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWQ7XG4gICAgfTtcbiAgICByZXR1cm4gQUl2MTtcbn0oKSk7XG52YXIgQUl2MiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQUl2MiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBSXYyKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIEFJdjIucHJvdG90eXBlLnByaW9yaXRpemVDZWxscyA9IGZ1bmN0aW9uIChjZWxscywgcHJpb3JpdGllcywgc3ltYm9sKSB7XG4gICAgICAgIHByaW9yaXRpZXMgPSBfc3VwZXIucHJvdG90eXBlLnByaW9yaXRpemVDZWxscy5jYWxsKHRoaXMsIGNlbGxzLCBwcmlvcml0aWVzLCBzeW1ib2wpO1xuICAgICAgICB2YXIgZ2FtZU1vZGVsID0gbmV3IGdhbWVfbW9kZWxfMS5HYW1lTW9kZWwodGhpcy5nZXRHcmlkKCksICgwLCBnYW1lX21vZGVsXzEub3Bwb25lbnRTeW1ib2wpKHN5bWJvbCkpO1xuICAgICAgICB2YXIgdGhyZWVJblJvdyA9IGdhbWVNb2RlbC5nZXRPcGVuVGhyZWVJblJvdygpO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHRocmVlSW5Sb3dfMSA9IHRocmVlSW5Sb3c7IF9pIDwgdGhyZWVJblJvd18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHJvdyA9IHRocmVlSW5Sb3dfMVtfaV07XG4gICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChyb3cucm93WzBdLnN1YnRyYWN0VmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IDk7XG4gICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChyb3cucm93WzJdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSwgY2VsbHMpXSArPSA5O1xuICAgICAgICB9XG4gICAgICAgIHZhciBmb3VySW5Sb3cgPSBnYW1lTW9kZWwuZ2V0Q2xvc2VkRm91ckluUm93KCk7XG4gICAgICAgIGZvciAodmFyIF9hID0gMCwgZm91ckluUm93XzEgPSBmb3VySW5Sb3c7IF9hIDwgZm91ckluUm93XzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gZm91ckluUm93XzFbX2FdO1xuICAgICAgICAgICAgaWYgKCghcm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKS5pc091dE9mQm91bmRzKCkpICYmIHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KHJvdy5yb3dbMF0uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbikpID09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChyb3cucm93WzBdLnN1YnRyYWN0VmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCghcm93LnJvd1swXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbikuaXNPdXRPZkJvdW5kcygpKSAmJiB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzBdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSkgPT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KHJvdy5yb3dbMF0uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCghcm93LnJvd1szXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKS5pc091dE9mQm91bmRzKCkpICYmIHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KHJvdy5yb3dbM10uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbikpID09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChyb3cucm93WzNdLnN1YnRyYWN0VmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCghcm93LnJvd1szXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbikuaXNPdXRPZkJvdW5kcygpKSAmJiB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzNdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSkgPT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KHJvdy5yb3dbM10uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJpb3JpdGllcztcbiAgICB9O1xuICAgIHJldHVybiBBSXYyO1xufShBSXYxKSk7XG5leHBvcnRzLkFJdjIgPSBBSXYyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5pbmRleFRvVmVjdG9yID0gZXhwb3J0cy52ZWN0b3JUb0luZGV4ID0gZXhwb3J0cy5jb29yZHNUb0luZGV4ID0gdm9pZCAwO1xudmFyIGdvbW9rdSA9IHJlcXVpcmUoXCIuL21haW5cIik7XG52YXIgdmVjdG9yXzEgPSByZXF1aXJlKFwiLi92ZWN0b3JcIik7XG5mdW5jdGlvbiBjb29yZHNUb0luZGV4KHgsIHkpIHtcbiAgICByZXR1cm4geSAqIGdvbW9rdS5HUklEX1NJWkUgKyB4O1xufVxuZXhwb3J0cy5jb29yZHNUb0luZGV4ID0gY29vcmRzVG9JbmRleDtcbmZ1bmN0aW9uIGdldEluZGV4WChpbmRleCkge1xuICAgIHJldHVybiBpbmRleCAlIGdvbW9rdS5HUklEX1NJWkU7XG59XG5mdW5jdGlvbiBnZXRJbmRleFkoaW5kZXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihpbmRleCAvIGdvbW9rdS5HUklEX1NJWkUpO1xufVxuZnVuY3Rpb24gdmVjdG9yVG9JbmRleCh2ZWMpIHtcbiAgICByZXR1cm4gY29vcmRzVG9JbmRleCh2ZWMuZ2V0WCgpLCB2ZWMuZ2V0WSgpKTtcbn1cbmV4cG9ydHMudmVjdG9yVG9JbmRleCA9IHZlY3RvclRvSW5kZXg7XG5mdW5jdGlvbiBpbmRleFRvVmVjdG9yKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKGdldEluZGV4WChpbmRleCksIGdldEluZGV4WShpbmRleCkpO1xufVxuZXhwb3J0cy5pbmRleFRvVmVjdG9yID0gaW5kZXhUb1ZlY3RvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuR2FtZU1vZGVsID0gZXhwb3J0cy5TeW1ib2xSb3cgPSBleHBvcnRzLkdhbWVHcmlkID0gZXhwb3J0cy5vcHBvbmVudFN5bWJvbCA9IGV4cG9ydHMuR2FtZVN5bWJvbCA9IGV4cG9ydHMuRElSRUNUSU9OUyA9IHZvaWQgMDtcbnZhciB2ZWN0b3JfMSA9IHJlcXVpcmUoXCIuL3ZlY3RvclwiKTtcbnZhciBtYWluXzEgPSByZXF1aXJlKFwiLi9tYWluXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmV4cG9ydHMuRElSRUNUSU9OUyA9IFtcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAxKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCAxKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAwKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAtMSlcbl07XG52YXIgR2FtZVN5bWJvbDtcbihmdW5jdGlvbiAoR2FtZVN5bWJvbCkge1xuICAgIEdhbWVTeW1ib2xbXCJYXCJdID0gXCJ4XCI7XG4gICAgR2FtZVN5bWJvbFtcIk9cIl0gPSBcIm9cIjtcbiAgICBHYW1lU3ltYm9sW1wiTk9ORVwiXSA9IFwiXCI7XG59KShHYW1lU3ltYm9sID0gZXhwb3J0cy5HYW1lU3ltYm9sIHx8IChleHBvcnRzLkdhbWVTeW1ib2wgPSB7fSkpO1xuZnVuY3Rpb24gb3Bwb25lbnRTeW1ib2woc3ltYm9sKSB7XG4gICAgcmV0dXJuIHN5bWJvbCA9PT0gR2FtZVN5bWJvbC5YID8gR2FtZVN5bWJvbC5PIDogR2FtZVN5bWJvbC5YO1xufVxuZXhwb3J0cy5vcHBvbmVudFN5bWJvbCA9IG9wcG9uZW50U3ltYm9sO1xudmFyIEdhbWVHcmlkID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEdhbWVHcmlkKCkge1xuICAgICAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBtYWluXzEuR1JJRF9TSVpFOyArK3gpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFt4XSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBtYWluXzEuR1JJRF9TSVpFOyArK3kpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRbeF1beV0gPSBHYW1lU3ltYm9sLk5PTkU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldENlbGxzV2l0aFN5bWJvbCA9IGZ1bmN0aW9uIChzeW1ib2wpIHtcbiAgICAgICAgdmFyIGNlbGxzID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbWFpbl8xLkdSSURfU0laRTsgKyt4KSB7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG1haW5fMS5HUklEX1NJWkU7ICsreSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyaWRbeF1beV0gPT0gc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLnB1c2gobmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgeSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbHM7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZ2V0RW1wdHlDZWxscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2VsbHNXaXRoU3ltYm9sKEdhbWVTeW1ib2wuTk9ORSk7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZ2V0Q2VsbHNBcm91bmQgPSBmdW5jdGlvbiAocG9zLCBpLCBnYW1lU3ltYm9sKSB7XG4gICAgICAgIGlmIChpID09PSB2b2lkIDApIHsgaSA9IDE7IH1cbiAgICAgICAgaWYgKGdhbWVTeW1ib2wgPT09IHZvaWQgMCkgeyBnYW1lU3ltYm9sID0gbnVsbDsgfVxuICAgICAgICB2YXIgbWluWCA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRYKCkgLSBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBtYXhYID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLmdldFgoKSArIGksIDApLCBtYWluXzEuR1JJRF9TSVpFKTtcbiAgICAgICAgdmFyIG1pblkgPSBNYXRoLm1pbihNYXRoLm1heChwb3MuZ2V0WSgpIC0gaSwgMCksIG1haW5fMS5HUklEX1NJWkUpO1xuICAgICAgICB2YXIgbWF4WSA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRZKCkgKyBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gbWluWDsgeCA8PSBtYXhYOyArK3gpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSBtaW5ZOyB5IDw9IG1heFk7ICsreSkge1xuICAgICAgICAgICAgICAgIGlmIChnYW1lU3ltYm9sID09PSBudWxsIHx8IHRoaXMuZ3JpZFt4XVt5XSA9PSBnYW1lU3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLnB1c2gobmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgeSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbHM7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZmluZEZpdmVJbkFSb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB4Q2VsbHMgPSB0aGlzLmdldENlbGxzV2l0aFN5bWJvbChHYW1lU3ltYm9sLlgpO1xuICAgICAgICB2YXIgb0NlbGxzID0gdGhpcy5nZXRDZWxsc1dpdGhTeW1ib2woR2FtZVN5bWJvbC5PKTtcbiAgICAgICAgZnVuY3Rpb24gZmluZEZpdmVJblJvdyhjZWxscykge1xuICAgICAgICAgICAgZnVuY3Rpb24gZXhpc3RzKGNlbGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGNlbGxzXzIgPSBjZWxsczsgX2kgPCBjZWxsc18yLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IGNlbGxzXzJbX2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbC5lcXVhbHMoYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgRElSRUNUSU9OU18xID0gZXhwb3J0cy5ESVJFQ1RJT05TOyBfaSA8IERJUkVDVElPTlNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gRElSRUNUSU9OU18xW19pXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfYSA9IDAsIGNlbGxzXzEgPSBjZWxsczsgX2EgPCBjZWxsc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IGNlbGxzXzFbX2FdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRWZWN0b3IgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxIC0gbWFpbl8xLkdSSURfU0laRTsgaSA8IG1haW5fMS5HUklEX1NJWkU7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFZlY3RvciA9IGNlbGwuYWRkVmVjdG9yKGRpcmVjdGlvbi5tdWx0aXBseShpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFZlY3Rvci5pc091dE9mQm91bmRzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMobmV4dFZlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3crKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93ID09PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbmRGaXZlSW5Sb3coeENlbGxzKSkge1xuICAgICAgICAgICAgcmV0dXJuIEdhbWVTeW1ib2wuWDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmaW5kRml2ZUluUm93KG9DZWxscykpIHtcbiAgICAgICAgICAgIHJldHVybiBHYW1lU3ltYm9sLk87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEdhbWVTeW1ib2wuTk9ORTtcbiAgICB9O1xuICAgIEdhbWVHcmlkLnByb3RvdHlwZS5hZGRTeW1ib2wgPSBmdW5jdGlvbiAocG9zLCBzeW1ib2wpIHtcbiAgICAgICAgdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldID0gc3ltYm9sO1xuICAgIH07XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldFN5bWJvbEF0ID0gZnVuY3Rpb24gKHBvcykge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldO1xuICAgIH07XG4gICAgcmV0dXJuIEdhbWVHcmlkO1xufSgpKTtcbmV4cG9ydHMuR2FtZUdyaWQgPSBHYW1lR3JpZDtcbnZhciBTeW1ib2xSb3cgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3ltYm9sUm93KHJvdywgZGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMucm93ID0gcm93O1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIFN5bWJvbFJvdztcbn0oKSk7XG5leHBvcnRzLlN5bWJvbFJvdyA9IFN5bWJvbFJvdztcbnZhciBTeW1ib2xDb2xsZWN0aW9uID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN5bWJvbENvbGxlY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3ltYm9scyA9IFtdO1xuICAgIH1cbiAgICBTeW1ib2xDb2xsZWN0aW9uLnByb3RvdHlwZS5hZGRTeW1ib2wgPSBmdW5jdGlvbiAoc3ltYm9sKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnN5bWJvbHM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWRkZWRTeW1ib2wgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAoYWRkZWRTeW1ib2wuZXF1YWxzKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zeW1ib2xzLnB1c2goc3ltYm9sKTtcbiAgICB9O1xuICAgIFN5bWJvbENvbGxlY3Rpb24ucHJvdG90eXBlLnRvU3ltYm9sUm93ID0gZnVuY3Rpb24gKGRpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IFN5bWJvbFJvdygoMCwgdXRpbHNfMS5jbG9uZU9iamVjdEFycmF5KSh0aGlzLnN5bWJvbHMpLCBkaXJlY3Rpb24pO1xuICAgIH07XG4gICAgU3ltYm9sQ29sbGVjdGlvbi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2xzLmxlbmd0aDtcbiAgICB9O1xuICAgIHJldHVybiBTeW1ib2xDb2xsZWN0aW9uO1xufSgpKTtcbnZhciBHYW1lTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZU1vZGVsKGdyaWQsIHN5bWJvbCkge1xuICAgICAgICAvLyAyXG4gICAgICAgIHRoaXMudHdvSW5Sb3cgPSBbXTtcbiAgICAgICAgLy8gM1xuICAgICAgICB0aGlzLm9wZW5UaHJlZUluUm93ID0gW107XG4gICAgICAgIHRoaXMuY2xvc2VkVGhyZWVJblJvdyA9IFtdO1xuICAgICAgICB0aGlzLm9wZW5TcGxpdFRocmVlSW5Sb3cgPSBbXTtcbiAgICAgICAgLy8gNFxuICAgICAgICB0aGlzLm9wZW5Gb3VySW5Sb3cgPSBbXTtcbiAgICAgICAgdGhpcy5jbG9zZWRGb3VySW5Sb3cgPSBbXTtcbiAgICAgICAgdGhpcy5ncmlkID0gZ3JpZDtcbiAgICAgICAgdGhpcy5zeW1ib2wgPSBzeW1ib2w7XG4gICAgICAgIHRoaXMuYW5hbHlzZUdyaWQoKTtcbiAgICB9XG4gICAgR2FtZU1vZGVsLmNhblNhdmVSb3cgPSBmdW5jdGlvbiAocm93cywgcm93KSB7XG4gICAgICAgIGZpcnN0TG9vcDogZm9yICh2YXIgX2kgPSAwLCByb3dzXzEgPSByb3dzOyBfaSA8IHJvd3NfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gcm93c18xW19pXTtcbiAgICAgICAgICAgIGlmIChyb3cucm93Lmxlbmd0aCAhPSBjdXJyZW50LnJvdy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudC5yb3cubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWN1cnJlbnQucm93W2ldLmVxdWFscyhyb3cucm93W2ldKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBmaXJzdExvb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5hbmFseXNlR3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gXFwvXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbWFpbl8xLkdSSURfU0laRTsgKyt4KSB7XG4gICAgICAgICAgICB0aGlzLmFuYWx5c2VSb3cobmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgMCksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDAsIDEpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyAtPlxuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG1haW5fMS5HUklEX1NJWkU7ICsreSkge1xuICAgICAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDAsIHkpLCBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAwKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gX1xcfFxuICAgICAgICB0aGlzLmFuYWx5c2VSb3cobmV3IHZlY3Rvcl8xLlZlY3RvcjIoMCwgMCksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDEsIDEpKTtcbiAgICAgICAgZm9yICh2YXIgZGlhZ29uYWxBID0gMTsgZGlhZ29uYWxBIDwgbWFpbl8xLkdSSURfU0laRSAtIDQ7ICsrZGlhZ29uYWxBKSB7XG4gICAgICAgICAgICB0aGlzLmFuYWx5c2VSb3cobmV3IHZlY3Rvcl8xLlZlY3RvcjIoZGlhZ29uYWxBLCAwKSwgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgMSkpO1xuICAgICAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDAsIGRpYWdvbmFsQSksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDEsIDEpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyDLnS98XG4gICAgICAgIHRoaXMuYW5hbHlzZVJvdyhuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCBtYWluXzEuR1JJRF9TSVpFIC0gMSksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDEsIC0xKSk7XG4gICAgICAgIGZvciAodmFyIGRpYWdvbmFsQiA9IDE7IGRpYWdvbmFsQiA8IG1haW5fMS5HUklEX1NJWkUgLSA0OyArK2RpYWdvbmFsQikge1xuICAgICAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDAsIChtYWluXzEuR1JJRF9TSVpFIC0gMSkgLSBkaWFnb25hbEIpLCBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAtMSkpO1xuICAgICAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKGRpYWdvbmFsQiwgbWFpbl8xLkdSSURfU0laRSAtIDEpLCBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAtMSkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLnNhdmVSb3cgPSBmdW5jdGlvbiAocm93LCBjbG9zZWQsIGxhc3RSb3cpIHtcbiAgICAgICAgaWYgKGxhc3RSb3cgPT09IHZvaWQgMCkgeyBsYXN0Um93ID0gbnVsbDsgfVxuICAgICAgICBzd2l0Y2ggKHJvdy5yb3cubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RSb3cgIT09IG51bGwgJiYgbGFzdFJvdy5yb3cubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cucm93LnB1c2gobGFzdFJvdy5yb3dbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93LnJvdy5wdXNoKGxhc3RSb3cucm93WzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3BlblNwbGl0VGhyZWVJblJvdy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RSb3cgIT09IG51bGwgJiYgbGFzdFJvdy5yb3cubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cucm93LnB1c2gobGFzdFJvdy5yb3dbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuU3BsaXRUaHJlZUluUm93LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBpZiAoY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VkVGhyZWVJblJvdy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5UaHJlZUluUm93LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgaWYgKGNsb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlZEZvdXJJblJvdy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5Gb3VySW5Sb3cucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5hbmFseXNlUm93ID0gZnVuY3Rpb24gKHN0YXJ0LCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIGN1cnJlbnRSb3cgPSBuZXcgU3ltYm9sQ29sbGVjdGlvbigpO1xuICAgICAgICB2YXIgY2xvc2VkID0gdHJ1ZTsgLy8gQ2xvc2VkIGJlY2F1c2UgdGhlIGl0ZXJhdGlvbiBzdGFydHMgYXQgZW5kIG9mIHRoZSByb3dcbiAgICAgICAgdmFyIGxhc3RSb3cgPSBudWxsOyAvLyBMYXN0IHJvdyByZXByZXNlbnRzIGxhc3QgZm91bmQgcm93IHdoZW4gaXQncyBub3QgY2xvc2VkXG4gICAgICAgIHZhciBuZXh0Q2VsbDtcbiAgICAgICAgdmFyIG5leHRTeW1ib2w7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFpbl8xLkdSSURfU0laRTsgKytpKSB7XG4gICAgICAgICAgICBuZXh0Q2VsbCA9IHN0YXJ0LmFkZFZlY3RvcihkaXJlY3Rpb24ubXVsdGlwbHkoaSkpO1xuICAgICAgICAgICAgaWYgKG5leHRDZWxsLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dFN5bWJvbCA9IHRoaXMuZ3JpZC5nZXRTeW1ib2xBdChuZXh0Q2VsbCk7XG4gICAgICAgICAgICAvLyBTYXZpbmdcbiAgICAgICAgICAgIGlmIChuZXh0U3ltYm9sICE9PSB0aGlzLnN5bWJvbCAmJiBjdXJyZW50Um93Lmxlbmd0aCgpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjbG9zZWQgfHwgbmV4dFN5bWJvbCA9PT0gR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVJvdyhjdXJyZW50Um93LnRvU3ltYm9sUm93KGRpcmVjdGlvbiksIGNsb3NlZCB8fCBuZXh0U3ltYm9sID09IG9wcG9uZW50U3ltYm9sKHRoaXMuc3ltYm9sKSwgbGFzdFJvdyAhPT0gbnVsbCA/IGxhc3RSb3cudG9TeW1ib2xSb3coZGlyZWN0aW9uKSA6IG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV4dFN5bWJvbCA9PT0gR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RSb3cgPSAoMCwgdXRpbHNfMS5jbG9uZSkoY3VycmVudFJvdyk7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFJvdyA9IG5ldyBTeW1ib2xDb2xsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjbG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJyZW50Um93ID0gbmV3IFN5bWJvbENvbGxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdXJyZW50Um93Lmxlbmd0aCgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRTeW1ib2wgPT09IG9wcG9uZW50U3ltYm9sKHRoaXMuc3ltYm9sKSkge1xuICAgICAgICAgICAgICAgICAgICBjbG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBsYXN0Um93ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0U3ltYm9sID09PSBHYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFJvdyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Um93LmFkZFN5bWJvbChuZXh0Q2VsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50Um93LmFkZFN5bWJvbChuZXh0Q2VsbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuZ2V0VHdvSW5Sb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR3b0luUm93O1xuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5nZXRPcGVuVGhyZWVJblJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlblRocmVlSW5Sb3c7XG4gICAgfTtcbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLmdldENsb3NlZEZvdXJJblJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2VkRm91ckluUm93O1xuICAgIH07XG4gICAgcmV0dXJuIEdhbWVNb2RlbDtcbn0oKSk7XG5leHBvcnRzLkdhbWVNb2RlbCA9IEdhbWVNb2RlbDtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuR1JJRF9TSVpFID0gdm9pZCAwO1xudmFyIGNvbnZlcnRfMSA9IHJlcXVpcmUoXCIuL2NvbnZlcnRcIik7XG52YXIgZ2FtZV9tb2RlbF8xID0gcmVxdWlyZShcIi4vZ2FtZS1tb2RlbFwiKTtcbnZhciB2ZWN0b3JfMSA9IHJlcXVpcmUoXCIuL3ZlY3RvclwiKTtcbnZhciBhaV8xID0gcmVxdWlyZShcIi4vYWlcIik7XG5leHBvcnRzLkdSSURfU0laRSA9IDE1O1xuY29uc29sZS5sb2coXCJTdGFydGluZyB0aGUgYXBwbGljYXRpb25cIik7XG52YXIgZ2FtZUdyaWQgPSBuZXcgZ2FtZV9tb2RlbF8xLkdhbWVHcmlkKCk7XG52YXIgcGxheWVyU3ltYm9sID0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuWDtcbnZhciBhaVN5bWJvbCA9IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk87XG52YXIgcGxheWluZyA9IHRydWU7XG4vLyBIYW5kbGluZyBjbGlja1xuJChmdW5jdGlvbiAoKSB7XG4gICAgJChcIi5jZWxsXCIpLmJpbmQoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgICAgdmFyIGNsaWNrUG9zaXRpb24gPSAoMCwgY29udmVydF8xLmluZGV4VG9WZWN0b3IpKGVsZW1lbnQuaW5kZXgoKSk7XG4gICAgICAgIC8vIFdlIGNhbm5vdCBwbGFjZSBzeW1ib2wgdG8gY2VsbCB3aGljaCBhbHJlYWR5IGhhcyBhbm90aGVyIG9uZVxuICAgICAgICBpZiAoZ2FtZUdyaWQuZ2V0U3ltYm9sQXQoY2xpY2tQb3NpdGlvbikgIT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5U3ltYm9sKGNsaWNrUG9zaXRpb24sIHBsYXllclN5bWJvbCk7XG4gICAgICAgIHNhdmVTeW1ib2woY2xpY2tQb3NpdGlvbiwgcGxheWVyU3ltYm9sKTtcbiAgICAgICAgaWYgKGdhbWVHcmlkLmZpbmRGaXZlSW5BUm93KCkgPT09IHBsYXllclN5bWJvbCkge1xuICAgICAgICAgICAgcGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb25ncmF0cyEgWW91IGhhdmUgd29uIHRoZSBnYW1lIVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVDbGljayhjbGlja1Bvc2l0aW9uKTtcbiAgICB9KTtcbn0pO1xuLy8gRGlzcGxheSBzdHVmZlxuZnVuY3Rpb24gZGlzcGxheVN5bWJvbChwb3NpdGlvbiwgc3ltYm9sKSB7XG4gICAgJChcIi5nYW1lLWdyaWRcIilcbiAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgLmVxKCgwLCBjb252ZXJ0XzEudmVjdG9yVG9JbmRleCkocG9zaXRpb24pKVxuICAgICAgICAuYWRkQ2xhc3Moc3ltYm9sKTtcbn1cbmZ1bmN0aW9uIGRpc3BsYXlQcmlvcml0eShwb3NpdGlvbiwgcHJpb3JpdHkpIHtcbiAgICAkKFwiLmdhbWUtZ3JpZFwiKVxuICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAuZXEoKDAsIGNvbnZlcnRfMS52ZWN0b3JUb0luZGV4KShwb3NpdGlvbikpXG4gICAgICAgIC50ZXh0KHByaW9yaXR5LnRvU3RyaW5nKCkpO1xufVxuZnVuY3Rpb24gc2F2ZVN5bWJvbChwb3NpdGlvbiwgc3ltYm9sKSB7XG4gICAgZ2FtZUdyaWQuYWRkU3ltYm9sKHBvc2l0aW9uLCBzeW1ib2wpO1xufVxuLy8gR2FtZSBzdHVmZlxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soY2xpY2tQb3NpdGlvbikge1xuICAgIHZhciBhaVJlc3VsdCA9IChuZXcgYWlfMS5BSXYyKGdhbWVHcmlkKSkucGxheShhaVN5bWJvbCk7XG4gICAgZGlzcGxheVN5bWJvbChhaVJlc3VsdC5maW5hbFBvcywgYWlTeW1ib2wpO1xuICAgIHNhdmVTeW1ib2woYWlSZXN1bHQuZmluYWxQb3MsIGFpU3ltYm9sKTtcbiAgICB2YXIgdmVjO1xuICAgIHZhciBpID0gMDtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGV4cG9ydHMuR1JJRF9TSVpFOyArK3gpIHtcbiAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBleHBvcnRzLkdSSURfU0laRTsgKyt5KSB7XG4gICAgICAgICAgICB2ZWMgPSBuZXcgdmVjdG9yXzEuVmVjdG9yMih4LCB5KTtcbiAgICAgICAgICAgIGlmIChnYW1lR3JpZC5nZXRTeW1ib2xBdCh2ZWMpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FIHx8IHZlYy5lcXVhbHMoYWlSZXN1bHQuZmluYWxQb3MpKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheVByaW9yaXR5KHZlYywgYWlSZXN1bHQucHJpb3JpdGllc1tpKytdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRpc3BsYXlQcmlvcml0eSh2ZWMsIC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZ2FtZUdyaWQuZmluZEZpdmVJbkFSb3coKSA9PT0gYWlTeW1ib2wpIHtcbiAgICAgICAgcGxheWluZyA9IGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZyhcIllvdSBsb3NlXCIpO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuY2xvbmVPYmplY3RBcnJheSA9IGV4cG9ydHMuY2xvbmUgPSB2b2lkIDA7XG5mdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopKSwgb2JqKTtcbn1cbmV4cG9ydHMuY2xvbmUgPSBjbG9uZTtcbmZ1bmN0aW9uIGNsb25lT2JqZWN0QXJyYXkoYXJyKSB7XG4gICAgdmFyIGNsb25lQXJyID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY2xvbmVBcnJbaV0gPSBjbG9uZShhcnJbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gY2xvbmVBcnI7XG59XG5leHBvcnRzLmNsb25lT2JqZWN0QXJyYXkgPSBjbG9uZU9iamVjdEFycmF5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5WZWN0b3IyID0gdm9pZCAwO1xudmFyIG1haW5fMSA9IHJlcXVpcmUoXCIuL21haW5cIik7XG52YXIgVmVjdG9yMiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBWZWN0b3IyKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCArIHgsIHRoaXMueSArIHkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuYWRkVmVjdG9yID0gZnVuY3Rpb24gKHZlYykge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQodmVjLngsIHZlYy55KTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKC14LCAteSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5zdWJ0cmFjdFZlY3RvciA9IGZ1bmN0aW9uICh2ZWMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKC12ZWMueCwgLXZlYy55KTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAqIGksIHRoaXMueSAqIGkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZGl2aWRlID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHkoMSAvIGkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gKHZlYykge1xuICAgICAgICByZXR1cm4gdGhpcy54ID09PSB2ZWMueCAmJiB0aGlzLnkgPT09IHZlYy55O1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuaXNFZGdlQ2VsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0gMCB8fCB0aGlzLnkgPT09IDAgfHwgdGhpcy54ICsgMSA9PT0gbWFpbl8xLkdSSURfU0laRSB8fCB0aGlzLnkgKyAxID09PSBtYWluXzEuR1JJRF9TSVpFO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuaXNPdXRPZkJvdW5kcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA8IDAgfHwgdGhpcy54ID49IG1haW5fMS5HUklEX1NJWkUgfHwgdGhpcy55IDwgMCB8fCB0aGlzLnkgPj0gbWFpbl8xLkdSSURfU0laRTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmdldFggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLng7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy55O1xuICAgIH07XG4gICAgcmV0dXJuIFZlY3RvcjI7XG59KCkpO1xuZXhwb3J0cy5WZWN0b3IyID0gVmVjdG9yMjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9