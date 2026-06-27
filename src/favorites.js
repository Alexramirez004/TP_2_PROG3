import "./style.css";
import { getCocktailById } from "./api";

const container = document.getElementById("container");

async function cargarFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  container.innerHTML = "";

  if (favoritos.length === 0) {
    container.innerHTML =
      "<h2 style='text-align:center;padding:40px;'>No tenés favoritos ❤️</h2>";
    return;
  }

  container.innerHTML =
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:15px;padding:20px;"></div>';
  const grid = container.firstChild;

  for (const id of favoritos) {
    try {
      const data = await getCocktailById(id);
      const drink = data.drinks[0];

      grid.innerHTML += `
                <div class="card">
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                    <div class="info">
                        <h3>${drink.strDrink}</h3>
                    </div>
                </div>
            `;
    } catch (error) {
      console.error("Error cargando favorito:", error);
    }
  }
}

cargarFavoritos();
