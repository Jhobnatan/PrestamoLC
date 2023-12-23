const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const filtro_empleados = (valor, estado, empresa, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
// const filtro_empleados = (valor, inactivos, afg, awm, otros, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	
	let partEstado = "";
	if (valor === "aaaaaaaaaaaa") {
		valor = "";
	}
	if (estado != '0') {
		partEstado = `AND edo.id_estado = ${estado}`;
	}
	

	//valor = '"%'+valor+'%"';
	let query = "";//'SELECT edo.`id_empleado`, edo.`cedula`, edo.`nombres`, edo.`apellidos`, concat(edo.`nombres`," ", edo.`apellidos`) AS nombre, edo.`codigo`, edo.`id_negocio`, edo.`id_estado`, pue.`descripcion` AS puesto, empsa.`razon_social` AS empresa FROM `jr_empleado` edo, `jr_puesto` pue, `jr_negocio_general` empsa WHERE edo.`id_puesto` = pue.`id_puesto` AND edo.`id_negocio` = empsa.`id_negocio` AND edo.`id_negocio` =?  AND (edo.`cedula` like ? OR  edo.`codigo` like ? OR concat(edo.`nombres`," ", edo.`apellidos`) like ?) ORDER BY edo.`id_empleado` ASC';

	if (inicio !== false && nunreg !== false) {
		query = `SELECT edo.id_empleado, edo.cedula, edo.nombres, edo.apellidos, concat(edo.nombres," ", edo.apellidos) AS nombre, edo.codigo, edo.id_negocio, edo.id_estado, pue.descripcion AS puesto, empsa.razon_social AS empresa FROM jr_empleado edo, jr_puesto pue, jr_negocio_general empsa WHERE edo.id_puesto = pue.id_puesto AND edo.id_negocio = empsa.id_negocio AND edo.id_negocio =? ${partEstado}  AND (edo.cedula like ? OR  edo.codigo like ? OR concat(edo.nombres," ", edo.apellidos) like ?) ORDER BY edo.id_empleado ASC LIMIT ${inicio}, ${nunreg}`;
		
	} else {
		query = `SELECT COUNT(*) AS total FROM jr_empleado edo, jr_puesto pue, jr_negocio_general empsa WHERE edo.id_puesto = pue.id_puesto AND edo.id_negocio = empsa.id_negocio AND edo.id_negocio =? ${partEstado} AND (edo.cedula like ? OR  edo.codigo like ? OR concat(edo.nombres," ", edo.apellidos) like ?)`;
		//    values = [id, fecha_desde, fecha_hasta]
	}
	localConnection.query(query, [empresa,"%" + valor + "%","%" + valor + "%", "%" + valor + "%"], (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(puestos);
	});
});

const detalle_cita = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let detalle = 'SELECT `id_ejecutivo_interno`, `id_ejecutivo_banco`, `id_ejecutivo_pago`, `id_persona_sucursal`, `id_cita`, `id_invitado_externo` FROM `jr_invitados` WHERE `id_cita` = ?';
	let docs = 'SELECT `id_documento`, `descripcion`, `path`, `fecha`, `id_cita` FROM `jr_documentos_cita` WHERE `id_cita`=?'
	Promise.all([
		localQuery(detalle, id),
		localQuery(docs, id),
	]).then(data => {
		// console.log(data)
		resolve(data);
		return

	}, reject => {
		res.status(500).send({ error: errors.DB_ERROR });
		console.log("No se pudo cargar información de formulario. " + reject);
	});
});

const id_por_fecha = (id, fecha) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let values = [id, fecha];
	let query = 'SELECT `id_cita`, `titulo`, `fecha`, `hora_inicio`, `hora_fin`, `color`, `motivo`, `estado`, `recordatorio`, `minuta`, `fecha_registro`, `registrada_por`, `lugar`, `geo` FROM `jr_cita` WHERE `id_cita` = ? AND `fecha` = ?';

	localConnection.query(query, values, (error, cita) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(cita);
	});
});

