import bcrypt from "bcryptjs";

const comparePasword = (hash, password) => {
    return bcrypt.compareSync(password ,hash);
}

export default comparePasword;