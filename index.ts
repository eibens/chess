import * as View from "./src/view.ts";
import { Game } from "./src/game.ts";

const game = new Game();
const view = View.create(game);
document.body.appendChild(view);
