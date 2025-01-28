"use client";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const ObjectDetection = () => {
  const webCamRef = useRef<Webcam>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
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
      <div className="relative flex items-center justify-center gradient p-1.5 rounded-md">
        {/* Webcam */}
        <Webcam
          ref={webCamRef}
          className="rouned-md w-full lg:h-[720px]"
          muted
          mirrored={true}
        />
        {/* canvas */}
      </div>
    </div>
  );
};

export default ObjectDetection;
