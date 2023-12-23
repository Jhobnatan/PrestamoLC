const { getList, solicitud, save, ver, update, cancelar, vertodos, updaterrhh } = require('../services/permisoService');

const controller = {};


controller.list = async (req, res) => {
    // const { usuario } = req.body;
    // const { clave } = req.body;

    const puestos = await getList()

    if (puestos) {

        res.render('permiso', {
            data: puestos,
            accesos: req.jhobrosoftsession.accesos
        });

    } else {
        console.log('no hay puestos cargados')
        req.jhobrosoftsession.error = 'Error al cargar permisos';
        res.render('dashboard', {
            error: req.jhobrosoftsession.error
        });
    }

}

controller.ver = async (req, res) => {
    const { id } = req.params;
    const data = await ver(id);
    perm = data[0];
    perm[0].fecha_salida = perm[0].fecha_salida.toLocaleString();
    perm[0].fecha_entrada = perm[0].fecha_entrada.toLocaleString();

    estados = data[1];
    //req.jhobrosoftsession.rol = "";
    // console.log(perm[0].id_estado_premiso)
    res.render('permiso_enc', {
        permisos: perm[0],
        est: estados,
        salida: perm[0].fecha_salida,
        entrada: perm[0].fecha_entrada,
        accesos: req.jhobrosoftsession.accesos,
        est_perm: perm[0].id_estado_premiso

    });
}

controller.vertodos = async (req, res) => {
    const { id } = req.params;
    //req.jhobrosoftsession.rol = "";

    const data = await vertodos(id);
    perm = data[0];
    perm[0].fecha_salida = perm[0].fecha_salida.toLocaleString();
    perm[0].fecha_entrada = perm[0].fecha_entrada.toLocaleString();

    estados = data[1];
    res.render('permiso_rrhh', {
        rrhh: perm[0],
        est: estados,
        salida: perm[0].fecha_salida,
        entrada: perm[0].fecha_entrada,
        accesos: req.jhobrosoftsession.accesos,
        est_perm: perm[0].id_estado_premiso
    });


  
}


controller.solicitud = async (req, res) => {
    const { id } = req.params;
    // const data = req.body;
    req.jhobrosoftsession.rol = 1;
    let id_empleado = req.jhobrosoftsession.id_empleado;

    const data = await solicitud(id_empleado)
    let permiso = data[0];
    let empleado = data[1];
    let tiposdepermisos = data[2];
    let estados = data[3];
    // console.log('data 4 ',data[4][0])
    let permisos = data[4];
    let permisos_rrhh = data[5];
    let tiene = 0;
    if (permiso != "") {
        tiene = 1;
    }
    if (req.jhobrosoftsession.accesos.modulo_rrhh && id == 3) {
        res.render('permiso', {
            tipopermiso: tiposdepermisos,
            emp: empleado[0],
            rol: req.jhobrosoftsession.rol,
            permiso: permiso[0],
            tiene: tiene,
            est: estados,
            permisos: permisos,
            rrhh: permisos_rrhh,
            accesos: req.jhobrosoftsession.accesos,
            dedonde: id

        });
    } else if (req.jhobrosoftsession.accesos.modulo_encargado && id == 2) {
        res.render('permiso', {
            tipopermiso: tiposdepermisos,
            emp: empleado[0],
            rol: req.jhobrosoftsession.rol,
            permiso: permiso[0],
            tiene: tiene,
            est: estados,
            permisos: permisos,
            rrhh: permisos_rrhh,
            accesos: req.jhobrosoftsession.accesos,
            dedonde: id

        });
    } else if (req.jhobrosoftsession.accesos.modulo_empleado && id == 1) {
        res.render('permiso', {
            tipopermiso: tiposdepermisos,
            emp: empleado[0],
            rol: req.jhobrosoftsession.rol,
            permiso: permiso[0],
            tiene: tiene,
            est: estados,
            permisos: permisos,
            rrhh: permisos_rrhh,
            accesos: req.jhobrosoftsession.accesos,
            dedonde: id

        });
    } else {
        res.redirect('/');
    }


}

controller.save = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const fecha = data.fecha;
    const tipo_permiso = data.tipo_permiso;
    const fecha_salida_e = data.fecha_salida_e;
    const fecha_entrada_e = data.fecha_entrada_e;
    const motivo_e = data.motivo_e;
    const encargado = data.encargado;
    let id_empleado = req.jhobrosoftsession.id_empleado;
    //console.log(data.fecha);
    //console.log('mis datos son'+data.name+"y mas nada");
    const values = [tipo_permiso, id_empleado, fecha_salida_e, fecha_entrada_e, motivo_e, encargado, 1]

    if (data.name != '') {
        const data = await save(values)
        if (data) {
            res.redirect('/permiso');
        }
    } else {
        res.redirect('/permiso');
    }


}

controller.edit = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM `jr_puesto` WHERE `id_puesto` =?', [id], (err, puesto) => {
            res.render('puesto_edit', {
                data: puesto[0],
                accesos: req.jhobrosoftsession.accesos
            });
        });
    });
    ///res.send('funciona editar')

}

controller.update = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    let comentario_supervisor = data.comentario_supervisor;
    let id_estado = data.estado_sup;

    const values = [comentario_supervisor, id_estado, id];

    const datos = await update(values);
    console.log('Los datos ', datos)
    if(datos){
        res.redirect('/permiso/2');
        return;
    }

    res.redirect('/permiso/2');
    //console.log(id);

}

controller.updaterrhh = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    let comentario_rrhh = data.comentario_rrhh;
    let id_estado = data.estado_sup;

    let values = [comentario_rrhh, id_estado, id];

    const datos = await updaterrhh(values);
    console.log('Los datos ', datos)
    if(datos){
        res.redirect('/permiso/3');
        return;
    }

    res.redirect('/permiso/3');
    //console.log(id);

}

controller.cancel = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    
    let comentario_empleado = data.comentario_emp;
    let id_estado = 5;//data.estado_sup;
    // console.log('no llegaba');
    // console.log(comentario_empleado);
    // console.log(id_estado);
    // console.log(id);

    const values = [comentario_empleado, id_estado, id];

    const datos = await cancelar(values);
    // console.log('Los datos ', datos)
    if(datos){
        res.redirect('/permiso/1');
        return;
    }

    res.redirect('/permiso/1');
}

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM `jr_puesto` WHERE `id_puesto` = ?', [id]);
        res.redirect('/puesto');
    })

}

module.exports = controller;
