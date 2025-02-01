import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { RxArrowRight } from "react-icons/rx";



function CodeScreen() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchCode = async () => {
    try {
      const result = await invoke("read_output_file");
      setCode(result);
    } catch (error) {
      console.error("Failed to read output:", error);
    }
  };

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchCode, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="container min-h-screen  flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-lg">
        <div className="flex flex-col">
          <div className="flex items-center justify-center mb-8">
            <FaGithub size={120} />
          </div>
        </div>
        <div className="relative bg-[#121212] p-4 rounded-2xl mb-8 py-6">
          {code && (
            <button onClick={handleCopy} className={`absolute right-2 top-5 transform -translate-y-1/2 p-[6px] rounded-lg transition-all duration-300 ${copied ? 'text-black bg-[#FFFFFF]' : 'text-gray-400 hover:text-white hover:bg-[#2F2F2F]'}`} title="Copy to clipboard">
              <MdContentCopy size={13} />
            </button>
          )}
          <div className="flex items-center justify-center">
            {code ? (
              <span className="text-white font-mono text-4xl tracking-[0.2em] font-semibold">{code}</span>
            ) : (
              <span className="text-[#676767] text-2xl flex  gap-3">Waiting for code...</span>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => {
              localStorage.setItem('hasVisitedBefore', 'true');
              navigate("/mainScreen");
          }}
            className="group relative bg-[#070707] hover:bg-[#202020] text-white py-4 px-8 rounded-xl transition-all duration-300 
                      border-[#ffffff10] hover:border-[#ffffff20] font-medium shadow-lg hover:shadow-[#ffffff10] 
                        flex items-center gap-3 hover:scale-105"
          >

            <RxArrowRight size={20} />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ffffff10] to-[#ffffff00] rounded-xl opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10">
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}

export default CodeScreen;