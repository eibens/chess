import { Game } from "./game.ts";
import { Position } from "./position.ts";

export class Moves {
  private readonly position: Position;
  readonly tiles: number[] = [];

  constructor(game: Game, tile: number) {
    this.position = Position.fromTile(game, tile);
  }

  getColor() {
    return this.position.getColor();
  }

  getRank() {
    return this.position.y;
  }

  move(dx: number, dy: number) {
    const pos = this.position.move(dx, dy);
    if (pos.isValid() && !pos.isFriend()) {
      this.tiles.push(pos.tile);
    }
  }

  take(dx: number, dy: number) {
    const pos = this.position.move(dx, dy);
    if (pos.isEnemy()) {
      this.tiles.push(pos.tile);
    }
  }

  moveLine(dx: number, dy: number, length = Infinity) {
    let pos = this.position;
    while (pos.isValid() && length > 0) {
      pos = pos.move(dx, dy);
      if (!pos.isValid()) break; // stop before out of bounds tile
      if (pos.isFriend()) break; // stop before friend

      this.tiles.push(pos.tile);
      length = length - 1;

      if (pos.isEnemy()) break; // stop after enemy
    }
  }
}
