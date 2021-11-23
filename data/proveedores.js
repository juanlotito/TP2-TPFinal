const prompt = require('prompt-sync')();
const mysql = require('../connection/database.js').crearConexion();
const validar = require('../middleware/validarQuery.js')
const express = require('express');

const app = express();



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function getAllProveedores() {

  const consulta = "SELECT * FROM td_proveedores";

  async function getProveedores() {
    return new Promise((resolve, reject) => {
      mysql.query(consulta, function (err, result, fields) {
        if (err) reject(err)
        else resolve(result)
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

  const retorno = await getProveedores();

  return retorno
}

async function postProveedor (proveedor) {
  let consulta = "INSERT INTO td_proveedores VALUES("+proveedor.razonSocial+", "+proveedor.domicilio+", "+proveedor.cuit+", "+proveedor.mail+", "+proveedor.telefono+", "+proveedor.usuario+", "+proveedor.contrasena+")";
  console.log(consulta)

  if (!validar.validate(consulta)) {

  async function post(consulta) {
    return new Promise((resolve, reject) => {
      mysql.query(consulta, function (err, results, fields) {
        if (err) {console.log(err)
          reject(false)}
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

  const exito = await post(consulta);

  return exito
  }

  else {
    return false
  }
}

async function putProveedor(proveedor) {
  const consulta = "UPDATE td_proveedores SET razonSocial = "+proveedor.razonSocial+", domicilio = "+proveedor.domicilio+", cuit = "+proveedor.cuit+", mail ="+proveedor.mail+", telefono = "+proveedor.telefono+", usuario = "+proveedor.usuario+", contrasena ="+proveedor.contrasena+" WHERE cuit ="+proveedor.cuit
  console.log(consulta)
  if (!validar.validate(consulta)){

  async function put (consulta) {
    return new Promise((resolve, reject) => {
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

  const operacion = await put(consulta);
  return operacion
  } else {
    return false
  }
}

async function deleteProveedor(cuit) {
  let consulta = "DELETE FROM td_proveedores WHERE cuit ="+cuit

  if (!validar.validate(cuit)) {

    async function deleteProv(consulta) {
      return new Promise((resolve, reject) => {
        mysql.query(consulta, function(err, results, fields) {
          if (err) reject(false)
          else resolve(true)
        })
      }).then(
        function(valor){
          return valor
        },
        function (valor) {
          return valor
        }
      )
    }

    const exito = await deleteProv(consulta);
    return exito

  } else {
    return false
  }
}

async function getProductos(cuit) {
  const consulta = "SELECT * FROM td_productos WHERE proveedor = "+cuit
  
  if (!validar.validate(consulta)) {

    async function get(consulta) {
      return new Promise((resolve, reject) => {
        mysql.query(consulta, function (err, results, fields) {
          if (err) reject(err)
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
    return undefined
  }
}

async function postProducto(producto) {
  const consulta = "INSERT INTO td_productos VALUES(11,"+producto.stock+", "+producto.precio+", "+producto.nombre+", "+producto.proveedor+", "+producto.categoria+")"

  if (!validar.validate(consulta)) {

    async function post(consulta) {
      return new Promise((resolve, reject) => {
        mysql.query(consulta, function (err, results, fields) {
          if (err) {
            console.log(err);
            reject(false);}
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

    const exito = await post(consulta);
    return exito
  } 
  else {
    return false
  }
}

async function putProducto(producto) {
  let consulta = "UPDATE td_productos SET stock ="+producto.stock+", precio = "+producto.precio+", nombre = "+producto.nombre+", proveedor ="+producto.proveedor+", idCategoria ="+producto.categoria+" WHERE idProd ="+producto.idProd;

  if (!validar.validate(consulta)) {
    async function putProd(consulta) {
      return new Promise((resolve, reject) => {
        mysql.query(consulta, function (err, results, field) {
          if (err) { console.log(err)
          reject(false)}
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
    const exito = await putProd(consulta);
    return exito
  } 
  else {
    return false
  }
}

async function deleteProducto(id) {
  const consulta = "DELETE FROM td_productos WHERE idProd ="+id

  if (!validar.validate(consulta)) {
    async function deleteProd(consulta) {
      return new Promise((resolve, reject) => {
      mysql.query(consulta, function (err, results, field) {
        if (err) reject(false);
        else if (results.affectedRows == 0) {
          reject(false);
        }
        else {resolve(true)}
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
    const exito = await deleteProd(consulta);
    return exito
  }
  else {return false}
}

async function credencialesCorrectas(usuario, contrasena) {
  const consulta = "SELECT usuario, contrasena FROM td_proveedores WHERE usuario ="+usuario

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

module.exports = {getAllProveedores, postProveedor, putProveedor, deleteProveedor, getProductos, postProducto, putProducto, deleteProducto, credencialesCorrectas}