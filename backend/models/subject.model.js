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
                Answers: [
                    {
                        answer: String,
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