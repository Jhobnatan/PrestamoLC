const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");


const orden_list = (estado, valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = [estado ,valor,"%" + valor + "%","%" + valor + "%","%" + valor + "%"];
		
		if (valor === "aaaaaaaaaaaa") {
			valor = "";
		}
		let script = "";
	
		if (inicio !== false && nunreg !== false) {
			script = `SELECT p.id_pedido, p.fecha_pedido, p.fecha_requerida, p.id_empleado_pide,(SELECT  CONCAT( nombres," ", apellidos) FROM jr_empleado WHERE id_empleado = p.id_empleado_pide) AS realizadopor, p.condicion, p.nota, p.estado, p.numero_de_orden, p.id_suplidor, s.empresa_sup, s.rnc_sup, s.representante, s.flota, s.telefono, s.extension FROM jr_pedido p, jr_suplidor s WHERE p.id_suplidor = s.id_suplidor AND p.estado = ? AND (p.numero_de_orden = ? OR s.empresa_sup LIKE ? OR s.rnc_sup LIKE ? OR s.representante LIKE ?) ORDER BY p.fecha_requerida ASC LIMIT ${inicio}, ${nunreg}`;

		} else {
			script = `SELECT COUNT(*) AS total FROM jr_pedido p, jr_suplidor s WHERE p.id_suplidor = s.id_suplidor AND p.estado = ? AND (p.numero_de_orden = ? OR s.empresa_sup LIKE ? OR s.rnc_sup LIKE ? OR s.representante LIKE ?)`;
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

	localConnection.query(query,[values], (error, insertados) => {
		console.log('a guardar producto inserted '+ insertados)
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve("Producto guardado correctamente");
	});
});

const inserta_componente = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_producto_componente`(`id_producto`, `id_componente`, `cantidad`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertados) => {
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

	localConnection.query(query,[values], (error, insertados) => {
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

	localConnection.query(query,value, (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(productoes);
	});
});

//

const pedido_list = (id_pedido) => new Promise((resolve, reject) => {
	let script = `SELECT pro.id_producto, pro.codigo, pro.descripcion, pro.referencia, pro.factor_conversion, pro.existencia, pro.precio_compra, pro.precio_detalle, pro.precio_al_por_mayor, pro.precio_especial, pro.con_itbis, pro.itbis, pro.con_descuento, pro.descuento, pro.margen_ganancia, pro.cantidad_minima, pro.cantidad_maxima, pro.ubicacion, pro.color, pro.id_estado, pro.idmarca, pro.idcategoria, pro.id_clase, dp.id_detalle_pedido, dp.cantidad, dp.id_unidad, (SELECT unidad FROM jr_unidad_producto WHERE id_unidad = dp.id_unidad AND estado = 1) AS unidad, dp.id_producto, dp.id_pedido FROM jr_productox pro, jr_detalle_pedido dp WHERE pro.id_producto = dp.id_producto AND dp.id_pedido = ?`;

	localConnection.query(script, id_pedido, (error, componentes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		resolve(componentes)
	});
});




const componenteListProductos = (componentes,id) => new Promise((resolve, reject) => {
	const ids = componentes.map(resultado => resultado.id_componente);
	let script = `SELECT px.id_producto, px.codigo, px.descripcion, px.referencia, px.factor_conversion, (SELECT SUM(existencia) FROM jr_producto_almacen WHERE id_producto = px.id_producto) AS existencia, px.precio_compra, px.precio_detalle, px.precio_al_por_mayor, px.precio_especial, px.itbis, px.descuento, px.margen_ganancia, px.cantidad_minima, px.cantidad_maxima, px.ubicacion, px.color, px.id_estado, px.idmarca, (SELECT nombre FROM jr_marca WHERE id_marca = px.idmarca) AS marca, px.idcategoria, (SELECT nombre FROM jr_categoria_articulo WHERE id_categoria = px.idcategoria) AS categoria, px.id_clase, (SELECT nombre FROM jr_clase WHERE id_clase = px.id_clase) AS clase, c.cantidad, c.id_unidad, (SELECT unidad FROM jr_unidad_producto WHERE id_unidad = c.id_unidad) AS unidad FROM jr_productox px, jr_producto_componente c WHERE px.id_producto = c.id_componente AND c.id_componente IN (${ids.join(',')}) AND c.id_producto =? ORDER BY px.descripcion ASC`;
	localConnection.query(script,id, (error, productos) => {
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

	localConnection.query(query,values, (error, insertados) => {

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

	localConnection.query(query,[id], (error, productoes) => {
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

	localConnection.query(query,[codigo], (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(productoes);
	});
});

const guardarSuplidorPedidoTemporal = (cantidad, id_producto, id_suplidor) => new Promise((resolve, reject) => {
	let query = `SELECT cantidad, id_producto, id_suplidor  FROM jr_detalle_pedido_temporal WHERE id_producto = ${id_producto} AND id_suplidor = ${id_suplidor}`;
	let valores = [cantidad, id_producto, id_suplidor];
	localConnection.query(query, (error, detalle_temp) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		
		if(detalle_temp ==''){
			query = 'INSERT INTO `jr_detalle_pedido_temporal`(`cantidad`, `id_unidad`, `id_producto`, `id_suplidor`) VALUES ( ? )';
			localConnection.query(query,[valores], (error, insertados) => {
				console.log('a guardar producto inserted '+ insertados)
				if (error) {
					console.log(error)
					reject(error);
					return;
				}
				resolve("Producto guardado correctamente");
			});

		}
		else{
			query = 'UPDATE `jr_detalle_pedido_temporal` SET `cantidad`=? WHERE `id_producto` = ? AND `id_suplidor` = ?';

			localConnection.query(query,valores, (error, insertados) => {

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

	let query = `SELECT p.id_producto, p.codigo, p.descripcion, p.referencia, p.factor_conversion, p.existencia, p.precio_compra, p.id_estado, p.idmarca, p.idcategoria, p.id_clase, dpt.cantidad, dpt.fecha FROM jr_productox p, jr_detalle_pedido_temporal dpt WHERE dpt.id_producto = p.id_producto AND dpt.id_suplidor = ?`;

	localConnection.query(query,[id_suplidor], (error, productoes) => {
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

	localConnection.query(query,value, (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(productoes);
	});
});


const guardarOrden = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_pedido`(`fecha_requerida`, `id_empleado_pide`, `condicion`, `nota`, `estado`, `numero_de_orden`, `id_suplidor`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve(insertado.insertId);
	});
});

