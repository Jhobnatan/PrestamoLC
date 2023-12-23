const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const estado_emp = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let estados = 'SELECT * FROM `jr_estado_empleado` ORDER BY `descripcion` ASC';

	localConnection.query(estados, (error, empleados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(empleados);
	});
});

const nuevo = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let empleados = 'SELECT * FROM `jr_empleado`';
    let nacionalidades = 'SELECT * FROM `jr_nacionalidad`';
    let provincias = 'SELECT * FROM `jr_provincia`';
    let empresas = 'SELECT * FROM `jr_negocio_general` limit 1';
    let departamentos = 'SELECT `id_departamento`, `descripcion`, `centro`, `id_negocio` FROM `jr_departamento` WHERE `id_negocio` = ? ORDER BY `descripcion` ASC';
    let puestos = 'SELECT `id_puesto`, `descripcion`, `id_puesto_supervisor`, `id_negocio` FROM `jr_puesto` WHERE `id_negocio` = ? ORDER BY `descripcion` ASC';
    let modalidades = 'SELECT * FROM `jr_tipo_empleado`';
    let grados = 'SELECT * FROM `jr_grado`';
    let sueldos = 'SELECT * FROM `jr_sueldo`';
    let grados_ac = 'SELECT * FROM `jr_grado_academico`';
    let niveles = 'SELECT * FROM `jr_nivel`';
    let estados = 'SELECT * FROM `jr_estado_empleado` ORDER BY `descripcion` ASC';
    let relaciones = "SELECT * FROM `jr_relacion`";
    let sm = "SELECT `id_seguro_medico`, `seguro` FROM `jr_seguro_medico`";
    let banco = "SELECT `id_banco`, `nombre`, `code`, `digit` FROM `jr_banco` ORDER BY nombre asc";

	Promise.all([
        localQuery(empleados,),
        localQuery(nacionalidades,),
        localQuery(provincias,),
        localQuery(empresas,),
        localQuery(departamentos,id),
        localQuery(puestos,id),
        localQuery(modalidades,),
        localQuery(grados,),
        localQuery(sueldos,),
        localQuery(grados_ac,),
        localQuery(niveles,),
        localQuery(estados,),
        localQuery(relaciones,),
        localQuery(sm,),
        localQuery(banco,)
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
    
    let query = 'INSERT INTO `jr_empleado`(`cedula`, `nombres`, `apellidos`, `usuario`, `codigo`, `tarjeta_punto`, `id_negocio`, `id_departamento`, `id_puesto`, `email_personal`, `fecha_nacimiento`, `tel`, `cel`, `sexo`, `estado_civil`, `nhijos`, `id_provincia`, `id_municipio`, `id_sector`, `direccion`, `email_institucional`, `id_estado`, `id_grado_ac`, `id_nivel`, `id_encargado`, `fecha_entrada`, `id_grado`, `id_sueldo`, `id_tipo_empleado`, `id_nacionalidad`, `contacto_emergencia`, `id_relacion`, `tel_emergencia`, `cel_emergencia`, `enfermedad`, `tipo_enfermedad`, `alergia`, `tipo_alergia`, `medicacion`, `tipo_medicamento`, `tarjeta_combustible`, `monto_combustible`, `monto_vehiculo`, `flota`, `id_seguro_medico`, `numero_cuenta`, `id_banco`, `id_sucursal`) VALUES ( ? )';
    console.log(query)
	localConnection.query(query, [values], (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Datos insertado');
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

const supervisa = (id_puesto, id_negocio) => new Promise((resolve, reject) => {
	
	let query = 'SELECT `id_puesto_supervisor` FROM `jr_puesto` WHERE `id_puesto` = ? AND id_negocio = ?';

	localConnection.query(query,[id_puesto, id_negocio], (error, encargado) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(encargado);
	});
});

const encargados = (id_puesto,id_negocio) => new Promise( async (resolve, reject) => {
	let id_encargado = await supervisa(id_puesto, id_negocio);
	
	let query = 'SELECT * FROM `jr_empleado` WHERE id_puesto =? AND id_negocio = ?';
    let values = [];
    if(id_encargado[0]){
        values = [id_encargado[0].id_puesto_supervisor, id_negocio]
    }else{
        values = [0, id_negocio]
    }
	localConnection.query(query,values, (error, encargados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		resolve(encargados);
	});
});

const puesto_empleado = (empresa) => new Promise((resolve, reject) => {
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



const edit_empleado = (id_empleado,id_departamento) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let empleados = 'SELECT * FROM `jr_empleado` where 1 !=1';
    let nacionalidades = 'SELECT * FROM `jr_nacionalidad`';
    let provincias = 'SELECT * FROM `jr_provincia`';
    let empresas = 'SELECT * FROM `jr_negocio_general`';
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
    let salidas = "SELECT * FROM `jr_salida`";
    let sm = "SELECT `id_seguro_medico`, `seguro` FROM `jr_seguro_medico`";
    let banco = "SELECT `id_banco`, `nombre`, `code`, `digit` FROM `jr_banco` ORDER BY nombre asc";

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
        localQuery(salidas,),
        localQuery(sm,),
        localQuery(banco,)
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const ver = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let query_permisos = 'SELECT e.`id_empleado`, e.`cedula`, concat( e.`nombres`, " ", e.`apellidos`) AS solicitante, e.`nombres`, e.`apellidos`, e.`usuario`, e.`codigo`, e.`id_empresa`, (SELECT `nombre_empresa` FROM `jr_empresa` WHERE `id_empresa` = e.`id_empresa`) AS empresa, e.`id_departamento`, (SELECT `descripcion` FROM `jr_departamento` WHERE `id_departamento` = e.`id_departamento`) AS departamento, e.`id_puesto`, (SELECT `descripcion` FROM `jr_puesto` WHERE `id_puesto` =e.`id_puesto`) AS puesto, e.`id_estado` AS estado_empleado, p.`id_permiso`, p.`id_tipo_permiso`, (SELECT `tipo_permiso` FROM `jr_tipo_permiso` WHERE `id_tipo_permiso` = p.`id_tipo_permiso`) AS tipo_permiso, p.`fecha_salida`, p.`fecha_entrada`, p.`fecha_solicitud`, p.`motivo`, p.`motivo_cancelacion`, p.`id_encargado`, (SELECT concat(`nombres`, " ",  `apellidos`) FROM `jr_empleado` WHERE `id_empleado` =e.`id_encargado`) AS encargado, p.`fecha_encargado`, p.`comentario_encargado`, p.`id_rrhh`, p.`comentario_rrhh`, p.`fecha_rrhh`, p.`id_estado` AS id_estado_premiso, (SELECT `descripcion` FROM `jr_estado` WHERE `id_estado` = p.`id_estado`) AS estado_permiso FROM `jr_permiso` p, `jr_empleado` e WHERE e.`id_empleado` = p.`id_empleado` AND p.`id_permiso` = ?';
    let query_estados = 'SELECT * FROM `jr_estado`';

	Promise.all([
        localQuery(query_permisos,id),
        localQuery(query_estados,)
    ]).then(data => {
        // console.log(data)
        resolve(data);
        return

    }, reject => {
        res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
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



const update = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'UPDATE `jr_empleado` SET `cedula`=?,`nombres`=?,`apellidos`=?,`usuario`=?,`codigo`=?,`tarjeta_punto`=?,`id_negocio`=?,`id_departamento`=?,`id_puesto`=?,`email_personal`=?,`fecha_nacimiento`=?,`tel`=?,`cel`=?,`sexo`=?,`estado_civil`=?,`nhijos`=?,`id_provincia`=?,`id_municipio`=?,`id_sector`=?,`direccion`=?,`email_institucional`=?,`id_estado`=?,`id_grado_ac`=?,`id_nivel`=?,`id_encargado`=?,`fecha_entrada`=?,`id_grado`=?,`id_sueldo`=?,`id_tipo_empleado`=?,`id_nacionalidad`=?,`contacto_emergencia`=?,`id_relacion`=?,`tel_emergencia`=?,`cel_emergencia`=?,`enfermedad`=?,`tipo_enfermedad`=?,`alergia`=?,`tipo_alergia`=?,`medicacion`=?,`tipo_medicamento`=?,`tarjeta_combustible`=?,`monto_combustible`=?,`monto_vehiculo`=?,`flota`=?,`id_seguro_medico`=?,`numero_cuenta`=?,`id_banco`=?, `id_sucursal` =? WHERE `id_empleado`=?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Empleado Actualizado');
	});
});

const update_foto_path = (values) => new Promise((resolve, reject) => {

    let query = 'UPDATE `jr_empleado` SET `path_foto`=? WHERE `id_empleado`=?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Contactos actualizados');
	});
});

