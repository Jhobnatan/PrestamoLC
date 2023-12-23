const { response } = require("express");
const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");


const producto_list = (valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = ["%" + valor + "%", "%" + valor + "%", "%" + valor + "%"];

	if (valor === "aaaaaaaaaaaa") {
		valor = "";
	}
	let script = "";

	if (inicio !== false && nunreg !== false) {
		script = `SELECT px.id_producto, px.codigo, px.descripcion, px.referencia, px.factor_conversion, (SELECT SUM(existencia) FROM jr_producto_almacen WHERE id_producto = px.id_producto) AS existencia, px.precio_compra, px.precio_detalle, px.precio_al_por_mayor, px.precio_especial, px.itbis, px.descuento, px.margen_ganancia, px.cantidad_minima, px.cantidad_maxima, px.ubicacion, px.color, px.id_estado, px.idmarca, (SELECT nombre FROM jr_marca WHERE id_marca = px.idmarca) AS marca, px.idcategoria, (SELECT nombre FROM jr_categoria_articulo WHERE id_categoria = px.idcategoria) AS categoria, px.id_clase, (SELECT nombre FROM jr_clase WHERE id_clase = px.id_clase) AS clase FROM jr_productox px WHERE px.codigo like ? OR px.descripcion like ? OR px.referencia like ? ORDER BY px.descripcion ASC LIMIT ${inicio}, ${nunreg}`;

	} else {
		script = `SELECT COUNT(*) AS total FROM jr_productox WHERE codigo like ? OR descripcion like ? OR referencia like ?`;
		//    values = [id, fecha_desde, fecha_hasta]
	}

	localConnection.query(script, valores, (error, scripts) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(scripts);
	});
});

const save_producto = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_productox`(`codigo`, `descripcion`, `referencia`, `factor_conversion`, `existencia`, `precio_compra`, `precio_detalle`, `precio_al_por_mayor`, `precio_especial`, `con_itbis`, `itbis`, `con_descuento`, `descuento`, `margen_ganancia`, `cantidad_minima`, `cantidad_maxima`, `ubicacion`, `id_estado`, `idmarca`, `idcategoria`, `id_clase`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertados) => {
		console.log('a guardar producto inserted ' + insertados)
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve({response:"Producto guardado correctamente"});
	});
});

const inserta_componente = (values) => new Promise((resolve, reject) => {
	console.log("inserto compronente " + values)
	let query = 'INSERT INTO `jr_producto_componente`(`id_producto`, `id_componente`, `cantidad`, `id_unidad`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertados) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve("Producto guardado correctamente");
	});
});

const actualiza_componente = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_producto_componente`(`id_producto`, `id_componente`, `cantidad`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertados) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve("Producto guardado correctamente");
	});
});

const eliminar_componente = (value) => new Promise((resolve, reject) => {

	let query = 'DELETE FROM `jr_producto_componente` WHERE `id_producto` = ? AND `id_componente` = ?';

	localConnection.query(query, value, (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(productoes);
	});
});


const componente_list = (id_producto) => new Promise((resolve, reject) => {
	let script = `SELECT id_componente FROM jr_producto_componente WHERE id_producto =?`;

	localConnection.query(script, id_producto, (error, componentes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		console.log("los id componentes", componentes)
		resolve(componentes)
	});
});



const componenteListProductos = (componentes, id) => new Promise((resolve, reject) => {
	const ids = componentes.map(resultado => resultado.id_componente);
	let script = `SELECT px.id_producto, px.codigo, px.descripcion, px.referencia, px.factor_conversion, (SELECT SUM(existencia) FROM jr_producto_almacen WHERE id_producto = px.id_producto) AS existencia, px.precio_compra, px.precio_detalle, px.precio_al_por_mayor, px.precio_especial, px.itbis, px.descuento, px.margen_ganancia, px.cantidad_minima, px.cantidad_maxima, px.ubicacion, px.color, px.id_estado, px.idmarca, (SELECT nombre FROM jr_marca WHERE id_marca = px.idmarca) AS marca, px.idcategoria, (SELECT nombre FROM jr_categoria_articulo WHERE id_categoria = px.idcategoria) AS categoria, px.id_clase, (SELECT nombre FROM jr_clase WHERE id_clase = px.id_clase) AS clase, c.cantidad, c.id_unidad, (SELECT unidad FROM jr_unidad_producto WHERE id_unidad = c.id_unidad) AS unidad FROM jr_productox px, jr_producto_componente c WHERE px.id_producto = c.id_componente AND c.id_componente IN (${ids.join(',')}) AND c.id_producto =? ORDER BY px.descripcion ASC`;
	localConnection.query(script, id, (error, productos) => {
		if (error) {
			reject(error);
			return;
		}
		console.log(productos)
		resolve(productos);
		////////////////////////////////////////////
	});
});

