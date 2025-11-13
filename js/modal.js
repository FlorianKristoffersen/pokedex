// Öffnet das Modal
async function openModal(index) {
  activeIndex = index;
  const pokemon = listing[index];


  try {
    const details = await loadPokemonDetails(pokemon);
    renderModal(details);
    showModal();
    bindModalNavigation();
    updateModalNavigationButtons(); // 🆕 <-- hier einfügen!
  } catch (err) {
    console.error("❌ Fehler beim Öffnen des Modals:", err);
  }
}

async function loadPokemonDetails(pokemon) {
  const stats = await fetchPokemonStats(pokemon.id);
  const extras = await fetchPokemonDetailsExtended(pokemon.id);
  const evolution = await fetchEvolutionChain(pokemon.id);
  return { ...pokemon, stats, ...extras, evolution };
}

function renderModal(pokemon) {
  modalContent.innerHTML = modalTemplate(pokemon);
}

function showModal() {
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function bindModalNavigation() {
  const prevBtn = document.querySelector("#prevBtn");
  const nextBtn = document.querySelector("#nextBtn");
  const closeBtn = document.querySelector("#closeBtn");

  if (prevBtn) prevBtn.addEventListener("click", prevPokemon);
  if (nextBtn) nextBtn.addEventListener("click", nextPokemon);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
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
