function toTitle(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function setLoading(isLoading) {
  const loader = document.querySelector("#loader");
  const button = document.querySelector("#loadMoreBtn");
  loader.classList.toggle("hidden", !isLoading);
  button.disabled = isLoading;
}

function colorByType(types, colors) {
  const mainType = types[0]?.type?.name || "normal";
  return colors[mainType] || "#2a2a2a";
}
