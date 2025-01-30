import { createSlice } from "@reduxjs/toolkit";

// we'll filter out the videos by tag so 
// taking 2 separate state one to store the data permanently
// and one to filter out from the videos
const initialState = {
    videos: [],
    filteredVideos: [],
    selectedVideo: null,
    comments: [],
    suggestedVideos: [],
};

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {

        setSuggestedVideos: (state, action) => {
            const videoId = action.payload;

            state.suggestedVideos = state.videos.filter(video => video.videoId !== videoId);
        },

        setSelectedVideo: (state, action) => {
            state.selectedVideo = action.payload;
        },

        filterByTag: (state, action) => {
            const tag = action.payload;

            if(tag == "All"){
                state.filteredVideos = state.videos
                return;
            }
            
            state.filteredVideos = state.videos.filter(video => video.category == tag)
        },

        //we'll filter out the videos by tag so 
        // taking 2 separate state one to store the data permanently
        // and one to filter out from the videos
        addAllVideos: (state, action) => {

            const allVideos = action.payload;

            if(state.videos.length !== 0){
                const videos = allVideos.filter((video) => {
                    // inner loop must return a boolean value
                    return state.videos.some(data => {
                        return data._id === video._id
                    });  
                });

                state.videos = [...state.videos, videos];
                state.filteredVideos = [...state.filteredVideos, videos];
            }
            else{
                state.videos = allVideos;
                state.filteredVideos = allVideos;
            };
        },


        setComments: (state, action) => {
            state.comments = action.payload;
        },


    }
})

export const { filterByTag, addAllVideos, setComments, setSelectedVideo, setSuggestedVideos } = videoSlice.actions;

export default videoSlice.reducer;