import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from "./userSlice"
import subjectsReducer from "./subjectSlice"
import questionReducer from "./questionSlice"
import answersReducer from "./answersSlice"

import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";


const persistUserConfig = {
    key: "user",
    version: 1,
    storage,
};

// persisted only the userState
const persistedUserReducer = persistReducer(persistUserConfig, userReducer);


// other Slices will not be persisted so they will populate every time the app starts
// const rootReducer = combineReducers({
//     user: persistedUserReducer,
//     subjects: subjectReducer,
//     question: questionReducer,
//     answer: answerReducer
// })

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        subjects: subjectsReducer,
        question: questionReducer,
        answers: answersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(
            { serializableCheck: false }
        )
});

export const persistor = persistStore(store);
