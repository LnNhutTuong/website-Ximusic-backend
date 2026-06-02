import bcrypt, { hashSync } from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import db from '../models/index'

const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

const createNewUser = async (email, password, username) => {
    let userHashPassword = hashPassword(password);
    try{
        await db.User.create({
        email: email,
        password: userHashPassword,
        username: username
    })
    }
    catch(error){
        console.log(error);
    }
}

const getUserById = async (id) => {   
}

const updateUser = (email, password, username, id) => {
}

const getAllUser = async () => {
}

const deleteUser = (id) => {
}

module.exports = {
    hashPassword,
    getAllUser,
    createNewUser,
    getUserById,
    updateUser,
    deleteUser
}
