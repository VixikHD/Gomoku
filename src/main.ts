import {indexToVector, vectorToIndex} from "./convert";
import {GameGrid, GameSymbol} from "./game-model";
import {Vector2} from "./vector";
import {AIResult, AIv2} from "./ai";

export const GRID_SIZE: number = 15;
export const IS_DEBUG_ENABLED: boolean = false;

console.log("Starting the application");

let gameGrid: GameGrid = new GameGrid();

let playerSymbol: GameSymbol = GameSymbol.X;
let aiSymbol: GameSymbol = GameSymbol.O;

let playing = true;

// Handling click
$(function () {
	$(".cell").bind("click", function () {
		let element: JQuery = $(this);
		let clickPosition: Vector2 = indexToVector(element.index());

		// We cannot place symbol to cell which already has another one
		if(gameGrid.getSymbolAt(clickPosition) !== GameSymbol.NONE) {
			return;
		}

		if(!playing) {
			return;
		}

		displaySymbol(clickPosition, playerSymbol);
		saveSymbol(clickPosition, playerSymbol);

		if(gameGrid.findFiveInARow() === playerSymbol) {
			playing = false;
			console.log("Congrats! You have won the game!");
			return;
		}

		handleClick(clickPosition);
	});
});

// Display stuff
function displaySymbol(position: Vector2, symbol: GameSymbol): void {
	$(".game-grid")
		.children()
		.eq(vectorToIndex(position))
		.addClass(symbol);
}

function displayPriority(position: Vector2, priority: number) {
	$(".game-grid")
		.children()
		.eq(vectorToIndex(position))
		.text(priority.toString());
}

function saveSymbol(position: Vector2, symbol: GameSymbol): void {
	gameGrid.addSymbol(position, symbol);
}

// Game stuff
function handleClick(clickPosition: Vector2): void {
	let aiResult: AIResult = (new AIv2(gameGrid)).play(aiSymbol);

	displaySymbol(aiResult.finalPos, aiSymbol);
	saveSymbol(aiResult.finalPos, aiSymbol);

	if(IS_DEBUG_ENABLED) {
		let vec: Vector2;
		let i: number = 0;
		for(let x: number = 0; x < GRID_SIZE; ++x) {
			for(let y: number = 0; y < GRID_SIZE; ++y) {
				vec = new Vector2(x, y);
				if(gameGrid.getSymbolAt(vec) === GameSymbol.NONE || vec.equals(aiResult.finalPos)) {
					displayPriority(vec, aiResult.priorities[i++]);
				} else {
					displayPriority(vec, -1);
				}
			}
		}
	}

	if(gameGrid.findFiveInARow() === aiSymbol) {
		playing = false;
		console.log("You lose");
	}
}