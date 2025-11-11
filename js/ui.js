function renderCards(pokemonList) {
  const html = pokemonList.map(p => cardTemplate(p)).join("");
  grid.insertAdjacentHTML("beforeend", html);
}
function toggleGlobalLoader(show) {
  const loader = document.querySelector("#globalLoader");
  loader.classList.toggle("hidden", !show);
}
window.addEventListener("load", () => {
  toggleGlobalLoader(true);
  setTimeout(() => toggleGlobalLoader(false), 1500);
});

function setLoading(isLoading) {
  const loader = document.querySelector("#loader");
  const button = document.querySelector("#loadMoreBtn");
  loader.classList.toggle("hidden", !isLoading);
  button.disabled = isLoading;
}

function adjustFooterSpacing() {
  const loadMore = document.querySelector(".load-more");
  const footer = document.querySelector("footer");
  if (loadMore.style.display === "none") {
    footer.style.marginTop = "80px";
  } else {
    footer.style.marginTop = "0";
  }
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
  if (modal) modal.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
});
