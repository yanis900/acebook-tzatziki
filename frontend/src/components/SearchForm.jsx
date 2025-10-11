
export function SearchForm(props) {
    return (
        <form onSubmit={props.handleSearch}>
          <label>
            <input
              name="Search"
              type="search"
              value={props.searchQuery}
              onChange={(e) => props.setSearchQuery(e.target.value)}
              placeholder="Search for a friend..."
              required
            />
          </label>
          <button type="submit" disabled={!props.searchQuery.trim()}>
            Search
          </button>
        </form>
    )
}