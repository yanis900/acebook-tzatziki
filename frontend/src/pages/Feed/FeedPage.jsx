import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, createPost } from "../../services/posts";
import Post from "../../components/Post";
import ProfileButton from "../../components/ProfileButton";
import LogoutButton from "../../components/LogoutButton";


export function FeedPage() {
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
  // const userId = decodeToken(token)
  // console.log(userId)
  // console.log(userId.sub)
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

  return (
    <>
      <h2>Feed Page</h2>
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
          <Post post={post} key={post._id} />
        ))}
      </div>
      <ProfileButton />
      <LogoutButton />
    </>
  );
}
