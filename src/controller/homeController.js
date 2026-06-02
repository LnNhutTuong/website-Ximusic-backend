import {getAllUser, createNewUser, getUserById, updateUser, deleteUser  } from '../service/userService'

const handleUserList = async (req, res ) => {    
    let listUser = await getAllUser();
    console.log(">>>>>check list: ", listUser);
    return res.render("user/index.ejs", {
        listUser: listUser
    });

    
}

const handleCreateUserPage = (req, res) =>{
    return res.render("user/create.ejs")
}

const handleCreateUser = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    
    createNewUser(email, password, username);
    
    return res.send('ok');
}

const handleUpdateUserPage = async (req, res) => {
    let id = req.params.id;
    let user = await getUserById(id);

    console.log(">>>>>check user: ", user);

    return res.render('user/edit.ejs', {user: user})
}

const handleUpdateUser = (req, res) => {
    let id = req.params.id;
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    
    updateUser(email, password, username, id);

    return res.redirect('/');
}

const handleDeleteUser = (req, res) => {
    let id = req.params.id;
    deleteUser(id);
    return res.redirect('/');
}

module.exports = {
    handleUserList,
    handleCreateUserPage,
    handleCreateUser,
    handleUpdateUserPage,
    handleUpdateUser,
    handleDeleteUser
}