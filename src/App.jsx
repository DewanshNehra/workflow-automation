import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginScreen from "./screens/loginScreen";
import StatusScreen from "./screens/statusScreen";
import MainScreen from "./screens/mainScreen";
import CodeScreen from "./screens/codeScreen";
import HelloScreen from "./screens/helloSceen";
import ShinyText from "./components/shinyText";
import "./App.css";

function App() {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const [version, setVersion] = React.useState('0.0.0');

  useEffect(() => {
    const getAppVersion = async () => {
      try {
        const { getVersion } = await import('@tauri-apps/api/app');
        const version = await getVersion();
        setVersion(version);
      } catch (error) {
        console.error('Error getting version:', error);
      }
    };
    getAppVersion();
  }, []);

  return (
    <div 
      className="App select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="title-bar">
      <div data-tauri-drag-region className="absolute top-3 left-0 w-screen text-center text-[12px] tracking-[1px] text-[#676767] ">Workflow <span className="text-[#FFFFFF]">Automation</span></div>
      </div>
      <div className="app-container w-screen h-screen flex justify-center items-center bg-black rounded-3xl">
        <Router>
          <Routes>
            <Route path="/" element={<HelloScreen />} />
            <Route path="/LoginScreen" element={<LoginScreen />} />
            <Route path="/CodeScreen" element={<CodeScreen />} />
            <Route path="/StatusScreen" element={<StatusScreen />} />
            <Route path="/MainScreen" element={<MainScreen />} />
          </Routes>
        </Router>
      </div>
      <footer className="absolute bottom-2 text-[#1d1d1d] text-[11px] w-full text-center">
      <p className=" absolute pl-[87%] text-[#1b1b1b] hover:text-white">v{version}</p>
        <a href="https://github.com/dewanshnehra" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ShinyText text="Made by Dewans Nehra" disabled={false} speed={3} className='custom-class' />
        </a>
        
      </footer>
    </div>
  );
}

export default App;