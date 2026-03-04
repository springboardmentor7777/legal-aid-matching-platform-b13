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
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        setFormData({
          fullName: res.data.fullName,
          email: res.data.email,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
      await api.put("/users/update", formData);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-900 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p className="text-sm text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
}