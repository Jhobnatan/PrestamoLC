const controller = {};

controller.show= (req, res) =>{
    // console.log(req.jhobrosoftsession.accesos) 
    // req.jhobrosoftsession.estado = ""; 
    if(req.jhobrosoftsession.estado=='OK'){
        res.render('dashboard', {
            accesos: req.jhobrosoftsession.accesos
        });
        return;
    }
    req.jhobrosoftsession.nombres = ''; 
    req.jhobrosoftsession.accesos = {
        
    }
    req.jhobrosoftsession.error = "";
    req.jhobrosoftsession.success="";
    req.jhobrosoftsession.estado = ""; 
    req.jhobrosoftsession.id_empleado = '';
    req.jhobrosoftsession.nombres = ''; 
    req.jhobrosoftsession.apellido = '';
    req.jhobrosoftsession.empresa = '';
    req.jhobrosoftsession.departamento = '';
    req.jhobrosoftsession.puesto = '';
    req.jhobrosoftsession.rol = '';
       
    res.render('login', {
        accesos: req.jhobrosoftsession.accesos,
        error: req.jhobrosoftsession.error,
    });
    
}

module.exports = controller;