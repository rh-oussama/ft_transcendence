import { Component } from '../types/schemas.js';
import { HomePage } from '../pages/Home.js';
import { error404Page } from '../pages/404.js';
import { GamePage } from '../pages/Game.js';
import { SelectGameModePage } from '../pages/SelectGameMode.js';

export type Route = {
  path: string;
  component: Component;
};

export const routes: Route[] = [
  { 
    path: "/", 
    component: HomePage
  },
  { 
    path: "/select-mode", 
    component: SelectGameModePage
  },
  { 
    path: "/game", 
    component: GamePage
  },
  { 
    path: "/404", 
    component: error404Page
  }
];