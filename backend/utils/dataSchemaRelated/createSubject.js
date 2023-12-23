import Subjects from "../../models/subject.model.js";

function createSubject(name, question, author) {
    const Subject = new Subjects(
        {
            name,
            questionAskers: [author],
            questionArray: [{
                question,
                authors: [author],
                Answers: [],
            }]
        }
    )
    return Subject;
}

export default createSubject;