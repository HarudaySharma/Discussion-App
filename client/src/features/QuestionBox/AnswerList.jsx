import React, { useEffect, useState } from 'react'
import Answer from './Answer';


const AnswerList = ({ answers, className, meta }) => {
  const [sortedAnswers, setSortedAnswers] = useState([]);

  useEffect(() => {
    setSortedAnswers([...answers].sort((a, b) => b.likes.length - a.likes.length))
  }, [answers])

  // console.log("at AnswerList", answers);

  return (
    Boolean(answers.length) &&
    <section className={`${className}`}>
      {sortedAnswers.map((obj) =>
        <Answer
          key={`${meta.questionId}${meta.subjectId}${obj.answer}`}
          answer={obj.answer}
          author={obj.author}
          likes={obj.likes}
          meta={{ ...meta, answerId: obj._id }}
          className={' ml-3 mr-8 my-2 flex flex-col gap-3 flex-wrap'}
        />
      )}
    </section>
  )
}


export default AnswerList;