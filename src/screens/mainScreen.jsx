import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { PiHashStraightBold } from "react-icons/pi";
import { FiGithub } from "react-icons/fi";
import { TbMenuDeep } from "react-icons/tb";
import { MdOutlineEdit } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { RiGitRepositoryLine } from "react-icons/ri";
import { GoGitBranch } from "react-icons/go";
import { SiGithubactions } from "react-icons/si";
import { FaHouseLock } from "react-icons/fa6";
import { GoVersions } from "react-icons/go";
import { invoke } from "@tauri-apps/api/core";
import Modal from "../components/Modal";
import CustomDropdown from "../components/CustomDropdown";
import CustomInput from "../components/CustomInput";
import UpdateModal from "../components/UpdateModal";
import { check } from "@tauri-apps/plugin-updater"
import { relaunch } from '@tauri-apps/plugin-process';

function MainScreen() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [username, setUsername] = useState(() => localStorage.getItem('github_username') || '');
    const [selectedRepo, setSelectedRepo] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [version, setVersion] = useState('');
    const [selectedEnv, setSelectedEnv] = useState('');
    const [repos, setRepos] = useState([]);
    const [branches, setBranches] = useState([]);
    const [workflow, setworkflow] = useState([]);
    const [selectedBuild, setSelectedBuild] = useState('');
    const [environments, setEnvironments] = useState([]);
    const [finalCommand, setFinalCommand] = useState('');
    const [buttonText, setButtonText] = useState('Run Workflow');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [name, setName] = useState(() => localStorage.getItem('github_name') || '');
    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
    const [currentVersion, setCurrentVersion] = useState('0.0.0');
    const [newVersion, setNewVersion] = useState('0.0.0');
    const [fileSize, setFileSize] = useState(0);

    useEffect(() => {
        checkForUpdates();
    }, []);

    useEffect(() => {
        if (username) {
            fetchRepos();
        }
    }, [username]);

    useEffect(() => {
        gh_auth_status();
    }, []);

    useEffect(() => {
        if (selectedRepo) fetchBranches();
    }, [selectedRepo]);

    useEffect(() => {
        if (selectedRepo) fetchEnvironments();
    }, [selectedRepo]);

    useEffect(() => {
        if (selectedRepo) {
            fetchworkflow();
        }
    }, [selectedRepo]);

    
    const checkForUpdates = async () => {
        try {
            const update = await check();
            if (update?.available) {
                setCurrentVersion(update.currentVersion);
                setNewVersion(update.version);
                const fileSize = await invoke('get_file_size');
                setFileSize(fileSize);
                setIsUpdateAvailable(true);
            }
        } catch (error) {
            console.error('Failed to check for updates:', error);
        }
    };


    const handleUpdate = async () => {
        try {
            const update = await check();
            if (update?.available) {
                await update.downloadAndInstall();
                await relaunch();
            }
        } catch (error) {
            console.error('Failed to install update:', error);
        }
    };


    const gh_auth_status = async () => {
        try {
            const name = await invoke('gh_auth_status');
            console.log("Received name from gh_auth_status:", name);
            console.log("Name length:", name.length);
            console.log("Name type:", typeof name);

            if (name && name.trim()) {
                localStorage.setItem('github_name', name.trim());
                console.log("Stored in localStorage:", localStorage.getItem('github_name'));
                setName(name.trim());
            } else {
                console.log("Name was empty or whitespace");
            }
        } catch (error) {
            console.error('Failed to get username:', error);
        }
    };

    const fetchRepos = async () => {
        try {
            const repos = await invoke('gh_repo_list', { name: username });
            console.log("Repo list output:", repos);
            const repoList = repos.split('\n').filter(Boolean);
            setRepos(repoList);
        } catch (error) {
            console.error('Failed to fetch repos:', error);
        }
    };

    const fetchBranches = async () => {
        try {
            const branchList = await invoke('gh_branch_list', {
                owner: username,
                repo: selectedRepo
            });
            const branches = branchList.split('\n').filter(Boolean);
            setBranches(branches);
        } catch (error) {
            console.error('Failed to fetch branches:', error);
        }
    };

    const fetchworkflow = async () => {
        try {
            const buildList = await invoke('gh_workflow_list', {
                owner: username,
                repo: selectedRepo
            });
            const workflow = buildList.split('\n').filter(Boolean);
            setworkflow(workflow);
        } catch (error) {
            console.error('Failed to fetch workflow:', error);
        }
    };

    const fetchEnvironments = async () => {
        try {
            const envList = await invoke('gh_env_list', {
                owner: username,
                repo: selectedRepo
            });
            // Add console.log to debug the response
            console.log('Environments:', envList);
            const environments = envList.split('\n').filter(Boolean);
            setEnvironments(environments);
        } catch (error) {
            console.error('Failed to fetch environments:', error);
        }
    };

    const handleUsernameSubmit = (newUsername) => {
        console.log("Submitted username:", newUsername);
        localStorage.setItem('github_username', newUsername);
        setUsername(newUsername);
        setIsModalOpen(false);
    };

    const buildCommand = async () => {
        if (!selectedRepo || !selectedBranch || !version || !selectedEnv || !selectedBuild) {
            alert('Please fill in all fields');
            return;
        }
    
        setButtonText('Deploying...');
        setButtonDisabled(true);
    
        try {
            const firstCommand = `gh workflow run "${selectedBuild}" --repo ${username}/${selectedRepo} --ref ${selectedBranch} -f version=${version} -f environment=${selectedEnv}`;
            await invoke('run_generated_commands', { commands: [firstCommand] });
    
            // Check workflow status
            setButtonText('Checking Status...');
            await new Promise(resolve => setTimeout(resolve, 2000));
    
            const statusCommand = `gh run list --repo ${username}/${selectedRepo} --workflow="${selectedBuild}" --json status --jq ".[0].status"`;
            const status = await invoke('gh_workflow_runs', { 
                owner: username, 
                repo: selectedRepo,
                workflow: selectedBuild 
            });
    
            if (status.includes('completed')) {
                setButtonText('✓ Deployed!');
            } else if (status.includes('failed')) {
                setButtonText('× Failed');
            } else {
                setButtonText('? Unknown Status');
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error('Failed to run workflow:', error);
            setButtonText('× Failed');
            await new Promise(resolve => setTimeout(resolve, 2000));
        } finally {
            setButtonText('Run Workflow');
            setButtonDisabled(false);
        }
    };

    return (
        <main className="container">
            <div className="w-screen text-black h-[85vh]">
                <div className="flex flex-row items-center gap-4 p-4">
                    <div
                        className="bg-white w-fit rounded-3xl cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <MdOutlineEdit size={33} className="p-1" />
                    </div>
                    <div>
                        <CustomDropdown
                            icon={RiGitRepositoryLine}
                            options={repos}
                            placeholder="Search repositories..."
                            onChange={(repo) => {
                                console.log("Selected repo:", repo);
                                setSelectedRepo(repo);
                            }}
                        />
                    </div>
                    <div className="w-fit rounded-3xl relative">
                        <div
                            onClick={() => setShowMenu(!showMenu)}
                            className="cursor-pointer"
                        >
                            <TbMenuDeep color="black" size={35} className="p-1 bg-white rounded-4xl" />
                        </div>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-24 bg-[#1F1F1F] rounded-lg shadow-lg z-50">
                                <div
                                    className="px-4 py-2 text-sm text-white hover:bg-black cursor-pointer rounded-lg"
                                    onClick={() => {
                                        navigate('/StatusScreen');
                                        setShowMenu(false);
                                    }}
                                >
                                    Status
                                </div>
                                <div
                                    className="px-4 py-2 text-sm text-white hover:bg-black cursor-pointer rounded-lg"
                                    onClick={() => {
                                        navigate('/LoginScreen');
                                        setShowMenu(false);
                                    }}
                                >
                                    Login
                                </div>
                                <div
                                    className="px-4 py-2 text-sm text-white hover:bg-black rounded-lg cursor-pointer"
                                    onClick={() => {
                                        invoke('close_app');
                                        setShowMenu(false);
                                    }}
                                >
                                    Quit
                                </div>
                            </div>
                        )}
                    </div>

                </div>
                <div className="flex flex-col pl-5 text-white">
                    <div>
                        <p className="text-[10px]  pt-5 pb-1">Choose Branch</p>
                        <div className="w-[60%]">
                            <CustomDropdown
                                icon={GoGitBranch}
                                options={branches}
                                placeholder="Select Branch"
                                onChange={setSelectedBranch}
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-[13px] pt-5 pb-1">Select Workflow</p>
                        <div className="w-[90%] ">
                            <CustomDropdown
                                icon={SiGithubactions}
                                options={workflow}
                                placeholder="Select Workflow"
                                onChange={setSelectedBuild}
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-[13px]  pt-5 pb-1">Version to deploy</p>
                        <div className="w-[90%] ">
                            <CustomInput
                                icon={GoVersions}
                                placeholder="Type your version here..."
                                value={version}
                                onChange={setVersion}
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-[13px]  pt-5 pb-1">Environment to deploy to</p>
                        <div className="w-[90%]">
                            <CustomDropdown
                                icon={FaHouseLock}
                                options={environments}
                                placeholder="Select Environment"
                                onChange={setSelectedEnv}
                            />
                        </div>
                    </div>
                    <div className="w-full flex justify-center">
                        <button
                            className="bg-[#1F1F1F] text-white rounded-lg p-2 px-8 mt-5"
                            onClick={buildCommand}
                            disabled={buttonDisabled}
                        >
                            {buttonText}
                        </button>
                    </div>

                </div>
                {finalCommand && (
                    <div className="mt-4 p-4 bg-[#1F1F1F] rounded-lg">
                        <code className="text-sm text-white">{finalCommand}</code>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleUsernameSubmit}
            />
            <UpdateModal
                isOpen={isUpdateAvailable}
                onClose={() => setIsUpdateAvailable(false)}
                onUpdate={handleUpdate}
                currentVersion={currentVersion}
                newVersion={newVersion}
                downloadSize={fileSize}
            />

        </main>
    );
}

export default MainScreen;