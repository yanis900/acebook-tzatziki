require("../mongodb_helper");
const User = require("../../models/user");

describe("User model", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("has a first name", () => {
    const user = new User({
      firstname: "John",
      lastname: "Doe",
      email: "someone@example.com",
      password: "password",
    });
    expect(user.firstname).toEqual("John");
  });

  it("has a last name", () => {
    const user = new User({
      firstname: "John",
      lastname: "Doe",
      email: "someone@example.com",
      password: "password",
    });
    expect(user.lastname).toEqual("Doe");
  });

  it("has an email address", () => {
    const user = new User({
      firstname: "John",
      lastname: "Doe",
      email: "someone@example.com",
      password: "password",
    });
    expect(user.email).toEqual("someone@example.com");
  });

  it("has a password", () => {
    const user = new User({
      firstname: "John",
      lastname: "Doe",
      email: "someone@example.com",
      password: "password",
    });
    expect(user.password).toEqual("password");
  });

  it("can list all users", async () => {
    const users = await User.find();
    expect(users).toEqual([]);
  });

  it("can save a user", async () => {
    const user = new User({
      firstname: "John",
      lastname: "Doe",
      email: "someone@example.com",
      password: "password",
    });

    await user.save();
    const users = await User.find();

    expect(users[0].email).toEqual("someone@example.com");
    expect(users[0].password).toEqual("password");
  });
});
