

const initialState = {
    videos: [],
    isChannel: false,
    channelName: "",
}


const channelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        setChannel: (state, action) => {
            state.isChannel = action.payload
        },
        setChannelName: (state, action) => {
            state.channelName = action.payload
        }
    }
});

export const { setChannel, setChannelName } = channelSlice.actions;

export default channelSlice.reducer;