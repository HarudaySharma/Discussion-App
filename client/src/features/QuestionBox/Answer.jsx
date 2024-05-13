import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { modifyLikeOfAnswer, modifyAnswer } from '../../redux/answersSlice.js';
import { updateSubjectQuestion } from "../../redux/subjectSlice.js"

import DialogBox from '../../components/DialogBox';
import DeleteAnswer from '../../components/DeleteAnswer';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import snackBar from '../../components/snackBar.js';

const Answer = ({ answer, author, likes, meta, className }) => {
  const dispatch = useDispatch();
  const hasComponentBeenRendered1 = useRef(false);
  const { currentUser } = useSelector((state) => state.user)

  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatedAnswer, setUpdatedAnswer] = useState(answer)
  const [liked, setLiked] = useState(likes?.includes(currentUser?._id) ? true : false);
  const [likeCount, setLikeCount] = useState(likes.length);
  const { subjectId, questionId, answerId } = meta;


  // console.log(liked, likeCount, likes.length);
  // useEffect(() => {
  //   console.log("mounted", hasComponentBeenRendered1);
  //   return () => {
  //     console.log("unmounted")
  //   }
  // }, [])

  useEffect(() => {
    if (!hasComponentBeenRendered1.current) {
      //console.log("initial")
      hasComponentBeenRendered1.current = true;
      return;
    }
    if (!answerId) {
      dispatch(modifyLikeOfAnswer({ answer, liked }));
      return;
    }
    async function updateLike() {
      try {
        const res = await fetch(`/server/user/annexing/answer_update_like/${subjectId}/${questionId}/${answerId}/${currentUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ like: liked }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (data?.accessToken === false) {
            snackBar({ error: true, message: "Access Token Expired || Sign In", timeout: "2000" })
            return
          }
          snackBar({ error: true, message: "Error" })
          return;
        }
        dispatch(updateSubjectQuestion({ newSubject: data.subject }));

      }
      catch (err) {
        snackBar({ error: true, message: "Request Error" });
        console.error(err);
      }
    }
    updateLike();
  }, [liked])



  const handleEditDialogClose = (e) => {
    // console.log("at dialogCLose")
    setUpdatedAnswer(answer);
  }

  const handleAnswerUpdate = async (e) => {
    e.preventDefault();
    setDialogOpen(false);
    if (updatedAnswer?.trim() === answer || !updatedAnswer.length) {
      snackBar({ customPurple: true, message: "No changes seen" })
      setUpdatedAnswer(answer);
      return;
    }
    if (!answerId) {
      console.log('locally save answer');
      dispatch(modifyAnswer({ answer, updatedAnswer: updatedAnswer.trim() }))
      return;
    }
    try {
      const res = await fetch(`/server/user/update/answer/${subjectId}/${questionId}/${answerId}/${currentUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: updatedAnswer.trim() }),
      })

      const data = await res.json();
      if (!res.ok) {
        if (data?.accessToken === false) {
          snackBar({ error: true, message: "Access Token Expired || Sign In", timeout: "2000" })
          return
        }
        snackBar({ error: true, message: data?.message })
        setUpdatedAnswer(answer);
        console.error(res);
        return;
      }
      // console.log(data);
      dispatch(updateSubjectQuestion({ newSubject: data }));
    }
    catch (err) {
      snackBar({ error: true, message: "Request Error" })
      console.error(err);
    }
  }

  const handleLikeClick = (e) => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => liked ? prev - 1 : prev + 1);
  }

  return (
    <section className={`${className}`}>
      <section
        className={'shadow-[0_2px_12px] shadow-violet11 flex justify-between flex-wrap pl-4 pr-2 py-1 rounded-[8px] outline outline-gray11 '}
      >
        <p
          className=' max-w-screen-laptop breakWord overflow-scroll'
        >{updatedAnswer}</p>
            {
              Boolean(currentUser) &&
              <p onClick={handleLikeClick} className='text-black w-fit hover:cursor-pointer'>
                    {liked ? <HeartFilledIcon className='inline-block mx-[1px] ' /> : <HeartIcon className='inline-block mb-[2px] mx-[2px]' />}
                    {likeCount}
              </p>
            }
      </section>
      <section className='flex justify-between flex-wrap'>
        <div
          className={`flex gap-1 outline h-fit outline-violet8 bg-gray7 rounded-[16px] px-2 py-1  shadow-[0_1px_4px]  tracking-wide  focus:shadow-[0_0_0_2px] focus:shadow-black`} >
          <img className="w-4 h-4 rounded-full relative top-1" src={author?.profilePicture} />
          <p className=''>
            {author.username}
          </p>
        </div>
        <section className='px-1 self-end flex flex-wrap gap-2  justify-start'>
          {currentUser?.username === author.username &&
            <DialogBox
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onCrossBtnClick={handleEditDialogClose}
              onPointerDownOutside={handleEditDialogClose}
              onEscapeKeyDown={handleEditDialogClose}
              dialogTitle={'Update Answer'}
              dialogDescription={`Make changes to your answer here. Click save when you're done.`}
              onSaveChanges={handleAnswerUpdate}
              triggerButtonText={'Edit Your Answer'}
              triggerBtnClassName={' grow py-[8px] px-[15px] text-sm text-violet11 shadow-blackA4 rounded-[4px] bg-gray2  outline outline-violet8  hover:bg-gray2 hover:outline-violet9 font-medium  shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black '}
              submitBtnValue={'Save changes'}
            >
              <fieldset className='mb-[15px] flex flex-col items-center gap-5'>
                <label htmlFor='answer' className='text-violet11 w-[90px] text-right text-[15px]'>
                  answer
                </label>
                <textarea name="" id="answer" cols="30" rows="10"
                  className="resize-none text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  defaultValue={updatedAnswer}
                  onChange={(e) => setUpdatedAnswer(e.target.value)}
                >
                </textarea>
              </fieldset>
            </DialogBox>
          }
          <DeleteAnswer
            answer={answer}
            author={author.username}
            subjectId={subjectId}
            questionId={questionId}
            answerId={answerId}
            className={`basis-14 grow py-2 px-[15px] h-fit text-sm text-red9 shadow-blackA4 rounded-[4px] bg-white outline  outline-red8 hover:outline-red9 font-medium  shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black `}
          />
        </section>
      </section>
    </section>
  )
}

export default Answer;
