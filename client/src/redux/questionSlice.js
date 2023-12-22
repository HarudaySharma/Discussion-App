import { createSlice, nanoid } from "@reduxjs/toolkit";
import {useSelector} from "react-redux"

const {answer, author, likes} = useSelector((state) => state.answer)

const initialState = {
    question: "",
    authors: [],
    Answers: [
        {
            answer,
            author,
            likes,
        }
    ]
}

const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        addQuestion: (state, action) => {
            state.question = action.payload;
            state.authors.push(action.payload);
            state.Answers = action.payload;
        }
    }
})

export const {addQuestion} = questionSlice.actions;

export default questionSlice.reducer;