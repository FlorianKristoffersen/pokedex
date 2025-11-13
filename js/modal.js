let isModalLoading = false;
let modalNavBound = false;

async function openModal(index) {
  if (isModalLoading) return;      
  isModalLoading = true;

  activeIndex = index;
  const pokemon = listing[index];

  try {
    const details = await loadPokemonDetails(pokemon);
    renderModal(details);
    showModal();
    bindModalNavigationOnce();
  } catch (err) {
    console.error("Fehler beim Öffnen:", err);
  }

  isModalLoading = false; 
}

async function loadPokemonDetails(pokemon) {
  const id = pokemon.id;

  if (pokemonCache[id]) {
    return pokemonCache[id];
  }
  const evolution = await fetchEvolutionChain(id);

  const fullData = { ...pokemon, evolution };
  pokemonCache[id] = fullData;

  return fullData;
}


function renderModal(pokemon) {
  modalContent.innerHTML = modalTemplate(pokemon);
}

function showModal() {
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function bindModalNavigationOnce() {
  if (modalNavBound) return;

  document.addEventListener("click", e => {
    if (e.target.id === "prevBtn") prevPokemon();
    if (e.target.id === "nextBtn") nextPokemon();
    if (e.target.id === "closeBtn") closeModal();
  });

  modalNavBound = true;
}

function updateModalNavigationButtons() {
  const prevBtn = document.querySelector("#prevBtn");
  const nextBtn = document.querySelector("#nextBtn");
  if (!prevBtn || !nextBtn) return;

  prevBtn.style.display = "flex";
  nextBtn.style.display = "flex";

  if (activeIndex === 0) {
    prevBtn.style.display = "none";
  }

  if (activeIndex === listing.length - 1) {
    nextBtn.style.display = "none";
  }
}

function closeModal() {
  overlay.classList.remove("show");
  overlay.classList.add("hide");

  setTimeout(() => {
    overlay.classList.add("hidden");
    overlay.classList.remove("hide");
    document.body.style.overflow = "";
  }, 250);
}

function nextPokemon() {
  if (activeIndex < listing.length - 1) {
    openModal(activeIndex + 1);
  }
}

function prevPokemon() {
  if (activeIndex > 0) {
    openModal(activeIndex - 1);
  }
}
