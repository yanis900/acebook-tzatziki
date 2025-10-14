import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { signup } from "../../services/authentication";
import { getUser } from "../../services/users";
import LoginButton from "../../components/LoginButton";
import { notify } from "../../utils/notify";
import { SignupForm } from "../../components/SignupForm";
import { validatePassword } from "../../utils/password";

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
      <ToastContainer closeOnClick />
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-base-200 border-base-300 rounded-box w-full max-w-xs border p-4">
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
          <LoginButton />
        </div>
      </div>
    </>
  );
}
