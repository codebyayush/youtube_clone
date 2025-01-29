import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Filter from "./Filter";

const Home = () => {
  const filteredVideos = useSelector((state) => state.video.filteredVideos);
  const isVisible = useSelector(state => state.header.isVisible);

  const dispatch = useDispatch();

  //converts long number to readable format
  function formatViews(views) {
    if (views >= 1_000_000_000) {
      return (views / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (views >= 1_000_000) {
      return (views / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (views >= 1_000) {
      return (views / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return views;
  }

  

  return (
    <>
<div className={`p-20 screen-max-7:pt-44 screen-max-7:p-3
    ${isVisible ? "pl-64" : "pl-24"} 
     transition-all duration-300 `}>
      
  <Filter />

  <div className="flex mt-5 flex-wrap gap-6 min-w-44 screen-max-9:gap-4 screen-max-7:gap-3 screen-max-4:gap-2">
    {filteredVideos.length !== 0 &&
      filteredVideos.map((video) => (
        <div
          key={video._id}
          className={`w-80 screen-max-9:w-72 screen-max-7:w-full 
            ${isVisible ? "screen-max-9:w-64" : "screen-max-9:w-72"}
            bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl`}
        >
          {/* thumbnail */}
          <div className="relative">
            <img
              src={video.thumbnailUrl}
              alt="thumbnail"
              className="w-full h-48 screen-max-7:h-40 screen-max-4:h-32 object-cover"
            />
          </div>

          {/* video title and description */}
          <div className="p-4 screen-max-4:p-3">
            <h3 className="font-semibold text-base screen-max-4:text-sm text-gray-900 mb-2 truncate">
              {video.title}
            </h3>
            <p className="text-sm screen-max-4:text-xs text-gray-600 truncate">
              {video.uploader}
            </p>
            <p className="text-sm screen-max-4:text-xs text-gray-600 flex">
              {formatViews(video.views)} <span className="ml-1">views</span>
            </p>
          </div>
        </div>
      ))}
  </div>
</div>
    </>
  );
};

export default Home;