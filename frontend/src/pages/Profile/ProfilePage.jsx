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
import LogoutButton from "../../components/LogoutButton";
import FeedButton from "../../components/FeedButton";
import { ToastContainer } from "react-toastify";
import { PostForm } from "../../components/PostForm";
import { notify } from "../../utils/notify";
import { Navbar } from "../../components/Navbar";

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

  return (
    <>
      {/* ✅ Now passes the same prop name as FeedPage */}
      <Navbar currentUser={currentUser || {}} />

      <h2>Profile Page</h2>
      <ToastContainer closeOnClick />

      {currentUser && (
        <div className="mb-4">
          <img
            width={100}
            height={100}
            className="rounded-full"
            src={currentUser.image}
            alt={currentUser.firstname}
          />
          <p>First Name: {currentUser.firstname}</p>
          <p>Last Name: {currentUser.lastname}</p>
          <p>Email: {currentUser.email}</p>
        </div>
      )}

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
              currentUserId={currentUser?.id || currentUser?._id}
              onLikeChange={async () => {
                const data = await getUserPosts(token, currentUser.id);
                setPosts(data.posts || []);
              }}
            />
            <button
              onClick={() => {
                const newMessage = prompt("Edit your post:", post.message);
                if (newMessage !== null) handleEdit(post._id, newMessage);
              }}
            >
              Edit
            </button>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))}
      </div>

      <FeedButton />
      <LogoutButton />
    </>
  );
}