const filtro_responsables = (valor) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_persona`, `nombre_persona_suc`, `cargo_pers_suc`, `cedula`, `telefono_pers_suc`, `correo`, `empresa`, `estado`, `fecha_creacion` FROM `jr_persona_sucursal` WHERE `nombre_persona_suc` LIKE ? OR  `empresa` LIKE ? LIMIT 10';

	localConnection.query(query, ["%" + valor + "%", "%" + valor + "%"], (error, invitados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(invitados);
	});
});

const responsable = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_persona`, `nombre_persona_suc`, `cargo_pers_suc`, `cedula`, `telefono_pers_suc`, `correo`, `empresa`, `estado`, `fecha_creacion` FROM `jr_persona_sucursal` WHERE `id_persona` = ?';

	localConnection.query(query, id, (error, respon) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(respon);
	});
});

const filtro_invitados = (valor) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_invitado_externo`, `nombre`, `celular`, `empresa`, `cargo`, `correo` FROM `jr_invitado_externo` WHERE `nombre` LIKE ? OR  `empresa` LIKE ? LIMIT 10';

	localConnection.query(query, ["%" + valor + "%", "%" + valor + "%"], (error, invitados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(invitados);
	});
});

const filtro_invitado = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.
	// console.log('Informacion')
	let query = 'SELECT `id_invitado_externo`, `nombre`, `celular`, `empresa`, `cargo`, `correo` FROM `jr_invitado_externo` WHERE `id_invitado_externo` = ?';

	localConnection.query(query, id, (error, invitado) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(invitado);
	});
});

const inert_invitado = (nom, car, ced, tel, cor, est) => new Promise((resolve, reject) => {
	// Informacion del portador. (nom,car,'',cel,cor,'Activo')nom,car,ced,cel,cor
	let valor = [nom, car, ced, tel, cor, est];
	let query = "INSERT INTO `jr_persona_sucursal`(`nombre_persona_suc`, `cargo_pers_suc`, `cedula`, `telefono_pers_suc`, `correo`, `estado`)  VALUES ( ? );";
	// let query = "INSERT INTO `jr_persona_sucursal`(`id_persona`, `nombre_persona_suc`, `cargo_pers_suc`, `cedula`, `telefono_pers_suc`, `correo`, `empresa`, `estado`, `fecha_creacion`) VALUES ( ? )";
	//let query = 'INSERT INTO `jr_invitado_externo`(`nombre`, `celular`, `empresa`, `cargo`, `correo`) VALUES ( ? )';

	localConnection.query(query, [valor], (error, invitados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(invitados);
	});
});

const update_invitado = (nom, car, ced, tel, cor, per) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valor = [nom, car, ced, tel, cor, 'Activo', per];
	//SET `nombre_persona_suc`=?,`cargo_pers_suc`=?,`cedula`=?,`telefono_pers_suc`=?,`correo`=?,`estado`=? WHERE `id_persona`=?;";
	let query = "UPDATE `jr_persona_sucursal` SET `nombre_persona_suc`=?,`cargo_pers_suc`=?,`cedula`=?,`telefono_pers_suc`=?,`correo`=?,`estado`=? WHERE `id_persona`=?;";
	//let query = 'UPDATE `jr_invitado_externo` SET `nombre`=?,`celular`=?,`empresa`=?,`cargo`=?,`correo`=? WHERE `id_invitado_externo`=?';

	localConnection.query(query, valor, (error, invitados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(invitados);
	});
});
/**
 * funcion que devuelve el filtro de los negocios
 * @param {*} valor valor del filtro al buscar
 * @param {*} estado estado del negocio prospecto
 * @param {*} inicio donde inicia el query
 * @param {*} nunreg el numero de registro
 * @returns 
 */
const filtro_negocio = (valor, estado, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = "";
	let values = [];
	if (inicio !== false && nunreg !== false) {
		query = `SELECT ng.id_negocio, ng.razon_social, ng.id_empleado, concat(e.nombres, ' ', e.apellidos) AS registradopor, ng.fecha_creacion, ng.id_tipo_afiliacion, ng.estado, ta.tipo_afiliacion, ng.id_pago_electronico, pe.tipo_pago_electronico, (SELECT concat(nombres, ' ', apellidos) FROM jr_empleado WHERE id_empleado = ng.editado_por) AS editadopor FROM jr_negocio_general ng, jr_empleado e, jr_pago_electronico pe, jr_tipo_afiliacion ta WHERE e.id_empleado = ng.id_empleado AND pe.id_pago_electronico = ng.id_pago_electronico AND ta.id_tipo_afiliacion = ng.id_tipo_afiliacion AND ng.estado = ? AND ng.razon_social LIKE ? ORDER BY ng.razon_social ASC LIMIT ${inicio}, ${nunreg};`;
		//historial = `SELECT id_logs, fecha, id_empleado, tabla, data, id_afectado, accion FROM jr_logs WHERE tabla ='${tabla}' AND id_afectado = ${id} AND fecha >= '${fecha_desde}' AND fecha <= '${fecha_hasta}' ORDER BY id_logs DESC LIMIT ${inicio}, ${nunreg}`;
		// values = [id, fecha_desde, fecha_hasta ,inicio, nunreg]
		// console.log(historial)
	} else {
		query = `SELECT COUNT(*) AS total FROM jr_negocio_general ng, jr_empleado e, jr_pago_electronico pe, jr_tipo_afiliacion ta WHERE e.id_empleado = ng.id_empleado AND pe.id_pago_electronico = ng.id_pago_electronico AND ta.id_tipo_afiliacion = ng.id_tipo_afiliacion AND ng.estado = ? AND ng.razon_social LIKE ? ORDER BY ng.razon_social ASC;`;
		//    values = [id, fecha_desde, fecha_hasta]
	}


	localConnection.query(query, [estado, "%" + valor + "%"], (error, negocios) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(negocios);
	});
});

const filtro_permisos = (valor) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT e.`id_empleado`, e.`cedula`, concat( e.`nombres`, " ", e.`apellidos`) AS solicitante, e.`nombres`, e.`apellidos`, e.`usuario`, e.`codigo`, e.`id_empresa`, (SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = e.`id_empresa`) AS empresa, e.`id_departamento`, (SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = e.`id_departamento`) AS departamento, e.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =e.`id_puesto`) AS puesto, e.`id_estado` AS estado_empleado, p.`id_permiso`, p.`id_tipo_permiso`, (SELECT `tipo_permiso` FROM `jr_tipo_permiso` WHERE `id_tipo_permiso` = p.`id_tipo_permiso`) AS tipo_permiso, p.`fecha_salida`, p.`fecha_entrada`, p.`fecha_solicitud`, p.`motivo`, p.`motivo_cancelacion`, p.`id_encargado`, (SELECT concat(`nombres`, " ",  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` =e.`id_encargado`) AS encargado, p.`fecha_encargado`, p.`comentario_encargado`, p.`id_rrhh`, p.`comentario_rrhh`, p.`fecha_rrhh`, p.`id_estado` AS id_estado_premiso, (SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = p.`id_estado`) AS estado_permiso FROM `jr_permiso` p, `jr_empleado` e WHERE e.`id_empleado` = p.`id_empleado` AND p.`id_encargado` AND e.`cedula` like ? OR e.`id_empleado` = p.`id_empleado` AND p.`id_encargado` AND  e.`codigo` like ?';

	localConnection.query(query, ["%" + valor + "%", "%" + valor + "%"], (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(puestos);
	});
});

