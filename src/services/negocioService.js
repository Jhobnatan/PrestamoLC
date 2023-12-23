const { json } = require("express/lib/response");
const { localConnection } = require("./mysql");
const { localQuery } = require("./mysql");

const list = () => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT ng.`id_negocio`, ng.`razon_social`, ng.`id_empleado`, concat(e.`nombres`, ' ', e.`apellidos`) AS registradopor, ng.`fecha_creacion`, ng.`id_tipo_afiliacion`, ta.`tipo_afiliacion`, ng.`id_pago_electronico`, pe.`tipo_pago_electronico`, (SELECT concat(e.`nombres`, ' ', e.`apellidos`) FROM `jr_empleado` WHERE `id_empleado` = ng.`editado_por`) AS editadopor FROM `jr_negocio_general` ng, `jr_empleado` e, `jr_pago_electronico` pe, `jr_tipo_afiliacion` ta WHERE e.`id_empleado` = ng.`id_empleado` AND pe.`id_pago_electronico` = ng.`id_pago_electronico` AND ta.`id_tipo_afiliacion` = ng.`id_tipo_afiliacion` AND `estado` = 'Prospecto' ORDER BY ng.`razon_social` ASC;";

	localConnection.query(query, (error, negocios) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(negocios);
	});
});

const nombre_empleado = (id_empleado) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT concat(`nombres`, ' ', `apellidos`) AS empleado FROM `jr_empleado` WHERE `id_empleado` = ?;";

	localConnection.query(query,id_empleado, (error, emp) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(emp);
	});
});

const correo_empleado = (id_empleado) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT `email_institucional` FROM `jr_empleado` WHERE `id_estado` = 2 AND `id_empleado` = ?;";

	localConnection.query(query,id_empleado, (error, emp) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(emp);
	});
});

const nombre_ejecutivo_externo = (id_ejecutivo) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT `id_ejecutivo`, `nombre`, `tel`, `flota`, `correo`, `id_empresa`, `estado` FROM `jr_ejecutivo_externo` WHERE `id_ejecutivo` = ?;";

	localConnection.query(query,id_ejecutivo, (error, ejec) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(ejec);
	});
});

const laprovincia = (id_provincia) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT `id_provincia`, `provincia`, `id_regiones_desarrollo`, `codigo_postal` FROM `jr_provincia` WHERE `id_provincia` = ? ORDER BY `provincia` ASC;";

	localConnection.query(query,id_provincia, (error, prov) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(prov);
	});
});
const elmunicipio = (id_municipio) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT `id_municipio`, `municipio`, `id_provincia` FROM `jr_municipio` WHERE `id_municipio` = ? ORDER BY `municipio` ASC;";

	localConnection.query(query,id_municipio, (error, mun) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(mun);
	});
});
const elsector = (id_sector) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT `id_sector`, `sector`, `id_municipio` FROM `jr_sector` WHERE `id_sector` = ? ORDER BY `sector` ASC;";

	localConnection.query(query,id_sector, (error, prov) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(prov);
	});
});

const lacategoria = (id_categoria) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT `id_categoria`, `categoria`, `img_src` FROM `jr_categoria_neg` WHERE `id_categoria` = ? ORDER BY `categoria` ASC;";

	localConnection.query(query,id_categoria, (error, cat) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(cat);
	});
});

const lainformacion_bancaria = (id_informacion_bancaria) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT ib.`id_informacion_bancaria`, ib.`banco_tipo_cuenta`, ib.`cuenta_debito`, ib.`cuenta_credito`, ib.`frecuencia_pago_cheque`, ib.`id_banco`, ib.`id_negocio`, b.`id_banco`, b.`nombre` AS banco, b.`code`, b.`digit` FROM `jr_informacion_bancaria` ib, `jr_banco` b WHERE ib.`id_banco` = b.`id_banco` AND ib.`id_informacion_bancaria` = ?;";

	localConnection.query(query,id_informacion_bancaria, (error, info) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(info);
	});
});

const tipo_afiliacion = (id_tipo) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT `tipo_afiliacion` FROM `jr_tipo_afiliacion` WHERE `id_tipo_afiliacion` = ?;";

	localConnection.query(query,id_tipo, (error, tipo) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(tipo);
	});
});
const pago_electronico = (id_pago) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT `id_pago_electronico`, `tipo_pago_electronico` FROM `jr_pago_electronico` WHERE `id_pago_electronico` = ?;";

	localConnection.query(query,id_pago, (error, pago) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(pago);
	});
});
const creadopor = (id_negocio) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT ng.`id_negocio`, ng.`razon_social`, ng.`id_empleado`, concat(e.`nombres`, ' ', e.`apellidos`) AS registradopor, ng.`fecha_creacion`, ng.`id_tipo_afiliacion`, ta.`tipo_afiliacion`, ng.`id_pago_electronico`, pe.`tipo_pago_electronico` FROM `jr_negocio_general` ng, `jr_empleado` e, `jr_pago_electronico` pe, `jr_tipo_afiliacion` ta WHERE e.`id_empleado` = ng.`id_empleado` AND pe.`id_pago_electronico` = ng.`id_pago_electronico` AND ta.`id_tipo_afiliacion` = ng.`id_tipo_afiliacion` AND ng.`id_negocio` = ?;";

	localConnection.query(query,id_negocio, (error, negocio) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(negocio);
	});
});

const list_sucursal = (id_sucursal) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT `id_sucursal`, `nombre_sucursal`, `id_empleado`, `id_provincia`, `id_municipio`, `id_sector`, `direccion`, `codigo_postal`, `telefono`, `fax`, `email`, `cantidad_lectores`, `codigo_fidelium`, `descuento_redencion`, `descuento_otorgado`, `limite_piso`, `apertura`, `cierre`, `geo`, `fecha_creacion`, `referencia1`, `referencia2`, `referencia3`, `id_negocio`, `id_informacion_bancaria`, `id_categoria`, `estado`, `id_zona`, `id_subzona` FROM `jr_sucursal` WHERE `id_sucursal` = ?";
	
	localConnection.query(query,[id_sucursal], (error, sucursal) => {
		// console.log(sucursal);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(sucursal);
	});
});

