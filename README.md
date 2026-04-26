# karin-plugin-imgtouch

一个给 Karin 用的图片插件，提供两个功能：

- 机器人被戳一戳时随机发送图片
- 给发送中的图片补一段外显文本

## 功能

### 戳一戳随机图片

- 监听 `notice.groupPoke`
- 只在目标是机器人自己时响应
- 从配置分组里随机挑选一组图片
- 优先读取本地图片目录，本地不可用时可降级到网络接口

### 图片外显文本

- 通过 `hooks.sendMsg.message` 给图片元素补 `summary`
- 默认使用 Hitokoto 接口
- 带简单缓存，避免频繁请求接口

## 安装

这个插件支持两种安装方式，二选一即可。

### 方式一：作为本地插件使用

适合直接放进 Karin 的 `plugins/` 目录开发和修改。

```bash
cd /path/to/karin/plugins
git clone https://github.com/Chenyuxin221/karin-plugin-imgtouch.git
```

然后在 Karin 根目录重启：

```bash
ki rs
```

### 方式二：作为 npm 插件安装

适合不改源码，直接作为依赖使用。

```bash
cd /path/to/karin
pnpm add karin-plugin-imgtouch -w
ki rs
```

### 注意

不要同时：

- 把仓库放在 `plugins/karin-plugin-imgtouch`
- 又在根目录 `package.json` 里安装 `karin-plugin-imgtouch`

`node-karin` 会同时扫描 `plugins/` 和根依赖。两边都存在时，插件会被加载两次，表现出来通常就是戳一戳触发两次。

## 配置

配置文件位置：

```text
@karinjs/karin-plugin-imgtouch/config/config.yaml
```

默认配置如下：

```yaml
poke:
  baseDir: "/home/hua/pokeImage/"
  baseUrl: ""
  groups:
    - "阿尼亚"
    - "崩三"
    - "崩铁"
  excludedGroups:
    - "api_server"
    - "node_modules"
    - ".git"

summary:
  enable: true
  apiUrl: "https://v1.hitokoto.cn/?encode=text"
  cacheDuration: 10000
  fallbackText: "Karin Random Image Summary"
```

### `poke`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `baseDir` | `string` | 本地图片根目录 |
| `baseUrl` | `string` | 网络图片接口地址。本地图片不可用时使用，支持 `{name}` 模板 |
| `groups` | `string[]` | 可参与随机的分组名称 |
| `excludedGroups` | `string[]` | 排除的分组名称 |

说明：

- 插件会先从 `groups` 里随机选一个分组
- `excludedGroups` 命中的分组会被过滤
- 如果 `baseDir` 可用，会读取 `${baseDir}/${groupName}` 下的图片
- 如果本地目录不存在、不可访问或为空，并且配置了 `baseUrl`，则回退到网络接口

当 `baseUrl` 包含 `{name}` 时，会直接替换：

```text
https://example.com/poke?name={name}
```

如果不包含 `{name}`，插件会自动追加查询参数：

```text
https://example.com/poke?name=崩铁
```

### `summary`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 是否启用图片外显 |
| `apiUrl` | `string` | 文本接口地址 |
| `cacheDuration` | `number` | 缓存时长，单位毫秒 |
| `fallbackText` | `string` | 接口失败时使用的回退文本 |

## 本地图片目录

如果你使用本地图库，目录结构需要和分组名称对应：

```text
/home/hua/pokeImage/
├── 崩铁/
│   ├── 1.jpg
│   ├── 2.png
│   └── 3.gif
├── 阿尼亚/
│   ├── 1.webp
│   └── 2.jpg
└── 真寻/
    └── 1.png
```

当前支持的图片扩展名：

- `.jpg`
- `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.bmp`
- `.svg`

## 使用建议

### 推荐工作流

如果你会经常改插件代码，直接用 `plugins/` 方式即可，简单直接，也方便热更新和排查。

### 关于图片外显

图片外显会作用于发送流程里的图片元素，不只限于戳一戳图片。只要消息元素里有图片，并且当前图片还没有 `summary`，插件就会尝试补一段文本。

## 常见问题

### 戳一戳触发两次

优先检查是否同时用了两种安装方式。

排查方法：

1. 看 `plugins/karin-plugin-imgtouch` 是否存在
2. 再看 Karin 根目录 `package.json` 里是否还有 `karin-plugin-imgtouch` 依赖

只保留一种即可。

### 本地图片不发送

按下面顺序检查：

1. `baseDir` 是否写对
2. 分组目录名是否和 `groups` 里的名称一致
3. 分组目录里是否真的有图片文件
4. 当前分组是否被 `excludedGroups` 排除了
5. 如果本地目录不可用，是否配置了可访问的 `baseUrl`

### 修改配置后不生效

先确认改的是实际生效的配置文件：

```text
@karinjs/karin-plugin-imgtouch/config/config.yaml
```

插件会监听配置文件变化，但如果你同时改了多份配置或者当前进程状态异常，直接执行一次：

```bash
ki rs
```

## 开发

```bash
pnpm install
pnpm build
```

本地开发调试：

```bash
pnpm dev
```
