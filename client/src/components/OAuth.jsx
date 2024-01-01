import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import app from "../firebase.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from "../redux/userSlice.js";
import Button from "./Button.jsx";
import { IoLogoGoogle } from "react-icons/io5";
import snackBar from "./snackBar.js";

const OAuth = ({ className }) => {
    const { loading } = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleButtonClick = async (e) => {

        try {
            dispatch(signInStart());
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            console.log(result);
            try {
                const res = await fetch("/server/auth/sign_in/google", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: result.user.displayName,
                        email: result.user.email,
                        profilePicture: result.user.photoURL,
                    }),
                });
                if (!res.ok) {
                    const data = await res.json();
                    snackBar({ error: true, message: data.message })
                    dispatch(signInFailure());
                    return;
                }
                const data = await res.json();
                dispatch(signInSuccess(data));
                snackBar({ success: true, message: "Logged in Successfully" });

                navigate('/user/profile');
            }
            catch (err) {
                console.log(err);
                snackBar({ error: true, message: "Request Error" });
                dispatch(signInFailure());
            }

        } catch (err) {
            console.log(err);
            snackBar({ error: true, message: "Not able to connect to google" })
            dispatch(signInFailure());
        }
    };
    return (
            <Button inputBtn={false} type="button" value={loading ? 'loading...' : `Proceed with Google`} onClickFnc={handleButtonClick} disabled={loading}
                className={`${className}`}
                >
                {!loading && <IoLogoGoogle className="inline ml-2 mb-[4px]  h-[20px] w-[20px]" />}
            </Button>

    );
};

export default OAuth;
