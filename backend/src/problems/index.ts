import { LearningModule, LearningTrack, Problem, ProblemLearningMeta } from '../types/problem';
import { acmStarterCode } from './starterCode';

type ProblemDraft = Omit<Problem, 'starterCode' | 'learning'> & {
  learning?: Partial<ProblemLearningMeta>;
};

interface ProblemFormat {
  input: string;
  output: string;
}

interface LearningBlueprint {
  from: number;
  to: number;
  module: LearningModule;
  track: LearningTrack;
}

const learningBlueprints: readonly LearningBlueprint[] = [
  { from: 1, to: 20, module: 'ts-foundation', track: 'core' },
  { from: 21, to: 40, module: 'ts-engineering', track: 'core' },
  { from: 41, to: 60, module: 'data-structures', track: 'reinforcement' },
  { from: 61, to: 85, module: 'algorithm-patterns', track: 'reinforcement' },
  { from: 86, to: 100, module: 'advanced-algorithms', track: 'challenge' },
];

const keywordTagRules: ReadonlyArray<{ regex: RegExp; tag: string }> = [
  { regex: /字符串|回文|前缀|子串|编码|anagram|kmp/i, tag: 'string' },
  { regex: /数组|排序|区间|滑动窗口|双指针/i, tag: 'array' },
  { regex: /栈|括号|逆波兰|单调/i, tag: 'stack' },
  { regex: /队列/i, tag: 'queue' },
  { regex: /哈希|map|set|字典/i, tag: 'hash' },
  { regex: /树|二叉|遍历|lca/i, tag: 'tree' },
  { regex: /图|最短路|并查集|连通|课程/i, tag: 'graph' },
  { regex: /动态规划|dp|背包|子序列|斐波那契/i, tag: 'dynamic-programming' },
  { regex: /贪心/i, tag: 'greedy' },
  { regex: /二分/i, tag: 'binary-search' },
  { regex: /数学|质数|因数|组合|gcd|lcm|阶乘/i, tag: 'math' },
  { regex: /json|日志|csv|路径|http/i, tag: 'engineering' },
];

