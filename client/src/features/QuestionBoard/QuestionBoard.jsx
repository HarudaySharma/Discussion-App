import { useDispatch, useSelector } from "react-redux";

import Subject from './Subject.jsx';
import * as Accordion from '@radix-ui/react-accordion';

import useShortPolling from '../../hooks/useShortPolling.js';
import fetchSubjects from '../../utils/fetchSubjects.js';

const QuestionBoard = ({ className }) => {
  const dispatch = useDispatch();
  useShortPolling(fetchSubjects, 5000, dispatch);

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
