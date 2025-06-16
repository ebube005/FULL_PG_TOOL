import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Get analysis results
      const analysisResults = JSON.parse(
        sessionStorage.getItem("analysisResults")
      );
      if (!analysisResults) {
        setError("No analysis results found. Please start over.");
        return;
      }
      setResults(analysisResults);
    } catch (err) {
      setError("Error loading results. Please try again.");
      console.error("Error parsing results:", err);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <ProgressBar currentStep={4} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-600">{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <ProgressBar currentStep={4} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading results...</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Convert final table to array for easier rendering
  const tableData = Object.entries(results.finalTable || {}).map(
    ([ipa, scores]) => ({
      ipa,
      ...scores,
    })
  );

  if (tableData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <ProgressBar currentStep={4} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-600">
            No data available in results table.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <ProgressBar currentStep={4} />
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow p-10 flex flex-col gap-8">
          <div className="text-2xl font-bold text-purple-700 text-center">
            Results
          </div>

          {/* Target Word Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Target Word</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Word:</p>
                <p className="text-xl text-purple-700 font-medium">
                  {results.targetWord}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Best IPA Transcription:</p>
                <p className="text-xl text-purple-700 font-medium">
                  {results.bestTranscription}
                </p>
              </div>
            </div>
          </div>

          {/* Final Table Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IPA
                    </th>
                    {Object.keys(tableData[0])
                      .filter((key) => key !== "ipa")
                      .map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row, idx) => (
                    <tr key={idx} className={idx === 0 ? "bg-purple-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.ipa}
                      </td>
                      {Object.entries(row)
                        .filter(([key]) => key !== "ipa")
                        .map(([key, value]) => (
                          <td
                            key={key}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {typeof value === "number"
                              ? value.toFixed(3)
                              : String(value)}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Best Transcription Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl text-purple-700 font-semibold mb-4">
              Recommended Pronunciation
            </h2>
            <p className="text-xl text-gray-600">
              Based on your preference grammar, the preferred pronunciation is:{" "}
              <span className="font-bold text-purple-700">
                {results.bestTranscription}
              </span>
            </p>
            {results.weightedScore && (
              <p className="text-sm text-gray-600 mt-2">
                Weighted Score: {Number(results.weightedScore).toFixed(3)}
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
