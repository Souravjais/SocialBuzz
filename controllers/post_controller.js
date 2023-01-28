const Post = require('../models/posts');
const Comment = require('../models/comments');
const Like = require('../models/likes');
const postsMailer = require('../mailers/posts_mailer');

// module.exports.create=function(req,res){
//     Post.create({
//         content:req.body.content,
//         user:req.user._id
//     },function(err,post){
//         if(err){
//             console.log("Error in creating new post");
//             return;
//         }
//     })
// };

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    post = await post.populate('user', 'name email').execPopulate();
    postsMailer.newPost(post);
    if (req.xhr) {
      // if we want to populate the name of the user upon adding posts dynamically
      // post=await post.populate('user','name').execPopulate();

      return res.status(200).json({
        data: {
          post: post,
        },
        message: 'Post created!',
      });
    }

    req.flash('success', 'Post published');
    window.location.reload(true);
    // return res.redirect('back');
  } catch (err) {
    req.flash('error', 'Error in creating new post');
    // console.log("error in creating Post", err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    //console.log(req.params);
    let post = await Post.findById(req.params.id);
    if (post) {
      if (post.user == req.user.id) {
        //change for like user:: 2lines
        await Like.deleteMany({ likeable: post._id, onModel: 'Post' });
        await Like.deleteMany({ _id: { $in: post.comments } });

        post.remove();
        await Comment.deleteMany({ post: req.params.id });

        if (req.xhr) {
          return res.status(200).json({
            data: {
              post_id: req.params.id,
            },
            message: 'Post deleted',
          });
        }

        req.flash('success', 'Post deleted successfully');
        return res.redirect('/');
      }
    } else {
      req.flash('error', 'error in deleting post');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'error in deleting post');
    console.log('error in deleting Post', err);
    return;
  }
};
