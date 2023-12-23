const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const list = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT edo.`id_empleado`, edo.`cedula`, edo.`nombres`, edo.`apellidos`, concat(edo.`nombres`," ", edo.`apellidos`) AS nombre, edo.`codigo`, edo.`id_negocio`, edo.`id_estado`, pue.`descripcion` AS puesto, empsa.`razon_social` AS empresa FROM `jr_empleado` edo, `jr_puesto` pue, `jr_negocio_general` empsa WHERE edo.`id_puesto` = pue.`id_puesto`  AND edo.`id_negocio` = empsa.`id_negocio` AND edo.`id_estado` != 3 AND edo.`id_negocio` = ? ORDER BY edo.`id_negocio` ASC limit 10';

	localConnection.query(query,id, (error, empleados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(empleados);
	});
});

const filtro_list = (sucursal, cartera, estado, valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let sucursalPart = "";
    let carteraPart = "";
    let estadoPart = "";

    if(sucursal !=0){
        sucursalPart = `AND c.id_sucursal = ${sucursal}`;
    }
    if(cartera !=0){
        carteraPart = `AND c.id_cartera = ${cartera}`;
    }

	let query = ``;

	if (inicio !== false && nunreg !== false) {
		query = `SELECT c.id_cliente, c.nombres, c.apellidos, CONCAT(c.nombres," ", c.apellidos) AS nombre_completo, c.apodo, c.rnc, c.cedula, c.pasaporte, c.celular, c.correo, c.id_nacionalidad, c.id_empresa, c.id_sucursal, c.id_cartera, c.id_estado, car.id_cartera, car.nombre AS cartera, car.id_empleado FROM jr_cliente c, jr_cartera car WHERE car.id_cartera = c.id_cartera AND c.id_estado = ${estado} ${sucursalPart} ${carteraPart} AND (CONCAT(c.nombres," ", c.apellidos) LIKE ? OR c.apodo LIKE ? OR c.rnc LIKE ? OR c.cedula LIKE ? OR c.pasaporte LIKE ?) ORDER BY nombre_completo ASC LIMIT ${inicio}, ${nunreg}`;		
		//
	} else {
		query = `SELECT COUNT(*) AS total FROM jr_cliente c, jr_cartera car WHERE car.id_cartera = c.id_cartera AND c.id_estado = ${estado} ${sucursalPart} ${carteraPart} AND (CONCAT(c.nombres," ", c.apellidos) LIKE ? OR c.apodo LIKE ? OR c.rnc LIKE ? OR c.cedula LIKE ? OR c.pasaporte LIKE ?)`;		
	}
	localConnection.query(query,["%" + valor + "%","%" + valor + "%","%" + valor + "%", "%" + valor + "%", "%" + valor + "%"], (error, clientes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(clientes);
	});
});

