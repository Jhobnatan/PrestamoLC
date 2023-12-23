const { ver_licencias, licencia,encargados_dep,update,insert_path } = require('../services/licenciaService');

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

controller.verlicencias= async (req, res) =>{
    const { id } =req.params;
    //req.jhobrosoftsession.rol = "";
    const licencias = await ver_licencias()
    // console.log(licencias)

    res.render('licencia',{
        licencias_rrhh: licencias[0],
        est: licencias[1],
        accesos: req.jhobrosoftsession.accesos
    });
    
}

controller.licencia = async (req, res) =>{
    const { id } =req.params;
    const { li } =req.params;
    //console.log(id)
    const data = req.body;
    const roll = req.jhobrosoftsession.rol;
    const encargadosdep = await encargados_dep(id);
    // console.log(encargadosdep[0].id_departamento)
    const empleado = await licencia(id,encargadosdep[0].id_departamento,li);

    empleado[18][0].fecha_salida = formatFecha(empleado[18][0].fecha_salida);
    empleado[18][0].fecha_entrada = formatFecha(empleado[18][0].fecha_entrada);
    empleado[18][0].fecha_solicitud = formatFecha(empleado[18][0].fecha_solicitud);

    res.render('licencia_empleado_edit',{
        empleado: empleado[14][0],
        data: empleado[0],
        nac: empleado[1],
        prov: empleado[2],
        emp: empleado[3],
        dep: empleado[4],
        pue: empleado[5],
        mod: empleado[6],
        gra: empleado[7],
        suel: empleado[8],
        graac: empleado[9],
        niv: empleado[10],
        est: empleado[11],
        mun: empleado[12],
        sec: empleado[13],
        enc: empleado[15],
        rel: empleado[16],
        tipo_lic: empleado[17],
        rol : roll,
        lic: empleado[18][0],//licencia[0],
        docs: empleado[19],//documentos,
        accesos: req.jhobrosoftsession.accesos
});
}

controller.actualizar_lic = async (req,res) =>{
    
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
    // var sql ='UPDATE `jr_licencia` SET `id_empleado`=?,`id_tipo_licencia`=?,`fecha_salida`=?,`fecha_entrada`=?,`fecha_solicitud`=?,`motivo`=?,`constancia`=?,`id_rrhh`=?,`estado`=? WHERE  `id_licencia`=?';
    const encargadosdep = await update(values);

    if(req.file){
        // console.log('hago el insert')
        let paths = 'files\\'+ req.file.filename;//req.file.path;
        //paths = paths.replace('public\$', '');
        const data_path = [paths, li]
        const doc = await insert_path(data_path);
    }
    res.redirect('/licencia');

}


module.exports = controller;
