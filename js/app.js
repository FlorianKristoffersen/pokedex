

// --- Globale Variablen ---
let offset = 0;
let listing = [];
let activeIndex = 0;

// --- DOM Elemente ---
const grid = document.querySelector("#grid");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const searchForm = document.querySelector("#searchForm");
const overlay = document.querySelector("#overlay");
const modalContent = document.querySelector("#modalContent");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const closeBtn = document.querySelector("#closeBtn");

// --- API Funktionen ---
async function fetchPokemonList(limit, offset) {
  const url = `${CONFIG.API_BASE}/pokemon?limit=${limit}&offset=${offset}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Pokémon list");
  return res.json(); // enthält nur Namen & URLs
}

async function fetchPokemonDetails(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Pokémon details");
  return res.json(); // enthält alle Details eines Pokémon
}
function buildPokemonModel(pokemon, index) {
  const name = toTitle(pokemon.name);
  const image =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  const types = pokemon.types.map((t) => toTitle(t.type.name));
  const bg = colorByType(pokemon.types, CONFIG.TYPE_COLORS);

  return {
    id: pokemon.id,
    name,
    image,
    types,
    bg,
    index,
  };
}

async function fetchPokemonStats(id) {
  const res = await fetch(`${CONFIG.API_BASE}/pokemon/${id}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon stats");
  const data = await res.json();

  const statMap = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed",
  };

  const stats = data.stats.map((s) => ({
    label: statMap[s.stat.name] || s.stat.name,
    value: s.base_stat,
  }));

  return stats;
}
async function searchPokemonByName(query) {
  const noResultsEl = document.querySelector("#noResults");

  try {
    setLoading(true);
    grid.innerHTML = ""; // Vorherige Karten leeren
    noResultsEl.classList.add("hidden"); // Hinweis ausblenden

    const res = await fetch(`${CONFIG.API_BASE}/pokemon?limit=1000`);
    const data = await res.json();

    const matches = data.results.filter(p => p.name.includes(query.toLowerCase()));

    if (matches.length === 0) {
      noResultsEl.innerHTML = `No Pokémon found matching "<strong>${query}</strong>".`;
      noResultsEl.classList.remove("hidden");
      return;
    }

    const details = await Promise.all(matches.map(p => fetchPokemonDetails(p.url)));
    listing = details.map((p, i) => buildPokemonModel(p, i));
    renderCards(listing);
  } catch (err) {
    console.error("Search error:", err);
    noResultsEl.innerHTML = "⚠️ Something went wrong while searching.";
    noResultsEl.classList.remove("hidden");
  } finally {
    setLoading(false);
  }
}



async function loadPokemonBatch() {
  setLoading(true);

  try {
    // 1. Grundliste abrufen
    const listData = await fetchPokemonList(CONFIG.LIMIT, offset);

    // 2. Details für jedes Pokémon laden
    const details = await Promise.all(
      listData.results.map((p) => fetchPokemonDetails(p.url))
    );

    // 3. Modelle aufbauen & speichern
    const models = details.map((p, i) =>
      buildPokemonModel(p, listing.length + i)
    );
    listing = listing.concat(models);

    // 4. Rendern
    renderCards(models);

    // 5. Offset erhöhen
    offset += CONFIG.LIMIT;
  } catch (err) {
    console.error("Error loading Pokémon:", err);
  } finally {
    setLoading(false);
  }
}
function renderCards(pokemonList) {
  const html = pokemonList.map((p) => cardTemplate(p)).join("");
  grid.insertAdjacentHTML("beforeend", html);
}

function openModal(index) {
  activeIndex = index;
  const pokemon = listing[index];
  console.log("Öffne Modal für:", pokemon.name, pokemon.id);

  fetchPokemonStats(pokemon.id)
    .then((stats) => {
      const detailed = { ...pokemon, stats };
      modalContent.innerHTML = modalTemplate(detailed);
      // Dynamische Shine-Farbe setzen
const hero = document.querySelector(".hero");
const mainColor = hero.dataset.color || "#ffffff";

// CSS-Variable setzen, damit CSS darauf zugreifen kann
hero.style.setProperty("--shine-color", mainColor);


      // Animation: anzeigen
      overlay.classList.remove("hidden", "hide");
      overlay.classList.add("show");

      document.body.style.overflow = "hidden";
    })
    .catch((err) => console.error("Error loading modal:", err));
}

function closeModal() {
  overlay.classList.remove("show");
  overlay.classList.add("hide");

  // erst nach der Animation verstecken
  setTimeout(() => {
    overlay.classList.add("hidden");
    overlay.classList.remove("hide");
    document.body.style.overflow = "";
  }, 250); // Dauer der Animation in ms
}


function nextPokemon() {
  if (activeIndex < listing.length - 1) openModal(activeIndex + 1);
}

function prevPokemon() {
  if (activeIndex > 0) openModal(activeIndex - 1);
}
// --- Event Listener ---
function bindEvents() {
  // Karten-Klick öffnet Modal
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const index = Number(card.dataset.index);
    openModal(index);
  });

  // Load More Button
  loadMoreBtn.addEventListener("click", loadPokemonBatch);

  // Modal-Steuerung
  closeBtn.addEventListener("click", closeModal);
  nextBtn.addEventListener("click", nextPokemon);
  prevBtn.addEventListener("click", prevPokemon);

  // Klick auf Overlay schließt Modal
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // --- Live-Suche ---
let searchTimeout;

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();

  // Zu kurze Eingabe → ursprüngliche Liste wiederherstellen
  if (query.length < 3) {
    grid.innerHTML = "";
    listing = [];
    offset = 0;
    loadPokemonBatch();
    return;
  }

  // Kleine Verzögerung, damit nicht bei jedem Tastendruck gesucht wird
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchPokemonByName(query);
  }, 400); // 400ms nach Tippende
});

}

function init() {
  bindEvents();
  loadPokemonBatch(); // erstes Batch direkt laden
}

// Optional: leichte Parallax-Bewegung im Modal
document.addEventListener("mousemove", (e) => {
  const modal = document.querySelector(".modal");
  if (!modal || overlay.classList.contains("hidden")) return;

  const { innerWidth, innerHeight } = window;
  const rotateX = ((e.clientY / innerHeight) - 0.5) * 8; // kippt leicht vertikal
  const rotateY = ((e.clientX / innerWidth) - 0.5) * -8; // kippt leicht horizontal

  modal.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
});

overlay.addEventListener("mouseleave", () => {
  const modal = document.querySelector(".modal");
  if (modal) modal.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
});