const update_producto = (values) => new Promise((resolve, reject) => {

	let query = 'UPDATE `jr_productox` SET `codigo`=?,`descripcion`=?,`referencia`=?,`factor_conversion`=?,`existencia`=?,`precio_compra`=?, `precio_detalle`=?, `precio_al_por_mayor`=?, `precio_especial`=?,`con_itbis`=?,`itbis`=?,`con_descuento`=?,`descuento`=?,`margen_ganancia`=?,`cantidad_minima`=?,`cantidad_maxima`=?,`ubicacion`=?,`id_estado`=?,`idmarca`=?,`idcategoria`=?,`id_clase`=? WHERE `id_producto`= ?';

	localConnection.query(query, values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Producto actualizado correctamente');
	});
});

const buscar_producto = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT id_producto, codigo, descripcion, referencia, factor_conversion, existencia, precio_compra, precio_detalle, precio_al_por_mayor, precio_especial, con_itbis, itbis, con_descuento, descuento, margen_ganancia, cantidad_minima, cantidad_maxima, ubicacion, color, id_estado, idmarca, idcategoria, id_clase  FROM jr_productox WHERE `id_producto` = ?';

	localConnection.query(query, [id], (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(productoes);
	});
});

const buscarCodigoProducto = (codigo) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT id_producto, codigo, descripcion, referencia, factor_conversion, existencia, precio_compra, precio_detalle, precio_al_por_mayor, precio_especial, con_itbis, itbis, con_descuento, descuento, margen_ganancia, cantidad_minima, cantidad_maxima, ubicacion, color, id_estado, idmarca, idcategoria, id_clase  FROM jr_productox WHERE `codigo` = ?';

	localConnection.query(query, [codigo], (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(productoes);
	});
});

const guardarSuplidorPedidoTemporal = (cantidad, id_unidad, id_producto, id_suplidor) => new Promise((resolve, reject) => {
	let query = `SELECT cantidad, id_producto, id_suplidor  FROM jr_detalle_pedido_temporal WHERE id_producto = ${id_producto} AND id_suplidor = ${id_suplidor}`;
	let valores = [cantidad, id_unidad, id_producto, id_suplidor];
	localConnection.query(query, (error, detalle_temp) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}

		if (detalle_temp == '') {
			query = 'INSERT INTO `jr_detalle_pedido_temporal`(`cantidad`, `id_unidad`, `id_producto`, `id_suplidor`) VALUES ( ? )';
			localConnection.query(query, [valores], (error, insertados) => {
				console.log('a guardar producto inserted ' + insertados)
				if (error) {
					console.log(error)
					reject(error);
					return;
				}
				resolve("Producto guardado correctamente");
			});

		}
		else {
			query = 'UPDATE `jr_detalle_pedido_temporal` SET `cantidad`=?,`id_unidad`=? WHERE `id_producto` = ? AND `id_suplidor` = ?';

			localConnection.query(query, valores, (error, insertados) => {

				if (error) {
					reject(error);
					return;
				}
				resolve('Producto actualizado correctamente');
			});
		}
	});


	//////////////////////////////////////////////////////////////////

});

const suplidorPedidoTemporal = (id_suplidor) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = `SELECT p.id_producto, p.codigo, p.descripcion, p.referencia, p.factor_conversion, p.existencia, p.precio_compra, p.id_estado, p.idmarca, p.idcategoria, p.id_clase, dpt.cantidad, dpt.id_unidad, dpt.fecha FROM jr_productox p, jr_detalle_pedido_temporal dpt WHERE dpt.id_producto = p.id_producto AND dpt.id_suplidor = ?`;

	localConnection.query(query, [id_suplidor], (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(productoes);
	});
});


const eliminarProductoDelPedido = (value) => new Promise((resolve, reject) => {

	let query = 'DELETE FROM `jr_detalle_pedido_temporal` WHERE `id_producto` = ? AND `id_suplidor` = ?';

	localConnection.query(query, value, (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(productoes);
	});
});


