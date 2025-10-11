import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, createPost } from "../../services/posts";
import Post from "../../components/Post";
import ProfileButton from "../../components/ProfileButton";
import LogoutButton from "../../components/LogoutButton";
import { ToastContainer } from "react-toastify";
import { PostForm } from "../../components/PostForm";
import { SearchForm } from "../../components/SearchForm";
import { notify } from "../../utils/notify";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPosts(token)
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
    } catch (error) {
      notify(error);
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?name=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <h2>Feed Page</h2>
      <ToastContainer closeOnClick />
      <div className="feed" role="feed">
        <SearchForm
          handleSearch={handleSearch}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />

        <PostForm
          handleSubmit={handleSubmit}
          setMessage={setMessage}
          message={message}
        />

        {posts.map((post) => (
          <div key={post._id}>
            <Post post={post} key={post._id} />
          </div>
        ))}
      </div>
      <ProfileButton />
      <LogoutButton />
    </>
  );
}
