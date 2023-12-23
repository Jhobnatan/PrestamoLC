const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const ordenController = require('../controllers/ordenController');

router.get('/', ordenController.producto_list);
router.get('/filtro/:valor/:inicio/:estado', ordenController.orden_list_filtro);
router.get('/ingreso/:id_ingreso',ordenController.detalleIngrsoList);
router.put('/updateIngresoProducto',ordenController.updateIngresoProducto);
router.put('/actualizaDetalleIngreso',ordenController.updateDetalleIngresoProducto);

router.post('/pasaIngresoA_Produccion',ordenController.pasaIngresoA_Produccion);

router.post('/save_or_update/:id/:codigo/:descripcion/:referencia/:factor_conversion/:existencia/:precio_compra/:precio_detalle/:precio_al_por_mayor/:precio_especial/:con_itbis/:itbis/:con_descuento/:descuento/:margen_ganancia/:cantidad_minima/:cantidad_maxima/:ubicacion/:id_estado/:idmarca/:idcategoria/:id_clase',ordenController.producto_save_or_update);

router.get('/buscar_producto/:id',ordenController.buscar_producto);
router.get('/buscarCodigoProducto/:codigo/:cantidad/:id_suplidor',ordenController.buscarCodigoProducto);

router.post('/guardar_componente/:producto/:componente/:cantidad',ordenController.guardar_componente);
router.post('/elimina_componente/:producto/:componente',ordenController.elimina_componente);


router.get('/suplidorPedidoTemporal/:id_suplidor',ordenController.suplidorPedidoTemporal);
router.post('/eliminarProductoDelPedido/:id_producto/:id_suplidor',ordenController.eliminarProductoDelPedido);
router.post('/guardarOrden/:fecha/:condicion/:estado/:nota/:suplidor/:no_orden/:datos',ordenController.guardarOrden);
router.get('/buscarPedidoSuplidor/:id_suplidor/:id_pedido',ordenController.buscarPedidoSuplidor);
router.post('/imprimirOrdenPedido/:id_pedido',ordenController.imprimirOrdenPedido);

module.exports = router;