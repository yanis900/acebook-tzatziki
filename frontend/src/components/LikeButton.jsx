import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

export function LikeButton(props) {
  return (
    <button
      type="button"
      onClick={props.isLiked ? props.handleUnlike : props.handleLike}
      className={`bg-transparent border-0 appearance-none leading-none text-2xl cursor-pointer focus:outline-none focus:ring-0 transition-colors duration-200 ${
        props.isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-700"
      }`}
      aria-label={props.isLiked ? "Unlike" : "Like"}
    >
      {props.isLiked ? (
        <AiFillHeart aria-hidden="true" />
      ) : (
        <AiOutlineHeart aria-hidden="true" />
      )}
    </button>
  );
}
