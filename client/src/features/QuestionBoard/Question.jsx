import React from 'react'
import { useDispatch } from "react-redux";
import { populateQuestion } from '../../redux/questionSlice'


const Question = ({ questionObj, meta, index, className }) => {
    const dispatch = useDispatch();

    const handleQuestionClick = (e) => {
        dispatch(populateQuestion(questionObj, meta))

    }
    return (
        <p onClick={handleQuestionClick} className={className}>
           <span
            className='text-gray11 font-medium mr-2'
           >
            {index+1}.
            </span> 
           {questionObj.question}
        </p>
    )
}

export default Question