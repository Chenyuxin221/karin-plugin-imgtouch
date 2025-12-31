# karin-plugin-imgtouch

一个为 Karin 机器人设计的增强型图片工具插件，提供“戳一戳随机图片”和“图片外显文本（Hitokoto 一言）”等功能。

## ✨ 功能特性

### 1. 戳一戳随机图片
- **随机响应**：当机器人被“戳一戳”时，随机从配置的分组中抽取并发送一张图片。
- **混合来源**：支持本地图片目录和网络 API 降级。
- **分组过滤**：支持白名单分组（groups）和黑名单过滤（excludedGroups）。

### 2. 图片外显文本 (Summary)
- **自动摘要**：通过 `hooks.sendMsg.message` 钩子，自动为所有发送的图片添加一段随机文本外显。
- **数据来源**：默认集成 Hitokoto（一言）API。
- **性能优化**：内置缓存机制，避免频繁请求 API。

## ⚙️ 配置文件说明

配置文件路径：`config/config.yaml`

### 戳一戳配置 (`poke`)
| 字段 | 说明 | 示例 |
| :--- | :--- | :--- |
| `baseDir` | 本地图片根目录（下属各分组子目录） | `"/home/hua/pokeImage/"` |
| `baseUrl` | 网络图片接口（支持 `{name}` 模板替换） | `"https://api.com/poke?n={name}"` |
| `groups` | 启用的图片分组列表 | `["崩铁", "龙图"]` |
| `excludedGroups` | 排除的分组（黑名单） | `[".git", "temp"]` |

### 图片外显配置 (`summary`)
| 字段 | 说明 | 示例 |
| :--- | :--- | :--- |
| `enable` | 是否启用图片外显功能 | `true` |
| `apiUrl` | 一言 API 地址 | `"https://v1.hitokoto.cn/?encode=text"` |
| `cacheDuration` | 接口调用缓存时间（毫秒） | `10000` |
| `fallbackText` | API 异常时的回退文本 | `"Enjoy the image"` |

## 🛠️ 安装

在 Karin 根目录执行：
```bash
pnpm add karin-plugin-imgtouch --workspace
```

---

# Karin TypeScript 插件开发模板 (原始文档)

- [前言](#前言)
- [快速开始](#快速开始)
- [详细开发流程](#详细开发流程)
- [常见问题与建议](#常见问题与建议)
- [贡献与反馈](#贡献与反馈)

---

## 前言

TypeScript 插件开发流程现在更加简单，无需手动克隆模板仓库，只需一条命令即可快速开始！

> TypeScript 编写 → 编译为 JS → 发布 NPM 包 → 用户安装

---

## 🚀 快速开始

```bash
pnpm create karin
```

- 按提示选择“ts插件开发模板”即可自动初始化项目。
- 进入新建的项目目录，继续开发。

---

## 详细开发流程

1. **一键创建项目**

   ```bash
   pnpm create karin
   ```

   - 选择“ts插件开发模板”
   - 填写你的插件名称（会自动作为 package.json 的 name）
   - 其余信息按提示填写

2. **安装依赖**

   ```bash
   pnpm install
   ```

3. **开发与调试**

   - 启动开发命令：
     ```bash
     pnpm dev
     ```
   - 编写你的插件代码于 `src/` 目录。
   - 编译输出：
     ```bash
     pnpm build
     ```
   - 调试编译之后的代码：
     ```bash
     pnpm app
     ```
   - 本地调试建议：
     - 可用 `pnpm link --global` 进行全局软链测试。
     - 或在 karin 根目录用 `pnpm add ../your-plugin-repo -w` 进行本地依赖测试。

4. **配置 NPM 秘钥**

   > 用于自动化发布，建议开启 2FA。

   1. 注册 [npmjs](https://www.npmjs.com/) 账号。
   2. 进入 `Access Tokens`，新建 `Classic Token`，类型选 `Automation`。
   3. 复制生成的 Token。
   4. 打开你的 GitHub 仓库 → Settings → Secrets and variables → Actions。
   5. 新建 `NPM_TOKEN`，粘贴 Token。
   6. 允许 GitHub Actions 创建和批准 PR（Settings → Actions）。

5. **设置包信息**

   > 包名必须唯一，建议先在 [npm](https://www.npmjs.com/) 搜索确认。

   - 初始化时填写的插件名会自动作为 package.json 的 name，无需手动修改。
   - 其他如 `author`、`description`、`homepage`、`bugs.url`、`repository` 可在 package.json 中补充完善。
   - **CI 配置无需再手动修改 package-name，已自动同步。**

6. **自动化发布**

   > 推送代码后，GitHub Actions 会自动编译并发布到 npm。

   - 常规开发流程：
     1. `git add . && git commit -m "feat: ..." && git push`
     2. 等待 CI 自动发布
     3. 发布成功后可在 npm 页面看到新版本

7. **安装与验证**

   - 在 karin 根目录下安装你的插件：
     ```bash
     pnpm add your-package-name -w
     ```
   - 验证插件是否生效，可查看 karin 启动日志或相关功能。

---

## 💡 常见问题与建议

- **Q: 发布失败怎么办？**
  - 检查 NPM_TOKEN 是否配置正确，权限是否足够。
  - 包名是否唯一，未被占用。
  - Actions 日志可定位具体报错。
- **Q: 如何本地调试插件？**
  - 推荐用 `pnpm link` 或本地依赖安装。
- **Q: 如何贡献代码？**
  - 欢迎 PR，建议先提 issue 讨论。

---

## 贡献与反馈

- 有任何建议或问题，欢迎在 [Issues](https://github.com/KarinJS/karin-plugin-template-ts/issues) 提出。
- 也可加入官方交流群交流经验。
