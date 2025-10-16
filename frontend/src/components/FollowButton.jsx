export function FriendButton(props) {
  return (
    <>
    {!props.isFriend ? (<button className="btn m-8" onClick={props.handleAddFriend}>Add Friend</button>) : (<button className="btn mt-8 mb-0" onClick={props.handleRemoveFriend}>Remove Friend</button>)}
    </>
  )
}
