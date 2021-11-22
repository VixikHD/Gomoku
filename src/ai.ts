import {GameGrid, GameSymbol} from "./game-model";
import {Vector2} from "./vector";

export class AIv1 {
    private readonly grid : GameGrid;

    constructor(grid : GameGrid) {
        this.grid = grid;
    }

    public play(symbol : GameSymbol) : Vector2 {
        let emptyCells : Vector2[] = this.grid.getEmptyCells();
        let priorities : number[] = [];
        for(let i : number = 0; i < emptyCells.length; ++i) {
            priorities[i] = 0;
        }

        priorities = this.prioritizeCells(emptyCells, priorities, symbol);

        let maxPriority : number = -1;
        let finalPosition : Vector2;
        for(let i : number = 0; i < priorities.length; ++i) {
            if(priorities[i] == maxPriority && Math.random() > 0.7) {
                finalPosition = emptyCells[i];
            } else if(priorities[i] > maxPriority) {
                maxPriority = priorities[i];
                finalPosition = emptyCells[i];
            }
        }

        return finalPosition;
    }

    protected prioritizeCells(cells : Vector2[], priorities : number[], symbol : GameSymbol) : number[] {
        let grid : GameGrid = this.grid;

        let opponentsSymbol : GameSymbol = symbol == GameSymbol.X ? GameSymbol.O : GameSymbol.X;
        let opponentsCells = grid.getCellsWithSymbol(opponentsSymbol);

        opponentsCells.forEach(function(pos: Vector2) {
            grid.getCellsAround(pos, 1).forEach(function (posAround : Vector2) {
                for(let i = 0; i < cells.length; ++i) {
                    if(posAround.equals(cells[i])) {
                        priorities[i]++;
                    }
                }
            })
        });

        return priorities;
    }

    public getGrid() : GameGrid {
        return this.grid;
    }
}