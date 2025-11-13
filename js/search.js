let allPokemonList = null;

async function fetchAllPokemonNames() {
  if (allPokemonList) return allPokemonList;

  const res = await fetch(`${CONFIG.API_BASE}/pokemon?limit=2000`);
  const data = await res.json();
  allPokemonList = data.results;
  return allPokemonList;
}

let isSearching = false;

async function searchPokemonByName(query) {
  if (isSearching) return;
  isSearching = true;

  prepareSearchUI();

  const matches = await findMatchingPokemon(query);
  if (matches.length === 0) {
    showEmptySearchResult(query);
    isSearching = false;
    return;
  }

  const pokemonDetails = await loadMatchingPokemonDetails(matches);
  updateListingWithResults(pokemonDetails);
  renderCards(listing);

  isSearching = false;
}

function prepareSearchUI() {
  const noResults = document.querySelector("#noResults");
  const loadMore = document.querySelector(".load-more");
  const footer = document.querySelector("footer");

  resetSearchUI(noResults, loadMore, footer);
  showResultsUI(noResults, loadMore, footer);
}

async function findMatchingPokemon(query) {
  const list = await fetchAllPokemonNames();

  return list
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 1000); 
}

function showEmptySearchResult(query) {
  const noResults = document.querySelector("#noResults");
  const loadMore = document.querySelector(".load-more");
  const footer = document.querySelector("footer");

  showNoResults(query, noResults, loadMore, footer);
}

async function loadMatchingPokemonDetails(matches) {
  const details = await Promise.all(
    matches.map(async p => {
      try {
        return await fetchPokemonDetails(p.url);
      } catch (err) {
        console.warn("⚠️ Überspringe fehlerhaftes Pokémon:", p);
        return null;
      }
    })
  );

  return details.filter(d => d !== null);
}

function updateListingWithResults(pokemonDetails) {
  listing = pokemonDetails.map((p, i) => ({
    ...p,
    index: i
  }));
}



function resetSearchUI(noResults, loadMore, footer) {
  grid.innerHTML = "";
  noResults.classList.add("hidden");
  loadMore.style.display = "flex";
  footer.classList.remove("footer-fixed");
}

function showResultsUI(noResults, loadMore, footer) {
  noResults.classList.add("hidden");
  loadMore.style.display = "none";
  footer.classList.remove("footer-fixed");
  document.body.classList.add("search-active");
}

function showNoResults(query, el, loadMore, footer) {
  el.innerHTML = `No Pokémon found matching "<strong>${query}</strong>".`;
  el.classList.remove("hidden");
  loadMore.style.display = "none";
  footer.classList.add("footer-fixed");
}

async function resetSearchToAllPokemon() {
  const footer = document.querySelector("footer");
  const loadMore = document.querySelector(".load-more");
  const noResults = document.querySelector("#noResults");

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