const problemFormats: Record<number, ProblemFormat> = {
  1: { input: '一行两个整数 a b。', output: '输出一行整数 a+b。' },
  2: { input: '第一行整数 t；接下来 t 行每行两个整数 a b。', output: '输出 t 行，每行一个和。' },
  3: { input: '若干行整数 a b，遇到 0 0 结束处理。', output: '对终止前每组数据输出一行和。' },
  4: { input: '一行两个数字字符串 s1 s2。', output: '输出它们转为数字后的和。' },
  5: { input: '一行浮点数 x。', output: '输出 x 保留两位小数字符串。' },
  6: { input: '一行三个字段 name age city。', output: '按 "Name: ..., Age: ..., City: ..." 格式输出一行。' },
  7: { input: '一行年份整数 y。', output: '若是闰年输出 true，否则输出 false。' },
  8: { input: '一行 a op b，op 为 + - * /。', output: '输出运算结果；若除数为 0 输出 ERROR。' },
  9: { input: '一行整数 n。', output: '输出 1 到 n 的累加和。' },
  10: { input: '一行整数 n（0<=n<=12）。', output: '输出 n!。' },
  11: { input: '第一行 n；第二行 n 个整数。', output: '输出 "最大值 最小值"。' },
  12: { input: '第一行 n；第二行 n 个整数。', output: '输出所有偶数（空格分隔）；若无偶数输出 EMPTY。' },
  13: { input: '第一行 n；第二行 n 个整数。', output: '输出去重后数组（保留首次出现顺序）。' },
  14: { input: '第一行 n；第二行 n 个整数；第三行 i j（0-based）。', output: '输出交换 i 与 j 后的数组。' },
  15: { input: '一行字符串 s。', output: '输出反转后的字符串。' },
  16: { input: '一行字符串 s。', output: '输出元音字母 a/e/i/o/u（忽略大小写）出现次数。' },
  17: { input: '一行由空格分隔的英文短语。', output: '输出各单词首字母大写拼接结果。' },
  18: { input: '一行字符串 s。', output: '按字符字典序逐行输出 "字符:次数"。' },
  19: { input: '第一行 n q；第二行 n 个整数；第三行 q 个查询值。', output: '输出 q 行 true/false。' },
  20: { input: '第一行 n；接下来 n 行 key value。', output: '输出所有 value 的总和。' },
  21: { input: '第一行 n；接下来 n 行字符串。', output: '按长度升序、同长字典序升序逐行输出。' },
  22: { input: '第一行 n m；接下来 n 行每行 m 个整数。', output: '输出转置矩阵，共 m 行，每行 n 个整数。' },
  23: { input: '第一行 n q；第二行 n 个整数；接下来 q 行 l r（1-based）。', output: '每个查询输出一行区间和。' },
  24: { input: '第一行 m；接下来 m 行操作（in x 或 out）。', output: '每次 out 输出一行；空队列输出 EMPTY。' },
  25: { input: '一行仅包含 ()[]{} 的字符串。', output: '合法匹配输出 true，否则输出 false。' },
  26: { input: '一行 yyyy m d。', output: '输出 YYYY-MM-DD（月份与日期两位补零）。' },
  27: { input: '第一行 n；第二行 n 个整数成绩。', output: '输出 A/B/C/D/F 五行统计结果。' },
  28: { input: '一行图形类型与参数：rectangle w h / circle r / triangle b h。', output: '输出面积，保留两位小数。' },
  29: { input: '第一行 n；接下来 n 行 credit score。', output: '输出加权 GPA，保留两位小数。' },
  30: { input: '第一行 n；接下来 n 行日志文本。', output: '输出以 ERROR 开头的日志条数。' },
  31: { input: '第一行 n；接下来 n 行 name score。', output: '按 name score avg 三列输出，每行一个学生平均分（保留两位小数）。' },
  32: { input: '第一行 n；接下来 n 行类型与数据：FT base bonus 或 PT hours rate。', output: '输出 n 行每位员工工资（保留两位小数）。' },
  33: { input: '第一行 n；接下来 n 行 op amount（op 为 ALI/WECHAT/CASH）。', output: '输出三种支付方式累计金额（保留两位小数）。' },
  34: { input: '第一行 q；接下来 q 行操作：set key value / get key。', output: '对每个 get 输出一行对应 value；不存在输出 NULL。' },
  35: { input: '第一行 n；第二行 n 个状态码（0/1/2）。', output: '输出 "PENDING x"、"PROCESSING y"、"DONE z" 三行统计。' },
  36: { input: '第一行 n；接下来 n 行邮箱字符串。', output: '每行输出 true/false，表示是否匹配邮箱正则。' },
  37: { input: '一行字符串。', output: '按出现顺序输出所有连续数字片段（空格分隔）；若无数字输出 EMPTY。' },
  38: { input: '第一行 n；接下来 n 行日志，格式可能含 [LEVEL] message。', output: '输出 ERROR 级别日志数量。' },
  39: { input: '一行 JSON 字符串，形如 [{"name":"a","score":90},...]。', output: '输出平均 score（保留两位小数）。' },
  40: { input: '两行 JSON 对象字符串 cfg1、cfg2。', output: '输出浅合并后的 JSON 字符串（cfg2 同名键覆盖 cfg1）。' },
  41: { input: '一行 JSON 数组字符串，元素含 id 字段。', output: '按首次出现保留去重后，输出剩余元素数量。' },
  42: { input: '第一行 n；接下来 n 行文本内容（模拟文件行）。', output: '输出行数、非空行数、总字符数（用空格分隔）。' },
  43: { input: '第一行关键字 kw；第二行 n；接下来 n 行文本。', output: '输出包含 kw 的行号（1-based，空格分隔）；若无输出 NONE。' },
  44: { input: '第一行 n；第二行 CSV 表头；接下来 n 行 CSV 数据。', output: '输出 price 列总和（保留两位小数）。' },
  45: { input: '一行类 Unix 路径字符串。', output: '输出规范化路径（处理 //、.、..）。' },
  46: { input: '第一行 n；第二行 n 个 HTTP 状态码。', output: '输出 2xx、4xx、5xx 各自数量（格式：2xx x / 4xx y / 5xx z）。' },
  47: { input: '第一行 n；接下来 n 行 ok latency。', output: '输出成功率（%）与平均延迟（仅成功请求，保留两位小数）。' },
  48: { input: '第一行 w n；第二行 n 个时间戳（秒）。', output: '输出每个请求在最近 w 秒窗口内的请求数（空格分隔）。' },
  49: { input: '第一行 n；接下来 n 行事件名。', output: '按事件名字典序输出 "event:count"（每行一条）。' },
  50: { input: '第一行 n；接下来 n 行任务耗时（毫秒）。', output: '输出总耗时与最大耗时（空格分隔）。' },
  51: { input: '一行两个正整数 a b。', output: '输出 gcd(a,b) 与 lcm(a,b)。' },
  52: { input: '一行 a b m。', output: '输出 (a^b) mod m。' },
  53: { input: '一行整数 n。', output: '输出不大于 n 的素数个数。' },
  54: { input: '一行正整数 n。', output: '按从小到大输出 n 的质因数分解结果。' },
  55: { input: '一行整数 n。', output: '输出 n! 末尾 0 的个数。' },
  56: { input: '一行整数 n。', output: '输出第 n 个斐波那契数（对 1e9+7 取模）。' },
  57: { input: '第一行 n；第二行 n 个整数 cost。', output: '输出到达楼顶的最小花费。' },
  58: { input: '第一行 n；第二行 n 个整数（房屋金额）。', output: '输出不偷相邻房屋时可获得的最大金额。' },
  59: { input: '第一行 n；第二行 n 个整数（环形房屋金额）。', output: '输出可偷得的最大金额。' },
  60: { input: '第一行 n target；第二行 n 个整数。', output: '存在子集和为 target 输出 true，否则 false。' },
  61: { input: '一行 n k。', output: '输出组合数 C(n,k)（对 1e9+7 取模）。' },
  62: { input: '一行整数 n。', output: '输出 n!。' },
  63: { input: '一行整数 n。', output: '输出 n 皇后问题解的数量。' },
  64: { input: '第一行 n m；接下来 n 行每行 m 个 0/1。', output: '输出岛屿数量（四方向连通）。' },
  65: { input: '第一行 n m；接下来 n 行每行 m 个 0/1（0 可走，1 障碍）。', output: '输出左上到右下最短步数；不可达输出 -1。' },
  66: { input: '第一行 numCourses m；接下来 m 行 a b（修 a 前需先修 b）。', output: '可完成全部课程输出 true，否则 false。' },
  67: { input: '第一行 n m；接下来 m 行无向边 u v。', output: '输出连通块数量。' },
  68: { input: '第一行 n m；接下来 m 行无向边 u v w。', output: '输出最小生成树总权值；若图不连通输出 -1。' },
  69: { input: '第一行 n m；接下来 m 行有向边 u v w（非负权）。', output: '输出 1 到 n 的最短路；不可达输出 -1。' },
  70: { input: '第一行文本串 s；第二行模式串 p。', output: '输出 p 在 s 中首次出现下标；不存在输出 -1。' },
  71: { input: '一行字符串 s。', output: '输出游程压缩字符串（字符+连续次数）。' },
  72: { input: '第一行字符串 s；第二行字符串 t。', output: '输出覆盖 t 全部字符的最短子串长度；不存在输出 0。' },
  73: { input: '两行字符串 s 与 t。', output: '若互为异位词输出 true，否则 false。' },
  74: { input: '一行编码字符串（如 3[a2[c]]）。', output: '输出解码后的字符串。' },
  75: { input: '第一行 token 数 n；第二行 n 个逆波兰表达式 token。', output: '输出表达式求值结果。' },
  76: { input: '第一行 n；第二行 n 个整数。', output: '输出每个位置右侧第一个更大元素，不存在为 -1。' },
  77: { input: '第一行 n；第二行 n 个温度值。', output: '输出每一天距离下一次更高温度的天数。' },
  78: { input: '第一行 n；第二行 n 个柱高。', output: '输出柱状图中最大矩形面积。' },
  79: { input: '第一行 n；第二行 n 个柱高。', output: '输出可接雨水总量。' },
  80: { input: '第一行 n；接下来 n 行区间 l r。', output: '输出最多可选的不重叠区间数量。' },
  81: { input: '第一行 n；接下来 n 行会议区间 start end。', output: '输出最少会议室数量。' },
  82: { input: '第一行 n；接下来 n 行活动区间 start end。', output: '输出最多可参加的活动数量。' },
  83: { input: '第一行 n k；第二行 n 个整数。', output: '输出前 k 大元素（降序，空格分隔）。' },
  84: { input: '第一行 n；第二行 n 个整数（依次插入数据流）。', output: '输出每一步的中位数（空格分隔）。' },
  85: { input: '第一行 n；第二行 n 个整数。', output: '输出逆序对数量。' },
  86: { input: '第一行 n；第二行 n 个整数。', output: '输出升序排序后的数组。' },
  87: { input: '第一行 n k；第二行 n 个整数。', output: '输出第 k 小元素（1-based）。' },
  88: { input: '第一行 cap q；接下来 q 行操作（get k 或 put k v）。', output: '对每次 get 输出一行结果。' },
  89: { input: '第一行 n q；接下来 n 行单词；再接 q 行前缀。', output: '每个前缀输出一行匹配单词数量。' },
  90: { input: '第一行 n m；接下来 n 行字符网格；最后一行目标单词。', output: '存在路径输出 true，否则 false。' },
  91: { input: '第一行节点数 n；第二行 n 个层序节点值（null 表空）。', output: '依次输出前序、中序、后序三行遍历结果。' },
  92: { input: '第一行节点数 n；第二行 n 个层序节点值（null 表空）。', output: '按层逐行输出节点值。' },
  93: { input: '第一行节点数 n；第二行层序节点；第三行 p q。', output: '输出节点 p 与 q 的最近公共祖先值。' },
  94: { input: '第一行节点数 n；第二行层序节点值（null 表空）。', output: '平衡输出 true，否则 false。' },
  95: { input: '第一行 n；第二行 n 个股价。', output: '输出只交易一次可得的最大利润。' },
  96: { input: '第一行 n；第二行 n 个股价。', output: '输出可多次交易可得的最大利润。' },
  97: { input: '一行字符串 s。', output: '输出最长回文子串长度。' },
  98: { input: '一行字符串 s。', output: '输出最长回文子序列长度。' },
  99: { input: '第一行 n；第二行 n 个正整数。', output: '可分割为等和子集输出 true，否则 false。' },
  100: { input: '第一行 n K；第二行 n 个整数。', output: '输出和至少为 K 的最短连续子数组长度；不存在输出 -1。' },
};

const buildUnifiedDescription = (
  problemId: number,
  rawDescription: string,
  testCases: ProblemDraft['testCases']
): string => {
  const format = problemFormats[problemId];
  if (!format) {
    throw new Error(`Missing input/output format for problem ${problemId}`);
  }
  const example = testCases.find((testCase) => !testCase.hidden) ?? testCases[0];
  const sampleInput = example?.input ?? '';
  const sampleOutput = example?.expectedOutput ?? '';

  return [
    '题目说明：',
    rawDescription.trim(),
    '',
    '输入格式：',
    format.input,
    '',
    '输出格式：',
    format.output,
    '',
    '输入示例：',
    sampleInput,
    '',
    '输出示例：',
    sampleOutput === '' ? '(空输出)' : sampleOutput,
  ].join('\n');
};

