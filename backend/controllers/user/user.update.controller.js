import Subjects from "../../models/subject.model.js";
import errorHandler from "../../utils/error/errorHandler.js";
import Users from "../../models/user.model.js";
import hashGenerator from "../../utils/users/hashGenerator.js";
import { addQuestion } from "./user.data.annexing.controller.js";
import removeAuthorFromQuestion from "../../utils/data/removeAuthorFromQuestion.js";
import authorInQuestionArray from "../../utils/data/authorInQuestionArray.js";

export const updateUserCredentials = async (req, res, next) => {
    if (req.user._id !== req.params.id)
        return next(errorHandler(400, "permission denied: user can only update their account"));


    const { username, name, email, password, profilePicture } = req.body;
    

    try {
        const oldCred = await Users.findById(req.params.id, { username: 1, _id: 0, profilePicture: 1 })
        console.log("oldCred", oldCred);


        if (oldCred.username !== username.trim() || oldCred.profilePicture !== profilePicture) {
            try {
                const subjectsUpdated = await updateAuthorNameInSubjects(oldCred.username, username.trim(), profilePicture)

                if (subjectsUpdated !== true) {
                    res.status(500).json({ message: 'Internal Server Error' });
                    return;
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        }

        const hash = password ? hashGenerator(password.trim()) : null;
        
        const updatedUser = await Users.findByIdAndUpdate(req.params.id, {
            username: (username ? username.trim() : oldCred.username),
            name: (name ? name.trim() : oldCred.name),
            email: (email ? email.trim() : oldCred.email),
            password: (hash ? hash : oldCred.password),
            profilePicture: (profilePicture ? profilePicture : oldCred.profilePicture),
        },
            { new: true })

        console.log(updatedUser._doc);
        const { password: hashed, ...responseObj } = updatedUser._doc
        console.log(responseObj);
        res.status(200).json(responseObj);


    } catch (error) {
        console.log(error)
        if (error.message.includes("E11000")) {
            res.status(500).json({ message: `${Object.keys(error.keyPattern)[0]} already taken` })
            return;
        }
        res.status(500).json({ "message": "Server error, not able to update the user" });
        return;
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user._id !== req.params.id) {
        return next(errorHandler(401, "You can Delete only your account"))
    }
    try {
        await Users.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User has been deleted..." });
    }
    catch (err) {
        next(err);
    }

};

const updateAuthorNameInSubjects = async (username, newName, profilePicture) => {
    console.log(username, newName)
    try {
        const subjects = await Subjects.find(
            {
                'questionAskers': username,
                'questionArray.authors.username': username
            },

        );
        console.log("subjects", subjects);

        if (!subjects.length) {
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
                        if (question.authors[i].username === username) {
                            question.authors[i].username = newName;
                            question.authors[i].profilePicture = profilePicture;
                            break;
                        }
                    }
                });
            }

        });

        const res = await Subjects.deleteMany({
            'questionAskers': username,
            'questionArray.authors.username': username,
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
                'questionArray.authors.username': username,
            },
            { 'questionArray.$': 1, "_id": 0, "name": 1 }
        )

        if (subjectObj === null)
            return next(errorHandler(400, "Question not found in db"))

        var questionObj = subjectObj.questionArray[0];

        if (questionObj.question === question?.trim())
            return res.status(400).json({ message: "You haven't changed the question" });


        questionObj.authors = questionObj.authors.filter(author => author.username !== username);

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

        console.log(questionObj)

        //updating the old question object with new one (one in which username is not in authors)
        const result = await Subjects.findOneAndUpdate(
            {
                _id: subjectId,
                'questionArray._id': questionId,
                'questionArray.authors.username': username
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
    console.log(answer);
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
                },
            );
            console.log(result)
            if (result === null) {
                return next(errorHandler(400, "You didn't changed your answer"))
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
                const result = await Subjects.findOneAndDelete({ _id: subjectId }, { new: true });
                return res.status(200).json({ subject: { _id: subjectId }, deleteSubject: true })
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
                res.set('content-type', 'application/json');
                res.status(200).json({ subject: result.toObject(), deleteSubject: false });
            }
            catch (err) {
                console.log(err);
                res.status(501).json({ message: "Failed to Delete" });

            }

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

