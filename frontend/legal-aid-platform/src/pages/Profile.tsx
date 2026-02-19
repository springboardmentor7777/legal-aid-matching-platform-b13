import Navbar from "../components/Navbar";
export default function Profile() {
  const user = {
    name: "sandeep",
  };

  return (
    <div className="h-screen bg-gray-100">
      <div>
        <nav className="bg-white p-5 shadow-lg flex items-center justify-between">
          <div className="text-blue-900 font-bold text-2xl">Profile</div>
          <div className="flex gap-5">
            <a href="/dashboard" className="bg-blue-900 p-2 text-white rounded-lg shadow-xl hover:bg-blue-500">Dashboard</a>
            <a href="/" className="bg-red-500 p-2 text-white rounded-lg" onClick={()=>{localStorage.clear}}>Logout</a>
          </div>
        </nav>
      </div>
      <section className="">

      </section>
    </div>
  );
}
