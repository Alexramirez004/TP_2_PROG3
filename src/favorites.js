import "./style.css";
import { getCocktailById } from "./api";

const container = document.getElementById("container");

window.eliminarFavorito = async function (id, elementoCard) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos = favoritos.filter((favId) => favId !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));

  elementoCard.classList.add("eliminando");
  setTimeout(() => cargarFavoritos(), 400);
};

window.eliminarTodosFavoritos = function () {
  if (confirm("¿Estás seguro de que quieres eliminar todos los favoritos?")) {
    localStorage.removeItem("favoritos");
    cargarFavoritos();
  }
};

async function cargarFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  container.innerHTML = "";

  if (favoritos.length === 0) {
    container.innerHTML = `
            <div class="favoritos-vacio">
                <h2>😢 No tenés favoritos</h2>
                <p>¡Agregá algunos tragos desde la página principal!</p>
                <a href="/" class="btnNav">🍹 Ver tragos</a>
            </div>
        `;
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "favoritos-container";
  container.appendChild(wrapper);

  // Contador
  const counter = document.createElement("div");
  counter.className = "favoritos-counter";
  counter.innerHTML = `❤️ ${favoritos.length} tragos favoritos`;
  wrapper.appendChild(counter);

  // Botón eliminar todos
  const btnEliminarTodos = document.createElement("button");
  btnEliminarTodos.className = "btn-eliminar-todos";
  btnEliminarTodos.textContent = "🗑️ Eliminar todos los favoritos";
  btnEliminarTodos.addEventListener("click", window.eliminarTodosFavoritos);
  wrapper.appendChild(btnEliminarTodos);

  const grid = document.createElement("div");
  grid.className = "favoritos-grid";
  wrapper.appendChild(grid);

  for (const id of favoritos) {
    try {
      const data = await getCocktailById(id);
      const drink = data.drinks[0];

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <div class="info">
                    <h3>${drink.strDrink}</h3>
                    <div class="buttons">
                        <button class="btn-quitar-favorito" onclick="eliminarFavorito('${drink.idDrink}', this.closest('.card'))">
                            ❌ Quitar
                        </button>
                        <button class="recipeBtn" onclick="window.openModalFromId && openModalFromId('${drink.idDrink}')">
                            🍹 Ver receta
                        </button>
                    </div>
                </div>
            `;
      grid.appendChild(card);
    } catch (error) {
      console.error("Error cargando favorito:", error);
    }
  }
}

window.openModalFromId = async function (id) {
  try {
    const data = await getCocktailById(id);
    const drink = data.drinks[0];
    openModal(drink);
  } catch (error) {
    console.error("Error al abrir modal:", error);
  }
};

function openModal(drink) {
  let ingredientes = "";
  for (let i = 1; i <= 15; i++) {
    const ing = drink[`strIngredient${i}`];
    const meas = drink[`strMeasure${i}`];
    if (ing) {
      ingredientes += `<li>${meas ?? ""} ${ing}</li>`;
    }
  }

  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
        <div class="modalScroll">
            <div class="modalImg">
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
            </div>
            <h2 style="color: #ff8c42;">${drink.strDrink}</h2>
            <p><b>🍸 Tipo:</b> ${drink.strAlcoholic}</p>
            <p><b>🥃 Vaso:</b> ${drink.strGlass}</p>
            <h3>🧾 Ingredientes</h3>
            <ul>${ingredientes}</ul>
            <h3>👨‍🍳 Instrucciones</h3>
            <p style="line-height: 1.6;">${drink.strInstructions}</p>
        </div>
    `;
  document.getElementById("modal").classList.remove("hidden");
}

cargarFavoritos();

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

document.getElementById("closeModal")?.addEventListener("click", () => {
  document.getElementById("modal").classList.add("hidden");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("modal").classList.add("hidden");
  }
});

document.getElementById("modal")?.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    document.getElementById("modal").classList.add("hidden");
  }
});
