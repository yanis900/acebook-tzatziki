import { getTimeDifference } from "../utils/date";
import { likePost, unlikePost } from "../services/posts";
import { LikeButton } from "/likeButton";
import { useState, useEffect } from "react";

const LikesDisplay = ({ likesBy, likeCount, currentUserId }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (likeCount === 0) return null;

  // Sort so current user appears first
  const sortedLikesBy = likesBy ? [...likesBy].sort((a, b) => {
    if (a._id === currentUserId) return -1;
    if (b._id === currentUserId) return 1;
    return 0;
  }) : [];

  return (
    <div
      style={{ position: "relative", display: "inline-block", marginLeft: "8px" }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span style={{ fontSize: "13px", color: "#65676b", cursor: "pointer" }}>
        {likeCount} {likeCount === 1 ? "like" : "likes"}
      </span>

      {showTooltip && sortedLikesBy.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "8px 12px",
            marginBottom: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            whiteSpace: "nowrap",
            fontSize: "14px"
          }}
        >
          {sortedLikesBy.map((user, index) => (
            <div key={user._id || index}>
              {user._id === currentUserId
                ? "You"
                : `${user.firstname} ${user.lastname}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function Post({ post, currentUserId, onLikeChange }) {
  const [isLiked, setIsLiked] = useState(
    post.likesBy?.some(user => user._id === currentUserId) || false
  );
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  // Update state when post changes (after refresh)
  useEffect(() => {
    setIsLiked(post.likesBy?.some(user => user._id === currentUserId) || false);
    setLikeCount(post.likes || 0);
  }, [post, currentUserId]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await likePost(token, post._id);
      setIsLiked(true);
      setLikeCount(likeCount + 1);
      if (onLikeChange) {
        await onLikeChange();
      }
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
      if (onLikeChange) {
        await onLikeChange();
      }
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
        src={post.user?.image}
        alt=""
      />
      <LikeButton
        isLiked={isLiked}
        likeCount={likeCount}
        handleLike={handleLike}
        handleUnlike={handleUnlike}
      />
      <LikesDisplay likesBy={post.likesBy} likeCount={likeCount} currentUserId={currentUserId} />
    </article>
  );
}

export default Post;
