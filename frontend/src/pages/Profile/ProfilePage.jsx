import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPost,
  deletePost,
  getUserPosts,
  editPost,
} from "../../services/posts";
import { getMe, updateImage } from "../../services/users";
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

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Send the file directly
      const data = await updateImage(token, currentUser.id, file);

      // Update user state with new image
      setCurrentUser((prev) => ({ ...prev, image: data.image }));
      // Update token in localStorage
      localStorage.setItem("token", data.token);

      // Dispatch custom event to notify navbar of profile update
      window.dispatchEvent(new Event('profileUpdated'));

      e.target.value = null;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
    <Navbar currentUser={currentUser || {}} />
      <h2 className="text-2xl font-bold">My Profile</h2>
      <ToastContainer closeOnClick />
      {currentUser && <UserData userData={currentUser} />}
      <div className="flex items-center justify-center gap-4">

      <input accept="image/*" type="file" onChange={handleImageUpload} className="file-input"/>
      <button onClick={handleReload} className="btn btn-sm btn-outline">Submit Image</button>
      </div>
      <div className="feed" role="feed">
        <PostForm
          handleSubmit={handleSubmit}
          setMessage={setMessage}
          message={message}
        />

        {posts.map((post) => (
          <div key={post._id}>
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
