from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuración de la carpeta de subida
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 🆕 Limpiar la carpeta 'uploads' al iniciar la app
for filename in os.listdir(UPLOAD_FOLDER):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)  # Eliminar archivo o enlace simbólico
        elif os.path.isdir(file_path):
            os.rmdir(file_path)  # Eliminar directorios vacíos (opcional)
    except Exception as e:
        print(f'Error al borrar {file_path}. Razón: {e}')

# Simulación en memoria de productos
products = []
product_id_counter = 1

@app.route('/')
def home():
    return "Flask server running correctly"

# Ruta para servir imágenes
@app.route('/uploads/<filename>')
def get_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Ruta para obtener y agregar productos
@app.route('/products', methods=['GET', 'POST'])
def manage_products():
    global product_id_counter

    if request.method == 'GET':
        return jsonify(products)

    if request.method == 'POST':
        data = request.form
        if 'image' not in request.files:
            return jsonify({"error": "Image not found"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "Invalid filename"}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        product = {
            "id": product_id_counter,
            "name": data.get("name"),
            "description": data.get("description"),
            "price": data.get("price"),
            "image_url": f"http://localhost:5000/uploads/{filename}"
        }
        products.append(product)
        product_id_counter += 1

        return jsonify({"message": "Product added", "product": product}), 201

# Ruta para obtener un producto por su ID
@app.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    product = next((p for p in products if p["id"] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404

if __name__ == '__main__':
    app.run(port=5000, debug=True)
