import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isVisible: false,
}

const headerSlice = createSlice({
    name: "header",
    initialState,
    reducers: {
        isVisibleHandler: (state) => {
            state.isVisible = !state.isVisible;
        },
    },
});

export const { isVisibleHandler } = headerSlice.actions;

export default headerSlice.reducer;
