import { useNavigate } from "react-router-dom";

function FeedButton() {
  const navigate = useNavigate();

  function goToFeed() {
    navigate("/posts");
  }

  return <button onClick={goToFeed}>Feed Page</button>;
}

export default FeedButton;
