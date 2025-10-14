export function LikeButton(props) {
  return (
    <>
      {!props.isLiked ? (
        <button onClick={props.handleLike}>
          Like {props.likeCount > 0 && `(${props.likeCount})`}
        </button>
      ) : (
        <button
          onClick={props.handleUnlike}
          style={{ backgroundColor: "blue", color: "white" }}
        >
          Like {props.likeCount > 0 && `(${props.likeCount})`}
        </button>
      )}
    </>
  );
}
