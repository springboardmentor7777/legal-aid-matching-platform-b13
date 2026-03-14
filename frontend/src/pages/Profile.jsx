import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile/me");

      setFormData({
        fullName: res.data.name,
        email: res.data.email,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api.put("/profile/update", {
        name: formData.name
      });

      setMessage("Profile updated successfully.");

      fetchProfile(); // refresh profile data

    } catch (err) {
      setMessage("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-xl bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-semibold mb-6">
        My Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="text-sm text-gray-600">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p className="text-sm text-green-600">
            {message}
          </p>
        )}

      </form>
    </div>
  );
}