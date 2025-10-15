import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/notify";
import { getFriends} from "../../services/users";

export function ListFriendsPage() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getFriends(token)
      .then((data) => {
        console.log("data", data);
        setResults(data.users || []);
        localStorage.setItem("token", data.token);
      })
      .catch((err) => {
        console.error(err);
        notify(err);
      });
  }, [token, navigate]);

  return (
    <div>
      <h2>My Friends</h2>
      {results.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        <div>
          {results.map((user) => (
            <a
              key={user._id}
              href={`/profile/${user.firstname}-${
                user.lastname
              }-${user._id.slice(-6)}`}
            >
              {user.firstname} {user.lastname}{" "}
              <img
                width={18}
                height={18}
                style={{ borderRadius: "50%" }}
                src={user?.image}
                alt=""
              />
            </a>
          ))}
        </div>
      )}
      <button onClick={() => navigate(-1)}>Back to Feed</button>
    </div>
  );
}
