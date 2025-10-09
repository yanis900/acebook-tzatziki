const express = require("express");

const UsersController = require("../controllers/users");
const tokenChecker = require("../middleware/tokenChecker");

const router = express.Router();

router.post("/", UsersController.create);
router.get("/", UsersController.getUser);
router.get("/me", tokenChecker, UsersController.getMe);

module.exports = router;
