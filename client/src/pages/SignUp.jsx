import React, { useCallback, useState } from 'react'
import { InputContainer, Button } from '../components'
import  { useNavigate } from 'react-router-dom'

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});


  const handleOnChange = useCallback((e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  },[formData])

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/server/auth/sign_up", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        console.log("HTTP request error", res.status)
        return;
      }
      const data = await res.json();

      console.log("response data:", data);
      navigate('/sign_in');

    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <main className='flex flex-col gap-6 place-content-center mx-auto'>
      <h1>Sign Up</h1>
      <form onSubmit={handleFormSubmit}>
        <InputContainer type="text" labelValue="Username" name="username"
          id="username" required={true} onChangeFnc={handleOnChange} />
        <InputContainer type="email" labelValue="email" name="email"
          id="email" required={true} onChangeFnc={handleOnChange} />
        <InputContainer type="password" labelValue="password" name="password"
          id="password" required={true} onChangeFnc={handleOnChange} />
        <Button inputBtn={true} type={"submit"} value={"Submit"} />
      </form>
    </main>
  )
}

export default SignUp