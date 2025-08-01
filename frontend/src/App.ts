import { renderRoute } from "./routes/router.js";


// Handle browser navigation click on link
document.addEventListener("click", (e: MouseEvent) => {
  console.log("enter click event");
  const target = e.target as HTMLAnchorElement;
  if (target.tagName === "A" && target.href.startsWith(window.location.origin)) {
    e.preventDefault();
    window.history.pushState({}, "", target.pathname);
    renderRoute(target.pathname);
  }
});

// Handle browser navigation (back/forward)
window.addEventListener("popstate", () => {
  console.log("enter back forward");
  renderRoute(window.location.pathname);
});

// On first load
document.addEventListener("DOMContentLoaded", () => {
  console.log("enter first load");
  renderRoute(window.location.pathname);
});

