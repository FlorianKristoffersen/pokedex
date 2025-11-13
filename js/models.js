function buildPokemonModel(pokemon, index) {
  if (!isValidPokemon(pokemon)) return null;

  return {
    id: pokemon.id || 0,
    name: formatPokemonName(pokemon),
    image: extractPokemonImage(pokemon),
    types: extractPokemonTypes(pokemon),
    bg: computePokemonBackground(pokemon),
    index
  };
}

function isValidPokemon(pokemon) {
  if (!pokemon) {
    console.error("❌ Ungültiges Pokémon übergeben:", pokemon);
    return false;
  }
  return true;
}

function formatPokemonName(pokemon) {
  return toTitle(pokemon.name || "Unknown");
}

function extractPokemonImage(pokemon) {
  return (
    pokemon.image ||
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    "assets/fallback.png"
  );
}

function extractPokemonTypes(pokemon) {
  const raw = Array.isArray(pokemon.types) ? pokemon.types : [];

  return raw.map(t =>
    typeof t === "string"
      ? toTitle(t)
      : toTitle(t.type?.name || "Unknown")
  );
}

function computePokemonBackground(pokemon) {
  const raw = Array.isArray(pokemon.types) ? pokemon.types : [];

  const normalized = raw.map(t =>
    typeof t === "string"
      ? { type: { name: t.toLowerCase() } }
      : t
  );

  return colorByType(normalized, CONFIG.TYPE_COLORS);
}
