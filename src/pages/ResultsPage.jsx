import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const location = useLocation();
  const [data, setData] = useState(location.state || null);
  const [targetWordIpa, setTargetWordIpa] = useState(null);

  useEffect(() => {
    if (!data) {
      const stored = sessionStorage.getItem("uploadResult");
      if (stored) setData(JSON.parse(stored));
    }
    const ipaStored = sessionStorage.getItem("targetWordIpaResult");
    if (ipaStored) setTargetWordIpa(JSON.parse(ipaStored));
  }, [data]);

  function displayValue(val) {
    if (val === undefined || val === null || val === "") return "-";
    return val;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <ProgressBar currentStep={4} />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow p-10 flex flex-col gap-8 items-center justify-center">
          <div className="text-2xl font-bold text-purple-700">Results</div>
          {targetWordIpa && (
            <div className="w-full flex flex-col gap-2 mb-4">
              <div className="text-lg text-gray-900 font-semibold">
                Target Word IPA
              </div>
              <div className="flex gap-4 items-center">
                <span className="font-semibold text-black">
                  {displayValue(targetWordIpa.word)}
                </span>
                <span className="font-mono text-black">
                  {displayValue(targetWordIpa.ipa)}
                </span>
                {targetWordIpa.ipa_error && (
                  <span className="text-red-500 text-sm">
                    {targetWordIpa.ipa_error}
                  </span>
                )}
              </div>
            </div>
          )}
          {data && data.success ? (
            <div className="w-full flex flex-col gap-4">
              <div className="text-lg text-gray-900 font-semibold">
                Transcription
              </div>
              <div className="bg-gray-100 rounded p-3 text-gray-700 text-base whitespace-pre-line">
                {displayValue(data.transcription)}
              </div>
              <div className="text-lg text-gray-900 font-semibold">
                Audio Duration
              </div>
              <div className="bg-gray-100 rounded p-3 text-gray-700 text-base">
                {data.duration ? data.duration.toFixed(2) + "s" : "-"}
              </div>
              <div className="text-lg text-gray-900 font-semibold">
                Segments
              </div>
              {Array.isArray(data.segments) && data.segments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left border">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-2 py-1">Start (s)</th>
                        <th className="px-2 py-1">End (s)</th>
                        <th className="px-2 py-1">Text</th>
                        <th className="px-2 py-1">IPA</th>
                        <th className="px-2 py-1">IPA Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.segments.map((seg, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-2 py-1 text-black">
                            {displayValue(seg.start)}
                          </td>
                          <td className="px-2 py-1 text-black">
                            {displayValue(seg.end)}
                          </td>
                          <td className="px-2 py-1 text-black">
                            {displayValue(seg.text)}
                          </td>
                          <td className="px-2 py-1 font-mono text-black">
                            {displayValue(seg.ipa)}
                          </td>
                          <td className="px-2 py-1 text-red-500">
                            {displayValue(seg.ipa_error)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500">No segments available.</div>
              )}
            </div>
          ) : (
            <div className="text-red-500 text-lg">
              {data && data.error ? data.error : "No results available."}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
