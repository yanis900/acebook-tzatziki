import { useNavigate } from "react-router-dom";

function ProfileButton() {
  const navigate = useNavigate();

  function goToProfile() {
    navigate("/profile");
  }

  return <button onClick={goToProfile}>My Profile</button>;
}

export default ProfileButton;
