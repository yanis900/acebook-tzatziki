function Post(props) {
  return <article key={props.post._id}>{props.post.message} - {props.post?.date && new Date(props.post.date).toLocaleDateString('en-GB')}</article>;
}

export default Post;
