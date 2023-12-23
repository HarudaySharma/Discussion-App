import Subjects from "../models/subject.model.js";
import errorHandler from "../utils/errorHandler.js";
import Users from "../models/user.model.js";
import hashGenerator from "../utils/hashGenerator.js";


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

export const updateUserQuestion = async (req, res, next) => {
    if (req.params.userId !== req.user._id)
        return next(errorHandler(400, "permission denied: user can only update their asked questions"));

    const { userId, subjectId, questionId } = req.params;
    const { question, username } = req.body;
    // create a new question object, having the same old fields updating only the required fields.
    try {
        const subjectObj = await Subjects.findOne(
            {
                _id: subjectId,
                'questionArray._id': questionId,
                'questionArray.authors': username,
            },
            {'questionArray.$': 1, "_id": 0}
        )
        
        const questionObj = subjectObj.questionArray[0];

        // now to make a new questionObject and check if that question is already in the subject or not
        // if yes then add the author to the question and if not add the new object into the questionArray
        
        console.log(questionObj);
        res.status(200).json(questionObj)
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}
// question asked by user - > question of a subject .. many questions ..question id -> question select 