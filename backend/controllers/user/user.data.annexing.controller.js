import Subjects from "../../models/subject.model.js";
import Users from "../../models/user.model.js";

import createSubject from "../../utils/data/createSubject.js";
import createQuestion from "../../utils/data/createQuestion.js";


/*
*********Implementation*********

* when adding question  
    - if(subject doesn't exists):
        create new sub
      else:
        if(quesstionAskers don't have Author):
            add
        else:
            if(questionArray don't have the question):
                create new question
            else:
                if(authors in the question does'nt include author):
                    include

*/

export const addQuestion = async (req, res, next) => {

    if (req.params.userId !== req.user._id)
        return next(errorHandler(401, "Authentication failed: Not allowed to add a Question"));

    const { subjectName, question, answers } = req.body;

    console.log(answers)
    try {

        const { username } = await Users.findOne({ _id: req.user._id }, { "_id": 0, "username": 1 })
        console.log("username: " + username);

        const Subject = await Subjects.findOne({ name: subjectName?.trim() });
        if (!Subject) {
            console.log("New Subject")
            const subject = createSubject(subjectName?.trim(), question?.trim(), username, answers);

            try {
                console.log(subject);
                const sub = await subject.save();
                console.log("new Subject added");
                res.status(200).json(sub);

            } catch (error) {
                console.log(error);
                console.log("not able to add new Subject")
                res.status(500).json({ message: "Sorry!! Question not Added" });
            }
        }
        else {
            console.log("old Obj", Subject);

            if (!Subject.questionAskers.includes(username)) {
                console.log("new Author in subject");
                Subject.questionAskers.push(username);
            }

            let index = Subject.questionArray.findIndex(ele => ele.question === question.trim());
            if (index === -1) {
                console.log("new question")
                Subject.questionArray.push(createQuestion(question.trim(), username, answers))
                try {
                    const result = await Subject.save();
                    console.log("Question Added successfully")
                    res.status(200).json(result.toObject());
                } catch (err) {
                    console.log(`${err}`, "check connectivity");
                    res.status(501).json({ message: "Sorry!! Question not Added" });
                }
            }
            else {
                console.log("question found")
                if (!Subject.questionArray[index].authors.find(ele => ele === username)) {
                    console.log("new Author for the question")
                    Subject.questionArray[index].authors.push(username);

                    try {
                        const result = await Subject.save();
                        console.log("Author added successfully")
                        res.status(200).json(result.toObject());
                        return;
                    }
                    catch (err) {
                        console.log(`${err}}`, "check connectivity");
                        res.status(501).json({message : "Sorry!! Question not Added"});
                        return;
                    }
                }
                console.log("author found")
                res.status(400).json({message: "Question was already posted by you"});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Internal Server Error" })
    }
}

export const addResponseToQuestion = async (req, res, next) => {

    if (req.user._id !== req.params.userId)
        return next(errorHandler(401, "Authentication failed: Not allowed to add a response"));

    const { answers } = req.body;
    // console.log(req.body)
    const { subjectId, questionId, userId } = req.params;
    try {
        const { username } = await Users.findById(userId, { "username": 1, "_id": 0 });
        console.log(username);
        /* this will find the subject and then the specific question inside it,
         and then adds the answer into the answer array of the question if not present already
        */
        // feature to be addeed: same user can't add the same answer to the same question more than once
        // const result = await Subjects.findOneAndUpdate(
        //     {
        //         _id: subjectId,
        //         'questionArray._id': questionId,
        //         'questionArray.$.answers': { $not: { $elemMatch: { answer, author: username } } }
        //     },
        //     {
        //         $addToSet: {
        //             'questionArray.$.answers': {
        //                 answer,
        //                 author: username,
        //                 likes: 0,
        //             }
        //         },

        //     },
        //     { new: true }
        // )
        console.log(answers);
        const existingAnswersQuery = await Subjects.findOne(
            {
                _id: subjectId,
                'questionArray._id': questionId
            },
            { 'questionArray.answers.answer': 1 }
        );

        // Extract the existing answers from the result
        // check subjects schema for data strucutre
        const existingAnswers = existingAnswersQuery?.questionArray[0]?.answers?.map(obj => obj.answer) || [];
        console.log("existingAnswers", existingAnswers);

        const result = await Subjects.findOneAndUpdate(
            {
                _id: subjectId,
                'questionArray._id': questionId,
                //   'questionArray.$.answers.answer': { $nin: answers },
                //   'questionArray.$.answers.author': username
            },
            {
                $addToSet: {
                    'questionArray.$.answers': {
                        $each: answers.filter(obj => !existingAnswers.includes(obj.answer)).map(obj => ({ answer: obj.answer, author: obj.author, likes: obj.likes }))
                    }
                }
            },
            { new: true }
        );
        console.log("result")
        console.log(result);
        if (!result) {
            res.status(500).json({ message: "Failed to Add Answers" })
            return;
        }
        res.status(200).json({ subject: result})
    }
    catch (err) {
        next(err);
    }
}

export const likeResponseOfQuestion = async (req, res, next) => {
    if (req.params.userId !== req.user._id)
        return next(401, "Authentication failed: Not allowed to like the answer")

    const { userId, subjectId, questionId, answerId } = req.params;
    const { like } = req.body;
    try {
        const result = await Subjects.findOneAndUpdate(
            {
                _id: subjectId,
                'questionArray._id': questionId,
                'questionArray.answers._id': answerId
            },
            (like ?
                {
                    $addToSet: {
                        'questionArray.$.answers.$[answer].likes': userId,
                    }
                } :
                {
                    $pull: {
                        'questionArray.$.answers.$[answer].likes': userId,
                    }
                })
            ,
            {
                arrayFilters: [{ 'answer._id': answerId }],
                new: true,
            },
        )


        if (!result || !result.isDirectModified) {
            next(errorHandler(500, "Answer not in the db"))
            return;
        }
        console.log(result)
        res.status(200).json({ liked: like ? true : false, subject: result })
    }
    catch (err) {
        return next(err);
    }
}




// function AddSubjectToDatabase(Subject, res) {
//     replaceSubjectInDatabase(Subject)
//         .then(() => {
//             console.log("Question Added successfully")
//             res.status(200).json("message: Question Added successfully");
//         })
//         .catch((error) => {
//             console.log(`${error}`, "check connectivity");
//             res.status(501).json("message : could not connect to the db");
//         });
// }
