import React, { useRef, useState, useCallback, useEffect } from 'react'
import { InputContainer, Button } from "../components"
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/userSlice.js"
import {signOutUserSuccess} from "../redux/userSlice.js"

import { useSelector, useDispatch } from 'react-redux'
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase.js";
import { Navigate } from 'react-router-dom';

function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [image, setImage] = useState(undefined);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [imageUploadPercent, SetImageUploadPercent] = useState(0);
  const [formData, setFormData] = useState({});

  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

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


  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/user/updatecred/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if(!res.ok) {
        console.log("update unsuccessfull");
      }

      const data = await res.json();

      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      setUpdateSuccess(true);
      dispatch(updateUserSuccess(data));
    }
    catch(err) {
      console.log(err);
      setUpdateSuccess(false);
      dispatch(updateUserFailure(err))

    }
  }

  const handleSignOut = async(e) => {
    try {
      const res = await fetch("/auth/sign_out/");
      if(res.status === 200) {
        dispatch(signOutUserSuccess());
      }
    }
    catch(err) {
      console.log(err);
    }

  }
  return (
    <main className='flex'>
      <h1 className='text-3xl uppercase'>Profile</h1>
      <form onSubmit={handleOnSubmit}>
        <section>

          <input type="file" ref={fileRef}
            accept='/image/*'
            onChange={(e) => setImage(e.target.files[0])} hidden
          />
          <img src={formData.profilePicture || currentUser.profilePicture}
            onClick={() => fileRef.current.click()} />

          <p className="mt-4">
            {imageUploadError ? (
              <span className="text-red-700 ">
                Error uploading (image size should be less than 2mb)
              </span>
            ) : imageUploadPercent > 0 && imageUploadPercent < 100 ? (
              <span className="text-red-700">
                {imageUploadPercent}% uploaded!!
              </span>
            ) : imageUploadPercent == 100 ? (
              <span className="text-green-700">uploaded successfully!!</span>
            ) : (
              ""
            )}
          </p>

        </section>
        <InputContainer  type={"text"} name={'username'} labelValue={"username"} value={currentUser.username} required={true} onChangeFnc={handleOnChange} />
        <InputContainer type={"email"} name={"email"} labelValue={"e-mail"} value={currentUser.email} required={true} onChangeFnc={handleOnChange} />
        <InputContainer type={"password"} name={"password"} labelValue={"password"} value={currentUser.password} required={true} onChangeFnc={handleOnChange} />

        <Button inputBtn={false} type={"text"} value={"Sign Out"} onClickFnc={handleSignOut} className={'text-orange-300 hover:text-red-400'}  />
      </form>
    </main>
  )
}

export default Profile