import { createSlice } from "@reduxjs/toolkit";

// we'll filter out the videos by tag so
// taking 2 separate state one to store the data permanently
// and one to filter out from the videos
const initialState = {
  videos: [],
  filteredVideos: [],
  selectedVideo: null,
  comments: [],
  liked: false,
  disliked: false,
  suggestedVideos: [],
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setSuggestedVideos: (state, action) => {
      const videoId = action.payload;

      state.suggestedVideos = state.videos.filter(
        (video) => video.videoId !== videoId
      );
    },

    setSelectedVideo: (state, action) => {
      state.selectedVideo = action.payload;
    },

    searchFilter: (state, action) => {
      const searchQuery = action.payload.toLowerCase();
      // console.log("videoSlice search query---", searchQuery);

      const validVideos = state.videos.filter(video => video.title);

      //filtering out the videos only if the search query matches the video title
      const filtered = validVideos.filter((video) => {
        // console.log("video title from slice---",video.title.toLowerCase());
        // console.log("match---", video.title.toLowerCase().includes(searchQuery));

        return (video.title.toLowerCase()).includes(searchQuery);
      });

      console.log('filtered videos---', filtered)

      // if the filtered array is empty then we'll show all the videos
      state.filteredVideos = filtered.length ? filtered : state.videos;
    },

    filterByTag: (state, action) => {
      const tag = action.payload;

      if (tag == "All") {
        state.filteredVideos = state.videos;
        return;
      }

      state.filteredVideos = state.videos.filter(
        (video) => video.category == tag
      );
    },

    //we'll filter out the videos by tag so
    // taking 2 separate state one to store the data permanently
    // and one to filter out from the videos
    addAllVideos: (state, action) => {
      const allVideos = action.payload;

      if (state.videos.length !== 0) {
        const videos = allVideos.filter((video) => {
          // inner loop must return a boolean value
          return state.videos.some((data) => {
            return data._id === video._id;
          });
        });

        state.videos = [...state.videos, videos];
        state.filteredVideos = [...state.filteredVideos, videos];
      } else {
        state.videos = allVideos;
        state.filteredVideos = allVideos;
      }
    },

    //add all comments
    setComments: (state, action) => {
      state.comments = action.payload;
    },

    //adding a new comment object
    addNewComment: (state, action) => {
      state.comments = [...state.comments, action.payload];
    },

    updateComment: (state, action) => {
      const updatedComment = action.payload;
      state.comments = state.comments.map((comment) => {
        if (comment._id === updatedComment._id) {
          return updatedComment;
        }
        return comment;
      });
    },

    deleteComment: (state, action) => {
      const commentId = action.payload;
      state.comments = state.comments.filter(
        (comment) => comment._id !== commentId
      );
    },

    likeVideo: (state, action) => {
      state.selectedVideo = {
        ...state.selectedVideo,
        likes: state.selectedVideo.likes + 1,
      };
    },

    dislikeVideo: (state, action) => {
      state.selectedVideo = {
        ...state.selectedVideo,
        dislikes: state.selectedVideo.dislikes + 1,
      };
    },
  },
});

export const {
  filterByTag,
  addAllVideos,
  setComments,
  setSelectedVideo,
  setSuggestedVideos,
  addNewComment,
  updateComment,
  deleteComment,
  likeVideo,
  dislikeVideo,
  searchFilter,
} = videoSlice.actions;

export default videoSlice.reducer;
