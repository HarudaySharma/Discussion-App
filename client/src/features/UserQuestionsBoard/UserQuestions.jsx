import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { populateSubjects } from '../../redux/subjectSlice.js'

import Subject from '../QuestionBoard/Subject.jsx';
import * as Accordion from '@radix-ui/react-accordion';
import snackBar from "../../components/snackBar.js";


const UserQuestions = ({ className }) => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user)
    useEffect(() => {
        async function fetchQuestions() {
            try {
                const res = await fetch(`/server/user/retrieve/questions/${currentUser._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                const data = await res.json();
                if (!res.ok) {
                    if (data?.accessToken === false) {
                        snackBar({ error: true, message: "Access Token Expired || Sign In", timeout: "2000" })
                        return
                    }
                    snackBar({ error: true, message: data.message });
                    console.error(res);
                    return;
                }
                dispatch(populateSubjects(data));
                if (!data?.length) {
                    snackBar({ customPurple: true, message: "No User Questions Found", timeout: 4000 });
                }
                // console.log(data);
            }
            catch (err) {
                snackBar({ error: true, message: "Request Error" })
                console.log(err)
            }
        }
        fetchQuestions();
    }, [currentUser])

    const allSubjects = useSelector((state) => state.subjects);

    return (

        <Accordion.Root
            className={`overflow-scroll bg-violet6 w-3xl rounded-md shadow-[0_2px_10px] shadow-black/5 ${className}`}
            type="single"
            defaultValue="item-0"
            collapsible
        >
            {allSubjects && allSubjects.map((subject, index) =>
                <Subject
                    key={subject._id}
                    subject={subject}
                    index={index}
                    className={``}
                />
            )}
        </Accordion.Root>
    )
}

export default UserQuestions;
