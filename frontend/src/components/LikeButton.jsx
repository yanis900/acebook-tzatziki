export function LikeButton(props) {
  return (
    <button
      onClick={props.isLiked ? props.handleUnlike : props.handleLike}
      className={`text-2xl focus:outline-none transition-colors duration-200 ${
        props.isLiked ? "text-red-500" : "text-gray-500"
      }`}
      aria-label={props.isLiked ? "Unlike" : "Like"}
    >
      {props.isLiked ? "♥" : "♡"}
    </button>
  );
}
