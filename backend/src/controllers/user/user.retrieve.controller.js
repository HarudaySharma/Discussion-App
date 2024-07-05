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
            subject.questionArray = subject.questionArray.filter((obj) => obj.authors.find((author) => author.username === username));

            return subject.questionArray.length ? subject : null;

        }).filter(Boolean);
        
        console.log(result);
        res.set('content-type', 'application/json');
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
} 