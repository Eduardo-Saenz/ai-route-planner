import { displayRouteOnMap, addMarker, coordinates, markers } from "./map.js";

export function getRoute(coordinates) {
    const url = "http://127.0.0.1:5000/getRoute"; // Endpoint del backend

    console.log("Coordenadas enviadas al backend:", coordinates); // Depurar las coordenadas enviadas

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordinates }),
    })
        .then((response) => response.json())
        .then((data) => {
            // Imprimir los datos recibidos para depuración
            console.log("Respuesta de OpenRouteService:", data);

            if (data.routes && data.routes.length > 0) {
                return data; // Retorna los datos si la ruta es válida
            } else {
                throw new Error("No se pudo calcular una ruta válida.");
            }
        })
        .catch((error) => {
            console.error("Error al obtener la ruta:", error);
            throw error;
        });
}

// Función para calcular la ruta entre múltiples puntos
export function calculateRoute() {
    if (coordinates.length < 2) {
        alert("Debes agregar al menos dos puntos para calcular una ruta.");
        return;
    }

    // Depurar las coordenadas enviadas
    console.log("Coordenadas enviadas para calcular la ruta:", coordinates);

    getRoute(coordinates)
        .then((data) => {
            displayRouteOnMap(data); // Mostrar la ruta en el mapa
        })
        .catch((error) => console.error("Error al calcular la ruta:", error));
}

// Evento para manejar la búsqueda de puntos y agregarlos al mapa
document.getElementById("searchPoint").addEventListener("click", function () {
    const address = document.getElementById("address").value;

    fetch("http://127.0.0.1:5000/geocode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.latitude && data.longitude) {
                addMarker(data.latitude, data.longitude, data.address); // Agregar marcador al mapa
            } else {
                alert("No se pudo encontrar la dirección.");
            }
        })
        .catch((error) => console.error("Error al buscar el punto:", error));
});

// Botón para calcular la ruta entre los puntos
document
    .getElementById("calculateRoute")
    .addEventListener("click", calculateRoute);
