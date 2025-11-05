// templates.js
// Liefert HTML-Strings, die dynamisch in den DOM eingefügt werden

const cardTemplate = (pokemon) => `
  <article class="card" data-id="${pokemon.id}" data-index="${pokemon.index}">
    <div class="card__top" style="background:${pokemon.bg}">
      <img class="card__img" src="${pokemon.image}" alt="${pokemon.name}" />
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

const modalTemplate = (pokemon) => `
  <div class="hero" style="background:${pokemon.bg}" data-color="${pokemon.bg}">
    <div class="hero-img">
    <img class="card__img" src="${pokemon.image}" alt="${pokemon.name}" />
    </div>
    </div>
<div class="content">
    <h2>#${pokemon.id} ${pokemon.name}</h2>
    <div class="badges">
      ${pokemon.types.map(t => `<span class="badge">${t}</span>`).join("")}
    </div>
    <section class="stats">
      ${pokemon.stats.map(s => `
        <div class="row">
          <strong>${s.label}</strong>
          <span>${s.value}</span>
        </div>`).join("")}
    </section>
  </div>
`;