const guardarOrdenDetalle = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_detalle_pedido`(`cantidad`, `id_unidad`, `id_producto`, `id_pedido`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve("Orden procesada correctamente");
	});
});

const actualizaNumeroDeOrden = (values) => new Promise((resolve, reject) => {

	let query = 'UPDATE `jr_suplidor` SET `numero_de_orden`=? WHERE `id_suplidor`=?';

	localConnection.query(query,values, (error, insertados) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve("Producto guardado correctamente");
	});
});


const buscarPedidoSuplidor = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT p.id_pedido, p.fecha_pedido, p.fecha_requerida, p.id_empleado_pide,(SELECT  CONCAT( nombres," ", apellidos) FROM jr_empleado WHERE id_empleado = p.id_empleado_pide) AS realizadopor, p.condicion, p.nota, p.estado, p.numero_de_orden, p.id_suplidor, s.empresa_sup, s.rnc_sup, s.representante, s.flota, s.telefono, s.extension FROM jr_pedido p, jr_suplidor s WHERE p.id_suplidor = s.id_suplidor AND p.id_suplidor = ?  AND p.id_pedido = ? ';

	localConnection.query(query,values, (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(productoes);
	});
});

const pedidoIngreso = (id_pedido) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let query = `SELECT i.id_ingreso, i.fecha_ingreso, i.id_empleado_ingresa, i.total_itbis, i.total_descuento, i.importe_ingreso, i.total_pagado, i.monto_pendiente, i.comprobante, i.condicion, i.estado_ingreso, i.path_factura_suplidor, i.id_pedido, i.numero_factura, i.nota, i.id_sucursal, p.fecha_pedido, p.fecha_requerida, p.id_empleado_pide, (SELECT  CONCAT( nombres," ", apellidos) FROM jr_empleado WHERE id_empleado = p.id_empleado_pide) AS realizadopor, p.numero_de_orden, p.id_suplidor FROM jr_ingreso_producto i, jr_pedido p WHERE p.id_pedido = i.id_pedido AND  i.estado_ingreso <>'produccion' AND i.id_pedido = ?`;
//i.id_ingreso, i.fecha_ingreso, i.id_empleado_ingresa, i.total_itbis, i.total_descuento, i.importe_ingreso, i.total_pagado, i.monto_pendiente, i.comprobante, i.condicion, i.estado_ingreso, i.path_factura_suplidor, i.id_pedido, i.numero_factura, i.nota, i.id_sucursal
	localConnection.query(query,[id_pedido], (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(productoes);
	});
});

const guardarIngreso = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_ingreso_producto`(`id_empleado_ingresa`, `total_itbis`, `total_descuento`, `importe_ingreso`, `total_pagado`, `monto_pendiente`, `comprobante`, `condicion`, `estado_ingreso`, `path_factura_suplidor`, `id_pedido`, `numero_factura`, `nota`, `id_sucursal`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve(insertado.insertId);
	});
});

