import "./style.css";
import { traducciones } from "./traducciones";
import {
  searchByName,
  getRandom,
  searchByLetter,
  getCocktailById,
  searchByIngredient,
} from "./api";

const container = document.getElementById("container");
const input = document.getElementById("searchInput");
const loadingScreen = document.getElementById("loadingScreen");
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

const btnSearch = document.getElementById("btnSearch");
const btnSurprise = document.getElementById("btnSurprise");
const btnLetter = document.getElementById("btnLetter");
const btnIngredient = document.getElementById("btnIngredient");

function render(drinks) {
  container.innerHTML = "";

  if (!drinks || drinks.length === 0) {
    container.innerHTML = "<p>❌ No se encontraron tragos</p>";
    return;
  }

  drinks.forEach((d) => {
    const esFav = favoritos.includes(d.idDrink);
    container.innerHTML += `
<div class="card" onclick="openModalFromId('${d.idDrink}')">

    <img src="${d.strDrinkThumb}">

    <div class="info">

        <h3>${d.strDrink}</h3>

        <div class="buttons">

            <button
            class="favoriteBtn ${esFav ? "active" : ""}"
            onclick="event.stopPropagation();toggleFav('${d.idDrink}',this)">

          <svg class="empty"
            xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24"
             width="28"
             height="28">

      <path fill="none" d="M0 0H24V24H0z"></path>

      <path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path>

          </svg>

          <svg
class="filled"
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
width="28"
height="28">

<path fill="none" d="M0 0H24V24H0z"></path>

<path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path>

</svg>

</button>

            <button class="recipeBtn">
    🍹 Ver receta
</button>

        </div>

    </div>

</div>
`;
  });
}

btnSurprise.addEventListener("click", async () => {
  showLoading();
  const data = await getRandom();
  hideLoading();
  render([data.drinks[0]]);
});

function showLoading() {
  loadingScreen.classList.remove("hidden");
}
function hideLoading() {
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
  }, 600);
}

btnLetter.addEventListener("click", async () => {
  showLoading();

  const data = await searchByLetter(input.value.charAt(0));

  hideLoading();

  render(data.drinks);
});
btnIngredient.addEventListener("click", async () => {
  showLoading();

  const data = await searchByIngredient(input.value);

  hideLoading();

  render(data.drinks);
});
/* INIT */

async function init() {
  const letters = ["a", "j", "p", "h"];

  let drinks = [];

  for (const l of letters) {
    const data = await searchByLetter(l);

    if (data.drinks) {
      drinks.push(...data.drinks);
    }
  }

  render(drinks);
}

init();

window.toggleFav = function (id, boton) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter((f) => f !== id);

    boton.classList.remove("active");
  } else {
    favoritos.push(id);

    boton.classList.add("active");
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
};
const themeBtn = document.getElementById("themeBtn");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light");

  themeBtn.textContent = "🌞 Modo claro";
} else {
  themeBtn.textContent = "🌙 Modo oscuro";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");

    themeBtn.textContent = "🌞 Modo claro";
  } else {
    localStorage.setItem("theme", "dark");

    themeBtn.textContent = "🌙 Modo oscuro";
  }
});

function openModal(drink) {
  let ingredientes = "";

  for (let i = 1; i <= 15; i++) {
    const ing = drink[`strIngredient${i}`];
    const meas = drink[`strMeasure${i}`];

    if (ing) {
      ingredientes += `<li>${meas ?? ""} ${ing}</li>`;
    }
  }

  modalBody.innerHTML = `
  <div class="modalScroll">

    <div class="modalImg">
      <img src="${drink.strDrinkThumb}">
    </div>

    <h2>${drink.strDrink}</h2>

    <p><b>🍸 Tipo:</b> ${drink.strAlcoholic}</p>
    <p><b>🥃 Vaso:</b> ${drink.strGlass}</p>

    <h3>🧾 Ingredientes</h3>
    <ul>${ingredientes}</ul>

    <h3>👨‍🍳 Instrucciones</h3>
    <p>${drink.strInstructions}</p>

  </div>
`;

  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.openModalFromId = async function (id) {
  const data = await getCocktailById(id);

  openModal(data.drinks[0]);
};
btnSearch.addEventListener("click", async () => {
  showLoading();

  let texto = input.value.toLowerCase().trim();

  texto = traducciones[texto] || texto;

  const data = await searchByName(texto);

  hideLoading();

  render(data.drinks);
});
// Manejador para ir a favoritos
document.getElementById("favoritosLink")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.hash = "favoritos";
  renderFavoritos();
});

// Función para renderizar favoritos
async function renderFavoritos() {
  const container = document.getElementById("container");
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  if (favoritos.length === 0) {
    container.innerHTML = "<h2>No tenés favoritos ❤️</h2>";
    return;
  }

  container.innerHTML =
    '<h2>❤️ Mis Favoritos</h2><div id="favoritosGrid"></div>';
  const grid = document.getElementById("favoritosGrid");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(220px, 1fr))";
  grid.style.gap = "15px";
  grid.style.padding = "20px";

  for (const id of favoritos) {
    const data = await getCocktailById(id);
    const drink = data.drinks[0];

    grid.innerHTML += `
            <div class="card" onclick="openModalFromId('${drink.idDrink}')">
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <div class="info">
                    <h3>${drink.strDrink}</h3>
                </div>
            </div>
        `;
  }
}

// Detectar cambios en el hash
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#favoritos") {
    renderFavoritos();
  } else {
    // Volver a la vista principal
    init();
  }
});
