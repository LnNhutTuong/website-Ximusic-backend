import {getAllUser, createNewUser, getUserById, updateUser, deleteUser  } from '../service/userService'

const handleUserList = async (req, res ) => {    
    let listUser = await getAllUser();
    return res.render("user/index.ejs", {
        listUser: listUser
    });

    
}

const handleCreateUserPage = (req, res) =>{
    return res.render("user/create.ejs")
}

const handleCreateUser = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    
    await createNewUser(email, password, username);

    return res.redirect('/');
}

const handleUpdateUserPage = async (req, res) => {
    let id = req.params.id;
    let user = await getUserById(id);
    console.log(">>>Check user: ", user);
    return res.render('user/edit.ejs', {user: user})
}

const handleUpdateUser = async (req, res) => {
    let id = req.params.id;
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    
    await updateUser(email, password, username, id);

    return res.redirect('/');
}

const handleDeleteUser = async (req, res) => {
    let id = req.params.id;
    await deleteUser(id);
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