import * as gomoku from "./main"
import {Vector2} from "./vector";

export function coordsToIndex(x: number, y: number): number {
	return y * gomoku.GRID_SIZE + x;
}

function getIndexX(index: number): number {
	return index % gomoku.GRID_SIZE;
}

function getIndexY(index: number): number {
	return Math.floor(index / gomoku.GRID_SIZE);
}

export function vectorToIndex(vec: Vector2): number {
	return coordsToIndex(vec.getX(), vec.getY());
}

export function indexToVector(index: number): Vector2 {
	return new Vector2(getIndexX(index), getIndexY(index));
}