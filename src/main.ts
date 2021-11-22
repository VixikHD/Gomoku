import {indexToVector, vectorToIndex} from "./convert";
import {GameGrid, GameSymbol} from "./game-model";
import {Vector2} from "./vector";
import {AIv1} from "./ai";

export const GRID_SIZE : number = 15;

console.log("Starting the application");

let gameGrid : GameGrid = new GameGrid();

let playerSymbol : GameSymbol = GameSymbol.X;
let aiSymbol : GameSymbol = GameSymbol.O;

let playing = true;

// Handling click
$(function () {
    $(".cell").bind("click", function () {
        let element : JQuery = $(this);
        let clickPosition : Vector2 = indexToVector(element.index());

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
function displaySymbol(position : Vector2, symbol : GameSymbol) : void {
    $(".game-grid")
        .children()
        .eq(vectorToIndex(position))
        .addClass(symbol);
}

function saveSymbol(position : Vector2, symbol : GameSymbol) : void {
    gameGrid.addSymbol(position, symbol);
}

// Game stuff
function handleClick(clickPosition : Vector2) : void {
    let aiMove : Vector2 = (new AIv1(gameGrid)).play(aiSymbol);

    displaySymbol(aiMove, aiSymbol);
    saveSymbol(aiMove, aiSymbol);

    if(gameGrid.findFiveInARow() === aiSymbol) {
        playing = false;
        console.log("You lose");
    }
}