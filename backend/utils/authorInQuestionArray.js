function authorInQuestionArray (questions, author) {
    for(let i = 0; i < questions.length; i++) {
        // console.log(questions[i])
        if(questions[i].authors.includes(author))
            return true;
    }
    return false;
}

export default authorInQuestionArray;