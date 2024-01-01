import React from 'react'

function About() {
  return (
    <main className='selection:bg-violet8 mx-auto tracking-wider  py-4 text-left bg-gray10 max-w-7xl flex flex-col   items-center rounded-[12px]'>
      <section className='max-w-4xl flex flex-col items-center gap-3 '>
        <section className='mx-2 p-4 rounded-[12px] outline outline-violet9 hover:outline-violet12 hover:p-6'>
          <h1 className="selection:bg-gray8 ppercase text-3xl mb-2 font-extrabold tracking-widest text-center ">About Me!</h1>
          <p>Hello there! I'm Haruday, a 2nd-year Computer Science undergraduate (Year-2023). This app just as the name sounds let's users make an account and ask Questions, and write answers to the Questions asked by other users or by themselves.</p>
          <p>The project was crafted using MERN Stack, and Redux as a global state management utility. Google firebase services was also used</p>
        </section>

        <section className=" mx-2 p-4 rounded-[12px] outline outline-violet9 hover:bg-gray9 hover:outline-violet12 hover:p-6">
          <h3 className="selection:bg-gray7 uppercase mb-4 text-xl font-extrabold tracking-widest">Key Features:</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <strong className='selection:bg-gray7'>Ask Questions:</strong> Seamlessly post your queries on a wide range of topics, seeking input and expertise from other users.
            </li>
            <li>
              <strong className='selection:bg-gray7'>Answer and Share Knowledge:</strong> Engage with other users by providing answers to questions, sharing your expertise, and contributing to a collective pool of knowledge.
            </li>
            <li>
              <strong className='selection:bg-gray7'>User-Friendly Interface:</strong> This app offers an intuitive and user-friendly interface, making it easy for both newcomers and experienced users to navigate and participate.
            </li>
            <li>
              <strong className='selection:bg-gray7'>Account Management:</strong> Sign up to unlock the full potential of Discussion App, enabling you to post questions, contribute answers, and actively participate in the community.Customize your profile, including your username and profile image, to personalize your presence on the platform.
            </li>
            <li>
              <strong className='selection:bg-gray7'>Question History:</strong> Sign up to unlock the full potential of Discussion App, enabling you to post questions, contribute answers, and actively participate in the community.
              Customize your profile, including your username and profile image, to personalize your presence on the platform.
              Keep track of all the questions you've asked in a dedicated section, allowing you to manage and revisit your inquiries conveniently.
            </li>
            <li>
              <strong className='selection:bg-gray7'>Interactive Responses:</strong> Users can add detailed responses to questions, fostering interactive and insightful discussions within the community.
            </li>
          </ul>
        </section>
        <section className="mx-2 p-4 rounded-[12px] outline outline-violet9 hover:bg-gray9 hover:outline-violet12 hover:p-6">
          <h3 className="selection:bg-gray7 uppercase mb-4 text-xl font-extrabold tracking-widest">Key Objectives:</h3>
          <ul className="flex flex-col gap-2">
            <li><strong className='selection:bg-gray7'>Learning Experience:</strong> The app was developed as a learning project to gain hands-on experience with Express.js, MongoDB, Vite with React, and Redux Tools.</li>
          </ul>
          {/* <p>The choice of these tools reflects a commitment to utilizing industry-standard technologies and frameworks to create a secure, efficient, and enjoyable user experience. Your feedback and support are invaluable as I continue to refine and enhance this project.</p> */}
        </section>
        <p className="selection:bg-gray6 text-right mx-auto underline font-bold">Thank you for Visting!</p>
      </section>
    </main>
  )
}

export default About;