import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { friendUser, getMe, getUserBySlug, unFriendUser } from "../../services/users";
import { FriendButton } from "../../components/FollowButton";
import Post from "../../components/Post";
import { getFriendPosts } from "../../services/posts";

export function FriendProfilePage() {
  const { userSlug } = useParams();
  const [userData, setUserData] = useState(null);
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
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
    if (me && userData) {
      if (String(me.id) === String(userData._id)) {
        navigate("/profile");
      }
      if (me.friends.includes(userData._id)) {
      setIsFriend(true)
    }
      const token = localStorage.getItem("token");
      getFriendPosts(token, userData._id)
        .then((data) => {
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
        });
    console.log(me.friends)
  }
  }, [me, userData, navigate]);

  const handleAddFriend = async () => {
    try {
    const token = localStorage.getItem("token");

      await friendUser(token, me.id, userData._id)
    } catch (error) {
      console.error(error)
    }
  };

  const handleRemoveFriend = async () => {
    try {
    const token = localStorage.getItem("token");

      await unFriendUser(token, me.id, userData._id)
    } catch (error) {
      console.error(error)
    }
  };

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
        <FriendButton isFriend={isFriend} handleAddFriend={handleAddFriend} handleRemoveFriend={handleRemoveFriend}/>
      </div>
      {isFriend ? (posts.map((post) => (
          <div key={post._id}>
            <Post
              post={post}
              currentUserId={userData?.id}
              onLikeChange={async () => {
                const data = await getFriendPosts(token, userData._id);
                setPosts(data.posts);
              }}
            />
          </div>
        ))): ""}
    </>
  );
}