const nuevo = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let nacionalidades = 'SELECT * FROM `jr_nacionalidad`';
    let grados = 'SELECT * FROM `jr_grado`';
    let grados_ac = 'SELECT * FROM `jr_grado_academico`';
    let niveles = 'SELECT * FROM `jr_nivel`';
    let estados = 'SELECT * FROM `jr_estado_empleado` ORDER BY `descripcion` ASC';
    let relaciones = "SELECT * FROM `jr_relacion`";
    let ocupaciones = "SELECT `id_ocupacion`, `descripcion` FROM `jr_ocupacion`";
    let tipo_contacto = "SELECT `idtipo_contacto`, `descripcion` FROM `jr_tipo_contacto`";
    let tipo_ingreso = "SELECT `id_tipo_ingreso`, `descripcion` FROM `jr_tipo_ingreso`";
    let cartera = "SELECT `id_cartera`, `nombre`, `id_empleado`, `fecha_creacion` FROM `jr_cartera`";
    let moneda = "SELECT `id_moneda`, `descripcion` FROM `jr_moneda`";
    let provincias = 'SELECT * FROM `jr_provincia`';
    let empresas = 'SELECT * FROM `jr_negocio_general`';

	Promise.all([
        localQuery(nacionalidades,),
        localQuery(grados,),
        localQuery(grados_ac,),
        localQuery(niveles,),
        localQuery(estados,),
        localQuery(relaciones,),
        localQuery(ocupaciones,),
        localQuery(tipo_contacto,),
        localQuery(tipo_ingreso,),
        localQuery(cartera,),
        localQuery(moneda,),
        localQuery(provincias,),
        localQuery(empresas,)
    ]).then(data => {
        // console.log(data)
        resolve(data);

    }, reject => {
        // res.status(500).send({ error: errors.DB_ERROR });
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const save = (values) => new Promise((resolve, reject) => {

    let query = 'INSERT INTO `jr_cliente`(`nombres`, `apellidos`, `apodo`, `rnc`, `cedula`, `pasaporte`, `sexo`, `estado_civil`, `id_grado_ac`, `id_nivel`,`id_ocupacion`, `comentario`, `fechadenacimiento`, `ndependientes`, `id_registradopor`, `id_provincia`, `id_municipio`, `id_sector`, `direccion`, `georeferencia`, `celular`, `correo`, `id_nacionalidad`, `id_empresa`, `id_sucursal`, `id_cartera`, `id_estado`) VALUES ( ? )';
	localConnection.query(query, [values], (error, inserted) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(inserted);
	});
});

const save_contacto = (values) => new Promise((resolve, reject) => {

    let query = 'INSERT INTO `jr_contacto`(`contacto`, `idtipo_contacto`, `id_cliente`) VALUES ( ? )';
	localConnection.query(query, [values], (error, inserted) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(inserted);
	});
});

const update_contacto = (values) => new Promise((resolve, reject) => {

    let query = 'UPDATE `jr_contacto` SET `contacto`=?,`idtipo_contacto`=?,`id_cliente`=? WHERE `idcontacto`=?';
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

const eliminar_contacto = (values) => new Promise((resolve, reject) => {

    let query = 'DELETE FROM `jr_contacto` WHERE `idcontacto` =?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Contacto eliminado');
	});
});
const save_referencia = (values) => new Promise((resolve, reject) => {

    let query = 'INSERT INTO `jr_referencia`(`nombre`, `empresa`, `telefono`, `extension`, `celular`, `correo`, `id_relacion`, `id_cliente`) VALUES ( ? )';
	localConnection.query(query, [values], (error, inserted) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(inserted);
	});
});
const update_referencia = (values) => new Promise((resolve, reject) => {

    let query = 'UPDATE `jr_referencia` SET `nombre`=?,`empresa`=?,`telefono`=?,`extension`=?,`celular`=?,`correo`=?,`id_relacion`=?,`id_cliente`=? WHERE `id_referencia`=?';
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

const eliminar_referencia = (values) => new Promise((resolve, reject) => {

    let query = 'DELETE FROM `jr_referencia` WHERE `id_referencia` = ?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Referencia eliminada');
	});
});

const save_ingreso = (values) => new Promise((resolve, reject) => {

    let query = 'INSERT INTO `jr_ingresos`(`nombre`, `telefono`, `actividadeconomica`, `posicionqueocupa`, `tiempolaborando`, `id_moneda`, `monto`, `id_tipo_ingreso`, `id_cliente`) VALUES ( ? )';
	localConnection.query(query, [values], (error, inserted) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve(inserted);
	});
});

const update_ingreso = (values) => new Promise((resolve, reject) => {

    let query = 'UPDATE `jr_ingresos` SET `nombre`=?,`telefono`=?,`actividadeconomica`=?,`posicionqueocupa`=?,`tiempolaborando`=?,`id_moneda`=?,`monto`=?,`id_tipo_ingreso`=?,`id_cliente`=? WHERE `idingreso`=?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Ingreso actualizado');
	});
});

const eliminar_ingreso = (values) => new Promise((resolve, reject) => {

    let query = 'DELETE FROM `jr_ingresos` WHERE `idingreso` = ?';
    // console.log(query)
	localConnection.query(query, values, (error, puestos) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve('Ingreso eliminado');
	});
});

