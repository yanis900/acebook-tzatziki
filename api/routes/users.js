const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


const UsersController = require("../controllers/users");
const tokenChecker = require("../middleware/tokenChecker");

const router = express.Router();

router.post("/", UsersController.create);
router.post("/friend", UsersController.friendUser);
router.post("/unfriend", UsersController.unFriendUser);
router.put("/image",upload.single("image"), UsersController.updateImage);
router.get("/", UsersController.getUser);
router.get("/search", UsersController.getUserByName);
router.get("/me", tokenChecker, UsersController.getMe);
router.get("/:slug", tokenChecker, UsersController.getUserBySlug);
router.get("/friends", tokenChecker, UsersController.getFriends);

module.exports = router;
