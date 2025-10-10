const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.create);
router.get("/", UsersController.getUser);
router.get("/search", UsersController.getUserByName);

module.exports = router;
