import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../services/authentication";
import { toast, ToastContainer } from "react-toastify";
import SignupButton from "../../components/SignupButton";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

    const notify = (message, err = true) =>
      err ? toast.error(`${message}`) : toast.success(`${message}`);

      useEffect(() => {
    if (location.state?.message) {
      notify(location.state.message, false);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);
  
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
        navigate("/posts", { state: { message: "Login Successful" } });
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
      <SignupButton />
    </>
  );
}
