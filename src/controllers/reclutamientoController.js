const { encargado } = require("./form_dataController");
const { list, crear_solicitud, edit, save, update, list_rrhh, updaterrhh } = require('../services/reclutamientoService');

const controller = {};

controller.show= (req, res) =>{
    res.render('empleados')
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
    let id_solicitante = req.jhobrosoftsession.id_empleado;
    const solicitudes = await list(id_solicitante)
    res.render('reclutamiento_list',{
        data: solicitudes,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.list_rrhh= async (req, res) =>{
    const solicitudes = await list_rrhh()
    res.render('reclutamiento_rrhh',{
        data: solicitudes,
        accesos: req.jhobrosoftsession.accesos
    });
  
}

controller.new = async (req, res) =>{
    let id_empleado = req.jhobrosoftsession.id_empleado;

    const solicitudes = await crear_solicitud(id_empleado)
// console.log(solicitudes[3])
    
    res.render('reclutamiento',{
        data: solicitudes[0],
        nac: solicitudes[1],
        prov: solicitudes[2],
        emp: solicitudes[3],
        dep: solicitudes[4],
        pue: solicitudes[5],
        mod: solicitudes[6],
        gra: solicitudes[7],
        suel: solicitudes[8],
        graac: solicitudes[9],
        niv: solicitudes[10],
        est: solicitudes[11],
        accesos: req.jhobrosoftsession.accesos
        
});
    
}
controller.edit = async (req, res) =>{

    const { id } =req.params;
    //console.log(solicitudes[12][0])
    const data = req.body;
    const roll = req.jhobrosoftsession.rol;
    const solicitudes = await edit(id);
    console.log(solicitudes[11]);
    res.render('reclutamiento_edit',{
        data: solicitudes[0],
        nac: solicitudes[1],
        prov: solicitudes[2],
        emp: solicitudes[3],
        dep: solicitudes[4],
        pue: solicitudes[5],
        mod: solicitudes[6],
        gra: solicitudes[7],
        suel: solicitudes[8],
        graac: solicitudes[9],
        niv: solicitudes[10],
        est: solicitudes[11],
        rec: solicitudes[12][0],
        accesos: req.jhobrosoftsession.accesos
});

}

controller.edit_rrhh = async (req, res) =>{

    const { id } =req.params;
    //console.log(id)
    const data = req.body;
    const roll = req.jhobrosoftsession.rol;
    const solicitudes = await edit(id);
    res.render('reclutamiento_edit_rrhh',{
        data: solicitudes[0],
        nac: solicitudes[1],
        prov: solicitudes[2],
        emp: solicitudes[3],
        dep: solicitudes[4],
        pue: solicitudes[5],
        mod: solicitudes[6],
        gra: solicitudes[7],
        suel: solicitudes[8],
        graac: solicitudes[9],
        niv: solicitudes[10],
        est: solicitudes[11],
        rec: solicitudes[12][0],
        accesos: req.jhobrosoftsession.accesos
});

}


controller.save = async (req,res) =>{
    const data = req.body;
    // console.log(data);
    let id_empresa = req.jhobrosoftsession.empresa;
    let id_departamento = req.jhobrosoftsession.departamento;
    let id_puesto = data.puesto;
    let supervisa = data.supervisa;
    let cant_supervisa = data.cant_supervisa;
    let id_modalidad = data.tipo_empleado;
    let conocimiento = data.conocimiento;
    let conocimiento_deseable = data.conocimiento_deseable;
    let motivo = data.motivo;
    let justificacion = data.justificacion;
    let rango_edad = data.rango_edad;
    let sexo = data.sexo;
    let id_grado_academico = data.grado_ac;
    let id_nivel = data.nivel;
    let id_estado = 1;

    let id_solicitante = req.jhobrosoftsession.id_empleado;

    if(data.id_solicitante !=''){

        var values = [id_solicitante, id_empresa, id_departamento, id_puesto, supervisa, cant_supervisa, id_modalidad, conocimiento, conocimiento_deseable, motivo, justificacion, rango_edad, sexo, id_grado_academico, id_nivel, id_estado];
        if (data.name != '') {
            const data = await save(values)
            if (data) {
                res.redirect('/reclutamiento');
            }
        } else {
            res.redirect('/reclutamiento');
        }
    }else{
        res.redirect('/reclutamiento');
    }
    
    
}


controller.update = async (req,res)=>{
    const { id } =req.params;
    const data = req.body;
    // console.log(data);
    let id_empresa = req.jhobrosoftsession.empresa;
    let id_departamento = req.jhobrosoftsession.departamento;
    let id_puesto = data.puesto;
    let supervisa = data.supervisa;
    let cant_supervisa = data.cant_supervisa;
    let id_modalidad = data.tipo_empleado;
    let conocimiento = data.conocimiento;
    let conocimiento_deseable = data.conocimiento_deseable;
    let motivo = data.motivo;
    let justificacion = data.justificacion;
    let rango_edad = data.rango_edad;
    let sexo = data.sexo;
    let id_grado_academico = data.grado_ac;
    let id_nivel = data.nivel;
    // let id_estado = 1;

    let id_solicitante = req.jhobrosoftsession.id_empleado;

        var values = [id_solicitante, id_empresa, id_departamento, id_puesto, supervisa, cant_supervisa, id_modalidad, conocimiento, conocimiento_deseable, motivo, justificacion, rango_edad, sexo, id_grado_academico, id_nivel, id];

        if (id_solicitante != '') {
            const data = await update(values)
            if (data) {
                res.redirect('/reclutamiento');
            }
        } else {
            res.redirect('/reclutamiento');
        }
}

/////////////////////////
controller.update_rrhh = async (req,res)=>{
    const { id } =req.params;
    const data = req.body;
    // console.log(data);
    
    let { estado } = req.body;

    let id_solicitante = req.jhobrosoftsession.id_empleado;

    if(estado !='0'){

        var values = [estado, id];

        const dato = await updaterrhh(values)
        console.log(dato)
      
            res.redirect('/reclutamiento/rrhh');
      
        
    }else{
        res.redirect('/reclutamiento/rrhh');
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
