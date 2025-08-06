import { routes, Route } from "./routes.js";


let currentRoute: Route | null = null;

function findRoute(path: string) {
  return routes.find((route) => route.path === path) || 
         routes.find((route) => route.path === "/404")!;
}


export function renderRoute(path: string): void {
  if (currentRoute?.component.cleanup) {
    currentRoute.component.cleanup();
  }

  const newRoute = findRoute(path);
  currentRoute = newRoute;

  const app = document.getElementById("app");
  if (!app) return;

  try {
    app.innerHTML = newRoute.component.render();
    if (newRoute.component.init) {
      newRoute.component.init();
    }
  } catch (error) {
    console.error(`Error rendering route ${path}:`, error);
    if (path !== "/404") {
      renderRoute("/404");
    }
  }
}