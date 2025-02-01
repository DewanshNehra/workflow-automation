import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-shell';
import { FaGithub } from "react-icons/fa";

function LoginScreen() {
  const navigate = useNavigate();
  const [outputText, setOutputText] = useState("");
  const [isInstalling, setIsInstalling] = useState(false);
  const [buttonText, setButtonText] = useState("Continue with GitHub");

  useEffect(() => {
    checkAndInstallGH();
  }, []);

  const checkAndInstallGH = async () => {
    try {
      const isInstalled = await invoke("check_gh_installed");
      if (!isInstalled) {
        setIsInstalling(true);
        setButtonText("Installing GitHub CLI...");
        const installed = await invoke("install_gh_cli");
        if (installed) {
          setIsInstalling(false);
          setButtonText("Continue with GitHub");
        }
      }
    } catch (error) {
      console.error("Failed to check/install GitHub CLI:", error);
    }
  };

  const handleLoginAndRedirect = async () => {
    if (isInstalling) {
      setOutputText("Installing Github CLI...");
      return;
    }

    localStorage.setItem("code", "Logging in...");
    setOutputText("Logging in...");

    try {
      console.log("Invoking gh_auth_login command...");
      navigate("/codeScreen");
      open("https://github.com/login/device");
      await invoke("gh_auth_login");
      console.log("Command result: Login initiated");
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <main className="container min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-lg flex flex-col items-center">
        <div className="flex flex-col items-center mb-12">
          <FaGithub size={120} className="text-white mb-6" />
          <h1 className="text-white text-2xl font-semibold tracking-wide">Welcome to Workflow</h1>
          <p className="text-[#676767] mt-2">Sign in with your GitHub account</p>
        </div>

        <button 
          onClick={handleLoginAndRedirect}
          disabled={isInstalling}
          className={`group relative bg-[#1F1F1F] ${isInstalling ? 'opacity-75 cursor-not-allowed' : 'hover:bg-[#2F2F2F] hover:scale-105'} 
            text-white py-4 px-8 rounded-xl transition-all duration-300 
            border border-[#ffffff10] hover:border-[#ffffff20] font-medium shadow-lg hover:shadow-[#ffffff10] 
            flex items-center gap-3`}
        >
          <FaGithub size={24} className={isInstalling ? 'animate-spin' : ''} />
          {buttonText}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ffffff10] to-[#ffffff00] rounded-xl opacity-0 
            group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10">
          </div>
        </button>

        {outputText && (
          <p className="text-[#676767] mt-6 animate-pulse">{outputText}</p>
        )}
      </div>
    </main>
  );
}

export default LoginScreen;