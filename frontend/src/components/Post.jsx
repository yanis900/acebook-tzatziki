import { getTimeDifference } from "../utils/date";
import { likePost, unlikePost } from "../services/posts";
import { LikeButton } from "./likeButton";
import { useState } from "react";

function Post({ post, currentUserId }) {
  const [isLiked, setIsLiked] = useState(
    post.likesBy?.includes(currentUserId) || false
  );
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  // Get the image source, with a fallback if user or image doesn't exist
  const rawImageSrc = post.user?.image;

  // Apply the Base64 prefix check to ensure it's a valid Data URL
  const safeImageSrc = rawImageSrc 
    ? (rawImageSrc.startsWith('data:') 
      ? rawImageSrc 
      : `data:image/jpeg;base64,${rawImageSrc}`
    )
    : ''; // Fallback to an empty string if no image data

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await likePost(token, post._id);
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      const token = localStorage.getItem("token");
      await unlikePost(token, post._id);
      setIsLiked(false);
      setLikeCount(likeCount - 1);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  return (
    <article key={post._id}>
      {post.message} - {getTimeDifference(post?.date && new Date(post.date))}
      <img
        width={18}
        height={18}
        style={{ borderRadius: "50%" }}
        src={safeImageSrc} 
        alt={`${post.user?.firstname}'s profile`} 
      />
      <LikeButton
        isLiked={isLiked}
        likeCount={likeCount}
        handleLike={handleLike}
        handleUnlike={handleUnlike}
      />
    </article>
  );
}

export default Post;
