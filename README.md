# TypeScript ACM 学习与判题平台

一个基于 React + Express 的 TypeScript 在线练习平台，采用 **ACM 输入输出** 方式，支持运行、判题、学习路径筛选，以及本地多用户档案管理。

## 主要功能

- 200 道题目（核心 / 强化 / 挑战三条学习路径）
- 桌面端三栏工作区（题面 / 编辑器 / 输入输出与测试）
- 移动端题面、编辑、结果分段切换
- Monaco 编辑器（TypeScript 语法高亮与类型提示）
- 代码运行与自动判题（公开 + 隐藏测试用例）
- 执行模式切换（`auto` / `docker` / `local`）
- 本地用户档案（创建、重命名、删除）
- 用户隔离保存（草稿、最近题号、判题模式、输入与结果页签）

> 当前“用户”是浏览器本地档案（localStorage），不会自动同步到后端或其他设备。

## 技术栈

- Frontend: React 19, TypeScript, Vite, TailwindCSS, Monaco
- Backend: Node.js, Express, TypeScript
- Shared contracts: `@tslenrn/shared`

## 环境要求

- Node.js 18+
- npm
- Docker（推荐，用于隔离执行）

## 快速开始

### 1) 安装依赖

```bash
npm run install:all
```

### 2) 配置后端环境变量

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

### 3) 构建执行镜像（可选但推荐）

```bash
cd backend
./build-docker.sh
```

### 4) 启动开发环境

```bash
npm run dev
```

访问地址：

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 执行模式说明

- `executorMode=auto`：优先 Docker；Docker 不可用时，仅在 `ALLOW_UNSAFE_LOCAL_EXECUTION=true` 时自动回退本地
- `executorMode=docker`：强制 Docker（不可用时报错）
- `executorMode=local`：显式本地执行（无容器隔离）
- `ALLOW_UNSAFE_LOCAL_EXECUTION=false`（默认）：只禁止 **auto** 自动回退，不影响显式 `local`

## 使用流程

1. 进入平台先选择本地用户（可创建、重命名、删除）
2. 选择题目并阅读题面
3. 在编辑器编写 TypeScript 代码（从 `stdin` 读取，写入 `stdout`）
4. 在右侧输入区域填写 ACM 输入
5. 点击“运行”查看输出，或“提交测试”执行判题

## API 概览

- `GET /api/health`：健康检查
- `GET /api/problems`：题目列表
- `GET /api/problems/stats`：题库统计（难度 / 路径 / 模块）
- `GET /api/problems/:id`：题目详情（公开测试）
- `GET /api/executor/capabilities`：执行器能力（Docker 可用性、自动回退策略、支持模式）
- `POST /api/execute`：运行代码
  - body: `{ code: string, input?: string, executorMode?: 'auto' | 'docker' | 'local' }`
- `POST /api/test`：判题
  - body: `{ code: string, problemId: number, executorMode?: 'auto' | 'docker' | 'local' }`

### 错误响应约定

- 参数错误：`400`
- 执行/编译/超时等用户代码失败：`422`
- 运行环境不可用（如 Docker 不可用）：`503`
- 未处理内部异常：`500`

错误响应体统一包含：

```json
{
  "success": false,
  "error": "message",
  "errorCode": "CODE"
}
```

## 常用命令

### 根目录

- `npm run dev`：同时启动前后端开发服务
- `npm run build`：构建 shared + frontend + backend
- `npm run install:all`：安装 workspace 依赖

### Frontend

- `cd frontend && npm run dev`
- `cd frontend && npm run build`
- `cd frontend && npm run lint`
- `cd frontend && npm test`

### Backend

- `cd backend && npm run dev`
- `cd backend && npm run build`
- `cd backend && npm test`

### 一键校验

```bash
./verify.sh
```

会执行：build、frontend lint、frontend test、backend test，并附带后端 health 可达性提示。

## 目录结构

```text
tslenrn/
├── frontend/
│   ├── src/components/      # 页面组件（工作区、题面、结果、用户选择）
│   ├── src/hooks/           # 业务 Hook（题目、草稿、运行、用户档案）
│   ├── src/state/           # 前端状态与纯逻辑
│   ├── src/utils/           # API 与本地存储工具
│   └── src/types/           # 前端类型映射
├── backend/
│   ├── src/problems/        # 题库与样例
│   ├── src/routes/          # API 路由
│   ├── src/services/        # 执行器、判题、题库服务
│   └── src/utils/           # 校验、错误映射
├── shared/
│   ├── types.ts             # 前后端共享契约
│   └── userProfiles.ts      # 用户名规则共享逻辑
├── setup.sh
├── diagnose.sh
└── verify.sh
```
