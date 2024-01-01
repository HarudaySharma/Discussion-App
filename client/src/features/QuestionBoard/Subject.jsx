import React from 'react'

import Question from './Question'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons';


const AccordionItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item
        className={`focus-within:shadow-mauve12 mt-px overflow-scroll first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px] ${className}`}
        {...props}
        ref={forwardedRef}
    >
        {children}
    </Accordion.Item>
));

const AccordionTrigger = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="flex">
        <Accordion.Trigger
            className={`text-xl text-violet11 shadow-violet6 hover:bg-violet2 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-2  text-[15px] leading-none shadow-[0_1px_0] outline-wdwd outline-gray11 mx-1 my-1 border-b-2 border-gray11 rounded-[8sspx] ${className}`}
            {...props}
            ref={forwardedRef}
        >
            {children}
            <ChevronDownIcon
                className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                aria-hidden
            />
        </Accordion.Trigger>
    </Accordion.Header>
));

const AccordionContent = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
        className={`overflow-scroll  text-violet11 bg-violet3 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp  text-[15px]' ${className}`}
        {...props}
        ref={forwardedRef}
    >
        {children}
    </Accordion.Content>
));



const Subject = ({ subject, className, index }) => {
    return (
        Boolean(subject) && <AccordionItem value={`item-${index}`}>
            <AccordionTrigger>{subject.name}</AccordionTrigger>
            <AccordionContent
            className={``}
            >
                {subject.questionArray.map((obj, index) => {
                    return (
                        <Question
                            key={`${subject._id}${obj._id}`}
                            questionObj={obj}
                            meta={{ subjectName: subject.name, subjectId: subject._id }}
                            index={index}
                            className={'breakWord textBalance mobile:text-justify tab:text-left py-[15px] laptop:text-justify px-2 m-2  overflow-scroll  border-b-2 border-gray11 '}
                        />
                    )
                })
                }
            </AccordionContent>
        </AccordionItem>

    )
}

export default Subject