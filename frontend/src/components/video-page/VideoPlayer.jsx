import React from 'react'

const VideoPlayer = ({videoId}) => {
  //we'll get the video URL using videoId
  const videoUrl = `https://www.youtube.com/embed/${videoId}`;

//   console.log('videoURL--',videoUrl)

  return (
    <div className='w-full h-full rounded-md '>
         <iframe
          className='w-full h-full rounded-md overflow-hidden'
          src={videoUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
      ></iframe>
    </div>
  )
};

export default VideoPlayer;