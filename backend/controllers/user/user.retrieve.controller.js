import Subjects from "../../models/subject.model.js";
import Users from "../../models/user.model.js";


export const questions = async (req, res, next) => {
    if (req.params.userId !== req.user._id)
        return next(errorHandler(401, "Authentication failed: Can't fetch the User's data"));

    const { userId } = req.params;

    try {
        const { username } = await Users.findOne({ _id: userId }, { "username": 1 });

        console.log("username: " + username);

        const subjs = await Subjects.find({
            questionAskers: username
        })
        
        const result = subjs.map((subject) => {
            subject.questions = subject.questionArray.filter((obj) => obj.authors.includes(username))
            return subject;
            
        })

        console.log(result);

        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
} 