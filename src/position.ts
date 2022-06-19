import { Game } from "./game.ts";

export class Position {
  readonly game: Game;
  readonly x: number;
  readonly y: number;

  constructor(game: Game, x: number, y: number) {
    this.game = game;
    this.x = x;
    this.y = y;
  }

  static fromTile(game: Game, tile: number) {
    return new Position(game, tile % 8, Math.floor(tile / 8));
  }

  get tile() {
    return this.y * 8 + this.x;
  }

  move(dx: number, dy: number) {
    return new Position(this.game, this.x + dx, this.y + dy);
  }

  getPiece() {
    return this.game.pieces.find((p) => p.tile === this.tile);
  }

  getColor() {
    return this.getPiece()?.color;
  }

  isValid() {
    return this.x >= 0 && this.x < 8 && this.y >= 0 && this.y < 8;
  }

  isEmpty() {
    return !this.getPiece();
  }

  isFriend() {
    return this.game.color === this.getPiece()?.color;
  }

  isEnemy() {
    return !this.isEmpty() && !this.isFriend();
  }
}
