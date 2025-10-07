import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/posts";
import Post from "../../components/Post";
import LogoutButton from "../../components/LogoutButton";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('')
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
  const url = 'http://localhost:3000/posts'
  try {
    console.log(token)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({message: message})
    })

    const data = await response.json()
    console.log(message)
    console.log(data)

    return data
  } catch (error) {
    console.log(error)
  }

}

  return (
    <>
      <h2>Feed Page</h2>
      <div className="feed" role="feed">
        <label>
            <input name="Post" onChange={(e) => setMessage(e.target.value)} placeholder="What's on your mind??" />
        </label>
        <label>
            <button onClick={handleSubmit}>:-8</button>
        </label>
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