// const guardarOrden = (values) => new Promise((resolve, reject) => {

// 	let query = 'INSERT INTO `jr_pedido`(`fecha_requerida`, `id_empleado_pide`, `condicion`, `nota`, `estado`, `numero_de_orden`, `id_suplidor`) VALUES ( ? )';

// 	localConnection.query(query,[values], (error, insertado) => {
// 		if (error) {
// 			console.log(error)
// 			reject(error);
// 			return;
// 		}
// 		resolve(insertado.insertId);
// 	});
// });

// const guardarOrdenDetalle = (values) => new Promise((resolve, reject) => {

// 	let query = 'INSERT INTO `jr_detalle_pedido`(`cantidad`, `id_unidad`, `id_producto`, `id_pedido`) VALUES ( ? )';

// 	localConnection.query(query,[values], (error, insertado) => {
// 		if (error) {
// 			console.log(error)
// 			reject(error);
// 			return;
// 		}
// 		resolve("Orden procesada correctamente");
// 	});
// });

const actualizaNumeroDeOrden = (values) => new Promise((resolve, reject) => {

	let query = 'UPDATE `jr_suplidor` SET `numero_de_orden`=? WHERE `id_suplidor`=?';

	localConnection.query(query, values, (error, insertados) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve("Producto guardado correctamente");
	});
});

const lasmarcas = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let estad = 'SELECT `id_marca`, `nombre`, `descripcion` FROM `jr_marca` ORDER BY nombre ASC';

	localConnection.query(estad, (error, est) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(est);
	});
});

const lasclases = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let estad = 'SELECT `id_clase`, `nombre`, `descripcion` FROM `jr_clase` ORDER BY nombre ASC';

	localConnection.query(estad, (error, est) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(est);
	});
});

const lascategorias = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let estad = 'SELECT * FROM `jr_categoria_articulo` ORDER BY nombre ASC';

	localConnection.query(estad, (error, cat) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(cat);
	});
});

const losestados = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let estad = 'SELECT * FROM `jr_estado_cliente`';

	localConnection.query(estad, (error, est) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(est);
	});
});

const lasUnidades = () => new Promise((resolve, reject) => {

	let estad = 'SELECT `id_unidad`, `unidad`, `estado` FROM `jr_unidad_producto` ORDER BY unidad ASC';

	localConnection.query(estad, (error, est) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(est);
	});
});

const guardarUnidad = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_unidad_producto`(`unidad`, `estado`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve("Unidad guardado");
	});
});

const actualizarUnidad = (values) => new Promise((resolve, reject) => {

	let query = 'UPDATE `jr_unidad_producto` SET `unidad`=?,`estado`=? WHERE `id_unidad`= ?';

	localConnection.query(query, values, (error, insertados) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve("Unidad actualizado");
	});
});

const eliminaUnidadAlProducto = (value) => new Promise((resolve, reject) => {
	console.log(value)
	let query = 'DELETE FROM `jr_unidad_vs_producto` WHERE `id_producto` = ? AND  `id_unidad` = ? ';

	localConnection.query(query, value, (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(productoes);
	});
});

const buscarUnidadProducto = (id_producto) => new Promise((resolve, reject) => {

	let estad = 'SELECT tp.`factor_conversion`, tp.`id_producto`, tp.`id_unidad`, tp.`codigo_barras`, (SELECT `unidad` FROM `jr_unidad_producto` WHERE `estado` = 1 AND `id_unidad` = tp.`id_unidad`) AS unidad FROM `jr_unidad_vs_producto` tp WHERE tp.`id_producto` = ? ORDER BY tp.`factor_conversion` ASC';
	// let estad = 'SELECT tp.`factor_conversion`, tp.`id_producto`, tp.`id_unidad`, (SELECT `unidad` FROM `jr_unidad_producto` WHERE `estado` = 1 AND `id_unidad` = tp.`id_unidad`) AS unidad FROM `jr_unidad_vs_producto` tp WHERE tp.`id_producto` = ? ORDER BY unidad ASC';

	localConnection.query(estad, [id_producto], (error, est) => {
		if (error) {
			reject(error);
			return;
		}
		// console.log(est)
		resolve(est);
	});
});

const guardarUnidadVsProducto = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_unidad_vs_producto`(`factor_conversion`, `id_producto`, `id_unidad`, `codigo_barras`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve("Unidad guardado");
	});
});


