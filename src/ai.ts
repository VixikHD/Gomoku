import {GameGrid, GameModel, GameSymbol, opponentSymbol, SymbolRow} from "./game-model";
import {Vector2} from "./vector";

function findIndex(pos: Vector2, arr: Vector2[]): number {
	for(let i: number = 0; i < arr.length; ++i) {
		if(arr[i].equals(pos)) {
			return i;
		}
	}
	return undefined;
}

export class AIResult {
	public constructor(
		public readonly priorities: number[],
		public readonly finalPos: Vector2
	) {
	}
}

/**
 * Totally dumb. Place symbols near the opponents symbols.
 */
class AIv1 {
	protected static SYMBOL_PRIORITY = 1;

	private readonly grid: GameGrid;

	constructor(grid: GameGrid) {
		this.grid = grid;
	}

	protected getSymbolInDirection(row: SymbolRow, index: number = 0, multiplier: number = -1): GameSymbol {
		if(row.row[index] === undefined) {
			return undefined;
		}

		let pos: Vector2 = row.row[index].addVector(row.direction.multiply(multiplier));
		if(pos.isOutOfBounds()) {
			return undefined;
		}

		return this.grid.getSymbolAt(pos);
	}

	protected findSymbolIndexInDirection(row: SymbolRow, cells: Vector2[], index: number = 0, multiplier: number = -1): number {
		if(row.row[index] === undefined) {
			return undefined;
		}

		let pos: Vector2 = row.row[index].addVector(row.direction.multiply(multiplier));
		if(pos.isOutOfBounds()) {
			return undefined;
		}

		return findIndex(pos, cells)
	}

	public play(symbol: GameSymbol): AIResult {
		let emptyCells: Vector2[] = this.grid.getEmptyCells();
		let priorities: number[] = [];
		for(let i: number = 0; i < emptyCells.length; ++i) {
			priorities[i] = 0;
		}

		priorities = this.prioritizeCells(emptyCells, priorities, symbol);

		let maxPriority: number = -1;
		let finalPosition: Vector2;
		for(let i: number = 0; i < priorities.length; ++i) {
			if(priorities[i] === maxPriority && Math.random() > 0.7) {
				finalPosition = emptyCells[i];
			} else
				if(priorities[i] > maxPriority) {
					maxPriority = priorities[i];
					finalPosition = emptyCells[i];
				}
		}

		return new AIResult(priorities, finalPosition);
	}

	/**
	 * Priors cells matching specified ones around specified GameSymbol
	 */
	protected prioritizeCells(cells: Vector2[], priorities: number[], symbol: GameSymbol): number[] {
		let grid: GameGrid = this.grid;

		let opponentsSymbol: GameSymbol = (symbol === GameSymbol.X ? GameSymbol.O : GameSymbol.X);
		let opponentsCells = grid.getCellsWithSymbol(opponentsSymbol);

		opponentsCells.forEach(function (pos: Vector2) {
			grid.getCellsAround(pos, 1).forEach(function (posAround: Vector2) {
				for(let i = 0; i < cells.length; ++i) {
					if(posAround.equals(cells[i])) {
						priorities[i]++;
					}
				}
			})
		});

		return priorities;
	}

	public getGrid(): GameGrid {
		return this.grid;
	}
}

/**
 * Is able to block every simple attack
 */
class AIv2 extends AIv1 {
	protected static OPEN_TWO_ROW_PRIORITY = AIv2.SYMBOL_PRIORITY * 9 + 1;
	protected static CLOSED_THREE_ROW_PRIORITY = AIv2.OPEN_TWO_ROW_PRIORITY;
	protected static OPEN_THREE_ROW_PRIORITY = AIv2.OPEN_TWO_ROW_PRIORITY * 9 + 1;
	protected static HALF_OPEN_FOUR_ROW_PRIORITY = AIv2.OPEN_THREE_ROW_PRIORITY * 9 + 1;

	protected prioritizeCells(cells: Vector2[], priorities: number[], symbol: GameSymbol): number[] {
		priorities = super.prioritizeCells(cells, priorities, symbol);

		let gameModel: GameModel = new GameModel(this.getGrid(), opponentSymbol(symbol));

		// Prioritize 2 & 2 + 1 in row
		let twoPlusOneInRow: SymbolRow[] = gameModel.getTwoInRow();
		let currentPos: Vector2;

		for(const row of twoPlusOneInRow) {
			if(
				this.getGrid().getSymbolAt(currentPos = row.row[0].subtractVector(row.direction)) === GameSymbol.NONE &&
				this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction.multiply(2))) === opponentSymbol(symbol)
			) {
				priorities[findIndex(currentPos, cells)] += AIv2.OPEN_THREE_ROW_PRIORITY;
			}
			if(
				this.getGrid().getSymbolAt(currentPos = row.row[1].addVector(row.direction)) === GameSymbol.NONE &&
				this.getGrid().getSymbolAt(row.row[1].addVector(row.direction.multiply(2))) === opponentSymbol(symbol)
			) {
				priorities[findIndex(currentPos, cells)] += AIv2.OPEN_THREE_ROW_PRIORITY;
			}

			priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv2.OPEN_TWO_ROW_PRIORITY;
			priorities[findIndex(row.row[1].addVector(row.direction), cells)] += AIv2.OPEN_TWO_ROW_PRIORITY;
		}

		// Prioritize open 3 & 3 + 1 in row
		let threeInRow: SymbolRow[] = gameModel.getOpenThreeInRow();
		for(const row of threeInRow) {
			if(
				this.getGrid().getSymbolAt(currentPos = row.row[0].subtractVector(row.direction)) === GameSymbol.NONE &&
				this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction.multiply(2))) === opponentSymbol(symbol)
			) {
				priorities[findIndex(currentPos, cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
			}
			if(
				this.getGrid().getSymbolAt(currentPos = row.row[2].addVector(row.direction)) === GameSymbol.NONE &&
				this.getGrid().getSymbolAt(row.row[2].addVector(row.direction.multiply(2))) === opponentSymbol(symbol)
			) {
				priorities[findIndex(currentPos, cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
			}

			priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv2.OPEN_THREE_ROW_PRIORITY;
			priorities[findIndex(row.row[2].addVector(row.direction), cells)] += AIv2.OPEN_THREE_ROW_PRIORITY;
		}

		// Prioritize closed 3 + 1
		let closedThreeInRow: SymbolRow[] = gameModel.getClosedThreeInRow();
		for(const row of closedThreeInRow) {
			if(
				this.getGrid().getSymbolAt(currentPos = row.row[0].subtractVector(row.direction)) === GameSymbol.NONE &&
				this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction.multiply(2))) === opponentSymbol(symbol)
			) {
				priorities[findIndex(currentPos, cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
			}
			if(
				this.getGrid().getSymbolAt(currentPos = row.row[2].addVector(row.direction)) === GameSymbol.NONE &&
				this.getGrid().getSymbolAt(row.row[2].addVector(row.direction.multiply(2))) === opponentSymbol(symbol)
			) {
				priorities[findIndex(currentPos, cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
			}

			priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv2.CLOSED_THREE_ROW_PRIORITY;
			priorities[findIndex(row.row[2].addVector(row.direction), cells)] += AIv2.CLOSED_THREE_ROW_PRIORITY;
		}

		// Prioritize 4 in row
		let fourInRow: SymbolRow[] = gameModel.getClosedFourInRow();
		for(const row of fourInRow) {
			if((!row.row[0].subtractVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction)) === GameSymbol.NONE) {
				priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
			} else if((!row.row[0].addVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[0].addVector(row.direction)) === GameSymbol.NONE) {
				priorities[findIndex(row.row[0].addVector(row.direction), cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
			} else if((!row.row[3].subtractVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[3].subtractVector(row.direction)) === GameSymbol.NONE) {
				priorities[findIndex(row.row[3].subtractVector(row.direction), cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
			} else if((!row.row[3].addVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[3].addVector(row.direction)) === GameSymbol.NONE) {
				priorities[findIndex(row.row[3].addVector(row.direction), cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
			}
		}

		// 2 + 2
		let twoInRow: SymbolRow[] = gameModel.getTwoInRow().concat(gameModel.getClosedTwoInRow());
		for(const row of twoInRow) {
			if(
				this.getSymbolInDirection(row) === GameSymbol.NONE &&
				this.getSymbolInDirection(row, 0, -2) === opponentSymbol(symbol) &&
				this.getSymbolInDirection(row, 0, -3) === opponentSymbol(symbol)
			) {
				priorities[this.findSymbolIndexInDirection(row, cells)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
			}
			if(
				this.getSymbolInDirection(row, 1, 1) === GameSymbol.NONE &&
				this.getSymbolInDirection(row, 1, 2) === opponentSymbol(symbol) &&
				this.getSymbolInDirection(row, 1, 3) === opponentSymbol(symbol)
			) {
				priorities[this.findSymbolIndexInDirection(row, cells, 1, 1)] += AIv2.HALF_OPEN_FOUR_ROW_PRIORITY;
			}
		}

		return priorities;
	}
}

/**
 * Simple attacks
 */
export class AIv3 extends AIv2 {
	protected static WIN_PRIORITY = 99999999;
	protected static THREE_PROMOTE_PRIORITY = AIv3.OPEN_THREE_ROW_PRIORITY * 3;

	protected prioritizeCells(cells: Vector2[], priorities: number[], symbol: GameSymbol): number[] {
		priorities = super.prioritizeCells(cells, priorities, symbol);

		let gameModel = new GameModel(this.getGrid(), symbol);

		// Finishing four in row
		let fourInRow: SymbolRow[] = gameModel.getOpenFourInRow();
		for(const row of fourInRow) {
			if((!row.row[0].subtractVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction)) === GameSymbol.NONE) {
				priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv3.WIN_PRIORITY;
			}
			if ((!row.row[3].addVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[3].addVector(row.direction)) === GameSymbol.NONE) {
				priorities[findIndex(row.row[3].addVector(row.direction), cells)] += AIv3.WIN_PRIORITY;
			}
		}
		let closedFourInRow: SymbolRow[] = gameModel.getClosedFourInRow();
		for(const row of closedFourInRow) {
			if ((!row.row[0].subtractVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction)) === GameSymbol.NONE) {
				priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv3.WIN_PRIORITY;
			}
			if ((!row.row[3].addVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[3].addVector(row.direction)) === GameSymbol.NONE) {
				priorities[findIndex(row.row[3].addVector(row.direction), cells)] += AIv3.WIN_PRIORITY;
			}
		}

		// Promoting open three
		let threeInRow: SymbolRow[] = gameModel.getOpenThreeInRow();
		for(const row of threeInRow) {
			if ((!row.row[0].subtractVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction)) === GameSymbol.NONE) {
				priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += AIv3.THREE_PROMOTE_PRIORITY;
			}
			if ((!row.row[2].addVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[2].addVector(row.direction)) === GameSymbol.NONE) {
				priorities[findIndex(row.row[2].addVector(row.direction), cells)] += AIv3.THREE_PROMOTE_PRIORITY;
			}
		}

		return priorities;
	}
}