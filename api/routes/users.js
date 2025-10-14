const express = require("express");

const UsersController = require("../controllers/users");
const tokenChecker = require("../middleware/tokenChecker");

const router = express.Router();

router.post("/", UsersController.create);
router.post("/friend", UsersController.friendUser);
router.post("/unfriend", UsersController.unFriendUser);
router.get("/", UsersController.getUser);
router.get("/search", UsersController.getUserByName);
router.get("/me", tokenChecker, UsersController.getMe);
router.get("/:slug", tokenChecker, UsersController.getUserBySlug);

module.exports = router;