const insert_path = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'INSERT INTO `jr_documentos_empleado`(`descripcion`, `path`, `id_empleado`) VALUES ( ? )';
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

const documentos = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_documento`, `descripcion`, `path`, `fecha`, `id_empleado` FROM `jr_documentos_empleado` WHERE `id_empleado` = ? ORDER BY `descripcion` ASC';

	localConnection.query(query, [id], (error, docs) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(docs);
	});
});

const edit_user = (values) => new Promise((resolve, reject) => {
    let query = 'SELECT `id_usuario`, `usuario`, `clave`, `id_empleado` FROM `jr_usuario` WHERE `id_empleado`=?';

	localConnection.query(query, values, (error, usuario) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(usuario);
	});
});

const recibir_correo = () => new Promise((resolve, reject) => {
    let query = 'SELECT `id_recibir`, `descripcion` FROM `jr_recibir_correo`';

	localConnection.query(query, (error, lista) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(lista);
	});
});

const recibir_correo_ck = (id) => new Promise((resolve, reject) => {
    let query = 'SELECT `id_empleado`, `id_recibir` FROM `jr_recibir_correo_vs_empleado` WHERE `id_empleado` = ?';

	localConnection.query(query,id, (error, lista) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(lista);
	});
});

const out_empleado = (values,id) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let empleado = 'UPDATE `jr_empleado` SET `id_estado`=3 WHERE `id_empleado`=?';
    let movimiento = 'INSERT INTO `jr_movimiento_empleado`(`id_salida`, `id_empleado`, `motivo`, `realizadopor`, `fecha`, `accion`) VALUES ( ? )';

	Promise.all([
        localQuery(empleado,id),
        localQuery(movimiento,values),
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const activar_empleado = (values,id) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let empleado = 'UPDATE `jr_empleado` SET `id_estado`=2 WHERE `id_empleado`=?';
    let movimiento = 'INSERT INTO `jr_movimiento_empleado`(`id_salida`, `id_empleado`, `motivo`, `realizadopor`, `fecha`, `accion`) VALUES ( ? )';

	Promise.all([
        localQuery(empleado,id),
        localQuery(movimiento,values),
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const data_accesos = (id, negocio) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let grupos_acceso = 'SELECT `id_grupo`, `descripcion` FROM `jr_grupo` WHERE `id_negocio` = ? OR `id_negocio` = 0';
    let grupos_usuario = 'SELECT `id_grupo`, `id_usuario` FROM `jr_usuario_vs_grupo` WHERE `id_usuario` = ?';

	Promise.all([
        localQuery(grupos_acceso,negocio),
        localQuery(grupos_usuario,id),
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const save_user = (values) => new Promise((resolve, reject) => {
    let query = 'INSERT INTO `jr_usuario`(`usuario`, `clave`, `id_empleado`) VALUES ( ? )';

	localConnection.query(query, [values], (error, inserted) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(inserted);
	});
});

const update_user = (values) => new Promise((resolve, reject) => {
    let query = 'UPDATE `jr_usuario` SET `usuario`=?,`clave`=? WHERE `id_usuario`=?';

	localConnection.query(query, values, (error, updated) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(updated);
	});
});

const delete_user = (id) => new Promise((resolve, reject) => {
    let query = 'DELETE FROM `jr_usuario_vs_grupo` WHERE `id_usuario` = ?';

	localConnection.query(query, [id], (error, updated) => {
		if (error) {
			reject(error);
			return;
		}
		resolve('Usuario eliminado');
	});
});

const insert_access = (valores) => new Promise((resolve, reject) => {
    let query = 'INSERT INTO `jr_usuario_vs_grupo`(`id_grupo`, `id_usuario`) VALUES ( ? )';

	localConnection.query(query, [valores], (error, updated) => {
		if (error) {
			reject(error);
			return;
		}
		resolve("");
	});
});

const departamentos = (empresa) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT d.`id_departamento`, d.`descripcion`, d.`centro`, d.`id_negocio`, (SELECT `razon_social` FROM `jr_negocio_general` WHERE `id_negocio` = d.`id_negocio`) AS empresa FROM `jr_departamento` d WHERE d.`id_negocio` = ?';

	Promise.all([
        localQuery(query,empresa),
    ]).then(data => {
        // console.log(data)
        resolve(data);
        return

    }, reject => {
        res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const sucursales = (empresa) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_sucursal`, `nombre_sucursal` FROM `jr_sucursal` WHERE  `id_negocio` = ?';

	Promise.all([
		localQuery(query, empresa),
	]).then(data => {
		// console.log(data)
		resolve(data);
		return

	}, reject => {
		res.status(500).send({ error: errors.DB_ERROR });
		console.log("No se pudo cargar información de formulario. " + reject);
	});
});