const resolveLearningBlueprint = (problemId: number): LearningBlueprint => {
  const blueprint = learningBlueprints.find(({ from, to }) => problemId >= from && problemId <= to);
  if (!blueprint) {
    throw new Error(`Missing learning blueprint for problem ${problemId}`);
  }
  return blueprint;
};

const inferPrerequisites = (problemId: number): number[] => {
  if (problemId <= 1) {
    return [];
  }
  if (problemId <= 50) {
    return [problemId - 1];
  }
  if (problemId <= 80) {
    return [problemId - 1, problemId - 5];
  }
  return [problemId - 1, problemId - 10];
};

const inferTags = (problem: ProblemDraft): string[] => {
  const source = `${problem.title}\n${problem.description}`;
  const tags = new Set<string>();
  for (const rule of keywordTagRules) {
    if (rule.regex.test(source)) {
      tags.add(rule.tag);
    }
  }
  if (tags.size === 0) {
    tags.add('implementation');
  }
  return Array.from(tags);
};

const baseEstimatedMinutes = (difficulty: Problem['difficulty']): number => {
  if (difficulty === 'easy') return 15;
  if (difficulty === 'medium') return 30;
  return 45;
};

const buildLearningMeta = (problem: ProblemDraft): ProblemLearningMeta => {
  const blueprint = resolveLearningBlueprint(problem.id);
  const estimatedMinutes =
    baseEstimatedMinutes(problem.difficulty) + (blueprint.track === 'challenge' ? 10 : 0);

  return {
    track: blueprint.track,
    module: blueprint.module,
    tags: inferTags(problem),
    prerequisites: inferPrerequisites(problem.id),
    recommendedOrder: problem.id,
    estimatedMinutes,
    ...problem.learning,
  };
};

const m = (problem: ProblemDraft): Problem => ({
  ...problem,
  description: buildUnifiedDescription(problem.id, problem.description, problem.testCases),
  learning: buildLearningMeta(problem),
  starterCode: acmStarterCode,
});

