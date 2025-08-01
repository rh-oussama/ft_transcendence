import { routes} from "./routes.js";


function findRoute(path: string) {
  return routes.find((route) => route.path === path) || routes.find((route) => route.path === "/404");
}

export function renderRoute(path: string) {
  const route = findRoute(path);
  const app = document.getElementById("app");
  if (app && route) {
    app.innerHTML = route.render();
  }
}