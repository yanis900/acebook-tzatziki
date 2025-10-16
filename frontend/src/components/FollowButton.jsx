export function FriendButton(props) {
  return (
    <>
    {!props.isFriend ? (<button className="btn" onClick={props.handleAddFriend}>Add Friend</button>) : (<button className="btn" onClick={props.handleRemoveFriend}>Remove Friend</button>)}
    </>
  )
}
