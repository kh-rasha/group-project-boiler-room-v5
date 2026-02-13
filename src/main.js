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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker registered");
    } catch (err) {
      console.warn("Service worker registration failed", err);
    }
  });
}

/* ---------- Global Offline Banner ---------- */
function updateOnlineStatus() {
  const banner = document.getElementById("offline-banner");
  if (!banner) return;

  if (!navigator.onLine) {
    banner.hidden = false;
  } else {
    banner.hidden = true;
  }
}



function boot() {
  renderRoute();
  initMenu(); // ✅ re-bind menu if DOM changed
}

boot();
updateOnlineStatus();

window.addEventListener("hashchange", boot);
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
