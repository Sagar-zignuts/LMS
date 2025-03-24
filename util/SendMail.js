const nodemailer  = require('nodemailer')
require('dotenv').config()

const transport = nodemailer.createTransport({
    secure : true,
    host : 'smtp.gmail.com',
    port:465,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASSWORD
    }
})

const sendMail = async(to,username)=>{
    
    try {
        await transport.sendMail({
            from:process.env.SENDER_MAIL,
            to:to,
            subject:'Welcome to Library Management System',
            text:`Hello ${username},\n\nWelcome to our Library Management System! Your account has been successfully created.`,
        })
        console.log("Send successfully");
        
    } catch (error) {
        console.log(`Error is there : ${error}`);
    }
}

module.exports = sendMail;