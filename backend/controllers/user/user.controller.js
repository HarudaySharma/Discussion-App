
export const test = (req, res, next) => {
    console.log(req.body);
    res.status(200).json("message : userRoute is working");
}



