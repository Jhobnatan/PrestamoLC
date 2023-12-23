const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");


// const buscarProductoPorCodigo = (codigo) => new Promise((resolve, reject) => {

// 	let query = 'SELECT `id_producto`, `codigo`, `descripcion`, `referencia`, `factor_conversion`, `existencia`, `precio_compra`, `precio_detalle`, `precio_al_por_mayor`, `precio_especial`, `con_itbis`, `itbis`, `con_descuento`, `descuento`, `margen_ganancia`, `cantidad_minima`, `cantidad_maxima`, `ubicacion`, `color`, `id_estado`, `idmarca`, `idcategoria`, `id_clase` FROM `jr_productox` WHERE `codigo` = ?';
// 	localConnection.query(query,[codigo], (error, producto) => {
// 		// console.log(error);
// 		if (error) {
// 			reject(error);
// 			return;
// 		}
//         // console.log(rows)
// 		resolve(producto);
// 	});
// });
const consultaVentaTemporal = (id_empleado, id_cliente, caja, mesa, numero_pedido) => new Promise((resolve, reject) => {

	console.log("Consulta venta tempora. ===>")
	console.log("Cliente ===>", id_cliente)
	console.log("caja ===>", caja)
	console.log("Mesa ===>", mesa)
	console.log("numero_pedido ===>", numero_pedido)

	// let partEmpleado = "";
	// let partCliente = "";
	// let partCaja = "";
	// let partMesa = "";

	// if (id_empleado != '') {
	// 	partEmpleado = `AND vt.id_empleado = ${id_empleado}`
	// }


	// if (id_cliente != '') {
	// 	partCliente = `AND vt.id_cliente = ${id_cliente}`
	// }


	// if (caja != '') {
	// 	partCaja = `AND vt.caja = "${caja}"`
	// }
	// if (caja != '' && id_cliente == 1 && mesa == 0) {
	// 	partCaja = `AND vt.caja = "${caja}" AND vt.id_cliente = 1 AND vt.id_mesa = 0`

	// }else if (caja != '' && id_cliente == 1) {
	// 	partCaja = `AND vt.caja = "${caja}" AND vt.id_cliente = 1`

	// } else if (mesa != 0 && id_cliente == 1) {
	// 	partCaja = `AND vt.id_mesa = ${mesa}  AND vt.id_cliente = 1`

	// }else if (id_cliente != 1) {
	// 	console.log("cliente distinto de 1 --->", id_cliente)
	// 	partCaja = `AND vt.id_cliente = ${id_cliente} AND vt.id_mesa = 0`

	// }

	console.log(`Muestro el detalle caja ====== ${caja}`)
	console.log(`Muestro el detalle mesa ====== ${mesa}`)
	console.log(`Muestro el detalle Cliente ====== ${id_cliente}`)
	console.log(`Muestro el detalle numero de pedido ====== ${numero_pedido}`)

	let partCaja = ""
	let partMesa = ""
	let partCliente = "";
	let partPedido = "";

	if (caja != '') {
		partCaja = `AND caja = "${caja}"`

	}
	
		// partCliente = `AND id_cliente = "${id_cliente}"`
// if(mesa !='' && mesa !=0){
	partMesa = `AND id_mesa = "${mesa}"`
// }
	
	if (id_cliente != '') {
		// numero_pedido = 0;
		console.log("cliente igual a 1 --->", id_cliente)
		partCliente = `AND id_cliente = ${id_cliente}`
	}
	
	if (numero_pedido == '') {
		numero_pedido = 0;
		console.log("cliente igual a 1 --->", id_cliente)
		partPedido = `AND numero_pedido = ${numero_pedido}`
	}else{
		partPedido = `AND numero_pedido = ${numero_pedido}`
	}
	console.log(typeof(numero_pedido))
	

	// let query = `SELECT id_empleado, id_cliente, caja, id_mesa, id_camarero, precio_venta, cantidad, id_unidad, id_producto FROM jr_detalle_venta_temporal WHERE id_producto = ${id_producto} AND id_unidad = ${id_unidad} AND numero_pedido = ${numero_pedido} ${partCaja} ${partCliente} ${partMesa}`;
	// console.log("Muestro mi query a guardar ==> ", query)
// ///desde aqui
// 	let partCaja = ""
// 	let partMesa = ""
// 	let partCliente = "";
// 	let partPedido = "";

// 	if (caja != '') {
// 		partCaja = `AND caja = "${caja}" AND id_mesa = 0`

// 	}
// 	if (id_cliente != 1) {///
// 		partCliente = `AND id_cliente = "${id_cliente}"`

// 	} 
	
// 	if (id_cliente == 1) {
// 		console.log("cliente igual a 1 --->", id_cliente)
// 		partCliente = `AND id_cliente = ${id_cliente}`
// 	}

// 	if (numero_pedido != 0) {
// 		partPedido = `AND numero_pedido = ${numero_pedido} `

// 	}

// 	if (mesa != 0) {
// 		partMesa = `AND id_mesa = ${mesa} `
// 		partCliente = "";
// 	}
// //hasta aqui


	// console.log("el id_cliente ==>", id_cliente)
	// console.log("la caja ==>", caja)
	// console.log("la mesa ==>", mesa)
	// 	if (mesa != '') {
	// 		partMesa = `AND vt.id_mesa = ${mesa}`
	// 	}else{
	// 		if (id_empleado != '') {
	// 			partEmpleado = `AND vt.id_empleado = ${id_empleado}`
	// 		}

	// 		if (id_cliente != '1') {
	// 			partCliente = `AND vt.id_cliente = ${id_cliente} AND vt.id_mesa = '' AND vt.caja = ''`
	// 		}

	// 		// if (id_cliente != '') {
	// 		// 	partCliente = `AND vt.id_cliente = ${id_cliente}`
	// 		// }


	// 		if (caja != '') {
	// 			partCaja = `AND vt.caja = "${caja}"`
	// 		}

	// 		partMesa = `AND vt.id_mesa = ''`
	// 	}


	// let query = `
	// SELECT 
	// 	vt.id_empleado, 
	// 	vt.caja, 
	// 	vt.id_cliente, 
	// 	vt.cantidad, 
	// 	vt.id_unidad, 
	// 	vt.id_producto, 
	// 	p.codigo, 
	// 	p.descripcion, 
	// 	p.precio_compra, 
	// 	p.precio_detalle, 
	// 	p.precio_al_por_mayor, 
	// 	p.precio_especial, 
	// 	p.con_itbis, 
	// 	p.itbis, 
	// 	p.con_descuento, 
	// 	p.descuento 
	// FROM 
	// 	jr_detalle_venta_temporal vt
	// JOIN 
	// 	jr_productox p ON p.id_producto = vt.id_producto
	// WHERE 
	// 	vt.caja = "${caja}" 
	// 	OR (
	// 		vt.id_cliente = ${id_cliente}
	// 		AND NOT EXISTS (
	// 			SELECT 1 
	// 			FROM jr_detalle_venta_temporal 
	// 			WHERE caja = "${caja}"
	// 		)
	// 	);`;
	let query = `SELECT vt.id_empleado, vt.id_cliente, vt.caja, vt.id_mesa, vt.id_camarero, vt.cantidad, vt.id_unidad, vt.id_producto, p.codigo, p.descripcion, p.precio_compra, p.precio_detalle, p.precio_al_por_mayor, p.precio_especial, p.con_itbis, p.itbis, p.con_descuento, p.descuento FROM jr_detalle_venta_temporal vt, jr_productox p WHERE p.id_producto = vt.id_producto ${partPedido} ${partCaja} ${partCliente} ${partMesa}`;

	//let query = `SELECT vt.id_empleado, vt.id_cliente, vt.caja, vt.cantidad, vt.id_unidad, vt.id_producto, p.codigo, p.descripcion, p.precio_compra, p.precio_detalle, p.precio_al_por_mayor, p.precio_especial, p.con_itbis, p.itbis, p.con_descuento, p.descuento FROM jr_detalle_venta_temporal vt, jr_productox p WHERE p.id_producto = vt.id_producto AND vt.id_cliente = ${id_cliente}`;
	console.log("El query = ", query)
	localConnection.query(query, (error, producto) => {
		console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log("Productos actuales " + producto)
		resolve(producto);
	});
});


