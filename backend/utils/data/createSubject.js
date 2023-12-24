import Subjects from "../../models/subject.model.js";

function createSubject(name, question, author, answers = []) {
    Array.isArray(answers) ? answers : [];
    console.log(answers);
    const Subject = new Subjects(
        {
            name,
            questionAskers: [author],
            questionArray: [{
                question,
                authors: [author],
                answers: answers,
            }]
        }
    )
    return Subject;
}


export default createSubject;