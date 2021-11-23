var express = require('express');
const { cp } = require('fs');
var router = express.Router();
const dataCompradores = require('../data/compradores');
const validador = require('../middleware/validarQuery');


//Asigno el retorno del get all compradores a un array fuera de cualquier GET con el objetivo de ir generando diferentes GETs, por ejempo por DNI, por dirección, etc. El filtrado de datos que van a tener estos GETs no se hará desde la consulta SQL, sino desde el código mismo.

// ------------GETS------------//
//Get de todos los compradores
router.get('/', function(req, res, next) {
  let compradores = dataCompradores.getCompradores()

  compradores.then(element => {
    if (element.length) {
      res.status(200);
      res.json(element);
    } else {
      res.status(200);
      res.json("La consulta fue correcta pero no trajo resultados")
    }
  })
})
//Get de comprador x DNI
router.get('/dni', function(req, res, next) {
  //Generamos nuevamente un array de devolución
  let jsonFinal = [];
  //Validamos posibles inyecciones SQL
  if (!validador.validate(JSON.stringify(req.body.dni))) {
  
  //Vamos a recorrer el array que nos brinde la DB y buscaremos nuestro comprador
  compradores.then(elements => {
    let i = 0;
    let compradorEncontrado = undefined;

    //Si encontramos un elemento dentro de nuestra promesa que coincida con el DNI pasado por parámetro, lo asignamos para devolver
    while (i<elements.length && compradorEncontrado == undefined) {
      if (elements[i].dni == req.body.dni) {
        compradorEncontrado = elements[i];
      } else {
        i++;
      }
    }
    //Si no se encontró, devolvemos 404, si se encuentra va 200 con el json del comprador
    if (compradorEncontrado == undefined) {
      res.status(404);
      res.json("No se encontró el DNI ingresado o bien ingresaste un caracter incorrecto")
    } else {
      res.status(200);
      res.json(compradorEncontrado);
    }
  })
  //Si da positivo por inyección SQL cortamos la ejecución del programa
 } else {
   throw new Error ("Ingresaste un caracter inválido");
 }
})

// ------------POSTS------------//
//Post de comprador
router.post('/', function(req,res,next) {
  //Generamos un objeto comprador con todos los datos del body
  let comprador = {
    dni : req.body.dni,
    nombre : req.body.nombre,
    domicilio : req.body.domicilio,
    mail : req.body.mail,
    telefono : req.body.telefono,
    usuario : req.body.usuario,
    contrasena : req.body.contrasena
  }
  //Validamos inyecciones SQL. Esta solución es diferente a la realizada con el GET, simplemente porque no sabíamos cual era la mejor opción a realizar, si cortar la ejecución o simplemente rechazar el pedido de POST.
  if (validador.validate(JSON.stringify(comprador))) {
    res.status(200);
    res.json("El usuario no pudo ser cargado porque me querés hacer una inyección SQL")
  }
  
  let post = dataCompradores.postComprador(comprador);
  //La promesa siempre va a devolver TRUE si se realizó el POST, FALSE si no se realizó. Por lo que en función de este resultado, definimos lo que va a devolver nuestro sistema.
  post.then(element => {
    if (element == true) {
      res.status(200);
      res.send("El usuario fue cargado con éxito")
    } else {
      res.status(200);
      res.send("Hubo un error! Ingresaste valores incorrectos o el usuario ya existe")
    }
  })

})

// ------------PUTs------------//
//Put de comprador por DNI
router.put('/', function (req, res, next) {
  let comprador = {
    dni : req.body.dni,
    nombre : req.body.nombre,
    domicilio : req.body.domicilio,
    mail : req.body.mail,
    telefono : req.body.telefono,
    usuario : req.body.usuario,
    contrasena : req.body.contrasena
  }
  const operacion = dataCompradores.putComprador(comprador)

  operacion.then(element => {
    if (element) {
      res.status(200);
      res.json("Modificación realizada correctamente");
    } else {
      res.status(404);
      res.json("No se modificó al comprador. Revisá los datos ingresados")
    }
  })
})

// ------------DELETEs------------//
//Delete por DNI
router.delete('/', function(req,res,next) {
  if (validador.validate(req.body.dni)) {
    res.status(200);
    res.json("El usuario no pudo ser eliminado porque me querés hacer una inyección SQL");
  }
  
  let eliminar = dataCompradores.deleteComprador(req.body.dni);

  eliminar.then(element => {
    if (element == true) {
      res.status(200);
      res.json("El usuario fue eliminado correctamente");
    }
    else {
      res.status(200);
      res.json("Error! El usuario no existe")
    }
  })
})





module.exports = router