const filtro_reclutamiento = (valor, id_empleado) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = "SELECT rec.`id_reclutamiento`, rec.`id_solicitante`, (SELECT concat(`nombres`, ' ',  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` = rec.`id_solicitante`) AS solicitante, rec.`id_empresa`,(SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = rec.`id_empresa`) AS empresa, rec.`id_departamento`,(SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = rec.`id_departamento`) AS departamento, rec.`id_puesto`,(SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =rec.`id_puesto`) AS puesto, p.`descripcion` , rec.`supervisa`, rec.`cant_supervisa`, rec.`id_modalidad`, rec.`conocimiento`, rec.`conocimiento_deseable`, rec.`motivo`, rec.`justificacion`, rec.`rango_edad`, rec.`sexo`, rec.`id_grado_academico`, rec.`id_nivel`, rec.`fecha_solicitud`, rec.`id_estado` FROM `jr_puesto` p, `jr_reclutamiento` rec WHERE rec.`id_puesto` = p.`id_puesto` AND p.`descripcion` like ? AND rec.`id_solicitante` = ?";

	localConnection.query(query, ["%" + valor + "%", id_empleado], (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(puestos);
	});
});
const filtro_reclutamiento_rrhh = (valor) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = "SELECT rec.`id_reclutamiento`, rec.`id_solicitante`, (SELECT concat(`nombres`, ' ',  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` = rec.`id_solicitante`) AS solicitante, rec.`id_empresa`,(SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = rec.`id_empresa`) AS empresa, rec.`id_departamento`,(SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = rec.`id_departamento`) AS departamento, rec.`id_puesto`,(SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =rec.`id_puesto`) AS puesto, p.`descripcion` , rec.`supervisa`, rec.`cant_supervisa`, rec.`id_modalidad`, rec.`conocimiento`, rec.`conocimiento_deseable`, rec.`motivo`, rec.`justificacion`, rec.`rango_edad`, rec.`sexo`, rec.`id_grado_academico`, rec.`id_nivel`, rec.`fecha_solicitud`, rec.`id_estado` FROM `jr_puesto` p, `jr_reclutamiento` rec WHERE rec.`id_puesto` = p.`id_puesto` AND p.`descripcion` like ?";

	localConnection.query(query, ["%" + valor + "%"], (error, filtros_rrhh) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(filtros_rrhh);
	});
});