const consultaProductoCodigo = (codigo) => new Promise((resolve, reject) => {

	let query = "SELECT `factor_conversion`, `id_producto`, `id_unidad`, `codigo_barras` FROM `jr_unidad_vs_producto` WHERE `codigo_barras` = ? ";
	localConnection.query(query, [codigo], (error, producto) => {
		// console.log(codigo);
		if (error) {
			reject(error);
			return;
		}
		resolve(producto);
	});
});


const consultaProductoPrecioCompra = (id_producto) => new Promise((resolve, reject) => {

	let query = "SELECT `precio_compra` FROM `jr_productox` WHERE id_producto = ?";
	localConnection.query(query, [id_producto], (error, producto) => {
		// console.log(codigo);
		if (error) {
			reject(error);
			return;
		}
		resolve(producto);
	});
});

const consultaUnidadProductoID = (id_unidad, id_producto) => new Promise((resolve, reject) => {
	let values = [id_unidad, id_producto];
	let query = "SELECT `factor_conversion`, `id_producto`, `id_unidad`, `codigo_barras` FROM `jr_unidad_vs_producto` WHERE `id_unidad` = ? AND `id_producto` = ?";
	localConnection.query(query, values, (error, producto) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(producto);
	});
});
// const consultaProductoCodigoAlmacenCantidad = (codigo, almacen, cantidad) => new Promise((resolve, reject) => {
// 	let values = [codigo, almacen, cantidad];
// 	console.log("entro values ==============>" + values)
// 	let query = `SELECT p.id_producto, p.codigo, p.descripcion, p.referencia, p.factor_conversion, p.existencia, p.precio_compra, p.precio_detalle, p.precio_al_por_mayor, p.precio_especial, p.con_itbis, p.itbis, p.con_descuento, p.descuento, p.margen_ganancia, p.cantidad_minima, p.cantidad_maxima, p.ubicacion, p.color, p.id_estado, p.idmarca, p.idcategoria, p.id_clase, pa.existencia AS existencia_almacen, pa.ubicacion, pa.id_producto, pa.id_almacen FROM jr_productox p, jr_producto_almacen pa WHERE p.id_producto = pa.id_producto AND p.codigo = ? AND pa.id_almacen = ? AND pa.existencia >= ? `;
// 	//

// 	localConnection.query(query, values, (error, producto) => {
// 		// console.log(error);
// 		if (error) {
// 			reject(error);
// 			return;
// 		}
// 		// console.log(rows)
// 		resolve(producto);
// 	});
// });

const consultaProductoIdAlmacenCantidad = (id_producto, almacen, cantidad) => new Promise((resolve, reject) => {
	let values = [id_producto, almacen, cantidad];
	let query = `SELECT p.id_producto, p.codigo, p.descripcion, p.referencia, p.factor_conversion, p.existencia, p.precio_compra, p.precio_detalle, p.precio_al_por_mayor, p.precio_especial, p.con_itbis, p.itbis, p.con_descuento, p.descuento, p.margen_ganancia, p.cantidad_minima, p.cantidad_maxima, p.ubicacion, p.color, p.id_estado, p.idmarca, p.idcategoria, p.id_clase, pa.existencia, pa.ubicacion, pa.id_producto, pa.id_almacen FROM jr_productox p, jr_producto_almacen pa WHERE p.id_producto = pa.id_producto AND pa.id_producto = ? AND pa.id_almacen = ? AND pa.existencia >= ? `;
	//

	localConnection.query(query, values, (error, producto) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(producto);
	});
});

const guardarProductoVentaTemporal = (id_empleado, id_cliente, cantidad, id_unidad, id_producto, suma, existencia_almacen, caja, mesa, id_camarero, numero_pedido) => new Promise((resolve, reject) => {
	console.log(`Muestro el detalle caja ====== ${caja}`)
	console.log(`Muestro el detalle mesa ====== ${mesa}`)
	console.log(`Muestro el detalle Cliente ====== ${id_cliente}`)
	console.log(`Muestro el detalle numero de pedido ====== ${numero_pedido}`)

	let partCaja = ""
	let partMesa = ""
	let partCliente = "";
	let partPedido = "";

	if (caja != '') {
		partCaja = `AND caja = "${caja}"`

	}
	if (id_cliente != 1) {///
		partCliente = `AND id_cliente = "${id_cliente}"`

	} 
	if (mesa) {
		partMesa = `AND id_mesa = ${mesa} `

	}
	if (id_cliente == 1) {
		numero_pedido = 0;
		console.log("cliente igual a 1 --->", id_cliente)
		partCliente = `AND id_cliente = ${id_cliente}`
	}
	

	let query = `SELECT id_empleado, id_cliente, caja, id_mesa, id_camarero, precio_venta, cantidad, id_unidad, id_producto FROM jr_detalle_venta_temporal WHERE id_producto = ${id_producto} AND id_unidad = ${id_unidad} AND numero_pedido = ${numero_pedido} ${partCaja} ${partCliente} ${partMesa}`;
	console.log("Muestro mi query a guardar ==> ", query)
	localConnection.query(query, (error, detalle_temp) => {
		if (error) {
			reject(error);
			return;
		}
		console.log(`Muestro el detalle temporal ====== ${detalle_temp}`)
		console.log(`Muestro el detalle temporal ====== ${JSON.stringify(detalle_temp)}`)
		console.log(`Muestro el tipo de dato ====== ${typeof(detalle_temp)} y el length  ${detalle_temp.length}`)
		if (detalle_temp.length === 0) {
			console.log('le toca insertar' + numero_pedido)
	
			if (cantidad <= existencia_almacen) {
	
				query = 'INSERT INTO jr_detalle_venta_temporal (id_empleado, id_cliente, caja, id_mesa, id_camarero, cantidad, id_unidad, id_producto, numero_pedido) VALUES ( ? )';
				const values = [id_empleado, id_cliente, caja, mesa, id_camarero, cantidad, id_unidad, id_producto, numero_pedido];
				localConnection.query(query, [values], (error, insertados) => {
					if (error) {
						console.log(error)
						reject(error);
						return;
					}
					// console.log("Producto guardado correctamente");
					resolve("Producto guardado correctamente");
				});
			} else {
				console.log("Solo quedan disponible " + existencia_almacen + " en éste almacen");
				resolve("Solo quedan disponible " + existencia_almacen + "en éste almacen");
			}


		} else {
			if (detalle_temp[0].id_camarero != id_camarero && id_camarero != 0) {
				console.log(`aqui haria el cambio de camarero de ${detalle_temp[0].id_camarero} a ${id_camarero}`)
			}
			console.log('le toca actualizar '+ JSON.stringify(detalle_temp))
			query = `UPDATE jr_detalle_venta_temporal SET id_empleado = ?, id_cliente = ?, caja = ?, cantidad = ?, id_unidad = ? WHERE id_producto = ? AND id_unidad = ? AND numero_pedido = ${numero_pedido} ${partCaja} ${partCliente} ${partMesa}`;
			if (suma == 1) {
				cantidad = Number(cantidad) + Number(detalle_temp[0].cantidad);
			}
			
			if (cantidad <= existencia_almacen) {

				const values = [id_empleado, id_cliente, caja, cantidad, id_unidad, id_producto, id_unidad];
				console.log("Values update ===> ", values)
				localConnection.query(query, values, (error, insertados) => {
					console.log("QUERY ACTUALIZADO ===> ", query)
					if (error) {
						reject(error);
						return;
					}
					console.log('Producto actualizado correctamente');
					resolve('Producto actualizado correctamente');
				});
			} else {
				console.log("Solo quedan disponible Update " + existencia_almacen + " en éste almacen");
				resolve(`Solo quedan disponible ${existencia_almacen} en éste almacen`);
			}
		}
	});
});


const editarUnidadProductoCliente = (id_producto, id_unidad, id_cliente) => new Promise((resolve, reject) => {

	let query = 'UPDATE jr_detalle_venta_temporal SET id_unidad = ? WHERE id_producto = ? AND id_cliente = ?';
	const values = [id_unidad, id_producto, id_cliente];
	console.log(values)
	localConnection.query(query, values, (error, insertados) => {
		if (error) {
			reject(error);
			return;
		}
		resolve('Producto actualizado correctamente');
	});
});

