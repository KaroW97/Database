const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const db = mongoose.connection;
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


router.get('/documents', async(req, res)=>{
    try{
    var gfs = Grid(db.db, mongoose.mongo)
   
    gfs.files.find().toArray( (err, files)=> {
        if (err) throw err
        console.log(files)
        if(!files|| files.length === 0){  res.render('documents/index',{files:false,  user:req.user})}
        else{
            res.render('documents/index',{files:files, user:req.user})
        }
    })
    }catch(err){
        console.log(err)
    }

})

router.get('/documents', async(req, res)=>{
    try{
        gfs.files.find().toArray( (err, files)=> {
            if (err) throw err
            console.log(files)
            if(!files|| files.length === 0){  res.render('documents/index',{files:false,  user:req.user})}
            else{
                res.render('documents/index',{files:files, user:req.user})
            }
        })
    }catch(err){
        console.log(err)
    }

})
router.post('/',upload.array('file'),(req,res)=>{
    console.log('dodano')
    res.redirect('/documents')
})



module.exports = router;