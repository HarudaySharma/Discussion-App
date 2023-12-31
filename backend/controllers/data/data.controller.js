import Subjects from "../../models/subject.model.js"
import errorHandler from "../../utils/error/errorHandler.js";


export const allData = async (req, res, next) => {
    try {
        const allSubjects = await Subjects.find({});
        
        console.log(allSubjects)
        res.set('content-type','application/json');
        res.status(200).json(allSubjects);
    } 
    catch (err) {
        next(errorHandler(500, "Failed to fetch Questions"));
    }
}





