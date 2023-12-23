const express = require('express');
//const controller = require('../controllers/empleadoController');
const router = express.Router();
const form_dataController = require('../controllers/form_dataController');
const checkSesion = require('../middleware/sesion');

router.get('/subzonas/:id',form_dataController.subzona);
router.get('/codigo_postal/:id',form_dataController.codigo_postal);
router.get('/municipio/:id',form_dataController.municipio);
router.get('/sector/:id',form_dataController.sector);
router.get('/encargado/:id',form_dataController.encargado);
router.get('/empleado/:valor/:estado/:inicio',checkSesion,form_dataController.filtro_empleados);
router.get('/ajusteempleado/:cod',checkSesion,form_dataController.ajuste_empleado);


router.get('/reclutamiento/:valor',checkSesion,form_dataController.filtro_reclutamiento_rrhh);
router.get('/reclutamiento/:valor/:id',checkSesion,form_dataController.filtro_reclutamiento);
router.get('/salida/:id',form_dataController.datos_salida);

router.get('/permiso/:valor',checkSesion,form_dataController.filtro_permisos);
router.get('/permiso_grupo/:valor',checkSesion,form_dataController.permiso_grupo);

router.get('/negocio/:valor/:est/:inicio',checkSesion,form_dataController.filtro_negocio);
// router.get('/informacion_bancaria/:banco/:tipo_cuenta/:frecuencia/:cuenta_debito/:cuenta_credito/:negocio',checkSesion,form_dataController.save_informacion_bancaria);
router.get('/informacion_bancaria/:banco/:tipo_cuenta/:frecuencia/:cuenta_debito/:cuenta_credito/:negocio',checkSesion,form_dataController.save_informacion_bancaria);
router.get('/update_informacion_bancaria/:banco/:tipo_cuenta/:frecuencia/:cuenta_debito/:cuenta_credito/:negocio/:id_info',checkSesion,form_dataController.update_informacion_bancaria);
router.get('/eliminar_informacion_bancaria/:id/:negocio',checkSesion,form_dataController.eliminar_informacion_bancaria);
router.get('/info_bank/:id',form_dataController.info_bank);
router.get('/invitados/:valor',checkSesion,form_dataController.filtro_invitados);

// nom,car,ced,cel,cor   ///nombre+"/"+cargo+"/"+celular+"/"+correo,
router.get('/responsable/add/:nom/:car/:ced/:cel/:cor',checkSesion,form_dataController.insert_invitado);
router.get('/invitados/update/:nom/:car/:ced/:tel/:cor/:per',checkSesion,form_dataController.update_invitado);
router.get('/invitado/:id',checkSesion,form_dataController.filtro_invitado);

router.get('/responsables/:valor',checkSesion,form_dataController.filtro_responsables);
router.get('/responsable/:id',checkSesion,form_dataController.el_responsable);

router.get('/cita/:id',checkSesion,form_dataController.detalles_cita);
router.get('/cita_id_fecha/:id/:fecha',checkSesion,form_dataController.id_fecha);

//router.get('/', form_dataController.listar);
router.post('/add',checkSesion,form_dataController.save);

//router.get('/update/:id',form_dataController.edit);
router.post('/update/:id',checkSesion,form_dataController.update);

router.get('/delete/:id',checkSesion,form_dataController.delete);

router.get('/historial_filtro/:id/:inicio/:fecha_desde/:fecha_hasta',form_dataController.historial_filtro);
router.get('/historial_filtro_sucursal/:su/:inicio/:fecha_desde/:fecha_hasta',form_dataController.historial_filtro_sucursal);
router.get('/historialfiltrocita/:id_cita/:inicio/:fecha_desde/:fecha_hasta',form_dataController.historial_filtro_cita);

router.get('/puesto/:empresa',form_dataController.puesto);
router.get('/organigrama',form_dataController.puesto);
router.get('/departamento/:empresa',form_dataController.departamento);
router.get('/sucursal/:empresa',form_dataController.sucursal);
module.exports = router;
