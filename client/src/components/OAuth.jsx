import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import app from "../firebase.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from "../redux/userSlice.js";
import Button from "./Button.jsx";

const OAuth = () => {
    const { loading } = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleButtonClick = async (e) => {

        try {
            dispatch(signInStart());
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch("/server/auth/sign_in/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/user/profile');
        } catch (err) {
            console.log("was not able to connect to google", err);
            dispatch(signInFailure());
        }
    };
    return (
        <Button inputBtn={false} type="button" value={loading ? 'loading...' : `Proceed with Google`} onClickFnc={handleButtonClick} disabled={loading}
            className={`mb-5 p-4 bg-google-btn text-white outline outline-2 outline-black uppercase tracking-widest hover:bg-google-btn-hover hover:text-black hover:relative hover:left-4 hover:shadow-2xl disabled:bg-slate-400`}
        />

    );
};

export default OAuth;
