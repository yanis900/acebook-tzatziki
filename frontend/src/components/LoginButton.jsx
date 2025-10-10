import { useNavigate } from "react-router-dom";

function LoginButton() {
  const navigate = useNavigate();

  function goToLogin() {
    navigate("/login");
  }

  return <button onClick={goToLogin}>Login</button>;
}

export default LoginButton;
