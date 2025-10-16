import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchForm } from "./SearchForm";
import LogoutButton from "./LogoutButton";
import ProfileButton from "./ProfileButton";
import logo from "../assets/ChatGPT clear .png";
import FeedButton from "./FeedButton";
import MyFriendsButton from "./MyFriendsButton";

export function Navbar({ currentUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

            {/* <MyFriendsButton /> */}
            {/* <FeedButton /> */}

            {/* RIGHT: avatar dropdown (slightly inset) */}
            <div className="dropdown dropdown-end pr-8 lg:pr-12 xl:pr-16">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-circle avatar border-2 border-[#2B98BA] bg-[#4DBCDB] hover:opacity-90"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  {/* <img
                    alt={currentUser?.firstname || "User"}
                    src={
                      currentUser?.image.startsWith("data:")
                        ? currentUser?.image
                        : `data:image/jpeg;base64,${currentUser.image}`
                    }
                  /> */}
                </div>
              </div>
              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content rounded-box z-[60] mt-3 w-52 p-2 shadow-lg border-2 border-[#EAF0D4] bg-[#FEFEF5]"
              >
                <li>
                  <ProfileButton />
                </li>
                <li>
                  <LogoutButton />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so content isn’t hidden under the fixed bar */}
      <div className="h-[64px]" />
    </>
  );
}
