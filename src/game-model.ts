import {Vector2} from "./vector";
import {GRID_SIZE} from "./main";
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

export function opponentSymbol(symbol: GameSymbol): GameSymbol {
	return symbol === GameSymbol.X ? GameSymbol.O : GameSymbol.X;
}

export class GameGrid {
	private grid: GameSymbol[][] = [];

	constructor() {
		for(let x: number = 0; x < GRID_SIZE; ++x) {
			this.grid[x] = [];
			for(let y: number = 0; y < GRID_SIZE; ++y) {
				this.grid[x][y] = GameSymbol.NONE;
			}
		}
	}

	public getCellsWithSymbol(symbol: GameSymbol): Vector2[] {
		let cells: Vector2[] = [];
		for(let x: number = 0; x < GRID_SIZE; ++x) {
			for(let y: number = 0; y < GRID_SIZE; ++y) {
				if(this.grid[x][y] == symbol) {
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
		for(let x: number = minX; x <= maxX; ++x) {
			for(let y: number = minY; y <= maxY; ++y) {
				if(gameSymbol === null || this.grid[x][y] === gameSymbol) {
					cells.push(new Vector2(x, y));
				}
			}
		}

		return cells;
	}

	public findFiveInARow(): GameSymbol {
		let gameModel: GameModel;
		gameModel = new GameModel(this, GameSymbol.X);
		if(gameModel.getFiveInRow().length !== 0) {
			return GameSymbol.X;
		}

		gameModel = new GameModel(this, GameSymbol.O);
		if(gameModel.getFiveInRow().length !== 0) {
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
	public readonly row: Vector2[];
	public readonly direction: Vector2;

	public constructor(row: Vector2[], direction: Vector2) {
		this.row = row;
		this.direction = direction;
	}
}

class SymbolCollection {
	private symbols: Vector2[] = [];

	public addSymbol(symbol: Vector2): void {
		for(const addedSymbol of this.symbols) {
			if(addedSymbol.equals(symbol)) {
				return;
			}
		}
		this.symbols.push(symbol);
	}

	public toSymbolRow(direction: Vector2): SymbolRow {
		return new SymbolRow(cloneObjectArray(this.symbols), direction);
	}

	public length(): number {
		return this.symbols.length;
	}
}

export class GameModel {
	private readonly grid: GameGrid;
	private readonly symbol: GameSymbol;

	// 2
	private openTwoInRow: SymbolRow[] = [];
	private closedTwoInRow: SymbolRow[] = [];
	// 3
	private openThreeInRow: SymbolRow[] = [];
	private closedThreeInRow: SymbolRow[] = [];
	// 4
	private openFourInRow: SymbolRow[] = [];
	private closedFourInRow: SymbolRow[] = [];
	// 5
	private fiveInRow: SymbolRow[] = [];

	public constructor(grid: GameGrid, symbol: GameSymbol) {
		this.grid = grid;
		this.symbol = symbol;

		this.analyseGrid();
	}

	private static canSaveRow(rows: SymbolRow[], row: SymbolRow): boolean {
		firstLoop:
			for(const current of rows) {
				if(row.row.length != current.row.length) {
					continue;
				}

				for(let i: number = 0; i < current.row.length; ++i) {
					if(!current.row[i].equals(row.row[i])) {
						continue firstLoop;
					}
				}

				return false;
			}
		return true;
	}

	private analyseGrid(): void {
		// \/
		for(let x: number = 0; x < GRID_SIZE; ++x) {
			this.analyseRow(new Vector2(x, 0), new Vector2(0, 1));
		}

		// ->
		for(let y: number = 0; y < GRID_SIZE; ++y) {
			this.analyseRow(new Vector2(0, y), new Vector2(1, 0));
		}

		// _\|
		this.analyseRow(new Vector2(0, 0), new Vector2(1, 1));
		for(let diagonalA: number = 1; diagonalA < GRID_SIZE - 4; ++diagonalA) {
			this.analyseRow(new Vector2(diagonalA, 0), new Vector2(1, 1));
			this.analyseRow(new Vector2(0, diagonalA), new Vector2(1, 1));
		}

		// ˝/|
		this.analyseRow(new Vector2(0, GRID_SIZE - 1), new Vector2(1, -1));
		for(let diagonalB: number = 1; diagonalB < GRID_SIZE - 4; ++diagonalB) {
			this.analyseRow(new Vector2(0, (GRID_SIZE - 1) - diagonalB), new Vector2(1, -1));
			this.analyseRow(new Vector2(diagonalB, GRID_SIZE - 1), new Vector2(1, -1));
		}
	}

	private saveRow(row: SymbolRow, closed: boolean): void {
		switch(row.row.length) {
			case 2:
				if(!closed) {
					this.openTwoInRow.push(row);
				}
				break;
			case 3:
				if(closed) {
					this.closedThreeInRow.push(row);
				} else {
					this.openThreeInRow.push(row);
				}
				break;
			case 4:
				if(closed) {
					this.closedFourInRow.push(row);
				} else {
					this.openFourInRow.push(row);
				}
				break;
			case 5:
				this.fiveInRow.push(row);
		}
	}

	private analyseRow(start: Vector2, direction: Vector2): void {
		let currentRow: SymbolCollection = new SymbolCollection();
		let closed: boolean = true; // Closed because the iteration starts at end of the row

		let lastRow: SymbolCollection = null; // Last row represents last found row when it's not closed

		let nextCell: Vector2;
		let nextSymbol: GameSymbol;
		for(let i: number = 0; i < GRID_SIZE; ++i) {
			nextCell = start.addVector(direction.multiply(i));
			if(nextCell.isOutOfBounds()) {
				break;
			}

			nextSymbol = this.grid.getSymbolAt(nextCell);

			// Saving
			if(nextSymbol !== this.symbol && currentRow.length() !== 0) {
				if(!closed || nextSymbol === GameSymbol.NONE) {
					this.saveRow(currentRow.toSymbolRow(direction), closed || nextSymbol == opponentSymbol(this.symbol));
				}

				if(nextSymbol === GameSymbol.NONE) {
					lastRow = clone(currentRow);
					closed = false;
				} else {
					if(closed) {
						currentRow = new SymbolCollection();
						continue;
					}
					closed = true;
				}

				currentRow = new SymbolCollection();
				continue;
			}

			if(currentRow.length() === 0) {
				if(nextSymbol === opponentSymbol(this.symbol)) {
					closed = true;
					lastRow = null;
				} else {
					if(nextSymbol === GameSymbol.NONE) {
						closed = false;
						lastRow = null;
					} else {
						currentRow.addSymbol(nextCell);
					}
				}
				continue;
			}

			currentRow.addSymbol(nextCell);
		}
	}

	public getTwoInRow(): SymbolRow[] {
		return this.openTwoInRow;
	}

	public getClosedTwoInRow(): SymbolRow[] {
		return this.closedTwoInRow;
	}

	public getOpenThreeInRow(): SymbolRow[] {
		return this.openThreeInRow;
	}

	public getClosedThreeInRow(): SymbolRow[] {
		return this.closedThreeInRow;
	}

	public getOpenFourInRow(): SymbolRow[] {
		return this.openFourInRow;
	}

	public getClosedFourInRow(): SymbolRow[] {
		return this.closedFourInRow;
	}

	public getFiveInRow(): SymbolRow[] {
		return this.fiveInRow;
	}
}