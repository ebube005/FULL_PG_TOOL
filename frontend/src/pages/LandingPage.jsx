import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to PG-MAIN
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your comprehensive tool for analyzing and evaluating text data
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/upload")}
            className="w-full max-w-md bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg font-semibold"
          >
            Get Started
          </button>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">Upload Data</h3>
              <p className="text-gray-600">
                Start by uploading your text files for analysis
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">Set Criteria</h3>
              <p className="text-gray-600">
                Define your evaluation criteria and parameters
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">View Results</h3>
              <p className="text-gray-600">
                Get detailed analysis and insights from your data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
