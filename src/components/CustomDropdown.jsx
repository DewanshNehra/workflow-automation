import React, { useState, useEffect, useRef } from 'react';

const CustomDropdown = ({ icon: Icon, options, placeholder, onChange }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const filteredOptions = options?.filter(option =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center" ref={dropdownRef}>
            <div className="flex w-[100%] h-[40px] bg-[#1F1F1F] rounded-lg overflow-visible relative">
                <div className="w-[25%] flex items-center justify-center border-4 border-[#1F1F1F] bg-black rounded-[10px] px-1">
                    <Icon className="text-[#747474] text-xl " />
                </div>
                <div className="w-[90%] relative">
                    <div className="flex jusity-start">
                        <input
                            type="text"
                            className="w-full h-[40px] bg-transparent text-white pl-2 pr-4 outline-none text-sm"
                            placeholder={placeholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={() => setIsOpen(true)}
                        />
                    </div>
                    {isOpen && filteredOptions && filteredOptions.length > 0 && (
                        <div className="absolute top-[42px] left-0 w-full bg-[#1F1F1F] mt-1 rounded-lg max-h-[200px] overflow-y-auto z-50 shadow-lg">
                            {filteredOptions.map((option, index) => (
                                <div 
                                    key={index}
                                    className="px-4 py-2 hover:bg-[#2F2F2F] cursor-pointer text-white text-sm"
                                    onClick={() => {
                                        setSearch(option);
                                        setIsOpen(false);
                                        if (onChange) onChange(option);
                                    }}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomDropdown;