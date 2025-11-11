// Öffnet das Modal beim Klick auf eine Karte
function bindCardClick() {
  grid.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (!card) return;
    const index = Number(card.dataset.index);
    openModal(index);
  });
}

function bindLoadMore() {
  loadMoreBtn.addEventListener("click", loadPokemonBatch);
}

function bindCloseModal() {
  closeBtn.addEventListener("click", closeModal);
}

function bindOverlayClose() {
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeModal();
  });
}

function bindLiveSearch() {
  let searchTimeout;

  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query === "") {
      await resetSearchToAllPokemon();
      return;
    }
    if (query.length < 3) {
      resetToDefaultState();
      return;
    }
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchPokemonByName(query);
    }, 400);
  });
}

function bindSearchSubmit() {
  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    if (query.length >= 3) searchPokemonByName(query);
  });
}

async function resetToDefaultState() {
  const footer = document.querySelector("footer");
  const noResults = document.querySelector("#noResults");
  const loadMore = document.querySelector(".load-more");

  grid.innerHTML = "";
  listing = [];
  offset = 0;

  footer.classList.remove("footer-fixed");
  document.body.classList.remove("search-active");
  noResults.classList.add("hidden");
  loadMore.style.display = "flex";

  setLoading(true);
  await loadPokemonBatch();
  setLoading(false);
}

// Bündelt alle Event-Handler
function bindEvents() {
  bindCardClick();
  bindLoadMore();
  bindCloseModal();
  bindOverlayClose();
  bindLiveSearch();
  bindSearchSubmit();
}
