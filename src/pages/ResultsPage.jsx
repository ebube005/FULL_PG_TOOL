import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

const ResultsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("http://localhost:5000/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(location.state.rankings),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }

        const data = await response.json();
        setResults(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (location.state?.rankings) {
      fetchResults();
    }
  }, [location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!results) {
    return <div className="text-center">No results available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <ProgressBar currentStep={4} />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow p-10 flex flex-col gap-8 items-center justify-center">
          <div className="text-2xl font-bold text-purple-700">Results</div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Recommended Pronunciation
            </h2>
            <p className="text-xl">
              Based on your preference grammar, the preferred pronunciation is "
              {results.best_transcription}"
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Detailed Scores</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2">IPA</th>
                    {Object.keys(results.weights).map((criterion) => (
                      <th key={criterion} className="px-4 py-2">
                        {criterion}
                      </th>
                    ))}
                    <th className="px-4 py-2">Weighted Score</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(results.final_table).map(([ipa, scores]) => (
                    <tr key={ipa} className="border-b">
                      <td className="px-4 py-2">{ipa}</td>
                      {Object.keys(results.weights).map((criterion) => (
                        <td key={criterion} className="px-4 py-2">
                          {scores[
                            criterion.toLowerCase().replace(" ", "_")
                          ]?.toFixed(4) || "-"}
                        </td>
                      ))}
                      <td className="px-4 py-2 font-semibold">
                        {scores.weighted_score?.toFixed(4) || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResultsPage;
