// Libraries:
import * as tf from "@tensorflow/tfjs";
import CreateModel from "./create";

// Main:
export default async function MlModelManager() {
  // TODO - Check if model exists in GOOGLE_STORAGE else create one, save it, and return it
  const model = CreateModel(); // CreateModel();
  //   const model = LoadModel("./models/vasundhara/model");

  // Return:
  return { model, UpdateModel };
}

function UpdateModel() {}

// Load Model:
async function LoadModel(path: string) {
  try {
    const model = await tf.loadLayersModel(path);
    console.log("Model loaded successfully.");
    return model;
  } catch (err) {
    console.error("Error loading model:", err);
    return false;
  }
}

async function createModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
  return model;
}
