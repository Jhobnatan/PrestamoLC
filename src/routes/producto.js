const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/', productoController.producto_list);
router.get('/filtro/:valor/:inicio', productoController.producto_list_filtro);
router.get('/componentes/:id',productoController.componente_list);

router.post('/save_or_update',productoController.producto_save_or_update);

router.get('/buscar_producto/:id',productoController.buscar_producto);

router.get('/actualizaPrecioCompraProducto/:id_producto/:precioCompra',productoController.actualizaPrecioCompraProducto);
router.get('/buscarCodigoProducto/:codigo/:cantidad/:id_unidad/:id_suplidor',productoController.buscarCodigoProducto);

router.post('/guardar_componente/:producto/:componente/:cantidad/:id_unidad',productoController.guardar_componente);
router.post('/elimina_componente/:producto/:componente',productoController.elimina_componente);


router.get('/suplidorPedidoTemporal/:id_suplidor',productoController.suplidorPedidoTemporal);
router.post('/eliminarProductoDelPedido/:id_producto/:id_suplidor',productoController.eliminarProductoDelPedido);
// router.post('/guardarOrden/:fecha/:condicion/:estado/:nota/:suplidor/:no_orden/:datos',productoController.guardarOrden);

router.get('/unidad', productoController.unidad_list);
router.post('/unidad/:id_unidad/:unidad/:estado', productoController.unidad_save);
router.get('/unidad_producto/:id_producto',productoController.buscarUnidadProducto);
router.post('/agregarUnidadProducto/:codigoDeBarras/:id_unidad/:id_producto/:factorDeConversion', productoController.agregarUnidadProducto);

router.get('/almacenProducto/:id_producto',productoController.buscarAlmacenProducto);
router.get('/almacenes',productoController.buscarAlmacenes);
router.get('/consultaProductoAlmacen/:id_producto/:idAlmaceActual',productoController.consultaProductoAlmacen);
router.post('/cambiarProductoDeAlmacen',productoController.cambiarProductoDeAlmacen);


router.post('/imprimirCodigoBarras/:codigo',productoController.imprimirCodigoBarras);

router.post('/eliminaUnidadAlProducto/:id_producto/:id_unidad',productoController.eliminaUnidadAlProducto);

router.get('/prepararProducto/:id_producto/:id_unidad/:cantidad/:ubicacion/:id_almacen',productoController.prepararProducto);
module.exports = router;
