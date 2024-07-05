import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { updateSubject, deleteSubject } from '../redux/subjectSlice.js';
import { emptyQuestion, deleteQuestionAuthor } from '../redux/questionSlice.js';

import Button from './Button';
import snackBar from './snackBar.js';

const API_URL = import.meta.env.VITE_API_URL;

function DeleteQuestion({ authors, questionId, subjectId, className }) {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const enable = Boolean(authors?.find((author) => author.username === currentUser?.username));

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/server/user/update/question/${subjectId}/${questionId}/${currentUser._id}`, {
                method: 'DELETE',
                credentials: 'include',
            }
)
            const data = await res.json()

            if (!res.ok) {
                if (data?.accessToken === false) {
                    snackBar({ error: true, message: "Access Token Expired || Sign In", timeout: "2000" })
                    return
                }
                snackBar({ error: true, message: data.message })
                console.error(res);
                return;
            }
            console.log(data);

            authors.length === 1 ? dispatch(emptyQuestion()) : dispatch(deleteQuestionAuthor({ author: currentUser.username }))
            data.deleteSubject ? dispatch(deleteSubject({ subject: data.subject })) : dispatch(updateSubject({ subject: data.subject }))
            // dispatch(updateSubject({subject: data}));   
        }
        catch (err) {
            snackBar({ error: true, message: "Request Error" });
            console.error(err)
        }
    }
    return (
        enable && <Button
            inputBtn={false}
            value={"delete"}
            type={'button'}
            onClickFnc={handleDelete}
            className={className}
        />
    )
}

export default DeleteQuestion
