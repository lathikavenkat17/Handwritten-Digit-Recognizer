from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from werkzeug.security import generate_password_hash, check_password_hash
import os
import torch
import torchvision.transforms as transforms
from PIL import Image
from model import DigitCNN  # adjust if your model file name is different


# ---------------- App Setup ----------------
app = Flask(__name__)
CORS(app)

# ----- LOAD MODEL HERE -----
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = DigitCNN()
model.load_state_dict(torch.load("digit_model.pth", map_location=device))
model.to(device)
model.eval()


basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "users.db")

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + db_path
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "supersecretkey"

db = SQLAlchemy(app)
jwt = JWTManager(app)

# ---------------- User Model ----------------
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

with app.app_context():
    db.create_all()

# ---------------- Home ----------------
@app.route("/")
def home():
    return "Flask backend is running"

# ---------------- Register ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"message": "No JSON received"}), 400

    if not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"message": "All fields required"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "Username already exists"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 400

    hashed_pw = generate_password_hash(data["password"])

    new_user = User(
        username=data["username"],
        email=data["email"],
        password=hashed_pw
    )

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.username)

    return jsonify({
        "message": "User registered successfully",
        "access_token": access_token
    }), 201

# ---------------- Login ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"message": "No JSON received"}), 400

    user = User.query.filter_by(username=data["username"]).first()

    if user and check_password_hash(user.password, data["password"]):
        access_token = create_access_token(identity=user.username)
        return jsonify({"access_token": access_token}), 200

    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    image = Image.open(file).convert("L")
    image = image.resize((28, 28))

    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.1307,), (0.3081,))
    ])

    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(image)
        probabilities = torch.softmax(output, dim=1)
        confidence, predicted = torch.max(probabilities, 1)

    return jsonify({
        "digit": int(predicted.item()),
        "confidence": float(confidence.item())
    })

# ---------------- Run ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
