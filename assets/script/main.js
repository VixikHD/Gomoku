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
/**
 * Totally dumb. Place symbols near the opponents symbols.
 */
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
    /**
     * Priors cells matching specified ones around specified GameSymbol
     */
    AIv1.prototype.prioritizeCells = function (cells, priorities, symbol) {
        var grid = this.grid;
        var opponentsSymbol = (symbol === game_model_1.GameSymbol.X ? game_model_1.GameSymbol.O : game_model_1.GameSymbol.X);
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
    AIv1.SYMBOL_PRIORITY = 1;
    return AIv1;
}());
/**
 * Is able to block every simple attack
 */
var AIv2 = /** @class */ (function (_super) {
    __extends(AIv2, _super);
    function AIv2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AIv2.prototype.prioritizeCells = function (cells, priorities, symbol) {
        priorities = _super.prototype.prioritizeCells.call(this, cells, priorities, symbol);
        var gameModel = new game_model_1.GameModel(this.getGrid(), (0, game_model_1.opponentSymbol)(symbol));
        // Prioritize 2 & 2 + 1 in row
        var twoPlusOneInRow = gameModel.getTwoInRow();
        var currentPos;
        for (var _i = 0, twoPlusOneInRow_1 = twoPlusOneInRow; _i < twoPlusOneInRow_1.length; _i++) {
            var row = twoPlusOneInRow_1[_i];
            if (this.getGrid().getSymbolAt(currentPos = row.row[0].subtractVector(row.direction)) === game_model_1.GameSymbol.NONE &&
                this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction.multiply(2))) === (0, game_model_1.opponentSymbol)(symbol)) {
                priorities[findIndex(currentPos, cells)] += AIv2.OPEN_THREE_ROW_PRIORITY;
            }
            if (this.getGrid().getSymbolAt(currentPos = row.row[1].addVector(row.direction)) === game_model_1.GameSymbol.NONE &&
                this.getGrid().getSymbolAt(row.row[1].addVector(row.direction.multiply(2))) === (0, game_model_1.opponentSymbol)(symbol)) {
                priorities[findIndex(currentPos, cells)] += AIv2.OPEN_THREE_ROW_PRIORITY;
            }
            priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv2.OPEN_TWO_ROW_PRIORITY;
            priorities[findIndex(row.row[1].addVector(row.direction), cells)] += AIv2.OPEN_TWO_ROW_PRIORITY;
        }
        // Prioritize open 3 & 3 + 1 in row
        var threeInRow = gameModel.getOpenThreeInRow();
        for (var _a = 0, threeInRow_1 = threeInRow; _a < threeInRow_1.length; _a++) {
            var row = threeInRow_1[_a];
            if (this.getGrid().getSymbolAt(currentPos = row.row[0].subtractVector(row.direction)) === game_model_1.GameSymbol.NONE &&
                this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction.multiply(2))) === (0, game_model_1.opponentSymbol)(symbol)) {
                priorities[findIndex(currentPos, cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
            if (this.getGrid().getSymbolAt(currentPos = row.row[2].addVector(row.direction)) === game_model_1.GameSymbol.NONE &&
                this.getGrid().getSymbolAt(row.row[2].addVector(row.direction.multiply(2))) === (0, game_model_1.opponentSymbol)(symbol)) {
                priorities[findIndex(currentPos, cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
            priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv2.OPEN_THREE_ROW_PRIORITY;
            priorities[findIndex(row.row[2].addVector(row.direction), cells)] += AIv2.OPEN_THREE_ROW_PRIORITY;
        }
        // Prioritize closed 3 + 1
        var closedThreeInRow = gameModel.getClosedThreeInRow();
        for (var _b = 0, closedThreeInRow_1 = closedThreeInRow; _b < closedThreeInRow_1.length; _b++) {
            var row = closedThreeInRow_1[_b];
            if (this.getGrid().getSymbolAt(currentPos = row.row[0].subtractVector(row.direction)) === game_model_1.GameSymbol.NONE &&
                this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction.multiply(2))) === (0, game_model_1.opponentSymbol)(symbol)) {
                priorities[findIndex(currentPos, cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
            if (this.getGrid().getSymbolAt(currentPos = row.row[2].addVector(row.direction)) === game_model_1.GameSymbol.NONE &&
                this.getGrid().getSymbolAt(row.row[2].addVector(row.direction.multiply(2))) === (0, game_model_1.opponentSymbol)(symbol)) {
                priorities[findIndex(currentPos, cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
            priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv2.OPEN_THREE_ROW_PRIORITY;
            priorities[findIndex(row.row[2].addVector(row.direction), cells)] += AIv2.OPEN_THREE_ROW_PRIORITY;
        }
        // Prioritize 4 in row
        var fourInRow = gameModel.getClosedFourInRow();
        for (var _c = 0, fourInRow_1 = fourInRow; _c < fourInRow_1.length; _c++) {
            var row = fourInRow_1[_c];
            if ((!row.row[0].subtractVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction)) === game_model_1.GameSymbol.NONE) {
                priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
            else if ((!row.row[0].addVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[0].addVector(row.direction)) === game_model_1.GameSymbol.NONE) {
                priorities[findIndex(row.row[0].addVector(row.direction), cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
            else if ((!row.row[3].subtractVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[3].subtractVector(row.direction)) === game_model_1.GameSymbol.NONE) {
                priorities[findIndex(row.row[3].subtractVector(row.direction), cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
            else if ((!row.row[3].addVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[3].addVector(row.direction)) == game_model_1.GameSymbol.NONE) {
                priorities[findIndex(row.row[3].addVector(row.direction), cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
        }
        return priorities;
    };
    AIv2.OPEN_TWO_ROW_PRIORITY = AIv2.SYMBOL_PRIORITY * 9 + 1;
    AIv2.OPEN_THREE_ROW_PRIORITY = AIv2.OPEN_TWO_ROW_PRIORITY * 9 + 1;
    AIv2.HALF_OPEN_FOUR_ROW_PRIORITY = AIv2.OPEN_THREE_ROW_PRIORITY * 9 + 1;
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
                if (gameSymbol === null || this.grid[x][y] === gameSymbol) {
                    cells.push(new vector_1.Vector2(x, y));
                }
            }
        }
        return cells;
    };
    GameGrid.prototype.findFiveInARow = function () {
        var gameModel;
        gameModel = new GameModel(this, GameSymbol.X);
        if (gameModel.getFiveInRow().length !== 0) {
            return GameSymbol.X;
        }
        gameModel = new GameModel(this, GameSymbol.O);
        if (gameModel.getFiveInRow().length !== 0) {
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
        // 5
        this.fiveInRow = [];
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
    GameModel.prototype.saveRow = function (row, closed) {
        switch (row.row.length) {
            case 2:
                if (!closed) {
                    this.twoInRow.push(row);
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
            case 5:
                this.fiveInRow.push(row);
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
                    this.saveRow(currentRow.toSymbolRow(direction), closed || nextSymbol == opponentSymbol(this.symbol));
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
    GameModel.prototype.getClosedThreeInRow = function () {
        return this.closedThreeInRow;
    };
    GameModel.prototype.getOpenThreeInRow = function () {
        return this.openThreeInRow;
    };
    GameModel.prototype.getClosedFourInRow = function () {
        return this.closedFourInRow;
    };
    GameModel.prototype.getFiveInRow = function () {
        return this.fiveInRow;
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
exports.IS_DEBUG_ENABLED = exports.GRID_SIZE = void 0;
var convert_1 = __webpack_require__(/*! ./convert */ "./src/convert.ts");
var game_model_1 = __webpack_require__(/*! ./game-model */ "./src/game-model.ts");
var vector_1 = __webpack_require__(/*! ./vector */ "./src/vector.ts");
var ai_1 = __webpack_require__(/*! ./ai */ "./src/ai.ts");
exports.GRID_SIZE = 15;
exports.IS_DEBUG_ENABLED = false;
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
    if (exports.IS_DEBUG_ENABLED) {
        var vec = void 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0MsNEJBQTRCLHVCQUF1QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDNUVhO0FBQ2Isa0JBQWtCO0FBQ2xCLHdCQUF3QixHQUFHLGFBQWE7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCOzs7Ozs7Ozs7OztBQ2RYO0FBQ2Isa0JBQWtCO0FBQ2xCLGVBQWU7QUFDZixhQUFhLG1CQUFPLENBQUMsNkJBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGVBQWU7Ozs7Ozs7VUM1Q2Y7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0dvbW9rdS8uL3NyYy9haS50cyIsIndlYnBhY2s6Ly9Hb21va3UvLi9zcmMvY29udmVydC50cyIsIndlYnBhY2s6Ly9Hb21va3UvLi9zcmMvZ2FtZS1tb2RlbC50cyIsIndlYnBhY2s6Ly9Hb21va3UvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9Hb21va3UvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vR29tb2t1Ly4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly9Hb21va3Uvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vR29tb2t1L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vR29tb2t1L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9Hb21va3Uvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkFJdjIgPSBleHBvcnRzLkFJUmVzdWx0ID0gdm9pZCAwO1xudmFyIGdhbWVfbW9kZWxfMSA9IHJlcXVpcmUoXCIuL2dhbWUtbW9kZWxcIik7XG5mdW5jdGlvbiBmaW5kSW5kZXgocG9zLCBhcnIpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAoYXJyW2ldLmVxdWFscyhwb3MpKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxudmFyIEFJUmVzdWx0ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFJUmVzdWx0KHByaW9yaXRpZXMsIGZpbmFsUG9zKSB7XG4gICAgICAgIHRoaXMucHJpb3JpdGllcyA9IHByaW9yaXRpZXM7XG4gICAgICAgIHRoaXMuZmluYWxQb3MgPSBmaW5hbFBvcztcbiAgICB9XG4gICAgcmV0dXJuIEFJUmVzdWx0O1xufSgpKTtcbmV4cG9ydHMuQUlSZXN1bHQgPSBBSVJlc3VsdDtcbi8qKlxuICogVG90YWxseSBkdW1iLiBQbGFjZSBzeW1ib2xzIG5lYXIgdGhlIG9wcG9uZW50cyBzeW1ib2xzLlxuICovXG52YXIgQUl2MSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBSXYxKGdyaWQpIHtcbiAgICAgICAgdGhpcy5ncmlkID0gZ3JpZDtcbiAgICB9XG4gICAgQUl2MS5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uIChzeW1ib2wpIHtcbiAgICAgICAgdmFyIGVtcHR5Q2VsbHMgPSB0aGlzLmdyaWQuZ2V0RW1wdHlDZWxscygpO1xuICAgICAgICB2YXIgcHJpb3JpdGllcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVtcHR5Q2VsbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHByaW9yaXRpZXNbaV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHByaW9yaXRpZXMgPSB0aGlzLnByaW9yaXRpemVDZWxscyhlbXB0eUNlbGxzLCBwcmlvcml0aWVzLCBzeW1ib2wpO1xuICAgICAgICB2YXIgbWF4UHJpb3JpdHkgPSAtMTtcbiAgICAgICAgdmFyIGZpbmFsUG9zaXRpb247XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJpb3JpdGllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKHByaW9yaXRpZXNbaV0gPT0gbWF4UHJpb3JpdHkgJiYgTWF0aC5yYW5kb20oKSA+IDAuNykge1xuICAgICAgICAgICAgICAgIGZpbmFsUG9zaXRpb24gPSBlbXB0eUNlbGxzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocHJpb3JpdGllc1tpXSA+IG1heFByaW9yaXR5KSB7XG4gICAgICAgICAgICAgICAgbWF4UHJpb3JpdHkgPSBwcmlvcml0aWVzW2ldO1xuICAgICAgICAgICAgICAgIGZpbmFsUG9zaXRpb24gPSBlbXB0eUNlbGxzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQUlSZXN1bHQocHJpb3JpdGllcywgZmluYWxQb3NpdGlvbik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBQcmlvcnMgY2VsbHMgbWF0Y2hpbmcgc3BlY2lmaWVkIG9uZXMgYXJvdW5kIHNwZWNpZmllZCBHYW1lU3ltYm9sXG4gICAgICovXG4gICAgQUl2MS5wcm90b3R5cGUucHJpb3JpdGl6ZUNlbGxzID0gZnVuY3Rpb24gKGNlbGxzLCBwcmlvcml0aWVzLCBzeW1ib2wpIHtcbiAgICAgICAgdmFyIGdyaWQgPSB0aGlzLmdyaWQ7XG4gICAgICAgIHZhciBvcHBvbmVudHNTeW1ib2wgPSAoc3ltYm9sID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5YID8gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTyA6IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLlgpO1xuICAgICAgICB2YXIgb3Bwb25lbnRzQ2VsbHMgPSBncmlkLmdldENlbGxzV2l0aFN5bWJvbChvcHBvbmVudHNTeW1ib2wpO1xuICAgICAgICBvcHBvbmVudHNDZWxscy5mb3JFYWNoKGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgICAgIGdyaWQuZ2V0Q2VsbHNBcm91bmQocG9zLCAxKS5mb3JFYWNoKGZ1bmN0aW9uIChwb3NBcm91bmQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNlbGxzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NBcm91bmQuZXF1YWxzKGNlbGxzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdGllc1tpXSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJpb3JpdGllcztcbiAgICB9O1xuICAgIEFJdjEucHJvdG90eXBlLmdldEdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWQ7XG4gICAgfTtcbiAgICBBSXYxLlNZTUJPTF9QUklPUklUWSA9IDE7XG4gICAgcmV0dXJuIEFJdjE7XG59KCkpO1xuLyoqXG4gKiBJcyBhYmxlIHRvIGJsb2NrIGV2ZXJ5IHNpbXBsZSBhdHRhY2tcbiAqL1xudmFyIEFJdjIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFJdjIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQUl2MigpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBBSXYyLnByb3RvdHlwZS5wcmlvcml0aXplQ2VsbHMgPSBmdW5jdGlvbiAoY2VsbHMsIHByaW9yaXRpZXMsIHN5bWJvbCkge1xuICAgICAgICBwcmlvcml0aWVzID0gX3N1cGVyLnByb3RvdHlwZS5wcmlvcml0aXplQ2VsbHMuY2FsbCh0aGlzLCBjZWxscywgcHJpb3JpdGllcywgc3ltYm9sKTtcbiAgICAgICAgdmFyIGdhbWVNb2RlbCA9IG5ldyBnYW1lX21vZGVsXzEuR2FtZU1vZGVsKHRoaXMuZ2V0R3JpZCgpLCAoMCwgZ2FtZV9tb2RlbF8xLm9wcG9uZW50U3ltYm9sKShzeW1ib2wpKTtcbiAgICAgICAgLy8gUHJpb3JpdGl6ZSAyICYgMiArIDEgaW4gcm93XG4gICAgICAgIHZhciB0d29QbHVzT25lSW5Sb3cgPSBnYW1lTW9kZWwuZ2V0VHdvSW5Sb3coKTtcbiAgICAgICAgdmFyIGN1cnJlbnRQb3M7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgdHdvUGx1c09uZUluUm93XzEgPSB0d29QbHVzT25lSW5Sb3c7IF9pIDwgdHdvUGx1c09uZUluUm93XzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gdHdvUGx1c09uZUluUm93XzFbX2ldO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KGN1cnJlbnRQb3MgPSByb3cucm93WzBdLnN1YnRyYWN0VmVjdG9yKHJvdy5kaXJlY3Rpb24pKSA9PT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KHJvdy5yb3dbMF0uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbi5tdWx0aXBseSgyKSkpID09PSAoMCwgZ2FtZV9tb2RlbF8xLm9wcG9uZW50U3ltYm9sKShzeW1ib2wpKSB7XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgoY3VycmVudFBvcywgY2VsbHMpXSArPSBBSXYyLk9QRU5fVEhSRUVfUk9XX1BSSU9SSVRZO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KGN1cnJlbnRQb3MgPSByb3cucm93WzFdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSkgPT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzFdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uLm11bHRpcGx5KDIpKSkgPT09ICgwLCBnYW1lX21vZGVsXzEub3Bwb25lbnRTeW1ib2wpKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChjdXJyZW50UG9zLCBjZWxscyldICs9IEFJdjIuT1BFTl9USFJFRV9ST1dfUFJJT1JJVFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChyb3cucm93WzBdLnN1YnRyYWN0VmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IEFJdjIuT1BFTl9UV09fUk9XX1BSSU9SSVRZO1xuICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1sxXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbiksIGNlbGxzKV0gKz0gQUl2Mi5PUEVOX1RXT19ST1dfUFJJT1JJVFk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJpb3JpdGl6ZSBvcGVuIDMgJiAzICsgMSBpbiByb3dcbiAgICAgICAgdmFyIHRocmVlSW5Sb3cgPSBnYW1lTW9kZWwuZ2V0T3BlblRocmVlSW5Sb3coKTtcbiAgICAgICAgZm9yICh2YXIgX2EgPSAwLCB0aHJlZUluUm93XzEgPSB0aHJlZUluUm93OyBfYSA8IHRocmVlSW5Sb3dfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgIHZhciByb3cgPSB0aHJlZUluUm93XzFbX2FdO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KGN1cnJlbnRQb3MgPSByb3cucm93WzBdLnN1YnRyYWN0VmVjdG9yKHJvdy5kaXJlY3Rpb24pKSA9PT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KHJvdy5yb3dbMF0uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbi5tdWx0aXBseSgyKSkpID09PSAoMCwgZ2FtZV9tb2RlbF8xLm9wcG9uZW50U3ltYm9sKShzeW1ib2wpKSB7XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgoY3VycmVudFBvcywgY2VsbHMpXSArPSBBSXYyLkhBTEZfT1BFTl9GT1VSX1JPV19QUklPUklUWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChjdXJyZW50UG9zID0gcm93LnJvd1syXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbikpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FICYmXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRHcmlkKCkuZ2V0U3ltYm9sQXQocm93LnJvd1syXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbi5tdWx0aXBseSgyKSkpID09PSAoMCwgZ2FtZV9tb2RlbF8xLm9wcG9uZW50U3ltYm9sKShzeW1ib2wpKSB7XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgoY3VycmVudFBvcywgY2VsbHMpXSArPSBBSXYyLkhBTEZfT1BFTl9GT1VSX1JPV19QUklPUklUWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KHJvdy5yb3dbMF0uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbiksIGNlbGxzKV0gKz0gQUl2Mi5PUEVOX1RIUkVFX1JPV19QUklPUklUWTtcbiAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KHJvdy5yb3dbMl0uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IEFJdjIuT1BFTl9USFJFRV9ST1dfUFJJT1JJVFk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJpb3JpdGl6ZSBjbG9zZWQgMyArIDFcbiAgICAgICAgdmFyIGNsb3NlZFRocmVlSW5Sb3cgPSBnYW1lTW9kZWwuZ2V0Q2xvc2VkVGhyZWVJblJvdygpO1xuICAgICAgICBmb3IgKHZhciBfYiA9IDAsIGNsb3NlZFRocmVlSW5Sb3dfMSA9IGNsb3NlZFRocmVlSW5Sb3c7IF9iIDwgY2xvc2VkVGhyZWVJblJvd18xLmxlbmd0aDsgX2IrKykge1xuICAgICAgICAgICAgdmFyIHJvdyA9IGNsb3NlZFRocmVlSW5Sb3dfMVtfYl07XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRHcmlkKCkuZ2V0U3ltYm9sQXQoY3VycmVudFBvcyA9IHJvdy5yb3dbMF0uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbikpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FICYmXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRHcmlkKCkuZ2V0U3ltYm9sQXQocm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uLm11bHRpcGx5KDIpKSkgPT09ICgwLCBnYW1lX21vZGVsXzEub3Bwb25lbnRTeW1ib2wpKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChjdXJyZW50UG9zLCBjZWxscyldICs9IEFJdjIuSEFMRl9PUEVOX0ZPVVJfUk9XX1BSSU9SSVRZO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KGN1cnJlbnRQb3MgPSByb3cucm93WzJdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSkgPT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzJdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uLm11bHRpcGx5KDIpKSkgPT09ICgwLCBnYW1lX21vZGVsXzEub3Bwb25lbnRTeW1ib2wpKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChjdXJyZW50UG9zLCBjZWxscyldICs9IEFJdjIuSEFMRl9PUEVOX0ZPVVJfUk9XX1BSSU9SSVRZO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKSwgY2VsbHMpXSArPSBBSXYyLk9QRU5fVEhSRUVfUk9XX1BSSU9SSVRZO1xuICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1syXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbiksIGNlbGxzKV0gKz0gQUl2Mi5PUEVOX1RIUkVFX1JPV19QUklPUklUWTtcbiAgICAgICAgfVxuICAgICAgICAvLyBQcmlvcml0aXplIDQgaW4gcm93XG4gICAgICAgIHZhciBmb3VySW5Sb3cgPSBnYW1lTW9kZWwuZ2V0Q2xvc2VkRm91ckluUm93KCk7XG4gICAgICAgIGZvciAodmFyIF9jID0gMCwgZm91ckluUm93XzEgPSBmb3VySW5Sb3c7IF9jIDwgZm91ckluUm93XzEubGVuZ3RoOyBfYysrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gZm91ckluUm93XzFbX2NdO1xuICAgICAgICAgICAgaWYgKCghcm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKS5pc091dE9mQm91bmRzKCkpICYmIHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KHJvdy5yb3dbMF0uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbikpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKSwgY2VsbHMpXSArPSBBSXYyLkhBTEZfT1BFTl9GT1VSX1JPV19QUklPUklUWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCghcm93LnJvd1swXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbikuaXNPdXRPZkJvdW5kcygpKSAmJiB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzBdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSkgPT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChyb3cucm93WzBdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSwgY2VsbHMpXSArPSBBSXYyLkhBTEZfT1BFTl9GT1VSX1JPV19QUklPUklUWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCghcm93LnJvd1szXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKS5pc091dE9mQm91bmRzKCkpICYmIHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KHJvdy5yb3dbM10uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbikpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1szXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKSwgY2VsbHMpXSArPSBBSXYyLkhBTEZfT1BFTl9GT1VSX1JPV19QUklPUklUWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCghcm93LnJvd1szXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbikuaXNPdXRPZkJvdW5kcygpKSAmJiB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzNdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSkgPT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KHJvdy5yb3dbM10uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IEFJdjIuSEFMRl9PUEVOX0ZPVVJfUk9XX1BSSU9SSVRZO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmlvcml0aWVzO1xuICAgIH07XG4gICAgQUl2Mi5PUEVOX1RXT19ST1dfUFJJT1JJVFkgPSBBSXYyLlNZTUJPTF9QUklPUklUWSAqIDkgKyAxO1xuICAgIEFJdjIuT1BFTl9USFJFRV9ST1dfUFJJT1JJVFkgPSBBSXYyLk9QRU5fVFdPX1JPV19QUklPUklUWSAqIDkgKyAxO1xuICAgIEFJdjIuSEFMRl9PUEVOX0ZPVVJfUk9XX1BSSU9SSVRZID0gQUl2Mi5PUEVOX1RIUkVFX1JPV19QUklPUklUWSAqIDkgKyAxO1xuICAgIHJldHVybiBBSXYyO1xufShBSXYxKSk7XG5leHBvcnRzLkFJdjIgPSBBSXYyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5pbmRleFRvVmVjdG9yID0gZXhwb3J0cy52ZWN0b3JUb0luZGV4ID0gZXhwb3J0cy5jb29yZHNUb0luZGV4ID0gdm9pZCAwO1xudmFyIGdvbW9rdSA9IHJlcXVpcmUoXCIuL21haW5cIik7XG52YXIgdmVjdG9yXzEgPSByZXF1aXJlKFwiLi92ZWN0b3JcIik7XG5mdW5jdGlvbiBjb29yZHNUb0luZGV4KHgsIHkpIHtcbiAgICByZXR1cm4geSAqIGdvbW9rdS5HUklEX1NJWkUgKyB4O1xufVxuZXhwb3J0cy5jb29yZHNUb0luZGV4ID0gY29vcmRzVG9JbmRleDtcbmZ1bmN0aW9uIGdldEluZGV4WChpbmRleCkge1xuICAgIHJldHVybiBpbmRleCAlIGdvbW9rdS5HUklEX1NJWkU7XG59XG5mdW5jdGlvbiBnZXRJbmRleFkoaW5kZXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihpbmRleCAvIGdvbW9rdS5HUklEX1NJWkUpO1xufVxuZnVuY3Rpb24gdmVjdG9yVG9JbmRleCh2ZWMpIHtcbiAgICByZXR1cm4gY29vcmRzVG9JbmRleCh2ZWMuZ2V0WCgpLCB2ZWMuZ2V0WSgpKTtcbn1cbmV4cG9ydHMudmVjdG9yVG9JbmRleCA9IHZlY3RvclRvSW5kZXg7XG5mdW5jdGlvbiBpbmRleFRvVmVjdG9yKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKGdldEluZGV4WChpbmRleCksIGdldEluZGV4WShpbmRleCkpO1xufVxuZXhwb3J0cy5pbmRleFRvVmVjdG9yID0gaW5kZXhUb1ZlY3RvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuR2FtZU1vZGVsID0gZXhwb3J0cy5TeW1ib2xSb3cgPSBleHBvcnRzLkdhbWVHcmlkID0gZXhwb3J0cy5vcHBvbmVudFN5bWJvbCA9IGV4cG9ydHMuR2FtZVN5bWJvbCA9IGV4cG9ydHMuRElSRUNUSU9OUyA9IHZvaWQgMDtcbnZhciB2ZWN0b3JfMSA9IHJlcXVpcmUoXCIuL3ZlY3RvclwiKTtcbnZhciBtYWluXzEgPSByZXF1aXJlKFwiLi9tYWluXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmV4cG9ydHMuRElSRUNUSU9OUyA9IFtcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAxKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCAxKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAwKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAtMSlcbl07XG52YXIgR2FtZVN5bWJvbDtcbihmdW5jdGlvbiAoR2FtZVN5bWJvbCkge1xuICAgIEdhbWVTeW1ib2xbXCJYXCJdID0gXCJ4XCI7XG4gICAgR2FtZVN5bWJvbFtcIk9cIl0gPSBcIm9cIjtcbiAgICBHYW1lU3ltYm9sW1wiTk9ORVwiXSA9IFwiXCI7XG59KShHYW1lU3ltYm9sID0gZXhwb3J0cy5HYW1lU3ltYm9sIHx8IChleHBvcnRzLkdhbWVTeW1ib2wgPSB7fSkpO1xuZnVuY3Rpb24gb3Bwb25lbnRTeW1ib2woc3ltYm9sKSB7XG4gICAgcmV0dXJuIHN5bWJvbCA9PT0gR2FtZVN5bWJvbC5YID8gR2FtZVN5bWJvbC5PIDogR2FtZVN5bWJvbC5YO1xufVxuZXhwb3J0cy5vcHBvbmVudFN5bWJvbCA9IG9wcG9uZW50U3ltYm9sO1xudmFyIEdhbWVHcmlkID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEdhbWVHcmlkKCkge1xuICAgICAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBtYWluXzEuR1JJRF9TSVpFOyArK3gpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFt4XSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBtYWluXzEuR1JJRF9TSVpFOyArK3kpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRbeF1beV0gPSBHYW1lU3ltYm9sLk5PTkU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldENlbGxzV2l0aFN5bWJvbCA9IGZ1bmN0aW9uIChzeW1ib2wpIHtcbiAgICAgICAgdmFyIGNlbGxzID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbWFpbl8xLkdSSURfU0laRTsgKyt4KSB7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG1haW5fMS5HUklEX1NJWkU7ICsreSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyaWRbeF1beV0gPT0gc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLnB1c2gobmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgeSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbHM7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZ2V0RW1wdHlDZWxscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2VsbHNXaXRoU3ltYm9sKEdhbWVTeW1ib2wuTk9ORSk7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZ2V0Q2VsbHNBcm91bmQgPSBmdW5jdGlvbiAocG9zLCBpLCBnYW1lU3ltYm9sKSB7XG4gICAgICAgIGlmIChpID09PSB2b2lkIDApIHsgaSA9IDE7IH1cbiAgICAgICAgaWYgKGdhbWVTeW1ib2wgPT09IHZvaWQgMCkgeyBnYW1lU3ltYm9sID0gbnVsbDsgfVxuICAgICAgICB2YXIgbWluWCA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRYKCkgLSBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBtYXhYID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLmdldFgoKSArIGksIDApLCBtYWluXzEuR1JJRF9TSVpFKTtcbiAgICAgICAgdmFyIG1pblkgPSBNYXRoLm1pbihNYXRoLm1heChwb3MuZ2V0WSgpIC0gaSwgMCksIG1haW5fMS5HUklEX1NJWkUpO1xuICAgICAgICB2YXIgbWF4WSA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRZKCkgKyBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gbWluWDsgeCA8PSBtYXhYOyArK3gpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSBtaW5ZOyB5IDw9IG1heFk7ICsreSkge1xuICAgICAgICAgICAgICAgIGlmIChnYW1lU3ltYm9sID09PSBudWxsIHx8IHRoaXMuZ3JpZFt4XVt5XSA9PT0gZ2FtZVN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICBjZWxscy5wdXNoKG5ldyB2ZWN0b3JfMS5WZWN0b3IyKHgsIHkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNlbGxzO1xuICAgIH07XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmZpbmRGaXZlSW5BUm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZ2FtZU1vZGVsO1xuICAgICAgICBnYW1lTW9kZWwgPSBuZXcgR2FtZU1vZGVsKHRoaXMsIEdhbWVTeW1ib2wuWCk7XG4gICAgICAgIGlmIChnYW1lTW9kZWwuZ2V0Rml2ZUluUm93KCkubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gR2FtZVN5bWJvbC5YO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVNb2RlbCA9IG5ldyBHYW1lTW9kZWwodGhpcywgR2FtZVN5bWJvbC5PKTtcbiAgICAgICAgaWYgKGdhbWVNb2RlbC5nZXRGaXZlSW5Sb3coKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBHYW1lU3ltYm9sLk87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEdhbWVTeW1ib2wuTk9ORTtcbiAgICB9O1xuICAgIEdhbWVHcmlkLnByb3RvdHlwZS5hZGRTeW1ib2wgPSBmdW5jdGlvbiAocG9zLCBzeW1ib2wpIHtcbiAgICAgICAgdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldID0gc3ltYm9sO1xuICAgIH07XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldFN5bWJvbEF0ID0gZnVuY3Rpb24gKHBvcykge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldO1xuICAgIH07XG4gICAgcmV0dXJuIEdhbWVHcmlkO1xufSgpKTtcbmV4cG9ydHMuR2FtZUdyaWQgPSBHYW1lR3JpZDtcbnZhciBTeW1ib2xSb3cgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3ltYm9sUm93KHJvdywgZGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMucm93ID0gcm93O1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIFN5bWJvbFJvdztcbn0oKSk7XG5leHBvcnRzLlN5bWJvbFJvdyA9IFN5bWJvbFJvdztcbnZhciBTeW1ib2xDb2xsZWN0aW9uID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN5bWJvbENvbGxlY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3ltYm9scyA9IFtdO1xuICAgIH1cbiAgICBTeW1ib2xDb2xsZWN0aW9uLnByb3RvdHlwZS5hZGRTeW1ib2wgPSBmdW5jdGlvbiAoc3ltYm9sKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnN5bWJvbHM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWRkZWRTeW1ib2wgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAoYWRkZWRTeW1ib2wuZXF1YWxzKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zeW1ib2xzLnB1c2goc3ltYm9sKTtcbiAgICB9O1xuICAgIFN5bWJvbENvbGxlY3Rpb24ucHJvdG90eXBlLnRvU3ltYm9sUm93ID0gZnVuY3Rpb24gKGRpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IFN5bWJvbFJvdygoMCwgdXRpbHNfMS5jbG9uZU9iamVjdEFycmF5KSh0aGlzLnN5bWJvbHMpLCBkaXJlY3Rpb24pO1xuICAgIH07XG4gICAgU3ltYm9sQ29sbGVjdGlvbi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2xzLmxlbmd0aDtcbiAgICB9O1xuICAgIHJldHVybiBTeW1ib2xDb2xsZWN0aW9uO1xufSgpKTtcbnZhciBHYW1lTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZU1vZGVsKGdyaWQsIHN5bWJvbCkge1xuICAgICAgICAvLyAyXG4gICAgICAgIHRoaXMudHdvSW5Sb3cgPSBbXTtcbiAgICAgICAgLy8gM1xuICAgICAgICB0aGlzLm9wZW5UaHJlZUluUm93ID0gW107XG4gICAgICAgIHRoaXMuY2xvc2VkVGhyZWVJblJvdyA9IFtdO1xuICAgICAgICB0aGlzLm9wZW5TcGxpdFRocmVlSW5Sb3cgPSBbXTtcbiAgICAgICAgLy8gNFxuICAgICAgICB0aGlzLm9wZW5Gb3VySW5Sb3cgPSBbXTtcbiAgICAgICAgdGhpcy5jbG9zZWRGb3VySW5Sb3cgPSBbXTtcbiAgICAgICAgLy8gNVxuICAgICAgICB0aGlzLmZpdmVJblJvdyA9IFtdO1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkO1xuICAgICAgICB0aGlzLnN5bWJvbCA9IHN5bWJvbDtcbiAgICAgICAgdGhpcy5hbmFseXNlR3JpZCgpO1xuICAgIH1cbiAgICBHYW1lTW9kZWwuY2FuU2F2ZVJvdyA9IGZ1bmN0aW9uIChyb3dzLCByb3cpIHtcbiAgICAgICAgZmlyc3RMb29wOiBmb3IgKHZhciBfaSA9IDAsIHJvd3NfMSA9IHJvd3M7IF9pIDwgcm93c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSByb3dzXzFbX2ldO1xuICAgICAgICAgICAgaWYgKHJvdy5yb3cubGVuZ3RoICE9IGN1cnJlbnQucm93Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50LnJvdy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmICghY3VycmVudC5yb3dbaV0uZXF1YWxzKHJvdy5yb3dbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGZpcnN0TG9vcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLmFuYWx5c2VHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBcXC9cbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBtYWluXzEuR1JJRF9TSVpFOyArK3gpIHtcbiAgICAgICAgICAgIHRoaXMuYW5hbHlzZVJvdyhuZXcgdmVjdG9yXzEuVmVjdG9yMih4LCAwKSwgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMCwgMSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIC0+XG4gICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgbWFpbl8xLkdSSURfU0laRTsgKyt5KSB7XG4gICAgICAgICAgICB0aGlzLmFuYWx5c2VSb3cobmV3IHZlY3Rvcl8xLlZlY3RvcjIoMCwgeSksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDEsIDApKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBfXFx8XG4gICAgICAgIHRoaXMuYW5hbHlzZVJvdyhuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCAwKSwgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgMSkpO1xuICAgICAgICBmb3IgKHZhciBkaWFnb25hbEEgPSAxOyBkaWFnb25hbEEgPCBtYWluXzEuR1JJRF9TSVpFIC0gNDsgKytkaWFnb25hbEEpIHtcbiAgICAgICAgICAgIHRoaXMuYW5hbHlzZVJvdyhuZXcgdmVjdG9yXzEuVmVjdG9yMihkaWFnb25hbEEsIDApLCBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAxKSk7XG4gICAgICAgICAgICB0aGlzLmFuYWx5c2VSb3cobmV3IHZlY3Rvcl8xLlZlY3RvcjIoMCwgZGlhZ29uYWxBKSwgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgMSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIMudL3xcbiAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDAsIG1haW5fMS5HUklEX1NJWkUgLSAxKSwgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgLTEpKTtcbiAgICAgICAgZm9yICh2YXIgZGlhZ29uYWxCID0gMTsgZGlhZ29uYWxCIDwgbWFpbl8xLkdSSURfU0laRSAtIDQ7ICsrZGlhZ29uYWxCKSB7XG4gICAgICAgICAgICB0aGlzLmFuYWx5c2VSb3cobmV3IHZlY3Rvcl8xLlZlY3RvcjIoMCwgKG1haW5fMS5HUklEX1NJWkUgLSAxKSAtIGRpYWdvbmFsQiksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDEsIC0xKSk7XG4gICAgICAgICAgICB0aGlzLmFuYWx5c2VSb3cobmV3IHZlY3Rvcl8xLlZlY3RvcjIoZGlhZ29uYWxCLCBtYWluXzEuR1JJRF9TSVpFIC0gMSksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDEsIC0xKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuc2F2ZVJvdyA9IGZ1bmN0aW9uIChyb3csIGNsb3NlZCkge1xuICAgICAgICBzd2l0Y2ggKHJvdy5yb3cubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKCFjbG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50d29JblJvdy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGlmIChjbG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZWRUaHJlZUluUm93LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlblRocmVlSW5Sb3cucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBpZiAoY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VkRm91ckluUm93LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkZvdXJJblJvdy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIHRoaXMuZml2ZUluUm93LnB1c2gocm93KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5hbmFseXNlUm93ID0gZnVuY3Rpb24gKHN0YXJ0LCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIGN1cnJlbnRSb3cgPSBuZXcgU3ltYm9sQ29sbGVjdGlvbigpO1xuICAgICAgICB2YXIgY2xvc2VkID0gdHJ1ZTsgLy8gQ2xvc2VkIGJlY2F1c2UgdGhlIGl0ZXJhdGlvbiBzdGFydHMgYXQgZW5kIG9mIHRoZSByb3dcbiAgICAgICAgdmFyIGxhc3RSb3cgPSBudWxsOyAvLyBMYXN0IHJvdyByZXByZXNlbnRzIGxhc3QgZm91bmQgcm93IHdoZW4gaXQncyBub3QgY2xvc2VkXG4gICAgICAgIHZhciBuZXh0Q2VsbDtcbiAgICAgICAgdmFyIG5leHRTeW1ib2w7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFpbl8xLkdSSURfU0laRTsgKytpKSB7XG4gICAgICAgICAgICBuZXh0Q2VsbCA9IHN0YXJ0LmFkZFZlY3RvcihkaXJlY3Rpb24ubXVsdGlwbHkoaSkpO1xuICAgICAgICAgICAgaWYgKG5leHRDZWxsLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dFN5bWJvbCA9IHRoaXMuZ3JpZC5nZXRTeW1ib2xBdChuZXh0Q2VsbCk7XG4gICAgICAgICAgICAvLyBTYXZpbmdcbiAgICAgICAgICAgIGlmIChuZXh0U3ltYm9sICE9PSB0aGlzLnN5bWJvbCAmJiBjdXJyZW50Um93Lmxlbmd0aCgpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjbG9zZWQgfHwgbmV4dFN5bWJvbCA9PT0gR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVJvdyhjdXJyZW50Um93LnRvU3ltYm9sUm93KGRpcmVjdGlvbiksIGNsb3NlZCB8fCBuZXh0U3ltYm9sID09IG9wcG9uZW50U3ltYm9sKHRoaXMuc3ltYm9sKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXh0U3ltYm9sID09PSBHYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFJvdyA9ICgwLCB1dGlsc18xLmNsb25lKShjdXJyZW50Um93KTtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Um93ID0gbmV3IFN5bWJvbENvbGxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1cnJlbnRSb3cgPSBuZXcgU3ltYm9sQ29sbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRSb3cubGVuZ3RoKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFN5bWJvbCA9PT0gb3Bwb25lbnRTeW1ib2wodGhpcy5zeW1ib2wpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RSb3cgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRTeW1ib2wgPT09IEdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0Um93ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRSb3cuYWRkU3ltYm9sKG5leHRDZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJlbnRSb3cuYWRkU3ltYm9sKG5leHRDZWxsKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5nZXRUd29JblJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHdvSW5Sb3c7XG4gICAgfTtcbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLmdldENsb3NlZFRocmVlSW5Sb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb3NlZFRocmVlSW5Sb3c7XG4gICAgfTtcbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLmdldE9wZW5UaHJlZUluUm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuVGhyZWVJblJvdztcbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuZ2V0Q2xvc2VkRm91ckluUm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9zZWRGb3VySW5Sb3c7XG4gICAgfTtcbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLmdldEZpdmVJblJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZml2ZUluUm93O1xuICAgIH07XG4gICAgcmV0dXJuIEdhbWVNb2RlbDtcbn0oKSk7XG5leHBvcnRzLkdhbWVNb2RlbCA9IEdhbWVNb2RlbDtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuSVNfREVCVUdfRU5BQkxFRCA9IGV4cG9ydHMuR1JJRF9TSVpFID0gdm9pZCAwO1xudmFyIGNvbnZlcnRfMSA9IHJlcXVpcmUoXCIuL2NvbnZlcnRcIik7XG52YXIgZ2FtZV9tb2RlbF8xID0gcmVxdWlyZShcIi4vZ2FtZS1tb2RlbFwiKTtcbnZhciB2ZWN0b3JfMSA9IHJlcXVpcmUoXCIuL3ZlY3RvclwiKTtcbnZhciBhaV8xID0gcmVxdWlyZShcIi4vYWlcIik7XG5leHBvcnRzLkdSSURfU0laRSA9IDE1O1xuZXhwb3J0cy5JU19ERUJVR19FTkFCTEVEID0gZmFsc2U7XG5jb25zb2xlLmxvZyhcIlN0YXJ0aW5nIHRoZSBhcHBsaWNhdGlvblwiKTtcbnZhciBnYW1lR3JpZCA9IG5ldyBnYW1lX21vZGVsXzEuR2FtZUdyaWQoKTtcbnZhciBwbGF5ZXJTeW1ib2wgPSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5YO1xudmFyIGFpU3ltYm9sID0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTztcbnZhciBwbGF5aW5nID0gdHJ1ZTtcbi8vIEhhbmRsaW5nIGNsaWNrXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiLmNlbGxcIikuYmluZChcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAgICB2YXIgY2xpY2tQb3NpdGlvbiA9ICgwLCBjb252ZXJ0XzEuaW5kZXhUb1ZlY3RvcikoZWxlbWVudC5pbmRleCgpKTtcbiAgICAgICAgLy8gV2UgY2Fubm90IHBsYWNlIHN5bWJvbCB0byBjZWxsIHdoaWNoIGFscmVhZHkgaGFzIGFub3RoZXIgb25lXG4gICAgICAgIGlmIChnYW1lR3JpZC5nZXRTeW1ib2xBdChjbGlja1Bvc2l0aW9uKSAhPT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGxheWluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXlTeW1ib2woY2xpY2tQb3NpdGlvbiwgcGxheWVyU3ltYm9sKTtcbiAgICAgICAgc2F2ZVN5bWJvbChjbGlja1Bvc2l0aW9uLCBwbGF5ZXJTeW1ib2wpO1xuICAgICAgICBpZiAoZ2FtZUdyaWQuZmluZEZpdmVJbkFSb3coKSA9PT0gcGxheWVyU3ltYm9sKSB7XG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbmdyYXRzISBZb3UgaGF2ZSB3b24gdGhlIGdhbWUhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGhhbmRsZUNsaWNrKGNsaWNrUG9zaXRpb24pO1xuICAgIH0pO1xufSk7XG4vLyBEaXNwbGF5IHN0dWZmXG5mdW5jdGlvbiBkaXNwbGF5U3ltYm9sKHBvc2l0aW9uLCBzeW1ib2wpIHtcbiAgICAkKFwiLmdhbWUtZ3JpZFwiKVxuICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAuZXEoKDAsIGNvbnZlcnRfMS52ZWN0b3JUb0luZGV4KShwb3NpdGlvbikpXG4gICAgICAgIC5hZGRDbGFzcyhzeW1ib2wpO1xufVxuZnVuY3Rpb24gZGlzcGxheVByaW9yaXR5KHBvc2l0aW9uLCBwcmlvcml0eSkge1xuICAgICQoXCIuZ2FtZS1ncmlkXCIpXG4gICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgIC5lcSgoMCwgY29udmVydF8xLnZlY3RvclRvSW5kZXgpKHBvc2l0aW9uKSlcbiAgICAgICAgLnRleHQocHJpb3JpdHkudG9TdHJpbmcoKSk7XG59XG5mdW5jdGlvbiBzYXZlU3ltYm9sKHBvc2l0aW9uLCBzeW1ib2wpIHtcbiAgICBnYW1lR3JpZC5hZGRTeW1ib2wocG9zaXRpb24sIHN5bWJvbCk7XG59XG4vLyBHYW1lIHN0dWZmXG5mdW5jdGlvbiBoYW5kbGVDbGljayhjbGlja1Bvc2l0aW9uKSB7XG4gICAgdmFyIGFpUmVzdWx0ID0gKG5ldyBhaV8xLkFJdjIoZ2FtZUdyaWQpKS5wbGF5KGFpU3ltYm9sKTtcbiAgICBkaXNwbGF5U3ltYm9sKGFpUmVzdWx0LmZpbmFsUG9zLCBhaVN5bWJvbCk7XG4gICAgc2F2ZVN5bWJvbChhaVJlc3VsdC5maW5hbFBvcywgYWlTeW1ib2wpO1xuICAgIGlmIChleHBvcnRzLklTX0RFQlVHX0VOQUJMRUQpIHtcbiAgICAgICAgdmFyIHZlYyA9IHZvaWQgMDtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGV4cG9ydHMuR1JJRF9TSVpFOyArK3gpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgZXhwb3J0cy5HUklEX1NJWkU7ICsreSkge1xuICAgICAgICAgICAgICAgIHZlYyA9IG5ldyB2ZWN0b3JfMS5WZWN0b3IyKHgsIHkpO1xuICAgICAgICAgICAgICAgIGlmIChnYW1lR3JpZC5nZXRTeW1ib2xBdCh2ZWMpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FIHx8IHZlYy5lcXVhbHMoYWlSZXN1bHQuZmluYWxQb3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlQcmlvcml0eSh2ZWMsIGFpUmVzdWx0LnByaW9yaXRpZXNbaSsrXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5UHJpb3JpdHkodmVjLCAtMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChnYW1lR3JpZC5maW5kRml2ZUluQVJvdygpID09PSBhaVN5bWJvbCkge1xuICAgICAgICBwbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiWW91IGxvc2VcIik7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5jbG9uZU9iamVjdEFycmF5ID0gZXhwb3J0cy5jbG9uZSA9IHZvaWQgMDtcbmZ1bmN0aW9uIGNsb25lKG9iaikge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikpLCBvYmopO1xufVxuZXhwb3J0cy5jbG9uZSA9IGNsb25lO1xuZnVuY3Rpb24gY2xvbmVPYmplY3RBcnJheShhcnIpIHtcbiAgICB2YXIgY2xvbmVBcnIgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSkge1xuICAgICAgICBjbG9uZUFycltpXSA9IGNsb25lKGFycltpXSk7XG4gICAgfVxuICAgIHJldHVybiBjbG9uZUFycjtcbn1cbmV4cG9ydHMuY2xvbmVPYmplY3RBcnJheSA9IGNsb25lT2JqZWN0QXJyYXk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLlZlY3RvcjIgPSB2b2lkIDA7XG52YXIgbWFpbl8xID0gcmVxdWlyZShcIi4vbWFpblwiKTtcbnZhciBWZWN0b3IyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFZlY3RvcjIoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBWZWN0b3IyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICsgeCwgdGhpcy55ICsgeSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5hZGRWZWN0b3IgPSBmdW5jdGlvbiAodmVjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZCh2ZWMueCwgdmVjLnkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoLXgsIC15KTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLnN1YnRyYWN0VmVjdG9yID0gZnVuY3Rpb24gKHZlYykge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoLXZlYy54LCAtdmVjLnkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICogaSwgdGhpcy55ICogaSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5kaXZpZGUgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseSgxIC8gaSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAodmVjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IHZlYy54ICYmIHRoaXMueSA9PT0gdmVjLnk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5pc0VkZ2VDZWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54ID09PSAwIHx8IHRoaXMueSA9PT0gMCB8fCB0aGlzLnggKyAxID09PSBtYWluXzEuR1JJRF9TSVpFIHx8IHRoaXMueSArIDEgPT09IG1haW5fMS5HUklEX1NJWkU7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5pc091dE9mQm91bmRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54IDwgMCB8fCB0aGlzLnggPj0gbWFpbl8xLkdSSURfU0laRSB8fCB0aGlzLnkgPCAwIHx8IHRoaXMueSA+PSBtYWluXzEuR1JJRF9TSVpFO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZ2V0WCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmdldFkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnk7XG4gICAgfTtcbiAgICByZXR1cm4gVmVjdG9yMjtcbn0oKSk7XG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=