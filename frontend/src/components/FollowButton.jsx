export function FriendButton(props) {
  return (
    <>
    {!props.isFriend ? (<button onClick={props.handleFollow}>Follow</button>) : (<button onClick={props.handleUnfollow}>Unfriend</button>)}
    </>
  )
}
