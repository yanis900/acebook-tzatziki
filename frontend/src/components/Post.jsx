import { getTimeDifference } from "../utils/date";

function Post(props) {
  // Get the image source, with a fallback if user or image doesn't exist
  const rawImageSrc = props.post.user?.image;

  // Apply the Base64 prefix check to ensure it's a valid Data URL
  const safeImageSrc = rawImageSrc 
    ? (rawImageSrc.startsWith('data:') 
      ? rawImageSrc 
      : `data:image/jpeg;base64,${rawImageSrc}`
    )
    : ''; // Fallback to an empty string if no image data

  return (
    <article key={props.post._id}>
      {props.post.message} - {getTimeDifference(props.post?.date && new Date(props.post.date))}
      
      {/* 💡 THE FIX: Use the safeImageSrc with the prefix check */}
      <img 
        width={18} 
        height={18} 
        style={{'borderRadius': '50%'}} 
        src={safeImageSrc} 
        alt={`${props.post.user?.firstname}'s profile`} 
      />
    </article>
  );
}

export default Post;

// import { getTimeDifference } from "../utils/date";

// function Post(props) {

//   return <article key={props.post._id}>{props.post.message} - {getTimeDifference(props.post?.date && new Date(props.post.date))}
//    <img width={18} height={18} style={{'borderRadius': '50%'}} src={props.post.user?.image} alt="" />
//    </article>;
// }

// export default Post;