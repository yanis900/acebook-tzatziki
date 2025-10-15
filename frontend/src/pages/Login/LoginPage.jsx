import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../services/authentication";
import { ToastContainer } from "react-toastify";
import SignupButton from "../../components/SignupButton";
import { notify } from "../../utils/notify";
import { LoginForm } from "../../components/LoginForm";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

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
      notify(err.message);
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
      <ToastContainer closeOnClick />
      <div className="flex justify-center items-center min-h-screen">
      <div className="bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <LoginForm
        handleSubmit={handleSubmit}
        handleEmailChange={handleEmailChange}
        handlePasswordChange={handlePasswordChange}
        email={email}
        password={password}
        />
      <SignupButton />
        </div>
      </div>
    </>
  );
}
