import Subjects from "../models/subject.model.js";

export const test = (req, res, next) => {
    console.log(req.body);
    res.status(200).json("message : userRoute is working");
}


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


function createQuestion(question, author) {
    return (
        {
            question,
            authors: [author],
            Answers: []
        }
    )
}

// function AddSubjectToDatabase(Subject, res) {
//     replaceSubjectInDatabase(Subject)
//         .then(() => {
//             console.log("Question Added successfully")
//             res.status(200).json("message: Question Added successfully");
//         })
//         .catch((error) => {
//             console.log(`${error}`, "check connectivity");
//             res.status(501).json("message : could not connect to the db");
//         });
// }

export const AddQuestion = async (req, res, next) => {
    const { subjectName, question, author } = req.body;

    try {
        const Subject = await Subjects.findOne({ name: subjectName });
        if (!Subject) {
            console.log("New Subject")
            const subject = createSubject(subjectName, question, author);

            try {
                const sub = await subject.save();
                console.log("new Subject added");
                res.status(200).json(sub)

            } catch (error) {
                console.log("not able to add new Subject")
                res.status(500).json("message: not able to add new question with new Subject");
            }
        }
        else {
            console.log("old Obj", Subject);

            if (!Subject.questionAskers.includes(author)) {
                console.log("new Author in subject");
                Subject.questionAskers.push(author);
            }

            let index = Subject.questionArray.findIndex(ele => ele.question === question);
            if (index === -1) {
                console.log("new question")
                Subject.questionArray.push(createQuestion(question, author))
                try {
                    await Subject.save();
                    console.log("Question Added successfully")
                    res.status(200).json("message: Question Added successfully");
                } catch (err) {
                    console.log(`${error}`, "check connectivity");
                    res.status(501).json("message : could not connect to the db");
                }
            }
            else {
                console.log("question found")
                if (!Subject.questionArray[index].authors.find(ele => ele === author)) {
                    console.log("new Author for the question")
                    Subject.questionArray[index].authors.push(author);

                    try {
                        await Subject.save();
                        console.log("Author added successfully")
                        res.status(200).json("message: Question Added successfully");
                        return;
                    }
                    catch (err) {
                        console.log(`${error}`, "check connectivity");
                        res.status(501).json("message : could not connect to the db");
                        return;
                    }
                }
                console.log("author found")
                res.status(200).json("Question was already posted by you");
            }
        }
    } catch (error) {
        console.log(error);
        res.status(501).json("Couldn't connect to the db")
    }
}

/*
* when adding question  
    - if(subject doesn't exists):
        create new sub
      else:
        if(quesstionAskers don't have Author):
            add
        else:
            if(questionArray don't have the question):
                create new question
            else:
                if(authors in the question does'nt include author):
                    include

*/ 

