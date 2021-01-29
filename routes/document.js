const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const ObjectId = require('mongodb').ObjectId;
const ShoppingList = require('../models/shoppingList')

const GridFsStorage = require('multer-gridfs-storage');
const {ensureAuthenticated} = require('../config/auth');
const { type } = require('os');

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
/*
 * Document main page
*/
router.get('/', ensureAuthenticated,async(req, res) => {
    let weekdays =["niedz.","pon.",'wt.','śr.','czw.','pt.','sob.']

    let todayDate = new Date(),weekDate=new Date();
    try{
        todayDate.setDate(todayDate.getDate() - 1)
        weekDate.setDate(todayDate.getDate() + 8)
        const shoppingList = await ShoppingList.find({user:req.user.id, transactionDate:{
            $gt:todayDate,
            $lt:weekDate
        }}).sort({transactionDate:'asc'})
        req.app.locals.gfs.files.find().toArray( (err, files)=> {
           
            if (err) throw err
            if(!files|| files.length === 0){  
                res.render('documents/index',{
                    files:false,  
                    shoppingAll:shoppingList,
                    weekdays:weekdays,
                }
            )}
            else{
                const filteredFiles =  files.filter(e=>{
                    return e.metadata.user == req.user.id
                })
                res.render('documents/index',{
                    files:filteredFiles,
                    shoppingAll:shoppingList,
                    weekdays:weekdays,
                })
            }
        })
    }catch(err){
        console.log(err)
        res.redirect('/document')
    }
})
/*
 * Get document
*/
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
/*
 * Upload file
*/
router.post('/',ensureAuthenticated,upload.array('file'),async(req,res)=>{
    try{
        req.flash('mess','Dodano plik');
        req.flash('type','info-success')
        res.redirect('/document')
    }catch(err){
       
        req.flash('mess','Nie udało się dodac plik');
        req.flash('type','info-alert')
        res.redirect('/document')
    }

})
/*
 * Delete file
*/
router.delete('/:id',ensureAuthenticated,async(req,res)=>{
    try{
        await  req.app.locals.gfs.remove({_id:ObjectId(req.params.id),root:'uploads'}, function (err, gridStore) {
            if (err) throw(err);
        });
        req.flash('mess','Usunięto plik');
        req.flash('type','info-success')
            
        res.redirect('/document') 
    }catch(err){
        req.flash('mess','Nie udało się usunąć plik');
        req.flash('type','info-alert')
        res.redirect('/document') 
    }

   
})

module.exports = router