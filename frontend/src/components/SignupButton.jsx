import { useNavigate } from "react-router-dom";

function SignupButton() {
  const navigate = useNavigate();

  function goToSignup() {
    navigate("/signup");
  }

  return <button className="link" onClick={goToSignup}>Sign Up</button>;
}

export default SignupButton;
