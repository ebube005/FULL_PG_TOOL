import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import BackButton from "../components/BackButton.jsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  // Helper to convert ArrayBuffer to base64
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const exportToPDF = async () => {
    // Fetch the DejaVuSans font as base64
    const fontUrl = "/DejaVuSans.ttf";
    const response = await fetch(fontUrl);
    const fontBuffer = await response.arrayBuffer();
    const fontBase64 = arrayBufferToBase64(fontBuffer);

    // Register the font with jsPDF
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    doc.addFileToVFS("DejaVuSans.ttf", fontBase64);
    doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
    doc.setFont("DejaVuSans");

    // Add title
    doc.setFontSize(20);
    doc.text("Analysis Results", 20, 20);

    // Add timestamp
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

    // Add target word information
    const targetWordData = JSON.parse(
      sessionStorage.getItem("targetWordIpaResult")
    );
    doc.setFontSize(14);
    doc.text(`Target Word: ${targetWordData.word}`, 20, 40);
    doc.text(`IPA: ${targetWordData.ipa}`, 20, 50);

    // Convert final table to array for PDF
    const tableData = Object.entries(results.finalTable || {}).map(
      ([ipa, scores]) => [ipa, ...Object.values(scores)]
    );

    // Get headers from the first row
    const headers = [
      "IPA",
      ...Object.keys(
        results.finalTable[Object.keys(results.finalTable)[0]] || {}
      ),
    ];

    autoTable(doc, {
      startY: 60,
      head: [headers],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 10,
        font: "DejaVuSans",
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [128, 0, 128],
        textColor: [255, 255, 255],
        fontStyle: "normal",
      },
      columnStyles: {
        0: { cellWidth: 18 }, // IPA column smaller
      },
      margin: { left: 20, right: 20 },
    });

    // Save the PDF
    doc.save("analysis-results.pdf");
  };

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
          <BackButton />
          <div className="text-2xl font-bold text-purple-700 text-center">
            Results
          </div>

          {/* Add Export PDF button */}
          <div className="flex justify-end">
            <button
              onClick={exportToPDF}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clipRule="evenodd"
                />
              </svg>
              Export PDF
            </button>
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
