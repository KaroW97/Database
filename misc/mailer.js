const nodemailer = require('nodemailer');
const config = require('../config/mailer')
require('dotenv').config()

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.EMAIL, // TODO: your gmail account
        pass:process.env.PASSWORD// TODO: your gmail password
    },
    tls: {
        rejectUnauthorized: false
    }
})


module.exports ={
    sendEmail(from, to, subject, html){
        return new Promise((reslove,reject)=>{
            transport.sendMail({from, subject, to, html},(err, info)=>{
                if(err) reject(err);
                reslove(info)
            })
        })
    }
}