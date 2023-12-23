const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const list = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_departamento`';

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

const save = (values) => new Promise((resolve, reject) => {
	let query = "INSERT INTO `jr_departamento`(`descripcion`, `centro`, `id_negocio`) VALUES ( ? )";
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

	let query = 'SELECT `id_departamento`, `descripcion`, `centro`, `id_negocio` FROM `jr_departamento` WHERE `id_departamento` =?';

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
const list_empersas = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_negocio`, `razon_social`, `rnc`, `id_empleado`, `cant_sucursales`, `red_social`, `sap_acreedor`, `sap_deudor`, `fecha_creacion`, `estado`, `id_tipo_afiliacion`, `id_pago_electronico`, `editado_por`, `rm_vence`, `proceso` FROM `jr_negocio_general`';

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

const update = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'UPDATE `jr_departamento` SET `descripcion`=?,`centro`=? WHERE `id_departamento`=?';
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
    update,
	list_empersas,
    save
};