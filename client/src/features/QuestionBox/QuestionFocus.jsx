import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { updateSubject } from "../../redux/subjectSlice.js"
import { updateQuestion } from '../../redux/questionSlice.js'

import AuthorList from './AuthorList';
import AnswerList from './AnswerList';
import AddAnswer from './AddAnswer';
import DeleteQuestion from '../../components/DeleteQuestion';
import DialogBox from '../../components/DialogBox';
import snackBar from '../../components/snackBar.js';



const QuestionFocus = ({ className }) => {
    const dispatch = useDispatch();
    const { subject, question } = useSelector((state) => state.question)
    const { answers, meta } = useSelector(state => state.answers);
    const { currentUser } = useSelector((state) => state.user);
    const [updatedQuestion, setUpdatedQuestion] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    // useEffect(() => {
    //     console.log("questionFocus mounted");
    //     return () => {
    //         console.log("questionFocus unmounted");
    //     }
    // }, [])
    const handleQuestionUpdate = async (e) => {
        e.preventDefault();
        setDialogOpen(false);
        if (updatedQuestion?.trim() === question.question || updatedQuestion === '') {
            snackBar({ customGray: true, message: "Question not changed" });
            return;
        }

        try {
            const res = await fetch(`/server/user/update/question/${subject.subjectId}/${question._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: updatedQuestion.trim(), username: currentUser.username })
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
            dispatch(updateQuestion({ question: updatedQuestion }));
            dispatch(updateSubject({ subject: data }));
        }
        catch (err) {
            snackBar({ error: true, message: "Request Error" });
            console.error(err)
        }
    }
    const isUsersQuestion = () => {
        return Boolean(question.authors.find((author) => author.username === currentUser?.username))
    }
    // console.log("QuestionFocus");
    return (
        subject &&
        <main className={` ${className} selection:bg-violet5  bg-gray8  text-center  outline outline-violet9 hover:outline-violet10  rounded-[4px]`}>
            <section className='text-left pt-2 flex flex-col flex-wrap gap-4'>
                <section className=' mx-2 flex flex-col '>
                    <label htmlFor="subjectName" className='mb-1 text-[12px] uppercase tracking-wider text-gray11 shadow-violet8'>subject</label>
                    <h3
                        id="subjectName"
                        className='breakWord textBalance mobile:text-justify tab:text-left laptop:text-justify mx-3  max-w-sm   rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2 '>
                        {subject.subjectName}
                    </h3>
                </section>
                <section className=' mx-2 flex flex-col'>
                    <label htmlFor="question" className='mb-1 text-[12px] uppercase tracking-wider text-gray11 shadow-violet8'>question</label>
                    <p
                        id="question"
                        className='breakWord textBalance mobile:text-justify tab:text-left laptop:text-justify mx-3  max-w-lg rounded-[4px] focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet10 px-4 py-2'>
                        {question.question}
                    </p>
                </section>
                <div className='flex justify-between flex-wrap items-start'>
                    <section className='gap-3 mx-4 py-2 grow flex justify-left items-center flex-row flex-wrap'>
                        {isUsersQuestion() &&
                            <DialogBox
                                open={dialogOpen}
                                onOpenChange={setDialogOpen}                                
                                dialogDescription={`Make changes to your question here. Click save when you're done.`}
                                dialogTitle={'Edit Question'}
                                onSaveChanges={handleQuestionUpdate}
                                triggerButtonText={'Edit Question'}
                                submitBtnValue={'Save changes'}
                                triggerBtnClassName={'shrink py-[8px] px-[15px] text-sm text-violet11 shadow-blackA4 rounded-[4px] bg-gray2  outline outline-violet8  hover:bg-gray2 hover:outline-violet9 font-medium  shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black '}
                            >
                                <fieldset className='mb-[15px]  flex flex-col gap-1'>
                                    <label htmlFor='question' className=' text-violet11 w-[90px] text-left text-[15px]'>
                                        Question
                                    </label>
                                    <textarea name="" id="question" cols="30" rows="10"
                                        className="resize-none text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] pt-2 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                        defaultValue={question.question}
                                        onChange={(e) => setUpdatedQuestion(e.target.value)}
                                    >
                                    </textarea>
                                </fieldset>
                            </DialogBox>
                        }

                        <DeleteQuestion
                            authors={question.authors}
                            questionId={question._id}
                            subjectId={subject.subjectId}
                            className={`basis-24 shrink py-2 px-[15px] h-fit text-sm text-red9 shadow-blackA4 rounded-[4px] bg-white outline  outline-red8 hover:outline-red9 font-medium  shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black `}
                        />

                    </section >
                    <section className='my-2 mx-2 flex flex-col'>
                        <label htmlFor="authors" className='mb-1 text-[12px] uppercase tracking-wider text-gray11 shadow-violet8'>
                            asked by
                        </label>
                        <AuthorList
                            authors={question.authors}
                            className='mx-3 w-fit max-w-md flex flex-wrap gap-2  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2 '
                            questionId={question._id}
                        />
                    </section>
                </div>
            </section>
            <section className='text-left mx-2 flex flex-col '>
                <h4 className='mb-1 text-[12px] uppercase tracking-wider text-gray12 shadow-violet8 font-medium'>Answers</h4>
                <section className='max-h-80 overflow-scroll  rounded-[18px] outline outline-violet9 shadow-violet11'>
                    {Boolean(question.answers?.length) && <AnswerList
                        answers={question.answers}
                        className={`flex flex-col justify-left gap-2 `}
                        meta={{ subjectId: subject.subjectId, questionId: question._id }}
                    />}
                    {Boolean(answers?.length) && <AnswerList
                        answers={answers}
                        className={`flex flex-col justify-left gap-2 `}
                        meta={meta}

                    />}
                </section>
            </section>
            <AddAnswer
                subjectId={subject.subjectId}
                questionId={question._id}
                savedAnswers={question.answers}
                className={'flex justify-center flex-wrap my-4 h-12 w-[240px] min-w-fit text-lg'}
            />
        </main>
    )
}

export default QuestionFocus;
