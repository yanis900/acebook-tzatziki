import logo from "../assets/ChatGPT clear .png";

export function PublicNavbar() {
  return (
    <div
      className="navbar shadow-lg border-b-4"
      style={{
        backgroundColor: "#FEFEF5",
        borderBottomColor: "#EAF0D4",
        margin: 0,
        padding: "0 1rem",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex-1 flex justify-center">
        <a
          href="/"
          className="btn btn-ghost text-xl flex items-center gap-2 hover:bg-transparent transition-all duration-200"
          style={{ color: "#4DBCDB " }}
        >
          <div className="transition-transform hover:scale-110 duration-300">
            <img
              src={logo}
              alt="Tzatziki"
              className="h-13 w-13 drop-shadow-md mt-2"
            />
          </div>
          <span className="font-bold text-2xl drop-shadow-md tracking-tight">Tzatziki</span>
        </a>
      </div>
    </div>
  );
}
