import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        questionAskers: [String],
        questionArray: [
            {
                question: String,
                authors: [String],
                answers: [
                    {
                        answer: {
                            type: String,
                            unique: true,
                        },
                        author: String,
                        likes: Number,

                    }
                ]   
            }
        ]
    }
)

const Subjects = mongoose.model('Subject', SubjectSchema);

export default Subjects;