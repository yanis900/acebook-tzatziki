import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, createPost } from "../../services/posts";
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
      getPosts(token)
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
        const data = await getPosts(token);
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
      const data = await getPosts(token);
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
          background: 'linear-gradient(180deg, #FEFEF5 0%, rgba(77, 188, 219, 0.08) 50%, #FEFEF5 100%)',
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
      <Navbar currentUser={currentUser} />
      <h2 className="text-3xl font-semibold mb-2" style={{ color: '#4DBCDB' }}>My Feed</h2>
      <ToastContainer closeOnClick />
      <div className="feed" role="feed">
        <PostForm
          handleSubmit={handleSubmit}
          setMessage={setMessage}
          message={message}
        />
        </div>

        {posts.map((post) => (
          <div className="m-4 w-120 mx-auto bg-gray-120" key={post._id}>
            <Post
              post={post}
              currentUserId={currentUser?.id}
              key={post._id}
              onLikeChange={async () => {
                const data = await getPosts(token);
                setPosts(data.posts);
              }}
              allowOwnerActions={false}
            />
          </div>
        ))}
      </div>
    </>
  );
}
