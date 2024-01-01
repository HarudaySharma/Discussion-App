import { Link } from 'react-router-dom';

function Home() {
  return (
    <main className='selection:bg-gray7 mx-auto  py-4 text-center bg-gray10 max-w-7xl flex flex-col  items-center  rounded-[12px]'>
      <section className='mx-2 p-4 rounded-[12px]   outline outline-violet9 max-w-4xl flex flex-col items-center gap-3 '>
        <h2 className='mx-auto  w-fit  text-3xl'>
          Welcome to Discussion App!
        </h2>
        <h3 className='text-xl'>
          Ask, Answer, Connect. Enjoy!
        </h3>
        <p className='text-center laptop:w-2/3'>
          Join us on Discussion App — where every question sparks a conversation and every answer fosters learning.
           Dive in, explore, and let the discussions begin!
        </p>
      </section>
      <footer className='my-4 mx-2 items-center flex flex-col gap-3  max-w-4xl text-violet12 '>
        <Link to="/questions/panel">
          <p
            className={' outline-gray11 bg-violet9 text-gray5 hover:outline-violet9 hover:bg-gray8 hover:text-black outline  rounded-[4px] p-4 font-bold text-center place-self-center uppercase tracking-widest shadow-violet11 hover:shadow-[0_2px_18px] disabled:outline-none disabled:bg-gray11 disabled:text-black'}
          >
            head to question panel
          </p>
        </Link>
        <div className='hover:outline-violet9 hover:shadow-[0_2px_18px]  text-gray6  outline-gray11 bg-violet9 flex flex-col gap-2 items-center flex-wrap outline  p-4 rounded-[14px]'>
          <Link to='/sign_up'>
            <p
              className=' w-fit  hover:text-gray12 text-xl font-bold border-b-4  border-b-gray11 hover:border-b-gray12'>
              create an account
            </p>
          </Link>
          <Link to='/sign_in'>
            <p
              className=' w-fit hover:text-gray12 text-xl font-bold border-b-4  border-b-gray11 hover:border-b-gray12'>
              sign in
            </p>
          </Link>
        </div>

      </footer>
    </main>
  )
}

export default Home;