const list_sucursales = (id_negocio) => new Promise((resolve, reject) => {
	// Informacion del portador.
    let query ="SELECT DISTINCT s.`id_sucursal`, s.`codigo_fidelium`, s.`nombre_sucursal`, s.`id_provincia`, s.`fecha_creacion`, p. `provincia`, s.`id_negocio`, s.`estado`, ps.`id_sucursal`, ps.`id_empleado` AS idejecutivointerno, concat(e.`nombres`,' ', e.`apellidos`) AS ejecutivointerno,(SELECT  concat(`nombres`,' ', `apellidos`) FROM `jr_empleado` WHERE `id_empleado` = s.`id_empleado`)  AS registradopor FROM `jr_sucursal` s, `jr_persona_vs_sucursal` ps, `jr_provincia` p, `jr_empleado` e WHERE ps.`id_sucursal` = s.`id_sucursal` AND p.`id_provincia` = s.`id_provincia` AND e.`id_empleado` = ps.`id_empleado` AND s.`id_negocio` = ? order by s.`id_sucursal` asc;";
	
	localConnection.query(query,[id_negocio], (error, sucursal) => {
		// console.log(sucursal);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(sucursal);
	});
});

//SELECT DISTINCT s.`id_sucursal`, s.`codigo_fidelium`, s.`nombre_sucursal`, s.`id_provincia`, s.`fecha_creacion`, p. `provincia`, s.`id_negocio`, s.`estado`, ps.`id_sucursal`, ps.`id_empleado` AS idejecutivointerno, concat(e.`nombres`,' ', e.`apellidos`) AS ejecutivointerno,(SELECT  concat(`nombres`,' ', `apellidos`) FROM `jr_empleado` WHERE `id_empleado` = s.`id_empleado`)  AS registradopor FROM `jr_sucursal` s, `jr_persona_vs_sucursal` ps, `jr_provincia` p, `jr_empleado` e WHERE ps.`id_sucursal` = s.`id_sucursal` AND p.`id_provincia` = s.`id_provincia` AND e.`id_empleado` = ps.`id_empleado` WHERE s.`id_negocio` = ?;
const nuevo = (id) => new Promise((resolve, reject) => {

    let ejecutivointerno = 'SELECT `id_empleado`, `nombres`,concat(`nombres`," ",`apellidos`) AS ejecutivointerno FROM `jr_empleado` WHERE `id_departamento` = 4';
    let ejecutivo_externo = 'SELECT ee.`id_ejecutivo`, ee.`nombre`,e.`nombre_empresa` FROM `jr_ejecutivo_externo` ee, `jr_empresa` e WHERE ee.`id_empresa` = e.`id_empresa` AND `estado` = "Activo" AND e.`id_categoria` = 1';
    let banco = 'SELECT `id_banco`, `nombre` FROM `jr_banco`';
    let tipo_afiliacion = 'SELECT `id_tipo_afiliacion`, `tipo_afiliacion` FROM `jr_tipo_afiliacion`';
    let categoria = 'SELECT `id_categoria`, `categoria`, `img_src` FROM `jr_categoria_neg`  ORDER BY `categoria` ASC';
    let provincias = 'SELECT * FROM `jr_provincia` ORDER BY `provincia` ASC';
    let pago_electronico = 'SELECT `id_pago_electronico`, `tipo_pago_electronico` FROM `jr_pago_electronico`';
    let ejecutivo_pago = 'SELECT ee.`id_ejecutivo`, ee.`nombre`,e.`nombre_empresa` FROM `jr_ejecutivo_externo` ee, `jr_empresa` e WHERE ee.`id_empresa` = e.`id_empresa` AND `estado` = "Activo" AND e.`id_categoria` = 2';
    let producto = 'SELECT p.`id_producto` FROM `jr_producto` p,`jr_negocio_vs_producto` np WHERE np.`id_producto` = p.`id_producto` AND np.`id_negocio` = ?';
    let productos = 'SELECT `id_producto`, `producto` FROM `jr_producto`';
    let zonas = 'SELECT `id_zona`, `zona` FROM `jr_zona`';

	Promise.all([
        localQuery(ejecutivointerno,),
        localQuery(ejecutivo_externo,),
        localQuery(banco,),
        localQuery(tipo_afiliacion,),
        localQuery(categoria,),
        localQuery(provincias,),
        localQuery(pago_electronico,),
        localQuery(ejecutivo_pago,),
        localQuery(producto,id),
        localQuery(productos,),
        localQuery(zonas,),

    ]).then(data => {
        resolve(data);

    }, reject => {
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const save_negocio =  (negocio) => new Promise((resolve, reject) => {
    let negocioId=0;
    let sucursalId=0;
    /////////////////CREO EL INSERT DEL NEGOCIO////////////////////////////
    let insertNegocio = "INSERT INTO `jr_negocio_general`(`razon_social`, `rnc`, `id_empleado`, `cant_sucursales`, `red_social`, `sap_acreedor`, `sap_deudor`, `estado`, `id_tipo_afiliacion`, `id_pago_electronico`, `rm_vence`, `proceso`)  VALUES ( ? );";
    localConnection.query(insertNegocio,[negocio], (error, negocioInserted) => {
        // console.log(error)
            if (error) {
                console.log(error)
                reject(error);
                return;
            }
            negocioId=negocioInserted.insertId;
            resolve(negocioId);
        });

});

const negocio_general = (id) => new Promise((resolve, reject) => {
	let negocio_gral = 'SELECT `id_negocio`, `razon_social`, `rnc`, `id_empleado`, `cant_sucursales`, `red_social`, `sap_acreedor`, `sap_deudor`, `fecha_creacion`, `estado`, `id_tipo_afiliacion`, `id_pago_electronico`, `editado_por`, `rm_vence`, `proceso` FROM `jr_negocio_general` WHERE `id_negocio` = ?';
	localConnection.query(negocio_gral,id, (error, negocio) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        
		resolve(negocio);
	});
});

const productos_negocio = (id) => new Promise((resolve, reject) => {
	let producto = 'SELECT p.`id_producto` FROM `jr_producto` p,`jr_negocio_vs_producto` np WHERE np.`id_producto` = p.`id_producto` AND np.`id_negocio` = ?';
	localConnection.query(producto,id, (error, productos) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(productos);
	});
});

const guardarLogs = (id_empleado,tabla,data,id_afectado) => new Promise((resolve, reject) => {
	let saveLogs = `INSERT INTO jr_logs(id_empleado, tabla, data, id_afectado) VALUES ('${id_empleado}','${tabla}','${data}','${id_afectado}')`;
    localConnection.query(saveLogs, (error, negocioInserted) => {
        if (error) {
            console.log(error)
            reject(error);
            return true;
        }else{
            resolve('Datos actualizados correctamente');
        }
        // resolve('Datos actualizados correctamente');
    });
});
const ultimoQueEdita = (id_empleado,id_negocio) => new Promise((resolve, reject) => {
	/////////////////actualizo el ultimo con inserto en la tabla negocio////////////////////////////
    let quienedito = "UPDATE `jr_negocio_general` SET `editado_por`=? WHERE `id_negocio`= ?";
    let ultimoqueedita = [id_empleado,id_negocio]
    localConnection.query(quienedito,ultimoqueedita, (error, negocioInserted) => {
            if (error) {
                console.log(error)
                reject(error);
                return;
            }
            resolve('Datos actualizados correctamente');
        });
});
const insert_path = (values) => new Promise((resolve, reject) => {
	// Informacion del portador.
    // console.log(values)
    let query = 'INSERT INTO `jr_documentos_negocio`(`descripcion`, `path`, `id_negocio`)  VALUES ( ? )';
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

const update_negocio =  (negocio,id_empleado) => new Promise( async (resolve, reject) => {
    // console.log("datos del negocio =================== ",negocio[11])
    const ng = await negocio_general(negocio[11])
    const pn = await productos_negocio(negocio[11])
    const json ={
        negocio_general:ng,
        productos_negocio:pn
    }
    const data = JSON.stringify(json);

    let id_afectado = negocio[11];
    const tabla ='jr_negocio_general';
    await guardarLogs(id_empleado,tabla,data,id_afectado);
    await ultimoQueEdita(id_empleado,id_afectado)
    /////////////////CREO EL INSERT DEL NEGOCIO////////////////////////////
    let updatetNegocio = "UPDATE `jr_negocio_general` SET `razon_social`=?,`rnc`=?,`cant_sucursales`=?,`red_social`=?,`sap_acreedor`=?,`sap_deudor`=?,`estado`=?,`id_tipo_afiliacion`=?,`id_pago_electronico`=?,`rm_vence`=?,`proceso`=? WHERE `id_negocio`= ?";

    localConnection.query(updatetNegocio,negocio, (error, negocioInserted) => {
            if (error) {
                console.log(error)
                reject(error);
                return;
            }
            resolve('Datos actualizados correctamente');
        });

});

const actualiza_proceso_negocio =  (negocio) => new Promise( async (resolve, reject) => {
    
    /////////////////CREO EL INSERT DEL NEGOCIO////////////////////////////
    let updatetNegocio = "UPDATE `jr_negocio_general` SET `proceso`=? WHERE `id_negocio`= ?";

    localConnection.query(updatetNegocio,negocio, (error, negocioInserted) => {
            if (error) {
                console.log(error)
                reject(error);
                return;
            }
            resolve('Datos actualizados correctamente');
        });

});

const delete_producto_negocio =  (id) => new Promise((resolve, reject) => {
    let deleteVSproducto = "DELETE FROM `jr_negocio_vs_producto` WHERE `id_negocio` = ?";
    localConnection.query(deleteVSproducto,[id], (error, inserted) => { // elimino el vs de la sucursal
        if (error) {
            console.log(error)
            reject(error);
            return;
        }
        resolve('Datos actualizados correctamente');
    });
});

const update_producto =  (id,producto) => new Promise((resolve, reject) => {

        

            if(producto){
                for (let i = 0; i < producto.length; i++) { //inserto el id afiliado
    
                    let data = [producto[i], id];
                    // console.log(vals)
                    let insertProductoyNegocio = "INSERT INTO `jr_negocio_vs_producto`(`id_producto`, `id_negocio`)  VALUES ( ? );";
                    localConnection.query(insertProductoyNegocio,[data], (error, inserted) => {
                        //console.log(error)
                        if (error) {
                            console.log(error)
                            reject(error);
                            return;
                        }
                    });
                }
                resolve('Afiliado agregados correctamente');
            }else{
                resolve('NO hay Afiliado');
            }
        
    
    });

const save_informacion_bancaria =  (info) => new Promise((resolve, reject) => {

    let insertNegocio = "INSERT INTO `jr_informacion_bancaria`(`banco_tipo_cuenta`, `cuenta_debito`, `cuenta_credito`, `frecuencia_pago_cheque`, `id_banco`, `id_negocio`) VALUES ( ? );";
    localConnection.query(insertNegocio,[info], (error, infoInserted) => {

            if (error) {
                reject(error);
                return;
            }
            let infoId=infoInserted.insertId;
            resolve(infoId);
        });

});

const save_sucursal =  (sucursal) => new Promise((resolve, reject) => {
        let insertSucursal = "INSERT INTO `jr_sucursal`(`nombre_sucursal`, `id_empleado`, `id_provincia`, `id_municipio`, `id_sector`, `direccion`, `codigo_postal`, `telefono`, `fax`, `email`, `cantidad_lectores`, `codigo_fidelium`, `descuento_redencion`, `descuento_otorgado`, `limite_piso`, `apertura`, `cierre`, `geo`, `referencia1`, `referencia2`, `referencia3`, `id_negocio`, `id_informacion_bancaria`, `id_categoria`, `estado`, `id_zona`, `id_subzona`) VALUES ( ? );";

        localConnection.query(insertSucursal,[sucursal], (error, sucursalInserted) => {
            if (error) {
                console.log(error)
                reject(error);
                return;
            }
            let sucursalId=sucursalInserted.insertId;
            resolve(sucursalId);
        });
});

const save_afiliado =  (sucursalId, values) => new Promise((resolve, reject) => {

        if(values[0]){
            if(typeof values[0]!="object"){
                let valores = [values[0], sucursalId];
        
                    let insertAfiliado = "INSERT INTO `jr_afiliados_cardnet`(`merchand_id`, `id_sucursal`) VALUES ( ? );";
                    
                    // console.log('valores a ver ', valores)
                    
                    // creacion del nuevo vs de la persona_vs_sucursal
                    localConnection.query(insertAfiliado,[valores], (error, inserted) => { // elimino el vs de la sucursal
                        // console.log(error)
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
                for (let i = 0; i < values[0].length; i++) { //inserto el id afiliado

                    let carnet = [values[0][i], sucursalId];
                    // console.log(vals)
                    let insertAfiliado = "INSERT INTO `jr_afiliados_cardnet`(`merchand_id`, `id_sucursal`) VALUES ( ? );";
                    localConnection.query(insertAfiliado,[carnet], (error, inserted) => {
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


const save_persona_sucursal =  (sucursalId, values, ejecutivointerno, externo,ejecutivo_pago) => new Promise((resolve, reject) => {

        if(typeof values[1]!="object"){// Cuando es la primera vez que se crea la sucursal
            
            let vals = [values[1], values[2], values[3], values[4], values[5], 'Activo'];
                

                let insert = "INSERT INTO `jr_persona_sucursal`(`nombre_persona_suc`, `cargo_pers_suc`, `cedula`, `telefono_pers_suc`, `correo`, `estado`)  VALUES ( ? );";
                localConnection.query(insert,[vals], (error, inserted) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                        return;
                    }
                    
                    let id_persona=inserted.insertId;
                    let valores =[ejecutivointerno,id_persona,sucursalId, externo, ejecutivo_pago];
                    
                    let insertVSsucursal = "INSERT INTO `jr_persona_vs_sucursal`(`id_empleado`, `id_persona`, `id_sucursal`, `id_ejecutivo`, `id_ejecutivo_pago`) VALUES ( ? );";
                    localConnection.query(insertVSsucursal,[valores], (error, inserted) => { // elimino el vs de la sucursal
                        if (error) {
                            console.log(error);
                            reject(error);
                            return;
                        }
                        resolve('Datos agregados correctamente');
                    });
                });
        }else{// Cuando ya es una sucursal existente.
            for (let i = 0; i < values[1].length; i++) { //recorriendo del personal de las sucursales

                let vals = [values[1][i], values[2][i], values[3][i], values[4][i], values[5][i], 'Activo'];
                // console.log(vals)
                let insert = "INSERT INTO `jr_persona_sucursal`(`nombre_persona_suc`, `cargo_pers_suc`, `cedula`, `telefono_pers_suc`, `correo`, `estado`)  VALUES ( ? );";
                localConnection.query(insert,[vals], (error, inserted) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                        return;
                    }
                    let id_persona=inserted.insertId;
                    let valores =[ejecutivointerno,id_persona,sucursalId, externo, ejecutivo_pago];
                    let insertVSsucursal = "INSERT INTO `jr_persona_vs_sucursal`(`id_empleado`, `id_persona`, `id_sucursal`, `id_ejecutivo`, `id_ejecutivo_pago`) VALUES ( ? );";
                    localConnection.query(insertVSsucursal,[valores], (error, inserted) => { // elimino el vs de la sucursal
                        if (error) {
                            console.log(error);
                            reject(error);
                            return;
                        }
                    });
                });
                
            }
            resolve('Datos agregados correctamente');
        }
    

});

const delete_afiliado =  (id) => new Promise((resolve, reject) => {
    let deleteAfiliado = "DELETE FROM `jr_afiliados_cardnet` WHERE  `id_sucursal` = ?";
    localConnection.query(deleteAfiliado,[id], (error, inserted) => { // elimino el vs de la sucursal
        if (error) {
            console.log(error);
            reject(error);
            return;
        }
        resolve('Datos actualizados correctamente');
    });
});
const delete_vs_sucursales =  (id) => new Promise((resolve, reject) => {
    let deleteAfiliado = "DELETE FROM `jr_persona_vs_sucursal` WHERE `id_sucursal` = ?;";
    localConnection.query(deleteAfiliado,[id], (error, inserted) => { // elimino el vs de la sucursal
        // console.log('elimino el vs persona sucursal ---------->',id)
        if (error) {
            console.log(error);
            reject(error);
            return;
        }
        resolve('Datos actualizados correctamente');
    });
});


/**
 * 
 * @param {*} sucursalId 
 * @param {*} values 
 * @param {*} ejecutivointerno 
 * @param {*} externo 
 * @param {*} ejecutivo_pago 
 * @returns 
 */
const update_persona_sucursal = (sucursalId, values, ejecutivointerno, externo,ejecutivo_pago) => new Promise((resolve, reject) => {

    if(typeof values[1]!="object"){
         
        let vals = [values[1], values[2], values[3], values[4], values[5], 'Activo', values[6]];
        let insert = "UPDATE `jr_persona_sucursal` SET `nombre_persona_suc`=?,`cargo_pers_suc`=?,`cedula`=?,`telefono_pers_suc`=?,`correo`=?,`estado`=? WHERE `id_persona`=?;";
        // console.log(vals)
        
        // Actualiza los datos de la persona de la sucursal
        localConnection.query(insert,vals, (error, inserted) => {
            // console.log('Los valores de la persona sucursal update --y no es un objeto-------->',vals)
            if (error) {
                console.log(error)
                reject(error);
                return;
            }

            let id_persona=values[6];//id de la persona

            // valores a insertar en el query;
            let valores =[ejecutivointerno,id_persona,sucursalId, externo, ejecutivo_pago];

            let insertVSsucursal = "INSERT INTO `jr_persona_vs_sucursal`(`id_empleado`, `id_persona`, `id_sucursal`, `id_ejecutivo`, `id_ejecutivo_pago`) VALUES ( ? );";
            
            // console.log('valores a ver ', valores)
            
            // creacion del nuevo vs de la persona_vs_sucursal
            localConnection.query(insertVSsucursal,[valores], (error, inserted) => { // elimino el vs de la sucursal
                // console.log(error)
                // console.log('Los valores del versus sucursal insert ---------->',valores)
                if (error) {
                    console.log(error);
                    reject(error);
                    return;
                }
                resolve('Datos agregados correctamente');
            });
        });
    }
    // Si es mas de un item.
    else{
        // Recorro el arreglo de las personas encargadas de la sucursal
        for (let i = 0; i < values[1].length; i++) {

            let vals = [values[1][i], values[2][i], values[3][i], values[4][i], values[5][i], 'Activo', values[6][i]];
            console.log(vals)
            
            // Si el id de la persona de la sucursal es diferente de null
            if(values[6][i]!=""){

                // console.log('update')
                
                let insert = "UPDATE `jr_persona_sucursal` SET `nombre_persona_suc`=?,`cargo_pers_suc`=?,`cedula`=?,`telefono_pers_suc`=?,`correo`=?,`estado`=? WHERE `id_persona`=?;";
                
                // Actualizo cada persona encargada
                localConnection.query(insert,vals, (error, inserted) => {
                    // console.log('Los valores de la persona sucursal update ---es un objeto------->',vals)
                    if (error) {
                        console.log(error)
                        reject(error);
                        return;
                    }
                    let id_persona=values[6][i];
                   
                    let valores =[ejecutivointerno,id_persona,sucursalId, externo, ejecutivo_pago];
                    
                    let insertVSsucursal = "INSERT INTO `jr_persona_vs_sucursal`(`id_empleado`, `id_persona`, `id_sucursal`, `id_ejecutivo`, `id_ejecutivo_pago`) VALUES ( ? );";
                    
                    // inserto el vs nuevamente de las personas_vs_sucursal
                    localConnection.query(insertVSsucursal,[valores], (error, inserted) => {
                        // console.log('Los valores del versus sucursal ---------->',valores)
                        if (error) {
                            console.log(error)
                            reject(error);
                            return;
                        }
                        
                    });
                 });
            }
            // Si el id de la persona es nulo
            else{
               
                let vals = [values[1][i], values[2][i], values[3][i], values[4][i], values[5][i], 'Activo'];
               
                console.log('insert')
                
                let insert = "INSERT INTO `jr_persona_sucursal`(`nombre_persona_suc`, `cargo_pers_suc`, `cedula`, `telefono_pers_suc`, `correo`, `estado`)  VALUES ( ? );";
                
                // Se hace un insert de la nueva persona de la sucursal.
                localConnection.query(insert,[vals], (error, inserted) => {
                    console.log(error)
                    if (error) {
                        reject(error);
                        return;
                    }

                    let id_persona=inserted.insertId;
                   
                    let valores =[ejecutivointerno,id_persona,sucursalId, externo, ejecutivo_pago];
                    
                    let insertVSsucursal = "INSERT INTO `jr_persona_vs_sucursal`(`id_empleado`, `id_persona`, `id_sucursal`, `id_ejecutivo`, `id_ejecutivo_pago`) VALUES ( ? );";
                   
                    // se inserta el vs de la nueva persona con la sucursal
                    localConnection.query(insertVSsucursal,[valores], (error, inserted) => { 
                        if (error) {
                            reject(error);
                            return;
                        }
                        // resolve('Datos agregados correctamente');
                    });
                });
            }
                        
        }
        setTimeout(() => {
            resolve('Datos agregados correctamente');
          }, 1000);
        
    }

});

const update_sucursal =  (sucursal,id_empleado) => new Promise(async(resolve, reject) => {
    let tabla = 'jr_sucursal';

    // console.log('Varifico /////------------>',sucursal)
    // console.log('Varifico el id negocio /////------------>',sucursal[20])

    // console.log('Varifico el id sucursal /////------------>',sucursal[26])
    let id_afectado = sucursal[26];
    let id_negocio = sucursal[20];
    // let su =await list_sucursal(id_afectado)
    let datos =await sucursal_historial(id_afectado);
    // console.log("Veo los datos ¡¡¡¡¡¡¡¡¡¡¡¡¡¡ ========> ",datos)
    await ultimoQueEdita(id_empleado,id_negocio)
    // let sucursal = 'SELECT `id_sucursal`, `nombre_sucursal`, `id_empleado`, `id_provincia`, `id_municipio`, `id_sector`, `direccion`, `codigo_postal`, `telefono`, `fax`, `email`, `cantidad_lectores`, `codigo_fidelium`, `descuento_redencion`, `descuento_otorgado`, `limite_piso`, `apertura`, `cierre`, `geo`, `fecha_creacion`, `referencia1`, `referencia2`, `referencia3`, `id_negocio`, `id_informacion_bancaria`, `id_categoria`, `estado`, `id_zona`, `id_subzona` FROM `jr_sucursal` WHERE `id_sucursal` = ?';
    // let vscarnet = 'SELECT `id_afiliado`, `merchand_id`, `id_sucursal` FROM `jr_afiliados_cardnet` WHERE `id_sucursal` = ?';
    // let vs_sucursal = 'SELECT `id_empleado`, `id_persona`, `id_sucursal`, `id_ejecutivo`, `id_ejecutivo_pago` FROM `jr_persona_vs_sucursal` WHERE `id_sucursal` = ?';
    // let responsable = 'SELECT ps.`id_persona`,ps.`nombre_persona_suc`, ps.`cargo_pers_suc`, ps.`cedula`, ps.`telefono_pers_suc`, ps.`correo`, ps.`estado`, ps.`fecha_creacion`, pvs.`id_sucursal` FROM `jr_persona_sucursal` ps, `jr_persona_vs_sucursal` pvs WHERE ps.`id_persona` =  pvs.`id_persona` AND pvs.`id_sucursal` = ?;';

    // elhistorial.push(JSON.parse([datos[1]));
    // elhistorial.push([datos[1]);
    // elhistorial.push([datos[1]);
    // ,,[datos[2],[datos[3]
    // let historial = JSON.stringify(elhistorial);
    var json = {
        'sucursal':datos[0][0],
        'vscarnet':datos[1],
        'vs_sucursal':datos[2],
        'responsable':datos[3],
    }
    let historial = JSON.stringify(json);
    //  console.log('Posicion JSON  ========>',JSON.parse(historial))
    //  console.log('Posicion  ========>',historial)
    // console.log('Posicion 0 ========>',JSON.parse(historial[0]))
    // console.log('Posicion 1 ========>',JSON.parse(historial[1]))
    // console.log(su)
    await guardarLogs(id_empleado,tabla,historial,id_afectado);
    let insertSucursal = "UPDATE `jr_sucursal` SET `nombre_sucursal`=?,`id_provincia`=?,`id_municipio`=?,`id_sector`=?,`direccion`=?,`codigo_postal`=?,`telefono`=?,`fax`=?,`email`=?,`cantidad_lectores`=?,`codigo_fidelium`=?,`descuento_redencion`=?,`descuento_otorgado`=?,`limite_piso`=?,`apertura`=?,`cierre`=?,`geo`=?,`referencia1`=?,`referencia2`=?,`referencia3`=?,`id_negocio`=?,`id_informacion_bancaria`=?,`id_categoria`=?, `estado`=?,`id_zona`=?,`id_subzona`=?  WHERE `id_sucursal`=?;";
    // console.log("Datos de sucursal -----> \n",sucursal)
    // console.log("Datos de QUERY -----> \n",insertSucursal)

    localConnection.query(insertSucursal,sucursal, (error, sucursae) => {
        // console.log(sucursae)
        if (error) {
            reject(error);
            return;
        }
        // sucursalId=sucursalInserted.insertId;
        resolve('sucursal');
    });
});

const encargados_dep = (id) => new Promise((resolve, reject) => {
	// Informacion del portador.

	let query = 'SELECT * FROM `jr_empleado` WHERE id_empleado =?';

	localConnection.query(query,[id], (error, departamento) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(departamento);
	});
});

const edit = (id) => new Promise((resolve, reject) => {

    let tipo_afiliacion = 'SELECT `id_tipo_afiliacion`, `tipo_afiliacion` FROM `jr_tipo_afiliacion`';
    let categoria = 'SELECT `id_categoria`, `categoria`, `img_src` FROM `jr_categoria_neg`  ORDER BY `categoria` ASC';
    let pago_electronico = 'SELECT `id_pago_electronico`, `tipo_pago_electronico` FROM `jr_pago_electronico`';
    let negocio_general = 'SELECT `id_negocio`, `razon_social`, `rnc`, `id_empleado`, `cant_sucursales`, `red_social`, `sap_acreedor`, `sap_deudor`, `fecha_creacion`, `estado`, `id_tipo_afiliacion`, `id_pago_electronico`, `editado_por`, `rm_vence`, `proceso` FROM `jr_negocio_general` WHERE `id_negocio` = ?';
    let producto = 'SELECT p.`id_producto` FROM `jr_producto` p,`jr_negocio_vs_producto` np WHERE np.`id_producto` = p.`id_producto` AND np.`id_negocio` = ?';
    let productos = 'SELECT `id_producto`, `producto` FROM `jr_producto`';
    let documentos = 'SELECT `id_documento`, `descripcion`, `path`, `fecha`, `id_negocio` FROM `jr_documentos_negocio` WHERE `id_negocio` = ?';

	Promise.all([
        localQuery(negocio_general,id),
        localQuery(tipo_afiliacion,),
        localQuery(categoria,),
        localQuery(pago_electronico,),
        localQuery(producto,id),
        localQuery(productos,),
        localQuery(documentos,id),
    ]).then(data => {
        resolve(data);

    }, reject => {
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const historial = (id, tabla, fecha_desde, fecha_hasta ,inicio = false, nunreg = false) => new Promise((resolve, reject) => {
    let historial ="";
    // console.log('veo los datos', id, tabla, fecha_desde, fecha_hasta )
    let values =[];
    if(inicio!==false && nunreg!==false){
        historial = `SELECT id_logs, fecha, id_empleado, tabla, data, id_afectado, accion FROM jr_logs WHERE tabla ='${tabla}' AND id_afectado = ${id} AND fecha >= '${fecha_desde}' AND fecha <= '${fecha_hasta}' ORDER BY id_logs DESC LIMIT ${inicio}, ${nunreg}`;
        // values = [id, fecha_desde, fecha_hasta ,inicio, nunreg]
        // console.log(historial)
       }else{
        historial = `SELECT COUNT(*) as total FROM jr_logs WHERE tabla ='${tabla}' AND id_afectado = ${id} AND fecha >= '${fecha_desde}' AND fecha <= '${fecha_hasta}' ORDER BY id_logs DESC`;
        //    values = [id, fecha_desde, fecha_hasta]
       }
	Promise.all([
        localQuery(historial,[values]),
    ]).then(data => {
        resolve(data);
    }, reject => {
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});
// const historial = (id) => new Promise((resolve, reject) => {

//     let historial = "SELECT `id_logs`, `fecha`, `id_empleado`, `tabla`, `data`, `id_afectado`, `accion` FROM `jr_logs` WHERE `tabla` ='jr_negocio_general' AND `id_afectado` = ? ORDER BY id_logs DESC LIMIT 5";
    
// 	Promise.all([
//         localQuery(historial,id),
//     ]).then(data => {
//         resolve(data);
//     }, reject => {
//         console.log("No se pudo cargar información de formulario. " + reject);
//     });
// });

const producto = (id) => new Promise((resolve, reject) => {
	let producto = 'SELECT `producto` FROM `jr_producto` WHERE `id_producto` = ?';
	localConnection.query(producto,id, (error, product) => {
		// console.log(error);
		if (error) {
            console.log(error)
			reject(error);
			return;
		}
        // console.log(rows)
		resolve(product);
	});
});
const nueva_sucursal = (id) => new Promise((resolve, reject) => {

    let ejecutivointerno = 'SELECT `id_empleado`, `nombres`,concat(`nombres`," ",`apellidos`) AS ejecutivointerno FROM `jr_empleado` WHERE `id_departamento` = 4';
    let ejecutivo_externo = 'SELECT ee.`id_ejecutivo`, ee.`nombre`,e.`nombre_empresa` FROM `jr_ejecutivo_externo` ee, `jr_empresa` e WHERE ee.`id_empresa` = e.`id_empresa` AND `estado` = "Activo" AND e.`id_categoria` = 1';
    let banco = 'SELECT `id_banco`, `nombre` FROM `jr_banco`';
    let tipo_afiliacion = 'SELECT `id_tipo_afiliacion`, `tipo_afiliacion` FROM `jr_tipo_afiliacion`';
    let categoria = 'SELECT `id_categoria`, `categoria`, `img_src` FROM `jr_categoria_neg`  ORDER BY `categoria` ASC';
    let provincias = 'SELECT * FROM `jr_provincia` ORDER BY `provincia` ASC';
    let pago_electronico = 'SELECT `id_pago_electronico`, `tipo_pago_electronico` FROM `jr_pago_electronico`';
    let ejecutivo_pago = 'SELECT ee.`id_ejecutivo`, ee.`nombre`,e.`nombre_empresa` FROM `jr_ejecutivo_externo` ee, `jr_empresa` e WHERE ee.`id_empresa` = e.`id_empresa` AND `estado` = "Activo" AND e.`id_categoria` = 2';
    let negocio_general = 'SELECT `id_negocio`, `razon_social`, `rnc`, `id_empleado`, `cant_sucursales`, `red_social`, `sap_acreedor`, `sap_deudor`, `fecha_creacion`, `estado`, `id_tipo_afiliacion`, `id_pago_electronico` FROM `jr_negocio_general` WHERE `id_negocio` = ?';
    let informacion_bancaria = 'SELECT `id_informacion_bancaria`, `banco_tipo_cuenta`, `cuenta_debito`, `cuenta_credito`, `frecuencia_pago_cheque`, `id_banco`, `id_negocio` FROM `jr_informacion_bancaria` WHERE `id_negocio` = ?';
    let producto = 'SELECT p.`id_producto`, p.`producto` FROM `jr_producto` p,`jr_negocio_vs_producto` np WHERE np.`id_producto` = p.`id_producto` AND np.`id_negocio` = ?';
    let productos = 'SELECT `id_producto`, `producto` FROM `jr_producto`';
    let zonas = 'SELECT `id_zona`, `zona` FROM `jr_zona`';
    let subzonas = 'SELECT `id_subzona`, `subzona`, `id_zona` FROM `jr_subzona`';

	Promise.all([
        localQuery(ejecutivointerno,),
        localQuery(ejecutivo_externo,),
        localQuery(banco,),
        localQuery(tipo_afiliacion,),
        localQuery(categoria,),
        localQuery(provincias,),
        localQuery(pago_electronico,),
        localQuery(ejecutivo_pago,),
        localQuery(negocio_general,id),
        localQuery(informacion_bancaria,id),
        localQuery(producto,id),
        localQuery(productos,),
        localQuery(zonas,),
        localQuery(subzonas,),

    ]).then(data => {
        resolve(data);

    }, reject => {
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const sucursal_edit = (id,su) => new Promise((resolve, reject) => {

    let ejecutivointerno = 'SELECT `id_empleado`, `nombres`,concat(`nombres`," ",`apellidos`) AS ejecutivointerno FROM `jr_empleado` WHERE `id_departamento` = 4';
    let ejecutivo_externo = 'SELECT ee.`id_ejecutivo`, ee.`nombre`,e.`nombre_empresa` FROM `jr_ejecutivo_externo` ee, `jr_empresa` e WHERE ee.`id_empresa` = e.`id_empresa` AND `estado` = "Activo" AND e.`id_categoria` = 1';
    let banco = 'SELECT `id_banco`, `nombre` FROM `jr_banco`';
    let tipo_afiliacion = 'SELECT `id_tipo_afiliacion`, `tipo_afiliacion` FROM `jr_tipo_afiliacion`';
    let categoria = 'SELECT `id_categoria`, `categoria`, `img_src` FROM `jr_categoria_neg`  ORDER BY `categoria` ASC';
    let provincias = 'SELECT * FROM `jr_provincia` ORDER BY `provincia` ASC';
    let pago_electronico = 'SELECT `id_pago_electronico`, `tipo_pago_electronico` FROM `jr_pago_electronico`';
    let ejecutivo_pago = 'SELECT ee.`id_ejecutivo`, ee.`nombre`,e.`nombre_empresa` FROM `jr_ejecutivo_externo` ee, `jr_empresa` e WHERE ee.`id_empresa` = e.`id_empresa` AND `estado` = "Activo" AND e.`id_categoria` = 2';
    let negocio_general = 'SELECT `id_negocio`, `razon_social`, `rnc`, `id_empleado`, `cant_sucursales`, `red_social`, `sap_acreedor`, `sap_deudor`, `fecha_creacion`, `estado`, `id_tipo_afiliacion`, `id_pago_electronico` FROM `jr_negocio_general` WHERE `id_negocio` = ?';
    let informacion_bancaria = 'SELECT `id_informacion_bancaria`, `banco_tipo_cuenta`, `cuenta_debito`, `cuenta_credito`, `frecuencia_pago_cheque`, `id_banco`, `id_negocio` FROM `jr_informacion_bancaria` WHERE `id_negocio` = ?';
    let sucursal = 'SELECT `id_sucursal`, `nombre_sucursal`, `id_empleado`, `id_provincia`, `id_municipio`, `id_sector`, `direccion`, `codigo_postal`, `telefono`, `fax`, `email`, `cantidad_lectores`, `codigo_fidelium`, `descuento_redencion`, `descuento_otorgado`, `limite_piso`, `apertura`, `cierre`, `geo`, `fecha_creacion`, `referencia1`, `referencia2`, `referencia3`, `id_negocio`, `id_informacion_bancaria`, `id_categoria`, `estado`, `id_zona`, `id_subzona` FROM `jr_sucursal` WHERE `id_sucursal` = ?';
    let municipio = 'SELECT * FROM `jr_municipio` ORDER BY `municipio` ASC';
    let sector = 'SELECT `id_sector`, `sector`, `id_municipio` FROM `jr_sector` ORDER BY `sector` ASC';
    let vscarnet = 'SELECT `id_afiliado`, `merchand_id`, `id_sucursal` FROM `jr_afiliados_cardnet` WHERE `id_sucursal` = ?';
    let vs_sucursal = 'SELECT `id_empleado`, `id_persona`, `id_sucursal`, `id_ejecutivo`, `id_ejecutivo_pago` FROM `jr_persona_vs_sucursal` WHERE `id_sucursal` = ?';
    let responsable = 'SELECT ps.`id_persona`,ps.`nombre_persona_suc`, ps.`cargo_pers_suc`, ps.`cedula`, ps.`telefono_pers_suc`, ps.`correo`, ps.`estado`, ps.`fecha_creacion`, pvs.`id_sucursal` FROM `jr_persona_sucursal` ps, `jr_persona_vs_sucursal` pvs WHERE ps.`id_persona` =  pvs.`id_persona` AND pvs.`id_sucursal` = ?;';
    let producto = 'SELECT p.`id_producto`, p.`producto` FROM `jr_producto` p,`jr_negocio_vs_producto` np WHERE np.`id_producto` = p.`id_producto` AND np.`id_negocio` = ?';
    let productos = 'SELECT `id_producto`, `producto` FROM `jr_producto`';
    let zonas = 'SELECT `id_zona`, `zona` FROM `jr_zona`';

	Promise.all([
        localQuery(ejecutivointerno,),
        localQuery(ejecutivo_externo,),
        localQuery(banco,),
        localQuery(tipo_afiliacion,),
        localQuery(categoria,),
        localQuery(provincias,),
        localQuery(pago_electronico,),
        localQuery(ejecutivo_pago,),
        localQuery(negocio_general,id),
        localQuery(informacion_bancaria,id),
        localQuery(sucursal,su),
        localQuery(municipio,),
        localQuery(sector,),
        localQuery(vscarnet,su),
        localQuery(vs_sucursal,su),
        localQuery(responsable,su),
        localQuery(producto,id),
        localQuery(productos,),
        localQuery(zonas,),
    ]).then(data => {
        resolve(data);

    }, reject => {
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

const sucursal_historial = (su) => new Promise((resolve, reject) => {
    let sucursal = 'SELECT suc.`id_sucursal`, suc.`nombre_sucursal`, suc.`id_empleado`, suc.`id_provincia`, suc.`id_municipio`, suc.`id_sector`, suc.`direccion`, suc.`codigo_postal`, suc.`telefono`, suc.`fax`, suc.`email`, suc.`cantidad_lectores`, suc.`codigo_fidelium`, suc.`descuento_redencion`, suc.`descuento_otorgado`, suc.`limite_piso`, suc.`apertura`, suc.`cierre`, suc.`geo`, suc.`fecha_creacion`, suc.`referencia1`, suc.`referencia2`, suc.`referencia3`, suc.`id_negocio`, suc.`id_informacion_bancaria`, suc.`id_categoria`, suc.`estado`, suc.`id_zona`,(SELECT `zona` FROM `jr_zona` WHERE `id_zona` = suc.`id_zona`) AS zona, suc.`id_subzona`, (SELECT `subzona` FROM `jr_subzona` WHERE `id_subzona` = suc.`id_subzona`) AS subzona FROM `jr_sucursal` suc WHERE `id_sucursal` = ?';
    let vscarnet = 'SELECT `id_afiliado`, `merchand_id`, `id_sucursal` FROM `jr_afiliados_cardnet` WHERE `id_sucursal` = ?';
    let vs_sucursal = 'SELECT `id_empleado`, `id_persona`, `id_sucursal`, `id_ejecutivo`, `id_ejecutivo_pago` FROM `jr_persona_vs_sucursal` WHERE `id_sucursal` = ?';
    let responsable = 'SELECT ps.`id_persona`,ps.`nombre_persona_suc`, ps.`cargo_pers_suc`, ps.`cedula`, ps.`telefono_pers_suc`, ps.`correo`, ps.`estado`, ps.`fecha_creacion`, pvs.`id_sucursal` FROM `jr_persona_sucursal` ps, `jr_persona_vs_sucursal` pvs WHERE ps.`id_persona` =  pvs.`id_persona` AND pvs.`id_sucursal` = ?;';

	Promise.all([
        localQuery(sucursal,su),
        localQuery(vscarnet,su),
        localQuery(vs_sucursal,su),
        localQuery(responsable,su),
    ]).then(data => {
        resolve(data);

    }, reject => {
        console.log("No se pudo cargar información de formulario. " + reject);
    });
});

module.exports = {
	list,
    nuevo,
    save_negocio,
    creadopor,
    nombre_empleado,
    correo_empleado,
    nombre_ejecutivo_externo,
    laprovincia,
    elmunicipio,
    elsector,
    lacategoria,
    lainformacion_bancaria,
    tipo_afiliacion,
    negocio_general,
    update_negocio,
    update_producto,
    delete_producto_negocio,
    save_informacion_bancaria,
    historial,
    pago_electronico,
    producto,
    save_sucursal,
    save_afiliado,
    delete_afiliado,
    save_persona_sucursal,
    update_persona_sucursal,
    edit,
    list_sucursales,
    list_sucursal,
    nueva_sucursal,
    sucursal_edit,
    update_sucursal,
    delete_vs_sucursales,
    encargados_dep,
    insert_path,
    actualiza_proceso_negocio
};