const Comment = require('../models/comments');
const Post = require('../models/posts');
const commentsMailer = require('../mailers/comments_mailer');

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      // console.log(post);
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      post.comments.push(comment);
      post.save();
      comment = await comment.populate('user', 'name email').execPopulate();
      commentsMailer.newComment(comment);

      if (req.xhr) {
        // Similar for comments to fetch the user's id!
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: 'Post created!',
        });
      }

      req.flash('success', 'Your comment was posted');
      res.redirect('/');
    } else {
      req.flash('error', 'Error in posting your comment');
      return res.redirect('/');
    }
  } catch (err) {
    req.flash('error', 'Error in posting your comment');
    console.log('error in creating comment', err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  //console.log(req.params);
  try {
    let comment = await Comment.findById(req.params.id);
    // console.log("deletion of comment started");
    // console.log(comment);
    // console.log(comment.user);
    if (comment.user == req.user.id) {
      let postId = await comment.post;
      await comment.remove();

      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      // send the comment id which was deleted back to the views
      // if (req.xhr){
      //     return res.status(200).json({
      //         data: {
      //             comment_id: req.params.id
      //         },
      //         message: "Post deleted"
      //     });
      // }

      req.flash('success', 'Comment deleted successfully');
      return res.redirect('back');
    } else {
      req.flash('error', 'Error in deleting comment');
      console.log('deletion of comment aborted due to unwanted reasons');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error in deleting comment');
    console.log('error in deleting comment', err);
    return;
  }
};
