export const nodeTypings = `
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
