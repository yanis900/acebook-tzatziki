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
import LogoutButton from "../../components/LogoutButton";
import FeedButton from "../../components/FeedButton";
import MyFriendsButton from "../../components/MyFriendsButton";
import { ToastContainer } from "react-toastify";
import { PostForm } from "../../components/PostForm";
import { notify } from "../../utils/notify";
import { UserData } from "../../components/UserData";

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
      const data = await getUserPosts(token, userData.id);
      setPosts(data.posts);
      notify(d.message, false);
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (postId) => {
    try {
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
      notify("Post deleted successfully!", false);
    } catch (err) {
      notify(err);
      console.error(err);
    }
  };

  const handleEdit = async (postId, newMessage) => {
    try {
      const d = await editPost(token, postId, newMessage);
      const updatedData = await getUserPosts(token, userData.id);
      setPosts(updatedData.posts);
      notify(d.message, false);
      localStorage.setItem("token", updatedData.token);
    } catch (error) {
      console.log(error);
      notify(error.message || "Failed to edit post", true);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Send the file directly
      const data = await updateImage(token, userData.id, file);

      // Update user state with new image
      setUserData((prev) => ({ ...prev, image: data.image }));
      // Update token in localStorage
      localStorage.setItem("token", data.token);
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
      <h2>Profile Page</h2>
      <ToastContainer closeOnClick />
      {userData && <UserData userData={userData} />}
      <input accept="image/*" type="file" onChange={handleImageUpload} />
      <button onClick={handleReload}>Submit Image</button>
      <div className="feed" role="feed">
        <PostForm
          handleSubmit={handleSubmit}
          setMessage={setMessage}
          message={message}
        />

        {posts.map((post) => (
          <div key={post._id}>
            <ul className="list bg-base-100 rounded-box shadow-md">
              <Post
                post={post}
                currentUserId={userData?.id}
                onLikeChange={async () => {
                  const data = await getUserPosts(token, userData.id);
                  setPosts(data.posts);
                }}
              />
              <button
                onClick={() => {
                  const newMessage = prompt("Edit your post:", post.message);
                  if (newMessage !== null) {
                    handleEdit(post._id, newMessage);
                  }
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(post._id)}>Delete</button>
            </ul>
          </div>
        ))}
      </div>
      <MyFriendsButton />
      <FeedButton />
      <LogoutButton />
    </>
  );
}
