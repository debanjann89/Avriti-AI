import { useEffect, useState } from "react";

const letters = [
  { char: "A", color: "text-gray-800 font-light" },
  { char: "a", color: "text-gray-800 font-light" },
  { char: "v", color: "text-gray-800 font-light" },
  { char: "r", color: "text-gray-800 font-light" },
  { char: "i", color: "text-gray-800 font-light" },
  { char: "t", color: "text-gray-800 font-light" },
  { char: "i", color: "text-gray-800 font-light" },
  { char: " ", color: "w-3 sm:w-5" },
  { char: "A", color: "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 font-extrabold" },
  { char: "I", color: "text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-500 font-extrabold" }
];

export default function Preloader() {
  const [isOpening, setIsOpening] = useState(false);
  const [isGone, setIsGone] = useState(false);

  useEffect(() => {
    // Elegant opening curtain slide starts at 2.5s
    const openTimer = setTimeout(() => {
      setIsOpening(true);
    }, 2500);

    // Unmount after curtain completely slides off-screen
    const goneTimer = setTimeout(() => {
      setIsGone(true);
    }, 3500);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (isGone) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] select-none pointer-events-none transition-transform duration-[1000ms] ease-in-out bg-mesh-pink ${
        isOpening ? "translate-y-[-100%]" : "translate-y-0"
      }`}
    >
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes letterPopElegant {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Light, Soft Pinkish Gradient Mesh covering full screen */
        .bg-mesh-pink {
          background: linear-gradient(135deg, #fff5f7, #fffcfd, #fff0f2, #ffeef2, #fff5f5);
          background-size: 300% 300%;
          animation: gradientShift 10s ease infinite;
        }

        .animate-letter-elegant {
          opacity: 0;
          display: inline-block;
          animation: letterPopElegant 0.8s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
        }
      `}</style>

      {/* Main Brand Typography Centered inside Curtain */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-[500ms] ease-in-out ${
          isOpening ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Soft centered pink glow backing */}
        <div className="absolute w-[240px] h-[240px] rounded-full bg-pink-500/5 blur-[90px] animate-pulse"></div>

        {/* Minimalist Subtext */}
        <span className="text-gray-400 text-[9px] font-extrabold tracking-[0.5em] uppercase mb-4 animate-pulse">
          Welcome to
        </span>

        {/* Luxury Brand Text */}
        <div className="flex items-center text-3xl sm:text-5xl tracking-[0.15em] font-sans font-semibold">
          {letters.map((l, index) => {
            if (l.char === " ") {
              return <div key={index} className={l.color} />;
            }
            return (
              <span
                key={index}
                className={`animate-letter-elegant ${l.color}`}
                style={{
                  animationDelay: `${index * 80}ms`
                }}
              >
                {l.char}
              </span>
            );
          })}
        </div>

        {/* Brand Slogan */}
        <p className="text-gray-400/80 text-[8px] font-semibold tracking-[0.4em] uppercase mt-4">
          Virtual Fitting Room
        </p>
      </div>
    </div>
  );
}
