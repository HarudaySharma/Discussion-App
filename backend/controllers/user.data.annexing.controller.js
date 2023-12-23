import Subjects from "../models/subject.model.js";
import Users from "../models/user.model.js";

import createSubject from "../utils/dataSchemaRelated/createSubject.js";
import createQuestion from "../utils/dataSchemaRelated/createQuestion.js";


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

        const Subject = await Subjects.findOne({ name: subjectName });
        if (!Subject) {
            console.log("New Subject")
            const subject = createSubject(subjectName, question, username, answers);

            try {
                const sub = await subject.save();
                console.log("new Subject added");
                res.status(200).json(sub)

            } catch (error) {
                console.log("not able to add new Subject")
                res.status(500).json("message: not able to add new question with new Subject");
            }
        }
        else {
            console.log("old Obj", Subject);

            if (!Subject.questionAskers.includes(username)) {
                console.log("new Author in subject");
                Subject.questionAskers.push(username);
            }

            let index = Subject.questionArray.findIndex(ele => ele.question === question);
            if (index === -1) {
                console.log("new question")
                Subject.questionArray.push(createQuestion(question, username, answers))
                try {
                    const result = await Subject.save();
                    console.log("Question Added successfully")
                    res.status(200).json(result.toObject());
                } catch (err) {
                    console.log(`${err}`, "check connectivity");
                    res.status(501).json("message : could not connect to the db");
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
                        res.status(501).json("message : could not connect to the db");
                        return;
                    }
                }
                console.log("author found")
                res.status(200).json("Question was already posted by you");
            }
        }
    } catch (error) {
        console.log(error);
        res.status(501).json("Couldn't connect to the db")
    }
}

export const addResponseToQuestion = async (req, res, next) => {

    if (req.user._id !== req.params.userId)
        return next(errorHandler(401, "Authentication failed: Not allowed to add a response"));


    const { response } = req.body;
    const { subjectId, questionId, userId } = req.params;
    try {
        const { username } = await Users.findById(userId, { "username": 1, "_id": 0 });
        console.log(username);
        /* this will find the subject and then the specific question inside it,
         and then adds the answer into the answer array of the question if not present already
        */
        // feature to be addeed: same user can't add the same answer to the same question more than once
        const result = await Subjects.findOneAndUpdate(
            {
                _id: subjectId,
                'questionArray._id': questionId,
                'questionArray.$.answers': { $not: { $elemMatch: { answer: response, author: username } } }
            },
            {
                $addToSet: {
                    'questionArray.$.answers': {
                        answer: response,
                        author: username,
                        likes: 0,
                    }
                },

            },
            { new: true }
        )
        // console.log(result._doc);
        if (!result) {
            res.status(500).json({ message: "Subject OR Question Not Found" })
            return;
        }
        res.status(200).json({ message: "Your response is added successfully" })
    }
    catch (err) {
        next(err);
    }
}

export const likeResponseOfQuestion = async (req, res, next) => {
    if (req.params.userId !== req.user._id)
        return next(401, "AAuthentication failed: Not allowed to like the answer")

    const { userId, subjectId, questionId, answerId } = req.params;

    try {
        const result = await Subjects.findOneAndUpdate(
            {
                _id: subjectId,
                'questionArray._id': questionId,
                'questionArray.answers._id': answerId
            },
            {
                $inc: {
                    'questionArray.$.answers.$[answer].likes': 1,
                }
            },
            {
                arrayFilters: [{ 'answer._id': answerId }]
            }
        )

        if (!result.isModified) {
            next(errorHandler(500, "like not added to the answer"))
            return;
        }
        res.status(200).json({ message: "liked" })
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
