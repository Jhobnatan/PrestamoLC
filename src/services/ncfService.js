const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const list = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_empresa`';

	localConnection.query(query, (error, empresa) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(empresa);
	});
});


const ncf_list_filtro = (valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = ["%" + valor + "%","%" + valor + "%","%" + valor + "%"];
		
		if (valor === "aaaaaaaaaaaa") {
			valor = "";
		}
		let script = "";
	
		if (inicio !== false && nunreg !== false) {
			script = `SELECT codncf, descncf, tipncf, parfij, estado FROM jr_ncf WHERE descncf like ? OR tipncf like ? OR parfij like ? ORDER BY parfij ASC LIMIT ${inicio}, ${nunreg}`;

		} else {
			script = `SELECT COUNT(*) AS total FROM jr_ncf WHERE descncf like ? OR tipncf like ? OR parfij like ?`;
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

const categoria_empresa = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let categoria = 'SELECT `id_categoria`, `categoria` FROM `jr_categoria_empresa`';

	localConnection.query(categoria, (error, categorias) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(categorias);
	});
});

const save = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_ncf`(`descncf`, `tipncf`, `parfij`, `estado`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Datos guardados');
	});
});

const edit_ncf = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `codncf`, `descncf`, `tipncf`, `parfij`, `estado` FROM `jr_ncf` WHERE `codncf` = ?';

	localConnection.query(query,[id], (error, ncf) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(ncf);
	});
});

const update = (values) => new Promise((resolve, reject) => {
    let query = 'UPDATE `jr_ncf` SET `descncf`=?,`tipncf`=?,`parfij`=?,`estado`=? WHERE  `codncf`=?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Grupo Actualizado');
	});
});

const secuencia_list_filtro = (codigoNCF,estado_secuencia,valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = [codigoNCF, estado_secuencia];
		
		if (valor === "aaaaaaaaaaaa") {
			valor = "";
		}
		let script = "";
	
		if (inicio !== false && nunreg !== false) {
			script = `SELECT id_sucursal, fecncf, vigencia_desde, vigencia_hasta, fecha_uso, secncf, estncf, codncf FROM jr_secuencia WHERE codncf = ? AND estncf = ? ORDER BY secncf ASC LIMIT ${inicio}, ${nunreg}`;

		} else {
			script = `SELECT COUNT(*) AS total FROM jr_secuencia WHERE codncf = ? AND estncf = ?`;
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


const cantidadDeSecuenciaDisponible = (codigoNCF) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = [codigoNCF];
		
		let script  = `SELECT COUNT(*) AS total FROM jr_secuencia WHERE codncf = ? AND estncf = 'Disponible'`;
		localConnection.query(script, valores, (error, scripts) => {
			// console.log(error);
			if (error) {
				reject(error);
				return;
			}
			// console.log(rows)
			resolve(scripts[0]);
		});
});



const secuenciaInicial = (codigoNCF) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = [codigoNCF];
		
		let script  = `SELECT secncf FROM jr_secuencia WHERE codncf = ? ORDER BY secncf DESC LIMIT 1`;
		localConnection.query(script, valores, (error, scripts) => {
			// console.log(error);
			if (error) {
				reject(error);
				return;
			}
			// console.log(rows)
			resolve(scripts[0]);
		});
});

const saveSecuencia = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_secuencia`(`id_sucursal`, `vigencia_desde`, `vigencia_hasta`, `secncf`, `estncf`, `codncf`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Datos guardados');
	});
});

module.exports = {
	list,
	ncf_list_filtro,
	categoria_empresa,
    edit_ncf,
	secuencia_list_filtro,
	saveSecuencia,
	cantidadDeSecuenciaDisponible,
	secuenciaInicial,
    update,
    save
};