import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import Audio from "../assets/Audio.svg";

function AudioUploader() {
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("audio/")) {
        setAudioFile(file);
      } else {
        setError("Invalid file type");
      }
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleBrowseClick() {
    fileInputRef.current.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    } else {
      setError("Invalid file type");
    }
  }

  function formatFileSize(bytes) {
    if (!bytes) return "0 KB";
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  async function handleUpload() {
    if (!audioFile) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("audioFile", audioFile);
    try {
      const response = await axios.post(`${apiBaseUrl}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload response:", response.data);
      sessionStorage.setItem("uploadResult", JSON.stringify(response.data));
      navigate("/target-word");
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-2xl shadow flex flex-col gap-8">
      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center gap-6">
          <div className="w-5 h-5 flex items-center justify-center">
            <img src={Audio} alt="audio" className="w-full h-full" />
          </div>
          <b className="text-2xl font-semibold text-gray-900 mb-2">
            Upload Audio Files
          </b>
        </div>
        <div className="text-base text-gray-500 mb-8">
          Please upload the audio files. We'll analyze each pronunciation
          against your criteria.
        </div>
      </div>
      <div className="w-full mb-8">
        <div className="w-full rounded-xl border-2 border-dashed border-purple-500 min-h-[180px] flex flex-col items-center justify-center bg-white shadow transition-colors">
          <div
            className="w-full flex flex-col items-center justify-center gap-4 py-8"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="text-lg font-medium text-gray-600">
              Drag & drop your audio files here
            </div>
            <div className="text-base text-gray-400">or</div>
            <div className="w-[175px] h-10 flex items-center justify-center">
              <button
                type="button"
                className="rounded-full bg-purple-500 px-6 h-10 flex items-center justify-center text-black font-medium text-base hover:bg-purple-700 transition-colors"
                onClick={handleBrowseClick}
              >
                Browse Files
              </button>
            </div>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
        </div>
      </div>
      {audioFile && (
        <div className="w-full max-w-xl mx-auto bg-white rounded-lg p-4">
          <p className="flex justify-between items-center m-0 text-gray-900 text-base font-medium mb-3">
            Selected Files
            <span className="text-gray-500 font-normal">1 file</span>
          </p>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <img
              src={Audio}
              alt="audio icon"
              className="w-7 h-7 mr-3 text-purple-500"
            />
            <div className="flex items-center gap-3 flex-1">
              <span className="text-gray-900 text-sm font-medium max-w-[350px] truncate inline-block">
                {audioFile.name}
              </span>
              <span className="text-gray-500 text-sm">
                {formatFileSize(audioFile.size)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAudioFile(null)}
              aria-label="Remove file"
              className="ml-2 text-red-500 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className={`w-28 h-10 rounded-full text-black font-medium self-end transition-colors ${
            audioFile
              ? "bg-purple-500 hover:bg-purple-700"
              : "bg-purple-500 opacity-50 cursor-not-allowed"
          }`}
          disabled={!audioFile || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Next"}
        </button>
        {error && (
          <div className="text-red-500 text-sm text-right">{error}</div>
        )}
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <ProgressBar currentStep={1} />
      <main className="flex-1 flex items-center justify-center">
        <AudioUploader />
      </main>
      <Footer />
    </div>
  );
}
