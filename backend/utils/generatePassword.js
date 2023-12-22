const generatePassword = (length) => {
    const str = "kjsb*dwqkj29+0s32jk8&91x#-2e-834r"
    var password = "";
    for(let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * str.length)
        password += str.charAt(index);
    }
    return password;
}

export default generatePassword;