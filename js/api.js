const pokemonDataCache = {};

async function fetchPokemonData(id) {
  if (pokemonDataCache[id]) return pokemonDataCache[id];

  const res = await fetch(`${CONFIG.API_BASE}/pokemon/${id}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon data");

  const data = await res.json();
  pokemonDataCache[id] = data;
  return data;
}

async function fetchPokemonList(limit, offset) {
  const url = `${CONFIG.API_BASE}/pokemon?limit=${limit}&offset=${offset}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Pokémon list");
  return res.json();
}

async function fetchPokemonDetails(url) {
  const res = await fetch(url);
  const data = await res.json();

  return {
    id: data.id,
    name: toTitle(data.name),
    image: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
    types: data.types.map(t => toTitle(t.type.name)),
    bg: colorByType(data.types, CONFIG.TYPE_COLORS),

    stats: data.stats.map(s => ({
      label: s.stat.name.replace("special-", "Sp. "),
      value: s.base_stat
    })),

    height: (data.height / 10).toFixed(1),
    weight: (data.weight / 10).toFixed(1),
    abilities: data.abilities.map(a => a.ability.name.replace(/-/g, " ")).join(", "),
  };
}


async function fetchPokemonStats(id) {
  const data = await fetchPokemonData(id);

  const statMap = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed"
  };

  return data.stats.map(s => ({
    label: statMap[s.stat.name] || s.stat.name,
    value: s.base_stat
  }));
}

async function fetchPokemonDetailsExtended(id) {
  const data = await fetchPokemonData(id);

  return {
    height: (data.height / 10).toFixed(1),
    weight: (data.weight / 10).toFixed(1),
    abilities: data.abilities
      .map(a => a.ability.name.replace(/-/g, " "))
      .join(", ")
  };
}

async function fetchSpeciesData(id) {
  const res = await fetch(`${CONFIG.API_BASE}/pokemon-species/${id}`);
  if (!res.ok) throw new Error("Failed to fetch species");
  return res.json();
}

async function fetchEvolutionData(evoUrl) {
  const res = await fetch(evoUrl);
  if (!res.ok) throw new Error("Failed to fetch evolution chain");
  return res.json();
}

function extractEvolutionNames(chainData) {
  const names = [];
  let current = chainData.chain;

  while (current) {
    names.push(current.species.name);
    current = current.evolves_to[0];
  }
  return names;
}

function formatEvolutionNames(names) {
  return names
    .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" → ");
}

async function fetchEvolutionChain(id) {
  const species = await fetchSpeciesData(id);
  const evoData = await fetchEvolutionData(species.evolution_chain.url);
  const names = extractEvolutionNames(evoData);
  return formatEvolutionNames(names);
}
