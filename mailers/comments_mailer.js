const nodeMailer=require('../config/nodemailer');

exports.newComment=(comment)=>{
    console.log("inside new comment mailer",comment);
   let htmlString=nodeMailer.renderTemplate(
       {comment:comment},
       '/comments/new_comment.ejs'
   )
    nodeMailer.transporter.sendMail({
        from:'socialbuzz140@gmail.com',
        to:comment.user.email,
        subject:'New comment published',
        html:htmlString
    },(err,info)=>{
        if(err){console.log("error in sending mail",err);return;}

        console.log("mail delivered",info);
    })
}