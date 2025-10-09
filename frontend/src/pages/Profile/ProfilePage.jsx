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

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await createPost(token, message);
      const data = await getPosts(token);
      setPosts(data.posts);
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.log(error);
    }
  };
  
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
    <>
      <h2>Profile Page</h2>
      <div className="feed" role="feed">
        <form onSubmit={handleSubmit}>
          <label>
            <input
              name="Post"
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind??"
              required
            />
          </label>
          <button type="submit" disabled={!message.trim()}>
            Submit
          </button>
        </form>
        {posts.map((post) => (
        <div key={post._id}>
          <Post post={post} />
          <button onClick={() => handleDelete(post._id)}>Delete</button>
        </div>
      ))}
      </div>
      <FeedButton />
       <LogoutButton />
    </>
  );
}
