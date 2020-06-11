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
                'user':req.user.id,
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
        res.redirect()
    }
})
//Upload File
router.post('/',ensureAuthenticated,upload.array('file'),(req,res)=>{
    res.redirect('/document')
})
//Delete File
router.delete('/',ensureAuthenticated,(req,res)=>{
    console.log(req.body.deleteRow)
    if(Array.isArray(req.body.deleteRow)){
        for(var i =0; i<req.body.deleteRow.length; i++){
            req.app.locals.gfs.remove({_id:ObjectId(req.body.deleteRow[i]),root:'uploads'}, function (err, gridStore) {
                if (err)  throw(err);
            });
        }
    }else{
        req.app.locals.gfs.remove({_id:ObjectId(req.body.deleteRow),root:'uploads'}, function (err, gridStore) {
            if (err) throw(err);
        });
    }
    res.redirect('/document') 
   
})

module.exports = router