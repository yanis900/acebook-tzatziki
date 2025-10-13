export function FriendButton(props) {
  return (
    <>
    {!props.isFriend ? (<button onClick={props.handleAddFriend}>Add Friend</button>) : (<button onClick={props.handleRemoveFriend}>Remove Friend</button>)}
    </>
  )
}
