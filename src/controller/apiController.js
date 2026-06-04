const testApi = (req, res) => {
    return res.status(200).json({
        message: 'ok',
        data: 'test api'
    })
}

const hanldeRegister = (req, res) => {
    console.log(">>>>>>check handle register: ", req.body);
}

module.exports = {
    testApi,
    hanldeRegister
}