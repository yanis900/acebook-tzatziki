import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts, createPost } from "../../services/posts";
import Post from "../../components/Post";
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
  if (!token) {
    navigate("/login");
    return;
  }

  const handleSubmit = async () => {
    try {
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
        <label>
          <input
            name="Post"
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind??"
          />
        </label>
        <button name="submit" onClick={handleSubmit}>
          Submit
        </button>
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
      <LogoutButton />
    </>
  );
}

// export default function Form() {
//   const [age, setAge] = useState('20');
//   const ageAsNumber = Number(age);
//   return (
//     <>
//       <label>
//         <input name="Post" defaultValue="What's on your mind??" />
//         <button onClick={() => setAge(ageAsNumber + 10)}>
//           Add 10 years
//         </button>
//       </label>
//       {posts.map((post) => (
//           <Post post={post} key={post._id} />
//         ))}
//       </div>
//       <LogoutButton />
//     </>
//   );
// }
