
const { producto_list, save_producto, update_producto, buscar_producto, buscarCodigoProducto, guardarSuplidorPedidoTemporal, suplidorPedidoTemporal, eliminarProductoDelPedido, actualizaNumeroDeOrden, eliminar_componente, componente_list, componenteListProductos, inserta_componente, lasmarcas, lascategorias, lasclases, losestados, lasUnidades, guardarUnidad, actualizarUnidad,eliminaUnidadAlProducto, buscarUnidadProducto, guardarUnidadVsProducto, buscarAlmacenProducto, buscarAlmacenes,actualizaAlmacenes,     consultaProductoAlmacen, consultaFactorDeConversionUnidadProducto, guardaProductoAlmacen, actualizaProductoAlmacen, actualizaPrecioCompraProducto, prepararProducto } = require('../services/productoService');
// const {  } = require('../services/ordenService');
const { actualizaProductoAlmacenVenta } = require('../services/facturacionService');

const { paginacion } = require("../config");

const { createCanvas } = require('canvas');
const qz = require('qz-tray');
const JsBarcode = require('jsbarcode');

const controller = {};

controller.producto_list = async (req, res) => {

  let estado = await losestados();
  let categoria = await lascategorias();
  let marca = await lasmarcas();
  let clase = await lasclases();
  // console.log("lista de productoes")
  res.render('producto', {
    paginacion,
    est: estado,
    clase: clase,
    marca: marca,
    categoria: categoria,
    accesos: req.jhobrosoftsession.accesos
  });
}

controller.producto_list_filtro = async (req, res) => {
  let { valor } = req.params;
  let { inicio } = req.params;

  if (valor == "aaaaaaaaaaaa") {
    valor = "";
  }
  let nunreg = paginacion;//10;
  let nuevoinicio = (inicio - 1) * nunreg

  const productoes = await producto_list(valor, nuevoinicio, nunreg);
  let registros = await producto_list(valor);
  productoes.push({ registros });
  res.send(productoes);
}


controller.producto_save_or_update = async (req, res) => {
  let { id, codigo, descripcion, referencia, factor_conversion, existencia, precio_compra, precio_detalle, precio_al_por_mayor, precio_especial, con_itbis, itbis, con_descuento, descuento, margen_ganancia, cantidad_minima, cantidad_maxima, ubicacion, id_estado, idmarca, idcategoria, id_clase } = req.body;

  console.log("Veo que datos ", descripcion)
  let values = [];
  let resoult = "";
  if (id == 0) {
    //`codigo`, `codigo_barra`, `descripcion`, `referencia`, `factor_conversion`, `existencia`, `precio_compra`, `precio_venta`, `itbis`, `descuento`, `margen_ganancia`, `cantidad_minima`, `cantidad_maxima`, `ubicacion`, `id_estado`, `idmarca`, `idcategoria`
    values = [codigo, descripcion, referencia, factor_conversion, existencia, precio_compra, precio_detalle, precio_al_por_mayor, precio_especial, con_itbis, itbis, con_descuento, descuento, margen_ganancia, cantidad_minima, cantidad_maxima, ubicacion, id_estado, idmarca, idcategoria, id_clase];
    console.log('a guardar producto')
    resoult = await save_producto(values);
    res.send(resoult);
  } else {
    values = [codigo, descripcion, referencia, factor_conversion, existencia, precio_compra, precio_detalle, precio_al_por_mayor, precio_especial, con_itbis, itbis, con_descuento, descuento, margen_ganancia, cantidad_minima, cantidad_maxima, ubicacion, id_estado, idmarca, idcategoria, id_clase, id];
    resoult = await update_producto(values);
    res.send(resoult);
  }

}

controller.buscar_producto = async (req, res) => {
  let { id } = req.params;
  let producto = await buscar_producto(id);

  res.send(producto[0]);
}

