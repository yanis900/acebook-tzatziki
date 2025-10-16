import { useNavigate } from "react-router-dom";

function LoginButton() {
  const navigate = useNavigate();

  function goToLogin() {
    navigate("/login");
  }

  return <div className="flex justify-center"> 
  <button
    className="btn btn-outline w-1/2"
    onClick={goToLogin}
  >
    Login
  </button>
</div>
}

export default LoginButton;