const editarCantidadProductoCliente = (id_producto, id_unidad, cantidad, id_empleado, id_cliente, caja, mesa, numero_pedido) => new Promise((resolve, reject) => {

	// console.log(`Muestro el detalle caja ====== ${caja}`)
	// console.log(`Muestro el detalle mesa ====== ${mesa}`)
	// console.log(`Muestro el detalle Cliente ====== ${id_cliente}`)

	// let partCaja = ""

	// if (mesa == '0' && id_cliente == 1) { //Consulta la caja el cliente que no tiene mesa
	// 	partCaja = `AND caja = "${caja}" AND id_cliente = 1 AND id_mesa = 0`;
	// 	console.log("Consulta la caja el cliente que no tiene mesa --->", id_cliente, mesa)

	// } else if (mesa != '0' && id_cliente == 1) {  // Consulta la mesa sin cliente
	// 	partCaja = `AND id_mesa = ${mesa}  AND id_cliente = 1`;
	// 	console.log("Consulta la mesa sin cliente --->", id_cliente, mesa)

	// }else if (id_cliente != 1) { //consulta el cliente
	// 	console.log("consulta el cliente distinto de 1 --->", id_cliente)
	// 	partCaja = `AND id_cliente = ${id_cliente} AND id_mesa = 0`
	// }

	console.log(`Muestro el detalle caja ====== ${caja}`)
	console.log(`Muestro el detalle mesa ====== ${mesa}`)
	console.log(`Muestro el detalle Cliente ====== ${id_cliente}`)
	console.log(`Muestro el detalle numero de pedido ====== ${numero_pedido}`)

	let partCaja = ""
	let partMesa = ""
	let partCliente = "";
	let partPedido = "";

	// if (caja != '') {
		partCaja = `AND caja = "${caja}"`

	// }
	// if (id_cliente != 1) {///
		partCliente = `AND id_cliente = "${id_cliente}"`

	// } 
	// if (mesa) {
		partMesa = `AND id_mesa = ${mesa} `

	// }
	// if (id_cliente == 1) {
	// 	numero_pedido = 0;
	// 	console.log("cliente igual a 1 --->", id_cliente)
	// 	partCliente = `AND id_cliente = ${id_cliente}`
	// }

	let query = `SELECT id_empleado, id_cliente, cantidad, id_producto FROM jr_detalle_venta_temporal WHERE id_producto = ${id_producto} AND id_unidad = ${id_unidad} AND numero_pedido = ${numero_pedido} ${partCaja} ${partCliente} ${partMesa}`;
	localConnection.query(query, (error, detalle_temp) => {
		if (error) {
			reject(error);
			return;
		}

		console.log("Trae datos ", JSON.stringify(detalle_temp))
		if (detalle_temp.length != 0) {

			query = `UPDATE jr_detalle_venta_temporal SET cantidad = ? WHERE id_producto = ? AND id_unidad = ? AND numero_pedido = ${numero_pedido} ${partCaja} ${partCliente} ${partMesa}`;
			// cantidad = Number(cantidad);
			// const descuentoTotal = (precio_venta * descuento / 100) * cantidad;
			// const itbisTotal = (precio_venta * itbis / 100) * cantidad;
			// const importe = (precio_venta * cantidad) - descuentoTotal + itbisTotal;

			const values = [cantidad, id_producto, id_unidad];

			localConnection.query(query, values, (error, insertados) => {
				if (error) {
					reject(error);
					return;
				}
				console.log("Se inserto ", insertados)
				resolve('Producto actualizado correctamente');
			});
		}
	});
});

const guardarClienteBasico = (values) => new Promise((resolve, reject) => {
	console.log(values)
	let query = 'INSERT INTO `jr_cliente`(`nombres`, `apellidos`, `rnc`, `cedula`, `id_registradopor`, `celular`, `correo`, `id_empresa`, `id_sucursal`, `id_cartera`, `id_estado`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve(insertado.insertId);
	});
});


const cambiarCliente = (id_cliente_nuevo, id_cliente, caja, pedido_abierto, pedido_nuevo, lamesa) => new Promise((resolve, reject) => {
	console.log("muestro el id_cliente_nuevo ===>", id_cliente_nuevo)
	console.log("muestro el id_cliente abierto ===>", id_cliente)
	console.log("muestro el caja ===>", caja)
	console.log("muestro el pedido_abierto ===>", pedido_abierto)
	console.log("muestro el pedido_nuevo ===>", pedido_nuevo)
	
	let partCaja = '';
	if(id_cliente == 1){
		partCaja = `AND caja = ${caja}`;
	}
	let partMesa = '';
	if(lamesa > 0){
		partMesa = `AND id_mesa = ${lamesa}`;
	}


						console.log("valores de los pedidos " + pedido_abierto, pedido_nuevo);
						let valen = [id_cliente, pedido_abierto, id_cliente_nuevo, pedido_nuevo]
						console.log(valen)
						localConnection.query(
							`SELECT id_empleado, id_cliente, caja, id_mesa, id_camarero, id_unidad, id_producto, SUM(cantidad) as cantidad_total FROM jr_detalle_venta_temporal WHERE (id_cliente = ? AND numero_pedido = ? AND id_mesa = ?) OR (id_cliente = ? AND numero_pedido = ? AND id_mesa = ? ${partCaja}) ${partMesa} GROUP BY id_producto, id_unidad`,
							[id_cliente, pedido_abierto, lamesa, id_cliente_nuevo, pedido_nuevo, lamesa],
							function (error, result) {
								if (error) {
									console.log("muestro el error ===>", error);
									reject(error);
									return;
								}
						
								const datosNuevos = result;
								let id_mesa = 0;
								let id_camarero = 0;
								localConnection.query(
									// 'SELECT id_mesa, id_camarero FROM jr_detalle_venta_temporal WHERE id_mesa >0 AND id_cliente = ? AND numero_pedido = ? GROUP BY id_mesa',
									`SELECT id_mesa, id_camarero FROM jr_detalle_venta_temporal WHERE id_cliente = ? ${partMesa} AND numero_pedido = ? GROUP BY id_mesa`,
									[id_cliente, pedido_abierto],
									function(error, mesa_camarero_abierta) {
										if (error) {
											console.log("muestro el error ===>", error)
											reject(error);
									return;
										}
										id_mesa = mesa_camarero_abierta[0]?mesa_camarero_abierta[0].id_mesa:0;
										id_camarero = mesa_camarero_abierta[0]?mesa_camarero_abierta[0].id_camarero:0;
								localConnection.query(
									`DELETE FROM jr_detalle_venta_temporal WHERE id_cliente = ? AND numero_pedido = ? ${partMesa}`,
									[id_cliente, pedido_abierto],
									function(error, updateResult) {
										if (error) {
											console.log("muestro el error ===>", error)
											reject(error);
									return;
										}
								localConnection.query(
									`DELETE FROM jr_detalle_venta_temporal WHERE id_cliente = ? AND numero_pedido = ? ${partMesa}`,
									[id_cliente_nuevo, pedido_nuevo],
									function (error, deleteResult) {
										console.log("muestro el resulta delete ===>", deleteResult);
										if (error) {
											console.log("muestro el error ===>", error);
											reject(error);
											return;
										}
						
										const insertQueries = datosNuevos.map(nuevoDato => [
											pedido_nuevo,
											nuevoDato.id_empleado,
											id_cliente_nuevo,// aqui va el cliente nuevo
											nuevoDato.caja,
											nuevoDato.id_mesa > 0? nuevoDato.id_mesa:id_mesa,
											nuevoDato.id_camarero > 0? nuevoDato.id_camarero:id_camarero,
											nuevoDato.id_unidad,
											nuevoDato.id_producto,
											nuevoDato.cantidad_total
										]);
						
										localConnection.query(
											'INSERT INTO jr_detalle_venta_temporal (numero_pedido, id_empleado, id_cliente, caja, id_mesa, id_camarero, id_unidad, id_producto, cantidad) VALUES ?',
											[insertQueries],
											function (error, insertResult) {
												console.log("insert ===>", insertResult);
												if (error) {
													console.log("muestro el error ===>", error);
													reject(error);
													return;
												}
												resolve(insertResult);
											});
									});
							});
						});
					});

});


