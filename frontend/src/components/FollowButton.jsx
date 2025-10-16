export function FriendButton(props) {
  return (
    <>
    {!props.isFriend ? (<button className="btn m-8 border-2" style={{backgroundColor: '#4DBCDB', borderColor: '#2B98BA', color: 'white'}} onClick={props.handleAddFriend}>Add Friend</button>) 
    : (<button className="btn mt-8 mb-0 border-2" style={{backgroundColor: '#4DBCDB', borderColor: '#2B98BA', color: 'white'}} onClick={props.handleRemoveFriend}>Remove Friend</button>)}
    </>
  )
}
