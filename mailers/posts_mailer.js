const nodeMailer=require('../config/nodemailer');

exports.newPost=(post)=>{
    console.log("inside new post mailer",post);
   let htmlString=nodeMailer.renderTemplate(
       {post:post},
       '/posts/new_post.ejs'
   )
    nodeMailer.transporter.sendMail({
        from:'socialbuzz140@gmail.com',
        to:post.user.email,
        subject:'New Post is now live ',
        html:htmlString
    },(err,info)=>{
        if(err){console.log("error in sending mail",err);return;}

        console.log("mail delivered",info);
    })
}