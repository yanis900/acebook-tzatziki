import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { signup } from "../../services/authentication";
import { getUser } from "../../services/users";

export function SignupPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const notify = (err) => toast.error(`${err}`);

  const validatePassword = (password) => {
    if (password < 8) {
      throw new Error("Password Must Be Minimum 8 Characters");
    }
    if (password > 16) {
      throw new Error("Password Must Be Maximum 16 Characters");
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password Must Contain At Least 1 Capital Letter");
    }
    if (!/[0-9]/.test(password)) {
      throw new Error("Password Must Contain At Least 1 Number");
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      throw new Error("Password Must Contain At Least 1 Special Character");
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords Do Not Match");
      }
      const exists = await getUser(email);
      if (exists) {
        throw new Error("Email Already In Use");
      }

      validatePassword(password);
      const data = await signup(firstname, lastname, email, password);
      localStorage.setItem("id", data.id)
      navigate("/login");
    } catch (err) {
      notify(err);
      console.error(err);
      navigate("/signup");
    }
  }

  function handleFirstNameChange(event) {
    setFirstname(event.target.value);
  }
  function handleLastNameChange(event) {
    setLastname(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }

  return (
    <>
      <h2>Signup</h2>
      <ToastContainer closeOnClick />
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstname">Firstname:</label>
        <input
          id="firstname"
          type="text"
          value={firstname}
          onChange={handleFirstNameChange}
          required
        />
        <label htmlFor="lastname">Lastname:</label>
        <input
          id="lastname"
          type="text"
          value={lastname}
          onChange={handleLastNameChange}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          placeholder="Password"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          minLength={8}
          maxLength={16}
          required
        />
        <label htmlFor="confirm">Confirm Password:</label>
        <input
          placeholder="Confirm Password"
          id="confirm"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    </>
  );
}
