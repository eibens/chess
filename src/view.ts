import { Game, Piece } from "./game.ts";

export function create(game: Game): HTMLElement {
  const root = document.createElement("div");
  const board = document.createElement("div");
  root.appendChild(board);
  const tiles = new Array(64).fill(0).map(() => {
    const tile = document.createElement("div");
    board.appendChild(tile);
    return tile;
  });

  // helpers
  function getPieceSymbol(piece: Piece) {
    const name = Object.getPrototypeOf(piece.movement).constructor.name;
    const symbols = {
      Pawn: ["♙", "♟"],
      Rook: ["♖", "♜"],
      Knight: ["♘", "♞"],
      Bishop: ["♗", "♝"],
      Queen: ["♕", "♛"],
      King: ["♔", "♚"],
    };
    const symbol = symbols[name as keyof typeof symbols];
    if (!symbol) throw new Error(`Unknown piece: ${name}`);
    return symbol[piece.color === "white" ? 0 : 1];
  }
  function clear() {
    for (const tile of tiles) {
      tile.innerText = "";
      Object.assign(tile.style, {
        border: "none",
        zIndex: 0,
      });
    }
  }
  function drawPieces() {
    for (const piece of game.pieces) {
      const tile = tiles[piece.tile];
      tile.innerText = getPieceSymbol(piece);
    }
  }
  function drawSelection() {
    if (!game.selectedTile) return;
    Object.assign(tiles[game.selectedTile].style, {
      border: "4px solid blue",
      zIndex: 1,
    });
    for (const tile of game.nextTiles) {
      Object.assign(tiles[tile].style, {
        border: "4px solid green",
        zIndex: 1,
      });
    }
  }

  // container style
  Object.assign(root.style, {
    background: "#ddd",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
  });

  // board style
  Object.assign(board.style, {
    position: "relative",
    width: "800px",
    height: "800px",
  });

  // tiles
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const x = i % 8;
    const y = Math.floor(i / 8);
    const isWhite = (x + y) % 2 === 0;

    // tile style
    Object.assign(tile.style, {
      position: "absolute",
      left: `${x * 100}px`,
      top: `${y * 100}px`,
      width: `${100}px`,
      height: `${100}px`,
      background: isWhite ? "#fff" : "#888",
      color: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "50px",
      boxSizing: "border-box",
    });

    // tile event listeners
    tile.addEventListener("click", () => {
      game.pickTile(i);
      clear();
      drawSelection();
      drawPieces();
    });
  }

  // initial board setup
  drawPieces();

  return root;
}
