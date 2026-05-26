import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [topic, setTopic] = useState("");
  const [tool, setTool] = useState("title");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // LOADING TEXTS
  const loadingTexts = [
    "🔍 Analyzing Topic...",
    "⚡ Finding Viral Keywords...",
    "🚀 Optimizing SEO...",
    "🔥 Generating High Ranking Content...",
  ];

  // LOADING EFFECT
  useEffect(() => {
    let interval;

    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) =>
          prev === loadingTexts.length - 1 ? 0 : prev + 1,
        );
      }, 1200);
    }

    return () => clearInterval(interval);
  }, [loading]);

  // GENERATE CONTENT
  const generateContent = async () => {
    try {
      setLoading(true);
      setResult("");

      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          topic,
          tool,
        }),
      });

      const data = await response.json();

      setTimeout(() => {
        setResult(data.result);

        setLoading(false);
      }, 2500);
    } catch (error) {
      console.log(error);

      setLoading(false);

      setResult("Failed to generate AI content");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden px-4 py-10 relative">
      {/* BACKGROUND GLOW */}
      <div className="absolute w-87 h-87 bg-violet-500/20 blur-[120px] rounded-full -top-20 -left-20" />

      <div className="absolute w-87 h-87 bg-fuchsia-500/20 blur-[120px] rounded-full -bottom-20 -right-20" />

      {/* MAIN CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-3xl rounded-[30px] border border-white/10 bg-zinc-900/70 backdrop-blur-xl shadow-2xl p-5 sm:p-7"
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-center">
            <span className="bg-linear-to-r from-violet-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Title Generator AI
            </span>

            <br />

            <span className="bg-linear-to-r from-fuchsia-400 via-purple-500 to-blue-400 bg-clip-text text-transparent">
              Create Viral Titles Instantly 🚀
            </span>
          </h1>
          <p className="text-zinc-400 mt-4 text-xs sm:text-sm max-w-xl mx-auto leading-6">
            Create high ranking YouTube titles, viral Instagram captions and
            trending hashtags powered by AI.
          </p>
        </div>

        {/* INPUT SECTION */}
        <div className="space-y-4">
          {/* INPUT */}
          <input
            type="text"
            placeholder="Enter your topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />

          {/* SELECT */}
          <select
            value={tool}
            onChange={(e) => setTool(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          >
            <option value="title">Youtube Title Generator</option>

            <option value="caption">Instagram Caption Generator</option>

            <option value="hashtag">Trending Hashtag Generator</option>
          </select>

          {/* BUTTON */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={generateContent}
            className="w-full p-4 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-base hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            {loading
              ? loadingTexts[loadingStep]
              : "🚀 Generate Optimized Content"}
          </motion.button>
        </div>

        {/* RESULT SECTION */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            {/* RESULT TITLE */}
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
              Optimized Viral Content ✨
            </h2>

            {/* RESULT GRID */}
            <div className="grid gap-4">
              {result
                .split("\n\n")
                .filter((item) => item.trim() !== "")
                .map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-5 shadow-lg"
                  >
                    {/* NUMBER */}
                    <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white">
                      {index + 1}
                    </div>

                    {/* CONTENT */}
                    <p className="text-zinc-200 leading-7 whitespace-pre-wrap text-sm pr-8">
                      {item}
                    </p>

                    {/* COPY BUTTON */}
                    <button
                      onClick={() => navigator.clipboard.writeText(item)}
                      className="mt-4 px-4 py-2 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-medium hover:opacity-90 transition-all"
                    >
                      📋 Copy
                    </button>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
