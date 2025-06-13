import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

const criteriaList = [
  {
    key: "IA",
    abbr: "IA",
    title: "International Acceptance",
    desc: "How widely accepted the pronunciation is across different English-speaking regions",
    color: "#e0e7ff",
  },
  {
    key: "DI",
    abbr: "DI",
    title: "Dis-ambiguity",
    desc: "How clearly distinguishable the pronunciation is from similar words",
    color: "#f3e8ff",
  },
  {
    key: "CO",
    abbr: "CO",
    title: "Contrastiveness",
    desc: "How distinct the pronunciation is from contrasting sounds in the language",
    color: "#fef9c3",
  },
  {
    key: "PC",
    abbr: "PC",
    title: "Pedagogic Convenience",
    desc: "How easy the pronunciation is to teach to language learners",
    color: "#fee2e2",
  },
  {
    key: "PS",
    abbr: "PS",
    title: "Phonetic Simplicity",
    desc: "How simple and straightforward the pronunciation is",
    color: "#f3e8ff",
  },
  {
    key: "F",
    abbr: "F",
    title: "Frequency",
    desc: "How frequently the pronunciation pattern occurs in the language",
    color: "#dcfce7",
  },
];

export default function CriteriaPage() {
  const [sliders, setSliders] = useState({
    IA: 3,
    DI: 3,
    CO: 3,
    PC: 3,
    PS: 3,
    F: 3,
  });
  const navigate = useNavigate();

  function handleSlider(key, value) {
    setSliders((prev) => ({ ...prev, [key]: value }));
  }

  function handleNext() {
    navigate("/results");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <ProgressBar currentStep={3} />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow p-10 flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            {criteriaList.map((crit) => (
              <div
                key={crit.key}
                className="bg-gray-50 rounded-lg p-6 flex flex-col gap-2 border border-gray-200"
              >
                <div className="flex items-center gap-4 mb-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base"
                    style={{ background: crit.color }}
                  >
                    {crit.abbr}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-gray-900">
                      {crit.title}
                    </div>
                    <div className="text-sm text-gray-500">{crit.desc}</div>
                  </div>
                  <div className="ml-auto text-lg font-semibold text-purple-500">
                    {sliders[crit.key]}
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={sliders[crit.key]}
                  onChange={(e) =>
                    handleSlider(crit.key, Number(e.target.value))
                  }
                  className="w-full accent-purple-500 h-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 - Less Important</span>
                  <span>6 - More Important</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="w-36 h-10 rounded-full text-white font-medium text-base self-end transition-colors bg-purple-500 hover:bg-purple-700"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
