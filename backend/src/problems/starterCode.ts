export const acmStarterCode = `import * as fs from 'fs';

const input = fs.readFileSync(0, 'utf8');
const tokens = input.match(/\\S+/g) ?? [];
let idx = 0;

const next = (): string => tokens[idx++] ?? '';
const nextNum = (): number => Number(next());

const out: string[] = [];
const print = (...values: Array<string | number | bigint>): void => {
  out.push(values.join(' '));
};

// 在这里写题解逻辑
// 示例：
// const a = nextNum();
// const b = nextNum();
// print(a + b);

process.stdout.write(out.join('\\n'));
`;
