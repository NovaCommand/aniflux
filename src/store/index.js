import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import animeReducer from "./slices/animeSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        anime: animeReducer,
    },
});

export { store };