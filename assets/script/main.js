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
        var threeInRow = (new game_model_1.GameModel(this.getGrid(), (0, game_model_1.opponentSymbol)(symbol))).getOpenThreeInRow();
        for (var _i = 0, threeInRow_1 = threeInRow; _i < threeInRow_1.length; _i++) {
            var row = threeInRow_1[_i];
            priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += 9;
            priorities[findIndex(row.row[2].addVector(row.direction), cells)] += 9;
        }
        var fourInRow = (new game_model_1.GameModel(this.getGrid(), (0, game_model_1.opponentSymbol)(symbol))).getClosedFourInRow();
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
            this.analyseRow(new vector_1.Vector2(diagonalB, 0), new vector_1.Vector2(1, -1));
        }
    };
    GameModel.prototype.saveRow = function (row, closed) {
        switch (row.row.length) {
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
        var lastRow; // Last row represents last found row when it's not closed
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
                this.saveRow(currentRow.toSymbolRow(direction), closed);
                currentRow = new SymbolCollection();
                continue;
            }
            if (currentRow.length() === 0) {
                if (nextSymbol === opponentSymbol(this.symbol)) {
                    closed = true;
                }
                else if (nextSymbol === GameSymbol.NONE) {
                    closed = false;
                }
                else {
                    currentRow.addSymbol(nextCell);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RyxhQUFhO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0Esb0JBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qjs7Ozs7Ozs7Ozs7QUNkWDtBQUNiLGtCQUFrQjtBQUNsQixlQUFlO0FBQ2YsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxlQUFlOzs7Ozs7O1VDNUNmO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYWkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnZlcnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWUtbW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovLy8uL3NyYy92ZWN0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5BSXYyID0gZXhwb3J0cy5BSVJlc3VsdCA9IHZvaWQgMDtcbnZhciBnYW1lX21vZGVsXzEgPSByZXF1aXJlKFwiLi9nYW1lLW1vZGVsXCIpO1xuZnVuY3Rpb24gZmluZEluZGV4KHBvcywgYXJyKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKGFycltpXS5lcXVhbHMocG9zKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbnZhciBBSVJlc3VsdCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBSVJlc3VsdChwcmlvcml0aWVzLCBmaW5hbFBvcykge1xuICAgICAgICB0aGlzLnByaW9yaXRpZXMgPSBwcmlvcml0aWVzO1xuICAgICAgICB0aGlzLmZpbmFsUG9zID0gZmluYWxQb3M7XG4gICAgfVxuICAgIHJldHVybiBBSVJlc3VsdDtcbn0oKSk7XG5leHBvcnRzLkFJUmVzdWx0ID0gQUlSZXN1bHQ7XG52YXIgQUl2MSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBSXYxKGdyaWQpIHtcbiAgICAgICAgdGhpcy5ncmlkID0gZ3JpZDtcbiAgICB9XG4gICAgQUl2MS5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uIChzeW1ib2wpIHtcbiAgICAgICAgdmFyIGVtcHR5Q2VsbHMgPSB0aGlzLmdyaWQuZ2V0RW1wdHlDZWxscygpO1xuICAgICAgICB2YXIgcHJpb3JpdGllcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVtcHR5Q2VsbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHByaW9yaXRpZXNbaV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHByaW9yaXRpZXMgPSB0aGlzLnByaW9yaXRpemVDZWxscyhlbXB0eUNlbGxzLCBwcmlvcml0aWVzLCBzeW1ib2wpO1xuICAgICAgICB2YXIgbWF4UHJpb3JpdHkgPSAtMTtcbiAgICAgICAgdmFyIGZpbmFsUG9zaXRpb247XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJpb3JpdGllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKHByaW9yaXRpZXNbaV0gPT0gbWF4UHJpb3JpdHkgJiYgTWF0aC5yYW5kb20oKSA+IDAuNykge1xuICAgICAgICAgICAgICAgIGZpbmFsUG9zaXRpb24gPSBlbXB0eUNlbGxzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocHJpb3JpdGllc1tpXSA+IG1heFByaW9yaXR5KSB7XG4gICAgICAgICAgICAgICAgbWF4UHJpb3JpdHkgPSBwcmlvcml0aWVzW2ldO1xuICAgICAgICAgICAgICAgIGZpbmFsUG9zaXRpb24gPSBlbXB0eUNlbGxzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQUlSZXN1bHQocHJpb3JpdGllcywgZmluYWxQb3NpdGlvbik7XG4gICAgfTtcbiAgICBBSXYxLnByb3RvdHlwZS5wcmlvcml0aXplQ2VsbHMgPSBmdW5jdGlvbiAoY2VsbHMsIHByaW9yaXRpZXMsIHN5bWJvbCkge1xuICAgICAgICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgdmFyIG9wcG9uZW50c1N5bWJvbCA9IHN5bWJvbCA9PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5YID8gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTyA6IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLlg7XG4gICAgICAgIHZhciBvcHBvbmVudHNDZWxscyA9IGdyaWQuZ2V0Q2VsbHNXaXRoU3ltYm9sKG9wcG9uZW50c1N5bWJvbCk7XG4gICAgICAgIG9wcG9uZW50c0NlbGxzLmZvckVhY2goZnVuY3Rpb24gKHBvcykge1xuICAgICAgICAgICAgZ3JpZC5nZXRDZWxsc0Fyb3VuZChwb3MsIDEpLmZvckVhY2goZnVuY3Rpb24gKHBvc0Fyb3VuZCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2VsbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc0Fyb3VuZC5lcXVhbHMoY2VsbHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ldKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcmlvcml0aWVzO1xuICAgIH07XG4gICAgQUl2MS5wcm90b3R5cGUuZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZDtcbiAgICB9O1xuICAgIHJldHVybiBBSXYxO1xufSgpKTtcbnZhciBBSXYyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBSXYyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFJdjIoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgQUl2Mi5wcm90b3R5cGUucHJpb3JpdGl6ZUNlbGxzID0gZnVuY3Rpb24gKGNlbGxzLCBwcmlvcml0aWVzLCBzeW1ib2wpIHtcbiAgICAgICAgcHJpb3JpdGllcyA9IF9zdXBlci5wcm90b3R5cGUucHJpb3JpdGl6ZUNlbGxzLmNhbGwodGhpcywgY2VsbHMsIHByaW9yaXRpZXMsIHN5bWJvbCk7XG4gICAgICAgIHZhciB0aHJlZUluUm93ID0gKG5ldyBnYW1lX21vZGVsXzEuR2FtZU1vZGVsKHRoaXMuZ2V0R3JpZCgpLCAoMCwgZ2FtZV9tb2RlbF8xLm9wcG9uZW50U3ltYm9sKShzeW1ib2wpKSkuZ2V0T3BlblRocmVlSW5Sb3coKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCB0aHJlZUluUm93XzEgPSB0aHJlZUluUm93OyBfaSA8IHRocmVlSW5Sb3dfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByb3cgPSB0aHJlZUluUm93XzFbX2ldO1xuICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKSwgY2VsbHMpXSArPSA5O1xuICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1syXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbiksIGNlbGxzKV0gKz0gOTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZm91ckluUm93ID0gKG5ldyBnYW1lX21vZGVsXzEuR2FtZU1vZGVsKHRoaXMuZ2V0R3JpZCgpLCAoMCwgZ2FtZV9tb2RlbF8xLm9wcG9uZW50U3ltYm9sKShzeW1ib2wpKSkuZ2V0Q2xvc2VkRm91ckluUm93KCk7XG4gICAgICAgIGZvciAodmFyIF9hID0gMCwgZm91ckluUm93XzEgPSBmb3VySW5Sb3c7IF9hIDwgZm91ckluUm93XzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gZm91ckluUm93XzFbX2FdO1xuICAgICAgICAgICAgaWYgKCghcm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKS5pc091dE9mQm91bmRzKCkpICYmIHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KHJvdy5yb3dbMF0uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbikpID09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChyb3cucm93WzBdLnN1YnRyYWN0VmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCghcm93LnJvd1swXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbikuaXNPdXRPZkJvdW5kcygpKSAmJiB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzBdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSkgPT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KHJvdy5yb3dbMF0uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCghcm93LnJvd1szXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKS5pc091dE9mQm91bmRzKCkpICYmIHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KHJvdy5yb3dbM10uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbikpID09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChyb3cucm93WzNdLnN1YnRyYWN0VmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCghcm93LnJvd1szXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbikuaXNPdXRPZkJvdW5kcygpKSAmJiB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzNdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSkgPT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KHJvdy5yb3dbM10uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJpb3JpdGllcztcbiAgICB9O1xuICAgIHJldHVybiBBSXYyO1xufShBSXYxKSk7XG5leHBvcnRzLkFJdjIgPSBBSXYyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5pbmRleFRvVmVjdG9yID0gZXhwb3J0cy52ZWN0b3JUb0luZGV4ID0gZXhwb3J0cy5jb29yZHNUb0luZGV4ID0gdm9pZCAwO1xudmFyIGdvbW9rdSA9IHJlcXVpcmUoXCIuL21haW5cIik7XG52YXIgdmVjdG9yXzEgPSByZXF1aXJlKFwiLi92ZWN0b3JcIik7XG5mdW5jdGlvbiBjb29yZHNUb0luZGV4KHgsIHkpIHtcbiAgICByZXR1cm4geSAqIGdvbW9rdS5HUklEX1NJWkUgKyB4O1xufVxuZXhwb3J0cy5jb29yZHNUb0luZGV4ID0gY29vcmRzVG9JbmRleDtcbmZ1bmN0aW9uIGdldEluZGV4WChpbmRleCkge1xuICAgIHJldHVybiBpbmRleCAlIGdvbW9rdS5HUklEX1NJWkU7XG59XG5mdW5jdGlvbiBnZXRJbmRleFkoaW5kZXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihpbmRleCAvIGdvbW9rdS5HUklEX1NJWkUpO1xufVxuZnVuY3Rpb24gdmVjdG9yVG9JbmRleCh2ZWMpIHtcbiAgICByZXR1cm4gY29vcmRzVG9JbmRleCh2ZWMuZ2V0WCgpLCB2ZWMuZ2V0WSgpKTtcbn1cbmV4cG9ydHMudmVjdG9yVG9JbmRleCA9IHZlY3RvclRvSW5kZXg7XG5mdW5jdGlvbiBpbmRleFRvVmVjdG9yKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKGdldEluZGV4WChpbmRleCksIGdldEluZGV4WShpbmRleCkpO1xufVxuZXhwb3J0cy5pbmRleFRvVmVjdG9yID0gaW5kZXhUb1ZlY3RvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuR2FtZU1vZGVsID0gZXhwb3J0cy5TeW1ib2xSb3cgPSBleHBvcnRzLkdhbWVHcmlkID0gZXhwb3J0cy5vcHBvbmVudFN5bWJvbCA9IGV4cG9ydHMuR2FtZVN5bWJvbCA9IGV4cG9ydHMuRElSRUNUSU9OUyA9IHZvaWQgMDtcbnZhciB2ZWN0b3JfMSA9IHJlcXVpcmUoXCIuL3ZlY3RvclwiKTtcbnZhciBtYWluXzEgPSByZXF1aXJlKFwiLi9tYWluXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmV4cG9ydHMuRElSRUNUSU9OUyA9IFtcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAxKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCAxKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAwKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAtMSlcbl07XG52YXIgR2FtZVN5bWJvbDtcbihmdW5jdGlvbiAoR2FtZVN5bWJvbCkge1xuICAgIEdhbWVTeW1ib2xbXCJYXCJdID0gXCJ4XCI7XG4gICAgR2FtZVN5bWJvbFtcIk9cIl0gPSBcIm9cIjtcbiAgICBHYW1lU3ltYm9sW1wiTk9ORVwiXSA9IFwiXCI7XG59KShHYW1lU3ltYm9sID0gZXhwb3J0cy5HYW1lU3ltYm9sIHx8IChleHBvcnRzLkdhbWVTeW1ib2wgPSB7fSkpO1xuZnVuY3Rpb24gb3Bwb25lbnRTeW1ib2woc3ltYm9sKSB7XG4gICAgcmV0dXJuIHN5bWJvbCA9PT0gR2FtZVN5bWJvbC5YID8gR2FtZVN5bWJvbC5PIDogR2FtZVN5bWJvbC5YO1xufVxuZXhwb3J0cy5vcHBvbmVudFN5bWJvbCA9IG9wcG9uZW50U3ltYm9sO1xudmFyIEdhbWVHcmlkID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEdhbWVHcmlkKCkge1xuICAgICAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBtYWluXzEuR1JJRF9TSVpFOyArK3gpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFt4XSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBtYWluXzEuR1JJRF9TSVpFOyArK3kpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRbeF1beV0gPSBHYW1lU3ltYm9sLk5PTkU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldENlbGxzV2l0aFN5bWJvbCA9IGZ1bmN0aW9uIChzeW1ib2wpIHtcbiAgICAgICAgdmFyIGNlbGxzID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbWFpbl8xLkdSSURfU0laRTsgKyt4KSB7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG1haW5fMS5HUklEX1NJWkU7ICsreSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyaWRbeF1beV0gPT0gc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLnB1c2gobmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgeSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbHM7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZ2V0RW1wdHlDZWxscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2VsbHNXaXRoU3ltYm9sKEdhbWVTeW1ib2wuTk9ORSk7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZ2V0Q2VsbHNBcm91bmQgPSBmdW5jdGlvbiAocG9zLCBpLCBnYW1lU3ltYm9sKSB7XG4gICAgICAgIGlmIChpID09PSB2b2lkIDApIHsgaSA9IDE7IH1cbiAgICAgICAgaWYgKGdhbWVTeW1ib2wgPT09IHZvaWQgMCkgeyBnYW1lU3ltYm9sID0gbnVsbDsgfVxuICAgICAgICB2YXIgbWluWCA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRYKCkgLSBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBtYXhYID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLmdldFgoKSArIGksIDApLCBtYWluXzEuR1JJRF9TSVpFKTtcbiAgICAgICAgdmFyIG1pblkgPSBNYXRoLm1pbihNYXRoLm1heChwb3MuZ2V0WSgpIC0gaSwgMCksIG1haW5fMS5HUklEX1NJWkUpO1xuICAgICAgICB2YXIgbWF4WSA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRZKCkgKyBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gbWluWDsgeCA8PSBtYXhYOyArK3gpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSBtaW5ZOyB5IDw9IG1heFk7ICsreSkge1xuICAgICAgICAgICAgICAgIGlmIChnYW1lU3ltYm9sID09PSBudWxsIHx8IHRoaXMuZ3JpZFt4XVt5XSA9PSBnYW1lU3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLnB1c2gobmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgeSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbHM7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZmluZEZpdmVJbkFSb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB4Q2VsbHMgPSB0aGlzLmdldENlbGxzV2l0aFN5bWJvbChHYW1lU3ltYm9sLlgpO1xuICAgICAgICB2YXIgb0NlbGxzID0gdGhpcy5nZXRDZWxsc1dpdGhTeW1ib2woR2FtZVN5bWJvbC5PKTtcbiAgICAgICAgZnVuY3Rpb24gZmluZEZpdmVJblJvdyhjZWxscykge1xuICAgICAgICAgICAgZnVuY3Rpb24gZXhpc3RzKGNlbGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGNlbGxzXzIgPSBjZWxsczsgX2kgPCBjZWxsc18yLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IGNlbGxzXzJbX2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbC5lcXVhbHMoYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgRElSRUNUSU9OU18xID0gZXhwb3J0cy5ESVJFQ1RJT05TOyBfaSA8IERJUkVDVElPTlNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gRElSRUNUSU9OU18xW19pXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfYSA9IDAsIGNlbGxzXzEgPSBjZWxsczsgX2EgPCBjZWxsc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IGNlbGxzXzFbX2FdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRWZWN0b3IgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxIC0gbWFpbl8xLkdSSURfU0laRTsgaSA8IG1haW5fMS5HUklEX1NJWkU7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFZlY3RvciA9IGNlbGwuYWRkVmVjdG9yKGRpcmVjdGlvbi5tdWx0aXBseShpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFZlY3Rvci5pc091dE9mQm91bmRzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMobmV4dFZlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3crKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93ID09PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbmRGaXZlSW5Sb3coeENlbGxzKSkge1xuICAgICAgICAgICAgcmV0dXJuIEdhbWVTeW1ib2wuWDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmaW5kRml2ZUluUm93KG9DZWxscykpIHtcbiAgICAgICAgICAgIHJldHVybiBHYW1lU3ltYm9sLk87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEdhbWVTeW1ib2wuTk9ORTtcbiAgICB9O1xuICAgIEdhbWVHcmlkLnByb3RvdHlwZS5hZGRTeW1ib2wgPSBmdW5jdGlvbiAocG9zLCBzeW1ib2wpIHtcbiAgICAgICAgdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldID0gc3ltYm9sO1xuICAgIH07XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldFN5bWJvbEF0ID0gZnVuY3Rpb24gKHBvcykge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldO1xuICAgIH07XG4gICAgcmV0dXJuIEdhbWVHcmlkO1xufSgpKTtcbmV4cG9ydHMuR2FtZUdyaWQgPSBHYW1lR3JpZDtcbnZhciBTeW1ib2xSb3cgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3ltYm9sUm93KHJvdywgZGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMucm93ID0gcm93O1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIFN5bWJvbFJvdztcbn0oKSk7XG5leHBvcnRzLlN5bWJvbFJvdyA9IFN5bWJvbFJvdztcbnZhciBTeW1ib2xDb2xsZWN0aW9uID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN5bWJvbENvbGxlY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3ltYm9scyA9IFtdO1xuICAgIH1cbiAgICBTeW1ib2xDb2xsZWN0aW9uLnByb3RvdHlwZS5hZGRTeW1ib2wgPSBmdW5jdGlvbiAoc3ltYm9sKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnN5bWJvbHM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWRkZWRTeW1ib2wgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAoYWRkZWRTeW1ib2wuZXF1YWxzKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zeW1ib2xzLnB1c2goc3ltYm9sKTtcbiAgICB9O1xuICAgIFN5bWJvbENvbGxlY3Rpb24ucHJvdG90eXBlLnRvU3ltYm9sUm93ID0gZnVuY3Rpb24gKGRpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IFN5bWJvbFJvdygoMCwgdXRpbHNfMS5jbG9uZU9iamVjdEFycmF5KSh0aGlzLnN5bWJvbHMpLCBkaXJlY3Rpb24pO1xuICAgIH07XG4gICAgU3ltYm9sQ29sbGVjdGlvbi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2xzLmxlbmd0aDtcbiAgICB9O1xuICAgIHJldHVybiBTeW1ib2xDb2xsZWN0aW9uO1xufSgpKTtcbnZhciBHYW1lTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZU1vZGVsKGdyaWQsIHN5bWJvbCkge1xuICAgICAgICAvLyAyXG4gICAgICAgIHRoaXMudHdvSW5Sb3cgPSBbXTtcbiAgICAgICAgLy8gM1xuICAgICAgICB0aGlzLm9wZW5UaHJlZUluUm93ID0gW107XG4gICAgICAgIHRoaXMuY2xvc2VkVGhyZWVJblJvdyA9IFtdO1xuICAgICAgICB0aGlzLm9wZW5TcGxpdFRocmVlSW5Sb3cgPSBbXTtcbiAgICAgICAgLy8gNFxuICAgICAgICB0aGlzLm9wZW5Gb3VySW5Sb3cgPSBbXTtcbiAgICAgICAgdGhpcy5jbG9zZWRGb3VySW5Sb3cgPSBbXTtcbiAgICAgICAgdGhpcy5ncmlkID0gZ3JpZDtcbiAgICAgICAgdGhpcy5zeW1ib2wgPSBzeW1ib2w7XG4gICAgICAgIHRoaXMuYW5hbHlzZUdyaWQoKTtcbiAgICB9XG4gICAgR2FtZU1vZGVsLmNhblNhdmVSb3cgPSBmdW5jdGlvbiAocm93cywgcm93KSB7XG4gICAgICAgIGZpcnN0TG9vcDogZm9yICh2YXIgX2kgPSAwLCByb3dzXzEgPSByb3dzOyBfaSA8IHJvd3NfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gcm93c18xW19pXTtcbiAgICAgICAgICAgIGlmIChyb3cucm93Lmxlbmd0aCAhPSBjdXJyZW50LnJvdy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudC5yb3cubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWN1cnJlbnQucm93W2ldLmVxdWFscyhyb3cucm93W2ldKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBmaXJzdExvb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5hbmFseXNlR3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gXFwvXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbWFpbl8xLkdSSURfU0laRTsgKyt4KSB7XG4gICAgICAgICAgICB0aGlzLmFuYWx5c2VSb3cobmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgMCksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDAsIDEpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyAtPlxuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG1haW5fMS5HUklEX1NJWkU7ICsreSkge1xuICAgICAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDAsIHkpLCBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAwKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gX1xcfFxuICAgICAgICB0aGlzLmFuYWx5c2VSb3cobmV3IHZlY3Rvcl8xLlZlY3RvcjIoMCwgMCksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDEsIDEpKTtcbiAgICAgICAgZm9yICh2YXIgZGlhZ29uYWxBID0gMTsgZGlhZ29uYWxBIDwgbWFpbl8xLkdSSURfU0laRSAtIDQ7ICsrZGlhZ29uYWxBKSB7XG4gICAgICAgICAgICB0aGlzLmFuYWx5c2VSb3cobmV3IHZlY3Rvcl8xLlZlY3RvcjIoZGlhZ29uYWxBLCAwKSwgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgMSkpO1xuICAgICAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDAsIGRpYWdvbmFsQSksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDEsIDEpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyDLnS98XG4gICAgICAgIHRoaXMuYW5hbHlzZVJvdyhuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCBtYWluXzEuR1JJRF9TSVpFIC0gMSksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDEsIC0xKSk7XG4gICAgICAgIGZvciAodmFyIGRpYWdvbmFsQiA9IDE7IGRpYWdvbmFsQiA8IG1haW5fMS5HUklEX1NJWkUgLSA0OyArK2RpYWdvbmFsQikge1xuICAgICAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDAsIChtYWluXzEuR1JJRF9TSVpFIC0gMSkgLSBkaWFnb25hbEIpLCBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAtMSkpO1xuICAgICAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKGRpYWdvbmFsQiwgMCksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDEsIC0xKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuc2F2ZVJvdyA9IGZ1bmN0aW9uIChyb3csIGNsb3NlZCkge1xuICAgICAgICBzd2l0Y2ggKHJvdy5yb3cubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgaWYgKGNsb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlZFRocmVlSW5Sb3cucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuVGhyZWVJblJvdy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGlmIChjbG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZWRGb3VySW5Sb3cucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRm91ckluUm93LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuYW5hbHlzZVJvdyA9IGZ1bmN0aW9uIChzdGFydCwgZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciBjdXJyZW50Um93ID0gbmV3IFN5bWJvbENvbGxlY3Rpb24oKTtcbiAgICAgICAgdmFyIGNsb3NlZCA9IHRydWU7IC8vIENsb3NlZCBiZWNhdXNlIHRoZSBpdGVyYXRpb24gc3RhcnRzIGF0IGVuZCBvZiB0aGUgcm93XG4gICAgICAgIHZhciBsYXN0Um93OyAvLyBMYXN0IHJvdyByZXByZXNlbnRzIGxhc3QgZm91bmQgcm93IHdoZW4gaXQncyBub3QgY2xvc2VkXG4gICAgICAgIHZhciBuZXh0Q2VsbDtcbiAgICAgICAgdmFyIG5leHRTeW1ib2w7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFpbl8xLkdSSURfU0laRTsgKytpKSB7XG4gICAgICAgICAgICBuZXh0Q2VsbCA9IHN0YXJ0LmFkZFZlY3RvcihkaXJlY3Rpb24ubXVsdGlwbHkoaSkpO1xuICAgICAgICAgICAgaWYgKG5leHRDZWxsLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dFN5bWJvbCA9IHRoaXMuZ3JpZC5nZXRTeW1ib2xBdChuZXh0Q2VsbCk7XG4gICAgICAgICAgICAvLyBTYXZpbmdcbiAgICAgICAgICAgIGlmIChuZXh0U3ltYm9sICE9PSB0aGlzLnN5bWJvbCAmJiBjdXJyZW50Um93Lmxlbmd0aCgpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRTeW1ib2wgPT09IEdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0Um93ID0gKDAsIHV0aWxzXzEuY2xvbmUpKGN1cnJlbnRSb3cpO1xuICAgICAgICAgICAgICAgICAgICBjbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRSb3cgPSBuZXcgU3ltYm9sQ29sbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlUm93KGN1cnJlbnRSb3cudG9TeW1ib2xSb3coZGlyZWN0aW9uKSwgY2xvc2VkKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50Um93ID0gbmV3IFN5bWJvbENvbGxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdXJyZW50Um93Lmxlbmd0aCgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRTeW1ib2wgPT09IG9wcG9uZW50U3ltYm9sKHRoaXMuc3ltYm9sKSkge1xuICAgICAgICAgICAgICAgICAgICBjbG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChuZXh0U3ltYm9sID09PSBHYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Um93LmFkZFN5bWJvbChuZXh0Q2VsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudFJvdy5hZGRTeW1ib2wobmV4dENlbGwpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLmdldFR3b0luUm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50d29JblJvdztcbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuZ2V0T3BlblRocmVlSW5Sb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5UaHJlZUluUm93O1xuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5nZXRDbG9zZWRGb3VySW5Sb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb3NlZEZvdXJJblJvdztcbiAgICB9O1xuICAgIHJldHVybiBHYW1lTW9kZWw7XG59KCkpO1xuZXhwb3J0cy5HYW1lTW9kZWwgPSBHYW1lTW9kZWw7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkdSSURfU0laRSA9IHZvaWQgMDtcbnZhciBjb252ZXJ0XzEgPSByZXF1aXJlKFwiLi9jb252ZXJ0XCIpO1xudmFyIGdhbWVfbW9kZWxfMSA9IHJlcXVpcmUoXCIuL2dhbWUtbW9kZWxcIik7XG52YXIgdmVjdG9yXzEgPSByZXF1aXJlKFwiLi92ZWN0b3JcIik7XG52YXIgYWlfMSA9IHJlcXVpcmUoXCIuL2FpXCIpO1xuZXhwb3J0cy5HUklEX1NJWkUgPSAxNTtcbmNvbnNvbGUubG9nKFwiU3RhcnRpbmcgdGhlIGFwcGxpY2F0aW9uXCIpO1xudmFyIGdhbWVHcmlkID0gbmV3IGdhbWVfbW9kZWxfMS5HYW1lR3JpZCgpO1xudmFyIHBsYXllclN5bWJvbCA9IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLlg7XG52YXIgYWlTeW1ib2wgPSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5PO1xudmFyIHBsYXlpbmcgPSB0cnVlO1xuLy8gSGFuZGxpbmcgY2xpY2tcbiQoZnVuY3Rpb24gKCkge1xuICAgICQoXCIuY2VsbFwiKS5iaW5kKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9ICQodGhpcyk7XG4gICAgICAgIHZhciBjbGlja1Bvc2l0aW9uID0gKDAsIGNvbnZlcnRfMS5pbmRleFRvVmVjdG9yKShlbGVtZW50LmluZGV4KCkpO1xuICAgICAgICAvLyBXZSBjYW5ub3QgcGxhY2Ugc3ltYm9sIHRvIGNlbGwgd2hpY2ggYWxyZWFkeSBoYXMgYW5vdGhlciBvbmVcbiAgICAgICAgaWYgKGdhbWVHcmlkLmdldFN5bWJvbEF0KGNsaWNrUG9zaXRpb24pICE9PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwbGF5aW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGxheVN5bWJvbChjbGlja1Bvc2l0aW9uLCBwbGF5ZXJTeW1ib2wpO1xuICAgICAgICBzYXZlU3ltYm9sKGNsaWNrUG9zaXRpb24sIHBsYXllclN5bWJvbCk7XG4gICAgICAgIGlmIChnYW1lR3JpZC5maW5kRml2ZUluQVJvdygpID09PSBwbGF5ZXJTeW1ib2wpIHtcbiAgICAgICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29uZ3JhdHMhIFlvdSBoYXZlIHdvbiB0aGUgZ2FtZSFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlQ2xpY2soY2xpY2tQb3NpdGlvbik7XG4gICAgfSk7XG59KTtcbi8vIERpc3BsYXkgc3R1ZmZcbmZ1bmN0aW9uIGRpc3BsYXlTeW1ib2wocG9zaXRpb24sIHN5bWJvbCkge1xuICAgICQoXCIuZ2FtZS1ncmlkXCIpXG4gICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgIC5lcSgoMCwgY29udmVydF8xLnZlY3RvclRvSW5kZXgpKHBvc2l0aW9uKSlcbiAgICAgICAgLmFkZENsYXNzKHN5bWJvbCk7XG59XG5mdW5jdGlvbiBkaXNwbGF5UHJpb3JpdHkocG9zaXRpb24sIHByaW9yaXR5KSB7XG4gICAgJChcIi5nYW1lLWdyaWRcIilcbiAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgLmVxKCgwLCBjb252ZXJ0XzEudmVjdG9yVG9JbmRleCkocG9zaXRpb24pKVxuICAgICAgICAudGV4dChwcmlvcml0eS50b1N0cmluZygpKTtcbn1cbmZ1bmN0aW9uIHNhdmVTeW1ib2wocG9zaXRpb24sIHN5bWJvbCkge1xuICAgIGdhbWVHcmlkLmFkZFN5bWJvbChwb3NpdGlvbiwgc3ltYm9sKTtcbn1cbi8vIEdhbWUgc3R1ZmZcbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKGNsaWNrUG9zaXRpb24pIHtcbiAgICB2YXIgYWlSZXN1bHQgPSAobmV3IGFpXzEuQUl2MihnYW1lR3JpZCkpLnBsYXkoYWlTeW1ib2wpO1xuICAgIGRpc3BsYXlTeW1ib2woYWlSZXN1bHQuZmluYWxQb3MsIGFpU3ltYm9sKTtcbiAgICBzYXZlU3ltYm9sKGFpUmVzdWx0LmZpbmFsUG9zLCBhaVN5bWJvbCk7XG4gICAgdmFyIHZlYztcbiAgICB2YXIgaSA9IDA7XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCBleHBvcnRzLkdSSURfU0laRTsgKyt4KSB7XG4gICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgZXhwb3J0cy5HUklEX1NJWkU7ICsreSkge1xuICAgICAgICAgICAgdmVjID0gbmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgeSk7XG4gICAgICAgICAgICBpZiAoZ2FtZUdyaWQuZ2V0U3ltYm9sQXQodmVjKSA9PT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSB8fCB2ZWMuZXF1YWxzKGFpUmVzdWx0LmZpbmFsUG9zKSkge1xuICAgICAgICAgICAgICAgIGRpc3BsYXlQcmlvcml0eSh2ZWMsIGFpUmVzdWx0LnByaW9yaXRpZXNbaSsrXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5UHJpb3JpdHkodmVjLCAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGdhbWVHcmlkLmZpbmRGaXZlSW5BUm93KCkgPT09IGFpU3ltYm9sKSB7XG4gICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJZb3UgbG9zZVwiKTtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmNsb25lT2JqZWN0QXJyYXkgPSBleHBvcnRzLmNsb25lID0gdm9pZCAwO1xuZnVuY3Rpb24gY2xvbmUob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSksIG9iaik7XG59XG5leHBvcnRzLmNsb25lID0gY2xvbmU7XG5mdW5jdGlvbiBjbG9uZU9iamVjdEFycmF5KGFycikge1xuICAgIHZhciBjbG9uZUFyciA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNsb25lQXJyW2ldID0gY2xvbmUoYXJyW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb25lQXJyO1xufVxuZXhwb3J0cy5jbG9uZU9iamVjdEFycmF5ID0gY2xvbmVPYmplY3RBcnJheTtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuVmVjdG9yMiA9IHZvaWQgMDtcbnZhciBtYWluXzEgPSByZXF1aXJlKFwiLi9tYWluXCIpO1xudmFyIFZlY3RvcjIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVmVjdG9yMih4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIFZlY3RvcjIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggKyB4LCB0aGlzLnkgKyB5KTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmFkZFZlY3RvciA9IGZ1bmN0aW9uICh2ZWMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKHZlYy54LCB2ZWMueSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZCgteCwgLXkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuc3VidHJhY3RWZWN0b3IgPSBmdW5jdGlvbiAodmVjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZCgtdmVjLngsIC12ZWMueSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggKiBpLCB0aGlzLnkgKiBpKTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmRpdmlkZSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KDEgLyBpKTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uICh2ZWMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0gdmVjLnggJiYgdGhpcy55ID09PSB2ZWMueTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmlzRWRnZUNlbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IDAgfHwgdGhpcy55ID09PSAwIHx8IHRoaXMueCArIDEgPT09IG1haW5fMS5HUklEX1NJWkUgfHwgdGhpcy55ICsgMSA9PT0gbWFpbl8xLkdSSURfU0laRTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmlzT3V0T2ZCb3VuZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPCAwIHx8IHRoaXMueCA+PSBtYWluXzEuR1JJRF9TSVpFIHx8IHRoaXMueSA8IDAgfHwgdGhpcy55ID49IG1haW5fMS5HUklEX1NJWkU7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54O1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZ2V0WSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcbiAgICB9O1xuICAgIHJldHVybiBWZWN0b3IyO1xufSgpKTtcbmV4cG9ydHMuVmVjdG9yMiA9IFZlY3RvcjI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==