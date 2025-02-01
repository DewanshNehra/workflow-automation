import React from 'react';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [input, setInput] = React.useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#1a1a1a] rounded-lg p-6 w-[95%]">
        <h3 className="text-white text-sm mb-4">Enter Username/Organization</h3>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-[#2F2F2F] text-white rounded-lg p-2 mb-4 outline-none"
          placeholder="Username or Organization"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#3F3F3F] text-white hover:bg-[#4F4F4F]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(input);
              setInput('');
            }}
            className="px-4 py-2 rounded-lg bg-[#4F4F4F] text-white hover:bg-[#5F5F5F]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;