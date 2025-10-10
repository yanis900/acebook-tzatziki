import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, deletePost, getUserPosts } from "../../services/posts";
import { getMe } from "../../services/users";
import Post from "../../components/Post";
import LogoutButton from "../../components/LogoutButton";
import FeedButton from "../../components/FeedButton";

export function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getMe(token)
        .then((data) => {
          console.log(data);
          setUserData(data);
        })
        .catch((err) => {
          console.error("Error fetching verified user info", err);
        });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn && userData) {
      getUserPosts(token, userData.id)
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
  }, [navigate, userData]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await createPost(token, message);
      const data = await getUserPosts(token, userData.id);
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
    const updatedPosts = await getUserPosts(token, userData.id);
    setPosts(updatedPosts.posts);
    localStorage.setItem("token", updatedPosts.token);
  };

  const convertToBase64 = (e) => {
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
      console.log(reader.result)
    }
  }

  return (
    <>
      <h2>Profile Page</h2>
      {userData && (
        <div>
          <img width={100} height={100} src={userData.image}/>
          <p>First Name: {userData.firstname}</p>
          <p>Last Name: {userData.lastname}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
      <input accept="image/*" type="file" onChange={convertToBase64} />
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
