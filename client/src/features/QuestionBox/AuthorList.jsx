import React from 'react'

const AuthorList = ({ authors, className, questionId }) => {

    return (
        <ul className={`overflow-scroll textBalance breakWord ${className}`}>
            {authors.map((author) => {
                return <li
                    key={`${author.username}${questionId}`}
                    className='flex gap-1 shadow-[0_1px_4px] outline outline-violet8 tracking-wide bg-gray7 rounded-[16px] px-1 py-1 focus:shadow-[0_0_0_2px] focus:shadow-black'
                >
                    <img className="w-4 h-4 rounded-full relative top-1" src={author?.profilePicture}
                    />
                    <p className=''>
                        {author.username}
                    </p>
                </li>
            })}

        </ul>
    )
}

export default AuthorList;