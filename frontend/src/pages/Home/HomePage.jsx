import { useNavigate } from "react-router-dom";
import logo from "../../assets/ChatGPT clear .png";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen relative overflow-hidden w-full"
      style={{
        background: `linear-gradient(180deg, #FEFEF5 0%, rgba(77, 188, 219, 0.08) 50%, #FEFEF5 100%)`,
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        width: '100vw',
        maxWidth: '100vw',
      }}
    >
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

      {/* Main Content - Centered */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 py-16">
        {/* Logo with floating animation */}
        <div className="mb-8 animate-bounce" style={{ animationDuration: "3s" }}>
          <img
            src={logo}
            alt="Tzatziki"
            className="h-32 w-32 lg:h-40 lg:w-40 drop-shadow-2xl transition-transform hover:scale-110 duration-300"
          />
        </div>

        {/* Main heading */}
        <h1
          className="text-6xl lg:text-8xl font-bold tracking-tight mb-6 text-center"
          style={{ color: "#4DBCDB" }}
        >
          Welcome to Tzatziki!
        </h1>
        <p className="text-xl lg:text-3xl text-gray-700 mb-12 text-center max-w-3xl">
          Connect with friends and share your moments in a vibrant community
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={() => navigate("/signup")}
            className="btn btn-lg border-3 transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            style={{
              backgroundColor: "#E7F5A9",
              borderColor: "#A5DD5F",
              borderWidth: "3px",
              color: "#1f2937",
              fontSize: "1.3rem",
              padding: "1.2rem 3rem",
              fontWeight: "700",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-lg border-3 transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            style={{
              backgroundColor: "#4DBCDB",
              borderColor: "#2B98BA",
              borderWidth: "3px",
              color: "white",
              fontSize: "1.3rem",
              padding: "1.2rem 3rem",
              fontWeight: "700",
            }}
          >
            Log In
          </button>
        </div>

        {/* Feature cards - spread across bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div
            className="p-8 rounded-2xl backdrop-blur-md transition-all duration-200 hover:scale-105 hover:backdrop-blur-lg border-2"
            style={{
              backgroundColor: "rgba(254, 254, 245, 0.15)",
              borderColor: "rgba(234, 240, 212, 0.4)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-3xl text-white mx-auto mb-4"
              style={{ backgroundColor: "#4DBCDB" }}
            >
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Share Posts
            </h3>
            <p className="text-gray-700 text-center">
              Express yourself and share your favorite moments
            </p>
          </div>

          <div
            className="p-8 rounded-2xl backdrop-blur-md transition-all duration-200 hover:scale-105 hover:backdrop-blur-lg border-2"
            style={{
              backgroundColor: "rgba(254, 254, 245, 0.15)",
              borderColor: "rgba(234, 240, 212, 0.4)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-3xl text-white mx-auto mb-4"
              style={{ backgroundColor: "#4DBCDB" }}
            >
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Connect
            </h3>
            <p className="text-gray-700 text-center">
              Build meaningful connections with friends
            </p>
          </div>

          <div
            className="p-8 rounded-2xl backdrop-blur-md transition-all duration-200 hover:scale-105 hover:backdrop-blur-lg border-2"
            style={{
              backgroundColor: "rgba(254, 254, 245, 0.15)",
              borderColor: "rgba(234, 240, 212, 0.4)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-3xl text-white mx-auto mb-4"
              style={{ backgroundColor: "#4DBCDB" }}
            >
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Discover
            </h3>
            <p className="text-gray-700 text-center">
              Explore new communities and content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
