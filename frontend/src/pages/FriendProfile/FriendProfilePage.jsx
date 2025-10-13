import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMe, getUserBySlug } from "../../services/users";

export function FriendProfilePage() {
  const { userSlug } = useParams();
  const [userData, setUserData] = useState(null);
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getMe(token)
        .then((data) => {
          setMe(data);
        })
        .catch((err) => {
          console.error("Error fetching verified user info", err);
        });
      getUserBySlug(token, userSlug)
        .then((data) => {
          setUserData(data.user);
        })
        .catch((err) => {
          console.error("Error fetching verified user info", err);
        });
    }
  }, [userSlug]);

  useEffect(() => {
    if (me && userData && String(me.id) === String(userData._id)) {
              navigate("/profile")
    }
  }, [me, userData, navigate]);

   if (!userData) return <p>Loading...</p>;

   return (
    <>
      <div>
        <img
          width={100}
          height={100}
          style={{ borderRadius: "50%" }}
          src={userData.image}
        />
        <p>First Name: {userData.firstname}</p>
        <p>Last Name: {userData.lastname}</p>
        <p>Email: {userData.email}</p>
        <p>Email: {userData._id}</p>
      </div>
    </>
  );
}
