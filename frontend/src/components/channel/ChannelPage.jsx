import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../loader/Loader";

const ChannelPage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [channel, setChannel] = useState(null);

  const { channelId } = useParams();

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const result = await axios.get(
          `http://localhost:4000/fetchChannel/${channelId}`,
          {
            withCredentials: true,
          }
        );

        if (result.status === 200) {
          console.log(
            "channel banner result---",
            result.data.result.channelBanner
          );
          setChannel(result.data.result);
          setImageUrl(result.data.result.channelBanner);
        }
      } catch (err) {
        return console.log("Error fetching channel:", err);
      }
    };

    fetchChannel();
  }, []);

  // console.log("imageURL---", imageUrl);

  return (
    <div className="w-full h-screen bg-gray-100 pt-16 screen-max-12:p-20">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {channel?.videos?.length > 0 ? (
                channel.videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {/* video thumbnail */}
                    <div className="w-full h-40 sm:h-48 bg-gray-200 rounded-lg overflow-hidden">
                      {video.thumbnail && (
                        <img
                          src={video.thumbnail}
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
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex flex-col justify-center ">
                    <p className="text-gray-600">no videos available</p>
                    <label
                      htmlFor="video-upload"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded cursor-pointer"
                    >
                      Add a video
                    </label>
                    <input
                      type="file"
                      id="video-upload"
                      className="hidden"
                      accept="video/*"
                      onChange={(e) => {
                        // handle the video file here
                        const file = e.target.files[0];
                        if (file) {
                          console.log("Selected video:", file);
                        }
                      }}
                    />
                  </div>
                </>
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
