const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
  const posts = await Post.find();
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });
}

async function createPost(req, res) {
  const post = new Post(req.body);
  post.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "Post created", token: newToken });
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

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  deletePost: deletePost,
};

module.exports = PostsController;
