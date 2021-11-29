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

class AIv1 {
	private readonly grid: GameGrid;

	constructor(grid: GameGrid) {
		this.grid = grid;
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
			if(priorities[i] == maxPriority && Math.random() > 0.7) {
				finalPosition = emptyCells[i];
			} else
				if(priorities[i] > maxPriority) {
					maxPriority = priorities[i];
					finalPosition = emptyCells[i];
				}
		}

		return new AIResult(priorities, finalPosition);
	}

	protected prioritizeCells(cells: Vector2[], priorities: number[], symbol: GameSymbol): number[] {
		let grid: GameGrid = this.grid;

		let opponentsSymbol: GameSymbol = symbol == GameSymbol.X ? GameSymbol.O : GameSymbol.X;
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

export class AIv2 extends AIv1 {
	protected prioritizeCells(cells: Vector2[], priorities: number[], symbol: GameSymbol): number[] {
		priorities = super.prioritizeCells(cells, priorities, symbol);

		let gameModel: GameModel = new GameModel(this.getGrid(), opponentSymbol(symbol));

		let threeInRow: SymbolRow[] = gameModel.getOpenThreeInRow();
		for(const row of threeInRow) {
			priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += 9;
			priorities[findIndex(row.row[2].addVector(row.direction), cells)] += 9;
		}

		let fourInRow: SymbolRow[] = gameModel.getClosedFourInRow();
		for(const row of fourInRow) {
			if((!row.row[0].subtractVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[0].subtractVector(row.direction)) == GameSymbol.NONE) {
				priorities[findIndex(row.row[0].subtractVector(row.direction), cells)] += 100;
			} else
				if((!row.row[0].addVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[0].addVector(row.direction)) == GameSymbol.NONE) {
					priorities[findIndex(row.row[0].addVector(row.direction), cells)] += 100;
				} else
					if((!row.row[3].subtractVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[3].subtractVector(row.direction)) == GameSymbol.NONE) {
						priorities[findIndex(row.row[3].subtractVector(row.direction), cells)] += 100;
					} else
						if((!row.row[3].addVector(row.direction).isOutOfBounds()) && this.getGrid().getSymbolAt(row.row[3].addVector(row.direction)) == GameSymbol.NONE) {
							priorities[findIndex(row.row[3].addVector(row.direction), cells)] += 100;
						}
		}


		return priorities;
	}
}