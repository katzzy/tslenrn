# TypeScript ACM 练习平台

一个基于 React + Express 的在线 TypeScript 刷题平台，采用 **ACM 输入输出模式（stdin/stdout）**，支持在线运行与自动判题。

## 功能

- 30 道 ACM 风格题目（easy / medium）
- Monaco 编辑器（TypeScript 语法与类型提示）
- 在线运行（自定义 stdin）
- 自动评测（公开 + 隐藏测试用例）
- Docker 隔离执行（限制网络、内存、CPU、进程数）
- 代码自动本地保存（按题目缓存）

## 技术栈

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Monaco
- **Backend**: Node.js, Express, TypeScript
- **Execution**: Docker (`tslenrn-executor:latest`)

## 运行要求

- Node.js 18+
- npm
- Docker（运行/判题必需）

## 快速开始

### 1. 安装依赖

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
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
EXECUTION_TIMEOUT=5000
MAX_OUTPUT_LENGTH=10000
```

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

1. 在左侧选择题目
2. 在中间编辑 TypeScript 代码（从 `stdin` 读入）
3. 在右侧填写 **ACM 输入（stdin）**
4. 点击 **运行** 查看输出，或 **提交测试** 执行判题

示例读取模板：

```ts
import * as fs from 'fs';
const input = fs.readFileSync(0, 'utf8').trim();
const tokens = input.length ? input.split(/\s+/) : [];
let idx = 0;
const next = () => tokens[idx++];
```

## API 概览

- `GET /api/health`：健康检查
- `GET /api/problems`：题目列表
- `GET /api/problems/:id`：题目详情（含公开测试信息）
- `POST /api/execute`：运行代码
  - body: `{ code: string, input?: string }`
- `POST /api/test`：判题
  - body: `{ code: string, problemId: number }`

## 项目结构

```text
tslenrn/
├── frontend/
│   ├── src/components/    # 页面组件（题目列表、题面、编辑器、结果面板）
│   ├── src/utils/api.ts   # 前端 API 调用
│   └── src/types/         # 前端类型定义
├── backend/
│   ├── src/problems/      # 题库与测试样例（唯一数据源）
│   ├── src/routes/        # execute/test/problems 接口
│   ├── src/services/      # Docker 执行器
│   ├── Dockerfile         # 执行镜像定义
│   └── build-docker.sh    # 镜像构建脚本
└── shared/
```

## 常见问题

### 1) `Execution timeout after 5000ms`

- 检查 Docker 是否可用：`docker run --rm node:18-alpine node -v`
- 确认执行镜像已构建：`cd backend && ./build-docker.sh`
- 如需更长运行时间，调大 `backend/.env` 的 `EXECUTION_TIMEOUT`

### 2) 判题结果和本地运行不一致

- 平台按 ACM 模式判题，必须从 `stdin` 读取输入、向 `stdout` 输出结果
- 注意换行与多行输出格式

### 3) 题库在哪里维护

- 统一在 `backend/src/problems/index.ts`
- 修改后重启后端生效
