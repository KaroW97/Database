const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const ObjectId = require('mongodb').ObjectId;
const GridFsStorage = require('multer-gridfs-storage');
const {ensureAuthenticated} = require('../config/auth')

var storage = new GridFsStorage({
    url: process.env.DATABASE_URL,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
            metadata: {
                'user':ObjectId(req.user.id),
                'initialFilename':file.originalname
            }
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });
//Document Main Page
router.get('/', ensureAuthenticated,async(req, res) => {
    try{
        req.app.locals.gfs.files.find().toArray( (err, files)=> {
            if (err) throw err
            if(!files|| files.length === 0){  res.render('documents/index',{files:false,  user:req.user.id})}
            else{
                res.render('documents/index',{files:files, user:req.user.id})
            }
        })
    }catch(err){
        console.log(err)
        res.redirect('/document')
    }
})
//Get One Document
router.get('/:filename', ensureAuthenticated,async(req, res) => {
    try{
        req.app.locals.gfs.files.findOne({ filename: req.params.filename}, (err, file)=>{
            if(!file || file.length === 0){
                res.redirect('/document')
            }
            const readstream =req.app.locals.gfs.createReadStream(file.filename);
            readstream.pipe(res); 
       
        });
    }catch(err){
        console.log(err)

        res.redirect('/document')
    }
    
})
//Upload File
router.post('/',ensureAuthenticated,upload.array('file'),async(req,res)=>{
    try{
        req.flash('mess','Dodano plik');
        req.flash('type','success')
        res.redirect('/document')
    }catch(err){
       
        req.flash('mess','Nie udało się dodac plik');
        req.flash('type','danger')
        res.redirect('/document')
    }

})
//Delete File
router.delete('/',ensureAuthenticated,async(req,res)=>{
    try{
        if(req.body.deleteRow != null){
            if(Array.isArray(req.body.deleteRow)){
                for(var i =0; i<req.body.deleteRow.length; i++){
                    await req.app.locals.gfs.remove({_id:ObjectId(req.body.deleteRow[i]),root:'uploads'}, function (err, gridStore) {
                        if (err)  throw(err);
                    });
                }
                req.flash('mess','Usunięto pliki');
                req.flash('type','success')
            }else{
               await  req.app.locals.gfs.remove({_id:ObjectId(req.body.deleteRow),root:'uploads'}, function (err, gridStore) {
                    if (err) throw(err);
                });
                req.flash('mess','Usunięto plik');
                req.flash('type','success')
            }
        }else{
            req.flash('mess','Nie wybrano plików do usunięcia');
            req.flash('type','info') 
        }
        res.redirect('/document') 
    }catch(err){
        req.flash('mess','Nie udało się usunąć plik');
        req.flash('type','danger')
        res.redirect('/document') 
    }

   
})

module.exports = router