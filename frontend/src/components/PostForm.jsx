
export function PostForm(props) {
    return (
        <form onSubmit={props.handleSubmit} className="flex items-center gap-2">
          <label>
            <input
              name="Post"
              type="text"
              value={props.message}
              onChange={(e) => props.setMessage(e.target.value)}
              placeholder="What's on your mind??"
              required
            className="input w-64 border-2"
            style={{
              backgroundColor: '#FEFEF5',
              borderColor: '#EAF0D4'
            }}
            />
          </label>
          <button type="submit" disabled={!props.message.trim()}  className="btn border-2"
            style={{
              backgroundColor: '#4DBCDB',
              borderColor: '#2B98BA',
              color: 'white'
            }}>
            Submit
          </button>
        </form>
    )
}

    //     <form onSubmit={props.handleSearch} className="flex gap-2">
    //       <input
    //         name="Search"
    //         type="search"
    //         value={props.searchQuery}
    //         onChange={(e) => props.setSearchQuery(e.target.value)}
    //         placeholder="Search for a friend..."
    //         className="input w-64 border-2"
    //         style={{
    //           backgroundColor: '#FEFEF5',
    //           borderColor: '#EAF0D4'
    //         }}
    //         required
    //       />
    //       <button
    //         type="submit"
    //         disabled={!props.searchQuery.trim()}
    //         className="btn border-2"
    //         style={{
    //           backgroundColor: '#4DBCDB',
    //           borderColor: '#2B98BA',
    //           color: 'white'
    //         }}
    //       >
    //         Search
    //       </button>
    //     </form>
    // )