const insert_path = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'INSERT INTO `jr_documentos_cliente`(`descripcion`, `path`, `id_cliente`) VALUES ( ? )';
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

const update_foto_path = (values) => new Promise((resolve, reject) => {

    let query = 'UPDATE `jr_cliente` SET `path_foto`=? WHERE `id_cliente`=?';
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



const edit_cliente = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

    let cliente = 'SELECT `id_cliente`, `nombres`, `apellidos`, `apodo`, `rnc`, `cedula`, `pasaporte`, `sexo`, `estado_civil`, `id_grado_ac`, `id_nivel`, `id_ocupacion`, `comentario`, `fechadenacimiento`, `ndependientes`, `fechaderegistro`, `path_foto`, `id_registradopor`, `id_provincia`, `id_municipio`, `id_sector`, `direccion`, `georeferencia`, `celular`, `correo`, `id_nacionalidad`, `id_empresa`, `id_sucursal`, `id_cartera`, `id_estado` FROM `jr_cliente` WHERE `id_cliente` = ?';
    
    localConnection.query(cliente,id, (error, client) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(client);
	});
});


const municipios = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_municipio` WHERE id_provincia =? ORDER BY `municipio` ASC';

	localConnection.query(query, [id], (error, municipios) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(municipios);
	});
});

const sector = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_sector` WHERE id_municipio =? ORDER BY `sector` ASC';

	localConnection.query(query, [id], (error, sectores) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(sectores);
	});
});

const contactos = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `idcontacto`, `contacto`, `idtipo_contacto` FROM `jr_contacto` WHERE `id_cliente` = ? ORDER BY `contacto` ASC';

	localConnection.query(query, [id], (error, loscontact) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(loscontact);
	});
});

const referencias = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_referencia`, `nombre`, `empresa`, `telefono`, `extension`, `celular`, `correo`, `id_relacion` FROM `jr_referencia` WHERE `id_cliente` = ? ORDER BY `nombre` ASC';

	localConnection.query(query, [id], (error, references) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(references);
	});
});

const ingresos = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `idingreso`, `nombre`, `telefono`, `actividadeconomica`, `posicionqueocupa`, `tiempolaborando`, `id_moneda`, `monto`, `id_tipo_ingreso` FROM `jr_ingresos` WHERE `id_cliente` = ? ORDER BY `idingreso` ASC';

	localConnection.query(query, [id], (error, ingre) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(ingre);
	});
});

const documentos = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT `id_documento`, `descripcion`, `path`, `fecha`, `id_cliente` FROM `jr_documentos_cliente` WHERE `id_cliente` = ? ORDER BY `descripcion` ASC';

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
    let query = 'UPDATE `jr_cliente` SET `nombres`=?,`apellidos`=?,`apodo`=?,`rnc`=?,`cedula`=?,`pasaporte`=?,`sexo`=?,`estado_civil`=?,`id_grado_ac`=?,`id_nivel`=?,`id_ocupacion`=?,`comentario`=?,`fechadenacimiento`=?,`ndependientes`=?,`id_provincia`=?,`id_municipio`=?,`id_sector`=?,`direccion`=?,`georeferencia`=?, `celular` = ?, `correo` = ?,`id_nacionalidad`=?,`id_empresa`=?,`id_sucursal`=?,`id_cartera`=?,`id_estado`=? WHERE `id_cliente`=?';
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
	list,
    filtro_list,
    nuevo,

    ver,
    vertodos,
    solicitud,
    save,
    save_contacto,
    update_contacto,
    eliminar_contacto,
    save_referencia,
    update_referencia,
    save_ingreso,
    update_ingreso,
    eliminar_ingreso,
    edit_cliente,
    municipios,
    sector,
    contactos,
    referencias,
    eliminar_referencia,
    ingresos,
	insert_path,
	update_foto_path,
	documentos,
    
    cancelar,
    update,
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
    puesto_empleado,
    departamentos,
    sucursales,
    guardar_amonestacion,
    recibir_correo,
    recibir_correo_ck,
    delete_recibir_correo,
    save_recibir_correo,
};