import Users from "../models/user.model.js";

export const test = (req, res, next) => {
    console.log(req.body);
    res.status(200).json("message : auth route is working");
}


export const SignUp = async (req, res, next) => {
    const {username, name, email, password} = req.body;

    const newUser = new Users (
        {
            username,
            name,
            email,
            password
        }
    )
    try {
        const returns = await newUser.save();
        res.status(200).json(`message: user created successfully, statement: ${returns}`)
    }catch (error) {
        res.status(500).json(`${error}`)
    } 

}