controller.suplidorPedidoTemporal = async (req, res) => {
  let { id_suplidor } = req.params;
  let productos = await suplidorPedidoTemporal(id_suplidor);
  //  console.log(productos)
  res.send(productos);
}

controller.buscarCodigoProducto = async (req, res) => {
  let { codigo, cantidad, id_unidad, id_suplidor } = req.params;

  let producto = await buscarCodigoProducto(codigo);

  await guardarSuplidorPedidoTemporal(cantidad, id_unidad, producto[0].id_producto, id_suplidor);

  res.send("Listo");
}

controller.eliminarProductoDelPedido = async (req, res) => {
  let { id_producto, id_suplidor } = req.params;
  let values = [id_producto, id_suplidor];
  try {
    await eliminarProductoDelPedido(values);

    res.send("Producto eliminado de la lista de éste suplidor");
  } catch (error) {
    console.log("Error al eliminar producto del suplidor ", error)
    res.send("Error al eliminar producto éste suplidor");
  }

}

// controller.guardarOrden = async (req, res) => {
//   let { fecha, condicion, estado, nota, suplidor, no_orden, datos } = req.params;
//   try {
//     let id_empleado_pide = req.jhobrosoftsession.id_empleado;
//     let productos = JSON.parse(datos);
//     // console.log('la orden  ======>'+no_orden)
//     // console.log(JSON.parse(datos))
//     // await eliminar_componente(values);
//     let values = [fecha, id_empleado_pide, condicion, nota, estado, no_orden, suplidor];
//     let idOrdenInsertada = await guardarOrden(values);

//     for (let i = 0; i < productos.length; i++) {
//       const fila = productos[i];
//       const cantidad = fila.cantidad;
//       const id_producto = fila.id_producto;
//       const id_unidad = fila.id_unidad;
//       values = [cantidad, id_unidad, id_producto, idOrdenInsertada];

//       await guardarOrdenDetalle(values)
//       values = [id_producto, suplidor];
//       await eliminarProductoDelPedido(values);
//     }
//     values = [no_orden, suplidor];
//     actualizaNumeroDeOrden(values)

//     res.send("Orden procesada correctamente");
//   } catch (error) {
//     console.log(error)
//     res.send("Error al guardar orden");
//   }
// }

controller.componente_list = async (req, res) => {
  let { id } = req.params;
  let id_productos = await componente_list(id);
  // console.log(id_productos)
  let lista;
  if (id_productos == '') {
    lista = "Este producto no contiene componentes";
    res.send(lista);
  } else {
    lista = await componenteListProductos(id_productos, id)
    console.log('Ver kusta ', lista)
    res.send(lista);
  }

}

controller.guardar_componente = async (req, res) => {
  let { producto, componente, cantidad, id_unidad } = req.params;
  try {
    let values = [producto, componente];
    await eliminar_componente(values);
    values = [producto, componente, cantidad, id_unidad];
    await inserta_componente(values);

    res.send("Datos insertados correctamente");
  } catch (error) {
    console.log(error)
    res.send("Error al guardar componente");
  }
}

controller.elimina_componente = async (req, res) => {
  let { producto, componente } = req.params;
  let values = [producto, componente];
  await eliminar_componente(values);

  res.send("Datos eliminados correctamente");
}

controller.unidad_list = async (req, res) => {

  let unidades = await lasUnidades();
  res.send(unidades);
}

controller.unidad_save = async (req, res) => {
  let { id_unidad, unidad, estado } = req.params;
  let value = [unidad, estado];
  if (id_unidad == 0) {
    await guardarUnidad(value);
    console.log('Unidad guardada' + value);
    res.send('Unidad guardada');
  } else {
    value = [unidad, estado, id_unidad];
    await actualizarUnidad(value);
    console.log('Unidad actualizada' + value);
    res.send('Unidad actualizada');
  }
}

controller.eliminaUnidadAlProducto = async (req, res) => {
  let { id_producto, id_unidad } = req.params;
  let values = [id_producto, id_unidad];
  await eliminaUnidadAlProducto(values);

  res.send("Datos eliminados correctamente");
}

