export type Route = {
  path: string;
  render: () => string;
  init?: () => void;
};

import { Home, initHome } from "../pages/Home.js";
import { error404 } from "../pages/404.js";
import { Game, initGame } from "../pages/Game.js";
import { SelectGameMode, initSelectGameMode } from "../pages/SelectGameMode.js";

export const routes: Route[] = [
  { path: "/", render: Home, init: initHome },
  { path: "/select-mode", render: SelectGameMode, init: initSelectGameMode },
  { path: "/game", render: Game, init: initGame},
  { path: "/404", render: error404 },
];