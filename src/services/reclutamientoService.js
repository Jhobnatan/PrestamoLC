const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const list = (id_solicitante) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = "SELECT rec.`id_reclutamiento`, rec.`id_solicitante`, (SELECT concat(`nombres`, ' ',  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` = rec.`id_solicitante`) AS solicitante, rec.`id_empresa`,(SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = rec.`id_empresa`) AS empresa, rec.`id_departamento`,(SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = rec.`id_departamento`) AS departamento, rec.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =rec.`id_puesto`) AS puesto, rec.`supervisa`, rec.`cant_supervisa`, rec.`id_modalidad`, rec.`conocimiento`, rec.`conocimiento_deseable`, rec.`motivo`, rec.`justificacion`, rec.`rango_edad`, rec.`sexo`, rec.`id_grado_academico`, rec.`id_nivel`, rec.`fecha_solicitud`, rec.`id_estado`,(SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = rec.`id_estado`) AS estado FROM `jr_reclutamiento` rec WHERE rec.`id_solicitante` = ? AND rec.`id_estado` != 3 limit 10";

	localConnection.query(query,[id_solicitante], (error, solicitudes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(solicitudes);
	});
});

const list_rrhh = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = "SELECT rec.`id_reclutamiento`, rec.`id_solicitante`, (SELECT concat(`nombres`, ' ',  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` = rec.`id_solicitante`) AS solicitante, rec.`id_empresa`,(SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = rec.`id_empresa`) AS empresa, rec.`id_departamento`,(SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = rec.`id_departamento`) AS departamento, rec.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =rec.`id_puesto`) AS puesto, rec.`supervisa`, rec.`cant_supervisa`, rec.`id_modalidad`, rec.`conocimiento`, rec.`conocimiento_deseable`, rec.`motivo`, rec.`justificacion`, rec.`rango_edad`, rec.`sexo`, rec.`id_grado_academico`, rec.`id_nivel`, rec.`fecha_solicitud`, rec.`id_estado`,(SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = rec.`id_estado`) AS estado FROM `jr_reclutamiento` rec limit 10";

	localConnection.query(query, (error, solicitudes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(solicitudes);
	});
});


const crear_solicitud = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let empleado = 'SELECT * FROM `jr_empleado` WHERE id_empleado =?';
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

	Promise.all([
        localQuery(empleado,id),
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
        localQuery(departamentos,),
        localQuery(estados)
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});



const edit = (id) => new Promise((resolve, reject) => {
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
    let estados = 'SELECT `id_estado`, `descripcion` FROM `jr_estado` ORDER BY `descripcion` ASC';
    let reclutamiento = "SELECT rec.`id_reclutamiento`, rec.`id_solicitante`, (SELECT concat(`nombres`, ' ',  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` = rec.`id_solicitante`) AS solicitante, rec.`id_empresa`,(SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = rec.`id_empresa`) AS empresa, rec.`id_departamento`,(SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = rec.`id_departamento`) AS departamento, rec.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =rec.`id_puesto`) AS puesto, rec.`supervisa`, rec.`cant_supervisa`, rec.`id_modalidad`, rec.`conocimiento`, rec.`conocimiento_deseable`, rec.`motivo`, rec.`justificacion`, rec.`rango_edad`, rec.`sexo`, rec.`id_grado_academico`, rec.`id_nivel`, rec.`fecha_solicitud`, rec.`id_estado`,(SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = rec.`id_estado`) AS estado FROM `jr_reclutamiento` rec WHERE rec.`id_reclutamiento` = ?";

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
        localQuery(reclutamiento,id)
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
    let query = 'INSERT INTO `jr_reclutamiento`(`id_solicitante`, `id_empresa`, `id_departamento`, `id_puesto`, `supervisa`, `cant_supervisa`, `id_modalidad`, `conocimiento`, `conocimiento_deseable`, `motivo`, `justificacion`, `rango_edad`, `sexo`, `id_grado_academico`, `id_nivel`, `id_estado`) VALUES ( ? )';
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

const update = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'UPDATE `jr_reclutamiento` SET `id_solicitante`=?,`id_empresa`=?,`id_departamento`=?,`id_puesto`=?,`supervisa`=?,`cant_supervisa`=?,`id_modalidad`=?,`conocimiento`=?,`conocimiento_deseable`=?,`motivo`=?,`justificacion`=?,`rango_edad`=?,`sexo`=?,`id_grado_academico`=?,`id_nivel`=? WHERE `id_reclutamiento`= ?';
    // console.log(query)
	localConnection.query(query, values, (error, reclutamientos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Reclutamiento Actualizado');
	});
});

const updaterrhh = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'UPDATE `jr_reclutamiento` SET `id_estado`= ? WHERE `id_reclutamiento`= ?';
    // console.log(query)
	localConnection.query(query, values, (error, reclutamiento) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Reclutamiento Actualizado');
	});
});



module.exports = {
	list,
    crear_solicitud,
    edit,
    update,
    list_rrhh,
    save,
    updaterrhh
};