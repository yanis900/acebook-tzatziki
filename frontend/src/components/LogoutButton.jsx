import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  function logOut() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return <button onClick={logOut} className="btn btn-ghost w-full justify-start">Log out</button>;
}

export default LogoutButton;
