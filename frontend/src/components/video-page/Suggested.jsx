import React from 'react'
import { useSelector } from 'react-redux';


const Suggested = () => {

    const suggestedVideos = useSelector(state => state.video.suggestedVideos);

  return (
    <>
        <div className="lg:w-1/4 w-full">
              <h3 className="text-xl font-semibold mb-4">Suggested Videos</h3>
              <div className="flex flex-col gap-4">
                {suggestedVideos.length > 0 && suggestedVideos.map((video) => (
                  <div
                    key={video._id}
                    className="flex gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt="Thumbnail"
                      className="w-28 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-sm font-semibold line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {video.uploader}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
    </>
  )
}

export default Suggested;