controller.buscarUnidadProducto = async (req, res) => {
  let { id_producto } = req.params;
  let unidades = await buscarUnidadProducto(id_producto);

  res.send(unidades);
}


controller.actualizaPrecioCompraProducto = async (req, res) => {
  let { id_producto, precioCompra } = req.params;

  try {

    let values=[precioCompra, id_producto];
    let producto = await actualizaPrecioCompraProducto(values)
   console.log(producto)
    res.send(producto);
  } catch (error) {
    console.log(error)
  }
}

controller.agregarUnidadProducto = async (req, res) => {
  let { codigoDeBarras,id_unidad, id_producto, factorDeConversion } = req.params;
  let value = [factorDeConversion, id_producto, id_unidad, codigoDeBarras];
  await guardarUnidadVsProducto(value);
  res.send('Unidad agregada al producto correctamente');
}

controller.buscarAlmacenProducto = async (req, res) => {
  let { id_producto } = req.params;
  let unidades = await buscarAlmacenProducto(id_producto);

  res.send(unidades);
}
controller.buscarAlmacenes = async (req, res) => {

  let unidades = await buscarAlmacenes();
  console.log(unidades)
  res.send(unidades);
}

controller.cambiarProductoDeAlmacen = async (req, res) => {
  let { idAlmacenActual,cantidadEnAlmacenActual,ubicacionEnAlmacenActual,idAlmacenAlQueVa,cantidadAMover,ubicacionEnAlmacenNuevo,id_producto } = req.body;
// console.log(idAlmacenActual,cantidadEnAlmacenActual,ubicacionEnAlmacenActual,idAlmacenAlQueVa,cantidadAMover,ubicacionEnAlmacenNuevo,id_producto)
  try {
    console.log(idAlmacenActual)
    let cantidadRestada = parseFloat(cantidadEnAlmacenActual) - parseFloat(cantidadAMover);
    let values = [cantidadRestada,ubicacionEnAlmacenActual,idAlmacenActual,id_producto];
    await actualizaProductoAlmacen(values);

          values=[id_producto,idAlmacenAlQueVa];
    let producto = await consultaProductoAlmacen(values)
    if(producto !=''){
      console.log('Leo los datos del producto update =====> ',producto[0].existencia)//`existencia`=?,`ubicacion`=? WHERE `id_almacen` = ? AND `id_producto`= ?
      let existenciaNueva = parseFloat(producto[0].existencia) + parseFloat(cantidadAMover);
      values = [existenciaNueva,ubicacionEnAlmacenNuevo,idAlmacenAlQueVa,id_producto];
      await actualizaProductoAlmacen(values)
    }else{
      console.log('Producto nuevo Insert ')//`existencia`, `ubicacion`, `id_producto`, `id_almacen`
      values = [cantidadAMover,ubicacionEnAlmacenNuevo,id_producto,idAlmacenAlQueVa];
      await guardaProductoAlmacen(values)
    }
    
    // await actualizaAlmacenes(id_producto, idAlmaceActual, cantidadEnAlmacenActual, cantidadAMover, idAlmacenAlQueVa);
    res.send('Unidad agregada al producto correctamente');
  } catch (error) {
    console.log(error)
  }
}

