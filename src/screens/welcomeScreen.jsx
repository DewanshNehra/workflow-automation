import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { RxArrowRight } from "react-icons/rx";

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <main className="container min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-lg flex flex-col items-center">
        <div className="flex flex-col items-center mb-12">
          <FaGithub size={120} className="text-white mb-6" />
          <h1 className="text-white text-4xl font-semibold tracking-wide mb-4">Hello!</h1>
          <p className="text-[#676767] mt-2 text-center">Welcome to GitHub Workflow Automation</p>
        </div>

        <button 
          onClick={() => navigate("/loginScreen")}
          className="group relative bg-[#1F1F1F] hover:bg-[#2F2F2F] text-white py-4 px-8 rounded-xl transition-all duration-300 
            border border-[#ffffff10] hover:border-[#ffffff20] font-medium shadow-lg hover:shadow-[#ffffff10] 
            flex items-center gap-3 hover:scale-105"
        >
          Get Started
          <RxArrowRight size={20} />
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ffffff10] to-[#ffffff00] rounded-xl opacity-0 
            group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10">
          </div>
        </button>
      </div>
    </main>
  );
}

export default WelcomeScreen;