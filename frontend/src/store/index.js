import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import videoReducer from "./slices/videoSlice";
import headerReducer from "./slices/headerSlice";


const store = configureStore({
  reducer: {
      auth: authReducer, video: videoReducer, header: headerReducer
  },
});

export default store;