import React, { useState } from "react";
import axios from "axios";

const AiSummary = ({ overview }) => {
    console.log(overview)
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
  console.log("Button clicked"); // check if click triggers
  if (!overview) return;
  setLoading(true);
  setError(null);
  try {
    const res = await axios.post("/api/v1/ai_summerizer", { text: overview });
    console.log("Response:", res.data); // check what comes back
    setAiData(res.data);
  } catch (err) {
    console.error(err);
    setError("Failed to get AI summary.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-red-500">AI Insights</h3>

      {!aiData && !loading && (
        <button
          onClick={fetchSummary}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors duration-200"
        >
          Generate AI Summary
        </button>
      )}

      {loading && (
        <div className="flex items-center space-x-2 mt-2">
          <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-0"></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-400"></span>
          <span className="text-gray-400 ml-2">AI is thinking...</span>
        </div>
      )}

      {error && <p className="text-red-400 mt-2">{error}</p>}

      {aiData && (
        <div className="mt-4">
          <p className="text-gray-200 mb-3">
            <span className="font-semibold text-white">Summary:</span> {aiData.summary}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-white">Mood:</span>{" "}
            <span className="text-green-400">{aiData.mood}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AiSummary;
