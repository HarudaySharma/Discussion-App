import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const subjectSlice = createSlice({
    name: "subject",
    initialState,
    reducers: {
        populateSubjects: (_, action) => {
            return action.payload;
        },

        updateSubject: (state, action) => {
            if (!action.payload.subject) return;
            let index = state.findIndex((subject) => subject._id === action.payload.subject._id)
            // new subject added ? or old is to be modified 
            // console.log(index);
            index === -1 ? state.push(action.payload.subject) : state.splice(index, 1, action.payload.subject);

        },
        updateSubjectQuestion: (state, action) => {
            const { newSubject } = action.payload
            state.splice(state.findIndex(sub => sub._id === newSubject._id), 1, newSubject);

        },
        deleteSubject: (state, action) => {
            state.splice(state.findIndex(subject => subject._id === action.payload.subject._id), 1)
        }
    }
})

// export const allSubjects = useSelector((state) => state.subjects);


export const {
    populateSubjects,
    updateSubject,
    updateSubjectQuestion,
    deleteSubject
} = subjectSlice.actions;

export default subjectSlice.reducer;
