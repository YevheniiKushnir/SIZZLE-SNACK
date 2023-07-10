import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    jwt: "",
    userData: null,
    preferred: [],
  },
  reducers: {
    setJWT(state, action) {
      state.jwt = action.payload;
    },
    setUser(state, action) {
      state.userData = action.payload;
    },
    setPreferred(state, action) {
      state.preferred = action.payload;
    },
    setUserNull(state) {
      state.jwt = "";
      state.userData = null;
      state.preferred = [];
    },
  },
});

export const { setJWT, setUser, setPreferred, setUserNull } = userSlice.actions;
export default userSlice.reducer;
