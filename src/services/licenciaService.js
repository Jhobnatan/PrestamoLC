const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const ver_licencias = () => new Promise((resolve, reject) => {
	// Informacion del portador.

    let licencias_rrhh = 'SELECT e.`id_empleado`, e.`cedula`, concat( e.`nombres`, " ", e.`apellidos`) AS empleado, e.`nombres`, e.`apellidos`, e.`usuario`, e.`codigo`, e.`id_empresa`, (SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = e.`id_empresa`) AS empresa, e.`id_departamento`, (SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = e.`id_departamento`) AS departamento, e.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =e.`id_puesto`) AS puesto, e.`id_estado` AS estado_empleado,(SELECT concat(`nombres`, " ",  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` =e.`id_encargado`) AS encargado, l.`id_licencia`, l.`id_tipo_licencia`, (SELECT `descripcion` FROM `jr_tipo_licencia` WHERE `id_tipo_licencia` = l.`id_tipo_licencia`) AS tipo_licencia, l.`fecha_salida`, l.`fecha_entrada`, l.`fecha_solicitud`, l.`motivo`, l.`constancia`, l.`id_rrhh`,(SELECT concat(`nombres`, " ",  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` =l.`id_rrhh`) AS registradapor, l.`estado` AS estado_licencia FROM `jr_empleado` e,`jr_licencia` l WHERE l.`id_empleado` = e.`id_empleado`';
    let estados = 'SELECT `id_tipo_licencia`, `descripcion` FROM `jr_tipo_licencia`';

	Promise.all([
        localQuery(licencias_rrhh,),
        localQuery(estados,)
    ]).then(data => {
        // console.log(data)
        resolve(data);
        return

    }, reject => {
        res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const encargados_dep = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_empleado` WHERE id_empleado =?';

	localConnection.query(query,[id], (error, departamento) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(departamento);
	});
});

const licencia = (id_empleado,id_departamento,li) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let empleados = 'SELECT * FROM `jr_empleado`';
    let nacionalidades = 'SELECT * FROM `jr_nacionalidad`';
    let provincias = 'SELECT * FROM `jr_provincia`';
    let empresas = 'SELECT * FROM `jr_empresa`';
    let departamentos = 'SELECT * FROM `jr_departamento`';
    let puestos = 'SELECT * FROM `jr_puesto`';
    let modalidades = 'SELECT * FROM `jr_tipo_empleado`';
    let grados = 'SELECT * FROM `jr_grado`';
    let sueldos = 'SELECT * FROM `jr_sueldo`';
    let grados_ac = 'SELECT * FROM `jr_grado_academico`';
    let niveles = 'SELECT * FROM `jr_nivel`';
    let estados = 'SELECT * FROM `jr_estado_empleado` ORDER BY `descripcion` ASC';
    let municipios = "SELECT * FROM `jr_municipio`";
    let sectores = "SELECT * FROM `jr_sector`";
    let empleado = "SELECT * FROM `jr_empleado` WHERE id_empleado =?";
    let encargados = "SELECT * FROM `jr_empleado` WHERE `id_departamento` =?";
    let relaciones = "SELECT * FROM `jr_relacion`";
    
    let tipos_licencia = "SELECT * FROM `jr_tipo_licencia`";
    let licencia = "SELECT `id_licencia`, `id_empleado`, `id_tipo_licencia`, `fecha_salida`, `fecha_entrada`, `fecha_solicitud`, `motivo`, `constancia`, `id_rrhh`, `estado` FROM `jr_licencia` WHERE `id_licencia` = ?";
    let documentos = "SELECT `id_doc`, `path`, `fecha` FROM `jr_documento_lic` WHERE `id_licencia` = ?";

	Promise.all([
        localQuery(empleados,),
        localQuery(nacionalidades,),
        localQuery(provincias,),
        localQuery(empresas,),
        localQuery(departamentos,),
        localQuery(puestos,),
        localQuery(modalidades,),
        localQuery(grados,),
        localQuery(sueldos,),
        localQuery(grados_ac,),
        localQuery(niveles,),
        localQuery(estados,),
        localQuery(municipios,),
        localQuery(sectores,),
        localQuery(empleado,id_empleado),
        localQuery(encargados,id_departamento),
        localQuery(relaciones,),
        localQuery(tipos_licencia,),
        localQuery(licencia,li),
        localQuery(documentos,li),
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const update = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'UPDATE `jr_licencia` SET `id_empleado`=?,`id_tipo_licencia`=?,`fecha_salida`=?,`fecha_entrada`=?,`fecha_solicitud`=?,`motivo`=?,`constancia`=?,`id_rrhh`=?,`estado`=? WHERE  `id_licencia`=?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Licencia Actualizada');
	});
});

const insert_path = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'INSERT INTO `jr_documento_lic`(`path`, `id_licencia`) VALUES ( ? )';
    // console.log(query)
	localConnection.query(query, [values], (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Documento insertado');
	});
});





const vertodos = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let query_permisos = 'SELECT e.`id_empleado`, e.`cedula`, concat( e.`nombres`, " ", e.`apellidos`) AS solicitante, e.`nombres`, e.`apellidos`, e.`usuario`, e.`codigo`, e.`id_empresa`, (SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = e.`id_empresa`) AS empresa, e.`id_departamento`, (SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = e.`id_departamento`) AS departamento, e.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =e.`id_puesto`) AS puesto, e.`id_estado` AS estado_empleado, p.`id_permiso`, p.`id_tipo_permiso`, (SELECT `tipo_permiso` FROM `jr_tipo_permiso` WHERE `id_tipo_permiso` = p.`id_tipo_permiso`) AS tipo_permiso, p.`fecha_salida`, p.`fecha_entrada`, p.`fecha_solicitud`, p.`motivo`, p.`motivo_cancelacion`, p.`id_encargado`, (SELECT concat(`nombres`, " ",  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` =e.`id_encargado`) AS encargado, p.`fecha_encargado`, p.`comentario_encargado`, p.`id_rrhh`, p.`comentario_rrhh`, p.`fecha_rrhh`, p.`id_estado` AS id_estado_premiso, (SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = p.`id_estado`) AS estado_permiso FROM `jr_permiso` p, `jr_empleado` e WHERE e.`id_empleado` = p.`id_empleado` AND p.`id_permiso` = ?';
    let query_estados = 'SELECT * FROM `jr_estado`';

	Promise.all([
        localQuery(query_permisos,id),
        localQuery(query_estados,)
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});


const solicitud = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let permiso = 'SELECT * FROM `jr_permiso` WHERE `id_estado` <> 5 AND `id_empleado` = ?';
    let empleado = 'SELECT * FROM `jr_empleado` WHERE `id_empleado` = ?';
    let tipo_permiso = 'SELECT `id_tipo_permiso`, `tipo_permiso` FROM `jr_tipo_permiso`';
    let estados = 'SELECT * FROM `jr_estado`';
    let permisos = 'SELECT e.`id_empleado`, e.`cedula`, concat( e.`nombres`, " ", e.`apellidos`) AS solicitante, e.`nombres`, e.`apellidos`, e.`usuario`, e.`codigo`, e.`id_empresa`, (SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = e.`id_empresa`) AS empresa, e.`id_departamento`, (SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = e.`id_departamento`) AS departamento, e.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =e.`id_puesto`) AS puesto, e.`id_estado` AS estado_empleado, p.`id_permiso`, p.`id_tipo_permiso`, (SELECT `tipo_permiso` FROM `jr_tipo_permiso` WHERE `id_tipo_permiso` = p.`id_tipo_permiso`) AS tipo_permiso, p.`fecha_salida`, p.`fecha_entrada`, p.`fecha_solicitud`, p.`motivo`, p.`motivo_cancelacion`, p.`id_encargado`, (SELECT concat(`nombres`, " ",  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` =e.`id_encargado`) AS encargado, p.`fecha_encargado`, p.`comentario_encargado`, p.`id_rrhh`, p.`comentario_rrhh`, p.`fecha_rrhh`, p.`id_estado` AS id_estado_premiso, (SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = p.`id_estado`) AS estado_permiso FROM `jr_permiso` p, `jr_empleado` e WHERE e.`id_empleado` = p.`id_empleado` AND p.`id_encargado` = ?';
    let permisos_rrhh = 'SELECT e.`id_empleado`, e.`cedula`,concat( e.`nombres`, " ", e.`apellidos`) AS solicitante, e.`nombres`, e.`apellidos`, e.`usuario`, e.`codigo`, e.`id_empresa`, (SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = e.`id_empresa`) AS empresa, e.`id_departamento`, (SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = e.`id_departamento`) AS departamento, e.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =e.`id_puesto`) AS puesto, e.`id_estado` AS estado_empleado, p.`id_permiso`, p.`id_tipo_permiso`, (SELECT `tipo_permiso` FROM `jr_tipo_permiso` WHERE `id_tipo_permiso` = p.`id_tipo_permiso`) AS tipo_permiso, p.`fecha_salida`, p.`fecha_entrada`, p.`fecha_solicitud`, p.`motivo`, p.`motivo_cancelacion`, p.`id_encargado`, (SELECT concat(`nombres`, " ",  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` =e.`id_encargado`) AS encargado, p.`fecha_encargado`, p.`comentario_encargado`, p.`id_rrhh`, p.`comentario_rrhh`, p.`fecha_rrhh`, p.`id_estado` AS id_estado_premiso, (SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = p.`id_estado`) AS estado_permiso FROM `jr_permiso` p, `jr_empleado` e WHERE e.`id_empleado` = p.`id_empleado`';

	Promise.all([
        localQuery(permiso,id),
        localQuery(empleado,id),
        localQuery(tipo_permiso,),
        localQuery(estados,),
        localQuery(permisos,id),
        localQuery(permisos_rrhh)
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const save = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'INSERT INTO `jr_permiso`( `id_tipo_permiso`, `id_empleado`, `fecha_salida`, `fecha_entrada`, `motivo`, `id_encargado`, `id_estado`) VALUES ( ? )';
    // console.log(query)
	Promise.all([
        localQuery(query,values)
    ]).then(data => {
        // console.log(data)
        resolve('Datos guardados correcta');

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const update_old = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'UPDATE `jr_permiso` SET `fecha_encargado`=now(),`comentario_encargado`=?, `id_estado`=? WHERE `id_permiso`=?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Permiso Actualizado');
	});
});

const updaterrhh = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'UPDATE `jr_permiso` SET `fecha_encargado`=now(),`comentario_rrhh`=?, `id_estado`=? WHERE `id_permiso`=?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Permiso Actualizado');
	});
});

const cancelar = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'UPDATE `jr_permiso` SET `motivo_cancelacion`=?, `id_estado`=? WHERE `id_permiso`=?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Permiso cancelado');
	});
});

module.exports = {
    ver_licencias,
    licencia,
    encargados_dep,
    update,
    insert_path,


    vertodos,
    solicitud,
    save,
    cancelar,

    updaterrhh
};