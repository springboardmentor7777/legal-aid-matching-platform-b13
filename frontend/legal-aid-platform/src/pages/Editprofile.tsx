import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { LuSquareArrowLeft } from "react-icons/lu";

export default function EditProfile() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  //   const [data, setData] = useState<string | any>("");
  type Role = "CITIZEN" | "LAWYER" | "NGO";

  interface CitizenUpdate {
    name: string;
  }

  interface LawyerUpdate extends CitizenUpdate {
    specialization: string;
    experience: number;
    location: string;
    isAvailable: boolean;
  }

  interface NgoUpdate extends CitizenUpdate {
    organizationName: string;
    serviceArea: string;
    location: string;
    isAvailable: boolean;
  }

  type FormData = CitizenUpdate | LawyerUpdate | NgoUpdate;

  const role = (user?.role ?? "CITIZEN") as Role;

  const [formData, setFormData] = useState<FormData>(() => {
    if (role === "LAWYER") {
      return {
        name: user?.username,
        specialization: "",
        experience: 0,
        location: "",
        isAvailable: true,
      } as LawyerUpdate;
    }
    if (role === "NGO") {
      return {
        name: "",
        organizationName: "",
        serviceArea: "",
        location: "",
        isAvailable: true,
      } as NgoUpdate;
    }
    return {
      name: user?.username,
    } as CitizenUpdate;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(null);

    setFormData((prev) => {
      if (name === "experience") {
        return { ...(prev as any), [name]: Number(value) } as FormData;
      }
      return { ...(prev as any), [name]: value } as FormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let body: any;

    if (role === "CITIZEN") {
      body = {
        name: (formData as CitizenUpdate).name,
      };
    } else if (role === "LAWYER") {
      const d = formData as LawyerUpdate;
      body = {
        name: d.name,
        specialization: d.specialization,
        experience: d.experience,
        location: d.location,
        isAvailable:d.isAvailable
      };
    } else {
      const d = formData as NgoUpdate;
      body = {
        name: d.name,
        organizationName: d.organizationName,
        serviceArea: d.serviceArea,
        location: d.location,
      };
    }

    // Call your existing update API here
    console.log("Profile update body:", body);
    await fetch("http://localhost:8081/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(body),
    }).catch((err) => {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    });

    // navigate("/profile");
    setSuccessMessage("changes submitted");
    const navigate = useNavigate();
    navigate("/profile");
  };

  // const [success, setSuccess] = useState(false);

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar
          title="edit profile"
          name={user?.username || "guest"}
          role={user?.role || ""}
          toggleSidebar={() => {}}
        />
      </div>
      <div className="min-h-screen bg-blue-50 flex">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex flex-col m-auto">
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center font-mono mt-5">
              {error}!
            </div>
          )}

          <a href="/profile" className="text-blue-900 mb-2">
            {<LuSquareArrowLeft />}back to profile
          </a>
          <div className="shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 rounded-md p-3">
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* common field for all roles */}
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="name"
                >
                  New Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* LAWYER fields */}
              {role === "LAWYER" && (
                <>
                  <div>
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="specialization"
                    >
                      Specialization
                    </label>
                    <input
                      id="specialization"
                      type="text"
                      name="specialization"
                      value={(formData as LawyerUpdate).specialization}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="experience"
                    >
                      Experience (years)
                    </label>
                    <input
                      id="experience"
                      type="number"
                      name="experience"
                      value={(formData as LawyerUpdate).experience}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="location"
                    >
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      name="location"
                      value={(formData as LawyerUpdate).location}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </>
              )}

              {/* NGO fields */}
              {role === "NGO" && (
                <>
                  <div>
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="organizationName"
                    >
                      Organization Name
                    </label>
                    <input
                      id="organizationName"
                      type="text"
                      name="organizationName"
                      value={(formData as NgoUpdate).organizationName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="serviceArea"
                    >
                      Service Area
                    </label>
                    <input
                      id="serviceArea"
                      type="text"
                      name="serviceArea"
                      value={(formData as NgoUpdate).serviceArea}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="location"
                    >
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      name="location"
                      value={(formData as NgoUpdate).location}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Save
              </button>
              {successMessage && (
                <p className="text-green-600 mb-4">{successMessage}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
