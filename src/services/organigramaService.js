const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const list = () => new Promise((resolve, reject) => {
	let citas = 'SELECT `id_puesto` as `memberId` , `descripcion` as otherInfo, `id_puesto_supervisor` as parentId, `id_negocio` FROM `jr_puesto` WHERE `id_negocio` = 1';
	localConnection.query(citas, (error, lacita) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(lacita);
	});
});

const save = (values) => new Promise((resolve, reject) => {
	// console.log(values)
	let query = 'INSERT INTO `jr_cita`(`titulo`,`fecha`, `hora_inicio`, `hora_fin`, `color`, `motivo`, `estado`, `recordatorio`, `minuta`, `registrada_por`, `lugar`, `geo`, `empresa`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		resolve(insertados);
	});
});

const save_invitado = (ejecutivointerno, externo, ejecutivo_pago, persona_sucursal, id_cita, persona) => new Promise((resolve, reject) => {

	if(id_cita){
		if(typeof persona!="object"){
			let person = "";
			if(persona ==undefined){
				person = 0;
			}else{
				person = persona;
			}
			let vals = [ejecutivointerno, externo, ejecutivo_pago, persona_sucursal, id_cita, person];
			let insert = "INSERT INTO `jr_invitados`(`id_ejecutivo_interno`, `id_ejecutivo_banco`, `id_ejecutivo_pago`, `id_persona_sucursal`, `id_cita`, `id_invitado_externo`) VALUES ( ? );";
			// console.log(vals)
			
			// Actualiza los datos de la persona de la sucursal
			localConnection.query(insert,[vals], (error, inserted) => {
				if (error) {
					console.log(error)
					reject(error);
					return;
				}
				resolve('Datos agregados correctamente');
			});
		}
		// Si es mas de un item.
		else{
			// Recorro el arreglo de las personas encargadas de la sucursal
			for (let i = 0; i < persona.length; i++) { //inserto el id afiliado
				
				let vals = [ejecutivointerno, externo, ejecutivo_pago, persona_sucursal, id_cita, persona[i]];
				let insert = "INSERT INTO `jr_invitados`(`id_ejecutivo_interno`, `id_ejecutivo_banco`, `id_ejecutivo_pago`, `id_persona_sucursal`, `id_cita`, `id_invitado_externo`) VALUES ( ? );";
			
				localConnection.query(insert,[vals], (error, inserted) => {
					// console.log(error)
					if (error) {
						reject(error);
						return;
					}
				});
		
			}
			resolve('Afiliado agregados correctamente');
		}
		
	   
	}else{
		resolve('NO hay Afiliado');
	}


});

const insert_path = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'INSERT INTO `jr_documentos_cita`(`descripcion`, `path`, `id_cita`)  VALUES ( ? )';
    // console.log(query)
	localConnection.query(query, [values], (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Documento insertado');
	});
});
const cita = (id) => new Promise((resolve, reject) => {
	let citas = 'SELECT `id_cita`, `titulo`, `fecha`, `hora_inicio`, `hora_fin`, `color`, `motivo`, `estado`, `recordatorio`, `minuta`, `fecha_registro`, `registrada_por`, `lugar`, `geo`, `empresa` FROM `jr_cita` WHERE `id_cita` =?';
	localConnection.query(citas,id, (error, lacita) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(lacita);
	});
});
const buscar_invitados = (id) => new Promise((resolve, reject) => {
	let citas = 'SELECT `id_ejecutivo_interno`, `id_ejecutivo_banco`, `id_ejecutivo_pago`, `id_persona_sucursal`, `id_cita`, `id_invitado_externo` FROM `jr_invitados` WHERE `id_cita` =?';
	localConnection.query(citas,id, (error, lacita) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(lacita);
	});
});

const buscar_invitados_sucursal = (id) => new Promise((resolve, reject) => {
	let persona_sucursal = 'SELECT `id_persona`, `nombre_persona_suc`, `cargo_pers_suc`, `cedula`, `telefono_pers_suc`, `correo`, `empresa`, `estado`, `fecha_creacion` FROM `jr_persona_sucursal` WHERE `id_persona` =?';
	localConnection.query(persona_sucursal,id, (error, persona) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(persona);
	});
});

