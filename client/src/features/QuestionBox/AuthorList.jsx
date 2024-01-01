import React from 'react'

const AuthorList = ({ authors, className , questionId}) => {
    
    return (
        <ul className={`overflow-scroll textBalance breakWord ${className}`}>
            {authors.map((author, index) => {
                return  <li key={ `${author}${questionId}`} className='flex gap-1 bg-gray7 rounded-[14px] p-1'>
                    <img className="w-4 h-4 rounded-full relative top-1" src='https://firebasestorage.googleapis.com/v0/b/discusssion-app.appspot.com/o/1704098603135komeko.gif?alt=media&token=aec354a5-6328-44c4-95f9-c5b1d61115ad'
                    />
                    <p className=''>
                    {author}{index !== authors.length-1 && ',' } 
                    </p>
                    </li>
            })}

        </ul>
    )
}

export default AuthorList;