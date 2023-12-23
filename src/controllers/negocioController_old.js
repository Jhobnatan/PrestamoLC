const { list } = require('../services/negocioService');


const { encargado } = require("./form_dataController");

const controller = {};

controller.show= (req, res) =>{
    res.render('clientes')
}
function formatFecha(fecha){
    let fechavieja = new Date(fecha).toLocaleDateString();                                                                   
    let nueva =fechavieja.split("/");
    if(nueva[1].length ==1){
        nueva[1]="0"+nueva[1];
        }
    if(nueva[0].length ==1){
        nueva[0]="0"+nueva[0];
        }
    fecha = nueva[2]+'-'+nueva[1] +'-'+nueva[0];
    return fecha;
}
controller.list= async (req, res) =>{
    const negocios = await list()
    res.render('negocio_list',{
        data: negocios,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.new = (req, res) =>{
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM `jr_empleado`', (erro, empleados) =>{
            if(err){
                res.json(err);
            }
            
            conn.query('SELECT * FROM `jr_nacionalidad`', (erro, nacionalidades) =>{
                if(err){
                    res.json(err);
                }
                
                conn.query('SELECT * FROM `jr_provincia`', (erro, provincias) =>{
                    if(err){
                        res.json(err);
                    }
                    
                        conn.query('SELECT * FROM `jr_empresa`', (erro, empresas) =>{
                            if(err){
                                res.json(err);
                            }
                            
                            conn.query('SELECT * FROM `jr_departamento`', (erro, departamentos) =>{
                                if(err){
                                    res.json(err);
                                }
                                
                                conn.query('SELECT * FROM `jr_puesto`', (erro, puestos) =>{
                                    if(err){
                                        res.json(err);
                                    }
                                    
                                    conn.query('SELECT * FROM `jr_tipo_empleado`', (erro, modalidades) =>{
                                        if(err){
                                            res.json(err);
                                        }
                                        
                                        conn.query('SELECT * FROM `jr_grado`', (erro, grados) =>{
                                            if(err){
                                                res.json(err);
                                            }
                                            
                                            conn.query('SELECT * FROM `jr_sueldo`', (erro, sueldos) =>{
                                                if(err){
                                                    res.json(err);
                                                }
                                                
                                                conn.query('SELECT * FROM `jr_grado_academico`', (erro, grados_ac) =>{
                                                    if(err){
                                                        res.json(err);
                                                    }
                                                    
                                                conn.query('SELECT * FROM `jr_nivel`', (erro, niveles) =>{
                                                    if(err){
                                                        res.json(err);
                                                    }
                                                    
                                                    conn.query('SELECT * FROM `jr_estado_empleado` ORDER BY `descripcion` ASC', (erro, estados) =>{
                                                        if(err){
                                                            res.json(err);
                                                        }
                                                        
                                                        conn.query('SELECT * FROM `jr_relacion`', (err, relaciones) =>{
                                                            if(err){
                                                                res.json(err);
                                                            }
                                                            
                                                                res.render('empleados',{
                                                                    data: empleados,
                                                                    nac: nacionalidades,
                                                                    prov: provincias,
                                                                    emp: empresas,
                                                                    dep: departamentos,
                                                                    pue: puestos,
                                                                    mod: modalidades,
                                                                    gra: grados,
                                                                    suel: sueldos,
                                                                    graac: grados_ac,
                                                                    niv: niveles,
                                                                    est: estados,
                                                                    rel: relaciones,
                                                                    accesos: req.jhobrosoftsession.accesos
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    })
}

controller.edit = (req, res) =>{
    const { id } =req.params;
    //console.log(id)
    const data = req.body;
    const roll = req.jhobrosoftsession.rol;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM `jr_empleado`', (erro, empleados) =>{
            if(err){
                res.json(err);
            }
            
            conn.query('SELECT * FROM `jr_nacionalidad`', (erro, nacionalidades) =>{
                if(err){
                    res.json(err);
                }
                
                conn.query('SELECT * FROM `jr_provincia`', (erro, provincias) =>{
                    if(err){
                        res.json(err);
                    }
                    
                        conn.query('SELECT * FROM `jr_empresa`', (erro, empresas) =>{
                            if(err){
                                res.json(err);
                            }
                            
                            conn.query('SELECT * FROM `jr_departamento`', (erro, departamentos) =>{
                                if(err){
                                    res.json(err);
                                }
                                
                                conn.query('SELECT * FROM `jr_puesto`', (erro, puestos) =>{
                                    if(err){
                                        res.json(err);
                                    }
                                    
                                    conn.query('SELECT * FROM `jr_tipo_empleado`', (erro, modalidades) =>{
                                        if(err){
                                            res.json(err);
                                        }
                                        
                                        conn.query('SELECT * FROM `jr_grado`', (erro, grados) =>{
                                            if(err){
                                                res.json(err);
                                            }
                                            
                                            conn.query('SELECT * FROM `jr_sueldo`', (erro, sueldos) =>{
                                                if(err){
                                                    res.json(err);
                                                }
                                                
                                                conn.query('SELECT * FROM `jr_grado_academico`', (erro, grados_ac) =>{
                                                    if(err){
                                                        res.json(err);
                                                    }
                                                    
                                                conn.query('SELECT * FROM `jr_nivel`', (erro, niveles) =>{
                                                    if(err){
                                                        res.json(err);
                                                    }
                                                    
                                                    conn.query('SELECT * FROM `jr_estado_empleado` ORDER BY `descripcion` ASC', (erro, estados) =>{
                                                        if(err){
                                                            res.json(err);
                                                        }
                                                        
                                                        conn.query('SELECT * FROM `jr_municipio`', (err, municipios) =>{
                                                            if(err){
                                                                res.json(err);
                                                            }
                                                            
                                                            conn.query('SELECT * FROM `jr_sector`', (err, sectores) =>{
                                                                if(err){
                                                                    res.json(err);
                                                                }
                                                                
                                                                conn.query('SELECT * FROM `jr_empleado` WHERE id_empleado =?',[id], (err, empleado) =>{
                                                                    if(err){
                                                                        res.json(err);
                                                                    }
                                                                    
                                                                conn.query('SELECT * FROM `jr_empleado` WHERE `id_departamento` =?',[empleado[0].id_departamento], (err, encargados) =>{
                                                                    if(err){
                                                                        res.json(err);
                                                                    }
                                                                    conn.query('SELECT * FROM `jr_relacion`', (err, relaciones) =>{
                                                                        if(err){
                                                                            res.json(err);
                                                                        }
                                                                        conn.query('SELECT * FROM `jr_salida`', (err, salidas) =>{
                                                                            if(err){
                                                                                res.json(err);
                                                                            }
                                                                            empleado[0].fecha_nacimiento = formatFecha(empleado[0].fecha_nacimiento);
                                                                            empleado[0].fecha_entrada = formatFecha(empleado[0].fecha_entrada);
    
                                                                            //console.log(salidas[0].salida)
                                                                            //console.log(encargados[0].id_empleado)
                                                                                //console.log(empleado[0].fecha_nacimiento);    
                                                                               
                                                                                    res.render('empleado_edit',{
                                                                                        empleado: empleado[0],
                                                                                        data: empleados,
                                                                                        nac: nacionalidades,
                                                                                        prov: provincias,
                                                                                        emp: empresas,
                                                                                        dep: departamentos,
                                                                                        pue: puestos,
                                                                                        mod: modalidades,
                                                                                        gra: grados,
                                                                                        suel: sueldos,
                                                                                        graac: grados_ac,
                                                                                        niv: niveles,
                                                                                        est: estados,
                                                                                        mun: municipios,
                                                                                        sec: sectores,
                                                                                        enc: encargados,
                                                                                        rel:relaciones,
                                                                                        sal: salidas,
                                                                                        rol : roll,
                                                                                        accesos: req.jhobrosoftsession.accesos
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
           
        });
    })
}
// var sqlInsert = 'INSERT INTO `jr_movimiento_empleado`(`id_salida_empleado`, `id_salida`, `id_empleado`, `motivo`, `realizadopor`, `fecha`, `accion`) VALUES (null, ?, ?, ?, ?, ?,"salida")';
//                     let values = [salida,id,motivo,realizadopor,fecha_salida];
controller.edit_user = (req, res) =>{
    const { id } =req.params; //SELECT `id_usuario`, `usuario`, `clave`, `id_empleado` FROM `jr_usuario` WHERE 1
    // console.log(id)
    if("" !=id){
        var sql = 'SELECT `id_usuario`, `usuario`, `clave`, `id_empleado` FROM `jr_usuario` WHERE `id_empleado`=?';
        req.getConnection((err, conn) =>{  
            conn.query(sql,[id], (err, usuario) =>{
                        //console.log(salida)
                        id_usuario = 0;
                        if(usuario[0]){
                            id_usuario = usuario[0].id_usuario;
                        }
                        conn.query('SELECT `id_grupo`, `descripcion` FROM `jr_grupo`', (err, grupos_acceso) =>{
                            conn.query('SELECT `id_grupo`, `id_usuario` FROM `jr_usuario_vs_grupo` WHERE `id_usuario` = ?',[id_usuario], (err, grupos_usuario) =>{
                                res.render('usuario',{
                                    us: usuario[0],
                                    ug: grupos_usuario,
                                    gru:grupos_acceso,
                                    emp: id,
                                    accesos: req.jhobrosoftsession.accesos
                                });
                            });
                        });
                    });
        })
    }else{
        res.redirect('/empleado');
    }
}

controller.save_user = (req, res) =>{
    const { id } =req.params;
    const data = req.body;
    // console.log(data)
    var {id_usuario} = req.body;
    const {usuario} = req.body;
    const {clave} = req.body;
    
    const values = [usuario, clave, id]
    var sql ='INSERT INTO `jr_usuario`(`id_usuario`, `usuario`, `clave`, `id_empleado`) VALUES ( "",?, ?, ?)';
    if(usuario !=''){
        req.getConnection((err, conn) =>{
            if(err){
                res.json(err);
            }
            if(id_usuario==''){
                conn.query(sql,values, (err, insertedUser) =>{
                    // console.log(insertedUser)
                    id_usuario = insertedUser.insertId;
                });
            }else{
                var sqlUpdate = 'UPDATE `jr_usuario` SET `usuario`=?,`clave`=? WHERE `id_usuario`=?';
                const valuesUpdate = [usuario, clave, id_usuario]; 
                // console.log(valuesUpdate)
                conn.query(sqlUpdate,valuesUpdate, (err, updated) =>{
                    console.log(err);
                });
            }
            var datos = Object.keys(req.body);
            datos = datos.slice(0, datos.length-3);

            conn.query('DELETE FROM `jr_usuario_vs_grupo` WHERE `id_usuario` = ?',[id_usuario], (err, empresa) =>{
                // console.log(id)
                for (i = 0; i < datos.length; i++) {
                    // console.log(datos[i]);
                    conn.query('INSERT INTO `jr_usuario_vs_grupo`(`id_grupo`, `id_usuario`) VALUES (?,?)',[datos[i],id_usuario], (err, grupo_acceso) =>{   
                        if(err){
                            res.json(err);
                        }
                    });
                  } 
                
                //   res.redirect('/grupo_acceso');
            });



            
        })
        res.redirect('/empleado');
    }else{
        res.redirect('/empleado');
    }
}

controller.licencia = (req, res) =>{
    const { id } =req.params;
    //console.log(id)
    const data = req.body;
    const roll = req.jhobrosoftsession.rol;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM `jr_empleado`', (erro, empleados) =>{
            if(err){
                res.json(err);
            }
            
            conn.query('SELECT * FROM `jr_nacionalidad`', (erro, nacionalidades) =>{
                if(err){
                    res.json(err);
                }
                
                conn.query('SELECT * FROM `jr_provincia`', (erro, provincias) =>{
                    if(err){
                        res.json(err);
                    }
                    
                        conn.query('SELECT * FROM `jr_empresa`', (erro, empresas) =>{
                            if(err){
                                res.json(err);
                            }
                            
                            conn.query('SELECT * FROM `jr_departamento`', (erro, departamentos) =>{
                                if(err){
                                    res.json(err);
                                }
                                
                                conn.query('SELECT * FROM `jr_puesto`', (erro, puestos) =>{
                                    if(err){
                                        res.json(err);
                                    }
                                    
                                    conn.query('SELECT * FROM `jr_tipo_empleado`', (erro, modalidades) =>{
                                        if(err){
                                            res.json(err);
                                        }
                                        
                                        conn.query('SELECT * FROM `jr_grado`', (erro, grados) =>{
                                            if(err){
                                                res.json(err);
                                            }
                                            
                                            conn.query('SELECT * FROM `jr_sueldo`', (erro, sueldos) =>{
                                                if(err){
                                                    res.json(err);
                                                }
                                                
                                                conn.query('SELECT * FROM `jr_grado_academico`', (erro, grados_ac) =>{
                                                    if(err){
                                                        res.json(err);
                                                    }
                                                    
                                                conn.query('SELECT * FROM `jr_nivel`', (erro, niveles) =>{
                                                    if(err){
                                                        res.json(err);
                                                    }
                                                    
                                                    conn.query('SELECT * FROM `jr_estado_empleado` ORDER BY `descripcion` ASC', (erro, estados) =>{
                                                        if(err){
                                                            res.json(err);
                                                        }
                                                        
                                                        conn.query('SELECT * FROM `jr_municipio`', (err, municipios) =>{
                                                            if(err){
                                                                res.json(err);
                                                            }
                                                            
                                                            conn.query('SELECT * FROM `jr_sector`', (err, sectores) =>{
                                                                if(err){
                                                                    res.json(err);
                                                                }
                                                                
                                                                conn.query('SELECT * FROM `jr_empleado` WHERE id_empleado =?',[id], (err, empleado) =>{
                                                                    if(err){
                                                                        res.json(err);
                                                                    }
                                                                    
                                                                conn.query('SELECT * FROM `jr_empleado` WHERE `id_departamento` =?',[empleado[0].id_departamento], (err, encargados) =>{
                                                                    if(err){
                                                                        res.json(err);
                                                                    }
                                                                    conn.query('SELECT * FROM `jr_relacion`', (err, relaciones) =>{
                                                                        if(err){
                                                                            res.json(err);
                                                                        }
                                                                        conn.query('SELECT * FROM `jr_tipo_licencia`', (err, tipos_licencia) =>{
                                                                            if(err){
                                                                                res.json(err);
                                                                            }
                                                                            empleado[0].fecha_nacimiento = formatFecha(empleado[0].fecha_nacimiento);
                                                                            empleado[0].fecha_entrada = formatFecha(empleado[0].fecha_entrada);
    
                                                                            //console.log(salidas[0].salida)
                                                                            //console.log(encargados[0].id_empleado)
                                                                                //console.log(empleado[0].fecha_nacimiento);    
                                                                               
                                                                                    res.render('empleado_licencia',{
                                                                                        empleado: empleado[0],
                                                                                        data: empleados,
                                                                                        nac: nacionalidades,
                                                                                        prov: provincias,
                                                                                        emp: empresas,
                                                                                        dep: departamentos,
                                                                                        pue: puestos,
                                                                                        mod: modalidades,
                                                                                        gra: grados,
                                                                                        suel: sueldos,
                                                                                        graac: grados_ac,
                                                                                        niv: niveles,
                                                                                        est: estados,
                                                                                        mun: municipios,
                                                                                        sec: sectores,
                                                                                        enc: encargados,
                                                                                        rel:relaciones,
                                                                                        tipo_lic: tipos_licencia,
                                                                                        rol : roll,
                                                                                        accesos: req.jhobrosoftsession.accesos
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
           
        });
    })
}

controller.guardar_lic = (req,res) =>{
    const { id } =req.params;
    const data = req.body;
    console.log(data)
    const id_tipo_licencia = data.tipo_lic;
    const fecha_salida = data.fecha_salida;
    const fecha_entrada = data.fecha_entrada;
    const constancia = data.constancia;
    const motivo_lic = data.motivo_lic;
    const estado_lic = data.estado_lic;
    let id_rrhh = req.jhobrosoftsession.id_empleado;
    //console.log(data.fecha);
    //console.log('mis datos son'+data.name+"y mas nada");
    const values = [id, id_tipo_licencia, fecha_salida,fecha_entrada, motivo_lic,constancia,id_rrhh,estado_lic]
    var sql ='INSERT INTO `jr_licencia`(`id_licencia`, `id_empleado`, `id_tipo_licencia`, `fecha_salida`, `fecha_entrada`, `fecha_solicitud`, `motivo`, `constancia`, `id_rrhh`, `estado`) VALUES ( "",?, ?, ?, ?, now(), ?, ?, ?, ?)';
    if(data.name !=''){
        req.getConnection((err, conn) =>{
            if(err){
                res.json(err);
            }
            conn.query(sql,values, (err, puesto) =>{
                //console.log(err)
                res.redirect('/empleado');
                //res.send("funciona el insert")
            });
        })
    }else{
        res.redirect('/empleado');
    }
    
    
}
controller.amonestacion = (req, res) =>{
    const { id } =req.params;
    //console.log(id)
    const data = req.body;
    const roll = req.jhobrosoftsession.rol;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM `jr_empleado`', (erro, empleados) =>{
            if(err){
                res.json(err);
            }
            
            conn.query('SELECT * FROM `jr_nacionalidad`', (erro, nacionalidades) =>{
                if(err){
                    res.json(err);
                }
                
                conn.query('SELECT * FROM `jr_provincia`', (erro, provincias) =>{
                    if(err){
                        res.json(err);
                    }
                    
                        conn.query('SELECT * FROM `jr_empresa`', (erro, empresas) =>{
                            if(err){
                                res.json(err);
                            }
                            
                            conn.query('SELECT * FROM `jr_departamento`', (erro, departamentos) =>{
                                if(err){
                                    res.json(err);
                                }
                                
                                conn.query('SELECT * FROM `jr_puesto`', (erro, puestos) =>{
                                    if(err){
                                        res.json(err);
                                    }
                                    
                                    conn.query('SELECT * FROM `jr_tipo_empleado`', (erro, modalidades) =>{
                                        if(err){
                                            res.json(err);
                                        }
                                        
                                        conn.query('SELECT * FROM `jr_grado`', (erro, grados) =>{
                                            if(err){
                                                res.json(err);
                                            }
                                            
                                            conn.query('SELECT * FROM `jr_sueldo`', (erro, sueldos) =>{
                                                if(err){
                                                    res.json(err);
                                                }
                                                
                                                conn.query('SELECT * FROM `jr_grado_academico`', (erro, grados_ac) =>{
                                                    if(err){
                                                        res.json(err);
                                                    }
                                                    
                                                conn.query('SELECT * FROM `jr_nivel`', (erro, niveles) =>{
                                                    if(err){
                                                        res.json(err);
                                                    }
                                                    
                                                    conn.query('SELECT * FROM `jr_estado_empleado` ORDER BY `descripcion` ASC', (erro, estados) =>{
                                                        if(err){
                                                            res.json(err);
                                                        }
                                                        
                                                        conn.query('SELECT * FROM `jr_municipio`', (err, municipios) =>{
                                                            if(err){
                                                                res.json(err);
                                                            }
                                                            
                                                            conn.query('SELECT * FROM `jr_sector`', (err, sectores) =>{
                                                                if(err){
                                                                    res.json(err);
                                                                }
                                                                
                                                                conn.query('SELECT * FROM `jr_empleado` WHERE id_empleado =?',[id], (err, empleado) =>{
                                                                    if(err){
                                                                        res.json(err);
                                                                    }
                                                                    
                                                                conn.query('SELECT * FROM `jr_empleado` WHERE `id_departamento` =?',[empleado[0].id_departamento], (err, encargados) =>{
                                                                    if(err){
                                                                        res.json(err);
                                                                    }
                                                                    conn.query('SELECT * FROM `jr_relacion`', (err, relaciones) =>{
                                                                        if(err){
                                                                            res.json(err);
                                                                        }
                                                                        conn.query('SELECT * FROM `jr_tipo_licencia`', (err, tipos_licencia) =>{
                                                                            if(err){
                                                                                res.json(err);
                                                                            }
                                                                            empleado[0].fecha_nacimiento = formatFecha(empleado[0].fecha_nacimiento);
                                                                            empleado[0].fecha_entrada = formatFecha(empleado[0].fecha_entrada);
    
                                                                            //console.log(salidas[0].salida)
                                                                            //console.log(encargados[0].id_empleado)
                                                                                //console.log(empleado[0].fecha_nacimiento);    
                                                                               
                                                                                    res.render('empleado_amonestacion',{
                                                                                        empleado: empleado[0],
                                                                                        data: empleados,
                                                                                        nac: nacionalidades,
                                                                                        prov: provincias,
                                                                                        emp: empresas,
                                                                                        dep: departamentos,
                                                                                        pue: puestos,
                                                                                        mod: modalidades,
                                                                                        gra: grados,
                                                                                        suel: sueldos,
                                                                                        graac: grados_ac,
                                                                                        niv: niveles,
                                                                                        est: estados,
                                                                                        mun: municipios,
                                                                                        sec: sectores,
                                                                                        enc: encargados,
                                                                                        rel:relaciones,
                                                                                        tipo_lic: tipos_licencia,
                                                                                        rol : roll,
                                                                                        accesos: req.jhobrosoftsession.accesos
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
           
        });
    })
}

controller.guardar_amonestacion = (req,res) =>{
    const { id } =req.params;
    const data = req.body;
    // console.log(data)
    const id_autoriza = data.encargado;
    const motivo = data.motivo;
    const tipo = data.tipo;
    let id_rrhh = req.jhobrosoftsession.id_empleado;
    //console.log(data.fecha);
    let path_doc = 'amonestacion\\'+ req.file.filename;//req.file.path;
    //console.log('mis datos son'+data.name+"y mas nada");
    const values = [id, tipo, id_rrhh, id_autoriza, motivo,path_doc]
    var sql ='INSERT INTO `jr_amonestacion`(`id`, `id_empleado`, `tipo`, `id_rrhh`, `id_autoriza`, `fecha`, `motivo`, `path_doc`) VALUES ( "",?, ?, ?, ?, now(), ?, ?)';
    if(data.name !=''){
        req.getConnection((err, conn) =>{
            if(err){
                res.json(err);
            }
            conn.query(sql,values, (err, puesto) =>{
                console.log(err)
                res.redirect('/empleado');
                //res.send("funciona el insert")
            });
        })
    }else{
        res.redirect('/empleado');
    }
    
    
}

controller.save = (req,res) =>{
    const data = req.body;
    //console.log(data.cedula);

    let cedula = data.cedula;
    let nombres = data.nombres;
    let apellidos = data.apellidos;
    let usuario = data.cedula;//como el usuario debe de ser unico se le puso la cedula de manera temporal
    let codigo = data.codigo;
    let tarjeta_punto = data.tarjeta_punto;
    let id_empresa = data.empresa;
    let id_departamento = data.departamento;
    let id_puesto = data.puesto;
    let email_personal = data.email_personal;
    let fecha_nacimiento = data.fecha_nacimiento;
    let tel = data.telefono;
    let cel = data.celular;
    let sexo = data.sexo;
    let estado_civil = data.estado_civil;
    let nhijos = data.nhijos;
    let id_provincia = data.provincia;
    let id_municipio = data.municipio;
    let id_sector = data.sector;
    let direccion = data.direccion;
    let email_institucional = data.email_institucional;
    let id_estado = data.estado;
    let id_grado_ac = data.grado_ac;
    let id_nivel = data.nivel;
    let id_encargado = data.encargado;
    let fecha_entrada = data.fecha_entrada;
    let id_grado = data.grado;
    let id_sueldo = data.sueldo;
    let id_tipo_empleado = data.tipo_empleado;
    let id_nacionalidad = data.nacionalidad;
    let contacto_emergencia = data.contacto;
    let id_relacion = data.relacion;
    let tel_emergencia = data.tel;
    let cel_emergencia = data.cel;
    let enfermedad = data.enfermedad;
    let tipo_enfermedad = data.tipo_enfermedad;
    let alergia = data.alergia;
    let tipo_alergia = data.tipo_alergia;
    let medicacion = data.medicacion;
    let tipo_medicamento = data.tipo_medicamento;
    let tarjeta_combustible = data.tarjeta_combustible;
    let monto_combustible = data.monto_combustible;
    let monto_vehiculo = data.monto_vehiculo;
    
    if(data.nombre_empleado !=''){
        var sql = 'INSERT INTO `jr_empleado`(`cedula`, `nombres`, `apellidos`, `usuario`, `codigo`, `tarjeta_punto`, `id_empresa`, `id_departamento`, `id_puesto`, `email_personal`, `fecha_nacimiento`, `tel`, `cel`, `sexo`, `estado_civil`, `nhijos`, `id_provincia`, `id_municipio`, `id_sector`, `direccion`, `email_institucional`, `id_estado`, `id_grado_ac`, `id_nivel`, `id_encargado`, `fecha_entrada`, `id_grado`, `id_sueldo`, `id_tipo_empleado`, `id_nacionalidad`, `contacto_emergencia`, `id_relacion`, `tel_emergencia`, `cel_emergencia`, `enfermedad`, `tipo_enfermedad`, `alergia`, `tipo_alergia`, `medicacion`, `tipo_medicamento`, `tarjeta_combustible`, `monto_combustible`, `monto_vehiculo`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        var values = [cedula, nombres, apellidos, usuario, codigo, tarjeta_punto, id_empresa, id_departamento, id_puesto, email_personal, fecha_nacimiento, tel, cel, sexo, estado_civil, nhijos, id_provincia, id_municipio, id_sector, direccion, email_institucional, id_estado, id_grado_ac, id_nivel, id_encargado, fecha_entrada, id_grado, id_sueldo, id_tipo_empleado, id_nacionalidad, contacto_emergencia, id_relacion, tel_emergencia, cel_emergencia, enfermedad, tipo_enfermedad, alergia, tipo_alergia, medicacion, tipo_medicamento,tarjeta_combustible,monto_combustible,monto_vehiculo];

        req.getConnection((err, conn) =>{  
            conn.query(sql,values, (err, empleado) =>{
                res.redirect('/empleado');
            });
        })
    }else{
        res.redirect('/empleado');
    }
    
    
}

controller.edita = (req,res)=>{
    const { id } =req.params;
    //console.log(id)
    const data = req.body;
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM `jr_empleado` WHERE id_empleado =?',[id], (err, empleado) =>{
            res.render('empleado_edit', {
                data: empleado[0],
                accesos: req.jhobrosoftsession.accesos
            });
        });
    })
}

controller.update = (req,res)=>{
    const { id } =req.params;
    const data = req.body;

    let cedula = data.cedula;
    let nombres = data.nombres;
    let apellidos = data.apellidos;
    let usuario = data.cedula;//como el usuario debe de ser unico se le puso la cedula de manera temporal
    let codigo = data.codigo;
    let tarjeta_punto = data.tarjeta_punto;
    let id_empresa = data.empresa;
    let id_departamento = data.departamento;
    let id_puesto = data.puesto;
    let email_personal = data.email_personal;
    let fecha_nacimiento = data.fecha_nacimiento;
    let tel = data.telefono;
    let cel = data.celular;
    let sexo = data.sexo;
    let estado_civil = data.estado_civil;
    let nhijos = data.nhijos;
    let id_provincia = data.provincia;
    let id_municipio = data.municipio;
    let id_sector = data.sector;
    let direccion = data.direccion;
    let email_institucional = data.email_institucional;
    let id_estado = data.estado;
    let id_grado_ac = data.grado_ac;
    let id_nivel = data.nivel;
    let id_encargado = data.encargado;
    let fecha_entrada = data.fecha_entrada;
    let id_grado = data.grado;
    let id_sueldo = data.sueldo;
    let id_tipo_empleado = data.tipo_empleado;
    let id_nacionalidad = data.nacionalidad;
    let contacto_emergencia = data.contacto;
    let id_relacion = data.relacion;
    let tel_emergencia = data.tel;
    let cel_emergencia = data.cel;
    let enfermedad = data.enfermedad;
    let tipo_enfermedad = data.tipo_enfermedad;
    let alergia = data.alergia;
    let tipo_alergia = data.tipo_alergia;
    let medicacion = data.medicacion;
    let tipo_medicamento = data.tipo_medicamento;
    let tarjeta_combustible = data.tarjeta_combustible;
    let monto_combustible = data.monto_combustible;
    let monto_vehiculo = data.monto_vehiculo;

    if(data.nombre_empleado !=''){
        var sql = 'UPDATE `jr_empleado` SET `cedula`=?,`nombres`=?,`apellidos`=?,`usuario`=?,`codigo`=?,`tarjeta_punto`=?,`id_empresa`=?,`id_departamento`=?,`id_puesto`=?,`email_personal`=?,`fecha_nacimiento`=?,`tel`=?,`cel`=?,`sexo`=?,`estado_civil`=?,`nhijos`=?,`id_provincia`=?,`id_municipio`=?,`id_sector`=?,`direccion`=?,`email_institucional`=?,`id_estado`=?,`id_grado_ac`=?,`id_nivel`=?,`id_encargado`=?,`fecha_entrada`=?,`id_grado`=?,`id_sueldo`=?,`id_tipo_empleado`=?,`id_nacionalidad`=?,`contacto_emergencia`=?,`id_relacion`=?,`tel_emergencia`=?,`cel_emergencia`=?,`enfermedad`=?,`tipo_enfermedad`=?,`alergia`=?,`tipo_alergia`=?,`medicacion`=?,`tipo_medicamento`=?,`tarjeta_combustible`=?,`monto_combustible`=?,`monto_vehiculo`=? WHERE `id_empleado`=?';

        var values = [cedula, nombres, apellidos, usuario, codigo, tarjeta_punto, id_empresa, id_departamento, id_puesto, email_personal, fecha_nacimiento, tel, cel, sexo, estado_civil, nhijos, id_provincia, id_municipio, id_sector, direccion, email_institucional, id_estado, id_grado_ac, id_nivel, id_encargado, fecha_entrada, id_grado, id_sueldo, id_tipo_empleado, id_nacionalidad, contacto_emergencia, id_relacion, tel_emergencia, cel_emergencia, enfermedad, tipo_enfermedad, alergia, tipo_alergia, medicacion, tipo_medicamento,tarjeta_combustible,monto_combustible,monto_vehiculo,id];

        req.getConnection((err, conn) =>{  
            conn.query(sql,values, (err, empleado) =>{
                res.redirect('/empleado');
            });
        })
    }else{
        res.redirect('/empleado');
    }
}

/////////////////////////

controller.out = (req,res)=>{
    //console.log(req.jhobrosoftsession)
    const { id } =req.params;
    const data = req.body;
    let salida = data.salida;
    let motivo = data.motivo;
    let fecha_salida = data.fecha_salida;
    let realizadopor = req.jhobrosoftsession.id_empleado;

    if(data.motivo !=''){
        var sql = 'UPDATE `jr_empleado` SET `id_estado`=3 WHERE `id_empleado`=?';
        req.getConnection((err, conn) =>{  
            var sqlInsert = 'INSERT INTO `jr_movimiento_empleado`(`id_salida_empleado`, `id_salida`, `id_empleado`, `motivo`, `realizadopor`, `fecha`, `accion`) VALUES (null, ?, ?, ?, ?, ?,"salida")';
                    let values = [salida,id,motivo,realizadopor,fecha_salida];
                    conn.query(sqlInsert,values, (err, salida) =>{
                        //console.log(salida)
                        if(salida){
                            conn.query(sql,[id], (err, estado) =>{
                                res.redirect('/empleado');
                                //res.send("funciona el insert")
                            });
                        }
                    });
        })
    }else{
        res.redirect('/empleado');
    }
}

/////////////////////
controller.activar = (req,res)=>{
    //console.log(req.jhobrosoftsession)
    const { id } =req.params;
    // const data = req.body;
    let salida = 5;//data.salida; // tipo de salida
    let motivo = 'reingreso';//data.motivo;
    // let fecha_salida = data.fecha_salida;
    let realizadopor = req.jhobrosoftsession.id_empleado;

    if(id !=''){
        var sql = 'UPDATE `jr_empleado` SET `id_estado`=2 WHERE `id_empleado`=?';
        req.getConnection((err, conn) =>{  
             var sqlInsert = 'INSERT INTO `jr_movimiento_empleado`(`id_salida_empleado`, `id_salida`, `id_empleado`, `motivo`, `realizadopor`, `fecha`, `accion`) VALUES (null, ?, ?, ?, ?, now(),"reingreso")';
                    let values = [salida,id,motivo,realizadopor];
                    conn.query(sqlInsert,values, (err, salida) =>{
                        console.log(salida)
                        if(salida){
                            conn.query(sql,[id], (err, estado) =>{
                                res.redirect('/empleado');
                                //res.send("funciona el insert")
                            });
                        }
                    });
        })
    }else{
        res.redirect('/empleado');
    }
}

/////////////////////

controller.delete = (req,res) =>{
    const { id } =req.params;
    req.getConnection((err,conn)=>{
        conn.query('DELETE FROM `jr_empleado` WHERE id_empleado = ?',[id])
        res.redirect('/empleado');
    })
}

module.exports = controller;
