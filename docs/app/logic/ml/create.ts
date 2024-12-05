// Libraries:
import * as tf from "@tensorflow/tfjs";
// import { f1Score } from "./metrics";

// Create Model:
export default async function CreateModel() {
  const tf = require("@tensorflow/tfjs");

  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [2],
      units: 16,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.dense({
      units: 16,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.dense({
      units: 1,
      activation: "softmax",
    })
  );

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  const input = tf.tensor2d([[123456, "John Doe"]]);
  const output = model.predict(input);

  console.log(output.dataSync());

  return model;

  // // Define the model architecture
  // const model = tf.sequential();
  // //   const rnn = tf.layers.simpleRNN({ units: 8, inputShape: [1] });
  // const lstm = tf.layers.lstm({ units: 8, inputShape: [1, 2] });
  // const dense = tf.layers.dense({ units: 1 });
  // model.add(lstm);
  // model.add(dense);

  // // Compile the model
  // const optimizer = tf.train.adam();
  // model.compile({ optimizer, loss: "meanSquaredError" });

  // // Define the data
  // const data = [
  //   ["input string", "output"],
  //   ["Jane Doe", "Jane Doe"],
  //   ["Bob Johnson", "Bob Johnson"],
  // ];

  // // Shuffle the data
  // tf.util.shuffle(data);

  // // Prepare the data for training
  // const xs = data.map((d) => d[0]); // inputs
  // const ys = data.map((d) => d[1]); // outputs
  // const xsTensor = tf.tensor2d(xs, [xs.length, 2]);
  // const ysTensor = tf.tensor1d(ys);

  // // Train the model
  // model.fit(xsTensor, ysTensor, {
  //   epochs: 100,
  //   batchSize: 2,
  //   callbacks: {
  //     onEpochEnd: async (epoch, log) => {
  //       console.log(`Epoch ${epoch}: loss = ${log?.loss}`);
  //     },
  //   },
  // });

  // // Save Model:
  // await model.save("./models/vasundhara");
  // return model;
}

// Prepare the test data
// const xsTest = testData.map((d) => d[0]);
// const ysTest = testData.map((d) => d[1]);

// const xsTestTensor = tf.tensor2d(xsTest, [xsTest.length, 2]);
// const ysTestTensor = tf.tensor1d(ysTest);

// Evaluate the model
// binaryAccuracy, sparseCategoricalAccuracy, categoricalAccuracy
// const accuracy = tf.metrics.binaryAccuracy(
//   ysTestTensor,
//   model.predict(xsTestTensor)
// );
// const F1_SCORE = f1Score(ysTestTensor, model.predict(xsTestTensor));
// console.log(`Accuracy: ${accuracy}`);
// console.log(`F1 Score: ${f1Score}`);

// import * as tf from "@tensorflow/tfjs-backend-webgl"; // Improved Performance
// Add below to webpack:
// {
//   resolve: {
//     alias: {
//       "@tensorflow/tfjs-core": "@tensorflow/tfjs-core/dist/tf.min.js",
//     },
//   },
// };
