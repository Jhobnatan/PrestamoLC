const { redirect } = require('express/lib/response');
const { list, save,save_invitado,edit,update,eliminar_invitados, insert_path,buscar_invitados } = require('../services/agendaService');
const { paginacion } = require("../config");
const { io } = require('../socket');

const controller = {};

controller.list= async (req, res) =>{

    const socket = req.socket;
  // Emitir un mensaje de bienvenida al cliente a través del socket
  socket.emit('mensaje', 'Bienvenido al negocio!');
console.log('entre al negocio')
    let departamento = req.jhobrosoftsession.departamento;
	let id_empleado = req.jhobrosoftsession.id_empleado;
    let acces = req.jhobrosoftsession.accesos;
    if(acces.modulo_agenda){
        const agenda = await list(id_empleado, departamento, acces);
        res.render('agenda',{
            paginacion,
            ejec: agenda[0],
            externo: agenda[1],
            pago: agenda[2],
            citas: agenda[3],
            empresas: agenda[4],
            accesos: req.jhobrosoftsession.accesos,
            id_empleado: id_empleado,
        });
    }else{
        res.redirect('/dashboard');
    }
}

controller.save = async (req,res) =>{
    // const data = req.body;
    //`id_cita`, `fecha`, `hora_inicio`, `hora_fin`, `color`, `motivo`, `estado`, `recordatorio`, `minuta`, `fecha_registro`, `registrada_por`
    const {titulo, fecha, inicio, fin,lugar, geo, ejecutivointerno, externo, ejecutivo_pago,persona, motivo, minuta, recordatorio,empresa } = req.body;
    let registrada_por = req.jhobrosoftsession.id_empleado;
    let estado = "Agendada";
    let color='#ffdd00'
    const data = [titulo, fecha, inicio, fin, color, motivo, estado, recordatorio, minuta,registrada_por,lugar, geo, empresa];
    
    if(data !=''){
        let cita = await save(data);
        const id_cita = cita.insertId;
        let persona_sucursal = 0;

        await save_invitado(ejecutivointerno, externo, ejecutivo_pago, persona_sucursal, id_cita, persona);

        res.redirect('/agenda');
    }else{
        res.redirect('/empresa');
    }  
}

controller.edit = async (req,res)=>{
    const { id } =req.params;
    const data = req.body;

    const empresa = await edit(id);
    const categoria = await categoria_empresa();
    res.render('empresa_edit', {
        data: empresa[0],
        cat: categoria,
        accesos: req.jhobrosoftsession.accesos,
        id_empleado: req.jhobrosoftsession.id_empleado
    });
}

controller.update = async (req,res)=>{
    const {titulo, fecha, inicio, fin,lugar, geo, ejecutivointerno, externo, ejecutivo_pago,persona, motivo, minuta, recordatorio, id_cita, estado, descripcion, empresa } = req.body;
    let registrada_por = req.jhobrosoftsession.id_empleado;
    // estado = "Agendada";
    let color ='';
    if(estado =='Agendada'){
        color='#ffdd00';
        // alert(arg.event.backgroundColor)
      } else if(estado =='Completada'){
        color='#1dc339';
        // alert(arg.event.backgroundColor)
      } else if(estado =='Reagendada'){
        color='#00a8e0';
        // alert(arg.event.backgroundColor)
      } else if(estado =='Cancelada'){
        color='#f10427';
        // alert(arg.event.backgroundColor)
      }
    const data = [titulo, fecha, inicio, fin, color, motivo, estado, recordatorio, minuta,lugar, geo,empresa, id_cita];
    
    let citaid = id_cita;
    if(data !=''){
        if(id_cita == 0){
            const data = [titulo, fecha, inicio, fin, color, motivo, estado, recordatorio, minuta,registrada_por,lugar, geo, empresa];
            let cita = await save(data);
            citaid = cita.insertId;
        }else{
            // console.log('Voy a Actualizar la cita ',titulo)
            if(titulo !=undefined){
                // let losinvitados = await buscar_invitados(citaid);
                // console.log(losinvitados)
                // let invitados = JSON.stringify(losinvitados);
                await update(data,registrada_por);
                await eliminar_invitados(citaid);
            }
            // console.log('Voy a Actualizar la cita =========>',req)
            if(req.file){
                // console.log('hago el insert de los docs de cita')
                let path = 'files_cita\\'+ req.file.filename;//req.file.path;
                //paths = paths.replace('public\$', '');
                const data_path = [descripcion,path, citaid]
                const doc = await insert_path(data_path);
                //aqui enviaria el correo
            }
        }
        
        let persona_sucursal = 0;
        if(titulo !=undefined){
        await save_invitado(ejecutivointerno, externo, ejecutivo_pago, persona_sucursal, citaid, persona);
        }
        res.redirect('/agenda');
    }else{
        res.redirect('/agenda');
    } 
    ////////////////////////////////////////////////

    // const values = [nombre_empresa, razon_social,rnc ,telefono, categoria, id];
    // const empresa = await update(values);
    // res.redirect('/empresa');

}

controller.delete = (req,res) =>{
    
    
}

module.exports = controller;