// let values = [id_cliente_nuevo, id_cliente];
// let query = 'UPDATE jr_detalle_venta_temporal SET id_cliente = ? WHERE id_cliente = ? AND id_mesa = 0';

// if (id_cliente == 1) {
// 	values = [id_cliente_nuevo, caja];
// 	query = 'UPDATE jr_detalle_venta_temporal SET id_cliente = ? WHERE caja = ? AND id_cliente = 1 AND id_mesa = 0';
// }

// console.log("el otro query ", query)

const eliminarProductoAlCliente = (id_producto, id_cliente, id_unidad, mesa, caja, numero_pedido) => new Promise((resolve, reject) => {

	let values = [id_producto, id_unidad, numero_pedido, id_cliente, mesa];
	console.log("entro a eliminar producto a cliente " + values)
	console.log(`Muestro el detalle caja ====== ${caja}`)
	console.log(`Muestro el detalle mesa ====== ${mesa}`)
	console.log(`Muestro el detalle Cliente ====== ${id_cliente}`)

	// let partCaja = ""

	// if (mesa == '0' && id_cliente == 1) { //Consulta la caja el cliente que no tiene mesa
	// 	partCaja = `AND caja = "${caja}" AND id_cliente = 1 AND id_mesa = 0`;
	// 	console.log("Consulta la caja el cliente que no tiene mesa --->", id_cliente, mesa)

	// } else if (mesa != '0' && id_cliente == 1) {  // Consulta la mesa sin cliente
	// 	partCaja = `AND id_mesa = ${mesa}  AND id_cliente = 1`;
	// 	console.log("Consulta la mesa sin cliente --->", id_cliente, mesa)

	// }else if (id_cliente != 1) { //consulta el cliente
	// 	console.log("consulta el cliente distinto de 1 --->", id_cliente)
	// 	partCaja = `AND id_cliente = ${id_cliente} AND id_mesa = 0`
	// }

	let partCaja = ""
	let partMesa = ""
	let partCliente = "";
	let partPedido = "";

	// if (caja != '') {
	// 	partCaja = `AND caja = "${caja}"`

	// }
	// if (id_cliente != 1) {///
	// 	partCliente = `AND id_cliente = "${id_cliente}"`

	// } 
	// if (mesa) {
	// 	partMesa = `AND id_mesa = ${mesa} `

	// }
	// if (id_cliente == 1) {
	// 	numero_pedido = 0;
	// 	console.log("cliente igual a 1 --->", id_cliente)
	// 	partCliente = `AND id_cliente = ${id_cliente}`
	// }
	

	
	let query = `DELETE FROM jr_detalle_venta_temporal WHERE id_producto = ? AND id_unidad = ? AND numero_pedido = ? AND id_cliente = ? AND id_mesa = ?`;// ${partCaja} ${partCliente} ${partMesa}`;
	localConnection.query(query, values, (error, detalle_temp) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		// console.log(detalle_temp)
		resolve(detalle_temp);
	});
});

