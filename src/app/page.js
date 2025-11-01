'use client'

import * as motion from "motion/react-client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

async function run({ input, router }) {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: `Grade this APUSH DBQ: ${input}` }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    router.push(`/result?response=${encodeURIComponent(data.response)}`);
  } catch (error) {
    console.error('Error during chat session:', error);
  }
}

export default function Home() {
  const router = useRouter();
  const [blocks, setBlocks] = useState([]);
  const [input, setInput] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [showPieces, setShowPieces] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [erasePieces, setErasePieces] = useState(false);

  const numberOfBlocks = 25;

  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const gradients = [
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
      "bg-gradient-to-br from-pink-400 to-red-500"
    ];

    const initialBlocks = Array.from({ length: numberOfBlocks }).map(() => {
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
      return {
        top: Math.random() * windowHeight - 75,
        left: Math.random() * windowWidth - 75,
        size: Math.random() * 60 + 20,
        delay: Math.random() * 3,
        gradient: randomGradient,
      };
    });

    setBlocks(initialBlocks);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPopupOpen(true);
    await run({ input, router });
  };

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const handleTOS = () => router.push('/tos');

  // Puzzle rectangle bounds
  const puzzleBounds = {
    top: '10%',
    left: '25%',
    width: '50%',
    height: '70%',
  };

  const pieces = [
    { name: 'top-left', initial: { x: -500, y: -300 }, style: { top: puzzleBounds.top, left: puzzleBounds.left, width: '25%', height: '35%' }, delay: 0 },
    { name: 'top-right', initial: { x: 500, y: -300 }, style: { top: puzzleBounds.top, left: '50%', width: '25%', height: '35%' }, delay: 0.2 },
    { name: 'bottom-left', initial: { x: -500, y: 300 }, style: { top: '45%', left: puzzleBounds.left, width: '25%', height: '35%' }, delay: 0.4 },
    { name: 'bottom-right', initial: { x: 500, y: 300 }, style: { top: '45%', left: '50%', width: '25%', height: '35%' }, delay: 0.6 },
  ];

  const handlePiecesComplete = () => {
    // Trigger the diagonal corner wipe
    setErasePieces(true);
    setTimeout(() => {
      setShowPieces(false); // remove pieces after wipe
      setShowForm(true);    // show form with opposite wipe
    }, 700); // duration of wipe
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-purple-50 overflow-hidden">

      {/* Floating blocks */}
      {blocks.map((block, index) => (
        <motion.div
          key={index}
          className={`absolute ${block.gradient} rounded-lg shadow-lg`}
          style={{
            top: `${block.top}px`,
            left: `${block.left}px`,
            width: `${block.size}px`,
            height: `${block.size}px`,
          }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            scale: [0, 1, 1.1, 1],
            opacity: [0, 0.3, 0.3, 0.05],
            rotate: [0, 5, -5, 0],
            y: [0, 10, -10, 0]
          }}
          transition={{ duration: 12, delay: block.delay, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}

      {/* Puzzle pieces */}
      <div className="absolute w-full h-full max-w-5xl">
        {showPieces && pieces.map((piece, idx) => (
          <motion.div
            key={piece.name}
            className="absolute flex items-center justify-center backdrop-blur-md bg-white/30 rounded-lg shadow-2xl p-4"
            style={piece.style}
            initial={piece.initial}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: piece.delay, ease: "easeOut" }} // faster animation
            onAnimationComplete={() => {
              if (idx === pieces.length - 1) {
                // trigger fade out after last piece finishes
                setTimeout(() => setErasePieces(true), 50); 
                setTimeout(() => {
                  setShowPieces(false);
                  setShowForm(true);
                }, 250); // slightly longer to allow fade
              }
            }}
            {...(erasePieces ? {
              animate: { x: 0, y: 0, opacity: 0 }, // keep x/y fixed, only fade
              transition: { duration: 1, ease: "easeIn" }
            } : {})}
          />
        ))}

        {/* Solid form with opposite diagonal wipe */}
        {showForm && (
          <div
            className="absolute rounded-3xl shadow-2xl"
            style={puzzleBounds} // shadow and exact position/size
          >
            <motion.div
              className="w-full h-full flex flex-col items-center justify-center backdrop-blur-md bg-white/90 rounded-3xl p-8"
              initial={{ clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)' }}
              animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              whileHover={{ y: [0, -5, 5, 0], transition: { yoyo: Infinity, duration: 3, ease: "easeInOut" } }}
            >
              <h1 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-yellow-500 to-purple-600 text-transparent bg-clip-text drop-shadow-lg mb-4 text-center">
                Intelligrader
              </h1>
              <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-6 text-center">
                The APUSH DBQ Grader
              </h2>
              <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                <textarea
                  rows={6}
                  placeholder="Paste your DBQ response here..."
                  className="w-full p-4 border rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:scale-105 transition-transform"
                >
                  Grade Now
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isPopupOpen && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Grading in progress...</h2>
            <p className="text-gray-700">This may take a moment.</p>
            <p className="text-gray-700 mt-2">Grab a cookie while you wait 🍪</p>
            <button
              className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              onClick={togglePopup}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="w-full py-6 bg-purple-700 text-white z-20 text-center text-sm absolute bottom-0">
        © 2025 Intelligrader. All rights reserved. | <a href="https://policies.google.com/privacy" className="text-blue-300 hover:underline">Privacy Policy</a> | <button onClick={handleTOS} className="text-blue-300 hover:underline">Terms of Service</button>
      </footer>
    </div>
  );
}