const codigo_postal = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `codigo_postal` FROM `jr_provincia` WHERE `id_provincia` =?';

	localConnection.query(query, [id], (error, codigo) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(codigo);
	});
});
const subzonas = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_subzona`, `subzona`, `id_zona` FROM `jr_subzona` WHERE `id_zona` =?';

	localConnection.query(query, [id], (error, subzonas) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(subzonas);
	});
});

const municipios = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_municipio` WHERE id_provincia =? ORDER BY `municipio` ASC';

	localConnection.query(query, [id], (error, municipios) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(municipios);
	});
});

const sector = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_sector` WHERE id_municipio =? ORDER BY `sector` ASC';

	localConnection.query(query, [id], (error, sectores) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(sectores);
	});
});

const supervisa = (id_puesto, id_negocio) => new Promise((resolve, reject) => {

	let query = 'SELECT `id_puesto_supervisor` FROM `jr_puesto` WHERE `id_puesto` = ? AND id_negocio = ?';
	let values = [id_puesto, id_negocio]
	localConnection.query(query, values, (error, encargado) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(encargado);
	});
});

const encargados = (id_puesto, id_negocio) => new Promise(async (resolve, reject) => {
	let id_encargado = await supervisa(id_puesto, id_negocio);
	
	let query = 'SELECT * FROM `jr_empleado` WHERE id_puesto =? AND id_negocio = ?';
	let values = [];
	if(id_encargado[0]){
		values = [id_encargado[0].id_puesto_supervisor, id_negocio]
		// console.log('muestro el id encargado',id_encargado[0].id_puesto_supervisor)
	}else{
		values = [0, id_negocio];	
	}
	localConnection.query(query, values, (error, encargados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		resolve(encargados);
	});
});

const ajuste_empleados = (codigo) => new Promise(async (resolve, reject) => {

	let query = 'SELECT emp.`id_empleado`, emp.`cedula`, emp.`nombres`, emp.`apellidos`, emp.`codigo`, emp.`id_encargado`, emp.`fecha_entrada`, emp.`id_grado`, emp.`id_sueldo`, emp.`id_tipo_empleado` FROM `jr_empleado` emp WHERE emp.`codigo`  =?';

	localConnection.query(query, [codigo], (error, empleado) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		resolve(empleado);
	});
});

const salida_empleado = (id) => new Promise((resolve, reject) => {

	let query = 'SELECT `id_salida_empleado`, `id_salida`, `id_empleado`, `motivo`, `realizadopor`, `fecha`, `accion` FROM `jr_movimiento_empleado` WHERE  `id_empleado`= ?';

	localConnection.query(query, [id], (error, Informacion) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(Informacion);
	});
});
const info_bank = (id) => new Promise((resolve, reject) => {

	let query = 'SELECT `id_informacion_bancaria`, `banco_tipo_cuenta`, `cuenta_debito`, `cuenta_credito`, `frecuencia_pago_cheque`, `id_banco`, `id_negocio` FROM `jr_informacion_bancaria` WHERE `id_informacion_bancaria` =?';

	localConnection.query(query, [id], (error, Informacion) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(Informacion);
	});
});

const permiso_grupo = (id) => new Promise((resolve, reject) => {

	let query = 'SELECT a.`id_acceso`, a.`descripcion`, ag.`id_grupo` FROM `jr_acceso` a, `jr_acceso_vs_grupo`  ag WHERE  ag.`id_acceso` = a.`id_acceso` AND ag.`id_grupo` = ?';

	localConnection.query(query, [id], (error, accesos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(accesos);
	});
});

const ver = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query_permisos = 'SELECT e.`id_empleado`, e.`cedula`, concat( e.`nombres`, " ", e.`apellidos`) AS solicitante, e.`nombres`, e.`apellidos`, e.`usuario`, e.`codigo`, e.`id_empresa`, (SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = e.`id_empresa`) AS empresa, e.`id_departamento`, (SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = e.`id_departamento`) AS departamento, e.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =e.`id_puesto`) AS puesto, e.`id_estado` AS estado_empleado, p.`id_permiso`, p.`id_tipo_permiso`, (SELECT `tipo_permiso` FROM `jr_tipo_permiso` WHERE `id_tipo_permiso` = p.`id_tipo_permiso`) AS tipo_permiso, p.`fecha_salida`, p.`fecha_entrada`, p.`fecha_solicitud`, p.`motivo`, p.`motivo_cancelacion`, p.`id_encargado`, (SELECT concat(`nombres`, " ",  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` =e.`id_encargado`) AS encargado, p.`fecha_encargado`, p.`comentario_encargado`, p.`id_rrhh`, p.`comentario_rrhh`, p.`fecha_rrhh`, p.`id_estado` AS id_estado_premiso, (SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = p.`id_estado`) AS estado_permiso FROM `jr_permiso` p, `jr_empleado` e WHERE e.`id_empleado` = p.`id_empleado` AND p.`id_permiso` = ?';
	let query_estados = 'SELECT * FROM `jr_estado`';

	Promise.all([
		localQuery(query_permisos, id),
		localQuery(query_estados,)
	]).then(data => {
		// console.log(data)
		resolve(data);
		return

	}, reject => {
		res.status(500).send({ error: errors.DB_ERROR });
		console.log("No se pudo cargar información de formulario. " + reject);
	});
});


