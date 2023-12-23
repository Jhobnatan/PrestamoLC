const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");


const suplidor_list = (valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = ["%" + valor + "%","%" + valor + "%","%" + valor + "%"];
		
		if (valor === "aaaaaaaaaaaa") {
			valor = "";
		}
		let script = "";
	
		if (inicio !== false && nunreg !== false) {
			script = `SELECT id_suplidor, empresa_sup, direccion_sup, rnc_sup, representante, flota, telefono, extension, fecha_regitro FROM jr_suplidor  WHERE empresa_sup like ? OR rnc_sup like ? OR representante like ? ORDER BY empresa_sup ASC LIMIT ${inicio}, ${nunreg}`;

		} else {
			script = `SELECT COUNT(*) AS total FROM jr_suplidor  WHERE empresa_sup like ? OR rnc_sup like ? OR representante like ?`;
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

const save_suplidor = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_suplidor`(`empresa_sup`, `direccion_sup`, `rnc_sup`, `representante`, `flota`, `telefono`, `extension`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve("Suplidor guardado correctamente");
	});
});

const update_suplidor = (values) => new Promise((resolve, reject) => {

	let query = 'UPDATE `jr_suplidor` SET `empresa_sup`=?,`direccion_sup`=?,`rnc_sup`=?,`representante`=?,`flota`=?,`telefono`=?,`extension`=? WHERE `id_suplidor`=?';

	localConnection.query(query,values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Suplidor actualizado correctamente');
	});
});

const buscar_suplidor = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_suplidor`, `empresa_sup`, `direccion_sup`, `rnc_sup`, `representante`, `flota`, `telefono`, `extension`, `numero_de_orden`, `fecha_regitro` FROM `jr_suplidor` WHERE `id_suplidor` = ?';

	localConnection.query(query,[id], (error, suplidores) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(suplidores);
	});
});

module.exports = {
	suplidor_list,
	save_suplidor,
	update_suplidor,
	buscar_suplidor
};