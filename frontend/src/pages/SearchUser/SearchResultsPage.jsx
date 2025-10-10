import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserByName } from "../../services/users";

export function SearchResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const query = new URLSearchParams(location.search).get("name");
console.log(query)
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (query) {
      const fetchResults = async () => {
        try {
          const data = await getUserByName(query);
          setResults(data.users || []);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query, token, navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Search Results</h2>
      {results.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div>
          {results.map((user) => (
            <p key={user._id}>
              {user.firstname} {user.lastname}
            </p>
          ))}
        </div>
      )}
      <button onClick={() => navigate(-1)}>Back to Feed</button>
    </div>
  );
}