import './styles/destopStyle.css';
import './styles/mobileStyle.css';


import { renderRoute } from "./router.js";

renderRoute();
window.addEventListener("hashchange", renderRoute);