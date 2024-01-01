import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { deleteAnswer } from '../redux/answersSlice.js'
import { removeAnswer } from '../redux/questionSlice.js';
import { updateSubjectQuestion } from '../redux/subjectSlice.js';

import Button from './Button';
import snackBar from './snackBar.js';


function DeleteAnswer({ answer, author, questionId, subjectId, answerId, className }) {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const enable = (author === currentUser.username);

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!answerId) {
            console.log('locally saved');
            dispatch(deleteAnswer({ answer }))
            return;
        }
        try {
            const res = await fetch(`/server/user/update/answer/${subjectId}/${questionId}/${answerId}/${currentUser._id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (!res.ok) {
                if (data?.accessToken === false) {
                    snackBar({ error: true, message: "Access Token Expired || Sign In", timeout: "2000" })
                    return;
                }
                snackBar({error: true, message: "Sorry!! Internal Server Error"})
                console.error(res);
                return;
            }
            console.log(data);
            dispatch(removeAnswer({ answer }))
            dispatch(updateSubjectQuestion({ newSubject: data }));
        }
        catch (err) {
            snackBar({error: true, message: "Request Error"})
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

export default DeleteAnswer;