import bcrypt, { hashSync } from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import db from '../models/index'

const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

const getAllUser = async () => {

    //test relationship
    let newUser = await db.User.findOne({
        where: {
            id: 1
        },
        attributes: ["id", "username", "email" ],
        include:{
            model: db.Group,
            attributes: ["id", "name", "description" ],
        },
        raw: true,
        nest: true
    })
     
    let role = await db.Role.findAll({
            include: db.Group, 
            Where: {
                id : 1
            },
            raw: true,
            nest: true
    })

    let users = [];
    try{
        users = await db.User.findAll();
    }
    catch(error){
        console.log(">>>>>check error: ", error);
    }
    return users;
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
        console.log(">>>>>check error: ", error);
    }
}

const getUserById = async (id) => {
    let user;
    try{
      user = await db.User.findOne({
            where: {
                id: id
            }
        })
    }catch(error){
        console.log(">>>Check error: ", error);
    }
    return user;
}

const updateUser = async (email, password, username, id) => {

    let dataUpdate = {
        email: email,
        username: username
    }

    if(password && password.trim() ){
        let userHashPassword = hashPassword(password);
        dataUpdate.password = userHashPassword;
    }

    try{
        await db.User.update(
            dataUpdate
        ,
        {where: {
            id: id
        }})
    }catch(error){
        console.log(">>>>Check error: ", error);
    }
}

const deleteUser = async (id) => {
    try{
        await db.User.destroy({
            where: {
                id: id
            }
        })
    }
    catch(error){
        console.log(">>>>Check error: ", error)
    }
}

module.exports = {
    hashPassword,
    getAllUser,
    createNewUser,
    getUserById,
    updateUser,
    deleteUser
}
