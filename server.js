const prompt = require('prompt-sync')();

const express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
var path = require('path');

const port = 8080;

var indexRouter = require('./routes/indexRouter');
var proveedoresRouter = require('./routes/proveedoresRouter');
var compradoresRouter = require('./routes/compradoresRouter');
var carritoRouter = require('./routes/carritoRouter');
var compradoresServices = require('./services/comprador.services');
var proveedorServices = require('./services/proveedor.services');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.listen(port, () => {
  console.log('Se levantó la página en http://localhost:8080')
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api/compradores', compradoresRouter);
app.use('/api/proveedores', proveedoresRouter);
app.use('/api/carrito', carritoRouter)

compradoresServices.loguinUser("'juan'","1234")
proveedorServices.loguinUser("'sapecigarrillos'", "0000")








