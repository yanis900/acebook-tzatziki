import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { signup } from "../../services/authentication";
import { getUser } from "../../services/users";
import LoginButton from "../../components/LoginButton";
import { notify } from "../../utils/notify";
import { SignupForm } from "../../components/SignupForm";
import { validatePassword } from "../../utils/password";
import { PublicNavbar } from "../../components/PublicNavbar";

export function SignupPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

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
      await signup(firstname, lastname, email, password);

      navigate("/login", {
        state: { message: "Account Successfully Created" },
      });
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
          className="absolute -right-20 top-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: '#4DBCDB' }}
        />
        <div
          className="absolute -left-20 bottom-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
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
                Sign Up
              </h2>
              <p className="text-gray-600 text-sm">It's quick and easy.</p>
            </div>

            <SignupForm
              handleSubmit={handleSubmit}
              handleFirstNameChange={handleFirstNameChange}
              handleLastNameChange={handleLastNameChange}
              handleEmailChange={handleEmailChange}
              handlePasswordChange={handlePasswordChange}
              handleConfirmPasswordChange={handleConfirmPasswordChange}
              firstname={firstname}
              lastname={lastname}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
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

            <LoginButton />
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