export const problems: Problem[] = [
  // ========= TypeScript 学习区（1-50）=========
  m({
    id: 1,
    title: 'A+B 问题 I',
    difficulty: 'easy',
    description: `读取两个整数并输出它们的和。
输入：一行 a b。
输出：一行 a+b。`,
    hints: ['split + Number', '注意负数输入'],
    testCases: [
      { input: '1 2', expectedOutput: '3' },
      { input: '-5 8', expectedOutput: '3', hidden: true },
    ],
  }),
  m({
    id: 2,
    title: 'A+B 问题 II',
    difficulty: 'easy',
    description: `给定 t 组数据，每组两个整数，输出每组和。
输入：第一行 t，后续 t 行 a b。
输出：t 行结果。`,
    hints: ['先读 t 再循环', '结果按换行拼接输出'],
    testCases: [
      { input: '2\n1 2\n3 4', expectedOutput: '3\n7' },
      { input: '1\n-3 -7', expectedOutput: '-10', hidden: true },
    ],
  }),
  m({
    id: 3,
    title: 'A+B 问题 III',
    difficulty: 'easy',
    description: `连续读取 a b，遇到 0 0 停止。
输入：若干行 a b。
输出：对终止前每行输出 a+b。`,
    hints: ['读到 0 0 立即 break'],
    testCases: [
      { input: '1 2\n3 4\n0 0\n9 9', expectedOutput: '3\n7' },
      { input: '0 0', expectedOutput: '', hidden: true },
    ],
  }),
  m({
    id: 4,
    title: '数字字符串求和',
    difficulty: 'easy',
    description: `输入两个数字字符串，转换为 number 后求和。
输入：一行 s1 s2。
输出：一个数字。`,
    hints: ['显式 Number 转换'],
    testCases: [
      { input: '10 20', expectedOutput: '30' },
      { input: '001 09', expectedOutput: '10', hidden: true },
    ],
  }),
  m({
    id: 5,
    title: '保留两位小数',
    difficulty: 'easy',
    description: `输入一个浮点数，输出保留两位小数结果。
输入：一行 x。
输出：toFixed(2) 字符串。`,
    hints: ['toFixed 返回字符串'],
    testCases: [
      { input: '3.14159', expectedOutput: '3.14' },
      { input: '2', expectedOutput: '2.00', hidden: true },
    ],
  }),
  m({
    id: 6,
    title: '模板字符串名片',
    difficulty: 'easy',
    description: `输入 name age city，按格式输出：
Name: xxx, Age: yyy, City: zzz`,
    hints: ['使用模板字符串'],
    testCases: [
      { input: 'Alice 18 Shanghai', expectedOutput: 'Name: Alice, Age: 18, City: Shanghai' },
      { input: 'Bob 20 Beijing', expectedOutput: 'Name: Bob, Age: 20, City: Beijing', hidden: true },
    ],
  }),
  m({
    id: 7,
    title: '闰年判断',
    difficulty: 'easy',
    description: `判断年份是否闰年。
规则：能被400整除，或能被4整除且不能被100整除。`,
    hints: ['用布尔表达式组合条件'],
    testCases: [
      { input: '2024', expectedOutput: 'true' },
      { input: '1900', expectedOutput: 'false', hidden: true },
    ],
  }),
  m({
    id: 8,
    title: 'switch 四则运算器',
    difficulty: 'easy',
    description: `输入 a op b，其中 op 属于 + - * /。
输出运算结果；若除数为 0 输出 ERROR。`,
    hints: ['switch 分支处理四种操作'],
    testCases: [
      { input: '8 * 7', expectedOutput: '56' },
      { input: '1 / 0', expectedOutput: 'ERROR', hidden: true },
    ],
  }),
  m({
    id: 9,
    title: '1 到 n 求和',
    difficulty: 'easy',
    description: `输入整数 n，输出 1+2+...+n。
输入：n。
输出：和。`,
    hints: ['for 循环或公式 n*(n+1)/2'],
    testCases: [
      { input: '10', expectedOutput: '55' },
      { input: '1', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 10,
    title: '阶乘',
    difficulty: 'easy',
    description: `输入 n，输出 n!。
约束：0<=n<=12。`,
    hints: ['初始化结果为 1'],
    testCases: [
      { input: '5', expectedOutput: '120' },
      { input: '0', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 11,
    title: '数组最大最小值',
    difficulty: 'easy',
    description: `给定数组，输出最大值和最小值。
输入：n 与 n 个整数。
输出：max min。`,
    hints: ['可用遍历或 Math.max/min'],
    testCases: [
      { input: '5\n1 3 2 9 4', expectedOutput: '9 1' },
      { input: '3\n-5 -1 -9', expectedOutput: '-1 -9', hidden: true },
    ],
  }),
  m({
    id: 12,
    title: '数组偶数过滤',
    difficulty: 'easy',
    description: `输出数组中的所有偶数（保持顺序）。
若没有偶数，输出 EMPTY。`,
    hints: ['filter(v => v % 2 === 0)'],
    testCases: [
      { input: '6\n1 2 3 4 5 6', expectedOutput: '2 4 6' },
      { input: '3\n1 3 5', expectedOutput: 'EMPTY', hidden: true },
    ],
  }),
  m({
    id: 13,
    title: '数组去重并保持顺序',
    difficulty: 'easy',
    description: `删除重复元素，仅保留第一次出现，顺序不变。`,
    hints: ['Set 记录是否已出现'],
    testCases: [
      { input: '7\n1 2 2 3 1 4 3', expectedOutput: '1 2 3 4' },
      { input: '5\n5 5 5 5 5', expectedOutput: '5', hidden: true },
    ],
  }),
  m({
    id: 14,
    title: '数组指定位置交换',
    difficulty: 'easy',
    description: `交换数组下标 i、j 两个位置的元素并输出新数组。`,
    hints: ['可用解构赋值交换'],
    testCases: [
      { input: '4\n1 2 3 4\n1 3', expectedOutput: '1 4 3 2' },
      { input: '3\n9 8 7\n0 2', expectedOutput: '7 8 9', hidden: true },
    ],
  }),
  m({
    id: 15,
    title: '字符串反转',
    difficulty: 'easy',
    description: `输入一个字符串，输出反转后的字符串。`,
    hints: ['split-reverse-join'],
    testCases: [
      { input: 'typescript', expectedOutput: 'tpircsepyt' },
      { input: 'a', expectedOutput: 'a', hidden: true },
    ],
  }),
  m({
    id: 16,
    title: '元音字母计数',
    difficulty: 'easy',
    description: `统计字符串中 a/e/i/o/u 的数量（忽略大小写）。`,
    hints: ['先 toLowerCase 再判断'],
    testCases: [
      { input: 'TypeScript Online', expectedOutput: '5' },
      { input: 'rhythm', expectedOutput: '0', hidden: true },
    ],
  }),
  m({
    id: 17,
    title: '句子缩写',
    difficulty: 'easy',
    description: `提取每个单词首字母并转大写，拼接输出。`,
    hints: ['split 后取 word[0]'],
    testCases: [
      { input: 'random access memory', expectedOutput: 'RAM' },
      { input: 'as soon as possible', expectedOutput: 'ASAP', hidden: true },
    ],
  }),
  m({
    id: 18,
    title: '字符频次统计',
    difficulty: 'easy',
    description: `统计字符串中每个字符出现次数，按字符字典序输出。
格式：char:count 每行一条。`,
    hints: ['Map 计数后排序输出'],
    testCases: [
      { input: 'abca', expectedOutput: 'a:2\nb:1\nc:1' },
      { input: 'zz', expectedOutput: 'z:2', hidden: true },
    ],
  }),
  m({
    id: 19,
    title: '集合存在性查询',
    difficulty: 'easy',
    description: `给定集合和若干查询值，判断是否存在。输出 true/false。`,
    hints: ['Set 查询 O(1)'],
    testCases: [
      { input: '5 3\n1 3 5 7 9\n3 4 9', expectedOutput: 'true\nfalse\ntrue' },
      { input: '3 2\n2 2 2\n1 2', expectedOutput: 'false\ntrue', hidden: true },
    ],
  }),
  m({
    id: 20,
    title: '键值对求和',
    difficulty: 'easy',
    description: `输入 n 行 key value，统计 value 总和。
key 可重复，仅求所有 value 之和。`,
    hints: ['无需真的构建对象，直接累计 value'],
    testCases: [
      { input: '3\na 1\nb 2\na 3', expectedOutput: '6' },
      { input: '2\nx -5\ny 9', expectedOutput: '4', hidden: true },
    ],
  }),
  m({
    id: 21,
    title: '按长度再字典序排序',
    difficulty: 'easy',
    description: `将 n 个字符串按“长度升序、长度相同按字典序”排序并逐行输出。`,
    hints: ['sort 比较器两级比较'],
    testCases: [
      { input: '4\nbb\naaa\na\nab', expectedOutput: 'a\nab\nbb\naaa' },
      { input: '3\ncat\ncar\na', expectedOutput: 'a\ncar\ncat', hidden: true },
    ],
  }),
  m({
    id: 22,
    title: '矩阵转置',
    difficulty: 'easy',
    description: `输出 n*m 矩阵的转置矩阵。`,
    hints: ['双层循环按列取值'],
    testCases: [
      { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '1 4\n2 5\n3 6' },
      { input: '1 2\n7 8', expectedOutput: '7\n8', hidden: true },
    ],
  }),
  m({
    id: 23,
    title: '前缀和区间查询（入门）',
    difficulty: 'easy',
    description: `多次查询数组区间和。
输入 l r 为 1-based。`,
    hints: ['pre[r]-pre[l-1]'],
    testCases: [
      { input: '5 2\n1 2 3 4 5\n1 3\n2 5', expectedOutput: '6\n14' },
      { input: '1 1\n9\n1 1', expectedOutput: '9', hidden: true },
    ],
  }),
  m({
    id: 24,
    title: '队列模拟',
    difficulty: 'easy',
    description: `支持 in x 与 out 操作，队空 out 输出 EMPTY。`,
    hints: ['数组 + 头指针'],
    testCases: [
      { input: '5\nin 1\nin 2\nout\nin 3\nout', expectedOutput: '1\n2' },
      { input: '2\nout\nout', expectedOutput: 'EMPTY\nEMPTY', hidden: true },
    ],
  }),
  m({
    id: 25,
    title: '括号匹配（栈入门）',
    difficulty: 'easy',
    description: `判断 ()[]{} 是否有效匹配。`,
    hints: ['栈顶匹配右括号'],
    testCases: [
      { input: '([]){}', expectedOutput: 'true' },
      { input: '([)]', expectedOutput: 'false', hidden: true },
    ],
  }),
  m({
    id: 26,
    title: '日期格式化',
    difficulty: 'easy',
    description: `输入 yyyy m d，输出 YYYY-MM-DD（不足两位补 0）。`,
    hints: ['padStart(2, "0")'],
    testCases: [
      { input: '2026 4 9', expectedOutput: '2026-04-09' },
      { input: '2000 12 31', expectedOutput: '2000-12-31', hidden: true },
    ],
  }),
  m({
    id: 27,
    title: '成绩等级统计',
    difficulty: 'easy',
    description: `统计成绩分布 A/B/C/D/F。
A:[90,100] B:[80,89] C:[70,79] D:[60,69] F:[0,59]。`,
    hints: ['遍历一次分类计数'],
    testCases: [
      { input: '5\n95 82 77 61 40', expectedOutput: 'A 1\nB 1\nC 1\nD 1\nF 1' },
      { input: '3\n100 59 0', expectedOutput: 'A 1\nB 0\nC 0\nD 0\nF 2', hidden: true },
    ],
  }),
  m({
    id: 28,
    title: '图形面积（联合类型思维）',
    difficulty: 'easy',
    description: `输入图形类型与参数：
rectangle w h / circle r / triangle b h。
输出面积（两位小数）。`,
    hints: ['按类型分支处理'],
    testCases: [
      { input: 'rectangle 3 4', expectedOutput: '12.00' },
      { input: 'circle 1', expectedOutput: '3.14', hidden: true },
    ],
  }),
  m({
    id: 29,
    title: '加权平均绩点',
    difficulty: 'easy',
    description: `输入 n 门课的学分和绩点，计算加权 GPA，保留两位小数。`,
    hints: ['sum(credit*score)/sum(credit)'],
    testCases: [
      { input: '2\n3 4\n2 3', expectedOutput: '3.60' },
      { input: '1\n4 3.25', expectedOutput: '3.25', hidden: true },
    ],
  }),
  m({
    id: 30,
    title: '日志级别统计',
    difficulty: 'easy',
    description: `输入 n 行日志（INFO/WARN/ERROR 开头），统计 ERROR 行数。`,
    hints: ['startsWith("ERROR")'],
    testCases: [
      { input: '4\nINFO ok\nERROR boom\nWARN x\nERROR y', expectedOutput: '2' },
      { input: '2\nINFO a\nWARN b', expectedOutput: '0', hidden: true },
    ],
  }),

  // ========= TypeScript 学习区（31-50）=========
  m({
    id: 31,
    title: '面向对象：学生平均分',
    difficulty: 'easy',
    description: `模拟 Student 类：每个学生包含姓名和三科成绩，计算平均分。
输入 n 个学生数据后，按输入顺序输出每个学生 name、总分、平均分。`,
    hints: ['可先定义 Student 结构再计算', '平均分保留两位小数'],
    testCases: [
      { input: '2\nAlice 90 80 70\nBob 100 90 80', expectedOutput: 'Alice 240 80.00\nBob 270 90.00' },
      { input: '1\nTom 60 60 61', expectedOutput: 'Tom 181 60.33', hidden: true },
    ],
  }),
  m({
    id: 32,
    title: '面向对象：继承计算工资',
    difficulty: 'medium',
    description: `模拟 Employee 基类与 FullTime/PartTime 子类。
FT 工资=base+bonus；PT 工资=hours*rate。`,
    hints: ['根据类型分支计算', '金额统一保留两位小数'],
    testCases: [
      { input: '3\nFT 5000 800\nPT 20 35\nFT 4000 0', expectedOutput: '5800.00\n700.00\n4000.00' },
      { input: '1\nPT 8 12.5', expectedOutput: '100.00', hidden: true },
    ],
  }),
  m({
    id: 33,
    title: '面向对象：支付策略统计',
    difficulty: 'easy',
    description: `模拟支付接口 Payable，三种支付方式：ALI/WECHAT/CASH。
统计每种方式总金额并输出。`,
    hints: ['按支付方式累计金额', '输出顺序固定为 ALI WECHAT CASH'],
    testCases: [
      { input: '5\nALI 10.5\nWECHAT 20\nALI 9.5\nCASH 8\nWECHAT 1', expectedOutput: 'ALI 20.00\nWECHAT 21.00\nCASH 8.00' },
      { input: '2\nCASH 5\nCASH 2.5', expectedOutput: 'ALI 0.00\nWECHAT 0.00\nCASH 7.50', hidden: true },
    ],
  }),
  m({
    id: 34,
    title: '泛型容器（键值存取）',
    difficulty: 'easy',
    description: `模拟一个泛型仓库 Repository，支持 set/get。
按操作顺序执行，对每个 get 输出结果。`,
    hints: ['Map 存储键值'],
    testCases: [
      { input: '5\nset a 1\nset b 2\nget a\nset a 3\nget a', expectedOutput: '1\n3' },
      { input: '3\nget x\nset x 9\nget y', expectedOutput: 'NULL\nNULL', hidden: true },
    ],
  }),
  m({
    id: 35,
    title: '枚举状态统计',
    difficulty: 'easy',
    description: `状态枚举：0=PENDING,1=PROCESSING,2=DONE。
输入状态数组，统计三种状态出现次数。`,
    hints: ['准备三个计数器'],
    testCases: [
      { input: '6\n0 1 2 1 0 2', expectedOutput: 'PENDING 2\nPROCESSING 2\nDONE 2' },
      { input: '3\n2 2 2', expectedOutput: 'PENDING 0\nPROCESSING 0\nDONE 3', hidden: true },
    ],
  }),
  m({
    id: 36,
    title: '正则：邮箱格式校验',
    difficulty: 'easy',
    description: `使用正则表达式校验邮箱：
用户名允许字母数字._%+-，域名允许字母数字.-，后缀至少两位字母。`,
    hints: ['构造完整匹配正则 ^...$'],
    testCases: [
      { input: '3\na@b.com\nbad@@x.com\nu.ser+1@mail.co', expectedOutput: 'true\nfalse\ntrue' },
      { input: '2\nx@y\n1@a.cc', expectedOutput: 'false\ntrue', hidden: true },
    ],
  }),
  m({
    id: 37,
    title: '正则：提取数字片段',
    difficulty: 'easy',
    description: `从字符串中提取所有连续数字片段并按出现顺序输出。`,
    hints: ['使用全局匹配 /\\d+/g'],
    testCases: [
      { input: 'ab12cd003x9', expectedOutput: '12 003 9' },
      { input: 'no-number', expectedOutput: 'EMPTY', hidden: true },
    ],
  }),
  m({
    id: 38,
    title: '正则：日志级别解析',
    difficulty: 'easy',
    description: `日志行形如 [INFO] xxx、[ERROR] xxx。
统计 ERROR 行数量。`,
    hints: ['匹配 /^\\[ERROR\\]/'],
    testCases: [
      { input: '4\n[INFO] start\n[ERROR] failed\n[WARN] retry\n[ERROR] timeout', expectedOutput: '2' },
      { input: '2\nINFO bad format\n[ERROR] x', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 39,
    title: 'JSON：成绩对象平均值',
    difficulty: 'easy',
    description: `输入一个 JSON 数组，每个元素包含 score 字段。
输出 score 平均值（保留两位小数）。`,
    hints: ['JSON.parse 后遍历统计'],
    testCases: [
      { input: '[{"name":"a","score":90},{"name":"b","score":80}]', expectedOutput: '85.00' },
      { input: '[{"score":100}]', expectedOutput: '100.00', hidden: true },
    ],
  }),
  m({
    id: 40,
    title: 'JSON：配置浅合并',
    difficulty: 'easy',
    description: `输入两个 JSON 对象字符串，按 { ...a, ...b } 浅合并并输出。`,
    hints: ['后者同名键覆盖前者'],
    testCases: [
      { input: '{"port":3000,"debug":false}\n{"debug":true,"host":"127.0.0.1"}', expectedOutput: '{"port":3000,"debug":true,"host":"127.0.0.1"}' },
      { input: '{"a":1}\n{"a":2}', expectedOutput: '{"a":2}', hidden: true },
    ],
  }),
  m({
    id: 41,
    title: 'JSON：按 id 去重',
    difficulty: 'easy',
    description: `输入 JSON 数组对象（每个对象含 id），保留首次出现 id 的项。
输出去重后元素数量。`,
    hints: ['Set 记录已出现 id'],
    testCases: [
      { input: '[{"id":1},{"id":2},{"id":1},{"id":3}]', expectedOutput: '3' },
      { input: '[{"id":"a"},{"id":"a"}]', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 42,
    title: '文件读取模拟：行数统计',
    difficulty: 'easy',
    description: `将输入的多行文本视作文件内容，统计：
总行数、非空行数、总字符数。`,
    hints: ['空行即长度为 0 的行'],
    testCases: [
      { input: '3\nabc\n\nxy', expectedOutput: '3 2 5' },
      { input: '2\nhello\nworld', expectedOutput: '2 2 10', hidden: true },
    ],
  }),
  m({
    id: 43,
    title: '文件读取模拟：关键字检索',
    difficulty: 'easy',
    description: `输入关键字和多行文本，输出包含关键字的行号（1-based）。`,
    hints: ['用 includes 判断是否包含关键字'],
    testCases: [
      { input: 'ts\n4\ni love ts\njs only\nts and js\npython', expectedOutput: '1 3' },
      { input: 'go\n3\njava\npython\nrust', expectedOutput: 'NONE', hidden: true },
    ],
  }),
  m({
    id: 44,
    title: '文件读取模拟：CSV 列求和',
    difficulty: 'easy',
    description: `输入 CSV 表头和多行记录，统计 price 列总和。`,
    hints: ['先定位 price 列下标'],
    testCases: [
      { input: '3\nid,price,name\n1,10.5,a\n2,20,b\n3,0.5,c', expectedOutput: '31.00' },
      { input: '2\nname,price\nx,1\ny,2.5', expectedOutput: '3.50', hidden: true },
    ],
  }),
  m({
    id: 45,
    title: '文件读取模拟：路径规范化',
    difficulty: 'medium',
    description: `给定类 Unix 路径，规范化处理 //、.、..。`,
    hints: ['栈维护路径段'],
    testCases: [
      { input: '/a//b/./c/../d/', expectedOutput: '/a/b/d' },
      { input: '/../../x/y', expectedOutput: '/x/y', hidden: true },
    ],
  }),
  m({
    id: 46,
    title: '网络编程模拟：状态码统计',
    difficulty: 'easy',
    description: `输入一组 HTTP 状态码，统计 2xx/4xx/5xx 数量。`,
    hints: ['按区间 [200,300) [400,500) [500,600) 分类'],
    testCases: [
      { input: '6\n200 201 404 500 503 302', expectedOutput: '2xx 2\n4xx 1\n5xx 2' },
      { input: '3\n400 401 402', expectedOutput: '2xx 0\n4xx 3\n5xx 0', hidden: true },
    ],
  }),
  m({
    id: 47,
    title: '网络编程模拟：请求成功率',
    difficulty: 'easy',
    description: `每条请求记录包含 ok(0/1) 与 latency(ms)。
输出成功率与成功请求平均延迟。`,
    hints: ['成功率=成功数/总数*100', '平均延迟仅统计成功请求'],
    testCases: [
      { input: '4\n1 100\n0 500\n1 300\n1 200', expectedOutput: '75.00%\n200.00' },
      { input: '2\n0 10\n0 20', expectedOutput: '0.00%\n0.00', hidden: true },
    ],
  }),
  m({
    id: 48,
    title: '网络编程模拟：滑动窗口限流计数',
    difficulty: 'medium',
    description: `给定窗口大小 w（秒）和请求时间戳序列，
对每个请求输出“当前请求及之前 w 秒内”的请求数。`,
    hints: ['双指针维护窗口左边界'],
    testCases: [
      { input: '3 6\n1 2 3 7 8 9', expectedOutput: '1 2 3 1 2 3' },
      { input: '5 5\n1 1 1 6 6', expectedOutput: '1 2 3 4 5', hidden: true },
    ],
  }),
  m({
    id: 49,
    title: '事件总线模拟：事件计数',
    difficulty: 'easy',
    description: `输入一批事件名，模拟事件总线发布，统计每种事件触发次数。`,
    hints: ['Map 计数后按 key 排序输出'],
    testCases: [
      { input: '5\nlogin\nclick\nlogin\nscroll\nclick', expectedOutput: 'click:2\nlogin:2\nscroll:1' },
      { input: '1\nopen', expectedOutput: 'open:1', hidden: true },
    ],
  }),
  m({
    id: 50,
    title: '异步任务队列模拟',
    difficulty: 'medium',
    description: `输入 n 个任务耗时，模拟串行执行队列。
输出总耗时与最长单任务耗时。`,
    hints: ['总耗时为求和，最长耗时为最大值'],
    testCases: [
      { input: '5\n10 20 5 8 7', expectedOutput: '50 20' },
      { input: '1\n99', expectedOutput: '99 99', hidden: true },
    ],
  }),

  // ========= 算法区（51-100）=========
  m({
    id: 51,
    title: '最大公约数与最小公倍数',
    difficulty: 'easy',
    description: `输入两个正整数，输出 gcd 与 lcm。`,
    hints: ['欧几里得算法'],
    testCases: [
      { input: '12 18', expectedOutput: '6 36' },
      { input: '7 5', expectedOutput: '1 35', hidden: true },
    ],
  }),
  m({
    id: 52,
    title: '快速幂取模',
    difficulty: 'medium',
    description: `计算 a^b mod m。`,
    hints: ['二进制快速幂'],
    testCases: [
      { input: '2 10 1000', expectedOutput: '24' },
      { input: '3 0 7', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 53,
    title: '素数计数',
    difficulty: 'medium',
    description: `统计不大于 n 的素数个数。`,
    hints: ['埃氏筛'],
    testCases: [
      { input: '10', expectedOutput: '4' },
      { input: '1', expectedOutput: '0', hidden: true },
    ],
  }),
  m({
    id: 54,
    title: '质因数分解',
    difficulty: 'medium',
    description: `将正整数 n 分解为质因数，按从小到大输出（空格分隔）。`,
    hints: ['试除到 sqrt(n)'],
    testCases: [
      { input: '60', expectedOutput: '2 2 3 5' },
      { input: '13', expectedOutput: '13', hidden: true },
    ],
  }),
  m({
    id: 55,
    title: '阶乘尾零个数',
    difficulty: 'medium',
    description: `给定 n，求 n! 末尾 0 的个数。`,
    hints: ['统计因子 5 的数量'],
    testCases: [
      { input: '25', expectedOutput: '6' },
      { input: '10', expectedOutput: '2', hidden: true },
    ],
  }),
  m({
    id: 56,
    title: '斐波那契取模',
    difficulty: 'medium',
    description: `求第 n 项 Fibonacci（F1=1,F2=1）对 1e9+7 取模结果。`,
    hints: ['迭代 DP'],
    testCases: [
      { input: '10', expectedOutput: '55' },
      { input: '50', expectedOutput: '586268941', hidden: true },
    ],
  }),
  m({
    id: 57,
    title: '最小花费爬楼梯',
    difficulty: 'medium',
    description: `每阶有 cost，起点可在 0 或 1，求到楼顶最小花费。`,
    hints: ['DP 转移 min(dp[i-1],dp[i-2])+cost[i]'],
    testCases: [
      { input: '3\n10 15 20', expectedOutput: '15' },
      { input: '10\n1 100 1 1 1 100 1 1 100 1', expectedOutput: '6', hidden: true },
    ],
  }),
  m({
    id: 58,
    title: '打家劫舍 I',
    difficulty: 'medium',
    description: `不能偷相邻房屋，求可偷最大金额。`,
    hints: ['状态压缩 DP'],
    testCases: [
      { input: '4\n1 2 3 1', expectedOutput: '4' },
      { input: '5\n2 7 9 3 1', expectedOutput: '12', hidden: true },
    ],
  }),
  m({
    id: 59,
    title: '打家劫舍 II（环形）',
    difficulty: 'medium',
    description: `房屋首尾相邻，求最大可偷金额。`,
    hints: ['拆成两段：不选首/不选尾'],
    testCases: [
      { input: '3\n2 3 2', expectedOutput: '3' },
      { input: '4\n1 2 3 1', expectedOutput: '4', hidden: true },
    ],
  }),
  m({
    id: 60,
    title: '子集和可达',
    difficulty: 'medium',
    description: `给定数组和 target，判断是否存在子集和等于 target。`,
    hints: ['0/1 背包布尔 DP'],
    testCases: [
      { input: '5 11\n1 5 9 2 7', expectedOutput: 'true' },
      { input: '3 10\n3 4 8', expectedOutput: 'false', hidden: true },
    ],
  }),
  m({
    id: 61,
    title: '组合数 C(n,k)',
    difficulty: 'medium',
    description: `计算组合数 C(n,k)（0<=k<=n<=1000），对 1e9+7 取模。`,
    hints: ['杨辉三角或逆元'],
    testCases: [
      { input: '5 2', expectedOutput: '10' },
      { input: '10 0', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 62,
    title: '全排列数量',
    difficulty: 'easy',
    description: `给定 n，输出 n!（表示 n 个不同元素的排列数量）。`,
    hints: ['循环乘法'],
    testCases: [
      { input: '4', expectedOutput: '24' },
      { input: '1', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 63,
    title: 'N 皇后解数',
    difficulty: 'hard',
    description: `给定 n，输出 n 皇后问题解的数量。`,
    hints: ['回溯 + 列/对角线剪枝'],
    testCases: [
      { input: '4', expectedOutput: '2' },
      { input: '1', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 64,
    title: '岛屿数量',
    difficulty: 'medium',
    description: `0/1 网格中，统计由上下左右连接的 1 块数量。`,
    hints: ['DFS/BFS 淹没连通块'],
    testCases: [
      { input: '3 3\n1 1 0\n0 1 0\n1 0 1', expectedOutput: '3' },
      { input: '2 2\n1 1\n1 1', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 65,
    title: '网格最短路（四方向）',
    difficulty: 'medium',
    description: `0 表示可走，1 表示障碍，求左上到右下最短步数，不可达输出 -1。`,
    hints: ['BFS 分层最短路'],
    testCases: [
      { input: '3 3\n0 0 0\n1 1 0\n0 0 0', expectedOutput: '4' },
      { input: '2 2\n0 1\n1 0', expectedOutput: '-1', hidden: true },
    ],
  }),
  m({
    id: 66,
    title: '课程表可完成性',
    difficulty: 'medium',
    description: `给定有向图先修关系，判断是否存在环；无环则可完成。`,
    hints: ['拓扑排序统计入度'],
    testCases: [
      { input: '2 1\n1 0', expectedOutput: 'true' },
      { input: '2 2\n1 0\n0 1', expectedOutput: 'false', hidden: true },
    ],
  }),
  m({
    id: 67,
    title: '并查集连通块数量',
    difficulty: 'medium',
    description: `给定 n 个点和 m 条无向边，输出连通块数量。`,
    hints: ['并查集 union/find'],
    testCases: [
      { input: '5 2\n1 2\n3 4', expectedOutput: '3' },
      { input: '4 3\n1 2\n2 3\n3 4', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 68,
    title: '最小生成树权值（Kruskal）',
    difficulty: 'hard',
    description: `给定带权无向图，求最小生成树总权值；若不连通输出 -1。`,
    hints: ['边排序 + 并查集'],
    testCases: [
      { input: '4 5\n1 2 1\n2 3 2\n3 4 3\n1 4 10\n2 4 4', expectedOutput: '6' },
      { input: '3 1\n1 2 5', expectedOutput: '-1', hidden: true },
    ],
  }),
  m({
    id: 69,
    title: 'Dijkstra 最短路',
    difficulty: 'hard',
    description: `给定非负权有向图，求 1 到 n 的最短距离，不可达输出 -1。`,
    hints: ['优先队列优化 Dijkstra'],
    testCases: [
      { input: '4 4\n1 2 1\n2 3 2\n1 3 5\n3 4 1', expectedOutput: '4' },
      { input: '3 1\n1 2 2', expectedOutput: '-1', hidden: true },
    ],
  }),
  m({
    id: 70,
    title: 'KMP 首次匹配位置',
    difficulty: 'medium',
    description: `给定文本串和模式串，输出模式串首次出现下标（0-based），不存在 -1。`,
    hints: ['构建 next/lps 数组'],
    testCases: [
      { input: 'ababcabcacbab\nabcac', expectedOutput: '5' },
      { input: 'aaaaa\nbba', expectedOutput: '-1', hidden: true },
    ],
  }),
  m({
    id: 71,
    title: '字符串游程压缩',
    difficulty: 'easy',
    description: `连续相同字符压缩为 字符+次数。例 aaabb -> a3b2。`,
    hints: ['双指针统计连续段'],
    testCases: [
      { input: 'aaabbc', expectedOutput: 'a3b2c1' },
      { input: 'a', expectedOutput: 'a1', hidden: true },
    ],
  }),
  m({
    id: 72,
    title: '最小覆盖子串长度',
    difficulty: 'hard',
    description: `给定 s 与 t，求覆盖 t 全部字符的最短子串长度，不存在输出 0。`,
    hints: ['滑动窗口 + 计数差'],
    testCases: [
      { input: 'ADOBECODEBANC\nABC', expectedOutput: '4' },
      { input: 'a\naa', expectedOutput: '0', hidden: true },
    ],
  }),
  m({
    id: 73,
    title: '异位词判断',
    difficulty: 'easy',
    description: `判断两个字符串是否互为异位词。`,
    hints: ['字符计数比较'],
    testCases: [
      { input: 'anagram\nnagaram', expectedOutput: 'true' },
      { input: 'rat\ncar', expectedOutput: 'false', hidden: true },
    ],
  }),
  m({
    id: 74,
    title: '字符串解码',
    difficulty: 'medium',
    description: `解码形如 k[encoded] 的字符串。`,
    hints: ['栈保存次数与前缀'],
    testCases: [
      { input: '3[a2[c]]', expectedOutput: 'accaccacc' },
      { input: '2[abc]3[cd]ef', expectedOutput: 'abcabccdcdcdef', hidden: true },
    ],
  }),
  m({
    id: 75,
    title: '逆波兰表达式求值',
    difficulty: 'medium',
    description: `给定 RPN 表达式，计算结果。除法向 0 截断。`,
    hints: ['栈处理运算符'],
    testCases: [
      { input: '5\n2 1 + 3 *', expectedOutput: '9' },
      { input: '5\n4 13 5 / +', expectedOutput: '6', hidden: true },
    ],
  }),
  m({
    id: 76,
    title: '下一个更大元素',
    difficulty: 'medium',
    description: `对每个元素，找右侧第一个更大值；不存在输出 -1。`,
    hints: ['单调栈'],
    testCases: [
      { input: '4\n2 1 2 4', expectedOutput: '4 2 4 -1' },
      { input: '3\n3 2 1', expectedOutput: '-1 -1 -1', hidden: true },
    ],
  }),
  m({
    id: 77,
    title: '每日温度',
    difficulty: 'medium',
    description: `给定温度数组，输出每一天距离下一次更高温度的天数。`,
    hints: ['单调递减栈存下标'],
    testCases: [
      { input: '8\n73 74 75 71 69 72 76 73', expectedOutput: '1 1 4 2 1 1 0 0' },
      { input: '3\n30 20 10', expectedOutput: '0 0 0', hidden: true },
    ],
  }),
  m({
    id: 78,
    title: '柱状图最大矩形',
    difficulty: 'hard',
    description: `给定柱高数组，求最大矩形面积。`,
    hints: ['单调栈求左右边界'],
    testCases: [
      { input: '6\n2 1 5 6 2 3', expectedOutput: '10' },
      { input: '2\n2 4', expectedOutput: '4', hidden: true },
    ],
  }),
  m({
    id: 79,
    title: '接雨水',
    difficulty: 'hard',
    description: `给定高度数组，计算可接雨水总量。`,
    hints: ['双指针或单调栈'],
    testCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6' },
      { input: '3\n3 2 1', expectedOutput: '0', hidden: true },
    ],
  }),
  m({
    id: 80,
    title: '最多不重叠区间',
    difficulty: 'medium',
    description: `从 n 个区间中选最多互不重叠区间数量。`,
    hints: ['按右端点排序贪心'],
    testCases: [
      { input: '3\n1 2\n2 3\n3 4', expectedOutput: '3' },
      { input: '3\n1 3\n2 4\n3 5', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 81,
    title: '最少会议室数量',
    difficulty: 'medium',
    description: `给定会议时间区间，求同时进行会议的最大数量。`,
    hints: ['开始结束时间排序双指针'],
    testCases: [
      { input: '3\n0 30\n5 10\n15 20', expectedOutput: '2' },
      { input: '2\n7 10\n2 4', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 82,
    title: '活动选择',
    difficulty: 'easy',
    description: `在互斥活动中选择最多数量（区间不重叠）。`,
    hints: ['经典结束时间贪心'],
    testCases: [
      { input: '4\n1 3\n2 5\n4 7\n6 8', expectedOutput: '2' },
      { input: '3\n1 2\n2 3\n3 4', expectedOutput: '3', hidden: true },
    ],
  }),
  m({
    id: 83,
    title: '前 K 大元素',
    difficulty: 'medium',
    description: `输出数组中前 k 大元素（降序）。`,
    hints: ['最小堆维护 k 个元素'],
    testCases: [
      { input: '6 3\n3 2 1 5 6 4', expectedOutput: '6 5 4' },
      { input: '5 1\n9 8 7 6 5', expectedOutput: '9', hidden: true },
    ],
  }),
  m({
    id: 84,
    title: '数据流中位数（离线）',
    difficulty: 'medium',
    description: `输入一个序列，逐步插入并输出每一步中位数（偶数取较小者）。`,
    hints: ['双堆或平衡有序结构'],
    testCases: [
      { input: '5\n2 1 5 7 2', expectedOutput: '2 1 2 2 2' },
      { input: '3\n1 2 3', expectedOutput: '1 1 2', hidden: true },
    ],
  }),
  m({
    id: 85,
    title: '逆序对数量',
    difficulty: 'hard',
    description: `统计数组中的逆序对个数。`,
    hints: ['归并排序计数'],
    testCases: [
      { input: '5\n7 5 6 4', expectedOutput: '5' },
      { input: '4\n1 2 3 4', expectedOutput: '0', hidden: true },
    ],
  }),
  m({
    id: 86,
    title: '归并排序',
    difficulty: 'easy',
    description: `将数组按升序排序输出。`,
    hints: ['实现 merge sort'],
    testCases: [
      { input: '5\n5 2 3 1 4', expectedOutput: '1 2 3 4 5' },
      { input: '3\n-1 -3 -2', expectedOutput: '-3 -2 -1', hidden: true },
    ],
  }),
  m({
    id: 87,
    title: '第 K 小元素',
    difficulty: 'medium',
    description: `给定数组与 k，输出第 k 小元素（1-based）。`,
    hints: ['快速选择或排序'],
    testCases: [
      { input: '6 2\n3 2 1 5 6 4', expectedOutput: '2' },
      { input: '4 4\n9 8 7 6', expectedOutput: '9', hidden: true },
    ],
  }),
  m({
    id: 88,
    title: 'LRU 缓存模拟',
    difficulty: 'hard',
    description: `容量 cap，支持 get k / put k v。get 输出值，不存在输出 -1。`,
    hints: ['双向链表 + 哈希 或 Map 顺序特性'],
    testCases: [
      { input: '2 5\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2', expectedOutput: '1\n-1' },
      { input: '1 3\nput 1 1\nput 2 2\nget 1', expectedOutput: '-1', hidden: true },
    ],
  }),
  m({
    id: 89,
    title: 'Trie 前缀计数',
    difficulty: 'medium',
    description: `插入若干单词后，回答若干前缀出现次数。`,
    hints: ['前缀树节点维护通过计数'],
    testCases: [
      { input: '3 2\napple\napp\nape\nap\napp', expectedOutput: '3\n2' },
      { input: '2 1\ncat\ndog\nca', expectedOutput: '1', hidden: true },
    ],
  }),
  m({
    id: 90,
    title: '单词搜索（网格 DFS）',
    difficulty: 'hard',
    description: `给定字符网格和单词，判断是否可由相邻格（上下左右）组成，格子不可重复使用。`,
    hints: ['回溯 + visited'],
    testCases: [
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED', expectedOutput: 'true' },
      { input: '2 2\nA B\nC D\nABCD', expectedOutput: 'false', hidden: true },
    ],
  }),
  m({
    id: 91,
    title: '二叉树三种遍历',
    difficulty: 'medium',
    description: `输入二叉树层序（null 表空），输出前序/中序/后序遍历。`,
    hints: ['递归遍历'],
    testCases: [
      { input: '7\n1 2 3 null 4 5 6', expectedOutput: '1 2 4 3 5 6\n2 4 1 5 3 6\n4 2 5 6 3 1' },
      { input: '1\n1', expectedOutput: '1\n1\n1', hidden: true },
    ],
  }),
  m({
    id: 92,
    title: '二叉树层序遍历',
    difficulty: 'easy',
    description: `输入二叉树层序，按层输出节点值（每层一行）。`,
    hints: ['队列 BFS'],
    testCases: [
      { input: '7\n3 9 20 null null 15 7', expectedOutput: '3\n9 20\n15 7' },
      { input: '0', expectedOutput: '', hidden: true },
    ],
  }),
  m({
    id: 93,
    title: '二叉树最近公共祖先',
    difficulty: 'medium',
    description: `给定二叉树和两个节点值 p,q，输出最近公共祖先值。`,
    hints: ['递归返回命中状态'],
    testCases: [
      { input: '7\n3 5 1 6 2 0 8\n5 1', expectedOutput: '3' },
      { input: '7\n3 5 1 6 2 0 8\n6 2', expectedOutput: '5', hidden: true },
    ],
  }),
  m({
    id: 94,
    title: '平衡二叉树判断',
    difficulty: 'medium',
    description: `判断二叉树是否高度平衡。`,
    hints: ['后序返回高度，失衡返回 -1'],
    testCases: [
      { input: '5\n3 9 20 null null 15 7', expectedOutput: 'true' },
      { input: '7\n1 2 null 3 null 4 null', expectedOutput: 'false', hidden: true },
    ],
  }),
  m({
    id: 95,
    title: '股票买卖一次最大利润',
    difficulty: 'easy',
    description: `给定每日价格，只允许买卖一次，求最大利润。`,
    hints: ['维护历史最低价'],
    testCases: [
      { input: '6\n7 1 5 3 6 4', expectedOutput: '5' },
      { input: '5\n7 6 4 3 1', expectedOutput: '0', hidden: true },
    ],
  }),
  m({
    id: 96,
    title: '股票买卖多次最大利润',
    difficulty: 'easy',
    description: `可进行多次交易（不能同时持有多股），求最大总利润。`,
    hints: ['累加所有上升差值'],
    testCases: [
      { input: '6\n7 1 5 3 6 4', expectedOutput: '7' },
      { input: '5\n1 2 3 4 5', expectedOutput: '4', hidden: true },
    ],
  }),
  m({
    id: 97,
    title: '最长回文子串长度',
    difficulty: 'medium',
    description: `输出字符串中最长回文子串长度。`,
    hints: ['中心扩展或 DP'],
    testCases: [
      { input: 'babad', expectedOutput: '3' },
      { input: 'cbbd', expectedOutput: '2', hidden: true },
    ],
  }),
  m({
    id: 98,
    title: '最长回文子序列长度',
    difficulty: 'medium',
    description: `输出字符串最长回文子序列长度。`,
    hints: ['区间 DP'],
    testCases: [
      { input: 'bbbab', expectedOutput: '4' },
      { input: 'cbbd', expectedOutput: '2', hidden: true },
    ],
  }),
  m({
    id: 99,
    title: '分割等和子集',
    difficulty: 'medium',
    description: `判断数组能否分成两个和相等的子集。`,
    hints: ['转化为 target=sum/2 的 0/1 背包'],
    testCases: [
      { input: '4\n1 5 11 5', expectedOutput: 'true' },
      { input: '4\n1 2 3 5', expectedOutput: 'false', hidden: true },
    ],
  }),
  m({
    id: 100,
    title: '最短子数组和至少 K',
    difficulty: 'hard',
    description: `给定数组和整数 K，求和至少为 K 的最短连续子数组长度，不存在输出 -1。`,
    hints: ['前缀和 + 单调队列'],
    testCases: [
      { input: '3 3\n2 -1 2', expectedOutput: '3' },
      { input: '3 4\n1 2 1', expectedOutput: '-1', hidden: true },
    ],
  }),
];
