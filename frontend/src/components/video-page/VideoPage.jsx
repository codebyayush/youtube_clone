import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import VideoPlayer from "./VideoPlayer";
import { setComments, setSelectedVideo, setSuggestedVideos } from "../../store/slices/videoSlice";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ThumbsDown, ThumbsUp, CircleUser, SquareUserRound } from "lucide-react";

const VideoPage = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.header.isVisible);
  const comments = useSelector((state) => state.video.comments);
  const video = useSelector((state) => state.video.selectedVideo);
  const suggestedVideos = useSelector((state) => state.video.suggestedVideos);

  const { videoId } = useParams();
  const [newComment, setNewComment] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => setShowFullDescription(!showFullDescription);


    const handleCommentSubmit = () => {
      // Handle comment submission logic here
      console.log("New Comment:", newComment);
      setNewComment(""); // Clear the input after submission
    };



  useEffect(() => {
    //calling the api to get the videos and comments
    const getVideoData = async (videoId) => {
      try {
        const result = await axios.get(
          "http://localhost:4000/getVideo/" + videoId
        );
        
        if (result.status === 200) {

          dispatch(setSuggestedVideos(videoId));
          dispatch(setSelectedVideo(result.data.result));

          //fetching comments using ObjectId of the fetched video
          const commentResults = await axios.get(
            `http://localhost:4000/getComments/${result.data.result._id}`
          );

          if(commentResults.status === 200){
            const allComments = commentResults.data.comments;
            dispatch(setComments(allComments));
          }
        }

      } catch (error) {
        console.log("Error fetching data--", error);
      }
    };

    getVideoData(videoId);
  }, [videoId]);


  return (
    <>
      <div
      className={`p-20 screen-max-7:pt-10 screen-max-7:p-3 ${
        isVisible ? "pl-64" : "pl-24"
      } transition-all duration-300`}
    >
      {video ? (
        <div className="flex flex-col lg:flex-row gap-6 ">
          {/* Left Section: Video Player, Info, and Comments */}
          <div className="lg:w-3/4 w-full">
            {/* Video Player */}
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
              <VideoPlayer videoId={videoId} />
            </div>

            {/* video title and description */}
            <div className="mt-4">
                <h1 className="text-2xl font-bold">{video.title}</h1>

                <p className="text-gray-600 mt-2">
                  {showFullDescription
                    ? video.description
                    : video.description?.slice(0, 150) + (video.description?.length > 150 ? "..." : "")}
                </p>
                {video.description?.length > 150 && (
                  <button
                    className="text-blue-500 font-semibold mt-2"
                    onClick={toggleDescription}
                  >
                    {showFullDescription ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

            {/* video Stats and Uploader Info */}
            <div className="mt-4 flex items-center justify-between ">
              <div className="flex items-center gap-4">
                <CircleUser className="w-10 h-10"/>
                <div className="flex flex-col">

                  <button className="bg-black text-white px-4 py-2 rounded-full">Subscribe</button>
                  <p className="text-xs text-gray-500 mt-3">
                    Published on {new Date(video.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full">
                <ThumbsUp/> {video.likes}
                </button>
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full">
                <ThumbsDown/> {video.dislikes}
                </button>
              </div>
            </div>

            {/* Comment Input Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
              <div className="flex gap-4">
                <SquareUserRound/>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add a public comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-3">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all"
                  onClick={handleCommentSubmit}
                >
                  Comment
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Comments</h3>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-4 mt-5">
                    <SquareUserRound className="w-6 h-6 "/>
                    <div>
                      <h4 className="text-sm font-semibold">{comment.user?.name}</h4>
                      <p className="text-gray-600 text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-600">No comments yet.</div>
              )}
            </div>
          </div>

          {/* Right Section: Suggested Videos */}
          <div className="lg:w-1/4 w-full">
            <h3 className="text-xl font-semibold mb-4">Suggested Videos</h3>
            <div className="flex flex-col gap-4">
              {suggestedVideos.map((video) => (
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
                    <h4 className="text-sm font-semibold line-clamp-2">{video.title}</h4>
                    <p className="text-xs text-gray-500">{video.uploader?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-20 text-4xl text-center">Loading...</div>
      )}
      </div>
    </>
  );
};

export default VideoPage;