const list = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_empresa`';

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



const consultaSecuenciaComprobante = (codncf) => new Promise((resolve, reject) => {
	// let values = [fecha, almacen, cantidad];
	let query = `SELECT id_sucursal, fecncf, vigencia_desde, vigencia_hasta, fecha_uso, secncf, estncf, codncf FROM jr_secuencia WHERE estncf = 'Disponible' AND vigencia_desde <= NOW() AND vigencia_hasta >= NOW() AND codncf = ? ORDER BY secncf ASC LIMIT 1`;
	//
	localConnection.query(query, codncf, (error, secuencia) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(secuencia);
	});
});

const actualizarSecuenciaComprobante = (id_sucursal, secncf, codncf) => new Promise((resolve, reject) => {
	// id_sucursal, secuencia[0].secncf, codncf
	let values = [id_sucursal, secncf, codncf];
	// console.log("Actualiza secuencia de comprobante " + values)

	let query = 'UPDATE `jr_secuencia` SET `id_sucursal`=?,`fecha_uso`=NOW(),`estncf`="Usado" WHERE `secncf`= ? AND `codncf`= ?';
	localConnection.query(query, values, (error, detalle_temp) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(detalle_temp);
	});
});



const actualizarNotaDeCredito = (id_venta, id_devolucion, montoDeLaNota) => new Promise((resolve, reject) => {

	let values = [id_venta, id_devolucion, montoDeLaNota];

	let query = 'UPDATE `jr_devolucion` SET `estatus`="No disponible", `condicion`="Usada", `usada_en_venta`= ? WHERE `id_devolucion`=? AND `total_importe`=?';
	localConnection.query(query, values, (error, detalle_temp) => {
		if (error) {
			reject(error);
			return;
		}
		resolve(detalle_temp);
	});
});


const guardarVentaProcesada = (values) => new Promise((resolve, reject) => {
	// console.log(values)
	let query = 'INSERT INTO `jr_venta`(`id_caja`, `id_caja_detalle`, `id_turno`, `id_supervisor`, `id_empresa`, `id_sucursal`,`id_empleado`, `id_cliente`, `id_mesa`, `mesa`, `id_camarero`, `subtotal`, `total_itbis`, `total_descuento`, `monto_servicio`, `total_importe`, `secncf`, `comprobante`, `fecha_vencimiento`, `tarjeta_debito`, `tarjeta_credito`, `cheque`, `nota_credito`, `monto_nota`, `bono`, `efectivo`, `devolver`, `cuenta_por_cobrar`, `comentario`, `condicion`, `estatusventa`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve(insertado.insertId);
	});
});


const eliminarVentaTemporal = (id_cliente, numero_pedido, caja, id_mesa) => new Promise((resolve, reject) => {
	let partCaja = '';
	if(id_cliente ==1 && numero_pedido ==0){
		partCaja = `AND caja = ${caja}`
	}
	// let partMesa = '';
	// if(id_mesa> 0){
	// 	partMesa = `${id_mesa}`
	// }
	let values = [id_cliente, numero_pedido, id_mesa];
	// console.log("entro a eliminar ventaTemporal a cliente " + values)

	let query = `DELETE FROM jr_detalle_venta_temporal WHERE id_cliente = ? AND numero_pedido = ? AND id_mesa = ? ${partCaja} `;
	localConnection.query(query, values, (error, detalle_temp) => {
		if (error) {
			console.log('los errores eliminando ======> ',error)
			reject(error);
			return;
		}
		console.log(detalle_temp)
		resolve(detalle_temp);
	});
});


const guardarProductoVenta = (values) => new Promise((resolve, reject) => {
	// console.log(values)
	let query = 'INSERT INTO `jr_detalle_venta`(`descuento`, `precio_venta`, `cantidad`, `cantidad_pendiente`, `id_unidad`, `itbis`, `importe`, `id_producto`, `precio_compra`, `costo`, `id_venta`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve(insertado.insertId);
	});
});

const actualizaProductoAlmacenVenta = (values) => new Promise((resolve, reject) => {
	let query = 'UPDATE `jr_producto_almacen` SET `existencia`=? WHERE `id_almacen` = ? AND `id_producto`= ?';

	localConnection.query(query, values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Producto actualizado correctamente');
	});
});


const actualizaPrecioDeCostoTotalVenta = (values) => new Promise((resolve, reject) => {
	let query = 'UPDATE `jr_venta` SET `total_costo`= ? WHERE `id_venta`= ?';

	localConnection.query(query, values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Producto actualizado correctamente');
	});
});

const buscarDescripcionUnidad = (id_unidad) => new Promise((resolve, reject) => {
	// let values = [fecha, almacen, cantidad];
	let query = `SELECT unidad FROM jr_unidad_producto WHERE id_unidad = ? LIMIT 1`;
	//
	localConnection.query(query, id_unidad, (error, unidad) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(unidad);
	});
});

const producto_list = (valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = ["%" + valor + "%", "%" + valor + "%", "%" + valor + "%"];

	if (valor === "aaaaaaaaaaaa") {
		valor = "";
	}
	let script = "";

	if (inicio !== false && nunreg !== false) {
		script = `SELECT px.id_producto, px.codigo, px.descripcion, px.referencia, px.factor_conversion, (SELECT existencia FROM jr_producto_almacen WHERE id_producto = px.id_producto AND id_almacen = 1) AS existencia, px.precio_compra, px.precio_detalle, px.precio_al_por_mayor, px.precio_especial, px.itbis, px.descuento, px.margen_ganancia, px.cantidad_minima, px.cantidad_maxima, px.ubicacion, px.color, px.id_estado, px.idmarca, (SELECT nombre FROM jr_marca WHERE id_marca = px.idmarca) AS marca, px.idcategoria, (SELECT nombre FROM jr_categoria_articulo WHERE id_categoria = px.idcategoria) AS categoria, px.id_clase, (SELECT nombre FROM jr_clase WHERE id_clase = px.id_clase) AS clase FROM jr_productox px WHERE px.codigo like ? OR px.descripcion like ? OR px.referencia like ? ORDER BY px.descripcion ASC LIMIT ${inicio}, ${nunreg}`;

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


const consultaPedidoActual = (id_cliente, id_producto, id_unidad) => new Promise((resolve, reject) => {
	let values = [id_unidad, id_producto, id_cliente];
	let query = "SELECT `cantidad` FROM `jr_detalle_venta_temporal` WHERE  `id_unidad` = ? AND `id_producto` = ? AND  `id_cliente` = ?";
	localConnection.query(query, values, (error, producto) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(producto);
	});
});


const facturaList = (fecha_inicial, fecha_final, estado, valor, inicio = false, nunreg = false) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let valores = [fecha_inicial, fecha_final, estado, "%" + valor + "%", "%" + valor + "%", "%" + valor + "%", valor, valor, valor, valor, valor];
	// console.log('los valores son : ',valores)
	if (valor === "aaaaaaaaaaaa") {
		valor = "";
	}
	let script = "";

	if (inicio !== false && nunreg !== false) {
		script = `SELECT v.id_venta, LPAD(v.id_venta, 11, '0') AS factura, v.fecha, v.id_empleado, v.id_cliente, v.subtotal, v.total_itbis, v.total_descuento, v.monto_servicio, v.total_importe, v.secncf, v.fecha_vencimiento, v.tarjeta_debito, v.tarjeta_credito, v.cheque, v.nota_credito, v.monto_nota, v.bono, v.efectivo, v.devolver, v.cuenta_por_cobrar, v.comentario, v.condicion, v.estatusventa, CONCAT(c.nombres, " ", c.apellidos) AS cliente, c.rnc, c.cedula, c.celular, c.correo, CONCAT(e.nombres," ", e.apellidos) AS cajero, e.codigo FROM jr_venta v, jr_cliente c, jr_empleado e WHERE v.id_empleado = e.id_empleado AND v.id_cliente = c.id_cliente AND v.fecha >= ? AND v.fecha <= ? AND v.estatusventa= ? AND (LPAD(v.id_venta, 11, '0') LIKE ? OR CONCAT(c.nombres, " ", c.apellidos) LIKE ? OR CONCAT(e.nombres," ", e.apellidos) LIKE ? OR e.codigo = ? OR c.rnc = ? OR c.cedula = ? OR c.celular = ? OR c.correo = ?) ORDER BY v.id_venta DESC LIMIT ${inicio}, ${nunreg}`;

	} else {
		script = `SELECT COUNT(*) AS total FROM jr_venta v, jr_cliente c, jr_empleado e WHERE v.id_empleado = e.id_empleado AND v.id_cliente = c.id_cliente AND v.fecha >= ? AND v.fecha <= ? AND v.estatusventa= ? AND (LPAD(v.id_venta, 11, '0') LIKE ? OR CONCAT(c.nombres, " ", c.apellidos) LIKE ? OR CONCAT(e.nombres," ", e.apellidos) LIKE ? OR e.codigo = ? OR c.rnc = ? OR c.cedula = ? OR c.celular = ? OR c.correo = ?)`;
		//    values = [id, fecha_desde, fecha_hasta]
	}

	localConnection.query(script, valores, (error, scripts) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log('los scripts ',scripts)
		resolve(scripts);
	});
});


const buscarFactura = (valores) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let script = `SELECT v.id_venta, LPAD(v.id_venta, 11, '0') AS factura, v.fecha, v.id_empleado, v.id_cliente, v.id_mesa, v.mesa, v.id_camarero, v.subtotal, v.total_itbis, v.total_descuento, v.monto_servicio, v.total_importe, v.secncf, v.comprobante, v.fecha_vencimiento, v.tarjeta_debito, v.tarjeta_credito, v.cheque, v.nota_credito, v.monto_nota, v.bono, v.efectivo, v.devolver, v.cuenta_por_cobrar, v.comentario, v.condicion, v.estatusventa, CONCAT(c.nombres, " ", c.apellidos) AS cliente, c.rnc, c.cedula, c.celular, c.correo, CONCAT(e.nombres," ", e.apellidos) AS cajero, e.codigo, v.id_caja, (SELECT nombre FROM jr_caja WHERE id_caja = v.id_caja) AS caja FROM jr_venta v, jr_cliente c, jr_empleado e WHERE v.id_empleado = e.id_empleado AND v.id_cliente = c.id_cliente AND v.estatusventa = ? AND v.id_venta = ?`;

	localConnection.query(script, valores, (error, scripts) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log('el script FACTURA ====> ',scripts)
		resolve(scripts);
	});
});

const buscarDetalleFactura = (id_venta) => new Promise((resolve, reject) => {
	// Informacion del portador. descripcion, cantidad, launidad[0].unidad, precio/cantidad, itbis, importe
	let script = `SELECT p.descripcion, dv.cantidad, dv.cantidad_pendiente, dv.id_unidad, dv.precio_venta, dv.descuento, dv.itbis, dv.importe, dv.id_producto, dv.id_venta, p.codigo, dv.precio_compra FROM jr_detalle_venta dv, jr_productox p WHERE dv.id_producto = p.id_producto AND dv.id_venta = ?`;
	//let script = `SELECT dv.id_detalle_venta, dv.descuento, dv.precio_venta, dv.cantidad, dv.id_unidad, dv.itbis, dv.importe, dv.id_producto, dv.id_venta, p.codigo, p.descripcion, p.referencia, p.factor_conversion, p.existencia, p.precio_compra, p.precio_detalle, p.precio_al_por_mayor, p.precio_especial, p.con_itbis, p.itbis, p.con_descuento, p.descuento, p.margen_ganancia, p.cantidad_minima, p.cantidad_maxima, p.ubicacion, p.color, p.id_estado, p.idmarca, p.idcategoria, p.id_clase FROM jr_detalle_venta dv, jr_productox p WHERE dv.id_producto = p.id_producto AND dv.id_venta = ?`;
	// id_producto, codigo, descripcion, cantidad, unidad, descuento, itbis, precio, importe
	//SELECT `id_detalle_venta`, `descuento`, `precio_venta`, `cantidad`, `id_unidad`, ``, ``, `id_producto`, `id_venta` FROM `jr_detalle_venta` WHERE 1
	localConnection.query(script, id_venta, (error, scripts) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log('el script FACTURA ====> ',scripts)
		resolve(scripts);
	});
});

const verificaCajaAbierta = (id_empleado) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let script = `SELECT cd.id_caja_detalle, cd.id_caja, cd.id_turno, cd.id_cajero, cd.id_supervisor, cd.id_empresa, cd.id_sucursal, cd.id_almacen, cd.estado, cd.fecha_apertura, cd.fecha_cierre, cd.monto_inicial, cd.monto_final, cd.observaciones, cd.desglose, c.nombre, c.descripcion FROM jr_caja_detalle cd, jr_caja c WHERE c.id_caja = cd.id_caja AND cd.estado = 'abierta' AND cd.id_cajero =  ?`;

	localConnection.query(script, id_empleado, (error, scripts) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log('el script FACTURA ====> ',scripts)
		resolve(scripts);
	});
});


const desgloseEnCaja = (idCajaDetalle) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let script = "SELECT  SUM(`2000`) AS suma_2000, SUM(`1000`) AS suma_1000, SUM(`500`) AS suma_500, SUM(`200`) AS suma_200, SUM(`100`) AS suma_100, SUM(`50`) AS suma_50, SUM(`25`) AS suma_25, SUM(`10`) AS suma_10, SUM(`5`) AS suma_5, SUM(`1`) AS suma_1, SUM(`decimales`) AS suma_decimales FROM `jr_desglose_dinero` WHERE `id_caja_detalle` =   ?";

	localConnection.query(script, idCajaDetalle, (error, scripts) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log('el script FACTURA ====> ',scripts)
		resolve(scripts);
	});
});

let facturacionTotalEnCaja = (idCajaDetalle) => new Promise((resolve, reject) => {
	// Informacion del portador.
	idCajaDetalle = parseInt(idCajaDetalle)
	let script = `SELECT c.monto_inicial, SUM(v.total_itbis) AS suma_total_itbis, SUM(v.total_descuento) AS suma_total_descuento, SUM(v.tarjeta_debito) AS suma_tarjeta_debito, COUNT(CASE WHEN v.tarjeta_debito != 0 THEN v.tarjeta_debito END) AS cantidad_tarjeta_debito, SUM(v.tarjeta_credito) AS suma_tarjeta_credito, COUNT(CASE WHEN v.tarjeta_credito != 0 THEN v.tarjeta_credito END) AS cantidad_tarjeta_credito, SUM(v.cheque) AS suma_cheque, COUNT(CASE WHEN v.cheque != 0 THEN v.cheque END) AS cantidad_cheque, SUM(v.monto_nota) AS suma_monto_nota, COUNT(CASE WHEN v.monto_nota != 0 THEN v.monto_nota END) AS cantidad_monto_nota, SUM(v.bono) AS suma_bono, COUNT(CASE WHEN v.bono != 0 THEN v.bono END) AS cantidad_bono, SUM(v.efectivo) - SUM(v.devolver) AS suma_efectivo_neto, SUM(v.efectivo) AS suma_efectivo, SUM(v.devolver) AS suma_devolver, SUM(v.cuenta_por_cobrar) AS suma_cuenta_por_cobrar, COUNT(CASE WHEN v.cuenta_por_cobrar != 0 THEN v.cuenta_por_cobrar END) AS cantidad_cuenta_por_cobrar FROM jr_venta v JOIN jr_caja_detalle c ON c.id_caja_detalle = v.id_caja_detalle WHERE v.id_caja_detalle = ?`;

	localConnection.query(script, idCajaDetalle, (error, scripts) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log('el script FACTURA ====> ',scripts)
		resolve(scripts);
	});
});

const guardarDevolucion = (values) => new Promise((resolve, reject) => {
	// console.log(values)
	let query = 'INSERT INTO `jr_devolucion`(`id_empleado`, `id_cliente`, `subtotal`, `total_itbis`, `total_descuento`, `monto_servicio`, `total_importe`, `monto_en_letra`, `secncf_afectado`, `secncf_nota`, `fecha_vencimiento`, `comentario`, `condicion`, `estatus`, `id_venta`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve(insertado.insertId);
	});
});
const guardarDetalleDevolucion = (values) => new Promise((resolve, reject) => {
	// console.log(values)
	let query = 'INSERT INTO `jr_detalle_devolucion`(`importe`, `subtotal`, `precio_venta`, `descuento`, `itbis`, `cantidad`, `cantidad_devuelta`, `id_unidad`, `precio_compra`, `costo`, `id_devolucion`, `id_producto`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve(insertado.insertId);
	});
});


const restarCantidadPendienteAlProductoActualDeLaFactura = (values) => new Promise((resolve, reject) => {
	let query = 'UPDATE `jr_detalle_venta` SET `cantidad_pendiente`=`cantidad_pendiente` - ? WHERE `id_producto`=? AND `id_venta`=?';

	localConnection.query(query, values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Producto actualizado correctamente');
	});
});

const cambiarEstadoFactura = (values) => new Promise((resolve, reject) => {
	let query = 'UPDATE `jr_venta` SET `estatusventa`= ? WHERE `id_venta`= ?';

	localConnection.query(query, values, (error, insertados) => {

		if (error) {
			reject(error);
			return;
		}
		resolve('Producto actualizado correctamente');
	});
});


const consultaEmpleadoReporte = (empresa, sucursal, valor) => new Promise((resolve, reject) => {
	let values = [empresa, sucursal, "%" + valor + "%", "%" + valor + "%", "%" + valor + "%"];

	let querySelect = `SELECT DISTINCT cd.id_cajero, e.cedula, e.codigo, CONCAT(e.nombres, ' ', e.apellidos) AS cajero, pue.descripcion AS puesto, (SELECT descripcion FROM jr_departamento WHERE id_departamento = e.id_departamento) AS departamento, e.email_institucional  FROM jr_caja_detalle cd, jr_empleado e, jr_puesto pue WHERE e.id_puesto = pue.id_puesto AND cd.id_empresa =? AND cd.id_sucursal = ? AND cd.id_cajero = e.id_empleado AND (e.cedula like ? OR  e.codigo like ? OR concat(e.nombres," ", e.apellidos) like ?) GROUP BY cd.id_cajero ORDER BY CONCAT(e.nombres, ' ', e.apellidos) ASC`;
	localConnection.query(querySelect, values, (error, producto) => {
		console.log(values);
		if (error) {
			// console.log('Hay error ====> ',error)
			reject(error);
			return;
		}
		// console.log('el script FACTURA ====> ',querySelect)
		resolve(producto);
	});
});


const consultaCajaReporte = (empresa, sucursal) => new Promise((resolve, reject) => {
	let values = [empresa, sucursal];
	let query = "SELECT DISTINCT cd.`id_caja`, c.`nombre` AS caja, c.`descripcion` FROM `jr_caja_detalle` cd, `jr_caja` c WHERE cd.`id_empresa` =1 AND cd.`id_sucursal` = 1 AND cd.`id_caja` = c.`id_caja`  GROUP BY cd.`id_caja` ORDER by c.`nombre` ASC";
	localConnection.query(query, values, (error, producto) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(producto);
	});
});


const consultaTurnoReporte = (empresa, sucursal) => new Promise((resolve, reject) => {
	let values = [empresa, sucursal];
	let query = "SELECT DISTINCT cd.`id_turno` AS turno FROM `jr_caja_detalle` cd, `jr_caja` c WHERE cd.`id_empresa` =1 AND cd.`id_sucursal` = 1 AND cd.`id_caja` = c.`id_caja` GROUP BY cd.`id_turno` ORDER by cd.`id_turno` ASC";
	localConnection.query(query, values, (error, producto) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(producto);
	});
});



const consultaSucursales = (empresa) => new Promise((resolve, reject) => {
	let values = [empresa];
	let query = "SELECT s.id_sucursal, s.nombre_sucursal, ng.razon_social FROM jr_sucursal s, jr_negocio_general ng WHERE  s.id_negocio = ng.id_negocio AND s.id_negocio = ? ORDER BY s.nombre_sucursal ASC";
	localConnection.query(query, values, (error, sucursales) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(sucursales);
	});
});



const filtroReporte = (sucursal, fechaInicial, fechaFinal, estadoFactura, condicionVenta, idEmpleado, caja, turno, idUnidadProducto, idProducto, idCliente, rncCliente) => new Promise((resolve, reject) => {
	// console.log(sucursal)
	let partEstadoFactura = "";
	let partCondicionVenta = "";
	let partEmpleado = "";
	let partCaja = "";
	let partTurno = "";
	let partProducto = "";
	let partCliente = "";

	if (estadoFactura != '') {
		partEstadoFactura = `AND v.estatusventa = "${estadoFactura}"`
	}

	if (condicionVenta != '') {
		partCondicionVenta = `AND v.condicion = "${condicionVenta}"`
	}

	if (idEmpleado != '') {
		partEmpleado = `AND v.id_empleado = ${idEmpleado}`
	}

	if (caja != '') {
		partCaja = `AND v.id_caja = ${caja}`
	}

	if (turno != '') {
		partTurno = `AND v.id_turno = ${turno}`
	}

	if (idProducto != '') {
		partProducto = `AND dv.id_producto = ${idProducto} AND dv.id_unidad = ${idUnidadProducto} `
	}

	if (idCliente != '') {
		partCliente = `AND v.id_cliente = ${idCliente}`
	}
	let query = `SELECT
    v.id_venta,
    v.fecha,
    v.id_cliente,
    c.nombres AS nombre_cliente,
    v.id_empleado,
    e.nombres AS nombre_empleado,
    s.id_sucursal,
    s.nombre_sucursal AS nombre_sucursal,
    v.id_caja,
    ca.nombre AS nombre_caja,
    v.id_turno,
    v.secncf,
    v.comprobante,
    v.fecha_vencimiento,
    v.tarjeta_debito,
    v.tarjeta_credito,
    v.cheque,
    v.nota_credito,
    v.monto_nota,
    v.bono,
    v.efectivo,
    v.devolver,
    v.cuenta_por_cobrar,
    v.comentario,
    v.condicion,
    v.estatusventa,
    dv.id_producto,
    p.descripcion AS descripcion_producto,
    dv.cantidad,
    dv.precio_venta,
    dv.descuento,
    dv.itbis,
    dv.importe,
    dv.precio_compra,
    dv.costo,
    dv.cantidad_pendiente,
    dv.id_unidad,
    u.unidad AS unidad_producto,
    ((dv.precio_venta - dv.costo - dv.descuento)) AS ganancia,
    up.factor_conversion,
    up.codigo_barras
