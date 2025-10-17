const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.get("/friends",PostsController.getFriendsPosts);
router.get("/me", PostsController.getUserPosts);
router.post("/", PostsController.createPost);
router.delete("/:id", PostsController.deletePost);
router.post("/like", PostsController.likePost);
router.post("/unlike", PostsController.unlikePost);
router.put("/:id/edit", PostsController.editPost);
router.get("/:id", PostsController.getFriendPosts);

module.exports = router;