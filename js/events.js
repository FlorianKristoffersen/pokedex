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
function handleSearchInput(e) {
  const query = normalizeQuery(e.target.value);
  clearTimeout(searchTimeout);

  if (isQueryEmpty(query)) return resetToDefaultState();
  if (isQueryTooShort(query)) return;

  debounceSearch(query);
}

function normalizeQuery(value) {
  return value.trim().toLowerCase();
}

function isQueryEmpty(query) {
  return query.length === 0;
}

function isQueryTooShort(query) {
  return query.length < 3;
}

function debounceSearch(query) {
  searchTimeout = setTimeout(() => {
    validateSearch(query);
  }, 400);
}

function validateSearch(query) {
  const current = normalizeQuery(searchInput.value);

  if (isQueryEmpty(current)) return resetToDefaultState();
  if (isQueryTooShort(current)) return;

  searchPokemonByName(current);
}



function debounceSearch(query) {
  searchTimeout = setTimeout(() => validateSearchBeforeRun(query), 400);
}

function validateSearchBeforeRun(query) {
  const current = searchInput.value.trim().toLowerCase();
  if (current === "") return resetToDefaultState();
  searchPokemonByName(query);
}


function bindLiveSearch() {
  searchInput.addEventListener("input", handleSearchInput);
}

let searchTimeout; 

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
