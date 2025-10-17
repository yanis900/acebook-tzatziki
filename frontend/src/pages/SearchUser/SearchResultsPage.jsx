import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMe, getUserByName } from "../../services/users";
import { notify } from "../../utils/notify";
import { Navbar } from "../../components/Navbar";

export function SearchResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null)

  const location = useLocation();
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const query = new URLSearchParams(location.search).get("query");


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (query) {
      const fetchResults = async () => {
        try {
          const data = await getUserByName(query);
          const d = await getMe(token)
          setResults(Array.isArray(data.users) ? data.users : []);
          setCurrentUser(d)
        } catch (error) {
          notify(error)
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query, token, navigate]);

  // --- Daisy UI Styling Below ---

  if (loading) {
    return (

      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-[#4DBCDB]"></span> 
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  return (

    <div className="fixed inset-0"
          style={{
            background: 'linear-gradient(180deg, #FEFEF5 0%, rgba(77, 188, 219, 0.08) 50%, #FEFEF5 100%)',
          }} >
      {/* Modern mesh gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(at 20% 30%, rgba(77, 188, 219, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 20%, rgba(231, 245, 169, 0.4) 0px, transparent 50%),
            radial-gradient(at 40% 70%, rgba(77, 188, 219, 0.2) 0px, transparent 50%),
            radial-gradient(at 90% 80%, rgba(231, 245, 169, 0.3) 0px, transparent 50%)
          `,
        }}
      />
      <Navbar currentUser={currentUser} />
      
      <div className="container mx-auto p-4 md:p-8 max-w-lg">
        <h2 className="text-3xl font-semibold mb-2" style={{ color: '#4DBCDB' }}>Search Results for &quot;{query}&quot;</h2>

        {results.length === 0 ? (
          <div 
            role="alert" 
            className="alert shadow-lg bg-[#4DBCDB] text-white border-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No users found matching your search query.</span>
          </div>
        ) : (
          <div className="space-y-4 text-left">
            {results.map((user) => (
              <div 
                key={user._id} 
                className="card card-side bg-base-100 shadow-lg border-2 border-[#4DBCDB] p-3 items-center" 
              >
                <div className="avatar mr-4">
                  <div className="w-16 rounded-full ring ring-[#2B98BA] ring-offset-base-100 ring-offset-2">
                    <img 
                        //fixed 431 display issue here
                        src={user?.image?.startsWith('data:') 
                            ? user.image 
                            : `data:image/jpeg;base64,${user.image}`
                        } 
                        alt={`${user.firstname} ${user.lastname}'s profile`} 
                      />
                  </div>
                </div>

                <div className="flex-1">
                  <a 
                    href={`/profile/${user.firstname}-${user.lastname}-${user._id.slice(-6)}`}
                    className="text-xl font-semibold link link-hover text-[#2B98BA] hover:text-[#4DBCDB]"
                    style={{color: "#2B98BA"}}
                  >
                    {user.firstname} {user.lastname}  
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/posts')}
            className="btn text-white border-2 bg-[#4DBCDB] border-[#2B98BA] shadow-lg hover:bg-[#2B98BA] hover:border-[#2B98BA]"
          >
            Back to Feed
          </button>
        </div>
      </div>
    </div>
  );
}
