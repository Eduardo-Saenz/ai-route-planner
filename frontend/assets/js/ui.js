// Función para mostrar los resultados en la página
export function displayResults(data) {
    const resultsDiv = document.getElementById("results");

    if (data.error) {
        resultsDiv.innerHTML = `<p>Error: ${data.error}</p>`;
    } else {
        resultsDiv.innerHTML = `
            <p><strong>Dirección:</strong> ${data.address}</p>
            <p><strong>Latitud:</strong> ${data.latitude}</p>
            <p><strong>Longitud:</strong> ${data.longitude}</p>
        `;

        // Llamar a la función para mostrar la ubicación en el mapa, pasando los datos necesarios
        showMap(data.address, data.latitude, data.longitude);
    }
}

// Función para inicializar el mapa y agregar un marcador
function showMap(address, latitude, longitude) {
    // Inicializar el mapa
    const map = L.map("map").setView([latitude, longitude], 13); // Centrado en la latitud y longitud

    // Cargar el mapa con OpenStreetMap como base
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Agregar un marcador en las coordenadas
    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`<b>${address}</b>`) // Usar el address recibido
        .openPopup();
}