FROM
    jr_venta v
JOIN
    jr_detalle_venta dv ON v.id_venta = dv.id_venta
JOIN
    jr_cliente c ON v.id_cliente = c.id_cliente
JOIN
    jr_empleado e ON v.id_empleado = e.id_empleado
JOIN
    jr_sucursal s ON v.id_sucursal = s.id_sucursal
JOIN
    jr_caja ca ON v.id_caja = ca.id_caja
JOIN
    jr_productox p ON dv.id_producto = p.id_producto
JOIN
    jr_unidad_producto u ON dv.id_unidad = u.id_unidad
LEFT JOIN
    jr_unidad_vs_producto up ON dv.id_producto = up.id_producto AND dv.id_unidad = up.id_unidad
WHERE 
	v.id_sucursal = ? AND v.fecha >= ? AND v.fecha <= v.fecha ${partEstadoFactura} ${partCondicionVenta} ${partEmpleado} ${partCaja} ${partTurno} ${partProducto} ${partCliente}`;
	localConnection.query(query, [sucursal, fechaInicial, fechaFinal], (error, resultados) => {
		console.log(query);
		if (error) {
			console.log(error);
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(resultados);
	});
});



const filtroReporteTiposDePago = (sucursal, fechaInicial, fechaFinal, estadoFactura, condicionVenta, idEmpleado, caja, turno, idUnidadProducto, idProducto, idCliente, rncCliente) => new Promise((resolve, reject) => {
	// console.log(sucursal)
	let partEstadoFactura = "";
	let partCondicionVenta = "";
	let partEmpleado = "";
	let partCaja = "";
	let partTurno = "";
	let partProducto = "";
	let partCliente = "";

	if (estadoFactura != '') {
		partEstadoFactura = `AND v.estatusventa = "${estadoFactura}"`
	}

	if (condicionVenta != '') {
		partCondicionVenta = `AND v.condicion = "${condicionVenta}"`
	}

	if (idEmpleado != '') {
		partEmpleado = `AND v.id_empleado = ${idEmpleado}`
	}

	if (caja != '') {
		partCaja = `AND v.id_caja = ${caja}`
	}

	if (turno != '') {
		partTurno = `AND v.id_turno = ${turno}`
	}

	if (idProducto != '') {
		partProducto = `AND dv.id_producto = ${idProducto} AND dv.id_unidad = ${idUnidadProducto} `
	}

	if (idCliente != '') {
		partCliente = `AND v.id_cliente = ${idCliente}`
	}

	//let script = `SELECT c.monto_inicial, SUM(v.total_itbis) AS suma_total_itbis, SUM(v.total_descuento) AS suma_total_descuento, SUM(v.tarjeta_debito) AS suma_tarjeta_debito, COUNT(CASE WHEN v.tarjeta_debito != 0 THEN v.tarjeta_debito END) AS cantidad_tarjeta_debito, SUM(v.tarjeta_credito) AS suma_tarjeta_credito, COUNT(CASE WHEN v.tarjeta_credito != 0 THEN v.tarjeta_credito END) AS cantidad_tarjeta_credito, SUM(v.cheque) AS suma_cheque, COUNT(CASE WHEN v.cheque != 0 THEN v.cheque END) AS cantidad_cheque, SUM(v.monto_nota) AS suma_monto_nota, COUNT(CASE WHEN v.monto_nota != 0 THEN v.monto_nota END) AS cantidad_monto_nota, SUM(v.bono) AS suma_bono, COUNT(CASE WHEN v.bono != 0 THEN v.bono END) AS cantidad_bono, SUM(v.efectivo) - SUM(v.devolver) AS suma_efectivo_neto, SUM(v.efectivo) AS suma_efectivo, SUM(v.devolver) AS suma_devolver, SUM(v.cuenta_por_cobrar) AS suma_cuenta_por_cobrar, COUNT(CASE WHEN v.cuenta_por_cobrar != 0 THEN v.cuenta_por_cobrar END) AS cantidad_cuenta_por_cobrar FROM jr_venta v JOIN jr_caja_detalle c ON c.id_caja_detalle = v.id_caja_detalle WHERE v.id_caja_detalle = ?`;

	let query = `SELECT DISTINCT
    SUM(v.tarjeta_debito) AS suma_tarjeta_debito, COUNT(CASE WHEN v.tarjeta_debito != 0 THEN v.tarjeta_debito END) AS cantidad_tarjeta_debito,
	SUM(v.tarjeta_credito) AS suma_tarjeta_credito, COUNT(CASE WHEN v.tarjeta_credito != 0 THEN v.tarjeta_credito END) AS cantidad_tarjeta_credito,
	SUM(v.cheque) AS suma_cheque, COUNT(CASE WHEN v.cheque != 0 THEN v.cheque END) AS cantidad_cheque,
	SUM(v.monto_nota) AS suma_monto_nota, COUNT(CASE WHEN v.monto_nota != 0 THEN v.monto_nota END) AS cantidad_monto_nota,
	SUM(v.bono) AS suma_bono, COUNT(CASE WHEN v.bono != 0 THEN v.bono END) AS cantidad_bono,
    SUM(v.efectivo) - SUM(v.devolver) AS suma_efectivo_neto, SUM(v.efectivo) AS suma_efectivo,
    SUM(v.devolver) AS suma_devolver,
	SUM(v.cuenta_por_cobrar) AS suma_cuenta_por_cobrar, COUNT(CASE WHEN v.cuenta_por_cobrar != 0 THEN v.cuenta_por_cobrar END) AS cantidad_cuenta_por_cobrar  
