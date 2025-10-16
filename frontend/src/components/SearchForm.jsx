
export function SearchForm(props) {
    return (
        <form onSubmit={props.handleSearch} className="flex gap-2">
          <input
            name="Search"
            type="search"
            value={props.searchQuery}
            onChange={(e) => props.setSearchQuery(e.target.value)}
            placeholder="Search for a friend..."
            className="input w-64 border-2"
            style={{
              backgroundColor: '#FEFEF5',
              borderColor: '#EAF0D4'
            }}
            required
          />
          <button
            type="submit"
            disabled={!props.searchQuery.trim()}
            className="btn border-2"
            style={{
              backgroundColor: '#4DBCDB',
              borderColor: '#2B98BA',
              color: 'white'
            }}
          >
            Search
          </button>
        </form>
    )
}