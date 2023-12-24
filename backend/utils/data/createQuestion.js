
function createQuestion(question, author, answers = []) {
    return (
        {
            question,
            authors: [author],
            answers,
        }
    )
}

export default createQuestion;