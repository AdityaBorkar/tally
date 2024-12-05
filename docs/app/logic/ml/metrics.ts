// Libraries:
import * as tf from "@tensorflow/tfjs";

// Utils:
export const f1Score = (yTrue: tf.Tensor, yPred: tf.Tensor) => {
  const truePositives = tf.sum(tf.mul(yTrue, yPred));
  const falsePositives = tf.sum(tf.mul(yPred, tf.sub(1, yTrue)));
  const falseNegatives = tf.sum(tf.mul(yTrue, tf.sub(1, yPred)));
  const precision = truePositives.div(tf.add(truePositives, falsePositives));
  const recall = truePositives.div(tf.add(truePositives, falseNegatives));
  const f1Score = tf.mul(
    2,
    tf.div(tf.mul(precision, recall), tf.add(precision, recall))
  );
  return f1Score;
};
