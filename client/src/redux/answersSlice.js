import { createSlice } from "@reduxjs/toolkit";

/*
    will contain all the responses, answers added by a user for a particular question
 */

const initialState = {
    meta: {},
    answers: [],
}

const answersSlice = createSlice({
    name: "answers",
    initialState,
    reducers: {
        addNewAnswer: {
            reducer(state, action) {
                state.meta = action.payload.meta;
                state.answers.push(action.payload.answer);
            },
            prepare(questionId, subjectId, answer, username, userId) {
                return {
                    payload: {
                        meta: {
                            subjectId,
                            questionId,
                            userId
                        },
                        answer: {
                            answer,
                            author: username,
                            likes: [],
                        },
                    }

                }
            }
        },
        modifyAnswer: (state, action) => {
            let i = state.answers.findIndex((obj) => obj.answer === action.payload.answer);
            state.answers.at(i).answer = action.payload.updatedAnswer
            
        },
        deleteAnswer: (state, action) => {
            state.answers.splice(state.answers.findIndex((obj) => obj.answer === action.payload.answer), 1);
        },
        modifyLikeOfAnswer: (state, action) => {
            let i = state.answers.findIndex((obj) => obj.answer === action.payload.answer);
            console.log(action, i)
            action.payload.liked && i !== -1 ? state.answers.at(i).likes.push(state.meta.userId) : state.answers.at(i).likes.pop();
        },
        emptyAnswersState: (state) => {
            return initialState;
        }

    }
})

export const { addNewAnswer, modifyAnswer, modifyLikeOfAnswer, deleteAnswer, emptyAnswersState } = answersSlice.actions;

export default answersSlice.reducer;