const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const list = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_grupo` WHERE `id_negocio` = ? OR `id_negocio` = 0 ORDER BY `id_grupo` DESC';

	localConnection.query(query,id, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(puestos);
	});
});

const save = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_grupo`(`descripcion`, `id_negocio`) VALUES  ( ? )';

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

	let query = 'SELECT * FROM `jr_grupo` WHERE `id_grupo` =?';

	localConnection.query(query,[id], (error, grupo) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(grupo);
	});
});

const update = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'UPDATE `jr_grupo` SET `descripcion` = ? WHERE `id_grupo` =?';
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
    edit,
    update,
    accesos,
    borrar,
    insert_accesos,
    save
};