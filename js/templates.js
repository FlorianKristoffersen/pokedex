function cardTemplate(pokemon) {
  return `
    <article class="card" data-id="${pokemon.id}" data-index="${pokemon.index}">
      <div class="card__top" style="background:${pokemon.bg}">
        <img class="card__img" src="${pokemon.image}" alt="${pokemon.name}">
      </div>
      <div class="card__body">
        <div class="card__title">
          <span>#${pokemon.id}</span>
          <span>${pokemon.name}</span>
        </div>
        <div class="badges">
          ${pokemon.types.map(t => `<span class="badge">${t}</span>`).join("")}
        </div>
      </div>
    </article>
  `;
}
function modalTemplate(pokemon) {
  return `
    <div class="hero" style="background:${pokemon.bg}">
      <img class="card__img" src="${pokemon.image}" alt="${pokemon.name}">
    </div>

    <div class="content">
      <div class="modal-header">
        <button id="prevBtn" class="nav prev">‹</button>
        <h2 class="pokemon-name">#${pokemon.id} ${pokemon.name}</h2>
        <button id="nextBtn" class="nav next">›</button>
      </div>

      <div class="badges">
        ${pokemon.types.map(t => `<span class="badge">${t}</span>`).join("")}
      </div>

      ${pokemon.stats ? renderStats(pokemon.stats) : ""}
      ${renderDetails(pokemon)}
    </div>
  `;
}

function renderStats(stats) {
  return `
    <section class="stats">
      ${stats.map(s => `
        <div class="stat-row">
          <span class="stat-label">${s.label}</span>
          <div class="stat-bar">
            <div class="stat-fill" style="width:${s.value / 2}%;"></div>
          </div>
          <span class="stat-value">${s.value}</span>
        </div>
      `).join("")}
    </section>
  `;
}

function renderDetails(pokemon) {
  return `
    <section class="details">
      <div class="detail-row"><strong>Height:</strong> <span>${pokemon.height} m</span></div>
      <div class="detail-row"><strong>Weight:</strong> <span>${pokemon.weight} kg</span></div>
      <div class="detail-row"><strong>Abilities:</strong> <span>${pokemon.abilities}</span></div>
      <div class="detail-row"><strong>Evolution:</strong> <span>${pokemon.evolution}</span></div>
    </section>
  `;
}
