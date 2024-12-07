import { submitForm } from "./geocode.js";
import { displayResults } from "./ui.js";
import { getRoute, calculateRoute } from "./routes.js"; // Importa la función getRoute

// Obtener el formulario y el campo de dirección
const form = document.getElementById("geocode-form");

// Agregar el evento de envío
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const address = document.getElementById("address").value;

    submitForm(address) // Llamar a la función para hacer la solicitud POST
        .then((data) => {
            displayResults(data); // Mostrar los resultados
            // Llamar a la función para obtener la ruta entre dos puntos (ejemplo)
            getRoute(data.latitude, data.longitude, 48.8566, 2.3522); // Torre Eiffel a Notre-Dame
        })
        .catch((error) => console.error("Error:", error));
});
