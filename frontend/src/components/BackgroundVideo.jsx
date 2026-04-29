import React from 'react';

const BackgroundVideo = () => {
  return (
    <video autoPlay muted loop playsInline id="bg-video">
      <source src="/assets/bg-video.mp4" type="video/mp4" />
    </video>
  );
};

export default BackgroundVideo;
