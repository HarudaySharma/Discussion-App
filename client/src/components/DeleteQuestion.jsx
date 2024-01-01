import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from './Button';
import { updateSubject, deleteSubject } from '../redux/subjectSlice';
import { emptyQuestion, deleteQuestionAuthor } from '../redux/questionSlice';
import snackBar from './snackBar';

function DeleteQuestion({ authors, questionId, subjectId, className }) {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const enable = authors?.includes(currentUser?.username);

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/server/user/update/question/${subjectId}/${questionId}/${currentUser._id}`, {
                method: 'DELETE'
            })
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