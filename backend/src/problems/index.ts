import { Problem } from '../types/problem';
import { acmStarterCode } from './starterCode';

export const problems: Problem[] = [
  {
    id: 1,
    title: 'A+B 问题 II',
    difficulty: 'easy',
    description: `给定 t 组整数对 (a,b)，输出每组和。
输入格式：
第一行一个整数 t；接下来 t 行每行两个整数 a b。
输出格式：
输出 t 行，每行一个结果。
约束：1 <= t <= 10^5。`,
    starterCode: acmStarterCode,
    hints: ['先读取 t，再循环读取每组数据', '注意输出按行拼接后一次性打印更高效'],
    testCases: [
      { input: '2\n1 2\n3 4', expectedOutput: '3\n7' },
      { input: '3\n10 20\n30 40\n1 1', expectedOutput: '30\n70\n2' },
      { input: '1\n-3 -7', expectedOutput: '-10', hidden: true },
      { input: '4\n0 0\n1 -1\n99 1\n-5 3', expectedOutput: '0\n0\n100\n-2', hidden: true }
    ]
  },
  {
    id: 2,
    title: '遇 0 0 终止',
    difficulty: 'easy',
    description: `连续读取多组 (a,b)，遇到 "0 0" 立即结束。
输入格式：
若干行整数 a b。
输出格式：
对终止前的每组数据输出一行 a+b。`,
    starterCode: acmStarterCode,
    hints: ['使用 while 循环逐组处理', '读到 0 0 后不要再处理后续输入'],
    testCases: [
      { input: '1 2\n3 4\n0 0\n9 9', expectedOutput: '3\n7' },
      { input: '0 0\n1 2', expectedOutput: '' },
      { input: '2 2\n0 0', expectedOutput: '4', hidden: true },
      { input: '-1 1\n5 5\n0 0', expectedOutput: '0\n10', hidden: true }
    ]
  },
  {
    id: 3,
    title: '队列模拟',
    difficulty: 'easy',
    description: `实现简单队列，支持两种操作：
in x：将 x 入队；out：出队并输出队头值。
若队列为空时执行 out，输出 EMPTY。
输入格式：第一行 m，后续 m 行为操作。`,
    starterCode: acmStarterCode,
    hints: ['可用数组 + 头指针提升性能', '仅在 out 时输出'],
    testCases: [
      { input: '5\nin 1\nin 2\nout\nin 3\nout', expectedOutput: '1\n2' },
      { input: '3\nout\nin 5\nout', expectedOutput: 'EMPTY\n5' },
      { input: '6\nin 7\nout\nout\nin 8\nin 9\nout', expectedOutput: '7\nEMPTY\n8', hidden: true },
      { input: '4\nin -1\nin -2\nout\nout', expectedOutput: '-1\n-2', hidden: true }
    ]
  },
  {
    id: 4,
    title: '集合查询',
    difficulty: 'easy',
    description: `给定一个整数集合和若干查询值，判断是否存在。
输入格式：
第一行 n q；第二行 n 个整数（可重复）；第三行 q 个查询值。
输出格式：
输出 q 行，存在输出 true，否则 false。`,
    starterCode: acmStarterCode,
    hints: ['使用 Set 存储集合元素', '重复元素只影响输入，不影响查询结果'],
    testCases: [
      { input: '5 4\n1 3 5 7 9\n3 4 9 10', expectedOutput: 'true\nfalse\ntrue\nfalse' },
      { input: '3 3\n2 4 6\n6 5 2', expectedOutput: 'true\nfalse\ntrue' },
      { input: '4 5\n1 1 2 2\n1 2 3 0 1', expectedOutput: 'true\ntrue\nfalse\nfalse\ntrue', hidden: true },
      { input: '1 2\n-10\n-10 10', expectedOutput: 'true\nfalse', hidden: true }
    ]
  },
  {
    id: 5,
    title: '前缀和区间查询',
    difficulty: 'medium',
    description: `给定数组并回答多次区间和查询。
输入格式：
第一行 n q；第二行 n 个整数；接着 q 行 l r（1-based，且 l<=r）。
输出格式：
每个查询输出一行区间和。`,
    starterCode: acmStarterCode,
    hints: ['构建前缀和 pre，区间和为 pre[r]-pre[l-1]'],
    testCases: [
      { input: '5 3\n1 2 3 4 5\n1 3\n2 5\n4 4', expectedOutput: '6\n14\n4' },
      { input: '4 2\n10 20 30 40\n1 4\n2 3', expectedOutput: '100\n50' },
      { input: '1 2\n99\n1 1\n1 1', expectedOutput: '99\n99', hidden: true },
      { input: '6 2\n-1 2 -3 4 -5 6\n1 6\n3 5', expectedOutput: '3\n-4', hidden: true }
    ]
  },
  {
    id: 6,
    title: '定长滑窗最大和',
    difficulty: 'medium',
    description: `给定数组和窗口长度 k，求所有长度为 k 的连续子数组中的最大和。
输入格式：
第一行 n k；第二行 n 个整数。
输出格式：
输出一个整数表示最大和。`,
    starterCode: acmStarterCode,
    hints: ['先算首个窗口和，再滑动更新'],
    testCases: [
      { input: '5 3\n1 2 3 4 5', expectedOutput: '12' },
      { input: '6 2\n-1 -2 -3 -4 -5 -6', expectedOutput: '-3' },
      { input: '4 4\n8 -1 3 2', expectedOutput: '12', hidden: true },
      { input: '7 3\n2 1 5 1 3 2 4', expectedOutput: '9', hidden: true }
    ]
  },
  {
    id: 7,
    title: '最大子段和',
    difficulty: 'medium',
    description: `给定长度为 n 的整数数组，求连续子数组的最大和。
输入格式：
第一行 n；第二行 n 个整数。
输出格式：
一个整数。`,
    starterCode: acmStarterCode,
    hints: ['使用 Kadane 算法，时间复杂度 O(n)'],
    testCases: [
      { input: '5\n-2 1 -3 4 -1', expectedOutput: '4' },
      { input: '6\n-2 -3 -1 -4 -6 -5', expectedOutput: '-1' },
      { input: '8\n1 -2 3 10 -4 7 2 -5', expectedOutput: '18', hidden: true },
      { input: '1\n9', expectedOutput: '9', hidden: true }
    ]
  },
  {
    id: 8,
    title: '斐波那契数列（取模）',
    difficulty: 'medium',
    description: `求第 n 个斐波那契数 F(n)（F1=1, F2=1），结果对 1e9+7 取模。
输入格式：一个整数 n。
输出格式：一个整数。
约束：1 <= n <= 10^7。`,
    starterCode: acmStarterCode,
    hints: ['使用迭代 DP，避免递归爆栈/超时'],
    testCases: [
      { input: '10', expectedOutput: '55' },
      { input: '1', expectedOutput: '1' },
      { input: '50', expectedOutput: '586268941', hidden: true },
      { input: '2', expectedOutput: '1', hidden: true }
    ]
  },
  {
    id: 9,
    title: '最大公约数与最小公倍数',
    difficulty: 'easy',
    description: `给定两个正整数 a,b，输出 gcd(a,b) 与 lcm(a,b)。
输入格式：一行两个整数 a b。
输出格式：一行两个整数，空格分隔。
保证结果在 64 位范围内。`,
    starterCode: acmStarterCode,
    hints: ['先用欧几里得算法求 gcd，再用 lcm = a / gcd * b'],
    testCases: [
      { input: '12 18', expectedOutput: '6 36' },
      { input: '7 5', expectedOutput: '1 35' },
      { input: '100 25', expectedOutput: '25 100', hidden: true },
      { input: '9 6', expectedOutput: '3 18', hidden: true }
    ]
  },
  {
    id: 10,
    title: '回文串判断（忽略符号）',
    difficulty: 'medium',
    description: `忽略大小写和非字母数字字符，判断字符串是否回文。
输入格式：一行字符串（可能含空格和标点）。
输出格式：true 或 false。`,
    starterCode: acmStarterCode,
    hints: ['先标准化字符串，再使用双指针判断'],
    testCases: [
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true' },
      { input: 'race a car', expectedOutput: 'false' },
      { input: '0P', expectedOutput: 'false', hidden: true },
      { input: 'No lemon, no melon', expectedOutput: 'true', hidden: true }
    ]
  },
  {
    id: 11,
    title: '括号合法性',
    difficulty: 'medium',
    description: `给定仅由 ()[]{} 组成的字符串，判断括号是否完整配对且顺序正确。
输入格式：一行字符串。
输出格式：true 或 false。`,
    starterCode: acmStarterCode,
    hints: ['使用栈保存左括号，遇到右括号时匹配栈顶'],
    testCases: [
      { input: '([]){}', expectedOutput: 'true' },
      { input: '([)]', expectedOutput: 'false' },
      { input: '{}[]()', expectedOutput: 'true', hidden: true },
      { input: '(((', expectedOutput: 'false', hidden: true }
    ]
  },
  {
    id: 12,
    title: '去重并保持顺序',
    difficulty: 'easy',
    description: `删除数组中的重复元素，仅保留第一次出现，且保持原顺序。
输入格式：第一行 n，第二行 n 个整数。
输出格式：去重后的数组（空格分隔）。`,
    starterCode: acmStarterCode,
    hints: ['用 Set 记录是否见过，首次出现才写入结果'],
    testCases: [
      { input: '7\n1 2 2 3 1 4 3', expectedOutput: '1 2 3 4' },
      { input: '5\n5 5 5 5 5', expectedOutput: '5' },
      { input: '6\n-1 -1 2 -1 2 3', expectedOutput: '-1 2 3', hidden: true },
      { input: '1\n99', expectedOutput: '99', hidden: true }
    ]
  },
  {
    id: 13,
    title: '矩阵转置',
    difficulty: 'easy',
    description: `输出 n*m 矩阵的转置矩阵（m*n）。
输入格式：
第一行 n m；后续 n 行每行 m 个整数。
输出格式：
输出 m 行，每行 n 个整数。`,
    starterCode: acmStarterCode,
    hints: ['按列遍历原矩阵构造每一行输出'],
    testCases: [
      { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '1 4\n2 5\n3 6' },
      { input: '1 4\n7 8 9 10', expectedOutput: '7\n8\n9\n10' },
      { input: '3 1\n5\n6\n7', expectedOutput: '5 6 7', hidden: true },
      { input: '2 2\n-1 0\n3 4', expectedOutput: '-1 3\n0 4', hidden: true }
    ]
  },
  {
    id: 14,
    title: '反转每个单词',
    difficulty: 'easy',
    description: `将句子中每个单词单独反转，单词顺序保持不变。
输入保证单词之间为单个空格。
输入格式：一行字符串。
输出格式：一行字符串。`,
    starterCode: acmStarterCode,
    hints: ['split(" ") 后 map(reverse) 再 join(" ")'],
    testCases: [
      { input: 'hello typescript', expectedOutput: 'olleh tpircsepyt' },
      { input: 'abc de', expectedOutput: 'cba ed' },
      { input: 'a', expectedOutput: 'a', hidden: true },
      { input: 'stack queue', expectedOutput: 'kcats eueuq', hidden: true }
    ]
  },
  {
    id: 15,
    title: '句子缩写',
    difficulty: 'easy',
    description: `提取每个英文单词首字母并转为大写，拼接为缩写。
输入格式：一行英文短语（单词间单空格）。
输出格式：一行缩写字符串。`,
    starterCode: acmStarterCode,
    hints: ['按空格分词，取首字符后 toUpperCase'],
    testCases: [
      { input: 'central processing unit', expectedOutput: 'CPU' },
      { input: 'random access memory', expectedOutput: 'RAM' },
      { input: 'as soon as possible', expectedOutput: 'ASAP', hidden: true },
      { input: 'hyper text transfer protocol', expectedOutput: 'HTTP', hidden: true }
    ]
  },
  {
    id: 16,
    title: '最高频字母',
    difficulty: 'easy',
    description: `找出字符串中出现次数最多的字母（忽略大小写，忽略非字母）。
若出现次数并列，输出字典序更小的字母。
输入格式：一行字符串。
输出格式：一个小写字母。`,
    starterCode: acmStarterCode,
    hints: ['先过滤出字母并转小写', '并列时比较字符大小'],
    testCases: [
      { input: 'TypeScript', expectedOutput: 't' },
      { input: 'aabbbbcc', expectedOutput: 'b' },
      { input: 'A!a?B,b', expectedOutput: 'a', hidden: true },
      { input: 'xyz', expectedOutput: 'x', hidden: true }
    ]
  },
  {
    id: 17,
    title: '打印正方形',
    difficulty: 'easy',
    description: `给定边长 n 和字符 ch，输出 n*n 的字符正方形。
输入格式：一行 n ch。
输出格式：n 行，每行 n 个字符 ch。`,
    starterCode: acmStarterCode,
    hints: ['循环 n 次输出 ch.repeat(n)'],
    testCases: [
      { input: '2 *', expectedOutput: '**\n**' },
      { input: '3 #', expectedOutput: '###\n###\n###' },
      { input: '1 A', expectedOutput: 'A', hidden: true },
      { input: '4 0', expectedOutput: '0000\n0000\n0000\n0000', hidden: true }
    ]
  },
  {
    id: 18,
    title: '图形面积',
    difficulty: 'easy',
    description: `根据图形类型计算面积：
rectangle w h、circle r、triangle b h。
输入格式：一行字符串，首个单词为类型。
输出格式：保留两位小数。`,
    starterCode: acmStarterCode,
    hints: ['分支处理三种类型，圆周率使用 Math.PI'],
    testCases: [
      { input: 'rectangle 3 4', expectedOutput: '12.00' },
      { input: 'circle 1', expectedOutput: '3.14' },
      { input: 'triangle 10 4', expectedOutput: '20.00', hidden: true },
      { input: 'circle 2.5', expectedOutput: '19.63', hidden: true }
    ]
  },
  {
    id: 19,
    title: '加权平均绩点',
    difficulty: 'medium',
    description: `给定 n 门课程的学分与绩点，求加权平均绩点：
GPA = sum(credit * point) / sum(credit)。
输入格式：第一行 n，后续 n 行 credit point。
输出格式：保留两位小数。`,
    starterCode: acmStarterCode,
    hints: ['分别累计分子和分母，最后 toFixed(2)'],
    testCases: [
      { input: '2\n3 4\n2 3', expectedOutput: '3.60' },
      { input: '3\n1 4\n1 2\n2 3', expectedOutput: '3.00' },
      { input: '1\n4 3.25', expectedOutput: '3.25', hidden: true },
      { input: '4\n2 4\n2 4\n1 2\n1 2', expectedOutput: '3.33', hidden: true }
    ]
  },
  {
    id: 20,
    title: '倒序与偶数下标',
    difficulty: 'easy',
    description: `给定数组，输出两行结果：
第一行：数组倒序；
第二行：原数组中偶数下标（0-based）元素。
输入格式：第一行 n，第二行 n 个整数。`,
    starterCode: acmStarterCode,
    hints: ['倒序可复制后 reverse', '偶数下标可按索引筛选'],
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1\n1 3 5' },
      { input: '4\n10 20 30 40', expectedOutput: '40 30 20 10\n10 30' },
      { input: '1\n9', expectedOutput: '9\n9', hidden: true },
      { input: '6\n-1 -2 -3 -4 -5 -6', expectedOutput: '-6 -5 -4 -3 -2 -1\n-1 -3 -5', hidden: true }
    ]
  },
  {
    id: 21,
    title: '数组位置互换',
    difficulty: 'easy',
    description: `交换数组下标 i 与 j 的元素。
输入格式：
第一行 n；第二行 n 个整数；第三行 i j（0-based）。
输出格式：
交换后的数组。`,
    starterCode: acmStarterCode,
    hints: ['可用解构赋值 [a[i], a[j]] = [a[j], a[i]]'],
    testCases: [
      { input: '4\n1 2 3 4\n1 3', expectedOutput: '1 4 3 2' },
      { input: '3\n9 8 7\n0 2', expectedOutput: '7 8 9' },
      { input: '5\n1 2 3 4 5\n2 2', expectedOutput: '1 2 3 4 5', hidden: true },
      { input: '2\n-1 -2\n0 1', expectedOutput: '-2 -1', hidden: true }
    ]
  },
  {
    id: 22,
    title: '数组按下标取值',
    difficulty: 'easy',
    description: `给定数组与下标 k，输出 arr[k]。
若 k 越界，输出 -1。
输入格式：第一行 n；第二行 n 个整数；第三行 k。`,
    starterCode: acmStarterCode,
    hints: ['判断 0 <= k < n'],
    testCases: [
      { input: '3\n1 3 5\n1', expectedOutput: '3' },
      { input: '1\n9\n2', expectedOutput: '-1' },
      { input: '5\n2 4 6 8 10\n4', expectedOutput: '10', hidden: true },
      { input: '2\n7 8\n-1', expectedOutput: '-1', hidden: true }
    ]
  },
  {
    id: 23,
    title: '数组插入（指定值后）',
    difficulty: 'medium',
    description: `在数组中找到第一个值等于 target 的元素，在其后插入 value。
若 target 不存在，数组保持不变。
输入格式：第一行 n；第二行 n 个整数；第三行 target value。
输出格式：处理后的数组。`,
    starterCode: acmStarterCode,
    hints: ['先找第一个下标，再 splice(index+1,0,value)'],
    testCases: [
      { input: '2\n1 2\n1 9', expectedOutput: '1 9 2' },
      { input: '1\n5\n7 1', expectedOutput: '5' },
      { input: '5\n3 3 3 3 3\n3 8', expectedOutput: '3 8 3 3 3 3', hidden: true },
      { input: '3\n-1 0 1\n0 5', expectedOutput: '-1 0 5 1', hidden: true }
    ]
  },
  {
    id: 24,
    title: '数组删除（首次出现）',
    difficulty: 'medium',
    description: `删除数组中第一个值等于 target 的元素。
若 target 不存在，数组不变。
输入格式：第一行 n；第二行 n 个整数；第三行 target。
输出格式：删除后的数组（若为空则输出空行）。`,
    starterCode: acmStarterCode,
    hints: ['使用 indexOf 找到首次出现位置'],
    testCases: [
      { input: '3\n1 2 3\n2', expectedOutput: '1 3' },
      { input: '2\n4 4\n4', expectedOutput: '4' },
      { input: '1\n9\n9', expectedOutput: '', hidden: true },
      { input: '4\n5 6 7 8\n1', expectedOutput: '5 6 7 8', hidden: true }
    ]
  },
  {
    id: 25,
    title: '前 N 组求和',
    difficulty: 'easy',
    description: `给定 n、m 与 m 组 (a,b)，只计算前 n 组的和并输出。
输入格式：第一行 n m；随后 m 行每行两个整数。
输出格式：输出 min(n,m) 行结果。`,
    starterCode: acmStarterCode,
    hints: ['循环次数应是 min(n,m)'],
    testCases: [
      { input: '2 3\n1 2\n3 4\n5 6', expectedOutput: '3\n7' },
      { input: '3 3\n1 1\n2 2\n3 3', expectedOutput: '2\n4\n6' },
      { input: '5 2\n2 3\n4 5', expectedOutput: '5\n9', hidden: true },
      { input: '0 2\n1 2\n3 4', expectedOutput: '', hidden: true }
    ]
  },
  {
    id: 26,
    title: '分组 A+B',
    difficulty: 'easy',
    description: `有 g 组数据。每组先给 n，再给 n 对 (a,b)。
对每组，按输入顺序输出每对和（同一行，空格分隔）。
输入格式：第一行 g；每组先 n，再 n 行 a b。
输出格式：每组输出一行。`,
    starterCode: acmStarterCode,
    hints: ['双层循环处理分组与组内数据'],
    testCases: [
      { input: '2\n2\n1 2\n3 4\n1\n5 6', expectedOutput: '3 7\n11' },
      { input: '2\n1\n2 3\n2\n7 8\n9 1', expectedOutput: '5\n15 10' },
      { input: '1\n3\n0 0\n-1 1\n2 2', expectedOutput: '0 0 4', hidden: true },
      { input: '1\n0', expectedOutput: '', hidden: true }
    ]
  },
  {
    id: 27,
    title: 'A+B 问题 I',
    difficulty: 'easy',
    description: `给定两个整数 a,b，输出它们的和。
输入格式：一行两个整数。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['读取两个数字后直接相加'],
    testCases: [
      { input: '1 2', expectedOutput: '3' },
      { input: '-5 8', expectedOutput: '3' },
      { input: '1000000 -1', expectedOutput: '999999', hidden: true },
      { input: '0 0', expectedOutput: '0', hidden: true }
    ]
  },
  {
    id: 28,
    title: '开门问题',
    difficulty: 'medium',
    description: `有 n 扇门，初始全关，进行 n 轮操作。
第 i 轮翻转编号为 i 的倍数的门。
求最终打开的门数量。
输入格式：一个整数 n。`,
    starterCode: acmStarterCode,
    hints: ['只有完全平方数位置会被翻转奇数次'],
    testCases: [
      { input: '10', expectedOutput: '3' },
      { input: '100', expectedOutput: '10' },
      { input: '1', expectedOutput: '1', hidden: true },
      { input: '999', expectedOutput: '31', hidden: true }
    ]
  },
  {
    id: 29,
    title: '摆平积木',
    difficulty: 'medium',
    description: `每次可将一块积木从某堆移动到另一堆。
求使所有堆高度相等的最少移动次数；若总数无法均分，输出 -1。
输入格式：第一行 n，第二行 n 个整数。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['sum % n != 0 时直接 -1', '统计低于平均值的缺口总和'],
    testCases: [
      { input: '3\n1 2 3', expectedOutput: '1' },
      { input: '4\n1 2 3 4', expectedOutput: '-1' },
      { input: '5\n1 1 1 1 6', expectedOutput: '4', hidden: true },
      { input: '4\n2 2 2 2', expectedOutput: '0', hidden: true }
    ]
  },
  {
    id: 30,
    title: '合并区间数量',
    difficulty: 'medium',
    description: `给定 n 个闭区间 [l,r]，合并所有重叠区间后，输出剩余区间数量。
输入格式：第一行 n，后续 n 行 l r。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['先按左端点排序，再线性扫描合并'],
    testCases: [
      { input: '3\n1 3\n2 4\n6 8', expectedOutput: '2' },
      { input: '4\n1 2\n3 4\n5 6\n7 8', expectedOutput: '4' },
      { input: '4\n1 5\n2 3\n4 8\n10 12', expectedOutput: '2', hidden: true },
      { input: '2\n-3 -1\n-2 0', expectedOutput: '1', hidden: true }
    ]
  },
  {
    id: 31,
    title: '两数绝对差',
    difficulty: 'easy',
    description: `给定两个整数 a,b，输出 |a-b|。
输入格式：一行两个整数。
输出格式：一个非负整数。`,
    starterCode: acmStarterCode,
    hints: ['可使用 Math.abs(a-b)'],
    testCases: [
      { input: '5 12', expectedOutput: '7' },
      { input: '-3 8', expectedOutput: '11' },
      { input: '9 9', expectedOutput: '0', hidden: true }
    ]
  },
  {
    id: 32,
    title: '统计元音字符',
    difficulty: 'easy',
    description: `统计字符串中元音字母 a/e/i/o/u 的出现次数（忽略大小写）。
输入格式：一行字符串。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['先转小写，再逐字符判断是否在元音集合中'],
    testCases: [
      { input: 'TypeScript Online', expectedOutput: '5' },
      { input: 'rhythm', expectedOutput: '0' },
      { input: 'AEIOUxyz', expectedOutput: '5', hidden: true }
    ]
  },
  {
    id: 33,
    title: '严格递增检查',
    difficulty: 'easy',
    description: `判断数组是否严格递增（a[i] < a[i+1]）。
输入格式：第一行 n；第二行 n 个整数。
输出格式：true 或 false。`,
    starterCode: acmStarterCode,
    hints: ['遍历相邻元素，发现不满足立即返回 false'],
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: 'true' },
      { input: '4\n1 2 2 3', expectedOutput: 'false' },
      { input: '3\n5 4 3', expectedOutput: 'false', hidden: true }
    ]
  },
  {
    id: 34,
    title: '二分查找（首次出现）',
    difficulty: 'medium',
    description: `在有序数组中查找目标值 x 的首次出现下标（0-based）。
若不存在输出 -1。
输入格式：第一行 n x；第二行 n 个已升序排列的整数。
输出格式：一个整数下标。`,
    starterCode: acmStarterCode,
    hints: ['命中后继续向左收缩区间'],
    testCases: [
      { input: '6 4\n1 2 4 4 4 9', expectedOutput: '2' },
      { input: '5 3\n1 2 4 5 6', expectedOutput: '-1' },
      { input: '1 7\n7', expectedOutput: '0', hidden: true }
    ]
  },
  {
    id: 35,
    title: '排序后去重计数',
    difficulty: 'easy',
    description: `给定整数数组，统计不同元素个数。
输入格式：第一行 n；第二行 n 个整数。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['可直接用 Set，也可排序后线性统计'],
    testCases: [
      { input: '7\n1 2 2 3 1 4 3', expectedOutput: '4' },
      { input: '5\n5 5 5 5 5', expectedOutput: '1' },
      { input: '6\n-1 -2 -2 -3 -1 -4', expectedOutput: '4', hidden: true }
    ]
  },
  {
    id: 36,
    title: '旋转数组最小值',
    difficulty: 'medium',
    description: `一个严格递增数组经过旋转后得到当前数组（无重复元素）。
请输出最小值。
输入格式：第一行 n；第二行 n 个整数。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['可用二分查找定位旋转点'],
    testCases: [
      { input: '5\n4 5 1 2 3', expectedOutput: '1' },
      { input: '4\n1 2 3 4', expectedOutput: '1' },
      { input: '6\n7 8 9 2 3 5', expectedOutput: '2', hidden: true }
    ]
  },
  {
    id: 37,
    title: '有效日期判断',
    difficulty: 'medium',
    description: `判断给定日期 yyyy mm dd 是否合法（公历）。
闰年规则：能被 400 整除，或能被 4 整除但不能被 100 整除。
输入格式：一行三个整数 yyyy mm dd。
输出格式：true 或 false。`,
    starterCode: acmStarterCode,
    hints: ['先检查月份范围，再根据闰年计算 2 月天数'],
    testCases: [
      { input: '2024 2 29', expectedOutput: 'true' },
      { input: '2023 2 29', expectedOutput: 'false' },
      { input: '1900 2 29', expectedOutput: 'false', hidden: true }
    ]
  },
  {
    id: 38,
    title: '十进制转二进制',
    difficulty: 'easy',
    description: `给定一个非负整数 n，输出其二进制表示（不含前导零）。
输入格式：一个整数 n。
输出格式：一个二进制字符串。`,
    starterCode: acmStarterCode,
    hints: ['可用 n.toString(2)'],
    testCases: [
      { input: '10', expectedOutput: '1010' },
      { input: '0', expectedOutput: '0' },
      { input: '255', expectedOutput: '11111111', hidden: true }
    ]
  },
  {
    id: 39,
    title: '二进制 1 的个数',
    difficulty: 'easy',
    description: `给定非负整数 n，输出其二进制表示中 1 的数量。
输入格式：一个整数 n。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['可循环位运算，也可转二进制字符串统计'],
    testCases: [
      { input: '13', expectedOutput: '3' },
      { input: '0', expectedOutput: '0' },
      { input: '1023', expectedOutput: '10', hidden: true }
    ]
  },
  {
    id: 40,
    title: '最长不重复子串长度',
    difficulty: 'medium',
    description: `求字符串中不含重复字符的最长连续子串长度。
输入格式：一行字符串。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['滑动窗口 + 哈希表记录字符最近位置'],
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3' },
      { input: 'bbbbb', expectedOutput: '1' },
      { input: 'pwwkew', expectedOutput: '3', hidden: true }
    ]
  },
  {
    id: 41,
    title: '两数之和下标',
    difficulty: 'medium',
    description: `给定数组与目标值 target，找出一个满足 a[i]+a[j]=target 的下标对 i<j。
若不存在输出 -1 -1。
输入格式：第一行 n target；第二行 n 个整数。
输出格式：一行两个下标。`,
    starterCode: acmStarterCode,
    hints: ['用 Map 记录值到下标，边遍历边查找补数'],
    testCases: [
      { input: '4 9\n2 7 11 15', expectedOutput: '0 1' },
      { input: '3 6\n3 2 4', expectedOutput: '1 2' },
      { input: '4 100\n1 2 3 4', expectedOutput: '-1 -1', hidden: true }
    ]
  },
  {
    id: 42,
    title: '字符串游程压缩',
    difficulty: 'easy',
    description: `对字符串做简单游程压缩：连续相同字符压缩为 "字符+次数"。
例如 aaabbc -> a3b2c1。
输入格式：一行字符串（仅字母数字）。
输出格式：压缩结果字符串。`,
    starterCode: acmStarterCode,
    hints: ['维护当前字符与连续计数，遇到变化就写入结果'],
    testCases: [
      { input: 'aaabbc', expectedOutput: 'a3b2c1' },
      { input: 'a', expectedOutput: 'a1' },
      { input: '111223', expectedOutput: '132231', hidden: true }
    ]
  },
  {
    id: 43,
    title: '约瑟夫环（最后存活者）',
    difficulty: 'medium',
    description: `n 个人围成一圈，从 1 开始报数，每次数到 m 的人出圈。
输出最后剩下的人的编号（1-based）。
输入格式：一行 n m。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['可用递推公式 f(i) = (f(i-1)+m) % i'],
    testCases: [
      { input: '5 3', expectedOutput: '4' },
      { input: '7 2', expectedOutput: '7' },
      { input: '1 5', expectedOutput: '1', hidden: true }
    ]
  },
  {
    id: 44,
    title: '区间覆盖点数',
    difficulty: 'medium',
    description: `给定 n 个闭区间 [l,r]（整数端点），统计被至少一个区间覆盖的整数点数量。
输入格式：第一行 n，后续 n 行 l r。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['先排序并合并区间，再累计每段长度 r-l+1'],
    testCases: [
      { input: '3\n1 3\n5 6\n2 4', expectedOutput: '6' },
      { input: '2\n-2 -1\n1 1', expectedOutput: '3' },
      { input: '3\n1 1\n1 1\n1 1', expectedOutput: '1', hidden: true }
    ]
  },
  {
    id: 45,
    title: '阶乘尾零个数',
    difficulty: 'medium',
    description: `给定 n，求 n! 十进制表示末尾连续 0 的个数。
输入格式：一个整数 n。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['统计 n 中包含多少个因子 5：n/5+n/25+...'],
    testCases: [
      { input: '10', expectedOutput: '2' },
      { input: '25', expectedOutput: '6' },
      { input: '100', expectedOutput: '24', hidden: true }
    ]
  },
  {
    id: 46,
    title: '回文数字判断',
    difficulty: 'easy',
    description: `判断整数是否为回文数（负数不是回文）。
输入格式：一个整数 x。
输出格式：true 或 false。`,
    starterCode: acmStarterCode,
    hints: ['可转字符串后双指针比较'],
    testCases: [
      { input: '121', expectedOutput: 'true' },
      { input: '-121', expectedOutput: 'false' },
      { input: '10', expectedOutput: 'false', hidden: true }
    ]
  },
  {
    id: 47,
    title: '最短单词长度',
    difficulty: 'easy',
    description: `给定一行英文句子（单词间单空格），输出最短单词长度。
输入格式：一行字符串。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['split 后遍历求最小长度'],
    testCases: [
      { input: 'we love typescript', expectedOutput: '2' },
      { input: 'a bb ccc dddd', expectedOutput: '1' },
      { input: 'single', expectedOutput: '6', hidden: true }
    ]
  },
  {
    id: 48,
    title: '成绩等级统计',
    difficulty: 'medium',
    description: `统计成绩分布：
A: [90,100]，B: [80,89]，C: [70,79]，D: [60,69]，F: [0,59]。
输入格式：第一行 n，第二行 n 个整数成绩。
输出格式：
A x
B y
C z
D w
F v`,
    starterCode: acmStarterCode,
    hints: ['遍历一次分类计数，按固定顺序输出'],
    testCases: [
      { input: '5\n95 82 77 61 40', expectedOutput: 'A 1\nB 1\nC 1\nD 1\nF 1' },
      { input: '4\n100 100 59 0', expectedOutput: 'A 2\nB 0\nC 0\nD 0\nF 2' },
      { input: '3\n89 79 69', expectedOutput: 'A 0\nB 1\nC 1\nD 1\nF 0', hidden: true }
    ]
  },
  {
    id: 49,
    title: '最长公共前缀',
    difficulty: 'medium',
    description: `给定 n 个字符串，求它们的最长公共前缀。
若不存在公共前缀，输出 EMPTY。
输入格式：第一行 n，接着 n 行每行一个字符串。
输出格式：一个字符串。`,
    starterCode: acmStarterCode,
    hints: ['以前缀候选不断缩短直到全部匹配'],
    testCases: [
      { input: '3\nflower\nflow\nflight', expectedOutput: 'fl' },
      { input: '3\ndog\nracecar\ncar', expectedOutput: 'EMPTY' },
      { input: '2\ninterspecies\ninterstellar', expectedOutput: 'inters', hidden: true }
    ]
  },
  {
    id: 50,
    title: '矩阵主副对角线和',
    difficulty: 'easy',
    description: `给定 n*n 方阵，分别计算主对角线与副对角线元素之和。
输入格式：第一行 n；后续 n 行每行 n 个整数。
输出格式：一行两个整数：main anti。`,
    starterCode: acmStarterCode,
    hints: ['主对角线下标 i,i；副对角线下标 i,n-1-i'],
    testCases: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '15 15' },
      { input: '2\n1 2\n3 4', expectedOutput: '5 5' },
      { input: '4\n1 0 0 1\n0 2 2 0\n0 3 3 0\n4 0 0 4', expectedOutput: '10 10', hidden: true }
    ]
  }
];
