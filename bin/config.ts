// export const config = {
// 	githubToken: process.env.GITHUB_TOKEN,
// 	repoUrl: "https://github.com/RajendraDex/npm-package.git",
// }


// import { spawn } from "child_process"
// // import { config } from "./config"

// export class GitCloneProcess {
// 	private destinationDir: string

// 	constructor(destinationDir: string) {
// 		this.destinationDir = destinationDir
// 	}

// 	public async executeGitClonePrivateProcess(): Promise<void> {
// 		if (!config.githubToken) {
// 			throw new Error("GitHub token is not set. Please set the GITHUB_TOKEN environment variable.")
// 		}

// 		const repoUrl = `https://x-access-token:${config.githubToken}@${config.repoUrl.replace("https://", "")}`
// 		const args = ["clone", repoUrl, this.destinationDir]

// 		const gitClone = spawn("git", args, {
// 			detached: true,
// 			stdio: "ignore",
// 		})

// 		gitClone.unref()

// 		gitClone.on("error", (err) => {
// 			console.error(`Failed to start git clone: ${err.message}`)
// 		})

// 		console.log("Git clone process started in the background.")
// 	}
// }



