import {GRID_SIZE} from "./main";

export class Vector2 {
	protected readonly x: number;
	protected readonly y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public add(x: number, y: number): Vector2 {
		return new Vector2(this.x + x, this.y + y);
	}

	public addVector(vec: Vector2): Vector2 {
		return this.add(vec.x, vec.y);
	}

	public subtract(x: number, y: number): Vector2 {
		return this.add(-x, -y);
	}

	public subtractVector(vec: Vector2): Vector2 {
		return this.add(-vec.x, -vec.y);
	}

	public multiply(i: number): Vector2 {
		return new Vector2(this.x * i, this.y * i);
	}

	public divide(i: number): Vector2 {
		return this.multiply(1 / i);
	}

	public equals(vec: Vector2): boolean {
		return this.x === vec.x && this.y === vec.y;
	}

	public isEdgeCell(): boolean {
		return this.x === 0 || this.y === 0 || this.x + 1 === GRID_SIZE || this.y + 1 === GRID_SIZE;
	}

	public isOutOfBounds(): boolean {
		return this.x < 0 || this.x >= GRID_SIZE || this.y < 0 || this.y >= GRID_SIZE;
	}

	public getX(): number {
		return this.x;
	}

	public getY(): number {
		return this.y;
	}
}