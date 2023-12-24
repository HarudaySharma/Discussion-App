import Subjects from "../models/subject.model.js";
import errorHandler from "../utils/errorHandler.js";
import Users from "../models/user.model.js";
import hashGenerator from "../utils/hashGenerator.js";
import { addQuestion } from "./user.data.annexing.controller.js";
import removeAuthorFromQuestion from "../utils/removeAuthorFromQuestion.js";
import authorInQuestionArray from "../utils/authorInQuestionArray.js";

export const updateUserCredentials = async (req, res, next) => {
    if (req.user._id !== req.params.id)
        return next(errorHandler(400, "permission denied: user can only update their account"));


    const { username, name, email, password, profilePicture } = req.body;

    try {
        const oldCred = await Users.findById(req.params.id, { username: 1, _id: 0 })
        console.log("oldCred", oldCred);


        if (oldCred.username !== username) {
            try {
                const subjectsUpdated = await updateAuthorNameInSubjects(oldCred.username, username)

                if (subjectsUpdated !== true) {
                    res.status(500).json({ message: 'subjectUpdationErrors error' });
                    return;
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: 'internal server error' });
                return;
            }
        }

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

const updateAuthorNameInSubjects = async (username, newName) => {
    console.log(username, newName)
    try {
        const subjects = await Subjects.find(
            {
                'questionAskers': username,
                'questionArray.authors': username
            },

        );
        console.log("subjects", subjects);
        
        if(!subjects.length) {
            return true;
        }
        
        subjects.forEach((subject) => {
            let authorPresent = false;

            for (let i = 0; i < subject.questionAskers.length; i++) {
                if (subject.questionAskers[i] === username) {
                    subject.questionAskers[i] = newName;
                    authorPresent = true;
                    break;
                }
            }

            if (authorPresent) {
                subject.questionArray.forEach((question) => {
                    for (let i = 0; i < question.authors.length; i++) {
                        if (question.authors[i] === username) {
                            question.authors[i] = newName;
                            break;
                        }
                    }
                });
            }

        });

        const res = await Subjects.deleteMany({
            'questionAskers': username,
            'questionArray.authors': username,
        })

        console.log("deleted", res);

        try {
            const result = await Subjects.insertMany(subjects);

            console.log("subjects updated", result);
            return true;

        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

export const updateUserQuestion = async (req, res, next) => {

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

export const updateUserAnswer = async (req, res, next) => {
    if (req.params.userId !== req.user._id)
        return next(errorHandler(400, "permission denied: user can only update their wrote answers"));

    const { userId, subjectId, questionId, answerId } = req.params;
    const { answer, author } = req.body;

    try {
        const { username } = await Users.findById(userId, { username: 1, _id: 0 })

        console.log(username);

        try {
            const result = await Subjects.findOneAndUpdate(
                {
                    _id: subjectId,
                    'questionArray._id': questionId,
                    'questionArray.answers._id': answerId,
                    'questionArray.answers.answer': { $ne: answer }
                },
                {
                    $set: {
                        'questionArray.$[q].answers.$[a].answer': answer
                    }
                },
                {
                    arrayFilters: [
                        { 'q._id': questionId },
                        { 'a._id': answerId }
                    ],
                    new: true,
                }
            );
            if (result === null) {
                return next(errorHandler(400, "you didn't changed your answer"))
            }
            console.log(result.toObject());
            res.status(200).json(result.toObject());
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
}

export const deleteUserQuestion = async (req, res, next) => {
    /*
        functionality:
            as the name suggests,  will delete question of user from subject
                if(question.authors includes username):
                    remove(username)
                    if(question.authors.empty()):
                        remove entire question
                if(subject.questions have user's other asked question):
                    don't remove username from questionAskers
                else:
                    remove username
                if(subject.questionAskers.empty):
                    remove subject
                else:
                    update the subjectObj in db

    */
    if (req.params.userId !== req.user._id)
        return next(errorHandler(400, "Authentication failed: You can't delete the question"));

    const { userId, subjectId, questionId } = req.params;
    const { question, username } = req.body;
    try {
        const { username } = await Users.findById(userId, { 'username': 1, '_id': 0 });

        console.log(username);

        try {

            const subject = await Subjects.findOne({
                _id: subjectId,
                'questionArray._id': questionId,
            },
                { "questionAskers": 1, "questionArray": 1 });

            // console.log(subject);


            subject.questionArray = removeAuthorFromQuestion(subject.questionArray, questionId, username)

            if (!authorInQuestionArray(subject.questionArray, username))
                subject.questionAskers = subject.questionAskers.filter((value) => value !== username && value !== null);


            if (subject.questionAskers.length == 0) {
                // remove the subject
                const result = await Subjects.findOneAndDelete({ _id: subjectId });
                return res.status(200).json(result)
            }

            try {
                const result = await Subjects.findOneAndUpdate(
                    {
                        _id: subjectId,
                        'questionArray._id': questionId,
                    },
                    {
                        questionAskers: subject.questionAskers,
                        'questionArray': subject.questionArray,
                    },
                    { new: true },
                )

                console.log("authors should be deleted", result);
            }
            catch (err) {
                console.log(err);
            }
            // console.log(result);
            res.status(200).json(result.toObject());

        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
}

export const deleteUserAnswer = async (req, res, next) => {
    if (req.params.userId !== req.user._id)
        return next(errorHandler(400, "Authentication failed: You can't delete the question"));

    const { userId, subjectId, questionId, answerId } = req.params;
    const { question, username } = req.body;
    try {
        const { username } = await Users.findById(userId, { 'username': 1, '_id': 0 });

        console.log(username);

        try {
            const result = await Subjects.findOneAndUpdate(
                {
                    _id: subjectId,
                    'questionArray._id': questionId,
                    'questionArray.answers._id': answerId,
                },
                {
                    $pull: {
                        'questionArray.$[q].answers': { _id: answerId }
                    }
                },
                {
                    arrayFilters: [{ 'q._id': questionId, }],
                    new: true,
                }
            )

            if (result === null) {
                return next(errorHandler(400, "answer not found"))
            }
            console.log(result);
            res.status(200).json(result.toObject());

        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
}

