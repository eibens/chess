import { Moves } from "./moves.ts";

const knightMoves = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];

const straightMoves = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
];

const diagonalMoves = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

const starMoves = [
  ...straightMoves,
  ...diagonalMoves,
];

type Color =
  | "white"
  | "black";

abstract class Movement {
  abstract getMoves(moves: Moves): void;
}

class Pawn extends Movement {
  getMoves(moves: Moves) {
    const color = moves.getColor();
    const rank = moves.getRank();
    const direction = color === "white" ? -1 : 1;
    const isInitialWhite = color === "white" && rank === 6;
    const isInitialBlack = color === "black" && rank === 1;
    const isInitial = isInitialWhite || isInitialBlack;
    const distance = isInitial ? 2 : 1;

    moves.moveLine(0, direction, distance);
    moves.take(1, direction);
    moves.take(-1, direction);
  }
}

class Knight extends Movement {
  getMoves(moves: Moves) {
    for (const [dx, dy] of knightMoves) {
      moves.move(dx, dy);
    }
  }
}

class Rook extends Movement {
  getMoves(moves: Moves) {
    for (const [dx, dy] of straightMoves) {
      moves.moveLine(dx, dy);
    }
  }
}

class Bishop extends Movement {
  getMoves(moves: Moves) {
    for (const [dx, dy] of diagonalMoves) {
      moves.moveLine(dx, dy);
    }
  }
}

class Queen extends Movement {
  getMoves(moves: Moves) {
    for (const [dx, dy] of starMoves) {
      moves.moveLine(dx, dy);
    }
  }
}

class King extends Movement {
  getMoves(moves: Moves) {
    for (const [dx, dy] of starMoves) {
      moves.moveLine(dx, dy, 1);
    }
  }
}

export class Piece {
  movement: Movement;
  color: Color;
  tile: number;

  constructor(color: Color, tile: number, movement: Movement) {
    this.color = color;
    this.tile = tile;
    this.movement = movement;
  }
}

export class Game {
  selectedTile?: number;
  nextTiles: number[] = [];
  color: Color = "white";
  pieces: Piece[] = [
    // black pieces
    new Piece("black", 0, new Rook()),
    new Piece("black", 1, new Knight()),
    new Piece("black", 2, new Bishop()),
    new Piece("black", 3, new Queen()),
    new Piece("black", 4, new King()),
    new Piece("black", 5, new Bishop()),
    new Piece("black", 6, new Knight()),
    new Piece("black", 7, new Rook()),

    // black pawns
    new Piece("black", 8, new Pawn()),
    new Piece("black", 9, new Pawn()),
    new Piece("black", 10, new Pawn()),
    new Piece("black", 11, new Pawn()),
    new Piece("black", 12, new Pawn()),
    new Piece("black", 13, new Pawn()),
    new Piece("black", 14, new Pawn()),
    new Piece("black", 15, new Pawn()),

    // white pawns
    new Piece("white", 48, new Pawn()),
    new Piece("white", 49, new Pawn()),
    new Piece("white", 50, new Pawn()),
    new Piece("white", 51, new Pawn()),
    new Piece("white", 52, new Pawn()),
    new Piece("white", 53, new Pawn()),
    new Piece("white", 54, new Pawn()),
    new Piece("white", 55, new Pawn()),

    // white pieces
    new Piece("white", 56, new Rook()),
    new Piece("white", 57, new Knight()),
    new Piece("white", 58, new Bishop()),
    new Piece("white", 59, new Queen()),
    new Piece("white", 60, new King()),
    new Piece("white", 61, new Bishop()),
    new Piece("white", 62, new Knight()),
    new Piece("white", 63, new Rook()),
  ];

  pickTile(tile: number) {
    // toggle selection when selecting same tile twice
    if (tile === this.selectedTile) {
      this.selectedTile = undefined;
      return;
    }

    // move selection to (another) friendly piece
    const targetPiece = this.pieces.find((piece) => piece.tile === tile);
    const targetIsFriendly = targetPiece && targetPiece.color === this.color;
    if (targetIsFriendly) {
      const moves = new Moves(this, tile);
      targetPiece.movement.getMoves(moves);
      this.selectedTile = tile;
      this.nextTiles = moves.tiles;
      return;
    }

    // find the current selected piece
    // if none is selected, do nothing
    const piece = this.pieces.find((p) => p.tile === this.selectedTile);
    if (!piece) return;

    // check tile is reachable for piece
    if (!this.nextTiles.includes(tile)) return;

    // update game state
    piece.tile = tile;
    this.pieces = this.pieces.filter((p) => p !== targetPiece);
    this.selectedTile = undefined;
    this.color = this.color === "white" ? "black" : "white";
  }
}
