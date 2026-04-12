import { Problem } from '../types/problem';
import { acmStarterCode } from './starterCode';

export const problems: Problem[] = [
  {
    id: 1,
    title: 'A+B 问题 I',
    difficulty: 'easy',
    description: `给定两个整数，输出它们的和。
输入格式：一行两个整数 a b。
输出格式：输出一个整数。`,
    starterCode: acmStarterCode,
    hints: ['读取两个整数并相加后输出'],
    testCases: [
      { input: '1 2', expectedOutput: '3' },
      { input: '-5 8', expectedOutput: '3', hidden: true },
      { input: '1000000 -1', expectedOutput: '999999', hidden: true }
    ]
  },
  {
    id: 2,
    title: 'A+B 问题 II',
    difficulty: 'easy',
    description: `给定 t 组数据，每组两个整数 a b，输出每组和。
输入格式：第一行 t，接下来 t 行每行两个整数。
输出格式：输出 t 行，每行一个结果。`,
    starterCode: acmStarterCode,
    hints: ['先读取 t，再循环 t 次'],
    testCases: [
      { input: '2\n1 2\n3 4', expectedOutput: '3\n7' },
      { input: '3\n10 20\n30 40\n1 1', expectedOutput: '30\n70\n2', hidden: true },
      { input: '1\n-3 -7', expectedOutput: '-10', hidden: true }
    ]
  },
  {
    id: 3,
    title: '前 N 组求和',
    difficulty: 'easy',
    description: `给定 n、m 和 m 组 (a,b)，仅计算前 n 组和。
输入格式：第一行 n m；后续 m 行每行两个整数。
输出格式：输出 n 行结果。`,
    starterCode: acmStarterCode,
    hints: ['只处理前 n 组，不要越界'],
    testCases: [
      { input: '2 3\n1 2\n3 4\n5 6', expectedOutput: '3\n7' },
      { input: '3 3\n1 1\n2 2\n3 3', expectedOutput: '2\n4\n6', hidden: true }
    ]
  },
  {
    id: 4,
    title: '分组 A+B',
    difficulty: 'easy',
    description: `有 g 组数据，每组先给一个整数 n，后面跟 n 对 (a,b)。
每组内部按顺序输出每对和（同一行，空格分隔）。
输入格式：第一行 g；每组先 n，再 n 行 a b。
输出格式：每组输出一行。`,
    starterCode: acmStarterCode,
    hints: ['双层循环，组内拼一行字符串'],
    testCases: [
      { input: '2\n2\n1 2\n3 4\n1\n5 6', expectedOutput: '3 7\n11' },
      { input: '2\n1\n2 3\n2\n7 8\n9 1', expectedOutput: '5\n15 10', hidden: true }
    ]
  },
  {
    id: 5,
    title: '遇 0 0 终止',
    difficulty: 'easy',
    description: `连续输入多组 (a,b)，遇到 0 0 立即停止，输出此前每组和。
输入格式：若干行 a b。
输出格式：每组一行结果。`,
    starterCode: acmStarterCode,
    hints: ['读到 0 0 就 break'],
    testCases: [
      { input: '1 2\n3 4\n0 0\n9 9', expectedOutput: '3\n7' },
      { input: '0 0\n1 2', expectedOutput: '', hidden: true },
      { input: '2 2\n0 0', expectedOutput: '4', hidden: true }
    ]
  },
  {
    id: 6,
    title: '倒序与偶数下标',
    difficulty: 'easy',
    description: `给定数组，输出：
1) 倒序数组；2) 原数组偶数下标元素（0-based）。
输入格式：第一行 n，第二行 n 个整数。
输出格式：两行，分别对应上述两项。`,
    starterCode: acmStarterCode,
    hints: ['第二行可 filter((_,i)=>i%2===0)'],
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1\n1 3 5' },
      { input: '4\n10 20 30 40', expectedOutput: '40 30 20 10\n10 30', hidden: true }
    ]
  },
  {
    id: 7,
    title: '摆平积木',
    difficulty: 'medium',
    description: `每次可将 1 块积木从高堆移动到低堆，求最少次数使所有堆相等。
若无法均分输出 -1。
输入格式：第一行 n，第二行 n 个整数。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['sum % n != 0 时直接 -1', '统计低于平均值的缺口总和'],
    testCases: [
      { input: '3\n1 2 3', expectedOutput: '1' },
      { input: '4\n1 2 3 4', expectedOutput: '-1', hidden: true },
      { input: '5\n1 1 1 1 6', expectedOutput: '4', hidden: true }
    ]
  },
  {
    id: 8,
    title: '反转每个单词',
    difficulty: 'easy',
    description: `将句子中每个单词反转，单词顺序不变。
输入保证单词之间单个空格分隔。
输入格式：一行字符串。
输出格式：一行字符串。`,
    starterCode: acmStarterCode,
    hints: ['split + map + join'],
    testCases: [
      { input: 'hello typescript', expectedOutput: 'olleh tpircsepyt' },
      { input: 'abc de', expectedOutput: 'cba ed', hidden: true }
    ]
  },
  {
    id: 9,
    title: '打印正方形',
    difficulty: 'easy',
    description: `给定边长 n 和字符 ch，输出 n*n 正方形。
输入格式：一行 n 和 ch。
输出格式：n 行，每行 n 个 ch。`,
    starterCode: acmStarterCode,
    hints: ['循环 n 次输出 ch.repeat(n)'],
    testCases: [
      { input: '2 *', expectedOutput: '**\n**' },
      { input: '3 #', expectedOutput: '###\n###\n###', hidden: true }
    ]
  },
  {
    id: 10,
    title: '加权平均绩点',
    difficulty: 'medium',
    description: `给定课程学分和绩点，计算加权平均绩点。
输入格式：第一行 n，后续 n 行 credit gpa。
输出格式：保留两位小数。`,
    starterCode: acmStarterCode,
    hints: ['sum(credit*gpa)/sum(credit)', '最后用 toFixed(2)'],
    testCases: [
      { input: '2\n3 4\n2 3', expectedOutput: '3.60' },
      { input: '3\n1 4\n1 2\n2 3', expectedOutput: '3.00', hidden: true },
      { input: '1\n4 3.25', expectedOutput: '3.25', hidden: true }
    ]
  },
  {
    id: 11,
    title: '句子缩写',
    difficulty: 'easy',
    description: `取每个单词首字母并大写，拼成缩写。
输入格式：一行英文句子（单词间单个空格）。
输出格式：一行大写缩写。`,
    starterCode: acmStarterCode,
    hints: ['按空格分词后取首字符'],
    testCases: [
      { input: 'central processing unit', expectedOutput: 'CPU' },
      { input: 'random access memory', expectedOutput: 'RAM', hidden: true }
    ]
  },
  {
    id: 12,
    title: '数组位置互换',
    difficulty: 'easy',
    description: `交换数组中下标 i 和 j 的元素。
输入格式：第一行 n，第二行 n 个整数，第三行 i j。
输出格式：交换后的数组（空格分隔）。`,
    starterCode: acmStarterCode,
    hints: ['可用解构赋值交换'],
    testCases: [
      { input: '4\n1 2 3 4\n1 3', expectedOutput: '1 4 3 2' },
      { input: '3\n9 8 7\n0 2', expectedOutput: '7 8 9', hidden: true }
    ]
  },
  {
    id: 13,
    title: '数组按下标取值',
    difficulty: 'easy',
    description: `给定数组和下标 k，输出 arr[k]，越界输出 -1。
输入格式：第一行 n，第二行 n 个整数，第三行 k。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['先判断 k 是否在 [0,n)'],
    testCases: [
      { input: '3\n1 3 5\n1', expectedOutput: '3' },
      { input: '1\n9\n2', expectedOutput: '-1', hidden: true }
    ]
  },
  {
    id: 14,
    title: '数组插入（指定值后）',
    difficulty: 'medium',
    description: `在数组中第一个值等于 target 的元素后插入 value。
若 target 不存在，数组不变。
输入格式：第一行 n，第二行 n 个整数，第三行 target value。
输出格式：处理后的数组。`,
    starterCode: acmStarterCode,
    hints: ['找到第一个匹配位置后 splice'],
    testCases: [
      { input: '2\n1 2\n1 9', expectedOutput: '1 9 2' },
      { input: '1\n5\n7 1', expectedOutput: '5', hidden: true }
    ]
  },
  {
    id: 15,
    title: '数组删除（首次出现）',
    difficulty: 'medium',
    description: `删除数组中第一个值等于 target 的元素。
输入格式：第一行 n，第二行 n 个整数，第三行 target。
输出格式：删除后的数组（可为空行）。`,
    starterCode: acmStarterCode,
    hints: ['找到下标后删除一次'],
    testCases: [
      { input: '3\n1 2 3\n2', expectedOutput: '1 3' },
      { input: '2\n4 4\n4', expectedOutput: '4', hidden: true }
    ]
  },
  {
    id: 16,
    title: '最高频字母',
    difficulty: 'easy',
    description: `输出字符串中出现次数最多的字母（忽略大小写，忽略非字母）。
若出现次数并列，输出字典序更小者。
输入格式：一行字符串。
输出格式：一个小写字母。`,
    starterCode: acmStarterCode,
    hints: ['Map 计数', '并列时比较字符大小'],
    testCases: [
      { input: 'TypeScript', expectedOutput: 't' },
      { input: 'aabbbbcc', expectedOutput: 'b', hidden: true }
    ]
  },
  {
    id: 17,
    title: '集合查询',
    difficulty: 'easy',
    description: `给定一个整数集合和若干查询，判断每个查询值是否在集合中。
输入格式：第一行 n q；第二行 n 个数；第三行 q 个查询值。
输出格式：输出 q 行 true/false。`,
    starterCode: acmStarterCode,
    hints: ['把集合放进 Set 再查询'],
    testCases: [
      { input: '5 4\n1 3 5 7 9\n3 4 9 10', expectedOutput: 'true\nfalse\ntrue\nfalse' },
      { input: '3 3\n2 4 6\n6 5 2', expectedOutput: 'true\nfalse\ntrue', hidden: true },
      { input: '4 5\n1 1 2 2\n1 2 3 0 1', expectedOutput: 'true\ntrue\nfalse\nfalse\ntrue', hidden: true }
    ]
  },
  {
    id: 18,
    title: '开门问题',
    difficulty: 'medium',
    description: `有 n 扇门，进行 n 轮翻转，第 i 轮翻转 i 的倍数门。
求最终打开的门数量。
输入格式：一个整数 n。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['最终只剩完全平方数位置为打开'],
    testCases: [
      { input: '10', expectedOutput: '3' },
      { input: '100', expectedOutput: '10', hidden: true }
    ]
  },
  {
    id: 19,
    title: '最大子段和',
    difficulty: 'medium',
    description: `给定整数数组，求连续子数组的最大和。
输入格式：第一行 n，第二行 n 个整数。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['使用 Kadane 算法 O(n)'],
    testCases: [
      { input: '5\n-2 1 -3 4 -1', expectedOutput: '4' },
      { input: '6\n-2 -3 -1 -4 -6 -5', expectedOutput: '-1', hidden: true },
      { input: '8\n1 -2 3 10 -4 7 2 -5', expectedOutput: '18', hidden: true }
    ]
  },
  {
    id: 20,
    title: '队列模拟',
    difficulty: 'easy',
    description: `支持两种操作：
in x：入队；out：出队并输出队头，若队空输出 EMPTY。
输入格式：第一行 m，后续 m 行为操作。
输出格式：每次 out 输出一行。`,
    starterCode: acmStarterCode,
    hints: ['用数组维护队列，out 时判断空'],
    testCases: [
      { input: '5\nin 1\nin 2\nout\nin 3\nout', expectedOutput: '1\n2' },
      { input: '3\nout\nin 5\nout', expectedOutput: 'EMPTY\n5', hidden: true }
    ]
  },
  {
    id: 21,
    title: '图形面积',
    difficulty: 'easy',
    description: `计算图形面积：
rectangle w h、circle r、triangle b h。
输入格式：一行，首个单词为类型。
输出格式：保留两位小数。`,
    starterCode: acmStarterCode,
    hints: ['按类型分支计算', '圆面积用 Math.PI * r * r'],
    testCases: [
      { input: 'rectangle 3 4', expectedOutput: '12.00' },
      { input: 'circle 1', expectedOutput: '3.14', hidden: true }
    ]
  },
  {
    id: 22,
    title: '斐波那契数列（取模）',
    difficulty: 'medium',
    description: `求第 n 个斐波那契数（F1=1,F2=1），结果对 1e9+7 取模。
输入格式：一个整数 n。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['迭代 DP，避免递归超时'],
    testCases: [
      { input: '10', expectedOutput: '55' },
      { input: '1', expectedOutput: '1', hidden: true },
      { input: '50', expectedOutput: '586268941', hidden: true }
    ]
  },
  {
    id: 23,
    title: '括号合法性',
    difficulty: 'medium',
    description: `判断仅由 ()[]{} 组成的字符串是否有效匹配。
输入格式：一行字符串。
输出格式：true 或 false。`,
    starterCode: acmStarterCode,
    hints: ['栈结构匹配左右括号'],
    testCases: [
      { input: '([]){}', expectedOutput: 'true' },
      { input: '([)]', expectedOutput: 'false', hidden: true },
      { input: '{}[]()', expectedOutput: 'true', hidden: true }
    ]
  },
  {
    id: 24,
    title: '最大公约数与最小公倍数',
    difficulty: 'easy',
    description: `给定两个正整数 a,b，输出 gcd(a,b) 和 lcm(a,b)。
输入格式：一行两个整数。
输出格式：两整数，空格分隔。`,
    starterCode: acmStarterCode,
    hints: ['欧几里得算法求 gcd，lcm=a/gcd*b'],
    testCases: [
      { input: '12 18', expectedOutput: '6 36' },
      { input: '7 5', expectedOutput: '1 35', hidden: true }
    ]
  },
  {
    id: 25,
    title: '前缀和区间查询',
    difficulty: 'medium',
    description: `多次查询数组区间和。
输入格式：第一行 n q；第二行 n 个整数；接着 q 行 l r（1-based）。
输出格式：每个查询输出一行区间和。`,
    starterCode: acmStarterCode,
    hints: ['预处理前缀和，查询 O(1)'],
    testCases: [
      { input: '5 3\n1 2 3 4 5\n1 3\n2 5\n4 4', expectedOutput: '6\n14\n4' },
      { input: '4 2\n10 20 30 40\n1 4\n2 3', expectedOutput: '100\n50', hidden: true },
      { input: '1 2\n99\n1 1\n1 1', expectedOutput: '99\n99', hidden: true }
    ]
  },
  {
    id: 26,
    title: '定长滑窗最大和',
    difficulty: 'medium',
    description: `给定数组和窗口大小 k，求长度为 k 的连续子数组最大和。
输入格式：第一行 n k；第二行 n 个整数。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['先求首窗和，再滑动更新'],
    testCases: [
      { input: '5 3\n1 2 3 4 5', expectedOutput: '12' },
      { input: '6 2\n-1 -2 -3 -4 -5 -6', expectedOutput: '-3', hidden: true },
      { input: '4 4\n8 -1 3 2', expectedOutput: '12', hidden: true }
    ]
  },
  {
    id: 27,
    title: '矩阵转置',
    difficulty: 'easy',
    description: `输出 n*m 矩阵的转置矩阵。
输入格式：第一行 n m；后续 n 行每行 m 个整数。
输出格式：m 行，每行 n 个整数。`,
    starterCode: acmStarterCode,
    hints: ['双层循环按列输出'],
    testCases: [
      { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '1 4\n2 5\n3 6' },
      { input: '1 4\n7 8 9 10', expectedOutput: '7\n8\n9\n10', hidden: true }
    ]
  },
  {
    id: 28,
    title: '回文串判断（忽略符号）',
    difficulty: 'medium',
    description: `忽略大小写与非字母数字字符，判断字符串是否回文。
输入格式：一行字符串。
输出格式：true 或 false。`,
    starterCode: acmStarterCode,
    hints: ['先过滤再双指针判断'],
    testCases: [
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true' },
      { input: 'race a car', expectedOutput: 'false', hidden: true },
      { input: '0P', expectedOutput: 'false', hidden: true }
    ]
  },
  {
    id: 29,
    title: '去重并保持顺序',
    difficulty: 'easy',
    description: `删除数组中的重复元素，保留第一次出现顺序。
输入格式：第一行 n，第二行 n 个整数。
输出格式：去重后的数组。`,
    starterCode: acmStarterCode,
    hints: ['Set 记录是否出现过'],
    testCases: [
      { input: '7\n1 2 2 3 1 4 3', expectedOutput: '1 2 3 4' },
      { input: '5\n5 5 5 5 5', expectedOutput: '5', hidden: true }
    ]
  },
  {
    id: 30,
    title: '合并区间数量',
    difficulty: 'medium',
    description: `给定 n 个区间 [l,r]，合并所有重叠区间后，输出区间数量。
输入格式：第一行 n，后续 n 行 l r。
输出格式：一个整数。`,
    starterCode: acmStarterCode,
    hints: ['先按左端点排序，再线性合并'],
    testCases: [
      { input: '3\n1 3\n2 4\n6 8', expectedOutput: '2' },
      { input: '4\n1 2\n3 4\n5 6\n7 8', expectedOutput: '4', hidden: true },
      { input: '4\n1 5\n2 3\n4 8\n10 12', expectedOutput: '2', hidden: true }
    ]
  }
];
