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

	let query = 'INSERT INTO `jr_empresa` set ?';

	localConnection.query(query,[values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Datos guardados');
	});
});

const edit = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_empresa` WHERE id_empresa =?';

	localConnection.query(query,[id], (error, empresa) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(empresa);
	});
});

const update = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'UPDATE `jr_empresa` SET `nombre_empresa`=?,`razon_social`=?,`rnc`=?,`telefono`=?,`id_categoria`=? WHERE `id_empresa`= ?';
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


const accesos = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let access = 'SELECT `id_acceso`, `descripcion`, `id_area` FROM `jr_acceso` ORDER BY `id_area`';
    let grupo_acceso = 'SELECT `id_acceso` FROM `jr_acceso_vs_grupo` WHERE `id_grupo` =?';
    let grupo = 'SELECT * FROM `jr_grupo` WHERE `id_grupo` =?';
    let areas = 'SELECT `id_area`, `descripcion` FROM `jr_area`';

	Promise.all([
        localQuery(access,),
        localQuery(grupo_acceso,id),
        localQuery(grupo,id),
        localQuery(areas,),
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

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

const insert_accesos = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_acceso_vs_grupo`(`id_acceso`, `id_grupo`) VALUES ( ? )';

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
	categoria_empresa,
    edit,
    update,
    accesos,
    borrar,
    insert_accesos,
    save
};