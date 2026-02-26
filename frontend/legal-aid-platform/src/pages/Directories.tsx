import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";

export default function Directories() {
  const { user } = useAuth();
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar
          title="Directories"
          name={user?.username || "Guest"}
          toggleSidebar={() => {}}
        />
      </div>
      <div className="min-h-screen bg-blue-50 flex pt-20 justify-center items-center">
        {/* search bar */}
        {/* filters */}
        {/* Lawyer | Ngo directory */}
        {/* pagenations */}


      </div>
    </>
  );
}
