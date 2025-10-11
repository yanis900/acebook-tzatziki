
export function PostForm(props) {
    return (
        <form onSubmit={props.handleSubmit}>
          <label>
            <input
              name="Post"
              type="text"
              onChange={(e) => props.setMessage(e.target.value)}
              placeholder="What's on your mind??"
              required
            />
          </label>
          <button type="submit" disabled={!props.message.trim()}>
            Submit
          </button>
        </form>
    )
}