import { setupFavoritesUI, syncFavoritesUI } from "../features/favorites/favoritesUI.js";
import { HOUSE_IMAGES } from "../utils/houseImages.js";

const HP_API = "https://hp-api.onrender.com/api";
const POTTER_DB = "https://api.potterdb.com/v1";

export async function renderDetail(appEl) {
  const { type, id } = getParams();

  if (!type || !id) {
    appEl.innerHTML = `<p>Missing parameters</p>`;
    return;
  }

  appEl.innerHTML = layout(`<p>Loading...</p>`);

  try {
    const data = await getDetailData(type, id);

    if (!data) throw new Error("Not found");

    appEl.innerHTML = layout(renderDetailCard(data, type, id));

    setupFavoritesUI(appEl);
    syncFavoritesUI(appEl);

  } catch (err) {
    console.error(err);
    appEl.innerHTML = layout(`
      <h1>Failed to load</h1>
      <a href="#/home" class="section-link">← Back</a>
    `);
  }
}
async function getDetailData(type, id) {
  const wanted = decodeURIComponent(id);

  if (type === "characters") {
    const list = await fetchJson(`${HP_API}/characters`);
    const item = list.find(c =>
      String(c.id || "") === wanted ||
      String(c.name || "") === wanted
    );

    if (!item) return null;

    return {
      title: item.name,
      //subtitle: [item.house, item.species].filter(Boolean).join(" • "),
      img: item.image,
      subtitle: item.actor ? `Played by actor: ${item.actor}` : "",
      fields: [
        ["House:", item.house],
        ["Species:", item.species],
        ["Gender:", item.gender],
        ["Ancestry:", item.ancestry], 
        ["Patronus:", item.patronus],
      ]
    };
  }

  if (type === "spells") {
    const list = await fetchJson(`${HP_API}/spells`);
    const item = list.find(s =>
      String(s.id || "") === wanted ||
      String(s.name || "") === wanted
    );

    if (!item) return null;

    return {
      title: item.name,
      subtitle: "Spell description:",
      img: null,
      description: item.description,
      fields: []
    };
  }

  if (type === "books") {
    const json = await fetchJson(`${POTTER_DB}/books/${id}`);
    const b = json.data;

    return {
      title: b.attributes.title,
      subtitle: "Book description:",
      img: b.attributes.cover,
      description: b.attributes.summary,
      fields: [
        ["Author:", b.attributes.author],
        ["Release date:", b.attributes.release_date],
      ]
    };
  }

  if (type === "movies") {
    const json = await fetchJson(`${POTTER_DB}/movies/${id}`);
    const m = json.data;

    return {
      title: m.attributes.title,
      subtitle: "Movie description:",
      img: m.attributes.poster,
      description: m.attributes.summary,
      fields: [
        ["Release date:", m.attributes.release_date],
        ["Runtime:", m.attributes.runtime],
      ]
    };
  }

  if (type === "houses") {
    const houseKey = wanted.toLowerCase().trim();
    const members = await fetchJson(`${HP_API}/characters/house/${houseKey}`);

    return {
      title: capitalize(houseKey),
      subtitle: "Hogwarts House",
      img: HOUSE_IMAGES?.[houseKey] || null,
      //description: `Members: ${members.length}`,
      fields: [
        ["Members:", String(members.length)],
        ["Examples:", members.slice(0, 8).map(m => m.name).join(", ")]
      ]
    };
  }

  return null;
}
function renderDetailCard(data, type, id) {
  return `
    <section class="content-card detail">

      <a href="#/home" class="section-link">← Back</a>
    <button
        type="button"
        class="fav-btn fav-btn--detail"
        data-fav-btn
        data-id="${escapeHtml(id)}"
        data-name="${escapeHtml(data.title)}"
        data-type="${escapeHtml(type)}"
        aria-pressed="false"
        aria-label="Toggle favorite"
      >☆</button>

      <div class="detail-head">

        ${
          data.img
            ? `<img class="detail-img" src="${data.img}" alt="${escapeHtml(data.title)}">`
            : `<div class="detail-img detail-img--placeholder"></div>`
        }

        <div>
          <h1>${escapeHtml(data.title)}</h1>
          ${data.subtitle ? `<p class="detail-subtitle">${escapeHtml(data.subtitle)}</p>` : ""}
        </div>
      </div>

      ${data.description ? `<p class="detail-desc">${escapeHtml(data.description)}</p>` : ""}

      ${
        data.fields?.length
          ? `<dl class="detail-dl">
              ${data.fields
                .filter(([_, value]) => value)
                .map(([label, value]) => `
                  <div class="detail-row">
                    <dt>${escapeHtml(label)}</dt>
                    <dd>${escapeHtml(value)}</dd>
                  </div>
                `).join("")}
            </dl>`
          : ""
      }

    </section>
  `;
}
function layout(inner) {
  return `
    <section class="layout">
      <div class="main-col">
        ${inner}
      </div>
    </section>
  `;
}
function getParams() {
  const hash = window.location.hash || "";
  const queryIndex = hash.indexOf("?");
  const query = queryIndex >= 0 ? hash.slice(queryIndex + 1) : "";
  const params = new URLSearchParams(query);

  return {
    type: params.get("type"),
    id: params.get("id"),
  };
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP error");
  return res.json();
}

function capitalize(s) {
  const str = String(s);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}