import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPost,
  deletePost,
  getUserPosts,
  editPost,
} from "../../services/posts";
import { getMe } from "../../services/users";
import Post from "../../components/Post";
import { ToastContainer } from "react-toastify";
import { PostForm } from "../../components/PostForm";
import { notify } from "../../utils/notify";
import { Navbar } from "../../components/Navbar";
import { UserData } from "../../components/UserData";

export function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const loggedIn = token !== null;
    if (loggedIn) {
      getMe(token)
        .then((data) => {
          console.log(data);
          setCurrentUser(data);
        })
        .catch((err) => {
          console.error("Error fetching verified user info", err);
        });
      getUserPosts(token)
        .then((data) => {
          console.log("data", data);
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }

    (async () => {
      try {
        // Fetch user info
        const me = await getMe(token);
        setCurrentUser(me);

        // Fetch that user's posts
        const userPosts = await getUserPosts(token, me.id || me._id);
        setPosts(userPosts.posts || []);
        if (userPosts.token) localStorage.setItem("token", userPosts.token);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        navigate("/login");
      }
    })();

    // Update profile when navbar notifies of a profile change (avatar updated)
    const handleProfileUpdated = async () => {
      try {
        const updated = await getMe(token);
        setCurrentUser(updated);
      } catch (err) {
        console.error("Error refreshing profile after update:", err);
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, [navigate]);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !currentUser?.id) return;

    try {
      const created = await createPost(token, message);
      const updated = await getUserPosts(token, currentUser.id);
      setPosts(updated.posts || []);
      notify(created.message || "Post created!", false);
      if (updated.token) localStorage.setItem("token", updated.token);
      setMessage("");
    } catch (error) {
      console.error(error);
      notify(error.message || "Failed to create post", true);
    }
  };

  const handleDelete = async (postId) => {
    if (!token || !currentUser?.id) return;
    try {
      const confirmDelete = window.confirm("Delete this post?");
      if (!confirmDelete) return;

      await deletePost(token, postId);
      const updated = await getUserPosts(token, currentUser.id);
      setPosts(updated.posts || []);
      if (updated.token) localStorage.setItem("token", updated.token);
      notify("Post deleted successfully!", false);
    } catch (err) {
      console.error(err);
      notify(err.message || "Failed to delete post", true);
    }
  };

  const handleEdit = async (postId, newMessage) => {
    if (!token || !currentUser?.id) return;
    try {
      const res = await editPost(token, postId, newMessage);
      const updated = await getUserPosts(token, currentUser.id);
      setPosts(updated.posts || []);
      notify(res.message || "Post updated!", false);
      if (updated.token) localStorage.setItem("token", updated.token);
    } catch (error) {
      console.error(error);
      notify(error.message || "Failed to edit post", true);
    }
  };


  // const handleReload = () => {
  //   window.location.reload();
  // };

  return (
    <>
        <div
          className="fixed inset-0 z-[-1]"
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
    <div className="flex flex-col items-center"></div>
      <Navbar currentUser={currentUser || {}} />
      <div className="flex flex-col items-center text-center">
      <ToastContainer closeOnClick />
      <div className="max-w-lg mx-auto p-4 flex flex-col items-center space-y-8"></div>
      
        <h2 className="text-3xl font-semibold mb-2" style={{ color: '#4DBCDB' }}>My Profile</h2>
        
        {currentUser && <UserData userData={currentUser} />} </div>
        <div className="space-y-4 mt-4"></div>
        
        <div className="space-y-4 mt-2"></div>
        <div className="feed w-full" role="feed">
          <div className="flex flex-col items-center text-center py-4">
          <PostForm
            handleSubmit={handleSubmit}
            setMessage={setMessage}
            message={message}
          />
          <div className="space-y-4 mt-2"></div> </div>
          {posts.map((post) => (
            <div className="w-120 mx-auto" key={post._id}>
                <Post
                  post={post}
                  currentUserId={currentUser?.id}
                  onLikeChange={async () => {
                    const data = await getUserPosts(token, currentUser.id);
                    setPosts(data.posts);
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
            </div>
          ))}
        </div>
    </>  
  );
}
