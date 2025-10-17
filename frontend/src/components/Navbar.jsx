import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchForm } from "./SearchForm";
import LogoutButton from "./LogoutButton";
import logo from "../assets/ChatGPT clear .png";
import { getMe, updateImage } from "../services/users";
import { notify } from "../utils/notify";
import { HiUser, HiUserGroup } from "react-icons/hi";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        getMe(token)
          .then((data) => {
            setCurrentUser(data);
          })
          .catch((err) => {
            console.error("Error fetching current user in navbar", err);
          });
      }
    };

    // Fetch user on mount
    fetchUser();

    // Listen for profile updates via custom event
    const handleProfileUpdate = () => {
      fetchUser();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const id = currentUser?.id || currentUser?._id;
      const data = await updateImage(token, id, file);
      // update local navbar state
      setCurrentUser((prev) => ({ ...(prev || {}), image: data.image }));
      if (data.token) localStorage.setItem("token", data.token);
      // notify rest of app
      window.dispatchEvent(new Event('profileUpdated'));
      notify("Profile image updated", false);
    } catch (err) {
      console.error("Error updating avatar:", err);
      notify(err.message || "Failed to update avatar");
    } finally {
      // reset input's value so same file can be picked again if needed
      e.target.value = null;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 w-full border-b-4 border-[#EAF0D4] bg-[#FEFEF5] shadow-md">
        {/* Full width, but padded so edges never clip */}
        <div className="w-full px-3 sm:px-4 md:px-6 xl:px-10">
          {/* 3 columns: left group | centered search | right avatar */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 min-h-[64px]">
            {/* LEFT: logo + title + Home */}
            <div className="flex items-center gap-3">
              <a
                href="/posts"
                className="flex items-center gap-2 hover:opacity-90"
              >
                <img src={logo} alt="Tzatziki" className="h-10 w-10 shrink-0" />
                <span className="font-bold text-xl text-[#4DBCDB] whitespace-nowrap">
                  Tzatziki
                </span>
              </a>
            </div>

            {/* CENTER: search (reasonable max so it never shoves the avatar) */}
            <div className="flex justify-center">
              <div className="w-full max-w-[480px] md:max-w-[560px]">
                <SearchForm
                  handleSearch={handleSearch}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>
            </div>

            {/* RIGHT: Profile, Friends links and avatar dropdown */}
            <div className="flex items-center gap-4 pr-8 lg:pr-12 xl:pr-16">
              {/* Profile Link */}
              <a
                href="/profile"
                className="flex items-center gap-1.5 font-semibold transition-colors whitespace-nowrap"
                style={{ color: '#4DBCDB' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#2B98BA'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#4DBCDB'}
              >
                <HiUser className="text-xl" />
                <span>Profile</span>
              </a>

              {/* Friends Link */}
              <a
                href="/myfriends"
                className="flex items-center gap-1.5 font-semibold transition-colors whitespace-nowrap"
                style={{ color: '#4DBCDB' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#2B98BA'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#4DBCDB'}
              >
                <HiUserGroup className="text-xl" />
                <span>Friends</span>
              </a>

              {/* Avatar dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-circle avatar border-2 border-[#2B98BA] bg-[#4DBCDB] hover:opacity-90"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden">
                    {currentUser?.image && (
                      <img
                        alt={currentUser?.firstname || "User"}
                        src={
                          currentUser?.image.startsWith("data:")
                            ? currentUser?.image
                            : `data:image/jpeg;base64,${currentUser.image}`
                        }
                      />
                    )}
                  </div>
                </div>
                <ul
                  tabIndex={-1}
                  className="menu menu-sm dropdown-content rounded-box z-[60] mt-3 w-52 p-2 shadow-lg border-2 border-[#EAF0D4] bg-[#FEFEF5]"
                >
                  <li>
                    <label className="btn btn-ghost w-full justify-start cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      Update avatar
                    </label>
                  </li>
                  <li>
                    <LogoutButton />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so content isn't hidden under the fixed bar */}
      <div className="h-[64px]" />
    </>
  );
}
