const express = require('express');
const cron = require('node-cron');
//const controller = require('../controllers/customerController');
const router = express.Router();
const uploadFile = require('../middleware/multer');
const agendaController = require('../controllers/agendaController');
const { notificiaciones_list, send_mail, correo_empleado } = require('../services/emailService');
var moment = require('moment');


router.get('/', agendaController.list);
router.post('/add',agendaController.save);

router.get('/update/:id',agendaController.edit);
router.post('/update/:id/:li/:index',uploadFile,agendaController.update);

router.get('/delete/:id',agendaController.delete);

module.exports = router;

cron.schedule('* * * * *',async () => {
    const hoy = new Date('yy-mm-dd');
    let citas = await notificiaciones_list()
    // console.log('hola')
    
    if(citas[3]){
		if(typeof citas[3] !="object"){
			let person = "";
			if(citas[3] ==undefined){
				return;
			}else{
				// person = persona;
			}
			
		}
		// Si es mas de un item.
		else{
			// Recorro el arreglo de las personas encargadas de la sucursal
			for (let i = 0; i < citas[3].length; i++) { //inserto el id afiliado
				var todayDate = new Date().toISOString().slice(0, 10);
				// console.log('Verifico quien registra ========>', citas[3][i].recordatorio )
				// console.log(todayDate == citas[3][i].fecha)
				// console.log(moment().format('HH:mm:00') == citas[3][i].recordatorio)

				// console.log(moment().format('HH:mm:00'))

				// console.log(citas[3][i].recordatorio)

				if( todayDate == citas[3][i].fecha && moment().format('HH:mm:00') == citas[3][i].recordatorio){
					let email_empleado = await correo_empleado(citas[3][i].registrada_por)
				// console.log('Verifico el correo ========>', email_empleado[0].email_institucional)
					let body_cita = `Usted tiene una cita para las ${citas[3][i].hora_inicio} el día de hoy en ${citas[3][i].lugar}`
					await send_mail(email_empleado[0].email_institucional,'Recordatorio de Cita',citas[3][i].titulo,body_cita,)
                }
				
			}
		}
		
	}else{
		console.log('No hay citas pendientes');
	}
  });

  function formatFecha(fecha){
    let fechavieja = new Date(fecha).toLocaleDateString();                                                                   
    let nueva =fechavieja.split("/");
    if(nueva[1].length ==1){
        nueva[1]="0"+nueva[1];
        }
    if(nueva[0].length ==1){
        nueva[0]="0"+nueva[0];
        }
    fecha = nueva[2]+'-'+nueva[1] +'-'+nueva[0];
    return fecha;
}