const buscarAlmacenProducto = (id_producto) => new Promise((resolve, reject) => {

	let estad = "SELECT e.`existencia`, e.`ubicacion`, e.`id_producto`, a.`id_almacen`, a.`nombre` AS almacen, a.`direccion`, a.`id_encargado`,(SELECT CONCAT(`nombres`, ' ', `apellidos`) FROM `jr_empleado` WHERE `id_empleado` = a.`id_encargado`) AS encargado, a.`id_empresa` FROM `jr_producto_almacen` e, `jr_almacen` a WHERE a.`id_almacen` =  e.`id_almacen` AND e.`id_producto` = ? ORDER BY a.`nombre` ASC";
	// let estad = 'SELECT tp.`factor_conversion`, tp.`id_producto`, tp.`id_unidad`, (SELECT `unidad` FROM `jr_unidad_producto` WHERE `estado` = 1 AND `id_unidad` = tp.`id_unidad`) AS unidad FROM `jr_unidad_vs_producto` tp WHERE tp.`id_producto` = ? ORDER BY unidad ASC';

	localConnection.query(estad, [id_producto], (error, est) => {
		if (error) {
			reject(error);
			return;
		}
		// console.log(est)
		resolve(est);
	});
});


const buscarAlmacenes = () => new Promise((resolve, reject) => {

	let estad = "SELECT `id_almacen`, `nombre`, `direccion`, `id_encargado`, `id_empresa` FROM `jr_almacen` ORDER BY `nombre` ASC";
	// let estad = 'SELECT tp.`factor_conversion`, tp.`id_producto`, tp.`id_unidad`, (SELECT `unidad` FROM `jr_unidad_producto` WHERE `estado` = 1 AND `id_unidad` = tp.`id_unidad`) AS unidad FROM `jr_unidad_vs_producto` tp WHERE tp.`id_producto` = ? ORDER BY unidad ASC';

	localConnection.query(estad, (error, est) => {
		if (error) {
			reject(error);
			return;
		}
		// console.log(est)
		resolve(est);
	});
});


const consultaProductoAlmacen = (values) => new Promise((resolve, reject) => {
	let consulta = 'SELECT `existencia`, `ubicacion`, `id_producto`, `id_almacen` FROM `jr_producto_almacen` WHERE `id_producto` = ? AND `id_almacen` = ?';
	localConnection.query(consulta, values, (error, data) => {
		if (error) {
			reject(error);
			return;
		}
		console.log("la data " + data.length)
		resolve(data);
	});
});

const guardaProductoAlmacen = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_producto_almacen`(`existencia`, `ubicacion`, `id_producto`, `id_almacen`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Producto guardado correctamente');
	});
});

const actualizaProductoAlmacen = (values) => new Promise((resolve, reject) => {
	let query = 'UPDATE `jr_producto_almacen` SET `existencia`=?,`ubicacion`=? WHERE `id_almacen` = ? AND `id_producto`= ?';

	localConnection.query(query, values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Producto actualizado correctamente');
	});
});

const actualizaPrecioCompraProducto = (values) => new Promise((resolve, reject) => {
	let query = 'UPDATE `jr_productox` SET `precio_compra`= ? WHERE  `id_producto`= ?';

	localConnection.query(query, values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Producto actualizado correctamente');
	});
});


const prepararProducto = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_preparado`(`id_empleado`, `id_producto`, `cantidad`, `id_unidad`, `id_almacen`, `estado`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Producto guardado correctamente');
	});
});

module.exports = {
	producto_list,
	save_producto,
	update_producto,
	buscar_producto,
	buscarCodigoProducto,
	guardarSuplidorPedidoTemporal,
	actualizaNumeroDeOrden,
	suplidorPedidoTemporal,
	eliminarProductoDelPedido,
	eliminar_componente,
	inserta_componente,
	componente_list,
	componenteListProductos,
	lasmarcas,
	lascategorias,
	lasclases,
	losestados,
	lasUnidades,
	guardarUnidad,
	actualizarUnidad,
	eliminaUnidadAlProducto,
	buscarUnidadProducto,
	guardarUnidadVsProducto,
	buscarAlmacenProducto,
	buscarAlmacenes,
	consultaProductoAlmacen,
	guardaProductoAlmacen,
	actualizaProductoAlmacen,
	actualizaPrecioCompraProducto,
	prepararProducto,
};