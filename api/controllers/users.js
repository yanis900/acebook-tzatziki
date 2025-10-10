const User = require("../models/user");
const { generateToken } = require("../lib/token");

async function getUser(req, res) {
  const email = req.query.email

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const safeUser = user.toObject();
  delete safeUser.password;
  
  res.status(200).json({ user: safeUser });
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
      res.status(201).json({ message: "OK", id: user._id.toString()});
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: "Something went wrong" });
    });
}

async function getUserById(req, res) {
  const id = req.params.id; // read ID from path parameter

  try {
    const user = await User.findById(id); // find by MongoDB ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } // If no user is found, respond with 404

    const safeUser = user.toObject();
    delete safeUser.password; // Converts the user to a plain object, remove password

    res.status(200).json({ user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid user ID" });
  }
}

// async function getCurrentUser(req, res) {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     const safeUser = user.toObject();
//     delete safeUser.password;
//     res.status(200).json(safeUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch user info" });
//   }
// }

const UsersController = {
  create: create,
  getUser: getUser,
  getUserById: getUserById,
  // getCurrentUser: getCurrentUser,
};

module.exports = UsersController;
