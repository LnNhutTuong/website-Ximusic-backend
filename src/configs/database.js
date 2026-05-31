import mysql from 'mysql2';
//connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'jwt'
})

export default connection;
