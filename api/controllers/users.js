const { generateToken } = require("../lib/token");
const User = require("../models/user");

async function getUser(req, res) {
  const email = req.query.email;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const safeUser = user.toObject();
  delete safeUser.password;

  res.status(200).json({ user: safeUser });
}

async function getUserByName(req, res) {
  const name = req.query.name;

  const users = await User.find({
    $or: [
      { firstname: { $regex: name, $options: "i" } },
      { lastname: { $regex: name, $options: "i" } },
    ],
  }).select("-password");

  if (!users) {
    return res.status(404).json({ message: "No user found with this name" });
  }

  res.status(200).json({ users: users });
}

async function create(req, res) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;

  const user = new User({ firstname, lastname, email, password });
  user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());
      res.status(201).json({ message: "OK" });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: "Something went wrong" });
    });
}

async function updateImage(req, res) {
  try {
    const myId = req.body.myId;
    console.log(myId);
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert uploaded file to base64
    const base64 = req.file.buffer.toString("base64");

    const user = await User.findByIdAndUpdate(
      myId,
      { image: base64 },
      { new: true } // return updated user
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newToken = generateToken(user._id);
    res.status(200).json({ message: "Image Updated", image: user.image, token: newToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getFriends(req, res) {
  const myId = req.user_id;

  if (!myId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await User.findOne({ _id: myId }); 
    if (!user) {
      console.log("User not found with ID:", myId);
      return res.status(404).json({ message: "User not found" });
    }

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id).select("-password"))
    );
    res.status(200).json({ message: "OK", friends: friends });
  } catch (err) {
    console.error("Error in getFriends:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function friendUser(req, res) {
  const myId = req.body.myId;
  const otherId = req.body.otherId;
  const user = User.updateOne({ _id: myId }, { $set: { friends: otherId } });
  const otherUser = User.updateOne(
    { _id: otherId },
    { $push: { friends: myId } }
  );

  Promise.all([user, otherUser])
    .then(([userResult, otherUserResult]) => {
      console.log("Friend added, id:", otherId.toString());
      res.status(201).json({ message: "OK" });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: "Something went wrong" });
    });
}

async function unFriendUser(req, res) {
  const myId = req.body.myId;
  const otherId = req.body.otherId;

  const user = User.updateOne({ _id: myId }, { $pull: { friends: otherId } });
  const otherUser = User.updateOne(
    { _id: otherId },
    { $pull: { friends: myId } }
  );

  Promise.all([user, otherUser])
    .then(([userResult, otherUserResult]) => {
      console.log("Friend removed, id:", otherId.toString());
      res.status(201).json({ message: "OK" });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: "Something went wrong" });
    });
}

async function getMe(req, res) {
  const userId = req.user_id;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const safeUser = user.toObject();
  delete safeUser.password;

  res.status(200).json({
    id: userId,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    image: user.image,
    friends: user.friends,
  });
}

async function getUserBySlug(req, res) {
  const slug = req.params.slug;
  if (!slug) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const query = slug.split("-");

  const user = await User.findOne({
    firstname: query[0],
    lastname: query[1],
  }).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (query[2].length === 6 && user.id.endsWith(query[2])) {
    res.status(200).json({ user: user });
  } else {
    return res.status(404).json({ message: "Id doesn't match" });
  }
}

const UsersController = {
  create: create,
  getUser: getUser,
  getUserByName: getUserByName,
  getMe: getMe,
  getUserBySlug: getUserBySlug,
  friendUser: friendUser,
  unFriendUser: unFriendUser,
  updateImage: updateImage,
  getFriends: getFriends,
};

module.exports = UsersController;
