import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import VideoPlayer from "./VideoPlayer";
import {
  setComments,
  setSelectedVideo,
  setSuggestedVideos,
  addNewComment,
  updateComment,
  dislikeVideo,
  likeVideo,
} from "../../store/slices/videoSlice";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  ThumbsDown,
  ThumbsUp,
  CircleUser,
  SquareUserRound,
} from "lucide-react";
import Suggested from "./Suggested";
import { deleteComment } from "../../store/slices/videoSlice";


const VideoPage = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.header.isVisible);
  const comments = useSelector((state) => state.video.comments);
  const video = useSelector((state) => state.video.selectedVideo);
  const suggestedVideos = useSelector((state) => state.video.suggestedVideos);
  const [editingComment, setEditingComment] = useState({ id: null, text: "" });

  const { videoId } = useParams();
  const [newComment, setNewComment] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [channelBanner, setChannelBanner] = useState("");

  //toggling full description
  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  //adding a new comment to the video
  const handleCommentSubmit = async () => {
    try {
      if (newComment.trim() !== "") {
        //fetching video just to take the ObjectId from it and
        //save it in the comment
        const videoResult = await axios.get(
          "http://localhost:4000/getVideo/" + videoId
        );
        if (videoResult.status === 200) {
          const result = await axios.post(
            "http://localhost:4000/addComment",
            {
              videoId: videoResult.data.result._id,
              text: newComment,
            },
            {
              withCredentials: true,
            }
          );

          // console.log("new comment result---",result);

          if (result.status === 201) {
            const commentObj = {
              _id: result.data.comment._id,
              text: result.data.comment.text,
              user: result.data.comment.user,
              timestamp: result.data.comment.timestamp,
            };

            dispatch(addNewComment(commentObj));
          }
          setNewComment("");
        }
      } else {
        alert("Please enter a comment");
      }
    } catch (error) {
      console.log("Error submitting comment--", error);
    }
  };

  //handling like and dislike
  const handleLike = async (videoId) => {
    const result = await axios.put(`http://localhost:4000/likeVideo/${videoId}`,{}, {
      withCredentials: true
    });

    console.log("LIKEEEE YEAAAAAAAAAAAAAAAAAAAH----", result);

    if (result.status === 200) {
      console.log("Successfully liked video");
      dispatch(likeVideo(videoId));
    }
  };
  const handleDislike = async (videoId) => {
    const result = await axios.put(`http://localhost:4000/dislikeVideo/${videoId}`,{}, {
      withCredentials: true
    });

    console.log("DISLIKEEEE YEAAAAAAAAAAAAAAAAAAAH----", result);

    if (result.status === 200) {
      dispatch(dislikeVideo(videoId));
      console.log("Successfully disliked video");
    }
  };

  //editing comment using commentId and saving it
  const handleSaveEdit = async (comment) => {
    try {
      const result = await axios.put(`http://localhost:4000/editComment/${comment._id}`, {
        text: editingComment.text,
      }, {
        withCredentials: true
      });

      if (result.status === 200) {
        console.log("edited comment--", result);
        const updatedComment = result.data.comment;
        dispatch(updateComment(updatedComment));
        setEditingComment({ id: null, text: "" });
      }
    } catch (error) {
      console.log("Error editing comment--", error);
    }
  };

  //onclicking of edit button we'll open textarea to edit
  const handleEditComment = (comment) => {
    setEditingComment({ id: comment._id, text: comment.text });
  };

  //deleting comment from db then updating the state
  const handleDeleteComment = async (commentId) => {
    try {
      const result = await axios.delete(`http://localhost:4000/deleteComment/${commentId}`, {
        withCredentials: true
      });
      if (result.status === 200) {
        console.log("commentId---",commentId);
        dispatch(deleteComment(commentId));
      }
    } catch (error) {
      console.log("Error deleting comment--", error);
    }
  };

  useEffect(() => {
    //calling the api to get the videos and comments
    const getVideoData = async (videoId) => {
      try {
        const result = await axios.get(
          "http://localhost:4000/getVideo/" + videoId
        );
        //suggesting videos except current video
        if (result.status === 200) {
          dispatch(setSuggestedVideos(videoId));
          dispatch(setSelectedVideo(result.data.result));


          //fetching the channel banner from channel route
          const fetchChannel = await axios.get(
            `http://localhost:4000/fetchChannel/${result.data.result.channelId}`);

          if (fetchChannel.status === 200) {
            // dispatch(setSelectedVideo(fetchChannel.data.result));
            console.log("channel result---",fetchChannel.data.result);
            setChannelBanner(fetchChannel.data.result.channelBanner);
          };

          //fetching comments using ObjectId of the fetched video
          const commentResults = await axios.get(
            `http://localhost:4000/getComments/${result.data.result._id}`
          );

          if (commentResults.status === 200) {
            const allComments = commentResults.data.comments;
            dispatch(setComments(allComments));
          };
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
        className={`p-20 screen-max-7:pt-48 screen-max-7:p-3 ${
          isVisible ? "pl-64" : "pl-24"
        } transition-all duration-300`}
      >
        {video ? (
          <div className="flex flex-col lg:flex-row gap-6 ">
            {/* left section- video player, info, and comments */}
            <div className="lg:w-3/4 w-full">
              {/* Video Player */}
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                <VideoPlayer videoId={videoId} />
              </div>

              {/* video title and description */}
              <div className="mt-4 border-b">
                <h1 className="text-2xl font-bold">{video.title}</h1>

                <p className="text-gray-600 mt-2">
                  {showFullDescription
                    ? video.description
                    : video.description.slice(0, 100) +
                      (video.description.length > 100 ? "..." : "")}
                </p>
                {video.description?.length > 100 && (
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

                  <img alt="profile" src={channelBanner}  className="w-10 shadow-lg border border-gray-300 h-10 rounded-full" />
                  <div className="flex flex-col">
                    <div className="flex gap-5">
                    <h4 className="text-base font-medium mt-2">{video.uploader}</h4>
                    <button className="bg-black text-white px-4 py-2 rounded-full">
                      Subscribe
                    </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Published on{" "}
                      {new Date(video.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handleLike(video._id)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full">
                    <ThumbsUp /> {video.likes}
                  </button>
                  <button onClick={() => handleDislike(video._id)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full">
                    <ThumbsDown /> {video.dislikes}
                  </button>
                </div>
              </div>

              {/* comment input section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
                <div className="flex gap-4">
                  <CircleUser className="mt-2" />
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

              {/* comments section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold">Comments</h3>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex flex-col sm:flex-row gap-4 mt-0 border-b p-4 rounded-lg bg-white"
                    >
                      <div className="flex items-center gap-4">
                        <SquareUserRound className="w-10 h-10 rounded-full bg-gray-200" />
                        <div>
                          <h4 className="text-sm font-semibold">
                            {comment.user ? "You" : "user"}
                          </h4>
                          <p className="text-gray-500 text-xs">
                            {new Date(comment.timestamp)
                              .toLocaleString()
                              .slice(0, 10)}
                          </p>
                        </div>
                      </div>

                      {/* conditionally redering textarea on edit click */}
                      <div className="flex-1 overflow-hidden">
                        {editingComment.id === comment._id ? (
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none "
                            rows="3"
                            value={editingComment.text}
                            onChange={(e) =>
                              setEditingComment({
                                ...editingComment,
                                text: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <p className="text-gray-600 text-sm">
                            {comment.text}
                          </p>
                        )}
                      </div>
                        
                      {comment.user && (
                        <div className="flex items-center gap-2 self-start sm:self-center mt-2 sm:mt-0">
                          {editingComment.id === comment._id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(comment)}
                                className="text-blue-600 hover:underline text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() =>
                                  setEditingComment({ id: null, text: "" })
                                }
                                className="text-red-600 hover:underline text-sm"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="text-gray-600 hover:underline text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-red-600 hover:underline text-sm"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600">No comments yet.</div>
                )}
              </div>
            </div>

            {/* right section- suggested videos */}
            {suggestedVideos.length > 0 && <Suggested />}
          </div>
        ) : (
          <div className="p-20 text-4xl text-center">Loading...</div>
        )}
      </div>
    </>
  );
};

export default VideoPage;
