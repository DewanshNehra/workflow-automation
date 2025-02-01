import React from "react";
import PropTypes from 'prop-types';
import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { GoGitBranch } from "react-icons/go";
import { RiTimerLine } from "react-icons/ri";
import { PiCalendarDots } from "react-icons/pi";
import { open } from '@tauri-apps/plugin-shell';

const getBorderColor = (status, conclusion) => {
    if (status !== "completed") return "border-[#FFA500]";
    return conclusion === "success" ? "border-[#01FF88]" : "border-[#D24040]";
};

const IconWrapper = ({ children }) => (
    <div className="flex items-center gap-1 text-[9px]">
        {children}
    </div>
);

const StatusBox = ({ status, conclusion, title, date, branch, url, duration }) => (
    <div className={`flex justify-between items-center bg-black p-3 rounded-3xl w-full border-2 ${getBorderColor(status, conclusion)}`}>
        <FaGithub size={25} />
        
        <div className="flex flex-col items-center">
            <h3 className="text-[11px]">{title}</h3>
            <div className="flex items-center gap-2 mt-1 text-[#dfdfdf]">
                <IconWrapper>
                    <GoGitBranch size={13} color="white" />
                    <p>{branch}</p>
                </IconWrapper>
                <IconWrapper>
                    <RiTimerLine size={13} color="white" />
                    <p>{duration}</p>
                </IconWrapper>
                <IconWrapper>
                    <PiCalendarDots size={13} color="white" />
                    <p>{date}</p>
                </IconWrapper>
            </div>
        </div>

        <FiExternalLink 
            size={20} 
            className="cursor-pointer"
            onClick={() => open(url)}
        />
    </div>
);

StatusBox.propTypes = {
    status: PropTypes.string.isRequired,
    conclusion: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    branch: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired
};

export default StatusBox;