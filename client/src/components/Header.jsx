import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from '../assets/logo.ico'

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <header className="mb-4 mt-1 rounded-[4px] bg-gray9 outline  outline-violet9  shadow-[0_2px_12px] shadow-violet9 hover:shadow-[0_2px_24px] hover:shadow-violet11 font-mono   flex flex-wrap justify-between items-center max-w-screen-2xl mx-auto p-4 md:pointer-events-auto ">
            <Link to="/">
                
                    <img
                        src={`${logo}`}
                        className="absolute top-0 w-16 h-16 rounded-full object-cover hover:w-20">
                    </img>
                
            </Link>
            <nav>
                <ul className="flex gap-4 ">
                    <Link to="/">
                        <li className="text-gray12 hover:text-violet12 hover:decoration-gray11 tracking-wide hover:font-bold hover:underline  hover:tracking-widest">Home</li>
                    </Link>
                    <Link to="/questions/panel">
                        <li className="text-gray12 hover:text-violet12 hover:decoration-gray11 tracking-wide hover:font-bold hover:underline  hover:tracking-widest">
                            Questions
                        </li>
                    </Link>
                    <Link to="/about">
                        <li className=" text-gray12 hover:text-violet12 hover:decoration-gray11 hover:font-bold hover:underline  hover:tracking-widest">About</li>
                    </Link>
                    {currentUser ? (
                        <Link to="/user/profile">
                            <li className=" text-gray12 hover:text-violet12 hover:decoration-gray11 tracking-wide hover:font-bold hover:underline  hover:tracking-widest">
                                <img
                                    src={currentUser.profilePicture}
                                    alt="profile"
                                    className="w-7 h-7 rounded-full object-cover relative bottom-[2px]"
                                />
                            </li>
                        </Link>
                    ) : (
                        <Link to="/sign_in">
                            <li className="text-gray12 hover:text-violet12 hover:decoration-gray11 hover:font-bold hover:underline  hover:tracking-widest">SignIn</li>
                        </Link>
                    )}
                </ul>
            </nav>
        </header>
    );
}
