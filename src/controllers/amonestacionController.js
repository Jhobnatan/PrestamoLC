const { ver_amonestaciones, encargados_dep, amonestacion, update,insert_path } = require('../services/amonestacionService');

const controller = {};

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

controller.veramonestacion= async (req, res) =>{
    const { id } =req.params;
    //req.jhobrosoftsession.rol = "";
    const amonestaciones_rrhh = await ver_amonestaciones()
    console.log(amonestaciones_rrhh[0][0])
    res.render('amonestacion',{
        amonestaciones_rrhh: amonestaciones_rrhh[0],
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.amonestacion = async (req, res) =>{
    const { id } =req.params;
    const { am } =req.params;
    //console.log(id)
    const data = req.body;
    const roll = req.jhobrosoftsession.rol;

    const encargadosdep = await encargados_dep(id);
    // console.log(encargadosdep[0].id_departamento)
    const empleado = await amonestacion(id,encargadosdep[0].id_departamento,am);
    console.log(empleado[10])

    empleado[10][0].fecha = formatFecha(empleado[10][0].fecha);

    res.render('amonestacion_empleado_edit',{
        data: empleado[0],
        nac: empleado[1],
        prov: empleado[2],
        emp: empleado[3],
        dep: empleado[4],
        pue: empleado[5],
        mod: empleado[6],
        est: empleado[7],  
        empleado: empleado[8][0],                                                                                     
        enc: empleado[9],
        am: empleado[10][0],
        rol : roll,
        accesos: req.jhobrosoftsession.accesos
});

}

controller.actualizar_am = (req,res) =>{
    
    const { id } =req.params;
    const { li } =req.params;
    const data = req.body;
    
    // console.log(data)
    //console.log(req.file)
    const id_tipo_licencia = data.tipo_lic;
    const fecha_salida = data.fecha_salida;
    const fecha_entrada = data.fecha_entrada;
    const fecha_solicitud = data.fecha_solicitud;
    const constancia = data.constancia;
    const motivo_lic = data.motivo_lic;
    const estado_lic = data.estado_lic;
    let id_rrhh = req.jhobrosoftsession.id_empleado;
    //console.log(data.fecha);
    //console.log('mis datos son'+data.name+"y mas nada");
    const values = [ id,id_tipo_licencia, fecha_salida,fecha_entrada,fecha_solicitud, motivo_lic,constancia,id_rrhh,estado_lic,li]
    var sql ='UPDATE `jr_licencia` SET `id_empleado`=?,`id_tipo_licencia`=?,`fecha_salida`=?,`fecha_entrada`=?,`fecha_solicitud`=?,`motivo`=?,`constancia`=?,`id_rrhh`=?,`estado`=? WHERE  `id_licencia`=?';
    if(data.tipo_lic !=''){
        req.getConnection((err, conn) =>{
            if(err){
                res.json(err);
            }
            conn.query(sql,values, (err, licencia) =>{
                if(err){
                    res.json(err);
                }
                if(req.file){
                    console.log('hago el insert')
                    let paths = 'files\\'+ req.file.filename;//req.file.path;
                    //paths = paths.replace('public\$', '');
                    const values = [paths, li]
                    var sqld ='INSERT INTO `jr_documento_lic`(`id_doc`, `path`, `id_licencia`, `fecha`) VALUES ( "",?, ?,now())';
                    conn.query(sqld,values, (err, doc) =>{
                        console.log(err)
                        //res.redirect('/licencia');
                        //res.send("funciona el insert")
                    });

                }
                
                res.redirect('/amonestacion');
                //res.send("funciona el insert")
            });
        })
    }else{
        res.redirect('/amonestacion');
    }
    
    
}
controller.delete = (req,res) =>{
    const { id } =req.params;
    req.getConnection((err,conn)=>{
        conn.query('DELETE FROM `jr_puesto` WHERE `id_puesto` = ?',[id]);
        res.redirect('/puesto');
    })

}

module.exports = controller;
