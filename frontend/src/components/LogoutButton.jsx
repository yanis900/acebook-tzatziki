import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton(props) {
  const navigate = useNavigate();

  function logOut() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return <button onClick={logOut}>Log out</button>;
}

export default LogoutButton;
