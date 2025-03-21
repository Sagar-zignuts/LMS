const nodemailer  = require('nodemailer')

const transport = nodemailer.createTransport({
    secure : true,
    host : 'smtp.gmail.com',
    port:465,
    auth:{
        user:"sagarbh@zignuts.com",
        pass:"ojffaaxwjysgzijc"
    }
})

const sendMail = async(to,username)=>{
    
    try {
        await transport.sendMail({
            from:"sagarbh@zignuts.com",
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