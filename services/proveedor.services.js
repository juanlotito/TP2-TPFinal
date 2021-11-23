var dataProveedores = require('../data/proveedores');
var auth = require('./auth.service')

module.exports = {

    loguinUser : (usuario, password) => {
        const credencialesCorrectas = dataProveedores.credencialesCorrectas(usuario, password);
        credencialesCorrectas.then(element => {
            if (element) {
                console.log("Logueo correcto");
            } else {
                console.log("Error! Usuario o contraseña incorrectos")
            }
        })
        /*return {usuario, token : auth.generateAuthToken(usuario)}*/
    }

    //Otros metodos

    
}