const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");


const list = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT p.`id_puesto`, p.`descripcion`, p.`id_puesto_supervisor`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` = p.`id_puesto_supervisor`) AS supervisor, p.`id_negocio`,(SELECT `razon_social` FROM `jr_negocio_general` WHERE `id_negocio` = p.`id_negocio`) AS empresa FROM `jr_puesto` p';
	let empresa = 'SELECT * FROM `jr_negocio_general`';
	Promise.all([
        localQuery(query,),
        localQuery(empresa,)
    ]).then(data => {
        // console.log(data)
        resolve(data);
        return

    }, reject => {
        res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});


const save = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_puesto`(`descripcion`, `id_puesto_supervisor`, `id_negocio`) VALUES ( ? )';

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

	let query = 'SELECT p.`id_puesto`, p.`descripcion`, p.`id_puesto_supervisor`, p.`id_negocio`,e.`razon_social` AS empresa, e.`razon_social` FROM `jr_puesto` p, `jr_negocio_general` e WHERE e.`id_negocio` = p.`id_negocio` AND p.`id_puesto` = ?';

	localConnection.query(query,[id], (error, puesto) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(puesto);
	});
});

const list_puesto = (empresa) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_puesto` WHERE `id_negocio` = ?';

	localConnection.query(query,[empresa], (error, empresa) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(empresa);
	});
});

const list_empersas = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_negocio`, `razon_social`, `rnc`, `id_empleado`, `cant_sucursales`, `red_social`, `sap_acreedor`, `sap_deudor`, `fecha_creacion`, `estado`, `id_tipo_afiliacion`, `id_pago_electronico`, `editado_por`, `rm_vence`, `proceso` FROM `jr_negocio_general` WHERE `id_negocio` = ?';

	localConnection.query(query,id, (error, empresa) => {
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
    console.log(values)
    let query = 'UPDATE `jr_puesto` SET `descripcion`=?,`id_puesto_supervisor`=? WHERE `id_puesto`=?';
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


module.exports = {
	list,
    edit,
	list_puesto,
	list_empersas,
    update,
    save
};