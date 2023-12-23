
var multer = require('multer');
const path = require('path')
// var id ='';
var maxSize = 1 * 1000 * 1000;
    //! Use of Multer
        // console.log('entro al multer steven')

var storage = multer.diskStorage({
    
    destination: (req, file, callBack) => {
        console.log('llegando al destinatario...',req.params)
        // const { id } =req.params;
        const { index } =req.params;/// enviar un parametro index al guardar documentos
        const { files_cita } =req.body;
        // console.log('llegando al destinatario...',index)
        let lugar ='';
        if(index !=0){
            lugar = index;
        }
        else{
            lugar = files_cita
        }
        // console.log(lugar)
        // let ruta="";
        // index=='files'?ruta='files':ruta='amonestacion';
        callBack(null, `./public/${lugar}/`)     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        const { id } =req.params;
        const { id_cita, files_cita } =req.body;
        let idgood =0;
        // console.log('recojo el id 1---------------> ', id)
        // console.log('recojo el id 2---------------> ',typeof(id))
        if(id !=0){
            // console.log('recojo el id 3---------------> ', id)
            callBack(null, id + '-' + Date.now() + path.extname(file.originalname))
        }else{
            // console.log("guardando archivos de cita")
            idgood = id_cita
            callBack(null, idgood + '-' + Date.now() + path.extname(file.originalname))
        }
        
    },
    onFileUploadStart: function(file, req, res){
        if(req.files.file.length > maxSize) {
          return false;
        }
      }
    
})
 
var upload = multer({
    storage: storage
}).single('file');
    
    //return upload;


module.exports = upload;