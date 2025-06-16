import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col items-center justify-center p-6">
      <div className="max-w-5xl w-full text-center space-y-10">
        <header>
          <h1 className="text-6xl font-extrabold text-purple-800 mb-4 drop-shadow-sm">
            Welcome to{" "}
            <span className="text-purple-600">Preference Grammar Tool</span>
          </h1>
          <p className="text-2xl text-purple-700 max-w-3xl mx-auto">
            Your comprehensive tool for generating your preferred pronunciation
            based on how important criteria are to you.
          </p>
        </header>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/upload")}
            className="w-full max-w-md bg-purple-600 text-black py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-lg font-semibold"
          >
            Get Started
          </button>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">Upload Data</h3>
              <p className="text-gray-600">
                Start by uploading your text files for analysis.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">Set Criteria</h3>
              <p className="text-gray-600">
                Rank the criteria based on how important they are to your
                preferred pronunciation.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">View Results</h3>
              <p className="text-gray-600">
                Get your preferred pronunciation based on the criteria you rank
                and the various pronunciations of the target word, see the
                operability table and export the results to a PDF.
              </p>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-purple-800 mb-6">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-700">
                  Evaluation Process
                </h3>
                <p className="text-gray-600">
                  Our preference grammar system evaluates pronunciations based
                  on six key criteria:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>
                    <span className="font-medium">
                      International Acceptance
                    </span>{" "}
                  </li>
                  <li>
                    <span className="font-medium">Dis-ambiguity</span>
                  </li>
                  <li>
                    <span className="font-medium">Contrastiveness</span>
                  </li>
                  <li>
                    <span className="font-medium">Pedagogic Convenience</span>{" "}
                  </li>
                  <li>
                    <span className="font-medium">Phonetic Simplicity</span>{" "}
                  </li>
                  <li>
                    <span className="font-medium">Frequency</span> How f
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-700">
                  Scoring System
                </h3>
                <p className="text-gray-600">
                  Each pronunciation is evaluated against these criteria using a
                  sophisticated scoring system:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>
                    You rank each criterion from 1 (least important) to 6 (most
                    important)
                  </li>
                  <li>
                    The system uses your ranking to determine the weight of each
                    criterion.
                  </li>
                  <li>
                    Each pronunciation is analyzed for its performance on each
                    criterion
                  </li>
                  <li>
                    The final score combines your preferences with the
                    pronunciation's performance
                  </li>
                  <li>
                    The system recommends the pronunciation with the highest
                    overall score
                  </li>
                </ul>
                <p className="text-gray-600 mt-4">
                  The results are presented in a detailed operability table,
                  showing how each pronunciation performs across all criteria,
                  helping you make an informed decision about your preferred
                  pronunciation.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg text-purple-700 italic">
                We hope you enjoy using our Preference Grammar Tool to find your
                preferred pronunciation!
              </p>
            </div>

            {/* Mini About Section */}
            <div className="mt-12 bg-purple-50 rounded-2xl p-8 border border-purple-100">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                About Our Evaluation Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="text-lg font-semibold text-purple-700 mb-3">
                    How We Evaluate
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Our system uses a sophisticated preference grammar approach
                    to determine the optimal pronunciation based on your
                    criteria rankings. Each pronunciation is evaluated across
                    six key dimensions:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                      <span className="font-medium">
                        International Acceptance
                      </span>
                    </li>
                    <li>
                      <span className="font-medium">Dis-ambiguity</span>
                    </li>
                    <li>
                      <span className="font-medium">Contrastiveness</span>
                    </li>
                    <li>
                      <span className="font-medium">Pedagogic Convenience</span>
                    </li>
                    <li>
                      <span className="font-medium">Phonetic Simplicity</span>
                    </li>
                    <li>
                      <span className="font-medium">Frequency</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-700 mb-3">
                    The Scoring Process
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your rankings (1-6) determine the weight of each criterion
                    in the final evaluation. The system then:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                      Analyzes each possible pronunciation against all criteria
                    </li>
                    <li>
                      Applies your preference weights to calculate a weighted
                      score
                    </li>
                    <li>
                      Identifies the pronunciation with the highest overall
                      score
                    </li>
                    <li>Presents detailed results in an operability table</li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    The final PDF report includes the best pronunciation
                    recommendation and a comprehensive analysis of all evaluated
                    pronunciations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
