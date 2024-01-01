import React from 'react'

import QuestionBoard from '../features/QuestionBoard/QuestionBoard'
import QuestionFocus from '../features/QuestionBox/QuestionFocus'
import AddQuestionForm from '../features/QuestionForm/AddQuestionForm'


function QuestionPanel() {
    return (
        <main className=' mx-auto py-4 bg-gray10 max-w-7xl  rounded-[12px]'>
            <h1
                className='selection:bg-gray5 w-fit mx-auto mb-4 text-4xl tracking-wider font-bold text-blackA9 shadow-blackA4 drop-shadow-2xl '
            >
                Question Panel
            </h1>
            <section className='mx-2 gap-2 flex mobile:flex-col  tab:flex-row '>
                <QuestionBoard
                    className={'mobile:max-h-[180px] h-fit mobile:basis-full tab:max-h-[690px] tab:basis-1/3 grow'} />
                <QuestionFocus 
                className={'mobile:basis-full tab:basis-2/3 grow'}
                />
            </section>
            <AddQuestionForm
            className={''}
            />
        </main>

    )
}

export default QuestionPanel