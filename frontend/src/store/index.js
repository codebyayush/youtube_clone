import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import videoReducer from "./slices/videoSlice";
import channelReducer from "./slices/channelSlice";
import headerReducer from "./slices/headerSlice";


const store = configureStore({
  reducer: {
      auth: authReducer, video: videoReducer, header: headerReducer, channel: channelReducer,
  },
});

export default store;