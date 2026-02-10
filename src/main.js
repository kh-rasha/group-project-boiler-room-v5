import "./styles/desktopStyle.css";
import "./styles/mobileStyle.css";

import { renderRoute } from "./router.js";

function initMenu() {
  const topNav = document.querySelector(".top-nav");
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (!topNav || !menuBtn || !navLinks) return;

  function setMenu(open) {
    topNav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Stäng meny" : "Öppna meny");
  }

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(!topNav.classList.contains("is-open"));
  });

  // ESC stänger om menyn är öppen
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && topNav.classList.contains("is-open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  // Klick på länk stänger
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });

  // Klick utanför stänger (bra för dropdown)
  document.addEventListener("click", (e) => {
    if (topNav.classList.contains("is-open") && !topNav.contains(e.target)) {
      setMenu(false);
    }
  });
}

initMenu();

renderRoute();
window.addEventListener("hashchange", renderRoute);