const  updateIngresoProducto = (values) => new Promise((resolve, reject) => {
	//  console.log("Servicio ======================> ", values)
		let query = 'UPDATE `jr_ingreso_producto` SET `fecha_ingreso`=NOW(),`id_empleado_ingresa`=?,`total_itbis`=?,`total_descuento`=?,`importe_ingreso`=?,`total_pagado`=?,`monto_pendiente`=?,`comprobante`=?,`condicion`=?,`estado_ingreso`=?,`path_factura_suplidor`=?,`id_pedido`=?,`numero_factura`=?,`nota`=? WHERE `id_ingreso`=?';
	
		localConnection.query(query,values, (error, insertados) => {
	
			if (error) {
				reject(error);
				return;
			}
			// console.log(insertados)
			resolve('Ingreso actualizado correctamente');
		});
	});

const guardarDetalleIngreso = (values) => new Promise((resolve, reject) => {

	let query = 'INSERT INTO `jr_detalle_ingreso`(`id_almacen`,`cantidad`,`id_unidad`, `cantidad_recibida`, `cantidad_pendiente`, `preciocompra`, `itbis`, `fechaproduccion`, `fechavencimiento`, `descuento`, `importe`, `id_ingreso`, `id_producto`, `ubicacion_fisica`) VALUES ( ? )';

	localConnection.query(query,[values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve(insertado.insertId);
	});
});



const updateDetalleIngresoProducto = (values) => new Promise((resolve, reject) => {
//  console.log("Servicio ======================> ", values)
	let query = 'UPDATE `jr_detalle_ingreso` SET `id_almacen`=?,`cantidad`=?,`cantidad_recibida`=?,`cantidad_pendiente`=?,`preciocompra`=?,`itbis`=?,`fechaproduccion`=?,`fechavencimiento`=?,`descuento`=?,`importe`=?,`ubicacion_fisica`=? WHERE `id_ingreso` = ? AND `id_producto`= ?';

	localConnection.query(query,values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		// console.log(insertados)
		resolve('Producto actualizado correctamente');
	});
});

const detalleIngrsoList = (id_pedido) => new Promise((resolve, reject) => {
	let script = `SELECT pro.id_producto, pro.codigo, pro.descripcion, pro.referencia, pro.factor_conversion, pro.existencia, pro.precio_compra as precio_compra_producto, pro.id_estado, pro.idmarca, pro.idcategoria, pro.id_clase, pro.ubicacion, di.id_detalle_ingreso, di.id_almacen, di.cantidad, di.id_unidad, di.cantidad_recibida, di.cantidad_pendiente, di.preciocompra, di.itbis AS itbis_ingreso, di.fechaproduccion, di.fechavencimiento, di.descuento AS descuento_ingreso, di.importe, di.id_ingreso, di.id_producto, di.ubicacion_fisica FROM jr_productox pro, jr_detalle_ingreso di WHERE pro.id_producto = di.id_producto AND di.cantidad > 0 AND di.id_ingreso = ?`;

	localConnection.query(script, id_pedido, (error, componentes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		resolve(componentes)
	});
});

const consultaFactorDeConversionUnidadProducto = (values) => new Promise((resolve, reject) => {
	let consulta = 'SELECT `factor_conversion` FROM `jr_unidad_vs_producto` WHERE `id_producto` = ? AND `id_unidad` = ?';
		localConnection.query(consulta,values, (error, data) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(data);
		});
	});

const consultaProductoAlmacen = (values) => new Promise((resolve, reject) => {
	let consulta = 'SELECT `existencia`, `ubicacion`, `id_producto`, `id_almacen` FROM `jr_producto_almacen` WHERE `id_producto` = ? AND `id_almacen` = ?';
		localConnection.query(consulta,values, (error, data) => {
			if (error) {
				reject(error);
				return;
			}
			console.log("la data "+data.length)
			resolve(data);
		});
	});

	const guardaProductoAlmacen = (values) => new Promise((resolve, reject) => {

			let query = 'INSERT INTO `jr_producto_almacen`(`existencia`, `ubicacion`, `id_producto`, `id_almacen`) VALUES ( ? )';
		
			localConnection.query(query,[values], (error, insertados) => {
		
				if (error) {
					reject(error);
					return;
				}
				resolve('Producto guardado correctamente');
			});
		});

	const actualizaProductoAlmacen = (values) => new Promise((resolve, reject) => { 
			let query = 'UPDATE `jr_producto_almacen` SET `id_almacen`=?,`existencia`=?,`ubicacion`=? WHERE `id_almacen` = ? AND `id_producto`= ?';
		
			localConnection.query(query,values, (error, insertados) => {
		
				if (error) {
					reject(error);
					return;
				}
				resolve('Producto actualizado correctamente');
			});
		});

		
