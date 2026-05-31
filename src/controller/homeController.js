const handleHellWord = (req, res ) =>{
    let name = "con cajwc"; 
    return res.render("home.ejs", 
        {name: name}
    );
}

const handleUserPage = (req, res ) => {
    return res.render("user.ejs");
}

module.exports = {
    handleHellWord,
    handleUserPage
}