import bcrypt from "bcryptjs";

const hashGenerator = (pass) => {
    const salt  = bcrypt.genSaltSync(13);
    return bcrypt.hashSync(pass, salt); 
}

export default hashGenerator;