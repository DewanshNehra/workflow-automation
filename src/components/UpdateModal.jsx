// src/components/UpdateModal.jsx
import React, { useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { GoVersions } from "react-icons/go";
import { FaGithub } from "react-icons/fa";
import { BsFileEarmarkArrowDownFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";


const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

function UpdateModal({ isOpen, onClose, onUpdate, currentVersion, newVersion, downloadSize }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleUpdateClick = async () => {
    setIsDownloading(true);
    try {
      await onUpdate();
    } catch (error) {
      console.error('Update failed:', error);
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center rounded-[1.25rem] "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-[#1a1a1a]/80 backdrop-blur-md  p-6 w-[95%] max-w-md border border-white/10 rounded-[1.25rem]"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-2">
              <FaGithub className="text-white text-2xl" />
              <h2 className="text-white text-xl font-semibold">Update Available</h2>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400 bg-[#2a2a2a] p-3 rounded-lg w-full">
              <GoVersions className="text-xl" />
              <div className="flex-1">
                <p className="text-sm">Current: v{currentVersion}</p>
                <p className="text-sm text-green-400">New: v{newVersion}</p>
              </div>
              {downloadSize && (
                <div className="flex items-center gap-1 bg-[#3a3a3a] px-2 py-1 rounded">
                  <BsFileEarmarkArrowDownFill className="text-gray-500" />
                  <span className="text-xs text-green-400">{formatBytes(downloadSize)}</span>
                </div>
              )}
            </div>

            <p className="text-gray-400 text-sm text-center">
              A new version is available with the latest features and improvements.
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <motion.button 
                onClick={onClose} 
                className="px-6 py-2 rounded-lg bg-[#3F3F3F] text-white hover:bg-[#4F4F4F] flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoCloseOutline size={20} />
                Skip
              </motion.button>
              <motion.div
                className="relative rounded-lg"
                animate={{
                  boxShadow: ["0 0 0 0px rgba(251,251,251,0.9)", "0 0 0 5px rgba(251,251,251,0)"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.button 
                  onClick={handleUpdateClick}
                  disabled={isDownloading}
                  className="px-6 py-2 rounded-lg bg-[#4F4F4F] text-white hover:bg-[#5F5F5F] flex items-center gap-2 relative z-10 disabled:opacity-75"
                  whileHover={{ scale: isDownloading ? 1 : 1.05 }}
                  whileTap={{ scale: isDownloading ? 1 : 0.95 }}
                >
                  <motion.div
                    animate={isDownloading ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                  </motion.div>
                  {isDownloading ? 'Downloading...' : 'Update'}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default UpdateModal;