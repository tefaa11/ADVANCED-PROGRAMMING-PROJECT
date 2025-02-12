from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5500"}})

# Upload folder configuration
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Clear the 'uploads' folder on server start
for filename in os.listdir(UPLOAD_FOLDER):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)  # Delete file or symbolic link
        elif os.path.isdir(file_path):
            os.rmdir(file_path)  # Delete empty directories (optional)
    except Exception as e:
        print(f'Error deleting {file_path}. Reason: {e}')

# In-memory product and purchase storage
products = []
product_id_counter = 1
product_references = {}  # Store references per product
purchases = []  # Store all purchases

@app.route('/')
def home():
    return "Flask server running correctly"

# Route to serve images
@app.route('/uploads/<filename>')
def get_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Route to get and add products
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
        product_references[product_id_counter] = []  # Initialize empty references for the product
        product_id_counter += 1

        return jsonify({"message": "Product added", "product": product}), 201

# Route to get a product by its ID
@app.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    product = next((p for p in products if p["id"] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404

# Route to manage references for a product
@app.route('/products/<int:product_id>/references', methods=['GET', 'POST'])
def manage_references(product_id):
    if product_id not in product_references:
        return jsonify({"error": "Product not found"}), 404

    if request.method == 'GET':
        return jsonify({"product_id": product_id, "references": product_references[product_id]})

    if request.method == 'POST':
        data = request.json
        reference_text = data.get("reference")

        if not reference_text:
            return jsonify({"error": "Reference text is required"}), 400

        product_references[product_id].append(reference_text)
        return jsonify({"message": "Reference added", "product_id": product_id, "references": product_references[product_id]}), 201

# New endpoint to handle purchases
@app.route('/purchase', methods=['POST'])
def handle_purchase():
    data = request.json

    required_fields = ['product_id', 'username', 'phone', 'address', 'bank']
    missing_fields = [field for field in required_fields if not data.get(field)]

    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    # Save the purchase
    purchase = {
        "product_id": data['product_id'],
        "username": data['username'],
        "phone": data['phone'],
        "address": data['address'],
        "bank": data['bank']
    }
    purchases.append(purchase)

    print(f"New purchase registered: {purchase}")
    return jsonify({"message": "Purchase registered successfully", "purchase": purchase}), 201

# Route to retrieve all purchases (for testing or admin purposes)
@app.route('/purchases', methods=['GET'])
def get_purchases():
    return jsonify(purchases), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
