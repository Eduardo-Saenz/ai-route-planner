let map; // Instancia global del mapa
export let markers = []; // Lista para almacenar marcadores en el mapa
export let coordinates = []; // Lista para almacenar coordenadas (lng, lat)
let pointsList = []; // Lista para almacenar descripciones de los puntos (direcciones)

// Inicializar el mapa
export function initializeMap() {
    // Si el mapa ya está inicializado, eliminarlo primero
    if (map) {
        map.remove(); // Esto elimina el mapa existente
    }

    map = L.map("map").setView([19.3731272, -99.18287761374839], 15); // Centrado en la UP
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
}

// Función para agregar un marcador al mapa
export function addMarker(lat, lng, label) {
    const marker = L.marker([lat, lng]).addTo(map).bindPopup(label).openPopup();
    markers.push(marker);
    coordinates.push([lng, lat]); // Agregar coordenadas en formato [lng, lat]
    pointsList.push(label); // Agregar descripción del punto a la lista
    updatePointsList(); // Actualizar la lista visual
}

// Función para actualizar la lista de puntos en el HTML
function updatePointsList() {
    const listContainer = document.getElementById("pointsList");
    listContainer.innerHTML = ""; // Limpiar la lista antes de volver a llenarla

    pointsList.forEach((point, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${point}`;
        listContainer.appendChild(listItem);
    });
}

let routeLine; // Variable global para almacenar la polilínea de la ruta

// Función para mostrar la ruta en el mapa
export function displayRouteOnMap(routeData) {
    console.log("Datos completos de la ruta:", routeData);

    // Verificar que la respuesta contiene rutas
    if (!routeData || !routeData.routes || routeData.routes.length === 0) {
        console.error("No se pudo encontrar una ruta válida en los datos.");
        alert("No se pudo calcular la ruta.");
        return;
    }

    const route = routeData.routes[0]; // Obtener la primera ruta

    // Mostrar la geometría y otros detalles
    const routeCoordinates = polyline
        .decode(route.geometry)
        .map(([lng, lat]) => [lat, lng]);
    const distance = route.summary.distance / 1000; // Convertir metros a kilómetros
    const duration = (route.summary.duration / 60).toFixed(2); // Convertir segundos a minutos

    // Actualizar la tarjeta con los detalles de la ruta
    document.getElementById(
        "route-info"
    ).textContent = `Distancia: ${distance} km | Duración: ${duration} min`;

    const routeDetails = document.getElementById("route-details");
    routeDetails.innerHTML = ""; // Limpiar cualquier detalle previo

    // Agregar detalles adicionales en una lista
    routeDetails.innerHTML = `
        <li class="list-group-item"><strong>Distancia:</strong> ${distance} km</li>
        <li class="list-group-item"><strong>Duración:</strong> ${duration} min</li>
        <li class="list-group-item"><strong>Puntos de paso:</strong> ${route.way_points.length}</li>
    `;

    // Dibujar la ruta en el mapa
    routeLine = L.polyline(routeCoordinates, { color: "blue" }).addTo(map);

    // Ajustar el mapa para mostrar toda la ruta
    map.fitBounds(routeLine.getBounds());
}

// Inicializar el mapa cuando la página se carga
initializeMap();

document.getElementById("clearPoints").addEventListener("click", function () {
    // Limpiar marcadores del mapa
    markers.forEach((marker) => map.removeLayer(marker));
    markers = [];
    coordinates = [];
    pointsList = [];

    // Limpiar lista visual
    updatePointsList();
});
