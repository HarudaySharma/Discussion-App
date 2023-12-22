import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const {question, authors, Answers} = useSelector((state) => state.question)

const initialState = {
    subject: null,
    questionAskers: [],
    questionArray: [
        {
            question,
            authors,
            Answers
        }
    ]
}

const subjectSlice = createSlice({
    name: "subject",
    initialState,
    reducers: {
        createNewQuestion: (state, action) => {
            state.subject = action.payload;
            state.questionArray.push(action.payload.question);
        }
    }
})


export const {createNewQuestion} = subjectSlice.actions;

export default subjectSlice.reducer;