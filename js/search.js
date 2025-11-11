async function searchPokemonByName(query) {
  const noResultsEl = document.querySelector("#noResults");
  const loadMoreSection = document.querySelector(".load-more");
  const footer = document.querySelector("footer");

  try {
    setLoading(true);
    resetSearchUI(noResultsEl, loadMoreSection, footer);

    const res = await fetch(`${CONFIG.API_BASE}/pokemon?limit=1000`);
    const data = await res.json();

    const matches = data.results.filter(p =>
      p.name.includes(query.toLowerCase())
    );

    handleSearchResults(matches, query, noResultsEl, loadMoreSection, footer);
  } catch (err) {
    console.error("❌ Fehler bei der Suche:", err);
    showSearchError(noResultsEl, loadMoreSection, footer);
  } finally {
    setLoading(false);
  }
}

function resetSearchUI(noResultsEl, loadMoreSection, footer) {
  grid.innerHTML = "";
  noResultsEl.classList.add("hidden");
  loadMoreSection.style.display = "flex";
  footer.classList.remove("footer-fixed");
}

async function handleSearchResults(matches, query, noResultsEl, loadMore, footer) {
  if (matches.length === 0) {
    showNoResults(query, noResultsEl, loadMore, footer);
    return;
  }

  hideNoResults(noResultsEl, loadMore, footer);

  const details = await Promise.all(matches.map(p => fetchPokemonDetails(p.url)));
  listing = details.map((p, i) => buildPokemonModel(p, i));
  renderCards(listing);
}

function showNoResults(query, el, loadMore, footer) {
  el.innerHTML = `No Pokémon found matching "<strong>${query}</strong>".`;
  el.classList.remove("hidden");
  loadMore.style.display = "none";
  footer.classList.add("footer-fixed");
}

function hideNoResults(el, loadMore, footer) {
  el.classList.add("hidden");
  loadMore.style.display = "none";
  footer.classList.remove("footer-fixed");
  document.body.classList.add("search-active");
}

function showSearchError(el, loadMore, footer) {
  el.innerHTML = "⚠️ Something went wrong while searching.";
  el.classList.remove("hidden");
  loadMore.style.display = "none";
  footer.classList.add("footer-fixed");
}
async function resetSearchToAllPokemon() {
  const footer = document.querySelector("footer");
  const loadMoreSection = document.querySelector(".load-more");
  const noResultsEl = document.querySelector("#noResults");

  grid.innerHTML = "";
  listing = [];
  offset = 0;
  footer.classList.remove("footer-fixed");
  document.body.classList.remove("search-active");
  noResultsEl.classList.add("hidden");
  loadMoreSection.style.display = "flex";

  setLoading(true);
  await loadPokemonBatch();
  setLoading(false);
}
