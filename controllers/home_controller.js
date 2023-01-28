const Post = require('../models/posts');
const User = require('../models/user');

module.exports.home = async function (req, res) {
  try {
    let post = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
        },
        populate: {
          path: 'likes',
        },
      })
      .populate('likes');

    let users = await User.find({});

    return res.render('home', {
      title: 'SocialBuzz | Home',
      posts: post,
      all_user: users,
    });
  } catch (err) {
    console.log('Error', err);
    return;
  }
};
