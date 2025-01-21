import { spawn } from 'child_process';
import fs from 'fs-extra';

export class DirectoryCopier {
  private isWindows: boolean;
  private command: string;
  private args: string[];

  constructor(private sourceDir: string, private destinationDir: string) {
    this.isWindows = process.platform === 'win32';
    this.command = this.isWindows ? 'xcopy' : 'cp';
    this.args = this.isWindows ? ['/E', '/I', sourceDir, destinationDir] : ['-r', sourceDir, destinationDir];
  }

  public async copyDirectory(): Promise<void> {
    try {
      await this.executeCopyProcess();
      console.log('Directory copied successfully.');
    } catch (error) {
      console.error('Error during copy process:', error);
      throw error;
    }
  }

  public async copyPublicRepo(): Promise<void> {
    try {
      await this.executeGitCloneProcess();
      console.log('Git clone process started in the background.');
    } catch (error) {
      console.error('Error during git clone process:', error);
      throw error;
    }
  }
  public async copyGitPrivateRepo(): Promise<void> {
    try {
      await this.executeGitClonePrivateProcess();
      console.log('Git clone process started in the background.');
    } catch (error) {
      console.error('Error during git clone process:', error);
      throw error;
    }
  }

  public async copyDirectoryByModule(): Promise<void> {
    try {
      await this.executeCopyProcessByModule();
      console.log('Directory copied successfully.');
    } catch (error) {
      console.error('Error during copy process:', error);
      throw error;
    }
  }

  private executeCopyProcess(): Promise<void> {
    return new Promise((resolve, reject) => {
      const copyProcess = spawn(this.command, this.args, {
        // stdio: 'inherit',
        stdio: 'pipe', // Changed from 'inherit' to 'pipe'
        shell: true,
      });

      copyProcess.on('error', (error) => {
        reject(error);
      });

      copyProcess.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Copy process failed with code: ${code}`));
        }
      });
    });
  }

  private async executeGitCloneProcess(): Promise<void> {
    const args = ['clone', this.sourceDir, this.destinationDir];
    // Spawn a git clone process
    const gitClone = spawn('git', args, {
      detached: true, // Run in the background
      stdio: 'ignore' // Ignore standard I/O
    });

    gitClone.unref(); // Detach the process

    gitClone.on('error', (err) => {
      console.error(`Failed to start git clone: ${err.message}`);
    });

    console.log('Git clone process started in the background.');
  };

  private async executeGitClonePrivateProcess(): Promise<void> {

    const args = ['clone', this.sourceDir, this.destinationDir];
    // Spawn a git clone process
    const gitClone = spawn('git', args, {
      detached: true, // Run in the background
      stdio: 'ignore' // Ignore standard I/O
    });

    gitClone.unref(); // Detach the process

    gitClone.on('error', (err) => {
      console.error(`Failed to start git clone: ${err.message}`);
    });

    console.log('Git clone process started in the background.');
  };

  private async executeCopyProcessByModule(): Promise<void> {
    try {
      await fs.copy(this.sourceDir, this.destinationDir);
      console.log(' 🎉🎉🎉🎉🎉🎈🎈🎈Directory copied successfully.');
    } catch (error) {
      console.error('Error while copying directory:', error);
    }

  }

};

