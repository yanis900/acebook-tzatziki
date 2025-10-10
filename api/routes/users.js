const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

// const authenticateToken = require("../middleware/tokenChecker");

router.post("/", UsersController.create);
router.get("/", UsersController.getUser);

router.get("/:id", UsersController.getUserById);
// router.get("/me/profile", authenticateToken, UsersController.getCurrentUser);

module.exports = router;
