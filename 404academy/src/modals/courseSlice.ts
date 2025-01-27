// src/redux/features/courseSlice.ts (or .js)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courses: [],
};

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setCourses(state, action) {
            state.courses = action.payload;
        },
        // Add other reducers as needed
    },
});

export const { setCourses } = courseSlice.actions;
export default courseSlice.reducer;
