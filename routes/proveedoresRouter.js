var express = require('express');
var router = express.Router();
var dataProveedores = require('../data/proveedores')


//---------GETs---------//
//Obtener proveedores
router.get('/', function (req, res, next) {
  const proveedores = dataProveedores.getAllProveedores();
  proveedores.then(element => {
    if (element != undefined && element != null) {
      res.status(200);
      res.json(element)
    } else {
      res.status(404);
      res.json("ERROR! No se pudo ejecutar la consulta")
    }
  })

})
//Obtener productos del proveedor
router.get('/productos', function (req, res, next) {
  let productos = dataProveedores.getProductos(req.body.cuit);

  productos.then(element => {
    if (element != undefined) {
      res.status(200);
      res.json(element);
    } else {
      res.status(404);
      res.json("No se pudo obtener la lista de productos del cuit elegido")
    }
  })
})

//---------POSTs---------//
//Postear un nuevo proveedor
router.post('/', function (req, res, next) {
  let proveedor = {
    razonSocial : req.body.razonSocial,
    domicilio : req.body.domicilio,
    cuit : req.body.cuit,
    mail : req.body.mail,
    telefono : req.body.telefono,
    usuario : req.body.usuario,
    contrasena : req.body.contrasena
  }

  const operacion = dataProveedores.postProveedor(proveedor);

  operacion.then(element => {
    if (element) {
      res.status(200);
      res.json("El proveedor fue cargado correctamente")
    } else {
      res.status(404);
      res.json("El proveedor no fue cargado. Revisá los datos ingresados")
    }
  })

})
//Agregar producto al catálogo
router.post('/productos', function (req, res, next) {

  let producto = {
    stock : req.body.stock,
    precio : req.body.precio,
    nombre : req.body.nombre,
    proveedor : req.body.proveedor,
    categoria : req.body.categoria
  }

  const operacion = dataProveedores.postProducto(producto)

  operacion.then(element => {
    if (element) {
      res.status(200);
      res.json("El producto fue agregado correctamente");
    } else {
      res.status(404);
      res.json("El producto no se pudo agregar, revisá los datos ingresados")
    }
  })


})
//---------PUTs---------//
//Editar un proveedor existente
router.put('/', function(req, res, next) {
  let proveedor = {
    razonSocial : req.body.razonSocial,
    domicilio : req.body.domicilio,
    cuit : req.body.cuit,
    mail : req.body.mail,
    telefono : req.body.telefono,
    usuario : req.body.usuario,
    contrasena : req.body.contrasena
  }

  const operacion = dataProveedores.putProveedor(proveedor);
  operacion.then(element => {
    if (element) {
      res.status(200);
      res.json("Se realizó la modificación de los campos solicitados");
    } else {
      res.status(404);
      res.json("No se pudo realizar la modificación")
    }
  })
})
//Modificar un producto del catálogo
router.put('/productos', function(req,res,next) {
  let producto = {
    idProd : req.body.idProd,
    stock : req.body.stock,
    precio : req.body.precio,
    nombre : req.body.nombre,
    proveedor : req.body.proveedor,
    categoria : req.body.categoria
  }
  let operacion = dataProveedores.putProducto(producto);

  operacion.then(element => {
    if (element) {
      res.status(200);
      res.json("El producto fue modificado correctamente")
    } else {
      res.status(404);
      res.json("No se modificó el producto, uno o mas valores son incorrectos")
    }
  })
})
//---------DELETEs---------//
//Delete de proveedor por CUIT
router.delete('/', function(req,res,next) {
  let cuit = req.body.cuit;

  const operacion = dataProveedores.deleteProveedor(cuit);

  operacion.then(element => {
    if (element) {
      res.status(200);
      res.json("El proveedor fue eliminado correctamente")
    } else {
      res.status(404);
      res.json("Hubo un error al eliminar el proveedor, revisá que los datos ingresados sean los correctos")
    }
  })
})
//Delete de producto por id
router.delete('/productos', function (req, res, next) {
  let id = req.body.idProd

  const operacion = dataProveedores.deleteProducto(id);

  operacion.then(element => {
    if (element) {
      res.status(200);
      res.json("El producto fue eliminado correctamente")
    } else {
      res.status(404);
      res.json("No se encontró el producto seleccionado")
    }
  })

})





module.exports = router;
