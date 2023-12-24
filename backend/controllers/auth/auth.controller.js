import Users from "../../models/user.model.js";
import hashGenerator from "../../utils/users/hashGenerator.js";
import generateToken from "../../utils/users/generateToken.js";
import errorHandler from "../../utils/error/errorHandler.js";
import comparePasword from "../../utils/users/comparePassword.js";
import generateUID from "../../utils/users/generateUID.js";
import generatePassword from "../../utils/users/generatePassword.js";

export const test = (req, res, next) => {
    console.log(req.body);
    res.status(200).json("message : auth route is working");
}


export const SignUp = async (req, res, next) => {
    const { username, name, email, password } = req.body;

    const hash = hashGenerator(password);
    const newUser = new Users(
        {
            username,
            name,
            email,
            password: hash,
        }
    )
    try {
        await newUser.save();
        res.status(200).json(`message: user created successfully, statement`)
    } catch (error) {
        res.status(500).json(`${error}`)
    }

}

export const SignIn = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {

        var User = null;
        if (req.head.viaUsername) {
            try {
                User = await Users.findOne({ username });
            } catch (err) {
                console.log(err);
                res.status(500).json(`${err}`);
            }
        }
        else {
            try {
                User = await Users.findOne({ email });
            } catch (err) {
                console.log(err);
                res.status(500).json(`${err}`);
            }
        }
        if (!User) {
            next(errorHandler(400, "User not found"));
            return;
        }
        if (!comparePasword(User.password, password)) {
            next(errorHandler(400, "wrong password"));
            return;
        }

        const token = generateToken(User._id);
        const { password: notInclude, ...responseObj } = User._doc;

        res
            .cookie('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 2 })
            .status(200).json(responseObj);

    } catch (err) {
        console.log(`${err}`)
        res.status(500).json("message: Internal server Error");
    }
}

export const googleSignIn = async (req, res, next) => {
    const { username, email } = req.body;
    try {
        const user = await Users.findOne({ username });
        if (user) {
            const token = generateToken(user._id);
            const { password, ...responseObj } = user._doc;
            res
                .cookie('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 2 })
                .status(200), json(responseObj);
            return;
        }
        //create new user
        const newUser = new Users({
            username: username + generateUID(),
            name: username,
            email,
            password: generatePassword(16),
        })

        try {
            await newUser.save();
            const token = generateToken(newUser._id);
            const { password, ...responseObj } = newUser._doc;
            res
                .cookie('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 2 })
                .status(200), json(responseObj);
            return;
        }
        catch (err) {
            next(errorHandler(500, "not able to add user to db"))
        }

    } catch (err) {
        console.log(err);
        next();
    }
}

export const SignOut = (req, res, next) => {
    res.clearCookie('access_token').status(200).json({ message: "sign out successfull" });
}



