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
      res.status(201).json({ message: "OK" });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: "Something went wrong" });
    });
}

const UsersController = {
  create: create,
  getUser: getUser
};

module.exports = UsersController;
