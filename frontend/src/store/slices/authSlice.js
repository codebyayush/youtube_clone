import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginSignupSwitch: true,
  isLoggedIn: false,
  isUserToken: false,
  userName: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    handleLogout: (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    },

    handleLogin: (state) => {
        if(!state.isLoggedIn){
            state.isLoggedIn  = !state.isLoggedIn;
        }
    },

    setIsLoginUsingToken: (state, action) => {
      const isLogIn = action.payload;
      state.isLoggedIn = isLogIn;
    },

    setUserName: (state, action) => {
        state.userName = action.payload;
    },

    loginSignupSwitchHandler: (state) => {
        state.loginSignupSwitch = !state.loginSignupSwitch;
    }
  },
});

export const { handleLogout, handleLogin, loginSignupSwitchHandler, setIsLoginUsingToken, setUserName } = authSlice.actions;

export default authSlice.reducer;
