// Globale Variablen
let offset = 0;
let listing = [];
let activeIndex = 0;

// DOM-Elemente
const grid = document.querySelector("#grid");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const searchInput = document.querySelector("#searchInput");
const searchForm = document.querySelector("#searchForm");
const overlay = document.querySelector("#overlay");
const modalContent = document.querySelector("#modalContent");
const closeBtn = document.querySelector("#closeBtn");

async function loadPokemonBatch() {
  setLoading(true);
  try {
    const listData = await fetchPokemonList(CONFIG.LIMIT, offset);
    const details = await Promise.all(
  listData.results.map((p, i) => fetchPokemonDetails(p.url))
);

details.forEach((p, i) => p.index = listing.length + i);

listing = [...listing, ...details];
renderCards(details);

    offset += CONFIG.LIMIT;
  } catch (err) {
    console.error("Error loading Pokémon:", err);
  } finally {
    setLoading(false);
  }

}

function renderCards(pokemonList) {
  const html = pokemonList.map(p => cardTemplate(p)).join("");
  grid.insertAdjacentHTML("beforeend", html);
}

function init() {
  bindEvents();
  loadPokemonBatch();
}

document.addEventListener("mousemove", e => {
  const modal = document.querySelector(".modal");
  if (!modal || overlay.classList.contains("hidden")) return;
  const { innerWidth, innerHeight } = window;
  const rotateX = ((e.clientY / innerHeight) - 0.5) * 8;
  const rotateY = ((e.clientX / innerWidth) - 0.5) * -8;
  modal.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
});

overlay.addEventListener("mouseleave", () => {
  const modal = document.querySelector(".modal");
  if (modal) modal.style.transform = "rotateX(0) rotateY(0) scale(1)";
});

window.addEventListener("load", () => {
  const globalLoader = document.querySelector("#globalLoader");
  setTimeout(() => globalLoader.classList.add("hidden"), 1500);
});
