import { getTimeDifference } from "../utils/date";
import { likePost, unlikePost } from "../services/posts";
import { LikeButton } from "./LikeButton";
import { useState, useEffect } from "react";
import { capitalise } from "../utils/capitalise";

const LikesDisplay = ({ likesBy, likeCount, currentUserId }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (likeCount === 0) return null;

  // Sort so current user appears first
  const sortedLikesBy = likesBy
    ? [...likesBy].sort((a, b) => {
        if (a._id === currentUserId) return -1;
        if (b._id === currentUserId) return 1;
        return 0;
      })
    : [];

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
      className="mb-2"
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
            fontSize: "14px",
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

function Post({
  post,
  currentUserId,
  onLikeChange,
  onEdit,
  onDelete,
  allowOwnerActions = true,
}) {
  const [isLiked, setIsLiked] = useState(
    post.likesBy?.some((user) => user._id === currentUserId) || false
  );
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  // Get the image source, with a fallback if user or image doesn't exist
  const rawImageSrc = post.user?.image;

  // Apply the Base64 prefix check to ensure it's a valid Data URL
  const safeImageSrc = rawImageSrc
    ? rawImageSrc.startsWith("data:")
      ? rawImageSrc
      : `data:image/jpeg;base64,${rawImageSrc}`
    : ""; // Fallback to an empty string if no image data
  // Update state when post changes (after refresh)
  useEffect(() => {
    setIsLiked(
      post.likesBy?.some((user) => user._id === currentUserId) || false
    );
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

  const isOwner = Boolean(
    allowOwnerActions &&
      currentUserId &&
      post.user &&
      String(currentUserId) === String(post.user._id)
  );

  return (
    <article key={post._id} className="mb-4 max-w-md mx-auto shadow-lg">
      <div className="flex flex-col p-4 border border-[#E7F5A9] rounded-lg shadow bg-base-100">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img
                src={safeImageSrc}
                alt={`${post.user?.firstname}'s profile`}
              />
            </div>
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-sm m-0">
              {capitalise(post.user?.firstname)}{" "}
              {capitalise(post.user?.lastname)}
            </h4>
            <p className="text-xs text-gray-500 m-0">
              {getTimeDifference(post?.date && new Date(post.date))}
            </p>
          </div>
        </div>

        <p className="text-left pt-3 pb-4 text-sm max-h-40 overflow-auto break-words border-b border-gray-200">
          {post.message}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LikeButton
              isLiked={isLiked}
              likeCount={likeCount}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
            />
            <LikesDisplay
              likesBy={post.likesBy}
              likeCount={likeCount}
              currentUserId={currentUserId}
            />
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  try {
                    const newMessage = prompt("Edit your post:", post.message);
                    if (newMessage !== null && typeof onEdit === "function") {
                      onEdit(post._id, newMessage);
                    }
                  } catch (err) {
                    console.error("Error editing post:", err);
                  }
                }}
                className="btn btn-sm btn-outline"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  try {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this post?"
                      )
                    ) {
                      if (typeof onDelete === "function") onDelete(post._id);
                    }
                  } catch (err) {
                    console.error("Error deleting post:", err);
                  }
                }}
                className="btn btn-sm btn-error text-white"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default Post;