FROM
    jr_venta v
JOIN
    jr_cliente c ON v.id_cliente = c.id_cliente
JOIN
    jr_empleado e ON v.id_empleado = e.id_empleado
JOIN
    jr_sucursal s ON v.id_sucursal = s.id_sucursal
JOIN
    jr_caja ca ON v.id_caja = ca.id_caja
WHERE 
	v.id_sucursal = ? AND v.fecha >= ? AND v.fecha <= v.fecha ${partEstadoFactura} ${partCondicionVenta} ${partEmpleado} ${partCaja} ${partTurno} ${partCliente}`;
	localConnection.query(query, [sucursal, fechaInicial, fechaFinal], (error, resultados) => {
		// console.log(query);
		if (error) {
			console.log(error);
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(resultados);
	});
});

const consultaNotaDeCreditosNoVencidasALaFechaEnVenta = (fecha, secncf_afectado, secncf_nota, numeroDeNota) => new Promise((resolve, reject) => {
	// Informacion del portador.
	let values = [fecha, secncf_afectado, secncf_nota, numeroDeNota]
	let query = `SELECT
    IFNULL(
        (
            SELECT
                CASE
					WHEN fecha_vencimiento < CURDATE() AND estatus = 'Disponible' THEN 'Nota de credito vencida!'
					WHEN condicion = 'Usada' AND estatus = 'No disponible' THEN 'Nota de credito usada!'
					WHEN estatus = 'Disponible' THEN total_importe
                END
            FROM jr_devolucion
            WHERE
                fecha = ?
                AND secncf_afectado = ?
                AND secncf_nota = ?
                AND id_devolucion = ?
                
        ),
        'Nota de credito no existe!'
    ) AS resultado;`;

	localConnection.query(query, values, (error, resultados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(resultados)
		resolve(resultados);
	});
});


const consultaNotaDeCreditosNoVencidasALaFecha = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = `SELECT COALESCE(SUM(CASE WHEN fecha_vencimiento < CURDATE() THEN total_importe ELSE 0.00 END), 0.00) AS suma_vencidas, COALESCE(SUM(CASE WHEN fecha_vencimiento >= CURDATE() OR fecha_vencimiento IS NULL THEN total_importe ELSE 0.00 END), 0.00) AS suma_no_vencidas FROM jr_devolucion WHERE estatus = 'Disponible';`;

	localConnection.query(query, (error, resultados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(resultados);
	});
});


const consultaMesa = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = `SELECT DISTINCT m.id_mesa, m.mesa, 
       (CASE 
            WHEN m.id_mesa IN (SELECT id_mesa FROM jr_detalle_venta_temporal) THEN 'abierta'
            ELSE 'cerrada'
        END) AS estado,
        CASE 
            WHEN e.id_empleado IS NULL THEN 'Sin asignar'
            ELSE CONCAT(e.nombres, ' ', e.apellidos)
        END AS nombre_camarero,
        CASE 
            WHEN c.id_cliente IS NULL THEN 'Sin asignar'
            ELSE CONCAT(c.nombres, ' ', c.apellidos)
        END AS cliente, d.id_cliente, c.rnc, c.celular,
		d.numero_pedido,
        d.id_camarero -- Agregar el id_camarero
