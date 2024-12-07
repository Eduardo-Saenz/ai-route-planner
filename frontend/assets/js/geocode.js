export function submitForm(address) {
    return new Promise((resolve, reject) => {
        fetch("http://127.0.0.1:5000/geocode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ address: address }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => reject("Error en la solicitud: " + error));
    });
}
