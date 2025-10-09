import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, createPost, deletePost } from "../../services/posts";
import Post from "../../components/Post";
import LogoutButton from "../../components/LogoutButton";
import FeedButton from "../../components/FeedButton";

export function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPosts(token)
        .then((data) => {
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) {
      return; // User clicked "Cancel", so stop here
    }

    const token = localStorage.getItem("token");
    await deletePost(token, postId);
    const updatedPosts = await getPosts(token);
    setPosts(updatedPosts.posts);
    localStorage.setItem("token", updatedPosts.token);
  };

  return (
    <div>
      <h2>My Profile</h2>
      <p>My Posts:</p>
      {posts.map((post) => (
        <div key={post._id}>
          <Post post={post} />
          <button onClick={() => handleDelete(post._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
