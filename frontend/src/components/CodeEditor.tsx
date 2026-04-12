import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  path?: string;
  theme?: string;
  height?: string;
}

let isMonacoConfigured = false;

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language = 'typescript',
  path = 'solution.ts',
  theme = 'vs-dark',
  height = '100%',
}) => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    if (isMonacoConfigured) return;

    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    });

    // Disable diagnostics for common node modules
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // Add common Node.js typings used in ACM solutions.
    const nodeTypings = `
      type BufferEncoding =
        | 'ascii'
        | 'utf8'
        | 'utf-8'
        | 'utf16le'
        | 'ucs2'
        | 'ucs-2'
        | 'base64'
        | 'base64url'
        | 'latin1'
        | 'binary'
        | 'hex';

      interface NodeProcess {
        argv: string[];
        env: Record<string, string | undefined>;
        exit(code?: number): never;
        cwd(): string;
        stdout: { write(chunk: string): boolean };
        stderr: { write(chunk: string): boolean };
      }

      declare var process: NodeProcess;

      interface Console {
        log(...args: unknown[]): void;
        error(...args: unknown[]): void;
        warn(...args: unknown[]): void;
        info(...args: unknown[]): void;
      }

      declare var console: Console;

      declare module 'fs' {
        export function readFileSync(path: string | number, encoding?: BufferEncoding): string;
        export function writeFileSync(
          path: string | number,
          data: string,
          encoding?: BufferEncoding
        ): void;
      }

      declare module 'node:fs' {
        export * from 'fs';
      }

      declare module 'readline' {
        export interface ReadLine {
          question(query: string, callback: (answer: string) => void): void;
          close(): void;
          on(event: 'line', listener: (line: string) => void): this;
          on(event: 'close', listener: () => void): this;
        }
        export interface ReadLineOptions {
          input: unknown;
          output?: unknown;
          terminal?: boolean;
        }
        export function createInterface(options: ReadLineOptions): ReadLine;
      }

      declare module 'node:readline' {
        export * from 'readline';
      }

      declare module 'path' {
        export function join(...paths: string[]): string;
        export function resolve(...paths: string[]): string;
        export function dirname(path: string): string;
        export function basename(path: string, ext?: string): string;
        export function extname(path: string): string;
      }

      declare module 'node:path' {
        export * from 'path';
      }
    `;
    
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      nodeTypings,
      'ts:filename/node.d.ts'
    );
    isMonacoConfigured = true;
  };

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <Editor
        height={height}
        language={language}
        path={path}
        theme={theme}
        value={code}
        onChange={(value) => {
          if (typeof value !== 'string' || value === code) return;
          onChange(value);
        }}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          fixedOverflowWidgets: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