FROM jr_mesa m
LEFT JOIN jr_detalle_venta_temporal d ON m.id_mesa = d.id_mesa
LEFT JOIN jr_empleado e ON d.id_camarero = e.id_empleado
LEFT JOIN jr_cliente c ON d.id_cliente = c.id_cliente ORDER BY m.mesa ASC`;

	localConnection.query(query, (error, resultados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		console.log("Resultados de la mesa = > ",resultados)
		resolve(resultados);
	});
});


const consultaMesaCliente = (id_mesa) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = `SELECT DISTINCT m.id_mesa, m.mesa, 
       (CASE 
            WHEN m.id_mesa IN (SELECT id_mesa FROM jr_detalle_venta_temporal) THEN 'abierta'
            ELSE 'cerrada'
        END) AS estado,
        CASE 
            WHEN e.id_empleado IS NULL THEN 'Sin asignar'
            ELSE CONCAT(e.nombres, ' ', e.apellidos)
        END AS nombre_camarero,
        CASE 
            WHEN c.id_cliente IS NULL THEN 'Sin asignar'
            ELSE CONCAT(c.nombres, ' ', c.apellidos)
        END AS cliente, d.id_cliente, c.rnc, c.celular,
        d.id_camarero -- Agregar el id_camarero
FROM jr_mesa m
LEFT JOIN jr_detalle_venta_temporal d ON m.id_mesa = d.id_mesa
LEFT JOIN jr_empleado e ON d.id_camarero = e.id_empleado
LEFT JOIN jr_cliente c ON d.id_cliente = c.id_cliente
WHERE d.id_mesa = ${id_mesa}  ORDER BY m.mesa ASC`;

	localConnection.query(query, (error, resultados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log("Resultados de la mesa = > ",resultados)
		resolve(resultados);
	});
});


const consultaCamarero = () => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = `SELECT e.id_empleado, CONCAT(e.nombres," ", e.apellidos) AS camarero, e.codigo, e.id_puesto, e.id_estado, p.descripcion AS puesto FROM jr_empleado e, jr_puesto p WHERE e.id_puesto = p.id_puesto AND p.descripcion = "Camarero" AND e.id_estado ='2'`;

	localConnection.query(query, (error, resultados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(resultados);
	});
});



const clienteConFacturaTemporalX = (id_cliente) => new Promise((resolve, reject) => {
	let values = [id_cliente];
	// let query = `SELECT EXISTS (
	// 	SELECT 1
	// 	FROM jr_detalle_venta_temporal
	// 	WHERE id_cliente = ?
	// ) AS existe_cliente;`;
	let query = `SELECT DISTINCT numero_pedido FROM jr_detalle_venta_temporal WHERE id_cliente = ? AND id_cliente != 1`
	// let query = 'SELECT DISTINCT `caja`, `id_mesa`, `numero_pedido` FROM `jr_detalle_venta_temporal` WHERE `id_cliente` = ?	'

	localConnection.query(query, values, (error, cliente) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(cliente)
		resolve(cliente);
	});
});



const clienteConFacturaTemporal = (id_cliente) => new Promise((resolve, reject) => {
	let values = [id_cliente];
	// let query = `SELECT EXISTS (
	// 	SELECT 1
	// 	FROM jr_detalle_venta_temporal
	// 	WHERE id_cliente = ?
	// ) AS existe_cliente;`;
	// let query = `SELECT DISTINCT numero_pedido FROM jr_detalle_venta_temporal WHERE id_cliente = ? AND id_cliente != 1`
	let query = 'SELECT DISTINCT vt.numero_pedido, vt.caja, vt.id_mesa, (SELECT mesa FROM jr_mesa WHERE id_mesa = vt.id_mesa) AS mesa FROM jr_detalle_venta_temporal vt WHERE vt.id_cliente = ?;'

	localConnection.query(query, values, (error, cliente) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(cliente)
		resolve(cliente);
	});
});



const consultaEmpleado = (id_empleado) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = `SELECT CONCAT(e.nombres," ", e.apellidos) AS empleado FROM jr_empleado e WHERE e.id_estado ='2' AND e.id_empleado = ?`;

	localConnection.query(query,[id_empleado], (error, resultados) => {
		// console.log(error);
		if (error) {
			reject(error);
			return;
		}
		// console.log(rows)
		resolve(resultados[0].empleado);
	});
});

const guardarMovimientoEnCaja = (values) => new Promise((resolve, reject) => {
	console.log(values)
	let query = 'INSERT INTO `jr_movimiento_caja`(`id_supervisor`, `tipo_movimiento`, `monto`, `detalle`, `id_caja_detalle`, `id_cajero`) VALUES ( ? )';

	localConnection.query(query, [values], (error, insertado) => {
		if (error) {
			console.log(error)
			reject(error);
			return;
		}
		resolve(insertado.insertId);
	});
});

module.exports = {
	list,
	consultaSucursales,
	// buscarProductoPorCodigo,
	consultaPedidoActual,
	guardarProductoVentaTemporal,
	consultaProductoCodigo,
	consultaUnidadProductoID,
	consultaVentaTemporal,
	consultaProductoPrecioCompra,
	editarCantidadProductoCliente,
	editarUnidadProductoCliente,
	consultaProductoIdAlmacenCantidad,
	guardarClienteBasico,
	cambiarCliente,
	eliminarProductoAlCliente,

	consultaSecuenciaComprobante,
	actualizarSecuenciaComprobante,
	actualizarNotaDeCredito,
	guardarVentaProcesada,
	eliminarVentaTemporal,
	guardarProductoVenta,
	actualizaProductoAlmacenVenta,
	actualizaPrecioDeCostoTotalVenta,
	buscarDescripcionUnidad,
	producto_list,
	facturaList,
	buscarFactura,
	buscarDetalleFactura,
	verificaCajaAbierta,
	desgloseEnCaja,
	facturacionTotalEnCaja,
	guardarDevolucion,
	guardarDetalleDevolucion,
	restarCantidadPendienteAlProductoActualDeLaFactura,
	cambiarEstadoFactura,
	consultaEmpleadoReporte,
	consultaEmpleado,
	consultaCajaReporte,
	consultaTurnoReporte,
	filtroReporte,
	filtroReporteTiposDePago,
	consultaNotaDeCreditosNoVencidasALaFecha,
	consultaNotaDeCreditosNoVencidasALaFechaEnVenta,
	consultaMesa,
	consultaMesaCliente,
	consultaCamarero,
	clienteConFacturaTemporal,
	guardarMovimientoEnCaja
};