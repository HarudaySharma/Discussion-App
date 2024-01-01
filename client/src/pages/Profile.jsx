import React, { useRef, useState, useCallback, useEffect } from 'react'
import { InputContainer, Button } from "../components"
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/userSlice.js"
import { signOutUserSuccess } from "../redux/userSlice.js"

import { useSelector, useDispatch } from 'react-redux'
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase.js";
import { Navigate, useNavigate } from 'react-router-dom';
import UserQuestions from '../features/UserQuestionsBoard/UserQuestions.jsx'
import QuestionFocus from '../features/QuestionBox/QuestionFocus.jsx'
import DialogBox from '../components/DialogBox.jsx'
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import AlertDialog from '../components/AlertDialog.jsx'

import snackBar from '../components/snackBar.js'


function Profile() {
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [image, setImage] = useState(undefined);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [imageUploadPercent, SetImageUploadPercent] = useState(0);
  const [formData, setFormData] = useState(currentUser);

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [showPass1, setShowPass1] = useState(false);
  const [passType1, setPassType1] = useState("password");
  const [showPass2, setShowPass2] = useState(false);
  const [passType2, setPassType2] = useState("password");
  const [eyePosition, setEyePosition] = useState("bottom-8")


  const handlePass1Toggle = (e) => {
    e.stopPropagation();
    passType1 === "password" ? setPassType1("text") : setPassType1("password");
    setShowPass1((prev) => !prev);


  };
  const handlePass2Toggle = (e) => {
    e.stopPropagation();
    passType2 === "password" ? setPassType2("text") : setPassType2("password");
    setShowPass2((prev) => !prev);
  };

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);


  useEffect(() => {
    if (imageUploadError) {
      setImageUploadError(false)
      snackBar({ error: true, message: "Image size > 4mb || Not Permitted!!", timeout: "4000" });
    }
    if (imageUploadPercent === 100) {
      SetImageUploadPercent(0);
    }
  }, [imageUploadError, imageUploadPercent])

  const handleImageUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;

    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        SetImageUploadPercent(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      }
    );
  }
  const handleOnChange = useCallback((e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }, [formData])



  const handleAccountDelete = async (e) => {
    try {
      const res = await fetch(`/server/user/update/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (!res.ok) {
        if (data?.accessToken === false) {
          snackBar({ error: true, message: "Access Token Expired || Sign In", timeout: "2000" })
          return
        }
        snackBar({ error: true, message: "Internal Server Error", timeout: "3000" })
        return;

      }
      snackBar({ success: true, message: "Account Deletion Successfull!!", timeout: "3000" })
      navigate('/Sign_up');
      return;


    }
    catch (err) {
      snackBar({ error: true, message: "Check your connection", timeout: "2000" })

      console.log(err)
    }
  }
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.rePassword) {
      snackBar({ customGray: true, message: "Password Mismatch", timeout: "3000" })
      return;

    }
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/server/user/update/cred/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();
      if (!res.ok) {
        if (data?.accessToken === false) {
          snackBar({ error: true, message: "Access Token Expired || Sign In", timeout: "2000" })
          return
        }
        snackBar({ error: true, message: data.message, timeout: "2000" })
        return;
      }

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        snackBar({ error: true, message: "Updation Failed", timeout: "2000" })
        return;
      }
      setUpdateSuccess(true);
      dispatch(updateUserSuccess(data));
      snackBar({ success: true, message: "Account updated Successfully", timeout: "2000" })
    }
    catch (err) {
      snackBar({ eror: true, message: "Erro Sending request | Check your connection" });
      console.log(err);
      setUpdateSuccess(false);
      dispatch(updateUserFailure(err))

    }
  }

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/auth/sign_out/");
      if (res.status === 200) {
        dispatch(signOutUserSuccess());
        snackBar({ customPurple: true, message: "User Signed Out" })
        navigate('/');
      }
    }
    catch (err) {
      console.log(err);
    }

  }

  return (
    <main className='mx-auto py-4 bg-gray10 max-w-7xl rounded-[12px] gap-4 flex mobile:flex-col  tab:flex-row '>
      <section className='mx-4 mobile:basis-full tab:basis-1/3 flex flex-col items-center'>
        <h1
          className='uppercase mb-2 text-4xl text-center tracking-wider font-medium text-blackA9 shadow-blackA4 drop-shadow-2xl '
        >
          Profile
        </h1>
        <form
          className='w-full  p-4 rounded-[14px] bg-gray9  flex flex-col  flex-wrap gap-4'
        >
          <img src={formData.profilePicture || currentUser.profilePicture}
            className=" mx-auto  outline outline-offset-4 shadow-2xl w-48 h-48 rounded-full  hover:w-52 hover:h-52 hover:shadow-violet11"
          />
          <InputContainer
            type={"text"}
            name={'username'}
            labelAdd={true}
            labelValue={"username"}
            value={currentUser.username}
            readOnly={true}
            fieldSetClassnames={' mx-auto p-2 flex flex-col text-left w-full'}
            labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
            inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
          /> <InputContainer
            type={"text"}
            name={'name'}
            labelAdd={true}
            labelValue={"name"}
            value={currentUser.name}
            readOnly={true}
            fieldSetClassnames={'  w-full p-2 flex flex-col text-left '}
            labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
            inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
          />
          <InputContainer
            type={"email"}
            name={"email"}
            labelAdd={true}
            labelValue={"e-mail"}
            value={currentUser.email}
            readOnly={true}
            fieldSetClassnames={' w-full p-2 flex flex-col text-left '}
            labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
            inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
          />


          <DialogBox
            dialogDescription={`Edit your profile here. Click save changes when you're done.`}
            dialogTitle={'Profile'}
            onSaveChanges={handleOnSubmit}
            triggerButtonText={'Edit Profile'}
            submitBtnValue={'Save changes'}
            triggerBtnClassName={' outline-gray12 bg-violet9 text-gray3 hover:outline-violet9 hover:bg-gray8 hover:text-black outline max-w-lg rounded-[4px] mb-5 p-4  text-center place-self-center uppercase tracking-widest shadow-violet11 hover:shadow-[0_2px_18px] disabled:outline-none disabled:bg-gray11 disabled:text-black'}
            buttonElement={
              <AlertDialog
                triggerBtntext={'Delete account'}
                triggerBtnClassName={'text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]'}
                dialogTitle={'Are you absolutely sure?'}
                dialogDescription={`This action cannot be undone. This will permanently delete your account and remove your
            data from the servers.`}
                dialogCancelBtnText={'Cancel'}
                dialogActionBtnText={'Yes, delete account'}
                dialogActionBtnOnClick={handleAccountDelete}
              />}
          >
            <section className='self-center  flex flex-col items-center'>

              <input type="file" ref={fileRef}
                accept='/image/*'
                onChange={(e) => setImage(e.target.files[0])} hidden
              />
              <img src={formData.profilePicture || currentUser.profilePicture}
                onClick={() => fileRef.current.click()}
                className=" outline outline-gray11 outline-offset-2 shadow-2xl w-32 h-32 rounded-full cursor-pointer hover:w-36 hover:h-36 hover:shadow-violet11"
              />

              {imageUploadPercent > 0 && imageUploadPercent < 100 &&
                <p className="mt-4 text-violet11">
                  {imageUploadPercent}% uploaded!!
                </p>
              }

            </section>
            <InputContainer
              type={"text"}
              name={'username'}
              labelAdd={true}
              labelValue={"username"}
              value={formData.username || currentUser.username}
              required={true}
              onChangeFnc={handleOnChange}
              fieldSetClassnames={'  w-full p-2 flex flex-col text-left '}
              labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
              inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
            />
            <InputContainer
              type={"text"}
              name={'name'}
              labelAdd={true}
              labelValue={"name"}
              value={formData.name || currentUser.name}
              required={true}
              onChangeFnc={handleOnChange}
              fieldSetClassnames={'  w-full p-2 flex flex-col text-left '}
              labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
              inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
            />
            <InputContainer
              type={"email"}
              name={"email"}
              labelAdd={true}
              labelValue={"e-mail"}
              value={formData.email || currentUser.email}
              required={true}
              onChangeFnc={handleOnChange}
              fieldSetClassnames={'  w-full p-2 flex flex-col text-left '}
              labelClassnames={'mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
              inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
            />
            <section className='flex flex-wrap'>
              <InputContainer
                type={passType1}
                name={"password"}
                labelAdd={true}
                labelValue={"new password"}
                required={false}
                defaultValue={"bask#78@sd"}
                onChangeFnc={handleOnChange}
                onFocusFnc={() => setEyePosition("bottom-10")}
                onBlurFnc={() => setEyePosition('bottom-8')}
                fieldSetClassnames={'  basis-1/2 p-2 flex flex-col text-left '}
                labelClassnames={'text-center tab:text-left  mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
                inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
              >
                <span
                  className={`w-fit relative ${eyePosition} left-full -mx-10 hover:cursor-pointer`}
                  onClick={handlePass1Toggle}
                >
                  {showPass1 ? <IoIosEye size={25} /> : <IoIosEyeOff size={25} />}
                </span>
              </InputContainer>
              <InputContainer
                type={passType2}
                name={"rePassword"}
                labelAdd={true}
                labelValue={"re-enter new pass"}
                required={false}
                defaultValue={"bask#78@sd"}
                onChangeFnc={handleOnChange}
                onFocusFnc={() => setEyePosition("bottom-10")}
                onBlurFnc={() => setEyePosition('bottom-8')}
                fieldSetClassnames={'  basis-1/2 p-2 flex flex-col text-left '}
                labelClassnames={'text-center tab:text-left mb-1 text-[12px] uppercase tracking-wider text-violet12 shadow-violet8'}
                inputClassNames={'max-w-lg  rounded-[4px]  focus:shadow-[0_0_0_2px] shadow-[0_0_0_1px] outline outline-violet9 shadow-violet11 px-4 py-2  focus:relative w-full   focus:outline-blackA9  focus:py-4 '}
              >
                <span
                  className={`w-fit relative ${eyePosition} left-full -mx-10 hover:cursor-pointer`}
                  onClick={handlePass2Toggle}
                >
                  {showPass2 ? <IoIosEye size={25} /> : <IoIosEyeOff size={25} />}
                </span>
              </InputContainer>
            </section>

          </DialogBox>
          <Button
            inputBtn={false}
            type={"text"}
            value={"Sign Out"}
            onClickFnc={handleSignOut}
            disabled={false}
            className={'text-xs text-left w-fit outline-gray11 bg-gray8 text-violet12   hover:outline-violet9 hover:bg-violet9 hover:text-gray3 outline rounded-[4px]  p-2  uppercase tracking-widest shadow-violet11 hover:shadow-[0_2px_18px] disabled:outline-none disabled:bg-gray11 disabled:text-black'}
          />
        </form>
      </section>
      <div className='flex flex-col tab:basis-2/3'>
        <h1
          className='uppercase mb-2 text-4xl text-center tracking-wider font-medium text-blackA9 shadow-blackA4 drop-shadow-2xl '
        >
          Your Questions</h1>
        <section className='mx-2 gap-2 flex mobile:flex-col  laptop:flex-row tab:basis-full'>
          <UserQuestions
            className={'mobile:max-h-[180px] h-fit mobile:basis-full tab:max-h-[188px] laptop:max-h-[670px] tab:basis-1/3 grow'}

          />
          <QuestionFocus
            className={'mobile:basis-full tab:basis-2/3 grow'}

          />
        </section>
      </div>
    </main>
  )
}

export default Profile