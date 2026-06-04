import bcrypt, { hashSync } from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import db from '../models/index'

const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

const checkEmail = async (userEmail) => {
    let user = await db.User.findOne({
        where: {
            email: userEmail
        }
    })
    
    if(user){
        return true;
    }

    return false;
}

const checkPhone = async (userPhone) => {
    let user = await db.User.findOne({
        where: {
            phone: userPhone
        }
    })
    
    if(user){
        return true;
    }

    return false;
}

const hanldeRegister = async (rawUserData) => {
    try{
        let emailExist = await checkEmail(rawUserData.email);
        let phoneExist = await checkPhone(rawUserData.phone);

        if(emailExist){
            return{
                EM: 'Email already exists',
                EC: 1,
                DT: ''
            }
        }

        if(phoneExist){
            return{
                EM: 'Phone number already exists',
                EC: 1,
                DT: '',
            }
        }

        let passwordHash = hashPassword(rawUserData.password);
        
        await db.User.create({
            email: rawUserData.email,
            phone: rawUserData.phone,
            username: rawUserData.username,
            password: passwordHash
        })

        return{
                EM: 'Create user successfully',
                EC: 0,
                DT: '',
            }
    }
    catch(error){
        console.log(">> ERROR << : ", error);
        return{
                EM: 'Something went wrong in service...',
                EC: -2,
                DT: '',
            }
    }
}

module.exports = {
    hanldeRegister
}