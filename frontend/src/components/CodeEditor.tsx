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

    // Add common node typings
    const nodeTypings = `
      declare module 'fs' {
        export function readFileSync(path: string | number, encoding: string): string;
      }
      declare module 'readline' {
        export function createInterface(options: any): any;
      }
      declare var console: {
        log(...args: any[]): void;
        error(...args: any[]): void;
      };
    `;
    
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      nodeTypings,
      'ts:filename/node.d.ts'
    );
  };

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <Editor
        height={height}
        language={language}
        path={path}
        theme={theme}
        value={code}
        onChange={(value) => onChange(value || '')}
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
