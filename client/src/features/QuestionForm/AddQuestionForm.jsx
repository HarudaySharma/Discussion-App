import React, { useState } from 'react'
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux'
import { updateSubject } from '../../redux/subjectSlice.js'

import * as Select from '@radix-ui/react-select'
import InputContainer from '../../components/InputContainer'
import DialogBox from '../../components/DialogBox'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import snackBar from '../../components/snackBar.js'




function AddQuestionForm({ className }) {
    let dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const allSubjects = useSelector((state) => state.subjects)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [questionsOfSubject, setQuestionsOfSubject] = useState(null);

    
    const onSubjectChange = (e) => {
        setFormData({ ...formData, subjectName: e.target.value });
    }

    const getQuestions = () => {
        const sub = allSubjects?.find((subject) => subject.name === questionsOfSubject)

        return (
            sub.questionArray.map((obj) =>
                <SelectItem
                    key={obj.question}
                    value={obj.question}
                >
                    {obj.question}
                </SelectItem>
            )
        )
    }

    const handleAddDialogClose = () => {
        setQuestionsOfSubject(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDialogOpen(false);

        try {
            console.log(formData);
            const res = await fetch(`/server/user/annexing/question/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            if (!res.ok) {
                if (data?.accessToken === false) {
                    snackBar({ error: true, message: "Access Token Expired || Sign In", timeout: "2000" })
                    return
                }
                snackBar({ error: true, message: data.message });
                console.log(res);
                return;
            }
            snackBar({ customPurple: true, message: "Question Added" });

            dispatch(updateSubject({ subject: data }))

        }
        catch (err) {
            snackBar({ error: true, message: "Request Error" });
            console.error(err);
        }
    }

    return (
        !currentUser ?
            <Link to='/sign_in'>
                <p
                    className={'mt-4 text-center mx-auto w-fit outline-gray11 bg-violet9 text-gray5 hover:outline-violet9 hover:bg-gray8 hover:text-black outline  rounded-[4px] p-4 font-bold  place-self-center uppercase tracking-widest shadow-violet11 hover:shadow-[0_2px_18px] disabled:outline-none disabled:bg-gray11 disabled:text-black'}
                >
                    LogIn to Ask Questions
                </p>
            </Link>
            :
            allSubjects && <main className='mt-4 text-center mx-auto'>
                <DialogBox
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    dialogDescription={`Create your question here. Click save when you're done.`}
                    dialogTitle={'Write your Question'}
                    onSaveChanges={handleSubmit}
                    triggerButtonText={'Ask a Question'}
                    submitBtnValue={'Add question'}
                    onCrossBtnClick={handleAddDialogClose}
                    onPointerDownOutside={handleAddDialogClose}
                    onEscapeKeyDown={handleAddDialogClose}
                    triggerBtnClassName={'py-[8px] px-[15px] text-lg text-violet11 shadow-blackA4 rounded-[4px] bg-gray2  outline outline-violet8  hover:bg-gray2 hover:outline-violet9 font-medium  shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black '}

                >
                    <section className='flex gap-x-3 mb-4'>
                        <InputContainer
                            labelAdd={false}
                            type={'text'}
                            placeholder={'add a new subject'}
                            id={'newSubject'}
                            name={'subject'}
                            onChangeFnc={onSubjectChange}
                            fieldSetClassnames="inline-flex flex-1 items-center justify-center leading-none  outline-none"
                            inputClassNames={`text-violet11 shadow-violet7 focus:shadow-violet8 w-full h-full px-[10px]  rounded-[4px]  text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]`}
                        />

                        <Select.Root onValueChange={(subjectName) => {
                            setFormData({ ...formData, subjectName })
                            setQuestionsOfSubject(subjectName);

                        }}
                        >
                            <Select.Trigger
                                className='inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none'
                                aria-label='subjects'
                            >
                                <Select.Value placeholder="existing subjects..." />
                                <Select.Icon>
                                    <ChevronDownIcon />
                                </Select.Icon>
                            </Select.Trigger>
                            <Select.Portal >
                                <Select.Content className=" overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                                    <Select.ScrollUpButton className=" flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                                        <ChevronUpIcon />
                                    </Select.ScrollUpButton>
                                    <Select.Viewport className="p-[5px] ">
                                        <Select.Group>
                                            <Select.Label
                                                className="px-[25px] text-xs leading-[25px] text-mauve11"
                                            >
                                                Existing Subjects
                                                <hr className='mb-2 border-gray8' />
                                            </Select.Label >
                                            {
                                                allSubjects?.map((subject) =>
                                                    <SelectItem key={subject.name}
                                                        value={subject.name}>{subject.name}</SelectItem>)
                                            }
                                        </Select.Group>
                                    </Select.Viewport>
                                    <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                                        <ChevronDownIcon />
                                    </Select.ScrollDownButton>

                                </Select.Content>
                            </Select.Portal>
                        </Select.Root>
                    </section>
                    <section className='flex flex-col gap-2'>

                        {Boolean(questionsOfSubject) &&
                            <Select.Root onValueChange={(question) => {
                                setFormData({ ...formData, question, subjectName: questionsOfSubject })
                            }}
                            >
                                <Select.Trigger
                                    className='inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none'
                                    aria-label='subjects'
                                >
                                    <Select.Value placeholder={`${questionsOfSubject} questions...`} />
                                    <Select.Icon>
                                        <ChevronDownIcon />
                                    </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal >
                                    <Select.Content className=" overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                                        <Select.ScrollUpButton className=" flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                                            <ChevronUpIcon />
                                        </Select.ScrollUpButton>
                                        <Select.Viewport className="p-[5px] ">
                                            <Select.Group>
                                                <Select.Label
                                                    className="px-[25px] text-xs leading-[25px] text-mauve11"
                                                >
                                                    {questionsOfSubject}
                                                    <hr className='mb-2 border-gray8' />
                                                </Select.Label >
                                                {
                                                    getQuestions()
                                                }
                                            </Select.Group>
                                        </Select.Viewport>
                                        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                                            <ChevronDownIcon />
                                        </Select.ScrollDownButton>

                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        }
                        <textarea
                            rows={4}
                            cols={30}
                            className="py-2 resize-none text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-32 w-full flex-1 items-center justify-center rounded-[4px] px-[5px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            placeholder='write your question'
                        >
                        </textarea>
                    </section>
                </DialogBox>
            </main>
    )
}

const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
    return (
        <Select.Item
            className={`text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 ${className}`}
            {...props}
            ref={forwardedRef}
        >
            <Select.ItemText>{children}</Select.ItemText>
            <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                <CheckIcon />
            </Select.ItemIndicator>
        </Select.Item>
    );
});



export default AddQuestionForm