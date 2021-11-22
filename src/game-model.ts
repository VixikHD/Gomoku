import {Vector2} from "./vector";
import {GRID_SIZE} from "./main";

export enum GameSymbol {
    X = "x",
    O = "o",
    NONE = ""
}

export class GameGrid {
    private grid : GameSymbol[][] = [];

    constructor() {
        for(let x : number = 0; x < GRID_SIZE; ++x) {
            this.grid[x] = [];
            for(let y : number = 0; y < GRID_SIZE; ++y) {
                this.grid[x][y] = GameSymbol.NONE;
            }
        }
    }

    public getCellsWithSymbol(symbol : GameSymbol) : Vector2[] {
        let cells : Vector2[] = [];
        for(let x : number = 0; x < GRID_SIZE; ++x) {
            for(let y : number = 0; y < GRID_SIZE; ++y) {
                if(this.grid[x][y] == symbol) {
                    cells.push(new Vector2(x, y));
                }
            }
        }

        return cells;
    }

    public getEmptyCells() : Vector2[] {
        return this.getCellsWithSymbol(GameSymbol.NONE);
    }

    public getCellsAround(pos : Vector2, i : number = 1, gameSymbol : GameSymbol|null = null) : Vector2[] {
        let minX : number = Math.min(Math.max(pos.getX() - i, 0), GRID_SIZE);
        let maxX : number = Math.min(Math.max(pos.getX() + i, 0), GRID_SIZE);
        let minY : number = Math.min(Math.max(pos.getX() - i, 0), GRID_SIZE);
        let maxY : number = Math.min(Math.max(pos.getX() + i, 0), GRID_SIZE);

        let cells : Vector2[] = [];
        for(let x : number = minX; x <= maxX; ++x) {
            for(let y : number = minY; y <= maxY; ++y) {
                if(gameSymbol === null || this.grid[x][y] == gameSymbol) {
                    cells.push(new Vector2(x, y));
                }
            }
        }

        return cells;
    }

    public findFiveInARow() : GameSymbol {
        let xCells : Vector2[] = this.getCellsWithSymbol(GameSymbol.X);
        let oCells : Vector2[] = this.getCellsWithSymbol(GameSymbol.O);

        function findFiveInARow(cells : Vector2[]) : boolean {
            const directions : Vector2[] = [
                new Vector2(1, 1),
                new Vector2(0, 1),
                new Vector2(1, 0),
                new Vector2(1, -1)
            ];

            function exists(cell : Vector2) {
                for (const c of cells) {
                    if(cell.equals(c)) {
                        return true;
                    }
                }

                return false;
            }

            for(const direction of directions) {
                for(const cell of cells) {
                    let row : number = 0;
                    let nextVector : Vector2;
                    for(let i : number = 1 + (-GRID_SIZE); i < GRID_SIZE; ++i) {
                        nextVector = cell.addVector(direction.multiply(i));
                        if(nextVector.isOutOfBounds()) {
                            continue;
                        }

                        if(exists(nextVector)) {
                            row++;
                        } else {
                            row = 0;
                        }

                        if(row === 5) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        if(findFiveInARow(xCells)) {
            return GameSymbol.X;
        } else if(findFiveInARow(oCells)) {
            return GameSymbol.O;
        }

        return GameSymbol.NONE;
    }

    public addSymbol(pos : Vector2, symbol : GameSymbol) : void {
        this.grid[pos.getX()][pos.getY()] = symbol;
    }

    public getSymbolAt(pos : Vector2) : GameSymbol {
        return this.grid[pos.getX()][pos.getY()];
    }
}

export class GameModel {
    constructor(grid : GameGrid, symbolPlaying : GameSymbol) {

    }
}