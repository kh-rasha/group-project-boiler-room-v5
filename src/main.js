import "./styles/desktopStyle.css";
import "./styles/mobileStyle.css";

import { renderRoute } from "./router.js";

function initMenu() {
  const topNav  = document.querySelector(".top-nav");
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && topNav.classList.contains("is-open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("click", (e) => {
    if (topNav.classList.contains("is-open") && !topNav.contains(e.target)) {
      setMenu(false);
    }
  });
}

/* ---------- Service Worker ---------- */
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker registered");
    } catch (err) {
      console.warn("Service worker registration failed", err);
    }
  });
}

/* ---------- Offline Banner ---------- */
function updateOnlineStatus() {
  const banner = document.getElementById("offline-banner");
  if (!banner) return;
  banner.hidden = navigator.onLine;
}

/* ---------- Routing – körs vid varje vy-byte ---------- */
function boot() {
  renderRoute();

  // Stäng menyn när man navigerar till ny vy
  const topNav  = document.querySelector(".top-nav");
  const menuBtn = document.querySelector(".menu-btn");
  if (topNav && menuBtn) {
    topNav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Öppna meny");
  }
}

/* ---------- Start ---------- */
initMenu();   // ← en gång, här
boot();       // ← renderar första vyn
updateOnlineStatus();

window.addEventListener("hashchange", boot);   // boot (ej initMenu) vid navigation
window.addEventListener("online",  updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);