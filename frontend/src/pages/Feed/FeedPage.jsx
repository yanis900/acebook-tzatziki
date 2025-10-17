import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getFriendsPosts } from "../../services/posts";
import Post from "../../components/Post";
import { ToastContainer } from "react-toastify";
import { PostForm } from "../../components/PostForm";
import { notify } from "../../utils/notify";
import { getMe } from "../../services/users";
import { Navbar } from "../../components/Navbar";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getMe(token)
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((err) => {
          console.error("Error fetching current user", err);
        });
      getFriendsPosts(token)
        .then((data) => {
          console.log(data.posts)
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }

    // Listen for profile updates (avatar change in navbar)
    const handleProfileUpdated = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const me = await getMe(token);
        setCurrentUser(me);
        const data = await getFriendsPosts(token);
        setPosts(data.posts || []);
        if (data.token) localStorage.setItem("token", data.token);
      } catch (err) {
        console.error("Error refreshing feed after profile update:", err);
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const d = await createPost(token, message);
      const data = await getFriendsPosts(token);
      setPosts(data.posts);
      notify(d.message, false);
      localStorage.setItem("token", data.token);
      setMessage("");
    } catch (error) {
      notify(error);
      console.log(error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[-1]"
        style={{
        background: 'linear-gradient(180deg, #FEFEF5 0%, rgba(77, 188, 219, 0.05) 100%)',
        }}
      />
      <div className="relative min-h-screen flex flex-col items-center">
      <Navbar currentUser={currentUser} />
      <h2 className="text-2xl font-bold">My Feed</h2>
      <ToastContainer closeOnClick />
      <div className="feed" role="feed">
        <PostForm
          handleSubmit={handleSubmit}
          setMessage={setMessage}
          message={message}
        />
        </div>
        <div className="m-4 w-120 mx-auto bg-gray-120" >
        {posts.length === 0 ? (<div 
            role="alert" 
            className="alert shadow-lg bg-[#4DBCDB] text-white border-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Add friends to see posts.</span>
          </div>) : posts.map((post) => (
            <Post
              post={post}
              currentUserId={currentUser?.id}
              key={post._id}
              onLikeChange={async () => {
                const data = await getFriendsPosts(token);
                setPosts(data.posts);
              }}
              allowOwnerActions={false}
            />
          ))}
          </div>
      </div>
    </>
  );
}
