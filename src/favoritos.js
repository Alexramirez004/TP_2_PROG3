import "./style.css";
import { getCocktailById } from "./api";

const container = document.getElementById("container");

const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

async function cargarFavoritos() {
  container.innerHTML = "";

  if (favoritos.length === 0) {
    container.innerHTML = "<h2>No tenés favoritos ❤️</h2>";

    return;
  }

  for (const id of favoritos) {
    const data = await getCocktailById(id);

    const drink = data.drinks[0];

    container.innerHTML += `

        <div class="card">

            <img src="${drink.strDrinkThumb}">

            <div class="info">

                <h3>${drink.strDrink}</h3>

            </div>

        </div>

        `;
  }
}

cargarFavoritos();
