const multer = require('multer')
const path = require('path')

multer.diskStorage({
    destination : (req,res,cb)=>{
        cb(null, path.join(__dirname,'../uploads'))
    },
    filename : (req,res,cb)=>{

    }
})