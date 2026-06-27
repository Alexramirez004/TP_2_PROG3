import "./style.css";
import { getCocktailById } from "./api";

const container = document.getElementById("container");

// Función para eliminar un favorito
window.eliminarFavorito = async function (id, elementoCard) {
  // Obtener favoritos actuales
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  // Filtrar el ID que queremos eliminar
  favoritos = favoritos.filter((favId) => favId !== id);

  // Guardar en localStorage
  localStorage.setItem("favoritos", JSON.stringify(favoritos));

  // Animar la eliminación del elemento
  elementoCard.style.transition = "all 0.3s ease";
  elementoCard.style.transform = "scale(0.8)";
  elementoCard.style.opacity = "0";

  // Esperar la animación y recargar la lista
  setTimeout(() => {
    cargarFavoritos();
  }, 300);
};

async function cargarFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  container.innerHTML = "";

  if (favoritos.length === 0) {
    container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2 style="font-size: 2.5rem; margin-bottom: 20px;">😢 No tenés favoritos</h2>
                <p style="font-size: 1.2rem; opacity: 0.7; margin-bottom: 30px;">
                    ¡Agregá algunos tragos desde la página principal!
                </p>
                <a href="/" class="btnNav" style="display: inline-block; padding: 15px 40px; font-size: 1.2rem;">
                    🍹 Ver tragos
                </a>
            </div>
        `;
    return;
  }

  // Crear grid para los favoritos
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(250px, 1fr))";
  grid.style.gap = "20px";
  grid.style.padding = "20px";
  grid.style.maxWidth = "1200px";
  grid.style.margin = "0 auto";
  container.appendChild(grid);

  // Contador de favoritos
  const counter = document.createElement("div");
  counter.style.textAlign = "center";
  counter.style.padding = "10px";
  counter.style.fontSize = "1.1rem";
  counter.style.opacity = "0.7";
  counter.innerHTML = `❤️ ${favoritos.length} tragos favoritos`;
  container.insertBefore(counter, grid);

  for (const id of favoritos) {
    try {
      const data = await getCocktailById(id);
      const drink = data.drinks[0];

      // Crear elemento card
      const card = document.createElement("div");
      card.className = "card";
      card.style.position = "relative";
      card.style.animation = "fade 0.5s ease forwards";

      card.innerHTML = `
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" style="height: 200px; object-fit: cover;">
                <div class="info">
                    <h3 style="font-size: 1.1rem; margin: 10px 0;">${drink.strDrink}</h3>
                    
                    <div class="buttons" style="display: flex; gap: 10px; margin-top: 15px;">
                        <!-- Botón para eliminar favorito -->
                        <button class="favoriteBtn active" 
                                onclick="eliminarFavorito('${drink.idDrink}', this.closest('.card'))"
                                style="flex: 1; background: linear-gradient(135deg, #ff3b30, #ff6b6b);">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="white" d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"/>
                            </svg>
                            ❌ Quitar
                        </button>
                        
                        <!-- Botón para ver receta -->
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

// Función para abrir modal desde favoritos
window.openModalFromId = async function (id) {
  try {
    const data = await getCocktailById(id);
    const drink = data.drinks[0];
    openModal(drink);
  } catch (error) {
    console.error("Error al abrir modal:", error);
  }
};

// Función para abrir el modal (copiada de main.js)
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

  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
}

// Cargar favoritos al iniciar
cargarFavoritos();

// Agregar funcionalidad del tema oscuro
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

// Cerrar modal
document.getElementById("closeModal")?.addEventListener("click", () => {
  document.getElementById("modal").classList.add("hidden");
});

// Cerrar modal con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("modal").classList.add("hidden");
  }
});

// Cerrar modal haciendo clic fuera
document.getElementById("modal")?.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    document.getElementById("modal").classList.add("hidden");
  }
});
