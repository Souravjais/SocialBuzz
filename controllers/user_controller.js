const User=require('../models/user');
const fs=require('fs');
const path=require('path');

module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:"SocialBuzz Profile", 
            profile_user:user
        });
    })
    
  
    // return res.send('<h1>Profile</h1>');
}

module.exports.update=async function(req,res){
   
    if(req.user.id==req.params.id){
        try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log("***multer error***",err);};
                console.log(req.file);
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file){
                   
                    if(user.avatar&&user.avatar>0){
                        //what if a previous avatar already exists
                        fs.unlinkSync(path.join(__dirname,+'..'+user.avatar))
                    }
                     //this is saving the path of the uploaded file in the avatar field in the user Schema
                    user.avatar=User.avatarPath+ '/'+req.file.filename
                }
                user.save();
                return res.redirect('/');
            });

        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
        req.flash('error','Unauthorized');
        req.status(401).send('Unauthorized');
    }
}

module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
      
        return res.redirect('/');
    }
    return res.render('user_sign_in',{
        title:"SocialBuzz ||SignIn"
    })
}

module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:"SocialBuzz || SignUp"
    })
};

//Signing up the user
module.exports.create=function(req,res){
   //if passwords do not match
  // console.log(req.body);
    if(req.body.password!=req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
       return res.redirect('/users/sign-up');
   }
   //check if email already exists
   User.findOne({email:req.body.email},function(err,user){
       if(err){
           req.flash("error",err);
          // console.log("Error in finding the email in DB");
           return;
       }
       //email id do not exist
       if(!user){
            User.create(req.body,function(err,newuser){
                if(err){
                    req.flash("error",err);
                    console.log("Error in creating new user while signing up");
                    return;
                }
                req.flash('success', 'You have signed up, login to continue!');
                return res.redirect('/users/sign-in');
            })
       }
       else{        //user exists
        req.flash('success','You are already a user,Kindly sign in to continue')
           return res.redirect('/users/sign-in');
       }
   })


}

module.exports.createSession=function(req,res){
    //TODO later
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');

}

module.exports.destroySession=function(req,res){
    req.logout();
    req.flash('success','You have successfully logged out');
    res.redirect('/users/sign-in');
}