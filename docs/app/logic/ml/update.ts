// Libraries:
import * as tf from "@tensorflow/tfjs";

// TODO - Measure Performance
// TODO - Compare Performance with changing in training dataset
export default async function UpdateModel(NewData: any) {
  // Load Model:
  const model = await LoadModel();
  if (!model) return console.error("Model is not loaded.");
  if (!NewData) return console.error("Invalid data, provide an array of data.");

  // Function to predict the name based on the id
  async function predictName(id) {
    if (!model) {
      console.error("Model is not loaded.");
      return;
    }
    if (id < 1 || id > 100) {
      console.error("Invalid id, it should be between 1 and 100.");
      return;
    }
    // Convert the input to a tensor
    const inputTensor = tf.tensor2d([[id]], [1, 1]);
    // Make the prediction
    const prediction = await model.predict(inputTensor).data();
    // Return the predicted name
    return prediction[0];
  }

  // Prepare the data for training
  const xs = NewData.map((d) => d[0]);
  const ys = NewData.map((d) => d[1]);
  const xsTensor = tf.tensor2d(xs, [xs.length, 2]);
  const ysTensor = tf.tensor1d(ys);

  // Train the model
  await model.fit(xsTensor, ysTensor, {
    epochs: 100,
    batchSize: 2,
    callbacks: {
      onEpochEnd: async (epoch, log) => {
        console.log(`Epoch ${epoch}: loss = ${log.loss}`);
      },
    },
  });

  // Save Model:
  try {
    await model.save("path/to/model.json");
    console.log("Model saved successfully.");
  } catch (err) {
    console.error("Error saving model:", err);
  }
}

// async function updateModel(model, xs, ys) {
//   const history = await model.fit(xs, ys, {epochs: 10});
//   console.log(history.history.loss[0]);
// }

// import * as tf from '@tensorflow/tfjs';

// async function updateModel(model:tf.LayersModel) {
//     // Generate some new data
//     const xs = tf.randomNormal([1, 10]);
//     const ys = tf.randomNormal([1, 1]);

//     // Update the model with the new data
//     await model.fit(xs, ys, {batchSize: 1, epochs: 1});

//     // Make a prediction on new data
//     const xs_new = tf.randomNormal([1, 10]);
//     const y_pred = model.predict(xs_new);
//     console.log(y_pred);
// }

// async function startTraining(){
//     // load the model from the "models" folder
//     const model = await tf.loadLayersModel('file://models/my-model');

//     // Continuously update the model and make predictions
//     setInterval(() => updateModel(model), 1000);
// }

// startTraining();
