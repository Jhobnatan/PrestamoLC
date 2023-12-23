const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");


const clase_list = (valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = ["%" + valor + "%","%" + valor + "%"];
		
		if (valor === "aaaaaaaaaaaa") {
			valor = "";
		}
		let script = "";
	
		if (inicio !== false && nunreg !== false) {
			script = `SELECT id_clase, nombre, descripcion FROM jr_clase WHERE nombre like ? OR descripcion like ? ORDER BY nombre DESC LIMIT ${inicio}, ${nunreg}`;

		} else {
			script = `SELECT COUNT(*) AS total FROM jr_clase WHERE nombre like ? OR descripcion like ?`;
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

const save_clase = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_clase`(`nombre`, `descripcion`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve("Marca guardada correctamente");
	});
});

const update_clase = (values) => new Promise((resolve, reject) => {

	let query = 'UPDATE `jr_clase` SET `nombre`=?,`descripcion`=? WHERE `id_clase`=?';

	localConnection.query(query,values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Marca actualizada correctamente');
	});
});

const buscar_clase = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_clase`, `nombre`, `descripcion` FROM `jr_clase` WHERE `id_clase`';

	localConnection.query(query,[id], (error, clasees) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(clasees);
	});
});

module.exports = {
	clase_list,
	save_clase,
	update_clase,
	buscar_clase
};