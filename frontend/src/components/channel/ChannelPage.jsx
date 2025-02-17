import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../loader/Loader";
import "./addVideo.css";
import AddFileButton from "./AddFileButton";


const ChannelPage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [channel, setChannel] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoArr, setVideoArr] = useState([]);

  const { channelId } = useParams();

  // fetching the channel and then the videos on component mount
  useEffect(() => {
    const fetchChannelAndVideos = async () => {
      try {
        // fetching channel
        const result = await axios.get(
          `http://localhost:4000/fetchChannel/${channelId}`,
          { withCredentials: true }
        );
  
        if (result.status === 200) {
          setChannel(result.data.result);
          setImageUrl(result.data.result.channelBanner);
  
          // fetching videos
          const videos = [];
          for (let i = 0; i < result.data.result.videos.length; i++) {
            try {
              const video = await axios.get(
                `http://localhost:4000/getVideoBy_id/${result.data.result.videos[i]}`,
                { withCredentials: true }
              );
  
              if (video.status === 200 && video.data.result) {
                // checking for duplicates before adding video to the videos array
                if (!videos.some((v) => v._id === video.data.result._id)) {
                  videos.push(video.data.result);
                }
              }
            } catch (error) {
              console.log("Error fetching video:", error);
            }
          }
  
          // updating the state once all videos are fetched
          setVideoArr(videos);
        }
      } catch (err) {
        console.log("Error fetching channel:", err);
      }
    };
  
    fetchChannelAndVideos();
  }, [channelId]);

  console.log("videoArr---", videoArr);

  //onchange video handler
  const onChangeHandler = (e) => {
    e.preventDefault();
    // console.log(e.target.files);

    const file = e.target.files[0];
    // console.log("file---", file);

    setVideoFile(file);
  };

  //on submit video handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Please select a video file");
      return;
    }

    //uploading the video
    const formData = new FormData();

    console.log("videoFile---", videoFile);

    formData.append("videoFile", videoFile);

    try {
      const result = await axios.post(
        `http://localhost:4000/addVideo/${channelId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("result---", result);

      if (result.status === 200) {
        console.log("video uploaded successfully");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error uploading video:", error);
    }
  };

  //delete handler 
  const deleteVideo = async (videoId) => {

    try {

      const result = await axios.delete(`http://localhost:4000/deleteVideo/${videoId}`, {
        withCredentials: true
      });

      if(result.status === 200){
        console.log("video deleted successfully");
        window.location.reload();
      }
      
    } catch (error) {
      console.log("Error deleting video:", error);
    }
  };

  return (
    <div className="w-full h-fit bg-gray-100 pt-16 screen-max-12:p-20">
      {/* channel Banner */}

      {channel ? (
        <>
          <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 pt-5">
            {/* cover image */}
            {imageUrl && (
              <img
                className="w-full h-full max-w-5xl m-auto rounded-lg object-cover"
                src={imageUrl}
                alt="Channel Banner"
              />
            )}
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* channel logo */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-300">
                  {channel && (
                    <img
                      src={imageUrl}
                      alt="Channel Logo"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                {/* channel details */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {channel?.channelName}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {channel?.subscribers} subscribers
                  </p>
                </div>
              </div>
              {/* subscribe button */}
              <button className="mt-4 sm:mt-0 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors">
                Subscribe
              </button>
            </div>

            {/* navigation tabs */}
            <div className="flex overflow-x-auto space-x-6 border-b-2 border-gray-300 mt-6">
              {[
                "Home",
                "Videos",
                "Playlists",
                "Shorts",
                "Live",
                "Community",
              ].map((tab) => (
                <button
                  key={tab}
                  className="py-2 px-4 text-sm sm:text-base font-semibold text-gray-700 hover:text-black hover:underline whitespace-nowrap"
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* videos section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3 w-full">
              {videoArr.length > 0 ? (
               videoArr.map((video) => {
                
                return (
                    <div
                        key={video._id}
                        className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        {/* video thumbnail */}
                        <div className="w-full h-40 sm:h-48 bg-gray-200 rounded-lg overflow-hidden">
                            {video.thumbnailUrl && (
                                <img
                                    src={video.thumbnailUrl}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        {/* video details */}
                        <div className="mt-4">
                            <h2 className="text-lg font-bold">{video.title}</h2>
                            <p className="text-gray-600 text-sm">
                                {video.description}
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Uploaded by: {video.uploader}
                            </p>
                            <button 
                                onClick={() => deleteVideo(video.videoId)} 
                                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );

              })
              ) : (
                <>
                  {/* upload video */}
                  <form
                    onSubmit={onSubmitHandler}
                    className="flex flex-col items-center gap-2 pr-2 "
                  >
                    <p>No videos found</p>
                    <label htmlFor="file" className="custum-file-upload">
                      {/* upload icon */}
                      <div className="icon">
                        <svg
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                              fill=""
                            ></path>{" "}
                          </g>
                        </svg>
                      </div>
                      <div className="text">
                        <span>Click to upload Video</span>
                      </div>
                      <input
                        id="file"
                        type="file"
                        accept="video/*"
                        onChange={onChangeHandler}
                      />
                    </label>
                    <button
                      type="submit"
                      className="px-4 py-2 w-1/2 bg-gray-300 rounded-full hover:bg-gray-400"
                    >
                      Upload
                    </button>
                  </form>
                </>
              )}

            {videoArr.length > 0 && (
              <div className=" m-auto relative">
                <AddFileButton submitHandler={onSubmitHandler} onChangeHandler={onChangeHandler} fileName={videoFile}/>
              </div>
            )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center -mt-20 items-center h-screen">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
