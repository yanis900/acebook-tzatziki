const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
  const posts = await Post.find()
    .populate("user", "_id image").populate('likesBy', 'firstname lastname')
    .sort({ date: -1 })
    .exec();
  console.log(posts);
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });
}

async function getUserPosts(req, res) {
  const userId = req.user_id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const posts = await Post.find({ user: userId })
    .populate("user", "_id image").populate('likesBy', 'firstname lastname')
    .sort({ date: -1 })
    .exec();
  const token = generateToken(userId);
  res.status(200).json({ posts: posts, token: token });
}

async function getFriendPosts(req, res) {
  const userId = req.params.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const posts = await Post.find({ user: userId })
    .populate("user", "_id image").populate('likesBy', 'firstname lastname')
    .sort({ date: -1 })
    .exec();
  const token = generateToken(userId);
  res.status(200).json({ posts: posts, token: token });
}

async function createPost(req, res) {
  const userId = req.user_id;
  const postData = { ...req.body, user: userId };
  const post = new Post(postData);
  await post.save();

  const newToken = generateToken(req.user_id);
  res
    .status(201)
    .json({ message: "Post created", post: post, token: newToken });
}

async function deletePost(req, res) {
  const postId = req.params.id;
  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  await Post.findByIdAndDelete(postId);

  const newToken = generateToken(req.user_id);
  res.status(200).json({ message: "Post deleted", token: newToken });
}

async function likePost(req, res) {
  const postId = req.body.postId;
  const userId = req.user_id;

  await Post.updateOne(
    { _id: postId },
    {
      $addToSet: { likesBy: userId },
      $inc: { likes: 1 },
    }
  );

  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "Post liked", token: newToken });
}

async function unlikePost(req, res) {
  const postId = req.body.postId;
  const userId = req.user_id;

  await Post.updateOne(
    { _id: postId },
    {
      $pull: { likesBy: userId },
      $inc: { likes: -1 },
    }
  );

  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "Post unliked", token: newToken });
}

async function editPost(req, res) {
  const postId = req.params.id;
  console.log(postId);
  const post = await Post.findById(postId);
  console.log(post)

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // check if user owns the post
  if (post.user.toString() !== req.user_id.toString()) {
    return res.status(403).json({ message: "You can only edit your own posts" });
  }

  // update the post
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { message: req.body.message }, // matches schema
    { new: true }
  );
  console.log(updatedPost);
  // generate new token
  const newToken = generateToken(req.user_id);

  // send response
  res.status(200).json({ message: "Post Updated", post: updatedPost, token: newToken });
}

const PostsController = {
  getAllPosts: getAllPosts,
  getUserPosts: getUserPosts,
  createPost: createPost,
  deletePost: deletePost,
  likePost: likePost,
  unlikePost: unlikePost,
  editPost: editPost,
  getFriendPosts: getFriendPosts,
};

module.exports = PostsController;
