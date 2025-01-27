import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: [],
};

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        filterByTag: () => {
            
        },


    }
})

export default videoSlice.reducer;