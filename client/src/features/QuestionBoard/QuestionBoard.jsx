import React, { useEffect } from 'react'

import { useDispatch, useSelector } from "react-redux";
import { populateSubjects } from '../../redux/subjectSlice.js'

import Subject from './Subject.jsx';
import * as Accordion from '@radix-ui/react-accordion';
import snackBar from "../../components/snackBar.js"

const API_URL = import.meta.env.VITE_API_URL;


const QuestionBoard = ({ className }) => {
  const dispatch = useDispatch();

  useEffect(() => {

    async function fetchSubjects() {
      try {
        const res = await fetch(`${API_URL}/server/data/all_available/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 'operation': 'fetch all questions' }),
          credentials: 'include',
        });

        const data = await res.json();
        if (!res.ok) {
          snackBar({ error: true, message: data.message });
          console.log(res);
        }
          //console.log(data);
        dispatch(populateSubjects(data));
        if (!data?.length) {
          snackBar({ customPurple: true, message: "No Questions Found", timeout: 4000 })
        }
      }
      catch (err) {
        snackBar({ error: true, message: "Request Error" })
        console.log(err);
      }
    }

    fetchSubjects();
  }, [dispatch])
  const allSubjects = useSelector((state) => state.subjects);

  return (

    <Accordion.Root
      draggable={true}
      className={`overflow-scroll bg-violet6  rounded-md shadow-[0_2px_10px] shadow-black/5 ${className}`}
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

export default QuestionBoard;
