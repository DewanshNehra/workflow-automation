import React from 'react';

const CustomInput = ({ icon: Icon, placeholder, value, onChange }) => {
  return (
    <div className="flex w-[100%] h-[40px] bg-[#1F1F1F] rounded-lg overflow-hidden ">
      <div className="w-[25%] flex items-center justify-center border-4 border-[#1F1F1F] bg-black rounded-[10px]    ">
        <Icon className="text-[#676767] text-xl" />
      </div>
      <input
        type="text"
        className="w-[90%] h-full bg-transparent text-[#555555] px-4 outline-none text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CustomInput;