const { list, save,edit,list_puesto,list_empersas,update } = require('../services/puestoService');

const controller = {};

controller.list= async (req, res) =>{
    const puestos = await list()
    // console.log(puestos[1])
    res.render('puestos',{
        // data: puestos[0],
        empresa: puestos[1],
        emp: req.jhobrosoftsession.empresa,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.save = async (req,res) =>{
    const { descripcion, supervisa, empresa } = req.body;
    let values = [descripcion, supervisa, empresa]
    if(descripcion !=''){
        const puesto = await save(values)
        res.redirect('/puesto');     
    }else{
        res.redirect('/puesto');
    }
}

controller.edit = async (req,res)=>{
    const { id } =req.params;
    const data = req.body;
    const puesto = await edit(id)
    // console.log(puesto[0].id_empresa)
    const puestos = await list_puesto(puesto[0].id_negocio)
    const empresas = await list_empersas(puesto[0].id_negocio)
    console.log(empresas)
    res.render('puesto_edit', {
        data: puesto[0],
        pue: puestos,
        empresa: empresas,
        accesos: req.jhobrosoftsession.accesos
    });
}

controller.update = async (req,res)=>{
    const { id } =req.params;
    const { descripcion, supervisa } = req.body;

    const values = [descripcion, supervisa, id];
    const puesto = await update(values);

    res.redirect('/puesto')
}

controller.delete = (req,res) =>{
    
        res.redirect('/puesto');

}

module.exports = controller;
