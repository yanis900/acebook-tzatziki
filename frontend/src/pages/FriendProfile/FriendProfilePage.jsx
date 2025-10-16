import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  friendUser,
  getMe,
  getUserBySlug,
  unFriendUser,
} from "../../services/users";
import { FriendButton } from "../../components/FollowButton";
import Post from "../../components/Post";
import { getFriendPosts } from "../../services/posts";
import { UserData } from "../../components/UserData";
import { Navbar } from "../../components/Navbar";

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

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (me && userData) {
      if (String(me.id) === String(userData._id)) {
        navigate("/profile");
      }
      if (me.friends.includes(userData._id)) {
        setIsFriend(true);
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
      console.log(me.friends);
    }
  }, [me, userData, navigate]);

  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem("token");

      await friendUser(token, me.id, userData._id);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const token = localStorage.getItem("token");

      const confirmRemove = window.confirm(
        "Are you sure you want to remove this friend?"
      );
      if (!confirmRemove) {
        return;
      }
      await unFriendUser(token, me.id, userData._id);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <>
      <div className="fixed inset-0 z-[-1]"
          style={{
            background: 'linear-gradient(180deg, #FEFEF5 0%, rgba(77, 188, 219, 0.05) 100%)',
          }}
      />
    <div className="relative min-h-screen flex flex-col items-center">
      <Navbar/>
      <main className="container max-w-4xl px-4 w-full">
      <div className="flex flex-col items-center text-center py-4">
        <h2 className="text-2xl font-bold">{userData.firstname ? userData.firstname.charAt(0).toUpperCase() + userData.firstname.slice(1) : ''}&apos;s Feed</h2>
        {userData && <UserData userData={userData} />}
        <FriendButton 
          isFriend={isFriend}
          handleAddFriend={handleAddFriend}
          handleRemoveFriend={handleRemoveFriend}
        />
      </div>
      {isFriend
        ? posts.map((post) => (
            <div className="m-4 w-120 mx-auto" key={post._id} >
              <Post
                post={post}
                currentUserId={me?.id}
                onLikeChange={async () => {
                  const data = await getFriendPosts(token, userData._id);
                  setPosts(data.posts);
                }}
              />
            </div>
          ))
        : ""}
      </main>
    </div>
    </>
  );
}
