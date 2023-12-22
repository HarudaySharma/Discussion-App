import React, { useState, useCallback } from 'react'
import { InputContainer, Button, OAuth } from '../components'

function SignIn() {
  const [formData, setFormData] = useState({});
  const [enterEmail, setEnterEmail] = useState(false);
  console.log(formData);
  const handleOnChange = useCallback((e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }, [formData])

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/server/auth/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!res.ok) {
        console.log("HTTP request error", res.status)
        return;
      }
      const data = await res.json();
      console.log(data);

    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <main className='flex flex-col gap-6 place-content-center mx-auto dark:text-white '>
      <h1>Sign In</h1>
      <form onSubmit={handleFormSubmit}>
        {
          enterEmail
            ?
            <InputContainer type="email" labelValue="email" name="email"
              id="email" required={true} onChangeFnc={handleOnChange} />
            :
            <InputContainer type="text" labelValue="Username" name="username"
              id="username" required={true} onChangeFnc={handleOnChange} />
        }
        <div>Log in Using
          <span className='text-amber-400'>{enterEmail ? "email" : "username"}</span>?
          <span className="text-blue-500 hover:text-red-500" onClick={() => setEnterEmail((prev) => !prev)}>Click here</span>
        </div>
        <InputContainer type="password" labelValue="password" name="password"
          id="password" required={true} onChangeFnc={handleOnChange} />

        <Button inputBtn={true} type={"submit"} value={"Submit"} />

        <OAuth />
      </form>
    </main>
  )
}
export default SignIn