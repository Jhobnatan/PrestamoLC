const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const getLogIn = (usuario,clave) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_usuario`, `usuario`, `clave`, `id_empleado` FROM `jr_usuario` WHERE `usuario` = ? AND `clave` = ?';

	localConnection.query(query,[usuario, clave], (error, rows) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(rows[0]);
	});
});

const getAccess = (id_usuario,id_empleado) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query_usuario = 'SELECT DISTINCT ug.`id_usuario`, ga.`id_acceso`, a.`descripcion` AS acceso FROM `jr_usuario_vs_grupo` ug, `jr_acceso_vs_grupo` ga, `jr_acceso` a WHERE ug.`id_grupo` = ga.`id_grupo` AND ga.`id_acceso` = a.`id_acceso` AND ug.`id_usuario` = ?';
    let query_empleado = 'SELECT e.id_empleado, e.cedula, e.nombres, e.apellidos, e.usuario, e.codigo, e.tarjeta_punto, e.id_negocio, (SELECT razon_social FROM jr_negocio_general WHERE id_negocio = e.id_negocio) AS negocio, (SELECT rnc FROM jr_negocio_general WHERE id_negocio = e.id_negocio) AS rnc_negocio, e.id_departamento, e.id_puesto, e.email_personal, e.fecha_nacimiento, e.tel, e.cel, e.sexo, e.estado_civil, e.nhijos, e.id_provincia, e.id_municipio, e.id_sector, e.direccion, e.email_institucional, e.id_estado, e.id_grado_ac, e.id_nivel, e.id_encargado, e.fecha_entrada, e.id_grado, e.id_sueldo, e.id_tipo_empleado, e.id_nacionalidad, e.contacto_emergencia, e.id_relacion, e.tel_emergencia, e.cel_emergencia, e.enfermedad, e.tipo_enfermedad, e.alergia, e.tipo_alergia, e.medicacion, e.tipo_medicamento, e.tarjeta_combustible, e.monto_combustible, e.monto_vehiculo, e.flota, e.id_seguro_medico, e.numero_cuenta, e.id_banco, e.id_sucursal, e.path_foto, e.id_cartera, e.fecha_regitro, s.id_provincia, (SELECT provincia FROM jr_provincia WHERE id_provincia = s.id_provincia) AS provincia, s.id_municipio, (SELECT municipio FROM jr_municipio WHERE id_municipio = s.id_municipio) AS municipio, s.id_sector, (SELECT sector FROM jr_sector WHERE id_sector = s.id_sector) AS sector, s.nombre_sucursal, s.direccion, s.telefono, s.email FROM jr_empleado e, jr_sucursal s WHERE s.id_negocio = e.id_negocio AND s.id_sucursal = e.id_sucursal AND e.id_empleado =?';

	Promise.all([
        localQuery(query_usuario,id_usuario),
        localQuery(query_empleado,id_empleado)
    ]).then(data => {
        // console.log(data) 
        resolve(data);

    }, reject => {
        res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

module.exports = {
	getLogIn,
    getAccess
};