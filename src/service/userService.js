import bcrypt, { hashSync } from "bcryptjs";
import connection from "../configs/database";
const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

const createNewUser = (email, password, username) => {
    let userHashPassword = hashPassword(password);
    return connection.query(
        `Insert into users (email, password, username)
        values (?, ?, ?)`,
        [email, userHashPassword, username]
    )
}

const getUserById = async (id) => {   
    const [results, fields] = await connection.promise().query(
        `SELECT * FROM users where id = ?`,
        [id]
    );

    return results[0];
}

const updateUser = (email, password, username, id) => {
 let userHashPassword = hashPassword(password);
    return connection.query(
          `UPDATE users 
     SET email = ?, password = ?, username = ?
     WHERE id = ?`,
        [email, userHashPassword, username, id]
    )
}

const getAllUser = async () => {
    const [results, fields] = await connection.promise().query(
        `SELECT * FROM users`
    );
    return results;
}

const deleteUser = (id) => {
    return connection.query(
      `DELETE FROM users WHERE id = ?`,[id])
}

module.exports = {
    hashPassword,
    getAllUser,
    createNewUser,
    getUserById,
    updateUser,
    deleteUser
}