const vertodos = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query_permisos = 'SELECT e.`id_empleado`, e.`cedula`, concat( e.`nombres`, " ", e.`apellidos`) AS solicitante, e.`nombres`, e.`apellidos`, e.`usuario`, e.`codigo`, e.`id_empresa`, (SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = e.`id_empresa`) AS empresa, e.`id_departamento`, (SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = e.`id_departamento`) AS departamento, e.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =e.`id_puesto`) AS puesto, e.`id_estado` AS estado_empleado, p.`id_permiso`, p.`id_tipo_permiso`, (SELECT `tipo_permiso` FROM `jr_tipo_permiso` WHERE `id_tipo_permiso` = p.`id_tipo_permiso`) AS tipo_permiso, p.`fecha_salida`, p.`fecha_entrada`, p.`fecha_solicitud`, p.`motivo`, p.`motivo_cancelacion`, p.`id_encargado`, (SELECT concat(`nombres`, " ",  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` =e.`id_encargado`) AS encargado, p.`fecha_encargado`, p.`comentario_encargado`, p.`id_rrhh`, p.`comentario_rrhh`, p.`fecha_rrhh`, p.`id_estado` AS id_estado_premiso, (SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = p.`id_estado`) AS estado_permiso FROM `jr_permiso` p, `jr_empleado` e WHERE e.`id_empleado` = p.`id_empleado` AND p.`id_permiso` = ?';
	let query_estados = 'SELECT * FROM `jr_estado`';

	Promise.all([
		localQuery(query_permisos, id),
		localQuery(query_estados,)
	]).then(data => {
		// console.log(data)
		resolve(data);

	}, reject => {
		res.status(500).send({ error: errors.DB_ERROR });
		console.log("No se pudo cargar información de formulario. " + reject);
	});
});


