function authorInQuestionArray (questions, username) {
    for(let i = 0; i < questions.length; i++) {
        // console.log(questions[i])
        if(questions[i].authors.find(author => author.username === username))
            return true;
    }
    return false;
}

export default authorInQuestionArray;