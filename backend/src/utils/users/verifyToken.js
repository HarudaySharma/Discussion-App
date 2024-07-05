import jwt from "jsonwebtoken";

// will attach the decoded _id in req.user object if found
const verifyToken = (req, res, next) => {
    const { access_token } = req.cookies;
    if(!access_token) {
        return res.status(400).json({ "accessToken": false })
    }
    try {
        const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
        req.user = { _id: decoded.id };
        next();
    }
    catch (err) {
        res.status(400).json({ "message": "You can update your account only" })
    }
}

export default verifyToken;