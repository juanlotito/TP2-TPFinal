const prompt = require('prompt-sync')();
const mysql = require('../connection/database.js').crearConexion()
const validar = require('../middleware/validarQuery.js')
const express = require('express');


var app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))




async function getCompradores () {
  const consulta = "SELECT * FROM td_compradores";

  if (!validar.validate(consulta)){
    async function get(consulta) {
      return new Promise ((resolve, reject) => {
        mysql.query(consulta, function (err, results, fields) {
          if (err) {
            reject(err)
          } else {
            resolve(results)
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
  
  const results = await get(consulta);
  return results 
  } else {
  throw new Error ("SQL Inyeccion detected")
  }

  
}

async function postComprador (comprador) {
  // Creamos la constante que servirá como consulta
  const post = "INSERT INTO td_compradores VALUES ("+comprador.dni+","+comprador.nombre+","+comprador.domicilio+","+comprador.mail+","+comprador.telefono+","+comprador.usuario+","+comprador.contrasena+");"

  //Generamos una función asíncrona que devolverá la promesa
  async function postear(consulta) {
    return new Promise ((resolve, reject) => {
      //Realizamos la query llevándonos una consulta por parámetro en postear()
      mysql.query(consulta, function(err, result, fields) {
        //Si hay error rechazamos promesa
        if (err) {reject(false);}
        //Si no hay error resolvemos promesa
        else {resolve(true)};
      })
    }).then(
      //Handle del resolve
      function (valor) {
        return valor
      },
      //Handle del reject
      function (valor) {
        return valor
      }
    ) 
  }
  //Asignamos lo que devuelva la promesa a una constante que luego será retornada
  const exito = await postear(post);
  return exito
  
}

async function deleteComprador (dni) {
  //Creamos la consulta que se va a llevar la query
  const consulta = "DELETE FROM td_compradores WHERE dni = "+dni;
  //Creamos otra función dentro que devolverá la promesa
  async function deletear(consulta) {
    return new Promise ((resolve, reject) => {
      //Realizamos la query pasando por parámetro la consulta a realizar
      mysql.query(consulta, function(err, result, fields) {
        //Si hay error o no hubo cambios en ninguna fila, devolvemos FALSO (no se realizó nada)
        if (err || result.affectedRows == 0) {reject(false)}
        //Sino, devolvemos VERDADERO (se realizó algún cambio y no hubo errores)
        else {
          resolve(true)}
      })
    }).then(
      //Handle del resolve
      function (valor) {
        return valor
      },
      //Handle del reject
      function (valor) {
        return valor
      }
    )
  }
  //Asignamos el retorno de la promesa a una constante y retornamos
  const exito = await deletear(consulta); 
  return exito;
}

async function putComprador(comprador) {
  const consulta = "UPDATE td_compradores SET dni = dni, nombre ="+comprador.nombre+", domicilio ="+comprador.domicilio+", mail = "+comprador.mail+", telefono = "+comprador.telefono+", usuario = "+comprador.usuario+", contrasena = "+comprador.contrasena+" WHERE dni = "+comprador.dni;

  if (!validar.validate(consulta)) {
    async function put(consulta) {
      return new Promise ((resolve, reject) => {
        mysql.query(consulta, function (err, results, fields) {
          if (err) {reject(false);}
          else if (results.affectedRows == 0) {
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

    const exito = await put(consulta);
    return exito 
  } else {
    return false
  }
}

async function credencialesCorrectas(usuario, contrasena) {
  const consulta = "SELECT usuario, contrasena FROM td_compradores WHERE usuario ="+usuario

  if (!validar.validate(consulta)) {
    async function credenciales (consulta) {
      return new Promise ((resolve, reject) => {
        mysql.query(consulta, function (err, results, fields) {
          if (results[0].contrasena == contrasena) {
            
            resolve(true);
            
          } else {
            
            reject(false);
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

  const exito = await credenciales(consulta)

  return exito
}
}


module.exports = {getCompradores, postComprador, deleteComprador, putComprador, credencialesCorrectas}