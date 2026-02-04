import './styles/style.css';

import { renderRoute } from "./router.js";

renderRoute();
window.addEventListener("hashchange", renderRoute);