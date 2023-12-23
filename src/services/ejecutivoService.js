const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const list = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let empresa = 'SELECT * FROM `jr_empresa`';

	let ejecutivo = 'SELECT ee.`id_ejecutivo`, ee.`nombre`, ee.`tel`, ee.`flota`, ee.`correo`, ee.`id_empresa`, em.`nombre_empresa` AS empresa, ee.`estado` FROM `jr_ejecutivo_externo` ee, `jr_empresa` em WHERE ee.`id_empresa` = em.`id_empresa`';
    
	Promise.all([
        localQuery(empresa,),
        localQuery(ejecutivo,),
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const save = (values) => new Promise((resolve, reject) => {
	// [nombre, telefono, flota, correo, empresa, 'Activo'];
	let query = 'INSERT INTO `jr_ejecutivo_externo`(`nombre`, `tel`, `flota`, `correo`, `id_empresa`, `estado`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Datos guardados');
	});
});

const edit = (id) => new Promise((resolve, reject) => {
	
	let ejecutivo = 'SELECT ee.`id_ejecutivo`, ee.`nombre`, ee.`tel`, ee.`flota`, ee.`correo`, ee.`id_empresa`, em.`nombre_empresa` AS empresa, ee.`estado` FROM `jr_ejecutivo_externo` ee, `jr_empresa` em WHERE ee.`id_empresa` = em.`id_empresa` AND ee.`id_ejecutivo` = ?';
	localConnection.query(ejecutivo,[id], (error, ejecutive) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(ejecutive);
	});
});

const emp = () => new Promise((resolve, reject) => {
	
	let empresa = 'SELECT * FROM `jr_empresa`';
	localConnection.query(empresa, (error, empresa) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
    	// console.log(empresa)
		resolve(empresa);
	});
});

const update = (values) => new Promise((resolve, reject) => {
    // console.log(values)
    let query = 'UPDATE `jr_ejecutivo_externo` SET `nombre`=?,`tel`=?,`flota`=?,`correo`=?,`id_empresa`=?,`estado`=? WHERE `id_ejecutivo`=?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {

		if (error) {
			reject(error);
			return;
		}
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
    save,
	emp
};