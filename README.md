# TypeScript ACM 练习平台

一个基于 React + Express 的在线 TypeScript 刷题平台，采用 **ACM 输入输出模式**，支持在线运行与自动判题。

## 功能

- 200 道 ACM 风格题目（按核心 / 强化 / 挑战路径分层）
- iOS 风格三列工作区（左题面与切题 / 中代码编辑 / 右输入与结果）
- Monaco 编辑器（TypeScript 语法与类型提示）
- 在线运行（自定义输入）
- 自动评测（公开 + 隐藏测试用例）
- Docker 隔离执行（限制网络、内存、CPU、进程数）
- 多用户入口选择（创建/重命名/删除本地用户，用户数据独立保存）
- 代码自动本地保存（按题目缓存）
- 题库学习路径元数据（核心/强化/挑战 + 模块 + 标签 + 先修题）

## 技术栈

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Monaco
- **Backend**: Node.js, Express, TypeScript
- **Execution**: 前端模式选择为权威；后端按请求模式执行（`auto/docker/local`）

## 运行要求

- Node.js 18+
- npm
- Docker（推荐，用于隔离执行）

## 快速开始

### 1. 安装依赖

```bash
npm install --workspaces --include-workspace-root
```

### 2. 配置环境变量

```bash
cd backend
cp .env.example .env
```

默认配置：

```env
PORT=3000
NODE_ENV=development
DOCKER_IMAGE=tslenrn-executor:latest
EXECUTOR_MODE=auto
ALLOW_UNSAFE_LOCAL_EXECUTION=false
EXECUTION_TIMEOUT=5000
MAX_OUTPUT_LENGTH=10000
```

执行模式说明：

- `executorMode=auto`：优先 Docker；若 Docker 不可用，仅在 `ALLOW_UNSAFE_LOCAL_EXECUTION=true` 时自动回退本地
- `executorMode=docker`：强制 Docker（不可用时报错）
- `executorMode=local`：显式本地执行（无容器隔离）
- `ALLOW_UNSAFE_LOCAL_EXECUTION=false`（默认）：仅禁止 **auto** 模式自动回退，不影响显式 `local`
- `EXECUTOR_MODE`：仅在请求体未传 `executorMode` 时作为后端默认值（非前端主流程）

### 3. 构建执行镜像

```bash
cd backend
./build-docker.sh
```

### 4. 启动开发环境

**方式 A（推荐，根目录一条命令）**

```bash
npm run dev
```

**方式 B（分别启动）**

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

访问：

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## ACM 使用说明

桌面端默认三列布局：

- 左侧：题目选择 + 题面描述
- 中间：TypeScript 编辑器
- 右侧：ACM 输入与运行/判题结果

移动端使用 `题面 / 编辑 / 结果` 分段切换。

操作流程：

1. 进入平台先选择本地用户（可创建、重命名、删除）
2. 选择题目
3. 在中间编辑 TypeScript 代码（从 `stdin` 读入）
4. 在右侧填写 **ACM 输入**
5. 点击 **运行** 查看输出，或 **提交测试** 执行判题

多用户隔离项：

- 代码草稿（按题）
- 最近题号
- 判题模式偏好
- 自定义输入与结果页签偏好

说明：当前用户体系为浏览器本地存储（localStorage），不会自动同步到后端或其他设备。

示例读取模板：

```ts
import * as fs from 'fs';
const input = fs.readFileSync(0, 'utf8');
const tokens = input.match(/\S+/g) ?? [];
let idx = 0;
const next = (): string => tokens[idx++] ?? '';
const nextNum = (): number => Number(next());

const out: string[] = [];
const print = (...values: Array<string | number | bigint>): void => {
  out.push(values.join(' '));
};

process.stdout.write(out.join('\n'));
```

## API 概览

- `GET /api/health`：健康检查
- `GET /api/problems`：题目列表
- `GET /api/problems/stats`：题库分布统计（难度/路径/模块）
- `GET /api/problems/:id`：题目详情（含公开测试信息）
- `GET /api/executor/capabilities`：执行器能力（Docker 可用性、自动回退策略、支持的模式）
- `POST /api/execute`：运行代码
  - body: `{ code: string, input?: string, executorMode?: 'docker' | 'local' | 'auto' }`
- `POST /api/test`：判题
  - body: `{ code: string, problemId: number, executorMode?: 'docker' | 'local' | 'auto' }`

## 项目结构

```text
tslenrn/
├── frontend/
│   ├── src/components/    # 页面组件（工作区、题面、编辑器、结果面板）
│   ├── src/hooks/         # 业务 Hook（题目、草稿、运行）
│   ├── src/editor/        # 编辑器相关配置（如 Node typings）
│   ├── src/utils/api.ts   # 前端 API 调用
│   └── src/types/         # 前端类型映射（统一复用 shared 契约）
├── backend/
│   ├── src/problems/      # 题库与测试样例（唯一数据源）
│   ├── src/routes/        # execute/test/problems 接口
│   ├── src/services/      # 执行器、题库服务、判题服务
│   ├── src/utils/         # HTTP 错误与参数校验
│   ├── Dockerfile         # 执行镜像定义
│   └── build-docker.sh    # 镜像构建脚本
└── shared/
    └── types.ts           # 前后端共享契约（类型与 API 响应结构）
```

## 常见问题

### 1) `Execution timeout after 5000ms`

- 检查 Docker 是否可用：`docker run --rm node:18-alpine node -v`
- 确认执行镜像已构建：`cd backend && ./build-docker.sh`
- 如需更长运行时间，调大 `backend/.env` 的 `EXECUTION_TIMEOUT`
- 若本机无 Docker 且要继续执行，请显式设置 `ALLOW_UNSAFE_LOCAL_EXECUTION=true`（仅建议本地开发环境）

### 2) 判题结果和本地运行不一致

- 平台按 ACM 模式判题，必须从 `stdin` 读取输入、向 `stdout` 输出结果
- 注意换行与多行输出格式

### 3) 题库在哪里维护

- 统一在 `backend/src/problems/index.ts`
- 修改后重启后端生效

### 4) 快速检查当前代码状态

- 运行 `./verify.sh` 查看关键文件与依赖检查结果
