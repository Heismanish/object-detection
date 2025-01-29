"use client";
import { load } from "@tensorflow-models/coco-ssd";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "../uitl/renderPredictions";

const ObjectDetection = () => {
  const webCamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runCoco = async (): Promise<void> => {
    await tf.ready();

    setIsLoading(true);
    const net = await load();
    setIsLoading(false);

    setInterval(() => {
      runObjectDetection(net);
    }, 10);
  };

  // @ts-expect-error : `runObjectDetection` is not defined
  async function runObjectDetection(net: tf.Lite) {
    if (
      canvasRef.current &&
      webCamRef.current !== null &&
      webCamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webCamRef.current.video.videoWidth;
      canvasRef.current.height = webCamRef.current.video.videoHeight;
      const detectedObjects = await net.detect(
        webCamRef.current.video,
        undefined,
        0.6
      );

      // console.log(detectedObjects);

      const ctx = canvasRef.current.getContext("2d");
      if (ctx === null) {
        return;
      }
      renderPredictions(detectedObjects, ctx);
    }
  }

  useEffect(() => {
    runCoco();
    setIsClient(true); // Ensure rendering happens only on the client
  }, []);

  const showVideo = () => {
    if (
      webCamRef.current !== null &&
      webCamRef.current.video?.readyState === 4
    ) {
      // Get the actual width and height of the video element
      const myVideoWidth = webCamRef.current.video.videoWidth;
      const myVideoHeight = webCamRef.current.video.videoHeight;

      // Set the width and height of the video element to the actual values
      // This is necessary because the video element is initially set to a default size
      // and the video from the webcam is not displayed until the width and height are set
      webCamRef.current.video.width = myVideoWidth;
      webCamRef.current.video.height = myVideoHeight;
      /******  1763c441-5ba5-4224-b93b-89d4425bca65  *******/
    }
  };

  useEffect(() => {
    // runCoco();
    showVideo();
  }, []);

  useEffect(() => {
    if (isClient) {
      showVideo();
    }
  }, [isClient]);

  if (!isClient) {
    // Prevent server rendering of the webcam component
    return null;
  }

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="gradient-text">Loading AI Model...</div>
      ) : (
        <div className="relative flex items-center justify-center gradient p-1.5 rounded-md">
          {/* Webcam */}
          <Webcam
            ref={webCamRef}
            className="rouned-md w-full lg:h-[720px]"
            muted
            mirrored={true}
          />
          {/* canvas */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-9999 w-full lg:h-[720px]"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
