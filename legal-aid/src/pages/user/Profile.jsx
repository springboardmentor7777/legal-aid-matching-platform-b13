import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import toast from "react-hot-toast";

const Profile = () => {

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: ""
  });

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await API.get("/profile/me");
        setProfile(res.data);

      } catch (err) {

        toast.error("Failed to load profile");

      }

    };

    fetchProfile();

  }, []);

  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      const res = await API.put("/profile/update", profile);

      setProfile(res.data);

      toast.success("Profile updated successfully");

    } catch (err) {

      toast.error("Update failed");

    }

  };

  return (
    <Layout>

      <h1 className="text-2xl font-bold mb-6">
        My Profile 👤
      </h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded-xl shadow max-w-lg"
      >

        {/* Full Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Full Name
          </label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) =>
              setProfile({ ...profile, fullName: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Role
          </label>
          <input
            type="text"
            value={profile.role}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>

      </form>

    </Layout>
  );
};

export default Profile;