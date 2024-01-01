import React, { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import  InputContainer from '../components/InputContainer'
import  Button from '../components/Button'
import snackBar from '../components/snackBar';

import { IoIosEye, IoIosEyeOff } from "react-icons/io";



function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [passType, setPassType] = useState("password");
  const [eyePosition, setEyePosition] = useState("bottom-8")
  const [formData, setFormData] = useState({});

  const handlePassToggle = (e) => {
    e.stopPropagation();
    passType === "password" ? setPassType("text") : setPassType("password");
    setShowPass((prev) => !prev);
  };

  const handleOnChange = useCallback((e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }, [formData])

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/server/auth/sign_up", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        snackBar({ error: true, message: data.message });
        setLoading(false);
        return;
      }
      const data = await res.json();
      snackBar({success: true, message: data.message});
      navigate('/sign_in');
      setLoading(false);
    }
    catch (err) {
      snackBar({error: true, message: "Request Error"});
      setLoading(false);
      console.log(err);
    }
  }
  console.log(formData)
  return (
    <main className='bg-gray8 max-w-3xl  sm:justify-normal  h-screen text-center gap-4 mx-auto flex flex-col  place-items-center md:justify-center outline outline-violet9 hover:outline-violet10  rounded-[4px]'>
      <h1 className='text-4xl tracking-wider font-medium text-blackA9 shadow-blackA4 drop-shadow-2xl '>Sign Up</h1>
      <form onSubmit={handleFormSubmit} className=' w-2/3 p-4  rounded-[14px] bg-gray9  flex flex-col flex-wrap gap-4'>
        <InputContainer
          type="text"
          labelValue="Username"
          labelAdd={true}
          name="username"
          id="username"
          required={true}
          onChangeFnc={handleOnChange}
          fieldSetClassnames={'  w-full p-2 flex flex-col text-left '}
          labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
          inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
        />
        <InputContainer
          type="text"
          labelValue="name"
          labelAdd={true}
          name="name"
          id="name"
          required={false}
          onChangeFnc={handleOnChange}
          fieldSetClassnames={'  w-full p-2 flex flex-col text-left '}
          labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
          inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
        />
        <InputContainer
          type="email"
          labelValue="email"
          name="email"
          id="email"
          required={true}
          onChangeFnc={handleOnChange}
          labelAdd={true}
          fieldSetClassnames={'  w-full p-2 flex flex-col text-left '}
          labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
          inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
        />
        <InputContainer type={passType}
          labelValue="password"
          labelAdd={true}
          name="password"
          id="password"
          required={true}
          onChangeFnc={handleOnChange}
          onFocusFnc={() => setEyePosition("bottom-10")}
          onBlurFnc={() => setEyePosition('bottom-8')}
          fieldSetClassnames={'  w-full p-2 flex flex-col text-left '}
          labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
          inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
        >
          <span
            className={`w-fit relative ${eyePosition} left-full -mx-10 hover:cursor-pointer`}
            onClick={handlePassToggle}
          >
            {showPass ? <IoIosEye size={25} /> : <IoIosEyeOff size={25} />}
          </span>
        </InputContainer>
        <Button
          inputBtn={true}
          type={"submit"}
          value={loading ? 'loading...' : `Submit`}
          className={'outline-gray12 bg-violet9 text-gray3 hover:outline-violet9 hover:bg-gray8 hover:text-black outline w-fit max-w-lg rounded-[4px] p-2  text-center place-self-center uppercase tracking-widest '}
        />
        <Link to='/sign_in' className='px-2 text-left w-fit'>
        <Button
            inputBtn={false}
            type={"text"}
            value={"sign in"}
            disabled={false}
            className={'text-xs text-left w-fit outline-gray11 bg-gray8 text-violet12   hover:outline-violet9 hover:bg-violet9 hover:text-gray3 outline rounded-[4px]  p-2  uppercase tracking-widest shadow-violet11 hover:shadow-[0_2px_18px] disabled:outline-none disabled:bg-gray11 disabled:text-black'}
          />
          </Link>
      </form>
    </main>
  )
}

export default SignUp