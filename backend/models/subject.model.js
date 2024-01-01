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
                authors: [
                    {
                        username: String,
                        profilePicture: String,
                    }
                ],
                answers: [
                    {
                        answer: {
                            type: String,
                            unique: true,
                        },
                        author: {
                            username: String,
                            profilePicture: String,
                        },
                        likes: [],
                    }
                ]
            }
        ]
    }
)
SubjectSchema.index({ 'questionArray.answers.answer': 1 }, { sparse: true });

const Subjects = mongoose.model('Subject', SubjectSchema);

export default Subjects;    