import { createSlice } from "@reduxjs/toolkit";


const initialState = {}

const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        populateQuestion: {
            reducer(state, action) {
                // console.log(action.payload);
                return action.payload;
            },
            prepare(data, meta) {
                return {
                    payload: {
                        subject: meta,
                        question: data,
                    },
                }
            }
        },
        deleteQuestionAuthor: (state, action) => {
            state.question.authors.splice(state.question.authors.findIndex((author) => author.username === action.payload.author), 1)
        },
        updateQuestion: (state, action) => {
            state.question.question = action.payload.question
        },
        addNewAnswers: (state, action) => {
            state.question.answers.push(action.payload.answers);
        },
        updateAnswers: (state, action) => {
            state.question.answers = action.payload.answers;
        },
        removeAnswer: (state, action) => {
            state.question.answers.splice(state.question.answers.findIndex((obj) => obj.answer === action.payload.answer), 1)

        }
        ,
        emptyQuestion: (state) => {
            return {};
        }
    }
})

// export const currentQuestion = useSelector((state) => state.question); 

export const {
    populateQuestion,
    deleteQuestionAuthor,
    updateQuestion,
    updateAnswers,
    removeAnswer,
    emptyQuestion
} = questionSlice.actions;

export default questionSlice.reducer;