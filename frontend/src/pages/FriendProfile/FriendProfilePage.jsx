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
import { Loading } from "../../components/Loading";

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
      // console.log(me.friends);
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

  if (!userData) {
    return <Loading />;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[-1]"
        style={{
          background:
            "linear-gradient(180deg, #FEFEF5 0%, rgba(77, 188, 219, 0.08) 50%, #FEFEF5 100%)",
        }}
      >
        {/* Modern mesh gradient overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(at 20% 30%, rgba(77, 188, 219, 0.3) 0px, transparent 50%),
              radial-gradient(at 80% 20%, rgba(231, 245, 169, 0.4) 0px, transparent 50%),
              radial-gradient(at 40% 70%, rgba(77, 188, 219, 0.2) 0px, transparent 50%),
              radial-gradient(at 90% 80%, rgba(231, 245, 169, 0.3) 0px, transparent 50%)
            `,
          }}
        />
      </div>
      <div className="relative min-h-screen flex flex-col items-center">
        <Navbar />
        <main className="container max-w-4xl px-4 w-full">
          <div className="flex flex-col items-center text-center py-4">
            <h2
              className="text-3xl font-semibold mb-2"
              style={{ color: "#4DBCDB" }}
            >
              {userData.firstname
                ? userData.firstname.charAt(0).toUpperCase() +
                  userData.firstname.slice(1)
                : ""}
              &apos;s Feed
            </h2>
            {userData && <UserData userData={userData} />}
            <FriendButton
              isFriend={isFriend}
              handleAddFriend={handleAddFriend}
              handleRemoveFriend={handleRemoveFriend}
            />
          </div>
          {isFriend
            ? posts.map((post) => (
                <div className="m-4 w-120 mx-auto" key={post._id}>
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
