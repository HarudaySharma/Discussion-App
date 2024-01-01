import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { addNewAnswer, emptyAnswersState } from '../../redux/answersSlice.js';
import { updateSubjectQuestion } from '../../redux/subjectSlice.js';

import DialogBox from '../../components/DialogBox';
import snackBar from '../../components/snackBar';



function AddAnswer({ subjectId, questionId, savedAnswers, className }) {
    // console.log("Add answer");
    const dispatch = useDispatch();
    const [answer, setAnswer] = useState('');

    const { meta, answers } = useSelector(state => state.answers);
    const { currentUser } = useSelector(state => state.user);
    const [dialogOpen, setDialogOpen] = useState(false);

    /* NOTE: 
        * I called the async function at unmounting time (return) but the global state answers value was being visible after two re-renders
        * but when called at mounting time everything works as expected
    */
    useEffect(() => {

        async function saveAnswers() {

            // console.log("in async fnc");
            // console.log(answers);
            if (!(Boolean(answers) && Boolean(answers.length))) {
                // console.log("no req for adding answer");
                return;
            }
            // console.log("meta", meta)
            try {

                dispatch(emptyAnswersState());
                const res = await fetch(`/server/user/annexing/new_answer/${meta.subjectId}/${meta.questionId}/${meta.userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ answers }),
                })
                const data = await res.json();
                if (!res.ok) {
                    if (data?.accessToken === false) {
                        snackBar({ error: true, message: "Access Token Expired || Sign In", timeout: "2000" })
                        return
                    }
                    snackBar({ error: true, message: data.message });
                    console.log(res);
                    return;
                }
                dispatch(updateSubjectQuestion({ newSubject: data.subject }));


            }
            catch (err) {
                snackBar({ error: true, message: "Request Error" });
                console.log(err);
            }
        }
        saveAnswers();
    }, [subjectId, questionId])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setDialogOpen(false);
        if (!answer.length) return;
        let ans = answer.trim();
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].answer === ans) {
                snackBar({ customGray: true, message: "Answer exists", timeout: 2000 })
                setAnswer('');
                return;
            }
        }
        for (let i = 0; i < savedAnswers.length; i++) {
            if (ans === savedAnswers[i].answer && currentUser.username === savedAnswers[i].author.username) {
                snackBar({ customGray: true, message: "Answer exists", timeout: 2000 })
                setAnswer('');
                return;
            }
        }

        dispatch(addNewAnswer(questionId, subjectId, ans, currentUser.username, currentUser.profilePicture, currentUser._id))
        snackBar({ customGray: true, message: "Answer added" });
        setAnswer('');

    }
    console.log(answer);
    return (

        Boolean(currentUser) && <DialogBox
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            dialogDescription={`Write your answer here. Click submit when you're done.`}
            dialogTitle={'Write an Answer'}
            onSaveChanges={handleSubmit}
            triggerButtonText={'Add Answer'}
            submitBtnValue={'Add answer'}
            triggerBtnClassName={`py-[8px] px-[15px] text-white shadow-blackA4 rounded-[4px] bg-gray10  outline outline-blackA9  hover:bg-gray9 hover:outline-blackA7 font-medium  uppercase tracking-wider shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black ${className}`}
        >
            <fieldset className='mb-[15px]  flex flex-col gap-1'>
                <label htmlFor='answer' className='text-violet11 w-[90px] text-left text-[15px]'>
                    answer
                </label>
                <textarea name="" id="answer" cols="30" rows="10"
                    className="resize-none text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex pt-2 h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                >
                </textarea>
            </fieldset>
        </DialogBox>

    )
}

export default AddAnswer

