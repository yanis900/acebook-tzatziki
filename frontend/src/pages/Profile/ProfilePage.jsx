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
      e.target.value = null;
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // const handleReload = () => {
  //   window.location.reload();
  // };

return (
    <>
        {/* Background remains outside the main content wrapper */}
        <div
            className="fixed inset-0 z-[-1]"
            style={{
                background: 'linear-gradient(180deg, #FEFEF5 0%, rgba(77, 188, 219, 0.05) 100%)',
            }}
        />
        <Navbar currentUser={currentUser || {}} />
        <ToastContainer closeOnClick />
        
        {/* 🟢 CORRECT CONTAINER: Wraps ALL content for centering and spacing */}
        <div className="max-w-lg mx-auto p-4 flex flex-col items-center space-y-8">
            
            {/* 1. Header (Centered) */}
            <h2 className="text-2xl font-bold">My Profile</h2>

            {/* 2. User Data (Alignment fix needed inside UserData.jsx) */}
            {currentUser && <UserData userData={currentUser} />}
            
            {/* 3. File Upload Input */}
            <div className="flex justify-center w-full"> 
                <input 
                    accept="image/*" 
                    type="file" 
                    onChange={handleImageUpload} 
                    className="file-input w-full max-w-xs file-input-bordered" // Add file-input-bordered for correct style
                />
            </div>
            
            {/* 4. Post Form / Feed Section */}
            <div className="feed w-full space-y-4" role="feed">
                <PostForm
                    handleSubmit={handleSubmit}
                    setMessage={setMessage}
                    message={message}
                />
                
                {/* Posts */}
                <div className="space-y-4 mt-4 w-full"> 
                    {posts.map((post) => (
                        <div className="w-full" key={post._id}> 
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
            </div>
        </div>
    </>
);
}