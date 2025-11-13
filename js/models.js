function buildPokemonModel(pokemon, index) {
  if (!pokemon) {
    console.error("❌ Ungültiges Pokémon übergeben:", pokemon);
    return null;
  }

  const name = toTitle(pokemon.name || "Unknown");

  const image =
    pokemon.image ||
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    "assets/fallback.png";

  // 🟢 FIX: types können Strings ODER API-Objekte sein
  const rawTypes = Array.isArray(pokemon.types) ? pokemon.types : [];

  const types = rawTypes.map(t =>
    typeof t === "string"
      ? toTitle(t)
      : toTitle(t.type?.name || "Unknown")
  );

  // 🟢 FIX: colorByType braucht API-Format
  const normalizedTypes = rawTypes.map(t =>
    typeof t === "string"
      ? { type: { name: t.toLowerCase() } }
      : t
  );

  const bg = colorByType(normalizedTypes, CONFIG.TYPE_COLORS);

  return {
    id: pokemon.id || 0,
    name,
    image,
    types,
    bg,
    index
  };
}
