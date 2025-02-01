import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { TbHome } from "react-icons/tb";
import { IoRefresh, IoSearch } from "react-icons/io5";
import { RiGitRepositoryLine } from "react-icons/ri";
import { SiGithubactions } from "react-icons/si";
import CustomDropdown from "../components/CustomDropdown";
import { format } from 'date-fns';
import StatusBox from "../components/statusbox";

function StatusScreen() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [username] = useState(localStorage.getItem("github_username") || "");
    const [repos, setRepos] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(localStorage.getItem("selected_repo") || "");
    const [workflows, setWorkflows] = useState(JSON.parse(localStorage.getItem("workflows")) || []);
    const [selectedWorkflow, setSelectedWorkflow] = useState(localStorage.getItem("selected_workflow") || "");
    const [workflowRuns, setWorkflowRuns] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (username) fetchRepos();
    }, [username]);

    useEffect(() => {
        if (selectedRepo) fetchWorkflows();
    }, [selectedRepo]);

    useEffect(() => {
        if (username && selectedRepo && selectedWorkflow) fetchWorkflowRuns();
    }, [username, selectedRepo, selectedWorkflow]);

    const fetchData = async (fn) => {
        setLoading(true);
        try {
            await fn();
        } catch (error) {
            console.error("Operation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRepos = () => fetchData(async () => {
        const repos = await invoke("gh_repo_list", { name: username });
        setRepos(repos.split("\n").filter(Boolean));
    });

    const fetchWorkflows = () => fetchData(async () => {
        const buildList = await invoke("gh_workflow_list", {
            owner: username,
            repo: selectedRepo
        });
        const workflowList = buildList.split("\n").filter(Boolean);
        setWorkflows(workflowList);
        localStorage.setItem("workflows", JSON.stringify(workflowList));
    });

    const fetchWorkflowRuns = () => fetchData(async () => {
        const runsOutput = await invoke("gh_workflow_runs", {
            owner: username,
            repo: selectedRepo,
            workflow: selectedWorkflow
        });
        setWorkflowRuns(runsOutput.split("\n").filter(Boolean));
    });

    const handleRepoChange = (repo) => {
        setSelectedRepo(repo);
        localStorage.setItem("selected_repo", repo);
        setSelectedWorkflow("");
        localStorage.removeItem("selected_workflow");
    };

    const handleWorkflowChange = (workflow) => {
        setSelectedWorkflow(workflow);
        localStorage.setItem("selected_workflow", workflow);
    };

    const parseWorkflowRun = (runString) => {
        const [status, conclusion, name, jobName, branch, event, id, duration, createdAt] = runString.split('\t');
        return { status, conclusion, name, jobName, branch, event, id, duration, createdAt };
    };

    const filteredWorkflowRuns = workflowRuns.filter(run => {
        const workflowData = parseWorkflowRun(run);
        return (
            workflowData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            workflowData.branch.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <main className="container min-h-screen p-4 bg-[#12121200]">
            <header className="flex justify-between items-center mb-6 pt-8">
                <div className="flex-1">
                    <CustomDropdown
                        icon={RiGitRepositoryLine}
                        options={repos}
                        placeholder="Search repositories..."
                        onChange={handleRepoChange}
                        value={selectedRepo}
                    />
                </div>
                
                <div className="flex gap-4 ml-4">
                    <button
                        onClick={fetchWorkflowRuns}
                        disabled={loading}
                        className="p-2 bg-[#1F1F1F] rounded-full hover:bg-[#2F2F2F] disabled:opacity-50"
                    >
                        <IoRefresh className={`text-white text-xl ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => navigate("/mainScreen")}
                        className="p-2 bg-[#1F1F1F] rounded-full hover:bg-[#2F2F2F]"
                    >
                        <TbHome className="text-white text-xl" />
                    </button>
                </div>
            </header>

            <section className="flex flex-col gap-6">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-[13px] text-white mb-2 block">Select Workflow</label>
                        <CustomDropdown
                            icon={SiGithubactions}
                            options={workflows}
                            placeholder="Select Workflow"
                            onChange={handleWorkflowChange}
                            value={selectedWorkflow}
                        />
                    </div>
                    
                    {workflowRuns.length > 0 && (
                        <div className="flex-1 relative">
                            <label className="text-[13px] text-white mb-2 block">Search Runs</label>
                            <input
                                type="text"
                                placeholder="Search workflows..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#1F1F1F] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F2F2F]"
                            />
                            <IoSearch className="absolute left-3 top-[38px] text-gray-400" size={18} />
                        </div>
                    )}
                </div>

                <div className="h-[calc(100vh-240px)] overflow-y-auto space-y-4 ">
                    {loading ? (
                        <div className="text-white text-center">Loading...</div>
                    ) : filteredWorkflowRuns.length > 0 ? (
                        filteredWorkflowRuns.map((run) => {
                            const workflowData = parseWorkflowRun(run);
                            return (
                                <StatusBox
                                    key={workflowData.id}
                                    status={workflowData.status}
                                    conclusion={workflowData.conclusion}
                                    title={workflowData.name}
                                    date={format(new Date(workflowData.createdAt), 'MMM dd, yyyy HH:mm')}
                                    branch={workflowData.branch}
                                    url={`https://github.com/${username}/${selectedRepo}/actions/runs/${workflowData.id}`}
                                    duration={workflowData.duration}
                                />
                            );
                        })
                    ) : (
                        <p className="text-white text-center">
                            {searchTerm ? "No matching workflows found" : "No workflow runs found"}
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}

export default StatusScreen;