import {Vector2} from "./vector";
import {GRID_SIZE} from "./main";
import {coordsToIndex} from "./convert";
import {clone, cloneObjectArray} from "./utils";

export const DIRECTIONS: Vector2[] = [
    new Vector2(1, 1),
    new Vector2(0, 1),
    new Vector2(1, 0),
    new Vector2(1, -1)
];

export enum GameSymbol {
    X = "x",
    O = "o",
    NONE = ""
}

export function opponentSymbol(symbol : GameSymbol) : GameSymbol {
    return symbol === GameSymbol.X ? GameSymbol.O : GameSymbol.X;
}

export class GameGrid {
    private grid: GameSymbol[][] = [];

    constructor() {
        for (let x: number = 0; x < GRID_SIZE; ++x) {
            this.grid[x] = [];
            for (let y: number = 0; y < GRID_SIZE; ++y) {
                this.grid[x][y] = GameSymbol.NONE;
            }
        }
    }

    public getCellsWithSymbol(symbol: GameSymbol): Vector2[] {
        let cells: Vector2[] = [];
        for (let x: number = 0; x < GRID_SIZE; ++x) {
            for (let y: number = 0; y < GRID_SIZE; ++y) {
                if (this.grid[x][y] == symbol) {
                    cells.push(new Vector2(x, y));
                }
            }
        }

        return cells;
    }

    public getEmptyCells(): Vector2[] {
        return this.getCellsWithSymbol(GameSymbol.NONE);
    }

    public getCellsAround(pos: Vector2, i: number = 1, gameSymbol: GameSymbol | null = null): Vector2[] {
        let minX: number = Math.min(Math.max(pos.getX() - i, 0), GRID_SIZE);
        let maxX: number = Math.min(Math.max(pos.getX() + i, 0), GRID_SIZE);
        let minY: number = Math.min(Math.max(pos.getY() - i, 0), GRID_SIZE);
        let maxY: number = Math.min(Math.max(pos.getY() + i, 0), GRID_SIZE);

        let cells: Vector2[] = [];
        for (let x: number = minX; x <= maxX; ++x) {
            for (let y: number = minY; y <= maxY; ++y) {
                if (gameSymbol === null || this.grid[x][y] == gameSymbol) {
                    cells.push(new Vector2(x, y));
                }
            }
        }

        return cells;
    }

    public findFiveInARow(): GameSymbol {
        let xCells: Vector2[] = this.getCellsWithSymbol(GameSymbol.X);
        let oCells: Vector2[] = this.getCellsWithSymbol(GameSymbol.O);

        function findFiveInRow(cells: Vector2[]): boolean {
            function exists(cell: Vector2) {
                for (const c of cells) {
                    if (cell.equals(c)) {
                        return true;
                    }
                }

                return false;
            }

            for (const direction of DIRECTIONS) {
                for (const cell of cells) {
                    let row: number = 0;
                    let nextVector: Vector2;
                    for (let i: number = 1 - GRID_SIZE; i < GRID_SIZE; ++i) {
                        nextVector = cell.addVector(direction.multiply(i));
                        if (nextVector.isOutOfBounds()) {
                            continue;
                        }

                        if (exists(nextVector)) {
                            row++;
                        } else {
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
        } else if (findFiveInRow(oCells)) {
            return GameSymbol.O;
        }

        return GameSymbol.NONE;
    }

    public addSymbol(pos: Vector2, symbol: GameSymbol): void {
        this.grid[pos.getX()][pos.getY()] = symbol;
    }

    public getSymbolAt(pos: Vector2): GameSymbol {
        return this.grid[pos.getX()][pos.getY()];
    }
}

export class SymbolRow {
    public readonly row : Vector2[];
    public readonly direction : Vector2;

    public constructor(row : Vector2[], direction : Vector2) {
        this.row = row;
        this.direction = direction;
    }
}

export class GameModel {
    private readonly grid : GameGrid;
    private readonly symbol : GameSymbol;

    private twoInARow : SymbolRow[] = [];
    private threeInARow : SymbolRow[] = [];

    public constructor(grid: GameGrid, symbol: GameSymbol) {
        this.grid = grid;
        this.symbol = symbol;

        this.analyseGrid();
    }

    private analyseGrid() : void {
        let symbols : Vector2[] = this.grid.getCellsWithSymbol(this.symbol);

        let nextVector : Vector2;
        let nextSymbol : GameSymbol;
        for(const symbol of symbols) {
            for(const direction of DIRECTIONS) {
                let symbolsFound : Vector2[] = [];
                let iteration : number = 0;
                let emptyCell : boolean = false;
                for(let i : number = 1 - GRID_SIZE; i < GRID_SIZE; ++i) {
                    nextVector = symbol.addVector(direction.multiply(i)); // next vector in the row
                    if(nextVector.isOutOfBounds()) { // if the vector is not inside of the grid, continue
                        continue;
                    }

                    nextSymbol = this.grid.getSymbolAt(nextVector); // symbol located at next vector

                    // cells are being counted from first non-empty cell so that we return either open or closed row
                    // if next symbol is ai's then we add them to the array when the condition (cell before is empty or we are not on first iteration)
                    if((iteration !== 0 || emptyCell) && nextSymbol === this.symbol) {
                        iteration++;
                        symbolsFound.push(nextVector);
                        emptyCell = false;
                        console.log("Found " + iteration + ". symbol in a row")
                    }

                    if(nextSymbol !== this.symbol || nextVector.isEdgeCell()) {
                        let symbolRow : SymbolRow = new SymbolRow(symbolsFound, direction);
                        switch (iteration) {
                            case 2:
                                this.twoInARow.push(clone(symbolRow));
                                break;
                            case 3:
                                this.threeInARow.push(clone(symbolRow));
                                console.log("s: " + symbolsFound.length + "; i: " + iteration);
                                break;
                        }
                    }

                    if(nextSymbol === GameSymbol.NONE) {
                        emptyCell = true;
                        iteration = 0;
                        symbolsFound = [];
                    }
                }
            }
        }

        console.log("Grid analysed");
        console.log(this.threeInARow);
    }

    public getTwoInRow(): SymbolRow[] {
        return this.twoInARow;
    }

    public getThreeInRow(): SymbolRow[] {
        return this.threeInARow;
    }
}