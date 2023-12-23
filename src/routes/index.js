const express = require('express');
const checkSesion = require('../middleware/sesion');

//const departamento = require('./departamento');
const login = require('./login');
const dashboard = require('./dashboard');
const grupo_acceso = require('./grupo_acceso');
const empresa = require('./empresa');
const departamento = require('./departamento');
const puesto = require('./puesto');
const empleado = require('./empleado');
const ajuste_empleado = require('./ajuste_empleado');


const cliente = require('./cliente');
const reclutamiento = require('./reclutamiento');
const amonestacion = require('./amonestacion');
const permiso = require('./permiso');
const licencia = require('./licencia');
const form_data = require('./form_data');
const agenda = require('./agenda');
const negocio = require('./negocio');
const ejecutivo = require('./ejecutivo');

const organigrama = require('./organigrama');

const facturacion = require('./facturacion');

const marca = require('./marca');
const categoria = require('./categoria');
const suplidor = require('./suplidor');
const producto = require('./producto');
const orden = require('./orden');
const clase = require('./clase');
const caja = require('./caja');
const ncf = require('./ncf');

//const controller = require('../controllers/customerController');
const router = express.Router();
//const customerController = require('../controllers/customerController');


router.use('/login',login);
router.use('/',dashboard);
// router.get('*',checkSesion,dashboard);
router.use('/grupo_acceso',checkSesion,grupo_acceso);
router.use('/empresa',checkSesion,empresa);
router.use('/departamento',checkSesion,departamento);
router.use('/puesto',checkSesion,puesto);
router.use('/empleado',checkSesion,empleado);
router.use('/ajuste_empleado',checkSesion,ajuste_empleado);
router.use('/cliente',checkSesion,cliente);
router.use('/amonestacion',checkSesion,amonestacion);
router.use('/permiso',checkSesion,permiso);
router.use('/licencia',checkSesion,licencia);
router.use('/form_data',checkSesion,form_data);
router.use('/reclutamiento',checkSesion,reclutamiento);
router.use('/agenda',checkSesion,agenda);
router.use('/organigrama',checkSesion,organigrama);
router.use('/negocio',checkSesion,negocio);
router.use('/ejecutivo',checkSesion,ejecutivo);

router.use('/facturacion',checkSesion,facturacion);
router.use('/marca',checkSesion,marca);
router.use('/categoria',checkSesion,categoria);
router.use('/suplidor',checkSesion,suplidor);
router.use('/producto',checkSesion,producto);
router.use('/orden',checkSesion,orden);
router.use('/clase',checkSesion,clase);
router.use('/caja',checkSesion,caja);
router.use('/ncf',checkSesion,ncf);

module.exports = router;