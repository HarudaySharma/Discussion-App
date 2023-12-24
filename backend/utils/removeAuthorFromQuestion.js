
/* function : 
                will remove author from the question with id = questionId
                if(authors == none) 
                    remove the question from questions
*/
function removeAuthorFromQuestion(questions, questionId, author) {
    questions =  questions.map((question) => {
        if(question._id == questionId) {
            question.authors = question.authors.filter((value) => value !== author && value !== null);
        }
        if(Array.isArray(question.authors) && question.authors.length)
            return question;
        return null;
    }).filter(Boolean);

    return questions;
}
export default removeAuthorFromQuestion;
