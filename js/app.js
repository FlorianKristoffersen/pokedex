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

// Lädt eine neue Gruppe Pokémon und rendert sie
async function loadPokemonBatch() {
  setLoading(true);
  try {
    const listData = await fetchPokemonList(CONFIG.LIMIT, offset);
    const details = await Promise.all(listData.results.map(p => fetchPokemonDetails(p.url)));
    const models = details.map((p, i) => buildPokemonModel(p, listing.length + i));
    listing = [...listing, ...models];
    renderCards(models);
    offset += CONFIG.LIMIT;
  } catch (err) {
    console.error("Error loading Pokémon:", err);
  } finally {
    setLoading(false);
  }
}
function buildPokemonModel(pokemon, index) {
  const name = toTitle(pokemon.name);
  const image = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
  const types = pokemon.types.map(t => toTitle(t.type.name));
  const bg = colorByType(pokemon.types, CONFIG.TYPE_COLORS);
  return { id: pokemon.id, name, image, types, bg, index };
}

// Rendert alle Pokémon-Karten
function renderCards(pokemonList) {
  const html = pokemonList.map(p => cardTemplate(p)).join("");
  grid.insertAdjacentHTML("beforeend", html);
}

// Startet App, lädt erste Pokémon & bindet Events
function init() {
  bindEvents();
  loadPokemonBatch();
  console.log("✅ App wurde gestartet");
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

// Globaler Loader beim Start
window.addEventListener("load", () => {
  const globalLoader = document.querySelector("#globalLoader");
  setTimeout(() => globalLoader.classList.add("hidden"), 1500);
});
