import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../services/authentication";
import { toast, ToastContainer } from "react-toastify";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

    const notify = (message, err = true) =>
      err ? toast.error(`${message}`) : toast.success(`${message}`);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      notify("Login Successful", false);
      setTimeout(() => {
        console.log("Delayed for 2 seconds.");
        navigate("/posts");
      }, "2000");
    } catch (err) {
      notify(err.message)
      console.error(err);
      navigate("/login");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <>
      <h2>Login</h2>
      <ToastContainer closeOnClick />
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    </>
  );
}
