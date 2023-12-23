const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");


const categoria_list = (valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = ["%" + valor + "%","%" + valor + "%"];
		
		if (valor === "aaaaaaaaaaaa") {
			valor = "";
		}
		let script = "";
	
		if (inicio !== false && nunreg !== false) {
			script = `SELECT id_categoria, nombre, descripcion FROM jr_categoria_articulo WHERE nombre like ? OR descripcion like ? ORDER BY nombre DESC LIMIT ${inicio}, ${nunreg}`;

		} else {
			script = `SELECT COUNT(*) AS total FROM jr_categoria_articulo WHERE nombre like ? OR descripcion like ?`;
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

const save_categoria = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_categoria_articulo`(`nombre`, `descripcion`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve("categoria guardada correctamente");
	});
});

const update_categoria = (values) => new Promise((resolve, reject) => {

	let query = 'UPDATE `jr_categoria_articulo` SET `nombre`=?,`descripcion`=? WHERE `id_categoria`=?';

	localConnection.query(query,values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('categoria actualizada correctamente');
	});
});

const buscar_categoria = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_categoria`, `nombre`, `descripcion` FROM `jr_categoria_articulo` WHERE `id_categoria`';

	localConnection.query(query,[id], (error, categoriaes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(categoriaes);
	});
});

module.exports = {
	categoria_list,
	save_categoria,
	update_categoria,
	buscar_categoria
};