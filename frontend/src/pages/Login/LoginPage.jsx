import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../services/authentication";
import { ToastContainer } from "react-toastify";
import SignupButton from "../../components/SignupButton";
import { notify } from "../../utils/notify";
import { LoginForm } from "../../components/LoginForm";
import { PublicNavbar } from "../../components/PublicNavbar";

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
      <PublicNavbar />
      <ToastContainer closeOnClick />
      <div
        className="flex justify-center items-center min-h-screen relative overflow-hidden w-full px-4"
        style={{
          paddingTop: '6rem',
          backgroundColor: '#FEFEF5',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          width: '100vw',
          maxWidth: '100vw',
        }}
      >
        {/* Subtle gradient overlay - 60% primary */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #FEFEF5 0%, rgba(77, 188, 219, 0.05) 100%)',
          }}
        />

        {/* Modern decorative shapes - 30% secondary */}
        <div
          className="absolute -left-20 top-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: '#4DBCDB' }}
        />
        <div
          className="absolute -right-20 bottom-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: '#2B98BA' }}
        />

        <div className="relative z-10 w-full max-w-md">
          {/* Clean, minimal card - Facebook style */}
          <div
            className="rounded-lg p-8 shadow-lg"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #dddfe2',
            }}
          >
            {/* Compact header */}
            <div className="text-center mb-6">
              <h2
                className="text-3xl font-semibold mb-2"
                style={{ color: '#4DBCDB' }}
              >
                Log in to Tzatziki
              </h2>
            </div>

            <LoginForm
              handleSubmit={handleSubmit}
              handleEmailChange={handleEmailChange}
              handlePasswordChange={handlePasswordChange}
              email={email}
              password={password}
            />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#dddfe2' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <SignupButton />
          </div>

          {/* Footer text like Facebook */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Connect with friends and the world around you on Tzatziki.
          </p>
        </div>
      </div>
    </>
  );
}
