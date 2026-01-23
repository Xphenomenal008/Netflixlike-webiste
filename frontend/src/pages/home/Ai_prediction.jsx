import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Ai_prediction = () => {
  const [intent, setIntent] = useState({
    energy: "low",
    attention: "short",
    goal: "relax",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const fetchRecommendation = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/v1/ai_recomendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intent),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex justify-center items-center px-4 py-16">
        <div className="w-full max-w-md bg-neutral-900 rounded-2xl p-6 shadow-xl">

          {/* ================= INTENT FORM ================= */}
          {!result && !loading && (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Let AI decide your movie 🎬
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

          {/* ================= DECISION CARD ================= */}
          {result?.recommendation && !loading && (
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-center">
                {result.recommendation.title}
              </h1>

              <div className="bg-black rounded-xl p-4">
                <h3 className="text-sm text-gray-400 mb-1">
                  What you’ll get
                </h3>
                <p className="text-lg capitalize">
                  {result.recommendation.outcome.payoff} experience
                </p>
              </div>

              <div className="bg-black rounded-xl p-4">
                <h3 className="text-sm text-gray-400 mb-1">
                  Why this fits now
                </h3>
                <p className="text-gray-300">
                  {result.recommendation.explanation}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-white text-black font-semibold py-2 rounded-lg">
                  ▶ Play Now
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