const licencia = (id_empleado,id_departamento) => new Promise((resolve, reject) => {
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
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const guardar_lic = (valores) => new Promise((resolve, reject) => {
    let query = 'INSERT INTO `jr_licencia`(`id_empleado`, `id_tipo_licencia`, `fecha_salida`, `fecha_entrada`, `motivo`, `constancia`, `id_rrhh`, `estado`) VALUES ( ? )';

	localConnection.query(query, [valores], (error, updated) => {
		if (error) {
			reject(error);
			return;
		}
		resolve("");
	});
});

const guardar_amonestacion = (valores) => new Promise((resolve, reject) => {
    let query = 'INSERT INTO `jr_amonestacion`(`id_empleado`, `tipo`, `id_rrhh`, `id_autoriza`, `motivo`, `path_doc`) VALUES ( ? )';

	localConnection.query(query, [valores], (error, updated) => {
		if (error) {
			reject(error);
			return;
		}
		resolve("");
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

const delete_recibir_correo = (id_empleado) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'DELETE FROM `jr_recibir_correo_vs_empleado` WHERE `id_empleado` = ?';
    // console.log(query)
	localConnection.query(query, id_empleado, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Vs jr_recibir_correo_vs_empleado eliminado');
	});
});

const save_recibir_correo =  (values,id_empleado) => new Promise((resolve, reject) => {

    if(values){
        if(typeof values!="object"){
            let valores = [id_empleado,values];
    
                let insertEnviodeCorreo = "INSERT INTO `jr_recibir_correo_vs_empleado`(`id_empleado`, `id_recibir`) VALUES ( ? );";
                
                // console.log('valores a ver ', valores)
                
                // creacion del nuevo vs de la persona_vs_sucursal
                localConnection.query(insertEnviodeCorreo,[valores], (error, inserted) => { // elimino el vs de la sucursal
                    console.log(error)
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve('Datos agregados correctamente');
                });
        }
        // Si es mas de un item.
        else{
            // Recorro el arreglo de las personas encargadas de la sucursal
            for (let i = 0; i < values.length; i++) { //inserto el id afiliado

                let value = [id_empleado,values[i]];
                // console.log(vals)
                let insertEnviodeCorreo = "INSERT INTO `jr_recibir_correo_vs_empleado`(`id_empleado`, `id_recibir`) VALUES ( ? );";
                localConnection.query(insertEnviodeCorreo,[value], (error, inserted) => {
                    // console.log(error)
                    if (error) {
                        reject(error);
                        return;
                    }
                });
        
            }
            resolve('Afiliado agregados correctamente');
        }
        
       
    }else{
        resolve('NO hay Afiliado');
    }


});

module.exports = {
    estado_emp,
    nuevo,

    ver,
    vertodos,
    solicitud,
    save,
    cancelar,
    update,
    update_foto_path,
    insert_path,
    documentos,
    out_empleado,
    activar_empleado,
    edit_user,
    data_accesos,
    save_user,
    update_user,
    delete_user,
    insert_access,
    licencia,
    guardar_lic,
    updaterrhh,
    encargados_dep,
    encargados,
    edit_empleado,
    puesto_empleado,
    departamentos,
    sucursales,
    guardar_amonestacion,
    recibir_correo,
    recibir_correo_ck,
    delete_recibir_correo,
    save_recibir_correo,
};