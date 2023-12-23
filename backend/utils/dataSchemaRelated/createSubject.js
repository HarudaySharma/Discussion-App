import Subjects from "../../models/subject.model.js";

function createSubject(name, question, author, answers = []) {
    const Subject = new Subjects(
        {
            name,
            questionAskers: [author],
            questionArray: [{
                question,
                authors: [author],
                answers,
            }]
        }
    )
    return Subject;
}

export default createSubject;