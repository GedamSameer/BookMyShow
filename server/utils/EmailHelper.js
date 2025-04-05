const nodemailer = require("nodemailer")
const fs = require("fs")
const dotenv = require("dotenv")
const path = require("path")
dotenv.config() 
const {SENDGRID_API_KEY} = process.env

function replaceContent(content, creds) {
    return content.replace(/#\{(\w+)\}/g, (match, key) => creds[key] || match);    
}

async function EmailHelper(templateName,recieverEmail,creds){
    try{
        const templatePath = path.join(__dirname,"email_templates",templateName)
        let content = await fs.promises.readFile(templatePath,"utf-8")
        const emailDetails = {
            to:recieverEmail,
            from:"samgedam0@gmail.com",
            text:`Hi ${creds.name}, this is your OTP for resetting password. OTP: ${creds.otp}`,
            html: replaceContent(content,creds)
        }
        const transportDetails = {
            host:"smtp.sendgrid.net",
            port:587,
            secure:false,
            auth:{
                user:"apikey",
                pass:SENDGRID_API_KEY
            }
        }
        const transporter = nodemailer.createTransport(transportDetails)
        await transporter.sendMail(emailDetails) 
    }catch (err){
        console.log(err)
    }
}
module.exports = EmailHelper