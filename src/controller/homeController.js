// import {getAllUser} from '../service/CRUDservice'
import mysql from 'mysql2';

//connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'jwt'
})

const handleHellWord = (req, res ) =>{
    let name = "con cajwc"; 
    return res.render("home.ejs", 
        {name: name}
    );
}

const handleUserPage = async (req, res ) => {    
    return res.render("user.ejs");
}

const handleCreateUser = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;

    connection.query(
        `Insert into users (email, password, username)
        values (?, ?, ?)`, [email, password, username]
    )
    return res.send('success');
}

module.exports = {
    handleHellWord,
    handleUserPage,
    handleCreateUser
}