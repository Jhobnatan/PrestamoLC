const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");


const caja_list = (estado, valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = ["%" + valor + "%","%" + valor + "%"];
		
		if (valor === "aaaaaaaaaaaa") {
			valor = ""; 
		}
		let script = "";
	
		if (inicio !== false && nunreg !== false) {
			script = `SELECT c.id_caja, c.nombre, c.descripcion,
			(SELECT CASE
				WHEN EXISTS (SELECT 1 FROM jr_caja_detalle WHERE id_caja = c.id_caja AND estado = 'abierta')
				THEN 'abierta'
				ELSE 'cerrada'
			 END) AS estado,
			 (SELECT  CONCAT( nombres," ", apellidos) FROM jr_empleado WHERE id_empleado =(SELECT id_cajero FROM jr_caja_detalle WHERE id_caja = c.id_caja AND estado = 'abierta' LIMIT 1)) AS cajero,
			 (SELECT  CONCAT( nombres," ", apellidos) FROM jr_empleado WHERE id_empleado =(SELECT id_supervisor FROM jr_caja_detalle WHERE id_caja = c.id_caja AND estado = 'abierta' LIMIT 1)) AS supervisor 
		FROM jr_caja c
		WHERE c.nombre LIKE ? OR c.descripcion LIKE ?
		ORDER BY c.nombre ASC LIMIT ${inicio}, ${nunreg}`;

		} else {
			script = `SELECT DISTINCT COUNT(*) AS total FROM jr_caja c
			WHERE c.nombre LIKE ? OR c.descripcion LIKE ?
			ORDER BY c.nombre ASC`;
			//    values = [id, fecha_desde, fecha_hasta]
		}

		localConnection.query(script, valores, (error, scripts) => {
			// console.log(error);
			if (error) {
				reject(error);
				return;
			}
			// console.log(rows)
			resolve(scripts);
		});
});

const save_caja = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_caja`(`nombre`, `descripcion`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve("Marca guardada correctamente");
	});
});

const update_caja = (values) => new Promise((resolve, reject) => {

	let query = 'UPDATE `jr_caja` SET `nombre`=?,`descripcion`=? WHERE `id_caja`=?';

	localConnection.query(query,values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Marca actualizada correctamente');
	});
});

const buscar_caja = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_caja`, `nombre`, `descripcion` FROM `jr_caja` WHERE `id_caja` = ?';

	localConnection.query(query,[id], (error, cajaes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(cajaes);
	});
});


const saveDesgloseDeCaja = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_desglose_dinero`(`id_caja`, `id_caja_detalle`, `id_venta`, `2000`, `1000`, `500`, `200`, `100`, `50`, `25`, `10`, `5`, `1`, `decimales`, `descripcion`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve("Desglose guardado correctamente");
	});
});

const saveAsignacionDeCaja = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_caja_detalle`(`id_caja`, `id_turno`, `id_cajero`, `id_supervisor`, `id_empresa`, `id_sucursal`, `id_almacen`, `estado`, `fecha_cierre`, `monto_inicial`, `monto_final`, `diferencia`, `observaciones`, `desglose`) VALUES ( ? )';

	localConnection.query(query,[values], (error, asignada) => {

		if (error) {
			reject(error);
			return;
		}
		resolve(asignada.insertId);
	});
});


const verDetalleCaja = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = `SELECT cd.id_caja_detalle, cd.id_caja, cd.id_turno, cd.id_cajero, (SELECT  CONCAT( nombres," ", apellidos) FROM jr_empleado WHERE id_empleado =cd.id_cajero) AS cajero, cd.id_supervisor, cd.id_empresa, cd.id_sucursal, cd.id_almacen, cd.estado, cd.fecha_apertura, cd.fecha_cierre, cd.monto_inicial, cd.monto_final, cd.diferencia, cd.observaciones, cd.desglose, c.nombre, c.descripcion FROM jr_caja_detalle cd, jr_caja c WHERE c.id_caja = cd.id_caja AND cd.estado ='abierta' AND cd.id_caja = ?`;

	localConnection.query(query,[id], (error, cajaes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(cajaes);
	});
});

const verDetalleCajaParaImprimir = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = `SELECT id_caja_detalle, cd.id_caja, cd.id_turno, cd.id_cajero, (SELECT  CONCAT( nombres," ", apellidos) FROM jr_empleado WHERE id_empleado =cd.id_cajero) AS cajero, cd.id_supervisor, (SELECT  CONCAT( nombres," ", apellidos) FROM jr_empleado WHERE id_empleado =cd.id_supervisor) AS supervisor, cd.id_empresa, cd.id_sucursal, cd.id_almacen, cd.estado, cd.fecha_apertura, cd.fecha_cierre, cd.monto_inicial, cd.monto_final, cd.diferencia, cd.observaciones, cd.desglose, c.nombre, c.descripcion FROM jr_caja_detalle cd, jr_caja c WHERE c.id_caja = cd.id_caja AND cd.id_caja_detalle = ?`;

	localConnection.query(query,[id], (error, cajaes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(cajaes);
	});
}); 
const verDesglose = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = "SELECT `id_desglose`, `id_caja`, `id_caja_detalle`, `id_venta`, `2000`, `1000`, `500`, `200`, `100`, `50`, `25`, `10`, `5`, `1`, `decimales`, `descripcion` FROM `jr_desglose_dinero` WHERE id_caja_detalle = ?";

	localConnection.query(query,[id], (error, cajaes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(cajaes);
	});
});


const verDesgloseFinal = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = "SELECT `id_desglose`, `id_caja`, `id_caja_detalle`, `id_venta`, `2000`, `1000`, `500`, `200`, `100`, `50`, `25`, `10`, `5`, `1`, `decimales`, `descripcion` FROM `jr_desglose_dinero` WHERE id_caja_detalle = ? AND descripcion = ? ORDER BY id_desglose DESC LIMIT 1";

	localConnection.query(query,values, (error, cajaes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(cajaes);
	});
});

const cierreDeCajaUpdate = (values) => new Promise((resolve, reject) => {

	let query = 'UPDATE `jr_caja_detalle` SET `estado`="cerrada", `fecha_cierre`=NOW(),`monto_final`= ?,`diferencia`=?,`observaciones`=?,`id_supervisor_cierre`= ? WHERE `id_caja_detalle`= ?;';

	localConnection.query(query,values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Marca actualizada correctamente');
	});
});

module.exports = {
	caja_list,
	save_caja,
	update_caja,
	buscar_caja,
	saveDesgloseDeCaja,
	saveAsignacionDeCaja,
	verDetalleCaja,
	verDesglose,
	cierreDeCajaUpdate,
	verDetalleCajaParaImprimir,
	verDesgloseFinal,
};