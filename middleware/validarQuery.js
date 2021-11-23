const caracteresProhibidos = [";","AND", "OR", "&","|","$","/","#","-"];

function validate(cadena) {
  let retorno= false;

  caracteresProhibidos.forEach((caracter) => {

    if (cadena.includes(caracter)) {
      retorno = true;
    }

  })
  return retorno
}

module.exports = {validate}