const solicitud = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let permiso = 'SELECT * FROM `jr_permiso` WHERE `id_estado` <> 5 AND `id_empleado` = ?';
	let empleado = 'SELECT * FROM `jr_empleado` WHERE `id_empleado` = ?';
	let tipo_permiso = 'SELECT `id_tipo_permiso`, `tipo_permiso` FROM `jr_tipo_permiso`';
	let estados = 'SELECT * FROM `jr_estado`';
	let permisos = 'SELECT e.`id_empleado`, e.`cedula`, concat( e.`nombres`, " ", e.`apellidos`) AS solicitante, e.`nombres`, e.`apellidos`, e.`usuario`, e.`codigo`, e.`id_empresa`, (SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = e.`id_empresa`) AS empresa, e.`id_departamento`, (SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = e.`id_departamento`) AS departamento, e.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =e.`id_puesto`) AS puesto, e.`id_estado` AS estado_empleado, p.`id_permiso`, p.`id_tipo_permiso`, (SELECT `tipo_permiso` FROM `jr_tipo_permiso` WHERE `id_tipo_permiso` = p.`id_tipo_permiso`) AS tipo_permiso, p.`fecha_salida`, p.`fecha_entrada`, p.`fecha_solicitud`, p.`motivo`, p.`motivo_cancelacion`, p.`id_encargado`, (SELECT concat(`nombres`, " ",  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` =e.`id_encargado`) AS encargado, p.`fecha_encargado`, p.`comentario_encargado`, p.`id_rrhh`, p.`comentario_rrhh`, p.`fecha_rrhh`, p.`id_estado` AS id_estado_premiso, (SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = p.`id_estado`) AS estado_permiso FROM `jr_permiso` p, `jr_empleado` e WHERE e.`id_empleado` = p.`id_empleado` AND p.`id_encargado` = ?';
	let permisos_rrhh = 'SELECT e.`id_empleado`, e.`cedula`,concat( e.`nombres`, " ", e.`apellidos`) AS solicitante, e.`nombres`, e.`apellidos`, e.`usuario`, e.`codigo`, e.`id_empresa`, (SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = e.`id_empresa`) AS empresa, e.`id_departamento`, (SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = e.`id_departamento`) AS departamento, e.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =e.`id_puesto`) AS puesto, e.`id_estado` AS estado_empleado, p.`id_permiso`, p.`id_tipo_permiso`, (SELECT `tipo_permiso` FROM `jr_tipo_permiso` WHERE `id_tipo_permiso` = p.`id_tipo_permiso`) AS tipo_permiso, p.`fecha_salida`, p.`fecha_entrada`, p.`fecha_solicitud`, p.`motivo`, p.`motivo_cancelacion`, p.`id_encargado`, (SELECT concat(`nombres`, " ",  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` =e.`id_encargado`) AS encargado, p.`fecha_encargado`, p.`comentario_encargado`, p.`id_rrhh`, p.`comentario_rrhh`, p.`fecha_rrhh`, p.`id_estado` AS id_estado_premiso, (SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = p.`id_estado`) AS estado_permiso FROM `jr_permiso` p, `jr_empleado` e WHERE e.`id_empleado` = p.`id_empleado`';

	Promise.all([
		localQuery(permiso, id),
		localQuery(empleado, id),
		localQuery(tipo_permiso,),
		localQuery(estados,),
		localQuery(permisos, id),
		localQuery(permisos_rrhh)
	]).then(data => {
		// console.log(data)
		resolve(data);

	}, reject => {
		// res.status(500).send({ error: errors.DB_ERROR });
		console.log("No se pudo cargar información de formulario. " + reject);
	});
});