const guardarLogs = (id_empleado,tabla,data,id_afectado) => new Promise((resolve, reject) => {
	let saveLogs = `INSERT INTO jr_logs(id_empleado, tabla, data, id_afectado) VALUES ('${id_empleado}','${tabla}','${data}','${id_afectado}')`;
    localConnection.query(saveLogs, (error, negocioInserted) => {
        if (error) {
            console.log(error)
            reject(error);
            return true;
        }else{
            resolve('Datos actualizados correctamente');
        }
        // resolve('Datos actualizados correctamente');
    });
});

const update = (values,id_empleado) => new Promise( async(resolve, reject) => {
	let lacita = await cita(values[12])
	let listaInvitadoExterno = [];
	let losinvitados = await buscar_invitados(values[12]);
	for (let invitado of losinvitados) {
		let dataInvitadoExterno = await buscar_invitados_sucursal(invitado.id_invitado_externo)
		listaInvitadoExterno.push(dataInvitadoExterno);
	}

	console.log('Muestro mis inditado', listaInvitadoExterno)
	var json = {
        'cita':lacita,
        'invitados':losinvitados,
		'invitados_externo':listaInvitadoExterno
    }

    let data = JSON.stringify(json);

    let id_afectado = values[12];
    let tabla ='jr_cita';
    await guardarLogs(id_empleado,tabla,data,id_afectado);
	// console.log(values)
	let query = 'UPDATE `jr_cita` SET `titulo`=?,`fecha`=?,`hora_inicio`=?,`hora_fin`=?,`color`=?,`motivo`=?,`estado`=?,`recordatorio`=?,`minuta`=?,`lugar`=?,`geo`=?, `empresa` = ? WHERE `id_cita`=?';

	localConnection.query(query,values, (error, insertados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		resolve(insertados);
	});
});

const eliminar_invitados = (id_cita) => new Promise((resolve, reject) => {

	let query = 'DELETE FROM `jr_invitados` WHERE `id_cita` =?';

	localConnection.query(query,[id_cita], (error, eliminada) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		resolve(eliminada);
	});
});

// const update_invitado = (ejecutivointerno, externo, ejecutivo_pago, persona_sucursal, id_cita, persona) => new Promise((resolve, reject) => {

// 	if(id_cita){
// 		if(typeof persona!="object"){
// 			let person = "";
// 			if(persona ==undefined){
// 				person = 0;
// 			}else{
// 				person = persona;
// 			}
// 			let vals = [ejecutivointerno, externo, ejecutivo_pago, persona_sucursal, id_cita, person];
// 			let insert = "INSERT INTO `jr_invitados`(`id_ejecutivo_interno`, `id_ejecutivo_banco`, `id_ejecutivo_pago`, `id_persona_sucursal`, `id_cita`, `id_invitado_externo`) VALUES ( ? );";
// 			// console.log(vals)
			
// 			// Actualiza los datos de la persona de la sucursal
// 			localConnection.query(insert,[vals], (error, inserted) => {
// 				if (error) {
// 					console.log(error)
// 					reject(error);
// 					return;
// 				}
// 				resolve('Datos agregados correctamente');
// 			});
// 		}
// 		// Si es mas de un item.
// 		else{
// 			// Recorro el arreglo de las personas encargadas de la sucursal
// 			for (let i = 0; i < persona.length; i++) { //inserto el id afiliado
				
// 				let vals = [ejecutivointerno, externo, ejecutivo_pago, persona_sucursal, id_cita, persona[i]];
// 				let insert = "INSERT INTO `jr_invitados`(`id_ejecutivo_interno`, `id_ejecutivo_banco`, `id_ejecutivo_pago`, `id_persona_sucursal`, `id_cita`, `id_invitado_externo`) VALUES ( ? );";
			
// 				localConnection.query(insert,[vals], (error, inserted) => {
// 					// console.log(error)
// 					if (error) {
// 						reject(error);
// 						return;
// 					}
// 				});
		
// 			}
// 			resolve('Afiliado agregados correctamente');
// 		}
		
	   
// 	}else{
// 		resolve('NO hay Afiliado');
// 	}


// });



const borrar = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'DELETE FROM `jr_acceso_vs_grupo` WHERE `id_grupo` = ?';

	localConnection.query(query,[id], (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Datos borrados');
	});
});



module.exports = {
	list,
    update,
    borrar,
    save,
	save_invitado,
	buscar_invitados,
	// update_invitado,
	eliminar_invitados,
	insert_path,
};