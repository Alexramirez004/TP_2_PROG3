const BASE = "https://www.thecocktaildb.com/api/json/v1/1";

// 🔍 por nombre
export async function searchByName(name) {
  const res = await fetch(`${BASE}/search.php?s=${name}`);
  return await res.json();
}

// 🔤 por letra
export async function searchByLetter(letter) {
  const res = await fetch(`${BASE}/search.php?f=${letter}`);
  return await res.json();
}

// 🧊 por ingrediente
export async function searchByIngredient(ingredient) {
  const res = await fetch(`${BASE}/search.php?i=${ingredient}`);
  return await res.json();
}

// 📄 detalle
export async function getById(id) {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`);
  return await res.json();
}

// 🎲 random
export async function getRandom() {
  const res = await fetch(`${BASE}/random.php`);
  return await res.json();
}