controller.prepararProducto = async (req, res) => {
  let { id_producto, id_unidad, cantidad, ubicacion, id_almacen } = req.params;

  try {
    let id_empleado = req.jhobrosoftsession.id_empleado;
    let values=[id_empleado, id_producto, cantidad, id_unidad, id_almacen,'Ordenado'];
    let producto = await prepararProducto( values)
   console.log(producto)

   values=[id_producto,id_almacen];
    let productoPreparado = await consultaProductoAlmacen(values)
    if(productoPreparado !=''){
      console.log('Leo los datos del producto update =====> ',productoPreparado[0].existencia)//`existencia`=?,`ubicacion`=? WHERE `id_almacen` = ? AND `id_producto`= ?
      let existenciaNueva = parseFloat(productoPreparado[0].existencia) + parseFloat(cantidad);
      values = [existenciaNueva,ubicacion,id_almacen,id_producto];
      await actualizaProductoAlmacen(values)
    }else{
      console.log('Producto nuevo Insert ')//`existencia`, `ubicacion`, `id_producto`, `id_almacen`
      values = [cantidad,ubicacion,id_producto,id_almacen];
      await guardaProductoAlmacen(values)
    }
    //aqui se descuentan los componentes
    let id_productos = await componente_list(id_producto);// busco los id de las componentes
                // console.log(id_productos)
                let lista;
                if (id_productos == '') { // si no tiene componente no se prepara
                    // lista = "Este producto no contiene componentes";
                    // res.send(lista);
                    // values = [id_producto, id_almacen];
                    // let productoAlmacen = await consultaProductoAlmacen(values);
                    // let existenciaNueva = parseFloat(productoAlmacen[0].existencia) - parseFloat(cantidadAMover);
                    // // console.log('existencia nueva ====> ', existenciaNueva)
                    // values = [existenciaNueva, id_almacen, id_producto];
                    // await actualizaProductoAlmacenVenta(values);
                } else { 
                    //si tiene componente entro aqui busco las componentes y 
                    lista = await componenteListProductos(id_productos, id_producto)
                    console.log('Ver kusta ', lista)
                    for (let x = 0; x < lista.length; x++) {
                        values = [lista[x].id_producto, id_almacen];
                        let productoAlmacen = await consultaProductoAlmacen(values);
                        let existenciaNueva = parseFloat(productoAlmacen[0].existencia) - (parseFloat(cantidad)*parseFloat(lista[x].cantidad));//a la cantidad existente le resto la cantidad a mover multimplicada por la cantidad del productoComponente
                        console.log('componente existencia nueva ====> ', existenciaNueva)
                        values = [existenciaNueva, id_almacen, lista[x].id_producto];
                        await actualizaProductoAlmacenVenta(values);
                    }
                    // res.send(lista);
                }

    res.send(producto);
  } catch (error) {
    console.log(error)
  }
}

controller.consultaProductoAlmacen = async (req, res) => {
  let { id_producto, idAlmaceActual } = req.params;

  try {

    let values=[id_producto,idAlmaceActual];
    let producto = await consultaProductoAlmacen(values)
   console.log(producto)
    res.send(producto);
  } catch (error) {
    console.log(error)
  }
}
 


controller.imprimirCodigoBarras = async (req, res) => {
  try {
    const { codigo } = req.params;

    // Crea un lienzo utilizando la biblioteca canvas
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');

    // Genera el código de barras en el lienzo
    await JsBarcode(canvas, codigo, {
      format: 'CODE128',
      displayValue: false,
    });

    // Obtiene el SVG del lienzo como una cadena base64
    const barcodeSVG = canvas.toDataURL('image/svg+xml');

    // Configura la conexión con qz-tray
    await qz.websocket.connect();

    // Encuentra la impresora
    const printers = await qz.printers.find();
    const printer = printers.find(p => p.name === 'Brother QL-700');

    if (!printer) {
      throw new Error('No se encontró la impresora');
    }

    const config = qz.configs.create(printer);

    // Prepara los datos para imprimir (en este caso, solo el código de barras)
    const data = [{
      type: 'html',
      format: 'plain',
      data: barcodeSVG,
    }];

    // Imprime los datos utilizando qz-tray
    await qz.print(config, data);

    // Cierra la conexión con qz-tray
    qz.websocket.disconnect();

    res.send('Impresión exitosa');
  } catch (error) {
    console.error('Error al imprimir', error);
    res.status(500).send('Error al imprimir');
  }
};


module.exports = controller;