const save = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
	// console.log(values)
	let query = 'INSERT INTO `jr_permiso`( `id_tipo_permiso`, `id_empleado`, `fecha_salida`, `fecha_entrada`, `motivo`, `id_encargado`, `id_estado`) VALUES ( ? )';
	// console.log(query)
	Promise.all([
		localQuery(query, values)
	]).then(data => {
		// console.log(data)
		resolve('Datos guardados correcta');

	}, reject => {
		// res.status(500).send({ error: errors.DB_ERROR });
		console.log("No se pudo cargar información de formulario. " + reject);
	});
});

const update = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
	// console.log(values)
	let query = 'UPDATE `jr_permiso` SET `fecha_encargado`=now(),`comentario_encargado`=?, `id_estado`=? WHERE `id_permiso`=?';
	// console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve('Permiso Actualizado');
	});
});

const updaterrhh = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
	// console.log(values)
	let query = 'UPDATE `jr_permiso` SET `fecha_encargado`=now(),`comentario_rrhh`=?, `id_estado`=? WHERE `id_permiso`=?';
	// console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve('Permiso Actualizado');
	});
});

const cancelar = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
	// console.log(values)
	let query = 'UPDATE `jr_permiso` SET `motivo_cancelacion`=?, `id_estado`=? WHERE `id_permiso`=?';
	// console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve('Permiso cancelado');
	});
});
const guardarLogs = (id_empleado, tabla, data, id_afectado, accion) => new Promise((resolve, reject) => {
	let saveLogs = `INSERT INTO jr_logs(id_empleado, tabla, data, id_afectado, accion) VALUES ('${id_empleado}','${tabla}','${data}','${id_afectado}','${accion}')`;
	localConnection.query(saveLogs, (error, negocioInserted) => {
		if (error) {
			console.log(error)
			reject(error);
			return true;
		} else {
			resolve('Datos actualizados correctamente');
		}
		// resolve('Datos actualizados correctamente');
	});
});
const saveInfoBancaria = (info) => new Promise((resolve, reject) => {

	let insertNegocio = "INSERT INTO `jr_informacion_bancaria`(`banco_tipo_cuenta`, `cuenta_debito`, `cuenta_credito`, `frecuencia_pago_cheque`, `id_banco`, `id_negocio`) VALUES ( ? );";
	localConnection.query(insertNegocio, [info], (error, infoInserted) => {

		if (error) {
			reject(error);
			return;
		}

		resolve(infoInserted);
	});

});

