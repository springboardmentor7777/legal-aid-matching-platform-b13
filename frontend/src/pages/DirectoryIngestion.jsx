import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export default function DirectoryIngestion() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      `${API_URL}/directory/upload`,
      formData
    );

    setPreview(res.data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        Directory Data Ingestion
      </h2>

      <form onSubmit={handleUpload} className="mb-6">
        <input
          type="file"
          required
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg">
          Upload & Preview
        </button>
      </form>

      {preview.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">
                    {row.fullName}
                  </td>
                  <td className="px-4 py-2 border">
                    {row.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}