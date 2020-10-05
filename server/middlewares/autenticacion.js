//***************
// Verificar TOKEN  
//******************* */
const jwt = require('jsonwebtoken')
let verificarToken = (req, res, next) => {
    //Next es una funcion para que el programa continue cuando termine esta funcion osea si no se llama la ejecucion del programa termina aqui y no continua con lo demas que este en la otra funcion
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    messagge: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })

}

//***************
// Verificar Rol de admin  
//******************* */
let verificarRol = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                messagge: ' El usuario no tiene permisos para añadir'
            }
        })
    }
}

module.exports = {
    verificarToken,
    verificarRol
}