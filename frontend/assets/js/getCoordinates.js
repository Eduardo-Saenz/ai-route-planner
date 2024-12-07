// Función para obtener las coordenadas de la dirección ingresada
function getCoordinates(address) {
    fetch("http://127.0.0.1:5000/geocode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                document.getElementById(
                    "result"
                ).innerHTML = `Error: ${data.error}`;
            } else {
                // Mostrar dirección y coordenadas
                document.getElementById("result").innerHTML = `
            <p>Dirección: ${data.address}</p>
            <p>Latitud: ${data.latitude}</p>
            <p>Longitud: ${data.longitude}</p>
        `;
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// Evento del formulario para enviar la solicitud
document
    .getElementById("address-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        const address = document.getElementById("address-input").value;
        if (address) {
            getCoordinates(address);
        } else {
            alert("Por favor ingresa una dirección.");
        }
    });
