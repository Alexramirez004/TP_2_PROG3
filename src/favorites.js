import "./style.css";
import { getCocktailById } from "./api";

const container = document.getElementById("container");

// Función para eliminar un favorito (con estilos inline para asegurar que se vea)
window.eliminarFavorito = async function (id, elementoCard) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos = favoritos.filter((favId) => favId !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));

  // Animación simple
  elementoCard.style.transition = "all 0.3s ease";
  elementoCard.style.transform = "scale(0.8)";
  elementoCard.style.opacity = "0";

  setTimeout(() => {
    cargarFavoritos();
  }, 300);
};

async function cargarFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  container.innerHTML = "";

  if (favoritos.length === 0) {
    container.innerHTML = `
            <div style="text-align: center; padding: 80px 20px;">
                <h2 style="font-size: 2.5rem;">😢 No tenés favoritos</h2>
                <p style="font-size: 1.2rem; opacity: 0.7; margin: 20px 0;">¡Agregá algunos tragos desde la página principal!</p>
                <a href="index.html" class="btnNav" style="display: inline-block; padding: 15px 40px; font-size: 1.2rem; text-decoration: none; background: linear-gradient(135deg, #d62828, #ff7b00); color: white; border-radius: 12px; font-weight: bold;">
                    🍹 Ver tragos
                </a>
            </div>
        `;
    return;
  }

  // Mostrar cantidad
  container.innerHTML = `
        <div style="text-align: center; padding: 20px; font-size: 1.2rem; opacity: 0.8;">
            ❤️ ${favoritos.length} tragos favoritos
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; padding: 20px; max-width: 1200px; margin: 0 auto;">
        </div>
    `;

  const grid = container.lastChild;

  for (const id of favoritos) {
    try {
      const data = await getCocktailById(id);
      const drink = data.drinks[0];

      const card = document.createElement("div");
      card.className = "card";
      card.style.position = "relative";

      card.innerHTML = `
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" style="width: 100%; height: 200px; object-fit: cover;">
                <div class="info" style="padding: 15px; text-align: center;">
                    <h3 style="font-size: 1.1rem; margin: 10px 0;">${drink.strDrink}</h3>
                    <div style="display: flex; gap: 10px; margin-top: 15px; justify-content: center;">
                        <button onclick="eliminarFavorito('${drink.idDrink}', this.closest('.card'))" 
                                style="flex: 1; background: linear-gradient(135deg, #ff3b30, #ff6b6b); color: white; border: none; border-radius: 12px; padding: 10px 15px; font-weight: bold; cursor: pointer; transition: all 0.3s;">
                            ❌ Quitar
                        </button>
                        <button onclick="verReceta('${drink.idDrink}')" 
                                style="flex: 1; background: linear-gradient(135deg, #d62828, #ff7b00); color: white; border: none; border-radius: 12px; padding: 10px 15px; font-weight: bold; cursor: pointer; transition: all 0.3s;">
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

// Función para ver receta (abre en nueva ventana con la receta completa)
window.verReceta = function (id) {
  window.open(`https://www.thecocktaildb.com/drink/${id}`, "_blank");
};

// Cargar favoritos
cargarFavoritos();

// Tema oscuro
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
