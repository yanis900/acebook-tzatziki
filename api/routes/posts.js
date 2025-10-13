const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.get("/me", PostsController.getUserPosts);
router.post("/", PostsController.createPost);
router.delete("/:id", PostsController.deletePost);
router.post("/like", PostsController.likePost);
router.post("/unlike", PostsController.unlikePost);

module.exports = router;
