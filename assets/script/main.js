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
exports.AIv3 = exports.AIResult = void 0;
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
    AIv1.prototype.getSymbolInDirection = function (row, index, multiplier) {
        if (index === void 0) { index = 0; }
        if (multiplier === void 0) { multiplier = -1; }
        if (row.row[index] === undefined) {
            return undefined;
        }
        var pos = row.row[index].addVector(row.direction.multiply(multiplier));
        if (pos.isOutOfBounds()) {
            return undefined;
        }
        return this.grid.getSymbolAt(pos);
    };
    AIv1.prototype.findSymbolIndexInDirection = function (row, cells, index, multiplier) {
        if (index === void 0) { index = 0; }
        if (multiplier === void 0) { multiplier = -1; }
        if (row.row[index] === undefined) {
            return undefined;
        }
        var pos = row.row[index].addVector(row.direction.multiply(multiplier));
        if (pos.isOutOfBounds()) {
            return undefined;
        }
        return findIndex(pos, cells);
    };
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
            if (priorities[i] === maxPriority && Math.random() > 0.7) {
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
            priorities[this.findSymbolIndexInDirection(row, cells)] += AIv2.OPEN_TWO_ROW_PRIORITY;
            priorities[this.findSymbolIndexInDirection(row, cells, 1, 1)] += AIv2.OPEN_TWO_ROW_PRIORITY;
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
            priorities[this.findSymbolIndexInDirection(row, cells)] += AIv2.OPEN_THREE_ROW_PRIORITY;
            priorities[this.findSymbolIndexInDirection(row, cells, 2, 1)] += AIv2.OPEN_THREE_ROW_PRIORITY;
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
            priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv2.CLOSED_THREE_ROW_PRIORITY;
            priorities[findIndex(row.row[2].addVector(row.direction), cells)] += AIv2.CLOSED_THREE_ROW_PRIORITY;
        }
        // Prioritize 4 in row
        var fourInRow = gameModel.getClosedFourInRow();
        for (var _c = 0, fourInRow_1 = fourInRow; _c < fourInRow_1.length; _c++) {
            var row = fourInRow_1[_c];
            if (this.getSymbolInDirection(row) === game_model_1.GameSymbol.NONE) {
                priorities[this.findSymbolIndexInDirection(row, cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
            if (this.getSymbolInDirection(row, 3, 1) === game_model_1.GameSymbol.NONE) {
                priorities[this.findSymbolIndexInDirection(row, cells, 3, 1)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
        }
        // 2 + 2
        var twoInRow = gameModel.getTwoInRow().concat(gameModel.getClosedTwoInRow());
        for (var _d = 0, twoInRow_1 = twoInRow; _d < twoInRow_1.length; _d++) {
            var row = twoInRow_1[_d];
            if (this.getSymbolInDirection(row) === game_model_1.GameSymbol.NONE &&
                this.getSymbolInDirection(row, 0, -2) === (0, game_model_1.opponentSymbol)(symbol) &&
                this.getSymbolInDirection(row, 0, -3) === (0, game_model_1.opponentSymbol)(symbol)) {
                priorities[this.findSymbolIndexInDirection(row, cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
            if (this.getSymbolInDirection(row, 1, 1) === game_model_1.GameSymbol.NONE &&
                this.getSymbolInDirection(row, 1, 2) === (0, game_model_1.opponentSymbol)(symbol) &&
                this.getSymbolInDirection(row, 1, 3) === (0, game_model_1.opponentSymbol)(symbol)) {
                priorities[this.findSymbolIndexInDirection(row, cells, 1, 1)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
            }
        }
        return priorities;
    };
    AIv2.OPEN_TWO_ROW_PRIORITY = AIv2.SYMBOL_PRIORITY * 9 + 1;
    AIv2.CLOSED_THREE_ROW_PRIORITY = AIv2.OPEN_TWO_ROW_PRIORITY;
    AIv2.OPEN_THREE_ROW_PRIORITY = AIv2.OPEN_TWO_ROW_PRIORITY * 9 + 1;
    AIv2.HALF_OPEN_FOUR_ROW_PRIORITY = AIv2.OPEN_THREE_ROW_PRIORITY * 9 + 1;
    return AIv2;
}(AIv1));
/**
 * Simple attacks
 */
var AIv3 = /** @class */ (function (_super) {
    __extends(AIv3, _super);
    function AIv3() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AIv3.prototype.prioritizeCells = function (cells, priorities, symbol) {
        priorities = _super.prototype.prioritizeCells.call(this, cells, priorities, symbol);
        var gameModel = new game_model_1.GameModel(this.getGrid(), symbol);
        // Finishing four in row
        var fourInRow = gameModel.getOpenFourInRow();
        for (var _i = 0, fourInRow_2 = fourInRow; _i < fourInRow_2.length; _i++) {
            var row = fourInRow_2[_i];
            if (this.getSymbolInDirection(row) === game_model_1.GameSymbol.NONE) {
                priorities[this.findSymbolIndexInDirection(row, cells)] += AIv3.WIN_PRIORITY;
            }
            if (this.getSymbolInDirection(row, 3, 1) === game_model_1.GameSymbol.NONE) {
                priorities[this.findSymbolIndexInDirection(row, cells, 3, 1)] += AIv3.WIN_PRIORITY;
            }
        }
        var closedFourInRow = gameModel.getClosedFourInRow();
        for (var _a = 0, closedFourInRow_1 = closedFourInRow; _a < closedFourInRow_1.length; _a++) {
            var row = closedFourInRow_1[_a];
            if (this.getSymbolInDirection(row) === game_model_1.GameSymbol.NONE) {
                priorities[this.findSymbolIndexInDirection(row, cells)] += AIv3.WIN_PRIORITY;
            }
            if (this.getSymbolInDirection(row, 3, 1) === game_model_1.GameSymbol.NONE) {
                priorities[this.findSymbolIndexInDirection(row, cells, 3, 1)] += AIv3.WIN_PRIORITY;
            }
        }
        // Promoting open three
        var threeInRow = gameModel.getOpenThreeInRow();
        for (var _b = 0, threeInRow_2 = threeInRow; _b < threeInRow_2.length; _b++) {
            var row = threeInRow_2[_b];
            if (this.getSymbolInDirection(row) === game_model_1.GameSymbol.NONE) {
                priorities[this.findSymbolIndexInDirection(row, cells)] += AIv3.THREE_PROMOTE_PRIORITY;
            }
            if (this.getSymbolInDirection(row, 2, 1) === game_model_1.GameSymbol.NONE) {
                priorities[this.findSymbolIndexInDirection(row, cells, 2, 1)] += AIv3.THREE_PROMOTE_PRIORITY;
            }
        }
        return priorities;
    };
    AIv3.WIN_PRIORITY = 99999999;
    AIv3.THREE_PROMOTE_PRIORITY = AIv3.OPEN_THREE_ROW_PRIORITY * 3;
    return AIv3;
}(AIv2));
exports.AIv3 = AIv3;


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
        this.openTwoInRow = [];
        this.closedTwoInRow = [];
        // 3
        this.openThreeInRow = [];
        this.closedThreeInRow = [];
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
                    this.openTwoInRow.push(row);
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
        return this.openTwoInRow;
    };
    GameModel.prototype.getClosedTwoInRow = function () {
        return this.closedTwoInRow;
    };
    GameModel.prototype.getOpenThreeInRow = function () {
        return this.openThreeInRow;
    };
    GameModel.prototype.getClosedThreeInRow = function () {
        return this.closedThreeInRow;
    };
    GameModel.prototype.getOpenFourInRow = function () {
        return this.openFourInRow;
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
            document.getElementById("message").innerText = "Congrats! You have won the game! To play again, reload the page.";
            return;
        }
        handleClick(clickPosition);
    });
});
// Display stuff
function displaySymbol(position, symbol) {
    $("#game-grid")
        .children()
        .eq((0, convert_1.vectorToIndex)(position))
        .addClass(symbol);
}
function displayPriority(position, priority) {
    $("#game-grid")
        .children()
        .eq((0, convert_1.vectorToIndex)(position))
        .text(priority.toString());
}
function saveSymbol(position, symbol) {
    gameGrid.addSymbol(position, symbol);
}
// Game stuff
function handleClick(clickPosition) {
    var aiResult = (new ai_1.AIv3(gameGrid)).play(aiSymbol);
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
        document.getElementById("message").innerText = "You lose the game";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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bUJBQU8sQ0FBQyw2QkFBUTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZUFBZTs7Ozs7OztVQzVDZjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vR29tb2t1Ly4vc3JjL2FpLnRzIiwid2VicGFjazovL0dvbW9rdS8uL3NyYy9jb252ZXJ0LnRzIiwid2VicGFjazovL0dvbW9rdS8uL3NyYy9nYW1lLW1vZGVsLnRzIiwid2VicGFjazovL0dvbW9rdS8uL3NyYy9tYWluLnRzIiwid2VicGFjazovL0dvbW9rdS8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9Hb21va3UvLi9zcmMvdmVjdG9yLnRzIiwid2VicGFjazovL0dvbW9rdS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Hb21va3Uvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9Hb21va3Uvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0dvbW9rdS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuQUl2MyA9IGV4cG9ydHMuQUlSZXN1bHQgPSB2b2lkIDA7XG52YXIgZ2FtZV9tb2RlbF8xID0gcmVxdWlyZShcIi4vZ2FtZS1tb2RlbFwiKTtcbmZ1bmN0aW9uIGZpbmRJbmRleChwb3MsIGFycikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmIChhcnJbaV0uZXF1YWxzKHBvcykpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG52YXIgQUlSZXN1bHQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQUlSZXN1bHQocHJpb3JpdGllcywgZmluYWxQb3MpIHtcbiAgICAgICAgdGhpcy5wcmlvcml0aWVzID0gcHJpb3JpdGllcztcbiAgICAgICAgdGhpcy5maW5hbFBvcyA9IGZpbmFsUG9zO1xuICAgIH1cbiAgICByZXR1cm4gQUlSZXN1bHQ7XG59KCkpO1xuZXhwb3J0cy5BSVJlc3VsdCA9IEFJUmVzdWx0O1xuLyoqXG4gKiBUb3RhbGx5IGR1bWIuIFBsYWNlIHN5bWJvbHMgbmVhciB0aGUgb3Bwb25lbnRzIHN5bWJvbHMuXG4gKi9cbnZhciBBSXYxID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFJdjEoZ3JpZCkge1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkO1xuICAgIH1cbiAgICBBSXYxLnByb3RvdHlwZS5nZXRTeW1ib2xJbkRpcmVjdGlvbiA9IGZ1bmN0aW9uIChyb3csIGluZGV4LCBtdWx0aXBsaWVyKSB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gMDsgfVxuICAgICAgICBpZiAobXVsdGlwbGllciA9PT0gdm9pZCAwKSB7IG11bHRpcGxpZXIgPSAtMTsgfVxuICAgICAgICBpZiAocm93LnJvd1tpbmRleF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcG9zID0gcm93LnJvd1tpbmRleF0uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24ubXVsdGlwbHkobXVsdGlwbGllcikpO1xuICAgICAgICBpZiAocG9zLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLmdldFN5bWJvbEF0KHBvcyk7XG4gICAgfTtcbiAgICBBSXYxLnByb3RvdHlwZS5maW5kU3ltYm9sSW5kZXhJbkRpcmVjdGlvbiA9IGZ1bmN0aW9uIChyb3csIGNlbGxzLCBpbmRleCwgbXVsdGlwbGllcikge1xuICAgICAgICBpZiAoaW5kZXggPT09IHZvaWQgMCkgeyBpbmRleCA9IDA7IH1cbiAgICAgICAgaWYgKG11bHRpcGxpZXIgPT09IHZvaWQgMCkgeyBtdWx0aXBsaWVyID0gLTE7IH1cbiAgICAgICAgaWYgKHJvdy5yb3dbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBvcyA9IHJvdy5yb3dbaW5kZXhdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uLm11bHRpcGx5KG11bHRpcGxpZXIpKTtcbiAgICAgICAgaWYgKHBvcy5pc091dE9mQm91bmRzKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbmRJbmRleChwb3MsIGNlbGxzKTtcbiAgICB9O1xuICAgIEFJdjEucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbiAoc3ltYm9sKSB7XG4gICAgICAgIHZhciBlbXB0eUNlbGxzID0gdGhpcy5ncmlkLmdldEVtcHR5Q2VsbHMoKTtcbiAgICAgICAgdmFyIHByaW9yaXRpZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbXB0eUNlbGxzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBwcmlvcml0aWVzW2ldID0gMDtcbiAgICAgICAgfVxuICAgICAgICBwcmlvcml0aWVzID0gdGhpcy5wcmlvcml0aXplQ2VsbHMoZW1wdHlDZWxscywgcHJpb3JpdGllcywgc3ltYm9sKTtcbiAgICAgICAgdmFyIG1heFByaW9yaXR5ID0gLTE7XG4gICAgICAgIHZhciBmaW5hbFBvc2l0aW9uO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByaW9yaXRpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChwcmlvcml0aWVzW2ldID09PSBtYXhQcmlvcml0eSAmJiBNYXRoLnJhbmRvbSgpID4gMC43KSB7XG4gICAgICAgICAgICAgICAgZmluYWxQb3NpdGlvbiA9IGVtcHR5Q2VsbHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChwcmlvcml0aWVzW2ldID4gbWF4UHJpb3JpdHkpIHtcbiAgICAgICAgICAgICAgICBtYXhQcmlvcml0eSA9IHByaW9yaXRpZXNbaV07XG4gICAgICAgICAgICAgICAgZmluYWxQb3NpdGlvbiA9IGVtcHR5Q2VsbHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBBSVJlc3VsdChwcmlvcml0aWVzLCBmaW5hbFBvc2l0aW9uKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFByaW9ycyBjZWxscyBtYXRjaGluZyBzcGVjaWZpZWQgb25lcyBhcm91bmQgc3BlY2lmaWVkIEdhbWVTeW1ib2xcbiAgICAgKi9cbiAgICBBSXYxLnByb3RvdHlwZS5wcmlvcml0aXplQ2VsbHMgPSBmdW5jdGlvbiAoY2VsbHMsIHByaW9yaXRpZXMsIHN5bWJvbCkge1xuICAgICAgICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgdmFyIG9wcG9uZW50c1N5bWJvbCA9IChzeW1ib2wgPT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLlggPyBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5PIDogZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuWCk7XG4gICAgICAgIHZhciBvcHBvbmVudHNDZWxscyA9IGdyaWQuZ2V0Q2VsbHNXaXRoU3ltYm9sKG9wcG9uZW50c1N5bWJvbCk7XG4gICAgICAgIG9wcG9uZW50c0NlbGxzLmZvckVhY2goZnVuY3Rpb24gKHBvcykge1xuICAgICAgICAgICAgZ3JpZC5nZXRDZWxsc0Fyb3VuZChwb3MsIDEpLmZvckVhY2goZnVuY3Rpb24gKHBvc0Fyb3VuZCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2VsbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc0Fyb3VuZC5lcXVhbHMoY2VsbHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ldKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcmlvcml0aWVzO1xuICAgIH07XG4gICAgQUl2MS5wcm90b3R5cGUuZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZDtcbiAgICB9O1xuICAgIEFJdjEuU1lNQk9MX1BSSU9SSVRZID0gMTtcbiAgICByZXR1cm4gQUl2MTtcbn0oKSk7XG4vKipcbiAqIElzIGFibGUgdG8gYmxvY2sgZXZlcnkgc2ltcGxlIGF0dGFja1xuICovXG52YXIgQUl2MiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQUl2MiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBSXYyKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIEFJdjIucHJvdG90eXBlLnByaW9yaXRpemVDZWxscyA9IGZ1bmN0aW9uIChjZWxscywgcHJpb3JpdGllcywgc3ltYm9sKSB7XG4gICAgICAgIHByaW9yaXRpZXMgPSBfc3VwZXIucHJvdG90eXBlLnByaW9yaXRpemVDZWxscy5jYWxsKHRoaXMsIGNlbGxzLCBwcmlvcml0aWVzLCBzeW1ib2wpO1xuICAgICAgICB2YXIgZ2FtZU1vZGVsID0gbmV3IGdhbWVfbW9kZWxfMS5HYW1lTW9kZWwodGhpcy5nZXRHcmlkKCksICgwLCBnYW1lX21vZGVsXzEub3Bwb25lbnRTeW1ib2wpKHN5bWJvbCkpO1xuICAgICAgICAvLyBQcmlvcml0aXplIDIgJiAyICsgMSBpbiByb3dcbiAgICAgICAgdmFyIHR3b1BsdXNPbmVJblJvdyA9IGdhbWVNb2RlbC5nZXRUd29JblJvdygpO1xuICAgICAgICB2YXIgY3VycmVudFBvcztcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCB0d29QbHVzT25lSW5Sb3dfMSA9IHR3b1BsdXNPbmVJblJvdzsgX2kgPCB0d29QbHVzT25lSW5Sb3dfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByb3cgPSB0d29QbHVzT25lSW5Sb3dfMVtfaV07XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRHcmlkKCkuZ2V0U3ltYm9sQXQoY3VycmVudFBvcyA9IHJvdy5yb3dbMF0uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbikpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FICYmXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRHcmlkKCkuZ2V0U3ltYm9sQXQocm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uLm11bHRpcGx5KDIpKSkgPT09ICgwLCBnYW1lX21vZGVsXzEub3Bwb25lbnRTeW1ib2wpKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChjdXJyZW50UG9zLCBjZWxscyldICs9IEFJdjIuT1BFTl9USFJFRV9ST1dfUFJJT1JJVFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRHcmlkKCkuZ2V0U3ltYm9sQXQoY3VycmVudFBvcyA9IHJvdy5yb3dbMV0uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pKSA9PT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KHJvdy5yb3dbMV0uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24ubXVsdGlwbHkoMikpKSA9PT0gKDAsIGdhbWVfbW9kZWxfMS5vcHBvbmVudFN5bWJvbCkoc3ltYm9sKSkge1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KGN1cnJlbnRQb3MsIGNlbGxzKV0gKz0gQUl2Mi5PUEVOX1RIUkVFX1JPV19QUklPUklUWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByaW9yaXRpZXNbdGhpcy5maW5kU3ltYm9sSW5kZXhJbkRpcmVjdGlvbihyb3csIGNlbGxzKV0gKz0gQUl2Mi5PUEVOX1RXT19ST1dfUFJJT1JJVFk7XG4gICAgICAgICAgICBwcmlvcml0aWVzW3RoaXMuZmluZFN5bWJvbEluZGV4SW5EaXJlY3Rpb24ocm93LCBjZWxscywgMSwgMSldICs9IEFJdjIuT1BFTl9UV09fUk9XX1BSSU9SSVRZO1xuICAgICAgICB9XG4gICAgICAgIC8vIFByaW9yaXRpemUgb3BlbiAzICYgMyArIDEgaW4gcm93XG4gICAgICAgIHZhciB0aHJlZUluUm93ID0gZ2FtZU1vZGVsLmdldE9wZW5UaHJlZUluUm93KCk7XG4gICAgICAgIGZvciAodmFyIF9hID0gMCwgdGhyZWVJblJvd18xID0gdGhyZWVJblJvdzsgX2EgPCB0aHJlZUluUm93XzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gdGhyZWVJblJvd18xW19hXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChjdXJyZW50UG9zID0gcm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKSkgPT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzBdLnN1YnRyYWN0VmVjdG9yKHJvdy5kaXJlY3Rpb24ubXVsdGlwbHkoMikpKSA9PT0gKDAsIGdhbWVfbW9kZWxfMS5vcHBvbmVudFN5bWJvbCkoc3ltYm9sKSkge1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KGN1cnJlbnRQb3MsIGNlbGxzKV0gKz0gQUl2Mi5IQUxGX09QRU5fRk9VUl9ST1dfUFJJT1JJVFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRHcmlkKCkuZ2V0U3ltYm9sQXQoY3VycmVudFBvcyA9IHJvdy5yb3dbMl0uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pKSA9PT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KHJvdy5yb3dbMl0uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24ubXVsdGlwbHkoMikpKSA9PT0gKDAsIGdhbWVfbW9kZWxfMS5vcHBvbmVudFN5bWJvbCkoc3ltYm9sKSkge1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KGN1cnJlbnRQb3MsIGNlbGxzKV0gKz0gQUl2Mi5IQUxGX09QRU5fRk9VUl9ST1dfUFJJT1JJVFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmlvcml0aWVzW3RoaXMuZmluZFN5bWJvbEluZGV4SW5EaXJlY3Rpb24ocm93LCBjZWxscyldICs9IEFJdjIuT1BFTl9USFJFRV9ST1dfUFJJT1JJVFk7XG4gICAgICAgICAgICBwcmlvcml0aWVzW3RoaXMuZmluZFN5bWJvbEluZGV4SW5EaXJlY3Rpb24ocm93LCBjZWxscywgMiwgMSldICs9IEFJdjIuT1BFTl9USFJFRV9ST1dfUFJJT1JJVFk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJpb3JpdGl6ZSBjbG9zZWQgMyArIDFcbiAgICAgICAgdmFyIGNsb3NlZFRocmVlSW5Sb3cgPSBnYW1lTW9kZWwuZ2V0Q2xvc2VkVGhyZWVJblJvdygpO1xuICAgICAgICBmb3IgKHZhciBfYiA9IDAsIGNsb3NlZFRocmVlSW5Sb3dfMSA9IGNsb3NlZFRocmVlSW5Sb3c7IF9iIDwgY2xvc2VkVGhyZWVJblJvd18xLmxlbmd0aDsgX2IrKykge1xuICAgICAgICAgICAgdmFyIHJvdyA9IGNsb3NlZFRocmVlSW5Sb3dfMVtfYl07XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRHcmlkKCkuZ2V0U3ltYm9sQXQoY3VycmVudFBvcyA9IHJvdy5yb3dbMF0uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbikpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FICYmXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRHcmlkKCkuZ2V0U3ltYm9sQXQocm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uLm11bHRpcGx5KDIpKSkgPT09ICgwLCBnYW1lX21vZGVsXzEub3Bwb25lbnRTeW1ib2wpKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChjdXJyZW50UG9zLCBjZWxscyldICs9IEFJdjIuSEFMRl9PUEVOX0ZPVVJfUk9XX1BSSU9SSVRZO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0R3JpZCgpLmdldFN5bWJvbEF0KGN1cnJlbnRQb3MgPSByb3cucm93WzJdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSkgPT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzJdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uLm11bHRpcGx5KDIpKSkgPT09ICgwLCBnYW1lX21vZGVsXzEub3Bwb25lbnRTeW1ib2wpKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChjdXJyZW50UG9zLCBjZWxscyldICs9IEFJdjIuSEFMRl9PUEVOX0ZPVVJfUk9XX1BSSU9SSVRZO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKSwgY2VsbHMpXSArPSBBSXYyLkNMT1NFRF9USFJFRV9ST1dfUFJJT1JJVFk7XG4gICAgICAgICAgICBwcmlvcml0aWVzW2ZpbmRJbmRleChyb3cucm93WzJdLmFkZFZlY3Rvcihyb3cuZGlyZWN0aW9uKSwgY2VsbHMpXSArPSBBSXYyLkNMT1NFRF9USFJFRV9ST1dfUFJJT1JJVFk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJpb3JpdGl6ZSA0IGluIHJvd1xuICAgICAgICB2YXIgZm91ckluUm93ID0gZ2FtZU1vZGVsLmdldENsb3NlZEZvdXJJblJvdygpO1xuICAgICAgICBmb3IgKHZhciBfYyA9IDAsIGZvdXJJblJvd18xID0gZm91ckluUm93OyBfYyA8IGZvdXJJblJvd18xLmxlbmd0aDsgX2MrKykge1xuICAgICAgICAgICAgdmFyIHJvdyA9IGZvdXJJblJvd18xW19jXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldFN5bWJvbEluRGlyZWN0aW9uKHJvdykgPT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW3RoaXMuZmluZFN5bWJvbEluZGV4SW5EaXJlY3Rpb24ocm93LCBjZWxscyldICs9IEFJdjIuSEFMRl9PUEVOX0ZPVVJfUk9XX1BSSU9SSVRZO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U3ltYm9sSW5EaXJlY3Rpb24ocm93LCAzLCAxKSA9PT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbdGhpcy5maW5kU3ltYm9sSW5kZXhJbkRpcmVjdGlvbihyb3csIGNlbGxzLCAzLCAxKV0gKz0gQUl2Mi5IQUxGX09QRU5fRk9VUl9ST1dfUFJJT1JJVFk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gMiArIDJcbiAgICAgICAgdmFyIHR3b0luUm93ID0gZ2FtZU1vZGVsLmdldFR3b0luUm93KCkuY29uY2F0KGdhbWVNb2RlbC5nZXRDbG9zZWRUd29JblJvdygpKTtcbiAgICAgICAgZm9yICh2YXIgX2QgPSAwLCB0d29JblJvd18xID0gdHdvSW5Sb3c7IF9kIDwgdHdvSW5Sb3dfMS5sZW5ndGg7IF9kKyspIHtcbiAgICAgICAgICAgIHZhciByb3cgPSB0d29JblJvd18xW19kXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldFN5bWJvbEluRGlyZWN0aW9uKHJvdykgPT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmdldFN5bWJvbEluRGlyZWN0aW9uKHJvdywgMCwgLTIpID09PSAoMCwgZ2FtZV9tb2RlbF8xLm9wcG9uZW50U3ltYm9sKShzeW1ib2wpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTeW1ib2xJbkRpcmVjdGlvbihyb3csIDAsIC0zKSA9PT0gKDAsIGdhbWVfbW9kZWxfMS5vcHBvbmVudFN5bWJvbCkoc3ltYm9sKSkge1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbdGhpcy5maW5kU3ltYm9sSW5kZXhJbkRpcmVjdGlvbihyb3csIGNlbGxzKV0gKz0gQUl2Mi5IQUxGX09QRU5fRk9VUl9ST1dfUFJJT1JJVFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTeW1ib2xJbkRpcmVjdGlvbihyb3csIDEsIDEpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FICYmXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTeW1ib2xJbkRpcmVjdGlvbihyb3csIDEsIDIpID09PSAoMCwgZ2FtZV9tb2RlbF8xLm9wcG9uZW50U3ltYm9sKShzeW1ib2wpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTeW1ib2xJbkRpcmVjdGlvbihyb3csIDEsIDMpID09PSAoMCwgZ2FtZV9tb2RlbF8xLm9wcG9uZW50U3ltYm9sKShzeW1ib2wpKSB7XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1t0aGlzLmZpbmRTeW1ib2xJbmRleEluRGlyZWN0aW9uKHJvdywgY2VsbHMsIDEsIDEpXSArPSBBSXYyLkhBTEZfT1BFTl9GT1VSX1JPV19QUklPUklUWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJpb3JpdGllcztcbiAgICB9O1xuICAgIEFJdjIuT1BFTl9UV09fUk9XX1BSSU9SSVRZID0gQUl2Mi5TWU1CT0xfUFJJT1JJVFkgKiA5ICsgMTtcbiAgICBBSXYyLkNMT1NFRF9USFJFRV9ST1dfUFJJT1JJVFkgPSBBSXYyLk9QRU5fVFdPX1JPV19QUklPUklUWTtcbiAgICBBSXYyLk9QRU5fVEhSRUVfUk9XX1BSSU9SSVRZID0gQUl2Mi5PUEVOX1RXT19ST1dfUFJJT1JJVFkgKiA5ICsgMTtcbiAgICBBSXYyLkhBTEZfT1BFTl9GT1VSX1JPV19QUklPUklUWSA9IEFJdjIuT1BFTl9USFJFRV9ST1dfUFJJT1JJVFkgKiA5ICsgMTtcbiAgICByZXR1cm4gQUl2Mjtcbn0oQUl2MSkpO1xuLyoqXG4gKiBTaW1wbGUgYXR0YWNrc1xuICovXG52YXIgQUl2MyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQUl2MywgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBSXYzKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIEFJdjMucHJvdG90eXBlLnByaW9yaXRpemVDZWxscyA9IGZ1bmN0aW9uIChjZWxscywgcHJpb3JpdGllcywgc3ltYm9sKSB7XG4gICAgICAgIHByaW9yaXRpZXMgPSBfc3VwZXIucHJvdG90eXBlLnByaW9yaXRpemVDZWxscy5jYWxsKHRoaXMsIGNlbGxzLCBwcmlvcml0aWVzLCBzeW1ib2wpO1xuICAgICAgICB2YXIgZ2FtZU1vZGVsID0gbmV3IGdhbWVfbW9kZWxfMS5HYW1lTW9kZWwodGhpcy5nZXRHcmlkKCksIHN5bWJvbCk7XG4gICAgICAgIC8vIEZpbmlzaGluZyBmb3VyIGluIHJvd1xuICAgICAgICB2YXIgZm91ckluUm93ID0gZ2FtZU1vZGVsLmdldE9wZW5Gb3VySW5Sb3coKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBmb3VySW5Sb3dfMiA9IGZvdXJJblJvdzsgX2kgPCBmb3VySW5Sb3dfMi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByb3cgPSBmb3VySW5Sb3dfMltfaV07XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTeW1ib2xJbkRpcmVjdGlvbihyb3cpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1t0aGlzLmZpbmRTeW1ib2xJbmRleEluRGlyZWN0aW9uKHJvdywgY2VsbHMpXSArPSBBSXYzLldJTl9QUklPUklUWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmdldFN5bWJvbEluRGlyZWN0aW9uKHJvdywgMywgMSkgPT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0aWVzW3RoaXMuZmluZFN5bWJvbEluZGV4SW5EaXJlY3Rpb24ocm93LCBjZWxscywgMywgMSldICs9IEFJdjMuV0lOX1BSSU9SSVRZO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBjbG9zZWRGb3VySW5Sb3cgPSBnYW1lTW9kZWwuZ2V0Q2xvc2VkRm91ckluUm93KCk7XG4gICAgICAgIGZvciAodmFyIF9hID0gMCwgY2xvc2VkRm91ckluUm93XzEgPSBjbG9zZWRGb3VySW5Sb3c7IF9hIDwgY2xvc2VkRm91ckluUm93XzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gY2xvc2VkRm91ckluUm93XzFbX2FdO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U3ltYm9sSW5EaXJlY3Rpb24ocm93KSA9PT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbdGhpcy5maW5kU3ltYm9sSW5kZXhJbkRpcmVjdGlvbihyb3csIGNlbGxzKV0gKz0gQUl2My5XSU5fUFJJT1JJVFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTeW1ib2xJbkRpcmVjdGlvbihyb3csIDMsIDEpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1t0aGlzLmZpbmRTeW1ib2xJbmRleEluRGlyZWN0aW9uKHJvdywgY2VsbHMsIDMsIDEpXSArPSBBSXYzLldJTl9QUklPUklUWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBQcm9tb3Rpbmcgb3BlbiB0aHJlZVxuICAgICAgICB2YXIgdGhyZWVJblJvdyA9IGdhbWVNb2RlbC5nZXRPcGVuVGhyZWVJblJvdygpO1xuICAgICAgICBmb3IgKHZhciBfYiA9IDAsIHRocmVlSW5Sb3dfMiA9IHRocmVlSW5Sb3c7IF9iIDwgdGhyZWVJblJvd18yLmxlbmd0aDsgX2IrKykge1xuICAgICAgICAgICAgdmFyIHJvdyA9IHRocmVlSW5Sb3dfMltfYl07XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTeW1ib2xJbkRpcmVjdGlvbihyb3cpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1t0aGlzLmZpbmRTeW1ib2xJbmRleEluRGlyZWN0aW9uKHJvdywgY2VsbHMpXSArPSBBSXYzLlRIUkVFX1BST01PVEVfUFJJT1JJVFk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTeW1ib2xJbkRpcmVjdGlvbihyb3csIDIsIDEpID09PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1t0aGlzLmZpbmRTeW1ib2xJbmRleEluRGlyZWN0aW9uKHJvdywgY2VsbHMsIDIsIDEpXSArPSBBSXYzLlRIUkVFX1BST01PVEVfUFJJT1JJVFk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByaW9yaXRpZXM7XG4gICAgfTtcbiAgICBBSXYzLldJTl9QUklPUklUWSA9IDk5OTk5OTk5O1xuICAgIEFJdjMuVEhSRUVfUFJPTU9URV9QUklPUklUWSA9IEFJdjMuT1BFTl9USFJFRV9ST1dfUFJJT1JJVFkgKiAzO1xuICAgIHJldHVybiBBSXYzO1xufShBSXYyKSk7XG5leHBvcnRzLkFJdjMgPSBBSXYzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5pbmRleFRvVmVjdG9yID0gZXhwb3J0cy52ZWN0b3JUb0luZGV4ID0gZXhwb3J0cy5jb29yZHNUb0luZGV4ID0gdm9pZCAwO1xudmFyIGdvbW9rdSA9IHJlcXVpcmUoXCIuL21haW5cIik7XG52YXIgdmVjdG9yXzEgPSByZXF1aXJlKFwiLi92ZWN0b3JcIik7XG5mdW5jdGlvbiBjb29yZHNUb0luZGV4KHgsIHkpIHtcbiAgICByZXR1cm4geSAqIGdvbW9rdS5HUklEX1NJWkUgKyB4O1xufVxuZXhwb3J0cy5jb29yZHNUb0luZGV4ID0gY29vcmRzVG9JbmRleDtcbmZ1bmN0aW9uIGdldEluZGV4WChpbmRleCkge1xuICAgIHJldHVybiBpbmRleCAlIGdvbW9rdS5HUklEX1NJWkU7XG59XG5mdW5jdGlvbiBnZXRJbmRleFkoaW5kZXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihpbmRleCAvIGdvbW9rdS5HUklEX1NJWkUpO1xufVxuZnVuY3Rpb24gdmVjdG9yVG9JbmRleCh2ZWMpIHtcbiAgICByZXR1cm4gY29vcmRzVG9JbmRleCh2ZWMuZ2V0WCgpLCB2ZWMuZ2V0WSgpKTtcbn1cbmV4cG9ydHMudmVjdG9yVG9JbmRleCA9IHZlY3RvclRvSW5kZXg7XG5mdW5jdGlvbiBpbmRleFRvVmVjdG9yKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKGdldEluZGV4WChpbmRleCksIGdldEluZGV4WShpbmRleCkpO1xufVxuZXhwb3J0cy5pbmRleFRvVmVjdG9yID0gaW5kZXhUb1ZlY3RvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuR2FtZU1vZGVsID0gZXhwb3J0cy5TeW1ib2xSb3cgPSBleHBvcnRzLkdhbWVHcmlkID0gZXhwb3J0cy5vcHBvbmVudFN5bWJvbCA9IGV4cG9ydHMuR2FtZVN5bWJvbCA9IGV4cG9ydHMuRElSRUNUSU9OUyA9IHZvaWQgMDtcbnZhciB2ZWN0b3JfMSA9IHJlcXVpcmUoXCIuL3ZlY3RvclwiKTtcbnZhciBtYWluXzEgPSByZXF1aXJlKFwiLi9tYWluXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmV4cG9ydHMuRElSRUNUSU9OUyA9IFtcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAxKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCAxKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAwKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAtMSlcbl07XG52YXIgR2FtZVN5bWJvbDtcbihmdW5jdGlvbiAoR2FtZVN5bWJvbCkge1xuICAgIEdhbWVTeW1ib2xbXCJYXCJdID0gXCJ4XCI7XG4gICAgR2FtZVN5bWJvbFtcIk9cIl0gPSBcIm9cIjtcbiAgICBHYW1lU3ltYm9sW1wiTk9ORVwiXSA9IFwiXCI7XG59KShHYW1lU3ltYm9sID0gZXhwb3J0cy5HYW1lU3ltYm9sIHx8IChleHBvcnRzLkdhbWVTeW1ib2wgPSB7fSkpO1xuZnVuY3Rpb24gb3Bwb25lbnRTeW1ib2woc3ltYm9sKSB7XG4gICAgcmV0dXJuIHN5bWJvbCA9PT0gR2FtZVN5bWJvbC5YID8gR2FtZVN5bWJvbC5PIDogR2FtZVN5bWJvbC5YO1xufVxuZXhwb3J0cy5vcHBvbmVudFN5bWJvbCA9IG9wcG9uZW50U3ltYm9sO1xudmFyIEdhbWVHcmlkID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEdhbWVHcmlkKCkge1xuICAgICAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBtYWluXzEuR1JJRF9TSVpFOyArK3gpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFt4XSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBtYWluXzEuR1JJRF9TSVpFOyArK3kpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRbeF1beV0gPSBHYW1lU3ltYm9sLk5PTkU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldENlbGxzV2l0aFN5bWJvbCA9IGZ1bmN0aW9uIChzeW1ib2wpIHtcbiAgICAgICAgdmFyIGNlbGxzID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbWFpbl8xLkdSSURfU0laRTsgKyt4KSB7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG1haW5fMS5HUklEX1NJWkU7ICsreSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyaWRbeF1beV0gPT0gc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLnB1c2gobmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgeSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbHM7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZ2V0RW1wdHlDZWxscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2VsbHNXaXRoU3ltYm9sKEdhbWVTeW1ib2wuTk9ORSk7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZ2V0Q2VsbHNBcm91bmQgPSBmdW5jdGlvbiAocG9zLCBpLCBnYW1lU3ltYm9sKSB7XG4gICAgICAgIGlmIChpID09PSB2b2lkIDApIHsgaSA9IDE7IH1cbiAgICAgICAgaWYgKGdhbWVTeW1ib2wgPT09IHZvaWQgMCkgeyBnYW1lU3ltYm9sID0gbnVsbDsgfVxuICAgICAgICB2YXIgbWluWCA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRYKCkgLSBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBtYXhYID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLmdldFgoKSArIGksIDApLCBtYWluXzEuR1JJRF9TSVpFKTtcbiAgICAgICAgdmFyIG1pblkgPSBNYXRoLm1pbihNYXRoLm1heChwb3MuZ2V0WSgpIC0gaSwgMCksIG1haW5fMS5HUklEX1NJWkUpO1xuICAgICAgICB2YXIgbWF4WSA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRZKCkgKyBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gbWluWDsgeCA8PSBtYXhYOyArK3gpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSBtaW5ZOyB5IDw9IG1heFk7ICsreSkge1xuICAgICAgICAgICAgICAgIGlmIChnYW1lU3ltYm9sID09PSBudWxsIHx8IHRoaXMuZ3JpZFt4XVt5XSA9PT0gZ2FtZVN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICBjZWxscy5wdXNoKG5ldyB2ZWN0b3JfMS5WZWN0b3IyKHgsIHkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNlbGxzO1xuICAgIH07XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmZpbmRGaXZlSW5BUm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZ2FtZU1vZGVsO1xuICAgICAgICBnYW1lTW9kZWwgPSBuZXcgR2FtZU1vZGVsKHRoaXMsIEdhbWVTeW1ib2wuWCk7XG4gICAgICAgIGlmIChnYW1lTW9kZWwuZ2V0Rml2ZUluUm93KCkubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gR2FtZVN5bWJvbC5YO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVNb2RlbCA9IG5ldyBHYW1lTW9kZWwodGhpcywgR2FtZVN5bWJvbC5PKTtcbiAgICAgICAgaWYgKGdhbWVNb2RlbC5nZXRGaXZlSW5Sb3coKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBHYW1lU3ltYm9sLk87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEdhbWVTeW1ib2wuTk9ORTtcbiAgICB9O1xuICAgIEdhbWVHcmlkLnByb3RvdHlwZS5hZGRTeW1ib2wgPSBmdW5jdGlvbiAocG9zLCBzeW1ib2wpIHtcbiAgICAgICAgdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldID0gc3ltYm9sO1xuICAgIH07XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldFN5bWJvbEF0ID0gZnVuY3Rpb24gKHBvcykge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldO1xuICAgIH07XG4gICAgcmV0dXJuIEdhbWVHcmlkO1xufSgpKTtcbmV4cG9ydHMuR2FtZUdyaWQgPSBHYW1lR3JpZDtcbnZhciBTeW1ib2xSb3cgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3ltYm9sUm93KHJvdywgZGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMucm93ID0gcm93O1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIFN5bWJvbFJvdztcbn0oKSk7XG5leHBvcnRzLlN5bWJvbFJvdyA9IFN5bWJvbFJvdztcbnZhciBTeW1ib2xDb2xsZWN0aW9uID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN5bWJvbENvbGxlY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3ltYm9scyA9IFtdO1xuICAgIH1cbiAgICBTeW1ib2xDb2xsZWN0aW9uLnByb3RvdHlwZS5hZGRTeW1ib2wgPSBmdW5jdGlvbiAoc3ltYm9sKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnN5bWJvbHM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWRkZWRTeW1ib2wgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAoYWRkZWRTeW1ib2wuZXF1YWxzKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zeW1ib2xzLnB1c2goc3ltYm9sKTtcbiAgICB9O1xuICAgIFN5bWJvbENvbGxlY3Rpb24ucHJvdG90eXBlLnRvU3ltYm9sUm93ID0gZnVuY3Rpb24gKGRpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IFN5bWJvbFJvdygoMCwgdXRpbHNfMS5jbG9uZU9iamVjdEFycmF5KSh0aGlzLnN5bWJvbHMpLCBkaXJlY3Rpb24pO1xuICAgIH07XG4gICAgU3ltYm9sQ29sbGVjdGlvbi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2xzLmxlbmd0aDtcbiAgICB9O1xuICAgIHJldHVybiBTeW1ib2xDb2xsZWN0aW9uO1xufSgpKTtcbnZhciBHYW1lTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZU1vZGVsKGdyaWQsIHN5bWJvbCkge1xuICAgICAgICAvLyAyXG4gICAgICAgIHRoaXMub3BlblR3b0luUm93ID0gW107XG4gICAgICAgIHRoaXMuY2xvc2VkVHdvSW5Sb3cgPSBbXTtcbiAgICAgICAgLy8gM1xuICAgICAgICB0aGlzLm9wZW5UaHJlZUluUm93ID0gW107XG4gICAgICAgIHRoaXMuY2xvc2VkVGhyZWVJblJvdyA9IFtdO1xuICAgICAgICAvLyA0XG4gICAgICAgIHRoaXMub3BlbkZvdXJJblJvdyA9IFtdO1xuICAgICAgICB0aGlzLmNsb3NlZEZvdXJJblJvdyA9IFtdO1xuICAgICAgICAvLyA1XG4gICAgICAgIHRoaXMuZml2ZUluUm93ID0gW107XG4gICAgICAgIHRoaXMuZ3JpZCA9IGdyaWQ7XG4gICAgICAgIHRoaXMuc3ltYm9sID0gc3ltYm9sO1xuICAgICAgICB0aGlzLmFuYWx5c2VHcmlkKCk7XG4gICAgfVxuICAgIEdhbWVNb2RlbC5jYW5TYXZlUm93ID0gZnVuY3Rpb24gKHJvd3MsIHJvdykge1xuICAgICAgICBmaXJzdExvb3A6IGZvciAodmFyIF9pID0gMCwgcm93c18xID0gcm93czsgX2kgPCByb3dzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHJvd3NfMVtfaV07XG4gICAgICAgICAgICBpZiAocm93LnJvdy5sZW5ndGggIT0gY3VycmVudC5yb3cubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnQucm93Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjdXJyZW50LnJvd1tpXS5lcXVhbHMocm93LnJvd1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgZmlyc3RMb29wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuYW5hbHlzZUdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFxcL1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG1haW5fMS5HUklEX1NJWkU7ICsreCkge1xuICAgICAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKHgsIDApLCBuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gLT5cbiAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBtYWluXzEuR1JJRF9TSVpFOyArK3kpIHtcbiAgICAgICAgICAgIHRoaXMuYW5hbHlzZVJvdyhuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCB5KSwgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgMCkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIF9cXHxcbiAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDAsIDApLCBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAxKSk7XG4gICAgICAgIGZvciAodmFyIGRpYWdvbmFsQSA9IDE7IGRpYWdvbmFsQSA8IG1haW5fMS5HUklEX1NJWkUgLSA0OyArK2RpYWdvbmFsQSkge1xuICAgICAgICAgICAgdGhpcy5hbmFseXNlUm93KG5ldyB2ZWN0b3JfMS5WZWN0b3IyKGRpYWdvbmFsQSwgMCksIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKDEsIDEpKTtcbiAgICAgICAgICAgIHRoaXMuYW5hbHlzZVJvdyhuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCBkaWFnb25hbEEpLCBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gy50vfFxuICAgICAgICB0aGlzLmFuYWx5c2VSb3cobmV3IHZlY3Rvcl8xLlZlY3RvcjIoMCwgbWFpbl8xLkdSSURfU0laRSAtIDEpLCBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAtMSkpO1xuICAgICAgICBmb3IgKHZhciBkaWFnb25hbEIgPSAxOyBkaWFnb25hbEIgPCBtYWluXzEuR1JJRF9TSVpFIC0gNDsgKytkaWFnb25hbEIpIHtcbiAgICAgICAgICAgIHRoaXMuYW5hbHlzZVJvdyhuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCAobWFpbl8xLkdSSURfU0laRSAtIDEpIC0gZGlhZ29uYWxCKSwgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgLTEpKTtcbiAgICAgICAgICAgIHRoaXMuYW5hbHlzZVJvdyhuZXcgdmVjdG9yXzEuVmVjdG9yMihkaWFnb25hbEIsIG1haW5fMS5HUklEX1NJWkUgLSAxKSwgbmV3IHZlY3Rvcl8xLlZlY3RvcjIoMSwgLTEpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5zYXZlUm93ID0gZnVuY3Rpb24gKHJvdywgY2xvc2VkKSB7XG4gICAgICAgIHN3aXRjaCAocm93LnJvdy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBpZiAoIWNsb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ud29JblJvdy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGlmIChjbG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZWRUaHJlZUluUm93LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlblRocmVlSW5Sb3cucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBpZiAoY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VkRm91ckluUm93LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkZvdXJJblJvdy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIHRoaXMuZml2ZUluUm93LnB1c2gocm93KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5hbmFseXNlUm93ID0gZnVuY3Rpb24gKHN0YXJ0LCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIGN1cnJlbnRSb3cgPSBuZXcgU3ltYm9sQ29sbGVjdGlvbigpO1xuICAgICAgICB2YXIgY2xvc2VkID0gdHJ1ZTsgLy8gQ2xvc2VkIGJlY2F1c2UgdGhlIGl0ZXJhdGlvbiBzdGFydHMgYXQgZW5kIG9mIHRoZSByb3dcbiAgICAgICAgdmFyIGxhc3RSb3cgPSBudWxsOyAvLyBMYXN0IHJvdyByZXByZXNlbnRzIGxhc3QgZm91bmQgcm93IHdoZW4gaXQncyBub3QgY2xvc2VkXG4gICAgICAgIHZhciBuZXh0Q2VsbDtcbiAgICAgICAgdmFyIG5leHRTeW1ib2w7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFpbl8xLkdSSURfU0laRTsgKytpKSB7XG4gICAgICAgICAgICBuZXh0Q2VsbCA9IHN0YXJ0LmFkZFZlY3RvcihkaXJlY3Rpb24ubXVsdGlwbHkoaSkpO1xuICAgICAgICAgICAgaWYgKG5leHRDZWxsLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dFN5bWJvbCA9IHRoaXMuZ3JpZC5nZXRTeW1ib2xBdChuZXh0Q2VsbCk7XG4gICAgICAgICAgICAvLyBTYXZpbmdcbiAgICAgICAgICAgIGlmIChuZXh0U3ltYm9sICE9PSB0aGlzLnN5bWJvbCAmJiBjdXJyZW50Um93Lmxlbmd0aCgpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjbG9zZWQgfHwgbmV4dFN5bWJvbCA9PT0gR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVJvdyhjdXJyZW50Um93LnRvU3ltYm9sUm93KGRpcmVjdGlvbiksIGNsb3NlZCB8fCBuZXh0U3ltYm9sID09IG9wcG9uZW50U3ltYm9sKHRoaXMuc3ltYm9sKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXh0U3ltYm9sID09PSBHYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFJvdyA9ICgwLCB1dGlsc18xLmNsb25lKShjdXJyZW50Um93KTtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Um93ID0gbmV3IFN5bWJvbENvbGxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1cnJlbnRSb3cgPSBuZXcgU3ltYm9sQ29sbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRSb3cubGVuZ3RoKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFN5bWJvbCA9PT0gb3Bwb25lbnRTeW1ib2wodGhpcy5zeW1ib2wpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RSb3cgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRTeW1ib2wgPT09IEdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0Um93ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRSb3cuYWRkU3ltYm9sKG5leHRDZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJlbnRSb3cuYWRkU3ltYm9sKG5leHRDZWxsKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5nZXRUd29JblJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlblR3b0luUm93O1xuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5nZXRDbG9zZWRUd29JblJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2VkVHdvSW5Sb3c7XG4gICAgfTtcbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLmdldE9wZW5UaHJlZUluUm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuVGhyZWVJblJvdztcbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuZ2V0Q2xvc2VkVGhyZWVJblJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2VkVGhyZWVJblJvdztcbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuZ2V0T3BlbkZvdXJJblJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbkZvdXJJblJvdztcbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuZ2V0Q2xvc2VkRm91ckluUm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9zZWRGb3VySW5Sb3c7XG4gICAgfTtcbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLmdldEZpdmVJblJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZml2ZUluUm93O1xuICAgIH07XG4gICAgcmV0dXJuIEdhbWVNb2RlbDtcbn0oKSk7XG5leHBvcnRzLkdhbWVNb2RlbCA9IEdhbWVNb2RlbDtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuSVNfREVCVUdfRU5BQkxFRCA9IGV4cG9ydHMuR1JJRF9TSVpFID0gdm9pZCAwO1xudmFyIGNvbnZlcnRfMSA9IHJlcXVpcmUoXCIuL2NvbnZlcnRcIik7XG52YXIgZ2FtZV9tb2RlbF8xID0gcmVxdWlyZShcIi4vZ2FtZS1tb2RlbFwiKTtcbnZhciB2ZWN0b3JfMSA9IHJlcXVpcmUoXCIuL3ZlY3RvclwiKTtcbnZhciBhaV8xID0gcmVxdWlyZShcIi4vYWlcIik7XG5leHBvcnRzLkdSSURfU0laRSA9IDE1O1xuZXhwb3J0cy5JU19ERUJVR19FTkFCTEVEID0gZmFsc2U7XG5jb25zb2xlLmxvZyhcIlN0YXJ0aW5nIHRoZSBhcHBsaWNhdGlvblwiKTtcbnZhciBnYW1lR3JpZCA9IG5ldyBnYW1lX21vZGVsXzEuR2FtZUdyaWQoKTtcbnZhciBwbGF5ZXJTeW1ib2wgPSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5YO1xudmFyIGFpU3ltYm9sID0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTztcbnZhciBwbGF5aW5nID0gdHJ1ZTtcbi8vIEhhbmRsaW5nIGNsaWNrXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiLmNlbGxcIikuYmluZChcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAgICB2YXIgY2xpY2tQb3NpdGlvbiA9ICgwLCBjb252ZXJ0XzEuaW5kZXhUb1ZlY3RvcikoZWxlbWVudC5pbmRleCgpKTtcbiAgICAgICAgLy8gV2UgY2Fubm90IHBsYWNlIHN5bWJvbCB0byBjZWxsIHdoaWNoIGFscmVhZHkgaGFzIGFub3RoZXIgb25lXG4gICAgICAgIGlmIChnYW1lR3JpZC5nZXRTeW1ib2xBdChjbGlja1Bvc2l0aW9uKSAhPT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGxheWluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXlTeW1ib2woY2xpY2tQb3NpdGlvbiwgcGxheWVyU3ltYm9sKTtcbiAgICAgICAgc2F2ZVN5bWJvbChjbGlja1Bvc2l0aW9uLCBwbGF5ZXJTeW1ib2wpO1xuICAgICAgICBpZiAoZ2FtZUdyaWQuZmluZEZpdmVJbkFSb3coKSA9PT0gcGxheWVyU3ltYm9sKSB7XG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lc3NhZ2VcIikuaW5uZXJUZXh0ID0gXCJDb25ncmF0cyEgWW91IGhhdmUgd29uIHRoZSBnYW1lISBUbyBwbGF5IGFnYWluLCByZWxvYWQgdGhlIHBhZ2UuXCI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlQ2xpY2soY2xpY2tQb3NpdGlvbik7XG4gICAgfSk7XG59KTtcbi8vIERpc3BsYXkgc3R1ZmZcbmZ1bmN0aW9uIGRpc3BsYXlTeW1ib2wocG9zaXRpb24sIHN5bWJvbCkge1xuICAgICQoXCIjZ2FtZS1ncmlkXCIpXG4gICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgIC5lcSgoMCwgY29udmVydF8xLnZlY3RvclRvSW5kZXgpKHBvc2l0aW9uKSlcbiAgICAgICAgLmFkZENsYXNzKHN5bWJvbCk7XG59XG5mdW5jdGlvbiBkaXNwbGF5UHJpb3JpdHkocG9zaXRpb24sIHByaW9yaXR5KSB7XG4gICAgJChcIiNnYW1lLWdyaWRcIilcbiAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgLmVxKCgwLCBjb252ZXJ0XzEudmVjdG9yVG9JbmRleCkocG9zaXRpb24pKVxuICAgICAgICAudGV4dChwcmlvcml0eS50b1N0cmluZygpKTtcbn1cbmZ1bmN0aW9uIHNhdmVTeW1ib2wocG9zaXRpb24sIHN5bWJvbCkge1xuICAgIGdhbWVHcmlkLmFkZFN5bWJvbChwb3NpdGlvbiwgc3ltYm9sKTtcbn1cbi8vIEdhbWUgc3R1ZmZcbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKGNsaWNrUG9zaXRpb24pIHtcbiAgICB2YXIgYWlSZXN1bHQgPSAobmV3IGFpXzEuQUl2MyhnYW1lR3JpZCkpLnBsYXkoYWlTeW1ib2wpO1xuICAgIGRpc3BsYXlTeW1ib2woYWlSZXN1bHQuZmluYWxQb3MsIGFpU3ltYm9sKTtcbiAgICBzYXZlU3ltYm9sKGFpUmVzdWx0LmZpbmFsUG9zLCBhaVN5bWJvbCk7XG4gICAgaWYgKGV4cG9ydHMuSVNfREVCVUdfRU5BQkxFRCkge1xuICAgICAgICB2YXIgdmVjID0gdm9pZCAwO1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZXhwb3J0cy5HUklEX1NJWkU7ICsreCkge1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBleHBvcnRzLkdSSURfU0laRTsgKyt5KSB7XG4gICAgICAgICAgICAgICAgdmVjID0gbmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgeSk7XG4gICAgICAgICAgICAgICAgaWYgKGdhbWVHcmlkLmdldFN5bWJvbEF0KHZlYykgPT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUgfHwgdmVjLmVxdWFscyhhaVJlc3VsdC5maW5hbFBvcykpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVByaW9yaXR5KHZlYywgYWlSZXN1bHQucHJpb3JpdGllc1tpKytdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlQcmlvcml0eSh2ZWMsIC0xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGdhbWVHcmlkLmZpbmRGaXZlSW5BUm93KCkgPT09IGFpU3ltYm9sKSB7XG4gICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZXNzYWdlXCIpLmlubmVyVGV4dCA9IFwiWW91IGxvc2UgdGhlIGdhbWVcIjtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmNsb25lT2JqZWN0QXJyYXkgPSBleHBvcnRzLmNsb25lID0gdm9pZCAwO1xuZnVuY3Rpb24gY2xvbmUob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSksIG9iaik7XG59XG5leHBvcnRzLmNsb25lID0gY2xvbmU7XG5mdW5jdGlvbiBjbG9uZU9iamVjdEFycmF5KGFycikge1xuICAgIHZhciBjbG9uZUFyciA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNsb25lQXJyW2ldID0gY2xvbmUoYXJyW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb25lQXJyO1xufVxuZXhwb3J0cy5jbG9uZU9iamVjdEFycmF5ID0gY2xvbmVPYmplY3RBcnJheTtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuVmVjdG9yMiA9IHZvaWQgMDtcbnZhciBtYWluXzEgPSByZXF1aXJlKFwiLi9tYWluXCIpO1xudmFyIFZlY3RvcjIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVmVjdG9yMih4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIFZlY3RvcjIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggKyB4LCB0aGlzLnkgKyB5KTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmFkZFZlY3RvciA9IGZ1bmN0aW9uICh2ZWMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKHZlYy54LCB2ZWMueSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZCgteCwgLXkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuc3VidHJhY3RWZWN0b3IgPSBmdW5jdGlvbiAodmVjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZCgtdmVjLngsIC12ZWMueSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggKiBpLCB0aGlzLnkgKiBpKTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmRpdmlkZSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5KDEgLyBpKTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uICh2ZWMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0gdmVjLnggJiYgdGhpcy55ID09PSB2ZWMueTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmlzRWRnZUNlbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IDAgfHwgdGhpcy55ID09PSAwIHx8IHRoaXMueCArIDEgPT09IG1haW5fMS5HUklEX1NJWkUgfHwgdGhpcy55ICsgMSA9PT0gbWFpbl8xLkdSSURfU0laRTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmlzT3V0T2ZCb3VuZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPCAwIHx8IHRoaXMueCA+PSBtYWluXzEuR1JJRF9TSVpFIHx8IHRoaXMueSA8IDAgfHwgdGhpcy55ID49IG1haW5fMS5HUklEX1NJWkU7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54O1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZ2V0WSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcbiAgICB9O1xuICAgIHJldHVybiBWZWN0b3IyO1xufSgpKTtcbmV4cG9ydHMuVmVjdG9yMiA9IFZlY3RvcjI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==