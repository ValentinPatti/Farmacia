const jwt = require('jsonwebtoken')

const verificacionToken = (req,res,next)=>{

    try {
        //recibo el token por el header
    const headerToken = req.headers.authorization

    //valido si el token esta bien
    if (!headerToken) {
        return res.status(401).json({message: 'token invalido'})
    }

    //extraer el token correctamente

    const token = headerToken.split(" ")[1]

    //verifico el token

    const decoded = jwt.verify(token, process.env.SECRET_KEY)

    req.user = decoded

    //respondo con next

    next()
    } catch (error) {
        return res.status(401).json({message: 'Token invalido o expirado'})
    }
    
}

module.exports = verificacionToken