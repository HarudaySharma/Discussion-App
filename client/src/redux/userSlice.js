import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: false,

}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        //sign in reducers
        signInStart: (state, action) => {
            state.loading = true;

        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.error = false;
            state.loading = false;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        //update user reducers
        updateUserStart: (state, action) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.error = false;
            state.loading = false;
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        // delete user reducers
        deleteUserStart: (state, action) => {
            state.loading = true;
            state.error = false;
        },
        deleteUsersSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // sign out reducers
        signOutUserSuccess: (state) => {
            state.loading = false;
            state.error = false;
            state.currentUser = null;
        },
    }
})

export const {
    signInFailure,
    signInStart,
    signInSuccess,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
    deleteUserFailure,
    deleteUserStart,
    deleteUsersSuccess,
    signOutUserSuccess
} = userSlice.actions;

export default userSlice.reducer;