import "./style.css";
import { searchByName, getRandom } from "./api";

const container = document.getElementById("container");
const input = document.getElementById("searchInput");

const btnSearch = document.getElementById("btnSearch");
const btnSurprise = document.getElementById("btnSurprise");

function render(drinks) {
  container.innerHTML = "";

  if (!drinks || drinks.length === 0) {
    container.innerHTML = "<p>❌ No se encontraron tragos</p>";
    return;
  }

  drinks.forEach((d) => {
    container.innerHTML += `
<div class="card">
<img src="${d.strDrinkThumb}">
<h3>${d.strDrink}</h3>
</div>
`;
  });
}

/* BUSCAR */

btnSearch.addEventListener("click", async () => {
  const data = await searchByName(input.value);
  render(data.drinks);
});

/* SORPRENDEME */

btnSurprise.addEventListener("click", async () => {
  const data = await getRandom();
  render([data.drinks[0]]);
});

/* INIT */

async function init() {
  const data = await searchByName("margarita");
  render(data.drinks);
}

init();
function showLoading() {
  container.innerHTML = "<p>🍹 Cargando tragos...</p>";
}
btnSearch.addEventListener("click", async () => {
  showLoading();
  const data = await searchByName(input.value);
  render(data.drinks);
});
