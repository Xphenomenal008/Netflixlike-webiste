import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios"
import { ORG_IMG_URL } from "../../utils/constant";

const Ai_prediction = () => {
  const [intent, setIntent] = useState({
    energy: "low",
    attention: "short",
    goal: "relax",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchRecommendation = async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await axios.post(
      "/api/v1/ai_recomendation",
      intent,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data?.recommendation) {
      setResult(res.data);
    } else if (res.data?.needMoreInfo) {
      setError("Unable to find suitable recommendation. Please adjust your preferences.");
      setResult(null);
    } else {
      setError("Unexpected response from server.");
      setResult(null);
    }
  } catch (error) {
    console.error("AI recommendation error:", error);
    setError(error?.response?.data?.message || "Failed to get recommendation. Please try again.");
    setResult(null);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex justify-center items-center px-4 py-16 pt-20 sm:pt-24 lg:pt-32">
        <div className="w-full max-w-md bg-neutral-900 rounded-2xl p-6 shadow-xl">

          {/* ================= INTENT FORM ================= */}
          {!result && !loading && (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Let AI decide your movie
              </h2>

              {/* Energy */}
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-400">
                  Energy level
                </label>
                <select
                  className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  value={intent.energy}
                  onChange={(e) =>
                    setIntent({ ...intent, energy: e.target.value })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Attention */}
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-400">
                  Attention span
                </label>
                <select
                  className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  value={intent.attention}
                  onChange={(e) =>
                    setIntent({ ...intent, attention: e.target.value })
                  }
                >
                  <option value="short">Short</option>
                  <option value="normal">Normal</option>
                  <option value="deep">Deep</option>
                </select>
              </div>

              {/* Goal */}
              <div className="mb-6">
                <label className="block mb-2 text-sm text-gray-400">
                  What do you want to feel?
                </label>
                <select
                  className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  value={intent.goal}
                  onChange={(e) =>
                    setIntent({ ...intent, goal: e.target.value })
                  }
                >
                  <option value="relax">Relax</option>
                  <option value="thrill">Thrill</option>
                  <option value="inspire">Inspire</option>
                </select>
              </div>

              <button
                onClick={fetchRecommendation}
                className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-3 font-semibold"
              >
                Recommend me a movie
              </button>
            </>
          )}

          {/* ================= LOADING ================= */}
          {loading && (
            <div className="text-center py-10">
              <p className="text-lg animate-pulse text-gray-300">
                Finding the perfect movie for you…
              </p>
            </div>
          )}

          {/* ================= ERROR STATE ================= */}
          {error && !loading && (
            <div className="space-y-4">
              <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400 font-semibold">Oops!</p>
                <p className="text-red-300 text-sm mt-2">{error}</p>
              </div>
              <button
                onClick={() => { setError(null); setResult(null); }}
                className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-3 font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ================= DECISION CARD ================= */}
          {result?.recommendation && !loading && !error && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {result.recommendation.poster_path && (
                <img 
                  src={ORG_IMG_URL + result.recommendation.poster_path}
                  alt={result.recommendation.title}
                  className="w-full rounded-lg shadow-lg"
                />
              )}

              <h1 className="text-3xl font-bold text-center">
                {result.recommendation.title}
              </h1>

              <div className="bg-black rounded-xl p-4">
                <h3 className="text-sm text-gray-400 mb-1">
                  Rating & Confidence
                </h3>
                <div className="flex justify-between">
                  <p className="text-lg">★ {(result.recommendation.vote_average || 0).toFixed(1)}/10</p>
                  <p className="text-sm text-gray-400">{result.recommendation.confidence || "High"}</p>
                </div>
              </div>

              <div className="bg-black rounded-xl p-4">
                <h3 className="text-sm text-gray-400 mb-1">
                  What you’ll get
                </h3>
                <p className="text-lg capitalize">
                  {result.recommendation.outcome?.payoff || "Great"} experience
                </p>
              </div>

              <div className="bg-black rounded-xl p-4">
                <h3 className="text-sm text-gray-400 mb-1">
                  Why this fits now
                </h3>
                <p className="text-gray-300 text-sm">
                  {result.recommendation.explanation || "Based on your preferences, this is a great match for you."}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-white text-black font-semibold py-2 rounded-lg">
                  Play Now
                </button>
                <button
                  onClick={fetchRecommendation}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 transition py-2 rounded-lg"
                >
                  Try another
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Ai_prediction;
