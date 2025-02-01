use std::io::Write;
use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};


#[tauri::command]
async fn get_file_size() -> Result<String, String> {
    let output = Command::new("gh")
        .arg("api")
        .arg(format!("repos/DewanshNehra/workflow-automation/releases/latest"))
        .arg("--jq")
        .arg(".assets[] | select(.name | endswith(\".exe\")) | .size")
        .stdout(Stdio::piped())
        .creation_flags(0x08000000)
        .output()
        .map_err(|e| e.to_string())?;

    let output_str = String::from_utf8_lossy(&output.stdout).to_string();
    println!("File size output: {}", output_str);
    Ok(output_str)
}

#[tauri::command]
async fn check_gh_installed() -> Result<bool, String> {
    let output = Command::new("gh")
        .arg("--version")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .creation_flags(0x08000000)
        .status()
        .map(|status| status.success())
        .unwrap_or(false);

    Ok(output)
}

#[tauri::command]
async fn install_gh_cli() -> Result<bool, String> {
    let output = Command::new("winget")
        .arg("install")
        .arg("--id")
        .arg("GitHub.cli")
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .creation_flags(0x08000000)
        .status()
        .map_err(|e| e.to_string())?;

    Ok(output.success())
}

#[tauri::command]
async fn gh_auth_login() -> Result<String, String> {
    println!("Executing updated gh_auth_login command...");

    // Build a path under AppData\WorkflowAutomationGui\
    let local_appdata = std::env::var("LOCALAPPDATA").map_err(|e| e.to_string())?;
    let output_dir = format!("{}\\WorkflowAutomationGui", local_appdata);
    std::fs::create_dir_all(&output_dir).map_err(|e| e.to_string())?;
    let output_file_path = format!("{}\\output.txt", output_dir);

    // Run gh auth login, redirect all output streams to the AppData path using '*>' in PowerShell
    let mut child = Command::new("powershell")
        .arg("-c")
        .arg(format!(
    "gh auth login --web --git-protocol https 2>&1 | Out-File -FilePath \"{}\" -Encoding utf8",
    output_file_path
))
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .creation_flags(0x08000000)
        .spawn()
        .map_err(|e| e.to_string())?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(b"\n").map_err(|e| e.to_string())?;
    }
    let _ = child.wait().map_err(|e| e.to_string())?;
    let file_output = std::fs::read_to_string(&output_file_path).map_err(|e| e.to_string())?;
    Ok(file_output)
}

#[tauri::command]
async fn read_output_file() -> Result<String, String> {
    let local_appdata = std::env::var("LOCALAPPDATA").map_err(|e| e.to_string())?;
    let file_path = format!("{}\\WorkflowAutomationGui\\output.txt", local_appdata);

    let file_content = std::fs::read_to_string(file_path).map_err(|e| e.to_string())?;
    for line in file_content.lines() {
        if line.contains("one-time code:") {
            if let Some(pos) = line.find(':') {
                return Ok(line[(pos + 1)..].trim().to_string());
            }
        }
    }
    Ok("".into())
}

#[tauri::command]
async fn gh_auth_status() -> Result<String, String> {
    let output = Command::new("gh")
        .arg("api")
        .arg("user")
        .arg("--jq")
        .arg(".name")
        .stdout(Stdio::piped())
        .creation_flags(0x08000000)
        .output()
        .map_err(|e| e.to_string())?;

    let output_str = String::from_utf8_lossy(&output.stdout).to_string();
    println!("Auth status output: {}", output_str);
    Ok(output_str.trim().to_string())
}

#[tauri::command]
async fn gh_repo_list(name: String) -> Result<String, String> {
    let output = Command::new("gh")
        .arg("repo")
        .arg("list")
        .arg(&name)
        .arg("--json")
        .arg("name")
        .arg("-q")
        .arg(".[].name")
        .stdout(Stdio::piped())
        .creation_flags(0x08000000)
        .output()
        .map_err(|e| e.to_string())?;

    let output_str = String::from_utf8_lossy(&output.stdout).to_string();
    println!("Repo list output: {}", output_str);
    Ok(output_str)
}

#[tauri::command]
async fn gh_branch_list(owner: String, repo: String) -> Result<String, String> {
    let output = Command::new("gh")
        .arg("api")
        .arg(format!("repos/{}/{}/branches", owner, repo))
        .arg("--jq")
        .arg(".[].name")
        .stdout(Stdio::piped())
        .creation_flags(0x08000000)
        .output()
        .map_err(|e| e.to_string())?;

    let output_str = String::from_utf8_lossy(&output.stdout).to_string();
    println!("Branch list output: {}", output_str);
    Ok(output_str)
}

#[tauri::command]
async fn gh_workflow_runs(owner: String, repo: String, workflow: String) -> Result<String, String> {
    let output = Command::new("gh")
        .arg("run")
        .arg("list")
        .arg("--repo")
        .arg(format!("{}/{}", owner, repo))
        .arg("--workflow")
        .arg(workflow)
        .stdout(Stdio::piped())
        .creation_flags(0x08000000)
        .output()
        .map_err(|e| e.to_string())?;

    let output_str = String::from_utf8_lossy(&output.stdout).to_string();
    println!("Workflow runs output: {}", output_str);
    Ok(output_str)
}

#[tauri::command]
async fn gh_env_list(owner: String, repo: String) -> Result<String, String> {
    let output = Command::new("gh")
        .arg("api")
        .arg(format!("repos/{}/{}/environments", owner, repo))
        .arg("--jq")
        .arg(".environments[].name")
        .stdout(Stdio::piped())
        .creation_flags(0x08000000)
        .output()
        .map_err(|e| e.to_string())?;

    let output_str = String::from_utf8_lossy(&output.stdout).to_string();
    Ok(output_str)
}

#[tauri::command]
async fn gh_workflow_list(owner: String, repo: String) -> Result<String, String> {
    let output = Command::new("gh")
        .arg("api")
        .arg(format!("repos/{}/{}/actions/workflows", owner, repo))
        .arg("--jq")
        .arg(".workflows[].name")
        .stdout(Stdio::piped())
        .creation_flags(0x08000000)
        .output()
        .map_err(|e| e.to_string())?;

    let output_str = String::from_utf8_lossy(&output.stdout).to_string();
    Ok(output_str)
}

#[tauri::command]
async fn run_generated_commands(commands: Vec<String>) -> Result<Vec<String>, String> {
    let mut results = Vec::new();

    for command in commands {
        println!("Running command: {}", command);
        let output = Command::new("sh")
            .arg("-c")
            .arg(&command)
            .stdout(Stdio::piped())
            .creation_flags(0x08000000)
            .output()
            .map_err(|e| e.to_string())?;

        let output_str = String::from_utf8_lossy(&output.stdout).to_string();
        println!("Command output: {}", output_str);
        results.push(output_str);
    }

    Ok(results)
}

#[tauri::command]
async fn close_app(app_handle: tauri::AppHandle) {
    app_handle.exit(0);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_file_size,
            check_gh_installed,
            install_gh_cli,
            gh_repo_list,
            gh_branch_list,
            gh_env_list,
            gh_workflow_list,
            gh_workflow_runs,
            run_generated_commands,
            gh_auth_login,
            gh_auth_status,
            read_output_file,
            close_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
