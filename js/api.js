async function fetchPokemonList(limit, offset) {
  const url = `${CONFIG.API_BASE}/pokemon?limit=${limit}&offset=${offset}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Pokémon list");
  return res.json();
}

async function fetchPokemonDetails(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Pokémon details");
  return res.json();
}

async function fetchPokemonStats(id) {
  const res = await fetch(`${CONFIG.API_BASE}/pokemon/${id}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon stats");
  const data = await res.json();
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
  const res = await fetch(`${CONFIG.API_BASE}/pokemon/${id}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon extended details");
  const data = await res.json();

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
