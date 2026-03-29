import { useState } from "react";

export default function LawyerIngest() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage(null); // Clear previous messages when a new file is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage({ text: "Please select an Excel file first.", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // 1. Prepare the file using FormData
    // The key "file" must exactly match your Spring Boot @RequestParam("file")
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("accessToken");

      // 2. Make the POST request
      const response = await fetch("http://localhost:8081/directory/external/lawyers/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // Note: Do NOT manually set 'Content-Type': 'multipart/form-data'. 
          // Fetch automatically sets it with the correct boundary when passing FormData.
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      const data = await response.json();
      
      // 3. Handle the successful response
      setMessage({
        text: `Success! Processed ${data.totalRowsProcessed} rows. Inserted ${data.newlyInserted} new records.`,
        type: "success",
      });
      setFile(null); // Reset the file input
      
      // Optional: Reset the actual HTML input element visually
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (error: any) {
      console.error("Upload Error:", error);
      setMessage({
        text: error.message || "An error occurred while uploading the file.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Upload Lawyer Directory</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Select Excel File (.xlsx)
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!file || isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            !file || isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Uploading..." : "Upload to Database"}
        </button>
      </form>

      {/* Dynamic Status Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-sm font-medium ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
