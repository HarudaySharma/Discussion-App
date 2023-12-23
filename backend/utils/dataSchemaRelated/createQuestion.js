
function createQuestion(question, author) {
    return (
        {
            question,
            authors: [author],
            Answers: []
        }
    )
}

export default createQuestion;