from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from PIL import Image
import tensorflow as tf
import numpy as np
import json
import io
import logging

# ---------------------------------------------------
# Logging
# ---------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------
# FastAPI App
# ---------------------------------------------------

app = FastAPI(title="Gesture Navigator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# Paths
# ---------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "gesture_model.keras"
CLASS_PATH = BASE_DIR / "class_names.json"
CONFIG_PATH = BASE_DIR / "model_config.json"

# ---------------------------------------------------
# Load Config
# ---------------------------------------------------

if CONFIG_PATH.exists():

    with open(CONFIG_PATH, "r") as f:
        config = json.load(f)

    IMG_HEIGHT = config.get("input_height", 224)
    IMG_WIDTH = config.get("input_width", 224)

else:

    IMG_HEIGHT = 224
    IMG_WIDTH = 224

logger.info(f"Input Size : {IMG_WIDTH} x {IMG_HEIGHT}")

# ---------------------------------------------------
# Load Class Names
# ---------------------------------------------------

with open(CLASS_PATH, "r") as f:
    class_names = json.load(f)

logger.info(f"Loaded {len(class_names)} classes")

# ---------------------------------------------------
# Load Model
# ---------------------------------------------------

model = tf.keras.models.load_model(MODEL_PATH)

logger.info("Model loaded successfully.")

# ---------------------------------------------------
# Image Preprocessing
# ---------------------------------------------------

def preprocess(image_bytes):

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    image = image.resize((IMG_WIDTH, IMG_HEIGHT))

    image = np.array(image, dtype=np.float32)

    image = image / 255.0

    image = np.expand_dims(image, axis=0)

    return image


# ---------------------------------------------------
# Routes
# ---------------------------------------------------

@app.get("/")
def home():

    return {
        "message":"Gesture Navigator API running."
    }


@app.get("/health")
def health():

    return {

        "status":"healthy",

        "model_loaded":True,

        "classes":len(class_names),

        "input_shape":[IMG_HEIGHT,IMG_WIDTH,3]

    }


@app.get("/classes")
def classes():

    return {

        "classes":class_names

    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    image_bytes = await file.read()

    image = preprocess(image_bytes)

    prediction = model.predict(image, verbose=0)[0]

    class_index = int(np.argmax(prediction))

    confidence = float(np.max(prediction))

    probabilities = {

        class_names[i]: float(prediction[i])

        for i in range(len(class_names))

    }

    return {

        "gesture": class_names[class_index],

        "confidence": confidence,

        "probabilities": probabilities

    }
