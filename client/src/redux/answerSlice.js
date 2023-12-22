import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    answer: null,
    author: null,
    likes: null,
}

const answerSlice = createSlice({
    name: "answers",
    initialState,
    reducers: {
        addNewAnswer: (state, action) => {
            state.answer = action.payload;
            state.author = action.payload;
            state.likes = action.payload;
        }
    }
})

export const {addNewAnswer} = answerSlice.actions;

export default answerSlice.reducer;