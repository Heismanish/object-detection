import * as tf from "@tensorflow/tfjs";
import { throttle } from "lodash";

export const renderPredictions = (
  //@ts-expect-error : using any bts
  predictions: tf.Lite,
  ctx: CanvasRenderingContext2D
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.font = "16px sans-serif";
  ctx.textBaseline = "top";
  //@ts-expect-error : using any bts
  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction?.bbox;

    const isPerson = prediction?.class === "person";
    ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`;
    ctx.fillText(x, y, width, height);

    ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(ctx.font, 10);

    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);

    if (isPerson) {
      playAudio();
    }
  });
};

const playAudio = throttle(() => {
  const audio = new Audio("/alarm.mp3");
  audio.play();
}, 10);
