
const express = require('express');
const cron = require('node-cron');
//const controller = require('../controllers/negocioController');
const router = express.Router();
const uploadFile = require('../middleware/multer');
const negocioController = require('../controllers/negocioController');

const { vencimiento_registro_mercantil_list, lista_correo_registro_mercantil_vence, send_mail } = require('../services/emailService');

var moment = require('moment');

router.get('/', negocioController.list);

router.get('/new', negocioController.new);

router.post('/add',negocioController.save);

router.get('/update/:id',negocioController.edit);
router.post('/update/:id/:index',uploadFile,negocioController.update);
router.get('/historial/:id/:inicio',negocioController.historial);

router.get('/sucursal/:id',negocioController.sucursal);
router.get('/sucursal/new/:id',negocioController.sucursal_new);
router.post('/sucursal/add/:id',negocioController.sucursal_save);
router.get('/sucursal_update/:id/:su',negocioController.sucursal_edit);
router.post('/sucursal/update/:id/:su',negocioController.sucursal_update);

router.get('/sucursal/historial/:id/:su/:inicio/:razon_social',negocioController.sucursal_historial);

router.get('/delete/:id',negocioController.delete);
cron.schedule('01 52 15 * * *',async () => { // segundos minutos horas 08:01:01

    const hoy = new Date('yy-mm-dd');
    let vence = await vencimiento_registro_mercantil_list()
    
    if(vence[0]){
		if(typeof vence[0] !="object"){
			let person = "";
			if(vence[0] ==undefined){
				return;
			}else{
				// person = persona;
			}
			
		}
		// Si es mas de un item.
		else{
			
			let negocios = 'Negocios:';
			for (let i = 0; i < vence[0].length; i++) { //inserto el id afiliado
				negocios += ` ${vence[0][i].razon_social},`;

			}
			
			const lista_registro_mercantil_vence = await lista_correo_registro_mercantil_vence();
			if(vence[0].length==1){
				let body_cita = `El registro mercantil del negocio ${vence[0][0].razon_social} vence el ${moment(vence[0][0].fecha_registro_mercantil).format('DD-MM-YYYY') }`;
				send_mail(lista_registro_mercantil_vence[0].email_institucional,'Recordatorio de vencimiento',`Negocio: ${vence[0][0].razon_social}`,body_cita,)
			}
			else if(vence[0].length > 1){
				negocios += ` vencen el ${moment(vence[0][0].fecha_registro_mercantil).format('DD-MM-YYYY') }`
				// console.log(negocios)
				for (let i = 0; i < lista_registro_mercantil_vence.length; i++) { //inserto el id afiliado
					send_mail(lista_registro_mercantil_vence[i].email_institucional,'Recordatorio de vencimiento',`Negocios que su registro mercantil venceran el proximo mes`,negocios,)
				}
			}
		}
		
	}else{
		console.log('No hay citas pendientes');
	}
  });

module.exports = router;