import * as fs from 'fs/promises';
import * as path from 'path';
import type { Diagnostic } from 'typescript';
import { ExecutionFailure } from '../../types/execution';
import type { ExecutionOutput } from '../../types/execution';
import { runProcess } from './processRunner';

type TypeScriptModule = typeof import('typescript');

const getCompilationFailureMessage = (
  diagnostics: Diagnostic[],
  ts: TypeScriptModule
): string => {
  const lines = diagnostics.slice(0, 5).map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    return `TS${diagnostic.code}: ${message}`;
  });

  return lines.join('\n');
};

const compileTypeScriptLocally = async (code: string, targetFile: string): Promise<void> => {
  let ts: TypeScriptModule;
  try {
    ts = await import('typescript');
  } catch {
    throw new ExecutionFailure(
      'Local execution requires TypeScript runtime support. Install backend dev dependencies or use Docker execution.',
      { code: 'TYPESCRIPT_RUNTIME_MISSING' }
    );
  }

  const compiled = ts.transpileModule(code, {
    fileName: 'code.ts',
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });

  const hasErrors =
    compiled.diagnostics?.some((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error) ??
    false;
  if (hasErrors) {
    throw new ExecutionFailure(getCompilationFailureMessage(compiled.diagnostics ?? [], ts), {
      code: 'TYPESCRIPT_COMPILATION_FAILED',
    });
  }

  await fs.writeFile(targetFile, compiled.outputText);
};

export interface LocalRuntimeOptions {
  code: string;
  stdin: string;
  tempDir: string;
  timeout: number;
  maxOutputLength: number;
}

export const executeLocally = async (options: LocalRuntimeOptions): Promise<ExecutionOutput> => {
  const compiledFile = path.join(options.tempDir, 'code.js');
  await compileTypeScriptLocally(options.code, compiledFile);

  const result = await runProcess(process.execPath, [compiledFile], {
    timeout: options.timeout,
    maxOutputLength: options.maxOutputLength,
    stdin: options.stdin,
    cwd: options.tempDir,
  });

  if (result.exitCode !== 0) {
    throw new ExecutionFailure(result.stderr || `Execution failed with exit code ${result.exitCode}`, {
      output: result.stdout,
      code: 'LOCAL_EXECUTION_FAILED',
    });
  }

  return {
    output: result.stdout,
    stderr: result.stderr || undefined,
    executionTime: 0,
  };
};
