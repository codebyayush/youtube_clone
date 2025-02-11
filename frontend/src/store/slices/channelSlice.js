import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: [],
    isChannel: false,
    channelName: "",
    channel: null,
}


const channelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        setChannel: (state, action) => {
            state.channel = action.payload;
        },
        setChannelName: (state, action) => {
            state.channelName = action.payload
        },
    }
});

export const { setChannel, setChannelName } = channelSlice.actions;

export default channelSlice.reducer;