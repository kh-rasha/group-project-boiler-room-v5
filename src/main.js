import './styles/desktopStyle.css';
import './styles/mobileStyle.css';


import { renderRoute } from "./router.js";

function initMobileMenu() {
  const topNav = document.querySelector(".top-nav");
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const overlay = document.querySelector(".menu-overlay"); // <-- NY

  if (!topNav || !menuBtn || !navLinks) return;

function setMenu(open) {
  topNav.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Stäng meny" : "Öppna meny");

  if (overlay) {
    overlay.classList.toggle("is-open", open);
    overlay.hidden = !open;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && topNav.classList.contains("is-open")) {
    setMenu(false);
    menuBtn.focus();
  }
});

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(!topNav.classList.contains("is-open"));
  });

  // Klick på overlay stänger (om overlay finns)
  overlay?.addEventListener("click", () => setMenu(false));


  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });
}

initMobileMenu();

renderRoute();
window.addEventListener("hashchange", renderRoute);