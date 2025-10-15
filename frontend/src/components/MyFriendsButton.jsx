import { useNavigate } from "react-router-dom";

function MyFriendsButton() {
  const navigate = useNavigate();

  function goToMyFriendsPage() {
    navigate("/myfriends");
  }

  return <button onClick={goToMyFriendsPage}>My Friends</button>;
}

export default MyFriendsButton;