const setIngresoEstadoProduccion = (values) => new Promise((resolve, reject) => { 
			let query = 'UPDATE `jr_ingreso_producto` SET `fecha_ingreso`=NOW(),`estado_ingreso`="produccion" WHERE `id_ingreso`=?';
		
			localConnection.query(query,values, (error, insertados) => {
		
				if (error) {
					reject(error);
					return;
				}
				resolve('Producto actualizado correctamente');
			});
		});
/**
 * 
 * 
 * @returns SET `cantidad`=?,`cantidad_procesada` = `cantidad_procesada` + ? WHERE `id_producto`=?,`id_pedido`=? 
 */
const setCantidadProcesadaPedido = (values) => new Promise((resolve, reject) => { 
	// console.log('entro a actualizar pedido xDn')
			let query = 'UPDATE `jr_detalle_pedido` SET `cantidad`=?,`cantidad_procesada` = (cantidad_procesada + ?) WHERE `id_producto`=? AND `id_pedido`=?';
			
			localConnection.query(query,values, (error, insertados) => {
				// console.log('pedido =====> ' + error)
				if (error) {
					reject(error);
					return;
				}
				resolve('Producto actualizado correctamente');
			});
		});

		/**
		 * 
		 * @param {UPDATE `jr_pedido` SET `estado`="completado" WHERE `id_pedido`=?} values 
		 * @returns 
		 */
const setCompletadoPedidoHeader = (values) => new Promise((resolve, reject) => { 
					let query = 'UPDATE `jr_pedido` SET `estado`="completado" WHERE `id_pedido`=?';
					localConnection.query(query,values, (error, insertados) => {
						if (error) {
							reject(error);
							return;
						}
						resolve('Producto actualizado correctamente');
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

const actualizaPrecioDeCompraProducto = (values) => new Promise((resolve, reject) => { 
	let query = 'UPDATE `jr_productox` SET `precio_compra`= ? WHERE `id_producto`= ?';
	localConnection.query(query,values, (error, insertados) => {
		if (error) {
			reject(error);
			return;
		}
		resolve('Producto actualizado correctamente');
	});
});


const buscarPedido = (id_pedido) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT p.id_pedido, p.fecha_pedido, p.fecha_requerida, p.id_empleado_pide,(SELECT  CONCAT( nombres," ", apellidos) FROM jr_empleado WHERE id_empleado = p.id_empleado_pide) AS realizadopor, p.condicion, p.nota, p.estado, p.numero_de_orden, p.id_suplidor, s.empresa_sup, s.rnc_sup, s.representante, s.flota, s.telefono, s.extension FROM jr_pedido p, jr_suplidor s WHERE p.id_suplidor = s.id_suplidor AND p.id_pedido = ? ';

	localConnection.query(query,id_pedido, (error, productoes) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(productoes);
	});
});

module.exports = {
	orden_list,
	save_producto,
	update_producto,
	buscar_producto,
	buscarCodigoProducto,
	guardarSuplidorPedidoTemporal,
	guardarOrden,
	guardarOrdenDetalle,
	actualizaNumeroDeOrden,
	suplidorPedidoTemporal,
	eliminarProductoDelPedido,
	buscarPedidoSuplidor,
	eliminar_componente,
	inserta_componente,
	pedido_list,
	pedidoIngreso,
	guardarIngreso,
	updateIngresoProducto,
	guardarDetalleIngreso,
	detalleIngrsoList,
	updateDetalleIngresoProducto,
	setIngresoEstadoProduccion,

	setCantidadProcesadaPedido,
	setCompletadoPedidoHeader,

	actualizaPrecioDeCompraProducto,

	consultaFactorDeConversionUnidadProducto,
	consultaProductoAlmacen,
	guardaProductoAlmacen,
	actualizaProductoAlmacen,

	componenteListProductos,
	lasmarcas,
	lascategorias,
	lasclases,
	losestados,
	buscarPedido
};