export type Route = {
  path: string;
  render: () => string;
};

import { Home } from "../pages/Home.js";
import { error404 } from "../pages/404.js";
// import { Game } from "../pages/Game.js";
// import { Login } from "./pages/Login.js";
// import { Register } from "./pages/Register.js";
// import { Dashboard } from "./components/Dashboard.js";
// import { NewGame } from "./pages/NewGame,js";

export const routes: Route[] = [
  { path: "/", render: Home },
  // { path: "/game", render: Game },
  { path: "/404", render: error404},
];