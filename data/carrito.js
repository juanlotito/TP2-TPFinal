const prompt = require('prompt-sync')();
const mysql = require('../connection/database.js').crearConexion()
const validar = require('../middleware/validarQuery.js')
const express = require('express');
const { stringify } = require('querystring');
const router = require('../routes/compradoresRouter.js');

const MINIMO_STOCK = 5;

var app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function puedoComprar (producto, cantidad) {
    
    const consulta = "SELECT * FROM td_productos WHERE idProd =" + producto

    return new Promise ((resolve, reject) => {
        mysql.query(consulta, function(err, results, fields) {
            if (err) reject(false);
            
            if (results[0].stock <= MINIMO_STOCK) {
                console.log("Se dio aviso vía mail al proveedor por faltante de stock");
                //codigo que haría el envío real del mail
            }
            if (results[0].stock < cantidad) {
                reject(false);
            } else {
                resolve(true);
            }
        })
    }).then(
        function (valor) {
            return valor
        },
        function (valor) {
            return valor
        }
    )
}

async function agregarCarrito (cantidad, producto, dni){

    const consulta = 'UPDATE td_productos SET stock = stock - '+cantidad+' WHERE idProd = '+producto
    const consulta2 = 'INSERT INTO td_carrito (idUsuario, idProducto, cantidad, precio) SELECT '+dni+', '+producto+', '+cantidad+', precio FROM td_productos WHERE idProd = '+producto

    query = consulta + '; ' + consulta2
        //ESPACIO PARA VALIDAR AMBAS CONSULTAS

        async function carrito (query) {
            return new Promise((resolve, reject) => {
                mysql.query(query, function(err,results, fields) {
                    if (err) {console.log(err);
                    reject(false);}
                    else resolve(true)
                })
            }).then(
                function (valor) {
                    return valor
                },
                function (valor) {
                    return valor
                }
            )
        }

        const operacion = await carrito(query)
        
        return operacion
}

async function realizarCompra (usuario) {

    async function devolverTotal (usuario) {
        const consulta = "SELECT idUsuario, SUM(precio) as precio FROM td_carrito WHERE idUsuario ="+usuario+" GROUP BY idUsuario" 

        return new Promise ((resolve, reject) => {
            mysql.query(consulta, function(err, results, fields) {
                if (err) {console.log(err);
                reject(err)}
                else {   
                resolve(results[0].precio)}
            })
        }).then(
            function(valor) {
                return valor
            },
            function(valor) {
                return valor
            }
        )

        

    }
    async function vaciarCarro (usuario) {
        const consulta = "DELETE FROM td_carrito WHERE idUsuario = "+usuario;
        return new Promise((resolve, reject) => {
            mysql.query(consulta, function (err, results, fields) {
                if (err) {//console.log(err);
                reject(false)}
                else resolve(true);
            })
        }).then(
            function (valor) {
                return valor
            },
            function (valor) {
                return valor
            }
        )
    }

const precio = await devolverTotal(usuario);
const eliminado = await vaciarCarro(usuario);

let devolucion = {
    precio : precio,
    exito : eliminado
}

return devolucion

}

async function sacarCarrito(producto) {

    const consulta = "DELETE FROM td_carrito WHERE idProducto = "+producto
    const consulta2 = "UPDATE td_productos SET stock = stock + (SELECT SUM(cantidad) FROM td_carrito WHERE idProducto = "+producto+")";
    async function actualizarStock(producto) {
        return new Promise ((resolve, reject) => {
            mysql.query(consulta2, function (err, results, fields) {
                if (err) {console.log(err);
                reject(false);}
                else resolve(true)
            })
        }).then(
            function (valor) {
                return valor
            },
            function (valor) {
                return valor
            }
        )
    }

    async function quitar (producto) {
        return new Promise ((resolve, reject) => {
            mysql.query(consulta, function (err, results, fields) {
                if (err) reject(false);
                else resolve(true)
            })
        }).then(
            function (valor) {
                return valor
            },
            function (valor) {
                return valor
            }
        )
    }
    const stock = await actualizarStock(producto);
    const exito = await quitar(producto);

    return exito
}

async function getCarrito(dni) {

    const consulta = "SELECT * FROM td_carrito WHERE idUsuario ="+dni

    if (!validar.validate(consulta)) {
        async function get(consulta) {
            return new Promise((resolve, reject) => {
                mysql.query(consulta, function(err, results, fields) {
                    if (err) reject(err);
                    else resolve(results)
                })
            }).then(
                function (valor) {
                    return valor
                },
                function (valor) {
                    return valor
                }
            )
        }

        const resultados = await get(consulta);
        return resultados
    }
    else {
        throw new Error ("SQL Inyeccion detected")
    }

}

module.exports = {agregarCarrito, puedoComprar, realizarCompra, sacarCarrito, getCarrito}