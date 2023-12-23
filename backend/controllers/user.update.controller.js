import Subjects from "../models/subject.model.js";
import errorHandler from "../utils/errorHandler.js";
import Users from "../models/user.model.js";
import hashGenerator from "../utils/hashGenerator.js";
import { addQuestion } from "./user.data.annexing.controller.js";

export const updateUserCredentials = async (req, res, next) => {
    if (req.user._id !== req.params.id)
        return next(errorHandler(400, "permission denied: user can only update their account"));


    const { username, name, email, password, profilePicture } = req.body;

    try {
        const hash = hashGenerator(password);
        const updatedUser = await Users.findByIdAndUpdate(req.params.id, {
            username,
            name,
            email,
            password: hash,
            profilePicture
        },
            { new: true })

        // console.log(updatedUser._doc);
        const { password: hashed, ...responseObj } = updatedUser._doc
        res.status(200).json(responseObj);


    } catch (err) {
        console.log(err)
        res.status(500).json({ "message": "Server errror, not able to update the user" });
    }
}



/*
* function: instead of updating the whole original object in the db, 
*           it just updates the authors of the question by popping the username,
*           and calls the addQuestion function to add a entirely new question based on the updated values by the user,
            addQuestion will do all the response sending work

* NOTE: If the authors array become empty after popping the username, means question have no authors
        => question will be removed from the db;

* Point to note -->  when new question is created, 
               if(question is new to the subject):
                    create object with the answers of older question
                else:
                    just add the author's name in the questions authors array
*/

export const updateUserQuestion = async (req, res, next) => {
    if (req.params.userId !== req.user._id)
        return next(errorHandler(400, "permission denied: user can only update their asked questions"));

    const { userId, subjectId, questionId } = req.params;
    const { question, username } = req.body;
    try {
        const subjectObj = await Subjects.findOne(
            {
                _id: subjectId,
                'questionArray._id': questionId,
                'questionArray.authors': username,
            },
            { 'questionArray.$': 1, "_id": 0, "name": 1 }
        )

        if (subjectObj === null)
            return next(errorHandler(400, "question not found in db"))

        var questionObj = subjectObj.questionArray[0];

        if (questionObj.question === question)
            return res.status(400).json({ message: "you haven't changed the question" });


        questionObj.authors = questionObj.authors.filter(value => value !== username);

        req.body.subjectName = subjectObj.name;
        req.body.answers = subjectObj.questionArray[0].answers.map((obj) => {
            var result = {};
            result.answer = obj.answer;
            result.author = obj.author;
            result.likes = obj.likes;
            return result;
        });

        // adding the modified question as a new question in the subject
        if (questionObj.authors.length === 0) {
            //deleting the older question as no authors
            const result = await Subjects.findOneAndUpdate(
                {
                    _id: subjectId,
                    'questionArray._id': questionId
                },
                {
                    $pull: {
                        'questionArray': { _id: questionId }
                    }
                },
                { new: true }
            )

            console.log("Question should be deleted", result)
            // creating a new updated question object in the same subject
            addQuestion(req, res, next);
            return;
        }

        console.log("im here")
        console.log(questionObj)

        //updating the old question object with new one (one in which username is not in authors)
        const result = await Subjects.findOneAndUpdate(
            {
                _id: subjectId,
                'questionArray._id': questionId,
                'questionArray.authors': username
            },
            {
                $set: {
                    'questionArray.$[q]': questionObj
                },
            },
            {
                arrayFilters: [{ 'q._id': questionId }],
                new: true
            }
        )

        console.log("username should not be in the authors", result)

        addQuestion(req, res, next);

    }
    catch (err) {
        console.log(err);
        next(err);
    }
}
