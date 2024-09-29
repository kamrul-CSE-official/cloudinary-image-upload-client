"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setError(null);

      const response = await axios.post(
        "https://cloudinary-upload-server-psi.vercel.app/api/v1/fileuploader",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );

      setFileUrl(response.data.fileUrl);
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (fileUrl) {
      navigator.clipboard.writeText(fileUrl)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch(err => {
          alert("Failed to copy the link: " + err);
        });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Upload File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {fileUrl && (
        <div>
          <p>File uploaded successfully!</p>
          <Image
            src={fileUrl}
            alt="Uploaded File"
            width={100} height={100}
            style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
          />
          <div>
            <input
              type="text"
              value={fileUrl}
              readOnly
              style={{ width: "100%", marginTop: "10px", padding: "8px" }}
            />
            <button onClick={handleCopyLink} style={{ marginTop: "10px" }}>
              Copy Image Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
