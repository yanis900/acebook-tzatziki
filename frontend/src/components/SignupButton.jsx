import { useNavigate } from "react-router-dom";

function SignupButton() {
  const navigate = useNavigate();

  function goToSignup() {
    navigate("/signup");
  }

  return <div className="flex justify-center"> {/* Add this div to center it */}
  <button
    className="btn btn-outline w-1/2" // Using outline style and half width
    onClick={goToSignup}
  >
    Sign Up
  </button>
</div>
}

export default SignupButton;
