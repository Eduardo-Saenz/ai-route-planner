from geopy.geocoders import Nominatim
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests

# Cargar las variables desde el archivo .env
load_dotenv()
api_key = os.getenv("OPENROUTESERVICE_API_KEY")  # Obtener la clave de API de OpenRouteService

app = Flask(__name__)
CORS(app)  # Habilitar CORS para permitir solicitudes desde el frontend

# Inicializar el geocodificador de Nominatim
geolocator = Nominatim(user_agent="route-planner")

# Endpoint para geocodificar direcciones
@app.route("/geocode", methods=["POST"])
def geocode():
    # Obtener la dirección del cuerpo de la solicitud
    data = request.get_json()
    address = data.get("address")

    if not address:
        return jsonify({"error": "La dirección es requerida"}), 400

    try:
        location = geolocator.geocode(address)
        if location:
            return jsonify({
                "address": location.address,
                "latitude": location.latitude,
                "longitude": location.longitude
            }), 200
        else:
            return jsonify({"error": "No se pudo encontrar la dirección. Intenta con más detalles."}), 404
    except Exception as e:
        return jsonify({"error": f"Hubo un error al intentar geocodificar la dirección: {str(e)}"}), 500


# Endpoint para obtener rutas desde OpenRouteService
@app.route("/getRoute", methods=["POST"])
def get_route():
    if not api_key:
        return jsonify({"error": "La clave de API de OpenRouteService no está configurada"}), 500

    data = request.get_json()
    coordinates = data.get("coordinates")

    if not coordinates or len(coordinates) < 2:
        return jsonify({"error": "Se requieren al menos dos puntos para calcular una ruta"}), 400

    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    headers = {"Content-Type": "application/json"}
    payload = {"coordinates": coordinates}

    try:
        response = requests.post(url, headers=headers, json=payload, params={"api_key": api_key, "geometry": "geojson"})
        if response.status_code == 200:
            # Depurar la respuesta de OpenRouteService
            print("Respuesta de OpenRouteService:", response.json())
            return jsonify(response.json())
        else:
            return jsonify({"error": "Error al obtener la ruta", "details": response.text}), response.status_code
    except Exception as e:
        return jsonify({"error": f"Hubo un error al procesar la solicitud: {str(e)}"}), 500



if __name__ == "__main__":
    import logging
    app.logger.setLevel(logging.DEBUG)
    app.run(debug=True)