const updateInfoBancaria = (info, id_empleado) => new Promise(async (resolve, reject) => {
	const ib = await info_bank(info[6])
	const json = {
		informacion_bancaria: ib,
	}
	const data = JSON.stringify(json);

	let id_afectado = info[6];
	const tabla = 'jr_informacion_bancaria';
	await guardarLogs(id_empleado, tabla, data, id_afectado, 'update');
	let updateNegocio = "UPDATE `jr_informacion_bancaria` SET `banco_tipo_cuenta`=?,`cuenta_debito`=?,`cuenta_credito`=?,`frecuencia_pago_cheque`=?,`id_banco`=?,`id_negocio`=? WHERE `id_informacion_bancaria`=?;";
	localConnection.query(updateNegocio, info, (error, infoupdate) => {

		if (error) {
			reject(error);
			return;
		}

		resolve(infoupdate);
	});

});

const eliminarInfoBancaria = (id, id_empleado) => new Promise(async (resolve, reject) => {
	const ib = await info_bank(id)
	const json = {
		informacion_bancaria: ib,
	}
	const data = JSON.stringify(json);

	let id_afectado = id;
	const tabla = 'jr_informacion_bancaria';
	await guardarLogs(id_empleado, tabla, data, id_afectado, 'delete');
	let insertNegocio = "DELETE FROM `jr_informacion_bancaria` WHERE `id_informacion_bancaria` = ?;";
	localConnection.query(insertNegocio, id, (error, infoInserted) => {

		if (error) {
			reject(error);
			return;
		}

		resolve(infoInserted);
	});

});

const puestos = (empresa) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT p.`id_puesto`, p.`descripcion`, p.`id_puesto_supervisor`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` = p.`id_puesto_supervisor`) AS supervisor, p.`id_negocio`,(SELECT `razon_social` FROM `jr_negocio_general` WHERE `id_negocio` = p.`id_negocio`) AS empresa FROM `jr_puesto` p WHERE p.`id_negocio` = ?';

	Promise.all([
		localQuery(query, empresa),
	]).then(data => {
		// console.log(data)
		resolve(data);
		return

	}, reject => {
		res.status(500).send({ error: errors.DB_ERROR });
		console.log("No se pudo cargar información de formulario. " + reject);
	});
});

const departamentos = (empresa) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT d.`id_departamento`, d.`descripcion`, d.`centro`, d.`id_negocio`, (SELECT `razon_social` FROM `jr_negocio_general` WHERE `id_negocio` = d.`id_negocio`) AS empresa FROM `jr_departamento` d WHERE d.`id_negocio` = ?';

	Promise.all([
		localQuery(query, empresa),
	]).then(data => {
		// console.log(data)
		resolve(data);
		return

	}, reject => {
		res.status(500).send({ error: errors.DB_ERROR });
		console.log("No se pudo cargar información de formulario. " + reject);
	});
});

const sucursales = (empresa) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_sucursal`, `nombre_sucursal` FROM `jr_sucursal` WHERE  `id_negocio` = ?';

	Promise.all([
		localQuery(query, empresa),
	]).then(data => {
		// console.log(data)
		resolve(data);
		return

	}, reject => {
		res.status(500).send({ error: errors.DB_ERROR });
		console.log("No se pudo cargar información de formulario. " + reject);
	});
});

module.exports = {
	filtro_permisos,
	puestos,
	departamentos,
	sucursales,
	ver,
	vertodos,
	solicitud,
	save,
	cancelar,
	update,
	permiso_grupo,
	updaterrhh,
	filtro_reclutamiento_rrhh,
	filtro_reclutamiento,
	codigo_postal,
	subzonas,
	municipios,
	sector,
	encargados,
	ajuste_empleados,
	filtro_empleados,
	salida_empleado,
	saveInfoBancaria,
	updateInfoBancaria,
	eliminarInfoBancaria,
	info_bank,
	filtro_invitados,
	filtro_invitado,
	inert_invitado,
	update_invitado,
	filtro_responsables,
	responsable,
	detalle_cita,
	filtro_negocio,
	id_por_fecha,
};