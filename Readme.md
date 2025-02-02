# Workflow Automation

<br>
<div align="center">
  
![workflow_automation](https://github.com/user-attachments/assets/505af0d9-4e3a-4552-93a7-c7a786a6ce6d)
</div>
<br>

Workflow Automation is a lightweight, cross-platform desktop application built with [Tauri](https://tauri.app/) that allows users to effortlessly trigger and manage GitHub Actions workflows. Designed for developers and CI/CD engineers, this tool eliminates the need to manually trigger workflows via GitHub's web interface or API.

## ✨ Features

- 🔄 **Trigger GitHub Workflows**: Start workflows with just a click.
- 📜 **View Workflow Status**: Monitor the progress and results of running workflows.
- 🛠 **Manage Workflow Inputs**: Easily input custom parameters before execution.
- 🔐 **Secure Authentication**: Authenticate via GitHub tokens securely.

## 🏗️ Tech Stack

<p align="center">
<img src="https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=red">
<img src="https://img.shields.io/badge/tailwindcss-%2320232a.svg?style=for-the-badge&logo=tailwind-css&logoColor=%36b6f2">
<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
<img src="https://img.shields.io/badge/javascript-%2320232a.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E">
<img src="https://img.shields.io/badge/tauri-%23000000.svg?style=for-the-badge&logo=tauri&logoColor=%f7bb2f">
</p>

## 📦 Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites/)

### Clone & Install

```sh
# Clone the repository
git clone https://github.com/your-username/github-workflow-gui.git
cd github-workflow-gui

# Install dependencies
pnpm install  # or npm install

# Run the app
pnpm tauri dev  # or npm run tauri dev

# Build the app
pnpm tauri build # or npm run tauri build
```

Or optionally, you can download the compiled binary through [releases](https://github.com/DewanshNehra/workflow-automation/releases).

**Note**: The app includes a built-in updater to automatically fetch the latest updates.

## ⚙️ Usage
<!-- AUTO-GENERATED-CONTENT:START (TOC:collapse=true&collapseText="Click to expand") -->
<details>
<summary>Show Usage</summary>
  




https://github.com/user-attachments/assets/4cbf2eb1-800e-47f8-b9d4-0eb1e696bb0c




</details>
<!-- AUTO-GENERATED-CONTENT:END -->

1. When first opening the app, you'll be prompted to authenticate with GitHub.
2. After authentication, the app will automatically fetch your GitHub repositories. Select a repository from the dropdown list.(Additionally, you can specify a custom username or organization to fetch public repositories associated with it.)
3. Once a repository is selected, you can:
   - Choose a branch from the available branches
   - Enter a version number 
   - Select an environment from available environments
   - Choose a workflow from the list of GitHub Actions workflows

4. After configuring all parameters, click "Run Workflow" to trigger the GitHub Action.

5. You can monitor workflow status in real-time through the Status screen, which shows:
   - Workflow run history
   - Current execution status 
   - Run timestamps
   - Run results

Note: The app requires the GitHub CLI (`gh`) to be installed on your system. If not installed, the app will prompt you to install it automatically.
<details>
<summary>Screenshots</summary>

<p>
    <img src="https://github.com/user-attachments/assets/0b71fc69-e2f9-4585-b4af-b3df71fe4002" hspace="7" width="25%" >
    <img src="https://github.com/user-attachments/assets/1932b188-4291-419f-964b-18b7e4f5b157" hspace="7" width="25%" >
    <img src="https://github.com/user-attachments/assets/3a09c264-638d-47ab-9246-72d9fbd9f45f" hspace="7" width="25%" >
    <img src="https://github.com/user-attachments/assets/ed344b7e-591a-4734-9f8c-5b2472c2faf5" hspace="7" width="25%" >
    <img src="https://github.com/user-attachments/assets/7c42155c-7582-412c-9a41-46bfd604cd1e" hspace="7" width="25%" >
    <img src="https://github.com/user-attachments/assets/a2cc204b-d00e-41bd-b8a8-c9db26d57674" hspace="7" width="25%" >
    
</p>
</details>

## 🔒 Authentication

The application automatically handles authentication via GitHub CLI's `gh auth login` [command](https://cli.github.com/manual/gh_auth_login).

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

We welcome contributions! Feel free to open issues, submit pull requests, or suggest improvements.

## 📬 Contact

For any questions or support, reach out via [GitHub Issues](https://github.com/your-username/github-workflow-gui/issues).
