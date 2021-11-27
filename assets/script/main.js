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
        if (threeInRow.length !== 0) {
            for (var _i = 0, threeInRow_1 = threeInRow; _i < threeInRow_1.length; _i++) {
                var row = threeInRow_1[_i];
                priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += 9;
                priorities[findIndex(row.row[2].addVector(row.direction), cells)] += 9;
            }
        }
        var fourInRow = (new game_model_1.GameModel(this.getGrid(), (0, game_model_1.opponentSymbol)(symbol))).getClosedFourInRow();
        if (fourInRow.length !== 0) {
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
        var cells = this.grid.getCellsWithSymbol(this.symbol);
        var nextVector;
        var nextSymbol;
        for (var _i = 0, cells_3 = cells; _i < cells_3.length; _i++) {
            var cell = cells_3[_i];
            for (var _a = 0, DIRECTIONS_2 = exports.DIRECTIONS; _a < DIRECTIONS_2.length; _a++) {
                var direction = DIRECTIONS_2[_a];
                var currentRow = new SymbolCollection();
                var closed_1 = true;
                for (var i = 1 - main_1.GRID_SIZE; i < main_1.GRID_SIZE; ++i) {
                    nextVector = cell.addVector(direction.multiply(i)); // next vector in the row
                    if (nextVector.isOutOfBounds()) {
                        continue;
                    }
                    nextSymbol = this.grid.getSymbolAt(nextVector);
                    if (nextSymbol !== this.symbol && currentRow.length() !== 0) {
                        if (nextSymbol !== GameSymbol.NONE) {
                            if (closed_1) {
                                currentRow = new SymbolCollection();
                                closed_1 = true;
                                continue;
                            }
                            console.log("Closing the row");
                            closed_1 = true;
                        }
                        var finalRow = currentRow.toSymbolRow(direction);
                        switch (currentRow.length()) {
                            case 3:
                                if (closed_1) {
                                    console.log("Found closed three in a row");
                                    if (GameModel.canSaveRow(this.closedThreeInRow, finalRow))
                                        this.closedThreeInRow.push(finalRow);
                                }
                                else {
                                    console.log("Found three in a row");
                                    if (GameModel.canSaveRow(this.openThreeInRow, finalRow))
                                        this.openThreeInRow.push(finalRow);
                                }
                                break;
                            case 4:
                                if (closed_1) {
                                    if (GameModel.canSaveRow(this.closedFourInRow, finalRow))
                                        this.closedFourInRow.push(finalRow);
                                }
                                else {
                                    if (GameModel.canSaveRow(this.openFourInRow, finalRow))
                                        this.openFourInRow.push(finalRow);
                                }
                                break;
                        }
                        currentRow = new SymbolCollection();
                        closed_1 = true;
                        continue;
                    }
                    if (currentRow.length() === 0) {
                        if (nextSymbol === opponentSymbol(this.symbol)) {
                            closed_1 = true;
                        }
                        else if (nextSymbol === GameSymbol.NONE) {
                            closed_1 = false;
                        }
                        else {
                            currentRow.addSymbol(nextVector);
                        }
                        continue;
                    }
                    currentRow.addSymbol(nextVector);
                }
                // let symbolsFound : Vector2[] = [];
                // let iteration : number = 0;
                // let emptyCell : boolean = false;
                // for(let i : number = 1 - GRID_SIZE; i < GRID_SIZE; ++i) {
                //     nextVector = cell.addVector(direction.multiply(i)); // next vector in the row
                //     if(nextVector.isOutOfBounds()) { // if the vector is not inside of the grid, continue
                //         continue;
                //     }
                //
                //     nextSymbol = this.grid.getSymbolAt(nextVector); // symbol located at next vector
                //
                //     // cells are being counted from first non-empty cell so that we return either open or closed row
                //     // if next symbol is ai's then we add them to the array when the condition (cell before is empty or we are not on first iteration)
                //     if((iteration !== 0 || emptyCell) && nextSymbol === this.symbol) {
                //         iteration++;
                //         symbolsFound.push(nextVector);
                //         emptyCell = false;
                //         console.log("Found " + iteration + ". symbol in a row")
                //     }
                //
                //     if(nextSymbol !== this.symbol || nextVector.isEdgeCell()) {
                //         let symbolRow : SymbolRow = new SymbolRow(symbolsFound, direction);
                //         switch (iteration) {
                //             case 2:
                //                 if(nextSymbol === GameSymbol.NONE) {
                //                     this.twoInRow.push(clone(symbolRow));
                //                 }
                //                 break;
                //             case 3:
                //                 if(nextSymbol === GameSymbol.NONE) {
                //                     this.openThreeInRow.push(clone(symbolRow));
                //                 } else {
                //                     this.closedThreeInRow.push(clone(symbolRow));
                //                 }
                //                 console.log("s: " + symbolsFound.length + "; i: " + iteration);
                //                 break;
                //             case 4:
                //                 if(nextSymbol === GameSymbol.NONE) {
                //                     this.openFourInRow.push(clone(symbolRow));
                //                 } else {
                //                     this.closedFourInRow.push(clone(symbolRow));
                //                 }
                //                 console.log("s: " + symbolsFound.length + "; i: " + iteration);
                //                 break;
                //         }
                //     }
                //
                //     if(nextSymbol === GameSymbol.NONE) {
                //         emptyCell = true;
                //         iteration = 0;
                //         symbolsFound = [];
                //     } else if(nextSymbol !== this.symbol) {
                //         emptyCell = false;
                //         iteration = 0;
                //         symbolsFound = [];
                //     }
                // }
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wdWJsaWMvYXNzZXRzL3NjcmlwdC9tYWluLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZ0JBQWdCLHNDQUFzQyxrQkFBa0I7QUFDdkYsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0EsQ0FBQztBQUNELGtCQUFrQjtBQUNsQixZQUFZLEdBQUcsZ0JBQWdCO0FBQy9CLG1CQUFtQixtQkFBTyxDQUFDLHlDQUFjO0FBQ3pDO0FBQ0Esb0JBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsMEJBQTBCO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELHlCQUF5QjtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsWUFBWTs7Ozs7Ozs7Ozs7QUNwSEM7QUFDYixrQkFBa0I7QUFDbEIscUJBQXFCLEdBQUcscUJBQXFCLEdBQUcscUJBQXFCO0FBQ3JFLGFBQWEsbUJBQU8sQ0FBQyw2QkFBUTtBQUM3QixlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7Ozs7Ozs7Ozs7O0FDdEJSO0FBQ2Isa0JBQWtCO0FBQ2xCLGlCQUFpQixHQUFHLGlCQUFpQixHQUFHLGdCQUFnQixHQUFHLHNCQUFzQixHQUFHLGtCQUFrQixHQUFHLGtCQUFrQjtBQUMzSCxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakMsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCLGNBQWMsbUJBQU8sQ0FBQywrQkFBUztBQUMvQixrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLHNDQUFzQyxrQkFBa0IsS0FBSztBQUM5RDtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHNCQUFzQjtBQUM5QztBQUNBLDRCQUE0QixzQkFBc0I7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHNCQUFzQjtBQUM5Qyw0QkFBNEIsc0JBQXNCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUIscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsV0FBVztBQUN0QywrQkFBK0IsV0FBVztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QscUJBQXFCO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFLDBCQUEwQjtBQUMxRjtBQUNBLGtEQUFrRCxxQkFBcUI7QUFDdkU7QUFDQTtBQUNBO0FBQ0EsdURBQXVELHNCQUFzQjtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxnQkFBZ0I7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsb0JBQW9CO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHdCQUF3QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMscUJBQXFCO0FBQy9EO0FBQ0EsZ0VBQWdFLDBCQUEwQjtBQUMxRjtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsc0JBQXNCO0FBQ3pFLHdFQUF3RTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsZUFBZTtBQUN0RSwyRUFBMkU7QUFDM0Usd0RBQXdEO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLHVFQUF1RTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBLGdGQUFnRjtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0EsZ0ZBQWdGO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGlCQUFpQjs7Ozs7Ozs7Ozs7QUM1VEo7QUFDYixrQkFBa0I7QUFDbEIsaUJBQWlCO0FBQ2pCLGdCQUFnQixtQkFBTyxDQUFDLG1DQUFXO0FBQ25DLG1CQUFtQixtQkFBTyxDQUFDLHlDQUFjO0FBQ3pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxXQUFXLG1CQUFPLENBQUMseUJBQU07QUFDekIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQyx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDekVhO0FBQ2Isa0JBQWtCO0FBQ2xCLHdCQUF3QixHQUFHLGFBQWE7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCOzs7Ozs7Ozs7OztBQ2RYO0FBQ2Isa0JBQWtCO0FBQ2xCLGVBQWU7QUFDZixhQUFhLG1CQUFPLENBQUMsNkJBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGVBQWU7Ozs7Ozs7VUM1Q2Y7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9haS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udmVydC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS1tb2RlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkFJdjIgPSBleHBvcnRzLkFJUmVzdWx0ID0gdm9pZCAwO1xudmFyIGdhbWVfbW9kZWxfMSA9IHJlcXVpcmUoXCIuL2dhbWUtbW9kZWxcIik7XG5mdW5jdGlvbiBmaW5kSW5kZXgocG9zLCBhcnIpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAoYXJyW2ldLmVxdWFscyhwb3MpKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxudmFyIEFJUmVzdWx0ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFJUmVzdWx0KHByaW9yaXRpZXMsIGZpbmFsUG9zKSB7XG4gICAgICAgIHRoaXMucHJpb3JpdGllcyA9IHByaW9yaXRpZXM7XG4gICAgICAgIHRoaXMuZmluYWxQb3MgPSBmaW5hbFBvcztcbiAgICB9XG4gICAgcmV0dXJuIEFJUmVzdWx0O1xufSgpKTtcbmV4cG9ydHMuQUlSZXN1bHQgPSBBSVJlc3VsdDtcbnZhciBBSXYxID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFJdjEoZ3JpZCkge1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkO1xuICAgIH1cbiAgICBBSXYxLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24gKHN5bWJvbCkge1xuICAgICAgICB2YXIgZW1wdHlDZWxscyA9IHRoaXMuZ3JpZC5nZXRFbXB0eUNlbGxzKCk7XG4gICAgICAgIHZhciBwcmlvcml0aWVzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW1wdHlDZWxscy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcHJpb3JpdGllc1tpXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcHJpb3JpdGllcyA9IHRoaXMucHJpb3JpdGl6ZUNlbGxzKGVtcHR5Q2VsbHMsIHByaW9yaXRpZXMsIHN5bWJvbCk7XG4gICAgICAgIHZhciBtYXhQcmlvcml0eSA9IC0xO1xuICAgICAgICB2YXIgZmluYWxQb3NpdGlvbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmlvcml0aWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAocHJpb3JpdGllc1tpXSA9PSBtYXhQcmlvcml0eSAmJiBNYXRoLnJhbmRvbSgpID4gMC43KSB7XG4gICAgICAgICAgICAgICAgZmluYWxQb3NpdGlvbiA9IGVtcHR5Q2VsbHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChwcmlvcml0aWVzW2ldID4gbWF4UHJpb3JpdHkpIHtcbiAgICAgICAgICAgICAgICBtYXhQcmlvcml0eSA9IHByaW9yaXRpZXNbaV07XG4gICAgICAgICAgICAgICAgZmluYWxQb3NpdGlvbiA9IGVtcHR5Q2VsbHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBBSVJlc3VsdChwcmlvcml0aWVzLCBmaW5hbFBvc2l0aW9uKTtcbiAgICB9O1xuICAgIEFJdjEucHJvdG90eXBlLnByaW9yaXRpemVDZWxscyA9IGZ1bmN0aW9uIChjZWxscywgcHJpb3JpdGllcywgc3ltYm9sKSB7XG4gICAgICAgIHZhciBncmlkID0gdGhpcy5ncmlkO1xuICAgICAgICB2YXIgb3Bwb25lbnRzU3ltYm9sID0gc3ltYm9sID09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLlggPyBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5PIDogZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuWDtcbiAgICAgICAgdmFyIG9wcG9uZW50c0NlbGxzID0gZ3JpZC5nZXRDZWxsc1dpdGhTeW1ib2wob3Bwb25lbnRzU3ltYm9sKTtcbiAgICAgICAgb3Bwb25lbnRzQ2VsbHMuZm9yRWFjaChmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgICAgICBncmlkLmdldENlbGxzQXJvdW5kKHBvcywgMSkuZm9yRWFjaChmdW5jdGlvbiAocG9zQXJvdW5kKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjZWxscy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zQXJvdW5kLmVxdWFscyhjZWxsc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbaV0rKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByaW9yaXRpZXM7XG4gICAgfTtcbiAgICBBSXYxLnByb3RvdHlwZS5nZXRHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkO1xuICAgIH07XG4gICAgcmV0dXJuIEFJdjE7XG59KCkpO1xudmFyIEFJdjIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFJdjIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQUl2MigpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBBSXYyLnByb3RvdHlwZS5wcmlvcml0aXplQ2VsbHMgPSBmdW5jdGlvbiAoY2VsbHMsIHByaW9yaXRpZXMsIHN5bWJvbCkge1xuICAgICAgICBwcmlvcml0aWVzID0gX3N1cGVyLnByb3RvdHlwZS5wcmlvcml0aXplQ2VsbHMuY2FsbCh0aGlzLCBjZWxscywgcHJpb3JpdGllcywgc3ltYm9sKTtcbiAgICAgICAgdmFyIHRocmVlSW5Sb3cgPSAobmV3IGdhbWVfbW9kZWxfMS5HYW1lTW9kZWwodGhpcy5nZXRHcmlkKCksICgwLCBnYW1lX21vZGVsXzEub3Bwb25lbnRTeW1ib2wpKHN5bWJvbCkpKS5nZXRPcGVuVGhyZWVJblJvdygpO1xuICAgICAgICBpZiAodGhyZWVJblJvdy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgdGhyZWVJblJvd18xID0gdGhyZWVJblJvdzsgX2kgPCB0aHJlZUluUm93XzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRocmVlSW5Sb3dfMVtfaV07XG4gICAgICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1swXS5zdWJ0cmFjdFZlY3Rvcihyb3cuZGlyZWN0aW9uKSwgY2VsbHMpXSArPSA5O1xuICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KHJvdy5yb3dbMl0uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pLCBjZWxscyldICs9IDk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZvdXJJblJvdyA9IChuZXcgZ2FtZV9tb2RlbF8xLkdhbWVNb2RlbCh0aGlzLmdldEdyaWQoKSwgKDAsIGdhbWVfbW9kZWxfMS5vcHBvbmVudFN5bWJvbCkoc3ltYm9sKSkpLmdldENsb3NlZEZvdXJJblJvdygpO1xuICAgICAgICBpZiAoZm91ckluUm93Lmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBmb3VySW5Sb3dfMSA9IGZvdXJJblJvdzsgX2EgPCBmb3VySW5Sb3dfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gZm91ckluUm93XzFbX2FdO1xuICAgICAgICAgICAgICAgIGlmICgoIXJvdy5yb3dbMF0uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbikuaXNPdXRPZkJvdW5kcygpKSAmJiB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzBdLnN1YnRyYWN0VmVjdG9yKHJvdy5kaXJlY3Rpb24pKSA9PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KHJvdy5yb3dbMF0uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbiksIGNlbGxzKV0gKz0gMTAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgoIXJvdy5yb3dbMF0uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pLmlzT3V0T2ZCb3VuZHMoKSkgJiYgdGhpcy5nZXRHcmlkKCkuZ2V0U3ltYm9sQXQocm93LnJvd1swXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbikpID09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1swXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbiksIGNlbGxzKV0gKz0gMTAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgoIXJvdy5yb3dbM10uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbikuaXNPdXRPZkJvdW5kcygpKSAmJiB0aGlzLmdldEdyaWQoKS5nZXRTeW1ib2xBdChyb3cucm93WzNdLnN1YnRyYWN0VmVjdG9yKHJvdy5kaXJlY3Rpb24pKSA9PSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXRpZXNbZmluZEluZGV4KHJvdy5yb3dbM10uc3VidHJhY3RWZWN0b3Iocm93LmRpcmVjdGlvbiksIGNlbGxzKV0gKz0gMTAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgoIXJvdy5yb3dbM10uYWRkVmVjdG9yKHJvdy5kaXJlY3Rpb24pLmlzT3V0T2ZCb3VuZHMoKSkgJiYgdGhpcy5nZXRHcmlkKCkuZ2V0U3ltYm9sQXQocm93LnJvd1szXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbikpID09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdGllc1tmaW5kSW5kZXgocm93LnJvd1szXS5hZGRWZWN0b3Iocm93LmRpcmVjdGlvbiksIGNlbGxzKV0gKz0gMTAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJpb3JpdGllcztcbiAgICB9O1xuICAgIHJldHVybiBBSXYyO1xufShBSXYxKSk7XG5leHBvcnRzLkFJdjIgPSBBSXYyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5pbmRleFRvVmVjdG9yID0gZXhwb3J0cy52ZWN0b3JUb0luZGV4ID0gZXhwb3J0cy5jb29yZHNUb0luZGV4ID0gdm9pZCAwO1xudmFyIGdvbW9rdSA9IHJlcXVpcmUoXCIuL21haW5cIik7XG52YXIgdmVjdG9yXzEgPSByZXF1aXJlKFwiLi92ZWN0b3JcIik7XG5mdW5jdGlvbiBjb29yZHNUb0luZGV4KHgsIHkpIHtcbiAgICByZXR1cm4geSAqIGdvbW9rdS5HUklEX1NJWkUgKyB4O1xufVxuZXhwb3J0cy5jb29yZHNUb0luZGV4ID0gY29vcmRzVG9JbmRleDtcbmZ1bmN0aW9uIGdldEluZGV4WChpbmRleCkge1xuICAgIHJldHVybiBpbmRleCAlIGdvbW9rdS5HUklEX1NJWkU7XG59XG5mdW5jdGlvbiBnZXRJbmRleFkoaW5kZXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihpbmRleCAvIGdvbW9rdS5HUklEX1NJWkUpO1xufVxuZnVuY3Rpb24gdmVjdG9yVG9JbmRleCh2ZWMpIHtcbiAgICByZXR1cm4gY29vcmRzVG9JbmRleCh2ZWMuZ2V0WCgpLCB2ZWMuZ2V0WSgpKTtcbn1cbmV4cG9ydHMudmVjdG9yVG9JbmRleCA9IHZlY3RvclRvSW5kZXg7XG5mdW5jdGlvbiBpbmRleFRvVmVjdG9yKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyB2ZWN0b3JfMS5WZWN0b3IyKGdldEluZGV4WChpbmRleCksIGdldEluZGV4WShpbmRleCkpO1xufVxuZXhwb3J0cy5pbmRleFRvVmVjdG9yID0gaW5kZXhUb1ZlY3RvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuR2FtZU1vZGVsID0gZXhwb3J0cy5TeW1ib2xSb3cgPSBleHBvcnRzLkdhbWVHcmlkID0gZXhwb3J0cy5vcHBvbmVudFN5bWJvbCA9IGV4cG9ydHMuR2FtZVN5bWJvbCA9IGV4cG9ydHMuRElSRUNUSU9OUyA9IHZvaWQgMDtcbnZhciB2ZWN0b3JfMSA9IHJlcXVpcmUoXCIuL3ZlY3RvclwiKTtcbnZhciBtYWluXzEgPSByZXF1aXJlKFwiLi9tYWluXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmV4cG9ydHMuRElSRUNUSU9OUyA9IFtcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAxKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigwLCAxKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAwKSxcbiAgICBuZXcgdmVjdG9yXzEuVmVjdG9yMigxLCAtMSlcbl07XG52YXIgR2FtZVN5bWJvbDtcbihmdW5jdGlvbiAoR2FtZVN5bWJvbCkge1xuICAgIEdhbWVTeW1ib2xbXCJYXCJdID0gXCJ4XCI7XG4gICAgR2FtZVN5bWJvbFtcIk9cIl0gPSBcIm9cIjtcbiAgICBHYW1lU3ltYm9sW1wiTk9ORVwiXSA9IFwiXCI7XG59KShHYW1lU3ltYm9sID0gZXhwb3J0cy5HYW1lU3ltYm9sIHx8IChleHBvcnRzLkdhbWVTeW1ib2wgPSB7fSkpO1xuZnVuY3Rpb24gb3Bwb25lbnRTeW1ib2woc3ltYm9sKSB7XG4gICAgcmV0dXJuIHN5bWJvbCA9PT0gR2FtZVN5bWJvbC5YID8gR2FtZVN5bWJvbC5PIDogR2FtZVN5bWJvbC5YO1xufVxuZXhwb3J0cy5vcHBvbmVudFN5bWJvbCA9IG9wcG9uZW50U3ltYm9sO1xudmFyIEdhbWVHcmlkID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEdhbWVHcmlkKCkge1xuICAgICAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBtYWluXzEuR1JJRF9TSVpFOyArK3gpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFt4XSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBtYWluXzEuR1JJRF9TSVpFOyArK3kpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRbeF1beV0gPSBHYW1lU3ltYm9sLk5PTkU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldENlbGxzV2l0aFN5bWJvbCA9IGZ1bmN0aW9uIChzeW1ib2wpIHtcbiAgICAgICAgdmFyIGNlbGxzID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbWFpbl8xLkdSSURfU0laRTsgKyt4KSB7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG1haW5fMS5HUklEX1NJWkU7ICsreSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyaWRbeF1beV0gPT0gc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLnB1c2gobmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgeSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbHM7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZ2V0RW1wdHlDZWxscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2VsbHNXaXRoU3ltYm9sKEdhbWVTeW1ib2wuTk9ORSk7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZ2V0Q2VsbHNBcm91bmQgPSBmdW5jdGlvbiAocG9zLCBpLCBnYW1lU3ltYm9sKSB7XG4gICAgICAgIGlmIChpID09PSB2b2lkIDApIHsgaSA9IDE7IH1cbiAgICAgICAgaWYgKGdhbWVTeW1ib2wgPT09IHZvaWQgMCkgeyBnYW1lU3ltYm9sID0gbnVsbDsgfVxuICAgICAgICB2YXIgbWluWCA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRYKCkgLSBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBtYXhYID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLmdldFgoKSArIGksIDApLCBtYWluXzEuR1JJRF9TSVpFKTtcbiAgICAgICAgdmFyIG1pblkgPSBNYXRoLm1pbihNYXRoLm1heChwb3MuZ2V0WSgpIC0gaSwgMCksIG1haW5fMS5HUklEX1NJWkUpO1xuICAgICAgICB2YXIgbWF4WSA9IE1hdGgubWluKE1hdGgubWF4KHBvcy5nZXRZKCkgKyBpLCAwKSwgbWFpbl8xLkdSSURfU0laRSk7XG4gICAgICAgIHZhciBjZWxscyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gbWluWDsgeCA8PSBtYXhYOyArK3gpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSBtaW5ZOyB5IDw9IG1heFk7ICsreSkge1xuICAgICAgICAgICAgICAgIGlmIChnYW1lU3ltYm9sID09PSBudWxsIHx8IHRoaXMuZ3JpZFt4XVt5XSA9PSBnYW1lU3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLnB1c2gobmV3IHZlY3Rvcl8xLlZlY3RvcjIoeCwgeSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbHM7XG4gICAgfTtcbiAgICBHYW1lR3JpZC5wcm90b3R5cGUuZmluZEZpdmVJbkFSb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB4Q2VsbHMgPSB0aGlzLmdldENlbGxzV2l0aFN5bWJvbChHYW1lU3ltYm9sLlgpO1xuICAgICAgICB2YXIgb0NlbGxzID0gdGhpcy5nZXRDZWxsc1dpdGhTeW1ib2woR2FtZVN5bWJvbC5PKTtcbiAgICAgICAgZnVuY3Rpb24gZmluZEZpdmVJblJvdyhjZWxscykge1xuICAgICAgICAgICAgZnVuY3Rpb24gZXhpc3RzKGNlbGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGNlbGxzXzIgPSBjZWxsczsgX2kgPCBjZWxsc18yLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IGNlbGxzXzJbX2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbC5lcXVhbHMoYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgRElSRUNUSU9OU18xID0gZXhwb3J0cy5ESVJFQ1RJT05TOyBfaSA8IERJUkVDVElPTlNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gRElSRUNUSU9OU18xW19pXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfYSA9IDAsIGNlbGxzXzEgPSBjZWxsczsgX2EgPCBjZWxsc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IGNlbGxzXzFbX2FdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRWZWN0b3IgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxIC0gbWFpbl8xLkdSSURfU0laRTsgaSA8IG1haW5fMS5HUklEX1NJWkU7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFZlY3RvciA9IGNlbGwuYWRkVmVjdG9yKGRpcmVjdGlvbi5tdWx0aXBseShpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFZlY3Rvci5pc091dE9mQm91bmRzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMobmV4dFZlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3crKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93ID09PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbmRGaXZlSW5Sb3coeENlbGxzKSkge1xuICAgICAgICAgICAgcmV0dXJuIEdhbWVTeW1ib2wuWDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmaW5kRml2ZUluUm93KG9DZWxscykpIHtcbiAgICAgICAgICAgIHJldHVybiBHYW1lU3ltYm9sLk87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEdhbWVTeW1ib2wuTk9ORTtcbiAgICB9O1xuICAgIEdhbWVHcmlkLnByb3RvdHlwZS5hZGRTeW1ib2wgPSBmdW5jdGlvbiAocG9zLCBzeW1ib2wpIHtcbiAgICAgICAgdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldID0gc3ltYm9sO1xuICAgIH07XG4gICAgR2FtZUdyaWQucHJvdG90eXBlLmdldFN5bWJvbEF0ID0gZnVuY3Rpb24gKHBvcykge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkW3Bvcy5nZXRYKCldW3Bvcy5nZXRZKCldO1xuICAgIH07XG4gICAgcmV0dXJuIEdhbWVHcmlkO1xufSgpKTtcbmV4cG9ydHMuR2FtZUdyaWQgPSBHYW1lR3JpZDtcbnZhciBTeW1ib2xSb3cgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3ltYm9sUm93KHJvdywgZGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMucm93ID0gcm93O1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIFN5bWJvbFJvdztcbn0oKSk7XG5leHBvcnRzLlN5bWJvbFJvdyA9IFN5bWJvbFJvdztcbnZhciBTeW1ib2xDb2xsZWN0aW9uID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN5bWJvbENvbGxlY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3ltYm9scyA9IFtdO1xuICAgIH1cbiAgICBTeW1ib2xDb2xsZWN0aW9uLnByb3RvdHlwZS5hZGRTeW1ib2wgPSBmdW5jdGlvbiAoc3ltYm9sKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnN5bWJvbHM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWRkZWRTeW1ib2wgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAoYWRkZWRTeW1ib2wuZXF1YWxzKHN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zeW1ib2xzLnB1c2goc3ltYm9sKTtcbiAgICB9O1xuICAgIFN5bWJvbENvbGxlY3Rpb24ucHJvdG90eXBlLnRvU3ltYm9sUm93ID0gZnVuY3Rpb24gKGRpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IFN5bWJvbFJvdygoMCwgdXRpbHNfMS5jbG9uZU9iamVjdEFycmF5KSh0aGlzLnN5bWJvbHMpLCBkaXJlY3Rpb24pO1xuICAgIH07XG4gICAgU3ltYm9sQ29sbGVjdGlvbi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2xzLmxlbmd0aDtcbiAgICB9O1xuICAgIHJldHVybiBTeW1ib2xDb2xsZWN0aW9uO1xufSgpKTtcbnZhciBHYW1lTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZU1vZGVsKGdyaWQsIHN5bWJvbCkge1xuICAgICAgICAvLyAyXG4gICAgICAgIHRoaXMudHdvSW5Sb3cgPSBbXTtcbiAgICAgICAgLy8gM1xuICAgICAgICB0aGlzLm9wZW5UaHJlZUluUm93ID0gW107XG4gICAgICAgIHRoaXMuY2xvc2VkVGhyZWVJblJvdyA9IFtdO1xuICAgICAgICAvLyA0XG4gICAgICAgIHRoaXMub3BlbkZvdXJJblJvdyA9IFtdO1xuICAgICAgICB0aGlzLmNsb3NlZEZvdXJJblJvdyA9IFtdO1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkO1xuICAgICAgICB0aGlzLnN5bWJvbCA9IHN5bWJvbDtcbiAgICAgICAgdGhpcy5hbmFseXNlR3JpZCgpO1xuICAgIH1cbiAgICBHYW1lTW9kZWwuY2FuU2F2ZVJvdyA9IGZ1bmN0aW9uIChyb3dzLCByb3cpIHtcbiAgICAgICAgZmlyc3RMb29wOiBmb3IgKHZhciBfaSA9IDAsIHJvd3NfMSA9IHJvd3M7IF9pIDwgcm93c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSByb3dzXzFbX2ldO1xuICAgICAgICAgICAgaWYgKHJvdy5yb3cubGVuZ3RoICE9IGN1cnJlbnQucm93Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50LnJvdy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmICghY3VycmVudC5yb3dbaV0uZXF1YWxzKHJvdy5yb3dbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGZpcnN0TG9vcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLmFuYWx5c2VHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2VsbHMgPSB0aGlzLmdyaWQuZ2V0Q2VsbHNXaXRoU3ltYm9sKHRoaXMuc3ltYm9sKTtcbiAgICAgICAgdmFyIG5leHRWZWN0b3I7XG4gICAgICAgIHZhciBuZXh0U3ltYm9sO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGNlbGxzXzMgPSBjZWxsczsgX2kgPCBjZWxsc18zLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGNlbGwgPSBjZWxsc18zW19pXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgRElSRUNUSU9OU18yID0gZXhwb3J0cy5ESVJFQ1RJT05TOyBfYSA8IERJUkVDVElPTlNfMi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gRElSRUNUSU9OU18yW19hXTtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFJvdyA9IG5ldyBTeW1ib2xDb2xsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgdmFyIGNsb3NlZF8xID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMSAtIG1haW5fMS5HUklEX1NJWkU7IGkgPCBtYWluXzEuR1JJRF9TSVpFOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFZlY3RvciA9IGNlbGwuYWRkVmVjdG9yKGRpcmVjdGlvbi5tdWx0aXBseShpKSk7IC8vIG5leHQgdmVjdG9yIGluIHRoZSByb3dcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRWZWN0b3IuaXNPdXRPZkJvdW5kcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0U3ltYm9sID0gdGhpcy5ncmlkLmdldFN5bWJvbEF0KG5leHRWZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFN5bWJvbCAhPT0gdGhpcy5zeW1ib2wgJiYgY3VycmVudFJvdy5sZW5ndGgoKSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRTeW1ib2wgIT09IEdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbG9zZWRfMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Um93ID0gbmV3IFN5bWJvbENvbGxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VkXzEgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbG9zaW5nIHRoZSByb3dcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VkXzEgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbmFsUm93ID0gY3VycmVudFJvdy50b1N5bWJvbFJvdyhkaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjdXJyZW50Um93Lmxlbmd0aCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xvc2VkXzEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRm91bmQgY2xvc2VkIHRocmVlIGluIGEgcm93XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEdhbWVNb2RlbC5jYW5TYXZlUm93KHRoaXMuY2xvc2VkVGhyZWVJblJvdywgZmluYWxSb3cpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VkVGhyZWVJblJvdy5wdXNoKGZpbmFsUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRm91bmQgdGhyZWUgaW4gYSByb3dcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoR2FtZU1vZGVsLmNhblNhdmVSb3codGhpcy5vcGVuVGhyZWVJblJvdywgZmluYWxSb3cpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3BlblRocmVlSW5Sb3cucHVzaChmaW5hbFJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xvc2VkXzEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChHYW1lTW9kZWwuY2FuU2F2ZVJvdyh0aGlzLmNsb3NlZEZvdXJJblJvdywgZmluYWxSb3cpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VkRm91ckluUm93LnB1c2goZmluYWxSb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEdhbWVNb2RlbC5jYW5TYXZlUm93KHRoaXMub3BlbkZvdXJJblJvdywgZmluYWxSb3cpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkZvdXJJblJvdy5wdXNoKGZpbmFsUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRSb3cgPSBuZXcgU3ltYm9sQ29sbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VkXzEgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRSb3cubGVuZ3RoKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0U3ltYm9sID09PSBvcHBvbmVudFN5bWJvbCh0aGlzLnN5bWJvbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWRfMSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChuZXh0U3ltYm9sID09PSBHYW1lU3ltYm9sLk5PTkUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWRfMSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFJvdy5hZGRTeW1ib2wobmV4dFZlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Um93LmFkZFN5bWJvbChuZXh0VmVjdG9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gbGV0IHN5bWJvbHNGb3VuZCA6IFZlY3RvcjJbXSA9IFtdO1xuICAgICAgICAgICAgICAgIC8vIGxldCBpdGVyYXRpb24gOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgICAgIC8vIGxldCBlbXB0eUNlbGwgOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gZm9yKGxldCBpIDogbnVtYmVyID0gMSAtIEdSSURfU0laRTsgaSA8IEdSSURfU0laRTsgKytpKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIG5leHRWZWN0b3IgPSBjZWxsLmFkZFZlY3RvcihkaXJlY3Rpb24ubXVsdGlwbHkoaSkpOyAvLyBuZXh0IHZlY3RvciBpbiB0aGUgcm93XG4gICAgICAgICAgICAgICAgLy8gICAgIGlmKG5leHRWZWN0b3IuaXNPdXRPZkJvdW5kcygpKSB7IC8vIGlmIHRoZSB2ZWN0b3IgaXMgbm90IGluc2lkZSBvZiB0aGUgZ3JpZCwgY29udGludWVcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyAgICAgbmV4dFN5bWJvbCA9IHRoaXMuZ3JpZC5nZXRTeW1ib2xBdChuZXh0VmVjdG9yKTsgLy8gc3ltYm9sIGxvY2F0ZWQgYXQgbmV4dCB2ZWN0b3JcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vICAgICAvLyBjZWxscyBhcmUgYmVpbmcgY291bnRlZCBmcm9tIGZpcnN0IG5vbi1lbXB0eSBjZWxsIHNvIHRoYXQgd2UgcmV0dXJuIGVpdGhlciBvcGVuIG9yIGNsb3NlZCByb3dcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gaWYgbmV4dCBzeW1ib2wgaXMgYWkncyB0aGVuIHdlIGFkZCB0aGVtIHRvIHRoZSBhcnJheSB3aGVuIHRoZSBjb25kaXRpb24gKGNlbGwgYmVmb3JlIGlzIGVtcHR5IG9yIHdlIGFyZSBub3Qgb24gZmlyc3QgaXRlcmF0aW9uKVxuICAgICAgICAgICAgICAgIC8vICAgICBpZigoaXRlcmF0aW9uICE9PSAwIHx8IGVtcHR5Q2VsbCkgJiYgbmV4dFN5bWJvbCA9PT0gdGhpcy5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGl0ZXJhdGlvbisrO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgc3ltYm9sc0ZvdW5kLnB1c2gobmV4dFZlY3Rvcik7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBlbXB0eUNlbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiRm91bmQgXCIgKyBpdGVyYXRpb24gKyBcIi4gc3ltYm9sIGluIGEgcm93XCIpXG4gICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vICAgICBpZihuZXh0U3ltYm9sICE9PSB0aGlzLnN5bWJvbCB8fCBuZXh0VmVjdG9yLmlzRWRnZUNlbGwoKSkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgbGV0IHN5bWJvbFJvdyA6IFN5bWJvbFJvdyA9IG5ldyBTeW1ib2xSb3coc3ltYm9sc0ZvdW5kLCBkaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgc3dpdGNoIChpdGVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGlmKG5leHRTeW1ib2wgPT09IEdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy50d29JblJvdy5wdXNoKGNsb25lKHN5bWJvbFJvdykpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgaWYobmV4dFN5bWJvbCA9PT0gR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5UaHJlZUluUm93LnB1c2goY2xvbmUoc3ltYm9sUm93KSk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlZFRocmVlSW5Sb3cucHVzaChjbG9uZShzeW1ib2xSb3cpKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInM6IFwiICsgc3ltYm9sc0ZvdW5kLmxlbmd0aCArIFwiOyBpOiBcIiArIGl0ZXJhdGlvbik7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgaWYobmV4dFN5bWJvbCA9PT0gR2FtZVN5bWJvbC5OT05FKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5Gb3VySW5Sb3cucHVzaChjbG9uZShzeW1ib2xSb3cpKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VkRm91ckluUm93LnB1c2goY2xvbmUoc3ltYm9sUm93KSk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzOiBcIiArIHN5bWJvbHNGb3VuZC5sZW5ndGggKyBcIjsgaTogXCIgKyBpdGVyYXRpb24pO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gICAgIGlmKG5leHRTeW1ib2wgPT09IEdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZW1wdHlDZWxsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGl0ZXJhdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBzeW1ib2xzRm91bmQgPSBbXTtcbiAgICAgICAgICAgICAgICAvLyAgICAgfSBlbHNlIGlmKG5leHRTeW1ib2wgIT09IHRoaXMuc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBlbXB0eUNlbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGl0ZXJhdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBzeW1ib2xzRm91bmQgPSBbXTtcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgR2FtZU1vZGVsLnByb3RvdHlwZS5nZXRUd29JblJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHdvSW5Sb3c7XG4gICAgfTtcbiAgICBHYW1lTW9kZWwucHJvdG90eXBlLmdldE9wZW5UaHJlZUluUm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuVGhyZWVJblJvdztcbiAgICB9O1xuICAgIEdhbWVNb2RlbC5wcm90b3R5cGUuZ2V0Q2xvc2VkRm91ckluUm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9zZWRGb3VySW5Sb3c7XG4gICAgfTtcbiAgICByZXR1cm4gR2FtZU1vZGVsO1xufSgpKTtcbmV4cG9ydHMuR2FtZU1vZGVsID0gR2FtZU1vZGVsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5HUklEX1NJWkUgPSB2b2lkIDA7XG52YXIgY29udmVydF8xID0gcmVxdWlyZShcIi4vY29udmVydFwiKTtcbnZhciBnYW1lX21vZGVsXzEgPSByZXF1aXJlKFwiLi9nYW1lLW1vZGVsXCIpO1xudmFyIHZlY3Rvcl8xID0gcmVxdWlyZShcIi4vdmVjdG9yXCIpO1xudmFyIGFpXzEgPSByZXF1aXJlKFwiLi9haVwiKTtcbmV4cG9ydHMuR1JJRF9TSVpFID0gMTU7XG5jb25zb2xlLmxvZyhcIlN0YXJ0aW5nIHRoZSBhcHBsaWNhdGlvblwiKTtcbnZhciBnYW1lR3JpZCA9IG5ldyBnYW1lX21vZGVsXzEuR2FtZUdyaWQoKTtcbnZhciBwbGF5ZXJTeW1ib2wgPSBnYW1lX21vZGVsXzEuR2FtZVN5bWJvbC5YO1xudmFyIGFpU3ltYm9sID0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTztcbnZhciBwbGF5aW5nID0gdHJ1ZTtcbi8vIEhhbmRsaW5nIGNsaWNrXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiLmNlbGxcIikuYmluZChcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAgICB2YXIgY2xpY2tQb3NpdGlvbiA9ICgwLCBjb252ZXJ0XzEuaW5kZXhUb1ZlY3RvcikoZWxlbWVudC5pbmRleCgpKTtcbiAgICAgICAgLy8gV2UgY2Fubm90IHBsYWNlIHN5bWJvbCB0byBjZWxsIHdoaWNoIGFscmVhZHkgaGFzIGFub3RoZXIgb25lXG4gICAgICAgIGlmIChnYW1lR3JpZC5nZXRTeW1ib2xBdChjbGlja1Bvc2l0aW9uKSAhPT0gZ2FtZV9tb2RlbF8xLkdhbWVTeW1ib2wuTk9ORSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGxheWluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXlTeW1ib2woY2xpY2tQb3NpdGlvbiwgcGxheWVyU3ltYm9sKTtcbiAgICAgICAgc2F2ZVN5bWJvbChjbGlja1Bvc2l0aW9uLCBwbGF5ZXJTeW1ib2wpO1xuICAgICAgICBpZiAoZ2FtZUdyaWQuZmluZEZpdmVJbkFSb3coKSA9PT0gcGxheWVyU3ltYm9sKSB7XG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbmdyYXRzISBZb3UgaGF2ZSB3b24gdGhlIGdhbWUhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGhhbmRsZUNsaWNrKGNsaWNrUG9zaXRpb24pO1xuICAgIH0pO1xufSk7XG4vLyBEaXNwbGF5IHN0dWZmXG5mdW5jdGlvbiBkaXNwbGF5U3ltYm9sKHBvc2l0aW9uLCBzeW1ib2wpIHtcbiAgICAkKFwiLmdhbWUtZ3JpZFwiKVxuICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAuZXEoKDAsIGNvbnZlcnRfMS52ZWN0b3JUb0luZGV4KShwb3NpdGlvbikpXG4gICAgICAgIC5hZGRDbGFzcyhzeW1ib2wpO1xufVxuZnVuY3Rpb24gZGlzcGxheVByaW9yaXR5KHBvc2l0aW9uLCBwcmlvcml0eSkge1xuICAgICQoXCIuZ2FtZS1ncmlkXCIpXG4gICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgIC5lcSgoMCwgY29udmVydF8xLnZlY3RvclRvSW5kZXgpKHBvc2l0aW9uKSlcbiAgICAgICAgLnRleHQocHJpb3JpdHkudG9TdHJpbmcoKSk7XG59XG5mdW5jdGlvbiBzYXZlU3ltYm9sKHBvc2l0aW9uLCBzeW1ib2wpIHtcbiAgICBnYW1lR3JpZC5hZGRTeW1ib2wocG9zaXRpb24sIHN5bWJvbCk7XG59XG4vLyBHYW1lIHN0dWZmXG5mdW5jdGlvbiBoYW5kbGVDbGljayhjbGlja1Bvc2l0aW9uKSB7XG4gICAgdmFyIGFpUmVzdWx0ID0gKG5ldyBhaV8xLkFJdjIoZ2FtZUdyaWQpKS5wbGF5KGFpU3ltYm9sKTtcbiAgICBkaXNwbGF5U3ltYm9sKGFpUmVzdWx0LmZpbmFsUG9zLCBhaVN5bWJvbCk7XG4gICAgc2F2ZVN5bWJvbChhaVJlc3VsdC5maW5hbFBvcywgYWlTeW1ib2wpO1xuICAgIHZhciB2ZWM7XG4gICAgdmFyIGkgPSAwO1xuICAgIGZvciAodmFyIHggPSAwOyB4IDwgZXhwb3J0cy5HUklEX1NJWkU7ICsreCkge1xuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGV4cG9ydHMuR1JJRF9TSVpFOyArK3kpIHtcbiAgICAgICAgICAgIHZlYyA9IG5ldyB2ZWN0b3JfMS5WZWN0b3IyKHgsIHkpO1xuICAgICAgICAgICAgaWYgKGdhbWVHcmlkLmdldFN5bWJvbEF0KHZlYykgPT09IGdhbWVfbW9kZWxfMS5HYW1lU3ltYm9sLk5PTkUgfHwgdmVjLmVxdWFscyhhaVJlc3VsdC5maW5hbFBvcykpIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5UHJpb3JpdHkodmVjLCBhaVJlc3VsdC5wcmlvcml0aWVzW2krK10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheVByaW9yaXR5KHZlYywgLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChnYW1lR3JpZC5maW5kRml2ZUluQVJvdygpID09PSBhaVN5bWJvbCkge1xuICAgICAgICBwbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiWW91IGxvc2VcIik7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5jbG9uZU9iamVjdEFycmF5ID0gZXhwb3J0cy5jbG9uZSA9IHZvaWQgMDtcbmZ1bmN0aW9uIGNsb25lKG9iaikge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikpLCBvYmopO1xufVxuZXhwb3J0cy5jbG9uZSA9IGNsb25lO1xuZnVuY3Rpb24gY2xvbmVPYmplY3RBcnJheShhcnIpIHtcbiAgICB2YXIgY2xvbmVBcnIgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSkge1xuICAgICAgICBjbG9uZUFycltpXSA9IGNsb25lKGFycltpXSk7XG4gICAgfVxuICAgIHJldHVybiBjbG9uZUFycjtcbn1cbmV4cG9ydHMuY2xvbmVPYmplY3RBcnJheSA9IGNsb25lT2JqZWN0QXJyYXk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLlZlY3RvcjIgPSB2b2lkIDA7XG52YXIgbWFpbl8xID0gcmVxdWlyZShcIi4vbWFpblwiKTtcbnZhciBWZWN0b3IyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFZlY3RvcjIoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBWZWN0b3IyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICsgeCwgdGhpcy55ICsgeSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5hZGRWZWN0b3IgPSBmdW5jdGlvbiAodmVjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZCh2ZWMueCwgdmVjLnkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoLXgsIC15KTtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLnN1YnRyYWN0VmVjdG9yID0gZnVuY3Rpb24gKHZlYykge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoLXZlYy54LCAtdmVjLnkpO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICogaSwgdGhpcy55ICogaSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5kaXZpZGUgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseSgxIC8gaSk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAodmVjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IHZlYy54ICYmIHRoaXMueSA9PT0gdmVjLnk7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5pc0VkZ2VDZWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54ID09PSAwIHx8IHRoaXMueSA9PT0gMCB8fCB0aGlzLnggKyAxID09PSBtYWluXzEuR1JJRF9TSVpFIHx8IHRoaXMueSArIDEgPT09IG1haW5fMS5HUklEX1NJWkU7XG4gICAgfTtcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5pc091dE9mQm91bmRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54IDwgMCB8fCB0aGlzLnggPj0gbWFpbl8xLkdSSURfU0laRSB8fCB0aGlzLnkgPCAwIHx8IHRoaXMueSA+PSBtYWluXzEuR1JJRF9TSVpFO1xuICAgIH07XG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZ2V0WCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcbiAgICB9O1xuICAgIFZlY3RvcjIucHJvdG90eXBlLmdldFkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnk7XG4gICAgfTtcbiAgICByZXR1cm4gVmVjdG9yMjtcbn0oKSk7XG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=