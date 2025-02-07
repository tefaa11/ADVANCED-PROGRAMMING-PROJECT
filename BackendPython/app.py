from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configuration for image upload
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# In-memory simulation of products
products = []

@app.route('/')
def home():
    return "Flask server running correctly"

@app.route('/products', methods=['GET'])
def list_products():
    return jsonify(products)

@app.route('/products', methods=['POST'])
def add_product():
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
        "name": data.get("name"),
        "description": data.get("description"),
        "price": data.get("price"),
        "image_url": filepath
    }
    products.append(product)
    return jsonify({"message": "Product added", "product": product}), 201

if __name__ == '__main__':
    app.run(port=5001, debug=True)
