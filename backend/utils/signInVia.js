const signInVia = (req, res, next) => {  
    req.head = req.body.username === undefined || req.body.username === "" ? {viaUsername: false} : {viaUsername: true};
    next(); 
}

export default signInVia;