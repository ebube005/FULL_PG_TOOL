import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import BackButton from "../components/BackButton.jsx";

export default function TargetWordPage() {
  const [word, setWord] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Check if audio file exists
  useEffect(() => {
    const audioFileUrl = sessionStorage.getItem("audioFileUrl");
    if (!audioFileUrl) {
      navigate("/upload");
    }
  }, [navigate]);

  async function handleNext() {
    if (!word.trim()) {
      setError("Please enter a word");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // First get IPA for the word
      const formData = new FormData();
      formData.append("target_word", word.trim());
      const ipaResponse = await fetch(`${apiBaseUrl}/ipa`, {
        method: "POST",
        body: formData,
      });

      if (!ipaResponse.ok) {
        throw new Error("Failed to fetch IPA");
      }

      const ipaData = await ipaResponse.json();

      // Store word and IPA
      sessionStorage.setItem(
        "targetWordIpaResult",
        JSON.stringify({
          word: word.trim(),
          ipa: ipaData.ipa,
          ipa_error: ipaData.ipa_error,
        })
      );

      // Get audio file from URL
      const audioFileUrl = sessionStorage.getItem("audioFileUrl");
      const audioFileName = sessionStorage.getItem("audioFileName");
      const audioFileType = sessionStorage.getItem("audioFileType");

      // Fetch the file from the URL
      const audioResponse = await fetch(audioFileUrl);
      const audioBlob = await audioResponse.blob();

      // Create a new File object
      const audioFile = new File([audioBlob], audioFileName, {
        type: audioFileType,
      });

      // Now send both audio and word to analyze endpoint
      const analyzeFormData = new FormData();
      analyzeFormData.append("audioFile", audioFile);
      analyzeFormData.append("target_word", word.trim());

      const analyzeResponse = await axios.post(
        `${apiBaseUrl}/analyze`,
        analyzeFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      sessionStorage.setItem(
        "uploadResult",
        JSON.stringify(analyzeResponse.data)
      );

      // Clean up the temporary URL
      URL.revokeObjectURL(audioFileUrl);
      sessionStorage.removeItem("audioFileUrl");

      navigate("/criteria");
    } catch (err) {
      setError("Failed to process the word. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <ProgressBar currentStep={2} />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow p-10 flex flex-col gap-8">
          <BackButton />
          <div className="flex flex-col gap-2">
            <label
              htmlFor="word-input"
              className="text-lg font-medium text-gray-900"
            >
              Word to Analyze
            </label>
            <input
              id="word-input"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="text"
              placeholder="e.g. water, apple, think"
              value={word}
              onChange={(e) => {
                setWord(e.target.value);
                setError("");
              }}
              autoComplete="off"
            />
            <div className="text-gray-400 text-sm">
              Enter the single word you want to analyze.
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={`w-28 h-10 rounded-full text-black font-medium text-base self-end transition-colors ${
                word.trim() && !loading
                  ? "bg-purple-500 hover:bg-purple-700"
                  : "bg-purple-500 opacity-50 cursor-not-allowed"
              }`}
              disabled={!word.trim() || loading}
              onClick={handleNext}
            >
              {loading ? "Loading..." : "Next"}
            </button>
            {error && (
              <div className="text-red-500 text-sm text-right">{error}</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
