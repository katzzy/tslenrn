import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import { nodeTypings } from '../editor/nodeTypings';

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
  theme = 'vs',
  height = '100%',
}) => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    if (isMonacoConfigured) return;

    monaco.editor.defineTheme('tslenrn-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#f8fafc',
      },
    });

    monaco.editor.defineTheme('tslenrn-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#111827',
      },
    });

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

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      nodeTypings,
      'ts:filename/node.d.ts'
    );
    monaco.editor.setTheme(theme);
    isMonacoConfigured = true;
  };

  return (
    <div className={`h-full w-full ${theme === 'tslenrn-dark' ? 'bg-gray-900' : 'bg-slate-50'}`}>
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
          fontSize: 16,
          lineHeight: 24,
          lineNumbers: 'on',
          lineNumbersMinChars: 2,
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: {
            top: 12,
            bottom: 8,
          },
          formatOnPaste: true,
          formatOnType: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          snippetSuggestions: 'inline',
          suggest: {
            showStatusBar: true,
            preview: true,
            previewMode: 'subwordSmart',
            localityBonus: true,
            selectionMode: 'always',
            snippetsPreventQuickSuggestions: false,
          },
          fixedOverflowWidgets: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;
