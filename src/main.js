import "./styles/desktopStyle.css";
import "./styles/mobileStyle.css";

import { renderRoute } from "./router.js";

function initMenu() {
  const topNav = document.querySelector(".top-nav");
  const menuBtn = document.querySelector("[aria-controls='primary-nav']");
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

/* ---------- Global Offline Banner ---------- */
let wasOffline = false;
let onlineTimer = null;

function updateOnlineStatus() {
  const banner = document.getElementById("offline-banner");
  if (!banner) return;

  if (!navigator.onLine) {
    clearTimeout(onlineTimer);
    wasOffline = true;
    banner.hidden = false;
    banner.textContent = "⚠ You are offline. Some content may not be available.";
  } else {
    if (!wasOffline) return;
    wasOffline = false;
    banner.hidden = false;
    banner.textContent = "✓ You are back online!";

    onlineTimer = setTimeout(() => {
      banner.hidden = true;
    }, 3000);
  }
}

/* ---------- Dark/Light Mode ---------- */
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const saved = localStorage.getItem("theme") || "light";
  setTheme(saved);

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });
}

function setTheme(theme) {
  const btn = document.getElementById("theme-toggle");
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  if (btn) {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}

/* ---------- Routing ---------- */
function boot() {
  renderRoute();

  const topNav = document.querySelector(".top-nav");
  const menuBtn = document.querySelector("[aria-controls='primary-nav']");
  if (topNav && menuBtn) {
    topNav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Öppna meny");
  }
}

/* ---------- Start ---------- */
initMenu();
initTheme();
boot();


window.addEventListener("hashchange", boot);

setTimeout(() => {
  window.addEventListener("online", () => {
    if (performance.now() < 2000) return;
    updateOnlineStatus();
  });
  window.addEventListener("offline", updateOnlineStatus);
}, 500);


const splash = document.getElementById('splash-screen');

if (sessionStorage.getItem('splashPlayed')) {
  splash.style.display = 'none';
  document.documentElement.style.visibility = '';
} else {
  // Dölj main-innehållet först
  document.getElementById('main').style.opacity = '0';
  document.querySelector('.site-header').style.opacity = '0';

  setTimeout(() => {
    splash.style.transition = 'opacity 1.2s ease-in-out';
    splash.style.opacity = '0';

    setTimeout(() => {
      splash.remove();
      sessionStorage.setItem('splashPlayed', 'true');

      // Avslöja sidan med magisk effekt
      document.getElementById('main').style.transition = 'opacity 1.5s ease-in, filter 1.5s ease-in';
      document.getElementById('main').style.filter = 'blur(8px) brightness(2)';
      document.querySelector('.site-header').style.transition = 'opacity 1.5s ease-in, filter 1.5s ease-in';
      document.querySelector('.site-header').style.filter = 'blur(8px) brightness(2)';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById('main').style.opacity = '1';
          document.getElementById('main').style.filter = 'blur(0px) brightness(1)';
          document.querySelector('.site-header').style.opacity = '1';
          document.querySelector('.site-header').style.filter = 'blur(0px) brightness(1)';
        });
      });

    }, 1200);
  }, 2500);
}