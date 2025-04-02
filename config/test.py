from flask import Flask, jsonify, request, abort
from uuid import uuid4

app = Flask(__name__)

# In-memory data stores
users = {}
products = {}
orders = {}

# User model
class User:
    def __init__(self, name, email):
        self.id = str(uuid4())
        self.name = name
        self.email = email
        self.orders = []

# Product model
class Product:
    def __init__(self, name, price, stock):
        self.id = str(uuid4())
        self.name = name
        self.price = price
        self.stock = stock

# Order model
class Order:
    def __init__(self, user_id, product_id, quantity):
        self.id = str(uuid4())
        self.user_id = user_id
        self.product_id = product_id
        self.quantity = quantity
        self.status = "Pending"

# Helper function to find a product by ID
def find_product(product_id):
    product = products.get(product_id)
    if not product:
        abort(404, description="Product not found")
    return product

# Helper function to find a user by ID
def find_user(user_id):
    user = users.get(user_id)
    if not user:
        abort(404, description="User not found")
    return user

# API Endpoints

# Create a new user
@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    user = User(data["name"], data["email"])
    users[user.id] = user
    return jsonify({"id": user.id, "name": user.name, "email": user.email}), 201


@app.route("/users/<user_id>", methods=["GET"])
def get_user(user_id):
    user = find_user(user_id)
    return jsonify({"id": user.id, "name": user.name, "email": user.email, "orders": user.orders})


@app.route("/products", methods=["POST"])
def add_product():
    data = request.json
    product = Product(data["name"], data["price"], data["stock"])
    products[product.id] = product
    return jsonify({"id": product.id, "name": product.name, "price": product.price, "stock": product.stock}), 201


@app.route("/products", methods=["GET"])
def get_products():
    return jsonify([{"id": p.id, "name": p.name, "price": p.price, "stock": p.stock} for p in products.values()])

@app.route("/orders", methods=["POST"])
def place_order():
    data = request.json
    user = find_user(data["user_id"])
    product = find_product(data["product_id"])

    if product.stock < data["quantity"]:
        abort(400, description="Insufficient stock")

    order = Order(user.id, product.id, data["quantity"])
    orders[order.id] = order
    user.orders.append(order.id)
    product.stock -= data["quantity"]

    return jsonify({"id": order.id, "user_id": order.user_id, "product_id": order.product_id, "quantity": order.quantity, "status": order.status}), 201

@app.route("/orders/<order_id>", methods=["GET"])
def get_order(order_id):
    order = orders.get(order_id)
    if not order:
        abort(404, description="Order not found")
    return jsonify({"id": order.id, "user_id": order.user_id, "product_id": order.product_id, "quantity": order.quantity, "status": order.status})

# Update order status
@app.route("/orders/<order_id>", methods=["PUT"])
def update_order_status(order_id):
    order = orders.get(order_id)
    if not order:
        abort(404, description="Order not found")
    data = request.json
    order.status = data["status"]
    return jsonify({"id": order.id, "status": order.status})

# Error handler
@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": str(error)}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": str(error)}), 404

# Run the app
if __name__ == "__main__":
    app.run(debug=True)