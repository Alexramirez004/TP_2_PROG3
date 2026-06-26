const BASE = "https://www.thecocktaildb.com/api/json/v1/1";

export async function searchByName(name) {
  const res = await fetch(`${BASE}/search.php?s=${name}`);
  return await res.json();
}
export async function searchByLetter(letter) {
  const res = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`,
  );

  return await res.json();
}
export async function searchByIngredient(ingredient) {
  const res = await fetch(`${BASE}/filter.php?i=${ingredient}`);
  return await res.json();
}
export async function getRandom() {
  const res = await fetch(`${BASE}/random.php`);
  return await res.json();
}
export async function getCocktailById(id) {
  const res = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`,
  );

  return await res.json();
}
