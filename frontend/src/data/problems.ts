import type { Problem } from '../types/index';

export const sampleProblems: Problem[] = [
  {
    id: 1,
    title: 'A+B问题I',
    difficulty: 'easy',
    description: '给定两个整数，输出它们的和。',
    starterCode: `function add(a: number, b: number): number {
  return a + b;
}

console.log(add(1, 2));`,
    hints: ['定义一个返回 number 的函数', '直接使用 + 运算符']
  },
  {
    id: 2,
    title: 'A+B问题II',
    difficulty: 'easy',
    description: '给定多组 (a, b)，输出每组的和。',
    starterCode: `function sumPairs(pairs: Array<[number, number]>): number[] {
  return pairs.map(([a, b]) => a + b);
}

console.log(sumPairs([[1, 2], [3, 4]]).join('\\n'));`,
    hints: ['使用 map 遍历每一对数字', '返回结果数组']
  },
  {
    id: 3,
    title: 'A+B问题III',
    difficulty: 'easy',
    description: '给定 n 和若干组 (a, b)，仅计算前 n 组的和。',
    starterCode: `function sumFirstN(n: number, pairs: Array<[number, number]>): number[] {
  return pairs.slice(0, n).map(([a, b]) => a + b);
}

console.log(sumFirstN(2, [[1, 2], [3, 4], [5, 6]]).join('\\n'));`,
    hints: ['先 slice(0, n)', '再 map 计算每组和']
  },
  {
    id: 4,
    title: 'A+B问题IV',
    difficulty: 'easy',
    description: '每组数据第一项是长度 n，后面跟 n 组 (a, b)，依次输出每组结果。',
    starterCode: `function solveGroupedSums(groups: Array<Array<[number, number]>>): number[][] {
  return groups.map(group => group.map(([a, b]) => a + b));
}

const groups = [
  [[1, 2], [3, 4]],
  [[5, 6]]
];
console.log(solveGroupedSums(groups).map(g => g.join(' ')).join('\\n'));`,
    hints: ['双层 map 处理分组', '保持每组结果独立']
  },
  {
    id: 5,
    title: 'A+B问题V',
    difficulty: 'easy',
    description: '输入多组 (a, b)，遇到 (0, 0) 停止，输出之前所有和。',
    starterCode: `function sumUntilZero(pairs: Array<[number, number]>): number[] {
  const result: number[] = [];
  for (const [a, b] of pairs) {
    if (a === 0 && b === 0) break;
    result.push(a + b);
  }
  return result;
}

console.log(sumUntilZero([[1, 2], [3, 4], [0, 0], [10, 20]]).join('\\n'));`,
    hints: ['使用 for...of 遍历', '遇到终止条件时 break']
  },
  {
    id: 6,
    title: '数组的倒序与隔位输出',
    difficulty: 'easy',
    description: '输出数组倒序，以及下标为偶数位置的元素。',
    starterCode: `function reverseAndEvenIndex(arr: number[]): { reversed: string; evenIndexed: string } {
  const reversed = arr.slice().reverse().join(' ');
  const evenIndexed = arr.filter((_, i) => i % 2 === 0).join(' ');
  return { reversed, evenIndexed };
}

const result = reverseAndEvenIndex([1, 2, 3, 4, 5]);
console.log(result.reversed);
console.log(result.evenIndexed);`,
    hints: ['reverse 前先 slice', 'filter 时用索引判断']
  },
  {
    id: 7,
    title: '摆平积木',
    difficulty: 'medium',
    description: '每次从高堆移一个积木到低堆，求最少移动次数使各堆相等。',
    starterCode: `function minOperations(heights: number[]): number {
  const sum = heights.reduce((acc, n) => acc + n, 0);
  if (sum % heights.length !== 0) return -1;

  const avg = sum / heights.length;
  let moves = 0;
  for (const h of heights) {
    if (h < avg) moves += avg - h;
  }
  return moves;
}

console.log(minOperations([1, 2, 3]));`,
    hints: ['先判断是否可平分', '统计低于平均值的总差值']
  },
  {
    id: 8,
    title: '奇怪的信',
    difficulty: 'easy',
    description: '将句子中每个单词反转，单词顺序不变。',
    starterCode: `function strangeLetter(sentence: string): string {
  return sentence
    .split(' ')
    .map(word => word.split('').reverse().join(''))
    .join(' ');
}

console.log(strangeLetter('hello typescript'));`,
    hints: ['先按空格 split', '每个单词独立反转']
  },
  {
    id: 9,
    title: '打印正方形',
    difficulty: 'easy',
    description: '给定边长 n 和字符 ch，打印 n x n 的正方形。',
    starterCode: `function printSquare(n: number, ch: string): string {
  return Array.from({ length: n }, () => ch.repeat(n)).join('\\n');
}

console.log(printSquare(3, '*'));`,
    hints: ['每一行是 ch.repeat(n)', '共拼接 n 行']
  },
  {
    id: 10,
    title: '平均绩点',
    difficulty: 'medium',
    description: '根据课程学分和绩点，计算加权平均绩点。',
    starterCode: `function averageGPA(courses: Array<{ credit: number; gpa: number }>): number {
  const totalCredit = courses.reduce((acc, c) => acc + c.credit, 0);
  if (totalCredit === 0) return 0;
  const weighted = courses.reduce((acc, c) => acc + c.credit * c.gpa, 0);
  return Number((weighted / totalCredit).toFixed(2));
}

console.log(averageGPA([
  { credit: 3, gpa: 4.0 },
  { credit: 2, gpa: 3.0 }
]));`,
    hints: ['加权平均 = sum(学分*绩点)/sum(学分)', '注意保留两位小数']
  },
  {
    id: 11,
    title: '句子缩写',
    difficulty: 'easy',
    description: '取每个单词首字母并大写，生成缩写。',
    starterCode: `function abbreviate(sentence: string): string {
  return sentence
    .trim()
    .split(/\\s+/)
    .map(word => word[0].toUpperCase())
    .join('');
}

console.log(abbreviate('central processing unit'));`,
    hints: ['先 trim 再按空白分词', '取首字母并转大写']
  },
  {
    id: 12,
    title: '位置互换',
    difficulty: 'easy',
    description: '交换数组中两个下标位置的元素。',
    starterCode: `function swapPositions(arr: number[], i: number, j: number): number[] {
  const copy = arr.slice();
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

console.log(swapPositions([1, 2, 3, 4], 1, 3).join(' '));`,
    hints: ['先拷贝数组再交换', '可用解构赋值']
  },
  {
    id: 13,
    title: '链表的基础操作I',
    difficulty: 'medium',
    description: '实现单链表按下标取值函数。',
    starterCode: `interface ListNode {
  val: number;
  next: ListNode | null;
}

function getAt(head: ListNode | null, index: number): number {
  let curr = head;
  let i = 0;
  while (curr) {
    if (i === index) return curr.val;
    curr = curr.next;
    i++;
  }
  return -1;
}`,
    hints: ['从 head 开始遍历', '计数器等于 index 时返回']
  },
  {
    id: 14,
    title: '链表的基础操作II',
    difficulty: 'medium',
    description: '在指定值节点后插入新节点。',
    starterCode: `interface ListNode {
  val: number;
  next: ListNode | null;
}

function insertAfter(head: ListNode | null, target: number, value: number): ListNode | null {
  let curr = head;
  while (curr) {
    if (curr.val === target) {
      curr.next = { val: value, next: curr.next };
      break;
    }
    curr = curr.next;
  }
  return head;
}`,
    hints: ['找到 target 节点后修改 next', '注意保持原链不断开']
  },
  {
    id: 15,
    title: '链表的基础操作III',
    difficulty: 'medium',
    description: '删除链表中第一个值等于 target 的节点。',
    starterCode: `interface ListNode {
  val: number;
  next: ListNode | null;
}

function removeFirst(head: ListNode | null, target: number): ListNode | null {
  const dummy: ListNode = { val: 0, next: head };
  let curr: ListNode | null = dummy;
  while (curr && curr.next) {
    if (curr.next.val === target) {
      curr.next = curr.next.next;
      break;
    }
    curr = curr.next;
  }
  return dummy.next;
}`,
    hints: ['使用哑节点处理删头结点', '只删除第一次出现']
  },
  {
    id: 16,
    title: '出现频率最高的字母',
    difficulty: 'easy',
    description: '返回字符串中出现次数最多的字母（忽略大小写）。',
    starterCode: `function mostFrequentLetter(text: string): string {
  const map = new Map<string, number>();
  for (const ch of text.toLowerCase()) {
    if (ch < 'a' || ch > 'z') continue;
    map.set(ch, (map.get(ch) ?? 0) + 1);
  }

  let best = '';
  let bestCount = -1;
  for (const [ch, count] of map) {
    if (count > bestCount || (count === bestCount && ch < best)) {
      best = ch;
      bestCount = count;
    }
  }
  return best;
}

console.log(mostFrequentLetter('TypeScript'));`,
    hints: ['可用 Map 计数', '并列时按字母序返回更小者']
  },
  {
    id: 17,
    title: '判断集合成员',
    difficulty: 'easy',
    description: '给定集合和查询值，判断是否属于该集合。',
    starterCode: `function isMember(values: number[], target: number): boolean {
  const set = new Set(values);
  return set.has(target);
}

console.log(isMember([1, 3, 5], 3));`,
    hints: ['用 Set 提高查询效率', '返回布尔值']
  },
  {
    id: 18,
    title: '开房门',
    difficulty: 'medium',
    description: '有 n 扇门，进行 n 轮翻转，第 i 轮翻转编号为 i 的倍数门，求最后打开门的数量。',
    starterCode: `function openDoorCount(n: number): number {
  return Math.floor(Math.sqrt(n));
}

console.log(openDoorCount(100));`,
    hints: ['最终打开的是完全平方数编号的门', '答案是 sqrt(n) 向下取整']
  },
  {
    id: 19,
    title: '洗盘子',
    difficulty: 'medium',
    description: '给定每个盘子油污值和清洁能力，每次可清洗一个盘子，求最少清洗次数使总油污 <= 0。',
    starterCode: `function minWashTimes(dirties: number[], power: number): number {
  const sorted = dirties.slice().sort((a, b) => b - a);
  let total = sorted.reduce((acc, v) => acc + v, 0);
  let times = 0;
  for (const d of sorted) {
    if (total <= 0) break;
    total -= d + power;
    times++;
  }
  return total <= 0 ? times : -1;
}

console.log(minWashTimes([3, 1, 4], 1));`,
    hints: ['优先处理油污值大的盘子', '贪心统计最少次数']
  },
  {
    id: 20,
    title: '排队取奶茶',
    difficulty: 'easy',
    description: '模拟队列操作：in x 入队，out 出队，返回所有出队结果。',
    starterCode: `function milkTeaQueue(ops: string[]): number[] {
  const queue: number[] = [];
  const out: number[] = [];
  for (const op of ops) {
    const [cmd, value] = op.split(' ');
    if (cmd === 'in') queue.push(Number(value));
    if (cmd === 'out' && queue.length > 0) out.push(queue.shift() as number);
  }
  return out;
}

console.log(milkTeaQueue(['in 1', 'in 2', 'out', 'in 3', 'out']).join(' '));`,
    hints: ['队列先进先出', 'JavaScript 可用 push + shift']
  },
  {
    id: 21,
    title: '图形的面积',
    difficulty: 'easy',
    description: '根据图形类型计算面积：rectangle(w,h)、circle(r)、triangle(b,h)。',
    starterCode: `type Shape =
  | { kind: 'rectangle'; w: number; h: number }
  | { kind: 'circle'; r: number }
  | { kind: 'triangle'; b: number; h: number };

function area(shape: Shape): number {
  if (shape.kind === 'rectangle') return shape.w * shape.h;
  if (shape.kind === 'circle') return Number((Math.PI * shape.r * shape.r).toFixed(2));
  return (shape.b * shape.h) / 2;
}

console.log(area({ kind: 'rectangle', w: 3, h: 4 }));`,
    hints: ['矩形: w*h', '圆: πr²', '三角形: b*h/2']
  }
];

export const getProblemById = (id: number): Problem | undefined => {
  return sampleProblems.find((p) => p.id === id);
};
