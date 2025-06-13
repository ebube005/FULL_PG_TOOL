import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

export default function TargetWordPage() {
  const [word, setWord] = useState("");
  const [error, setError] = useState("");
  const [ipa, setIpa] = useState("");
  const [ipaError, setIpaError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  async function handleNext() {
    if (!word.trim()) {
      setError("Please enter a word");
      return;
    }
    setLoading(true);
    setError("");
    setIpa("");
    setIpaError("");
    try {
      const formData = new FormData();
      formData.append("word", word.trim());
      const response = await axios.post(`${apiBaseUrl}/ipa`, formData);
      console.log("IPA response:", response.data);
      if (response.data.success) {
        setIpa(response.data.ipa);
        setIpaError("");
        sessionStorage.setItem(
          "targetWordIpaResult",
          JSON.stringify({
            word,
            ipa: response.data.ipa,
            ipa_error: response.data.ipa_error,
          })
        );
        navigate("/criteria", {
          state: {
            word,
            ipa: response.data.ipa,
            ipa_error: response.data.ipa_error,
          },
        });
      } else {
        setIpa("");
        setIpaError(response.data.ipa_error || "IPA conversion failed");
      }
    } catch (err) {
      setIpa("");
      setIpaError("IPA conversion failed", err);
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
                setIpa("");
                setIpaError("");
              }}
              autoComplete="off"
            />
            <div className="text-gray-400 text-sm">
              Enter the single word you want to generate the preferred grammar
              form of.
            </div>
            {ipa && (
              <div className="text-green-700 text-base mt-2">IPA: {ipa}</div>
            )}
            {ipaError && (
              <div className="text-red-500 text-base mt-2">{ipaError}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={`w-28 h-10 rounded-full text-black  font-medium text-base self-end transition-colors ${
                word.trim()
                  ? "bg-purple-500 hover:bg-purple-700"
                  : "bg-purple-500 opacity-50 cursor-not-allowed"
              }`}
              disabled={!word.trim() || loading}
              onClick={handleNext}
            >
              {loading ? "Checking..." : "Next"}
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
