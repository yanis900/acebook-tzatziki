import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { signup } from "../../services/authentication";

export function SignupPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const notify = (err) => toast.error(`${err}`);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords Do Not Match");
      }
      await signup(firstname, lastname, email, password);
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
      {/* <button onClick={notify}>🍞</button> */}
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
