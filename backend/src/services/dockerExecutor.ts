import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const execPromise = promisify(exec);

interface ExecutionOptions {
  timeout?: number;
  maxOutputLength?: number;
  stdin?: string;
}

export class DockerExecutor {
  private readonly timeout: number;
  private readonly maxOutputLength: number;
  private readonly imageName: string;

  constructor() {
    this.timeout = parseInt(process.env.EXECUTION_TIMEOUT || '5000');
    this.maxOutputLength = parseInt(process.env.MAX_OUTPUT_LENGTH || '10000');
    this.imageName = process.env.DOCKER_IMAGE || 'tslenrn-executor:latest';
  }

  async execute(code: string, options: ExecutionOptions = {}): Promise<{
    success: boolean;
    output?: string;
    error?: string;
    executionTime?: number;
  }> {
    const timeout = options.timeout || this.timeout;
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tslenrn-'));
    const codeFile = path.join(tempDir, 'code.ts');
    const inputFile = path.join(tempDir, 'input.txt');
    
    try {
      await fs.writeFile(codeFile, code);
      await fs.writeFile(inputFile, options.stdin ?? '');
      
      const startTime = Date.now();
      
      const dockerCommand = `docker run --rm \
        --network none \
        --memory="128m" \
        --cpus="0.5" \
        --pids-limit=32 \
        -v "${codeFile}:/code.ts:ro" \
        -v "${inputFile}:/input.txt:ro" \
        ${this.imageName} \
        sh -c "tsx /code.ts < /input.txt"`;

      try {
        const { stdout, stderr } = await Promise.race([
          execPromise(dockerCommand, { 
            timeout,
            maxBuffer: this.maxOutputLength 
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Execution timeout')), timeout)
          )
        ]);

        const executionTime = Date.now() - startTime;
        const output = (stdout + stderr).slice(0, this.maxOutputLength);

        return {
          success: !stderr || stderr.length === 0,
          output: output || 'No output',
          executionTime
        };
      } catch (execError: any) {
        const executionTime = Date.now() - startTime;
        
        if (execError.message === 'Execution timeout') {
          return {
            success: false,
            error: `Execution timeout after ${timeout}ms`,
            executionTime
          };
        }

        return {
          success: false,
          error: execError.stderr || execError.message,
          output: execError.stdout,
          executionTime
        };
      }
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  async testDocker(): Promise<boolean> {
    try {
      await execPromise(`docker run --rm ${this.imageName} node --version`);
      return true;
    } catch {
      return false;
    }
  }
}

export const dockerExecutor = new DockerExecutor();
