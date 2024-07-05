import React, { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice.js'

import  InputContainer from '../components/InputContainer.jsx'
import  Button from '../components/Button.jsx'
import  OAuth from '../components/OAuth.jsx'
import snackBar from "../components/snackBar.js";

import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const API_URL = import.meta.env.VITE_API_URL;


function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading} = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [usingEmail, setUsingEmail] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [passTtype, setPassType] = useState("password");
  const [eyePosition, setEyePosition] = useState("bottom-8")

  const handlePassToggle = (e) => {
    e.stopPropagation();
    passTtype === "password" ? setPassType("text") : setPassType("password");
    setShowPass((prev) => !prev);
  };

  const handleOnChange = useCallback((e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }, [formData])

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${API_URL}/server/auth/sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json();
        snackBar({error: true, message: data.message});
        dispatch(signInFailure())
        return;
      }
      const data = await res.json();
      console.log(data);
      dispatch(signInSuccess(data))
      snackBar({success: true, message: "Logged in Successfully"});
      navigate('/user/profile');

    }
    catch (err) {
      console.log(err);
      snackBar({error: true, message: "Request not sent || Check Connection"})
      dispatch(signInFailure())
    }
  }
  return (
    <main className='bg-gray8 max-w-3xl  sm:justify-normal  h-screen text-center gap-4 mx-auto flex flex-col  place-items-center md:justify-center outline outline-violet9 hover:outline-violet10  rounded-[4px]'>
      <h1
        className='text-4xl tracking-wider font-medium text-blackA9 shadow-blackA4 drop-shadow-2xl '
      >
        Sign In
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className=' w-2/3 p-4  rounded-[14px] bg-gray9  flex flex-col flex-wrap gap-4'
      >
        <section className=''>
        {
          usingEmail
            ?
            <InputContainer type="email" labelValue="email" name="email"
              id="email" required={true} onChangeFnc={handleOnChange}
              labelAdd={true}
              fieldSetClassnames={'  w-full p-2 flex flex-col text-left '}
              labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
              inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
            />
            :
            <InputContainer type="text" labelValue="Username" name="username"
              id="username" required={true} onChangeFnc={handleOnChange}
              labelAdd={true}
              fieldSetClassnames={'  w-full p-2 flex flex-col text-left '}
              labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
              inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
            />
        }
        <div className={' px-2 w-fit justify-between flex gap-2 flex-wrap'}
          onClick={() => setUsingEmail((prev) => !prev)}
        >
          <span className={`inline-block pt-2 text-xs  uppercase tracking-wide text-center ${!usingEmail && 'text-gray12 font-bold'}`}>username</span>
          {usingEmail ?  <FaToggleOn className='w-8 h-8' /> : <FaToggleOff className='w-8 h-8' /> }
          <span className={`inline-block pt-2 text-xs uppercase tracking-wide text-center  ${usingEmail && 'text-gray12 font-bold'}`}>email</span>
        </div>

        </section>
        <InputContainer
          type={passTtype}
          labelValue="password"
          name="password"
          id="password"
          required={true}
          onChangeFnc={handleOnChange}
          onFocusFnc={() => setEyePosition("bottom-10")}
          onBlurFnc={() => setEyePosition('bottom-8')}
          labelAdd={true}
          fieldSetClassnames={' mb-4 w-full p-2 flex flex-col text-left '}
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
          className={' outline-gray12 bg-violet9 text-gray3 hover:outline-violet9 hover:bg-gray8 hover:text-black outline max-w-lg rounded-[4px] mb-5 p-4 w-fit text-center place-self-center uppercase tracking-widest shadow-violet11 hover:shadow-[0_2px_18px] disabled:outline-none disabled:bg-gray11 disabled:text-black'}

        />

        <OAuth
          className={' outline-gray12 bg-violet9 text-gray3 hover:outline-violet9 hover:bg-gray8 hover:text-black outline max-w-lg rounded-[4px] mb-5 p-4 w-fit text-center place-self-center uppercase tracking-widest shadow-violet11 hover:shadow-[0_2px_18px] disabled:outline-none disabled:bg-gray11 disabled:text-black'}
        />
        <Link to='/sign_up' className=' text-left w-fit'>
        <Button
            inputBtn={false}
            type={"text"}
            value={"sign up"}
            disabled={false}
            className={'text-xs text-left w-fit outline-gray11 bg-gray8 text-violet12   hover:outline-violet9 hover:bg-violet9 hover:text-gray3 outline rounded-[4px]  p-2  uppercase tracking-widest shadow-violet11 hover:shadow-[0_2px_18px] disabled:outline-none disabled:bg-gray11 disabled:text-black'}
          />
          </Link>
      </form>

    </main>
  )
}
export default SignIn
