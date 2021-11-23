var express = require('express');
const { cp } = require('fs');
var router = express.Router();
const dataCarrito = require('../data/carrito');
const validador = require('../middleware/validarQuery');



//----------GETs----------//
//Get del carrito por DNI (por comprador)
router.get('/dni', function(req,res,next) {
    let carrito = dataCarrito.getCarrito(req.body.dni);

    if (carrito != null && carrito != undefined) {
        carrito.then(element => {
            if (element.length) {
                res.status(200);
                res.json(element)
            } else {
                res.status(200);
                res.json("La consulta fue correcta pero no arrojó resultados")
            }
        })
    } else {
        res.status(404);
        res.json("No se encontraron resultados, reingresá el DNI")
    }
}) 

//----------POSTs----------//
//Agregar al carrito
router.post('/', function(req, res, next) {
    const operacion = dataCarrito.puedoComprar(req.body.producto, req.body.cantidad);
    operacion.then(element => {

        if (element) {
            const post = dataCarrito.agregarCarrito(req.body.cantidad, req.body.producto, req.body.dni);
            post.then(element => {
                if (element) {
                    res.status(200);
                    res.json('El producto se agregó al carrito');
                } else {
                    res.status(404);
                    res.json('El producto no se agregó. Es posible que no haya stock suficiente o cargaste mal los datos')
                }
            })

        }else {
            res.status(404);
            res.json('El producto no se agregó. Es posible que no haya stock suficiente o cargaste mal los datos');
        }      
    })
})
//Comprar
router.post('/comprar', function(req, res, next) {
    const compra = dataCarrito.realizarCompra(req.body.dni);
    const efectivo = req.body.efectivo;

    compra.then(element => {
        if (element.exito == true && efectivo == true) {
            res.status(200);
            res.json("A pagar: $"+parseInt(element.precio-(element.precio*0.1)))
        } else if (element.exito == true && efectivo == false) {
            res.status(200);
            res.json("A pagar: $"+element.precio)
        } else {
            res.status(404);
            res.json("Hubo un error al realizar la compra, revisá los datos nuevamente")
        }
    })
})

//----------DELETEs----------//
//Borrar producto del carrito
router.delete('/borrar', function(req, res, next) {
    const operacion = dataCarrito.sacarCarrito(req.body.producto);

    operacion.then(element => {
        if (element) {
            res.status(200);
            res.json("El producto se quitó correctamente del carrito");
        } else {
            res.status(404);
            res.json("Ingresaste valores incorrectos")
        }
    })
})


module.exports = router