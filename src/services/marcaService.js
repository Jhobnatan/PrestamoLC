const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");


const marca_list = (valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = ["%" + valor + "%","%" + valor + "%"];
		
		if (valor === "aaaaaaaaaaaa") {
			valor = "";
		}
		let script = "";
	
		if (inicio !== false && nunreg !== false) {
			script = `SELECT id_marca, nombre, descripcion FROM jr_marca WHERE nombre like ? OR descripcion like ? ORDER BY nombre DESC LIMIT ${inicio}, ${nunreg}`;

		} else {
			script = `SELECT COUNT(*) AS total FROM jr_marca WHERE nombre like ? OR descripcion like ?`;
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

const save_marca = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_marca`(`nombre`, `descripcion`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve("Marca guardada correctamente");
	});
});

const update_marca = (values) => new Promise((resolve, reject) => {

	let query = 'UPDATE `jr_marca` SET `nombre`=?,`descripcion`=? WHERE `id_marca`=?';

	localConnection.query(query,values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Marca actualizada correctamente');
	});
});

const buscar_marca = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_marca`, `nombre`, `descripcion` FROM `jr_marca` WHERE `id_marca` =?';

	localConnection.query(query,[id], (error, marcaes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(marcaes);
	});
});

module.exports = {
	marca_list,
	save_marca,
	update_marca,
	buscar_marca
};