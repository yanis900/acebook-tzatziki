function Post(props) {
  return <article key={props.post._id}>{props.post.message} - {props.post?.date && new Date(props.post.date).toLocaleDateString('en-GB')}
   <img width={18} height={18} style={{'borderRadius': '50%'}} src={props.post.user?.image} alt="" />
   </article>;
}

export default Post;
