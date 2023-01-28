const passport=require('../config/passport-local-strategy');

const express=require('express');

const router=express.Router();

const commentController=require('../controllers/comment_controller');

router.post('/create',passport.checkAuthentication,commentController.create);
router.get('/delete/:id',passport.checkAuthentication,commentController.destroy);

module.exports=router;