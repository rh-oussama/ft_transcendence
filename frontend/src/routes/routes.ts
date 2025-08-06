import { Component } from '../types/schemas.js';
import { Home } from '../pages/Home.js';
import { error404 } from '../pages/404.js';
import { Game } from '../pages/Game.js';
import { SelectGameMode } from '../pages/SelectGameMode.js';

export type Route = {
  path: string;
  component: Component;
};

export const routes: Route[] = [
  { 
    path: "/", 
    component: Home
  },
  { 
    path: "/select-mode", 
    component: SelectGameMode
  },
  { 
    path: "/game", 
    component: Game
  },
  { 
    path: "/404", 
    component: error404
  }
];