---
publish: true
created: 2026-06-01T07:43:13.079+08:00
modified: 2026-06-01T14:26:46.854+08:00
tags:
  - build
---

# 从零搭建：用 Obsidian + Quartz 把笔记发布成自己的数字花园

> 一份「踩坑实录版」教程。目标：在 Obsidian 里写笔记，标记一下就能自动发布到你自己的域名上，私人笔记永远不外泄。
>
> 适合：**没怎么碰过命令行**的人。我自己就是从「node / git 完全没装过」一路搭通的。

---

## 这套系统长什么样

先理解三个东西的关系，这是最容易绕晕的地方——**它们不是三选一，而是各司其职**：

- **Quartz** = 网站生成器（引擎）。把 Markdown 变成真正的网站。
- **Quartz Syncer** = 一个 Obsidian 插件。负责「把你勾选的笔记推送给 Quartz」。它不生成网站，只负责投喂。
- **Cloudflare Pages** = 托管。把 Quartz 生成的网站放到网上，接你的域名。

数据怎么流动：

```
Obsidian 笔记库
   │  （只推送标了 publish: true 的笔记）
   ▼
Quartz Syncer 插件
   │  （推送到 GitHub 仓库的 content/ 文件夹）
   ▼
GitHub 仓库（你的 Quartz 项目）
   │  （每次有变化，自动触发）
   ▼
Cloudflare Pages（build + 部署）
   ▼
你的域名 ✨
```

**核心安全模型**：一个大库里私人笔记和想公开的笔记混在一起，只有你**亲手标了 `publish: true`** 的那几篇才会出门。没标的根本不会进 GitHub 仓库。这样你不用维护两个库（实测：第二个库你永远不会更新它）。

---

## 准备工作

你需要：

- 一台 Mac（Windows/Linux 思路一样，命令略不同）
- 一个域名（我的在 Cloudflare）
- 一个 GitHub 账号
- 装好 Obsidian

先在终端确认工具齐了（Mac 自带 git，node 可能要装）：

```bash
node -v       # 需要 v22 或更高
npm -v        # 需要 10.9.2 或更高
git --version # 有版本号就行
```

缺 node 就用 Homebrew 装：`brew install node`。
没装 Homebrew 先去 brew.sh 装官方的。

---

## 里程碑 1：本地把 Quartz 跑起来

```bash
cd ~                # 或你放项目的目录
git clone https://github.com/jackyzha0/quartz.git
cd quartz
npm i
npx quartz create
```

`npx quartz create` 是交互式的，会问你：

1. **选模板** → 选 **Obsidian**（专为 Obsidian 发布优化，自动开好 wikilink、callout 等，还自动跳过链接解析那一问）
2. **content 策略** → 选 **Empty Quartz**（空的，以后让 Syncer 往里填。⚠️ 别选 symlink 或 copy，那会把你整个库拖进去，破坏「只发布标记笔记」的安全模型）
3. **base URL** → 填你的域名，不带 `https://`（比如 `clemmiechen.cc`）。之后能改，别纠结。

然后装模板需要的插件、本地预览：

```bash
npx quartz plugin install --from-config
npx quartz build --serve
```

打开 http://localhost:8080 能看到网站雏形，就算通关。Ctrl+C 停掉。

---

## 里程碑 2：推上 GitHub

先在 GitHub 建一个**空仓库**（[github.com/new](https://github.com/new)）：

- 名字随意（我叫 `whim-garden`）
- 建议 **Private**（私有；网站照样能公开，私有只是多一层保险，见下方「踩坑」）
- ⚠️ **README / .gitignore / license 一个都别勾**（本地 Quartz 已自带，勾了会冲突）

配 git 身份（第一次用 git 要设）：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的GitHub邮箱"
```

连接并推送：

```bash
git remote set-url origin https://github.com/你的用户名/仓库名.git
npx quartz sync --no-pull
```

`--no-pull` = 别先从空仓库拉取，避免报错。

> 如果你配过 SSH，可以用 SSH 地址（`git@github.com:用户名/仓库名.git`）代替，推送时不用输令牌，更省事。

---

## 里程碑 3：Cloudflare Pages 部署 + 接域名

1. [Cloudflare 控制台](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application**

2. ⚠️ 它默认引导你建 **Worker**，但你要的是 **Pages**！找到底部 **"Looking to deploy Pages? Get started"** 点进去

3. **Connect to Git** → 授权 GitHub（只勾你那个仓库）→ 选中仓库

4. Build 设置（**逐项照填，最容易错**）：

   | 项目 | 值 |
   |---|---|
   | Production branch | **`v5`** ⚠️ 不是 main！ |
   | Framework preset | None |
   | Build command | `npx quartz plugin install --from-config && npx quartz build` |
   | Build output directory | `public` |

5. 展开 **Environment variables**，加一个 **`NODE_VERSION` = `22`**（Cloudflare 默认 Node 太老，不加会 build 失败）

6. **Save and Deploy**，等 1~2 分钟，先打开给的 `xxx.pages.dev` 临时网址确认正常

**接域名**（域名在 Cloudflare 的话超简单）：

- 进项目 → **Custom domains** → **Set up a custom domain** → 输入域名 → Cloudflare 自动建 DNS，点确认
- 等状态变 **Active**（几分钟，SSL 证书签发偶尔久点）

别忘了：如果接的是子域名，要把 `quartz.config.yaml` 里的 `baseUrl` 改成对应地址，再 `npx quartz sync` 推一次。

---

## 里程碑 4：配 Quartz Syncer，打通「写→发」闭环

这是最后一步，也是整套系统的意义所在。

**1. 装插件**：Obsidian → Settings → Community plugins → Browse → 搜 "Quartz Syncer" → Install → Enable

**2. 生成 GitHub 令牌**（给 Syncer 的「代写钥匙」，权限卡死）：

- [github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens) → Generate new token → **Fine-grained token**
- Repository access → **Only select repositories** → 只勾你的仓库
- Permissions → 搜 **`Contents`**（⚠️ 不是搜 "read"！权限按名字搜）→ 选中后级别设为 **Read and write**
- （GitHub 会自动带上 Metadata: Read-only，正常，别删）
- Generate token → **令牌只显示一次，立刻复制**

**3. 填 Syncer 设置**：

- Remote URL / Repository：你的仓库
- Branch：**`v5`**
- Username：你的 GitHub 用户名
- Access Token：粘贴刚才的令牌
- 看到 **read: ok / write: ok**（或绿色对勾）= 成功
- Vault root folder：保持 `/` 即可（安全闸门是 `publish` 标记，不是这个文件夹）

**4. 发布一篇笔记**：

- 笔记顶部加 frontmatter：
  ```yaml
  ---
  title: 标题
  publish: true
  ---
  ```
- 左栏点 Quartz 水晶图标，或 Cmd+P → **Quartz Syncer: Open Publication Center**
- 笔记出现在列表 → 点开看 diff → 勾选 → **Publish**
- Cloudflare 自动重新 build（1~2 分钟）→ 刷新你的域名，笔记出现了 🎉

---

## 踩坑实录（最有价值的部分）

这些是我真实卡住过的地方，按出现顺序排：

### 1. 插件装不上：报「需要 Obsidian 1.13.0」

最新版 Quartz Syncer 要求的 Obsidian 版本可能还没正式发布（catalyst 内测版）。**解决**：用社区商店装（它会自动给你装兼容的旧版本），或用 BRAT 锁定一个旧版本号（如 `1.15.3`）。别硬追最新版。

### 2. 手动装的插件「打不开」

手动安装时如果开关是灰的打不开，多半是版本不兼容（同上）。手动装只需 `main.js` / `manifest.json` / `styles.css` 三个文件，**不是** Source code。

### 3. 想预览模板长什么样

Quartz 的 Default 和 Obsidian 模板**外观几乎一样**，区别在底层功能不在长相。直接看官网 quartz.jzhao.xyz 就是 Default 的样子。别为了看模板装一遍删一遍。

### 4. `npx quartz tui` 直接崩溃

TUI（可视化配置工具）有个 bug：遇到内置插件会报 `source.startsWith is not a function`。**这不是你的错，是 TUI 自己的 bug**。它本质只是个改 `quartz.config.yaml` 的菜单，直接手动编辑这个文件完全能替代。建议干脆别装 TUI（它还依赖 Bun，留着可能影响 Cloudflare 构建）。

### 5. build 报 `fetch failed` / `CustomOgImages`

这是「社交分享缩略图」插件在 build 时联网下载字体失败（默认从 Google 拉）。**它非必需**。临时解法：在 `quartz.config.yaml` 里把这个插件 `enabled: false`。

### 6. Cloudflare build 失败：`Could not resolve "../../.quartz/plugins"`

插件编译产物（`.quartz/plugins`）没推上 GitHub，Cloudflare 那边缺。**解法**：把 Cloudflare 的 build command 改成 `npx quartz plugin install --from-config && npx quartz build`（先装插件再 build）。

### 7. Cloudflare 用了 Node 18，版本太老

build 日志最后会显示 `Node.js v18.x`。**解法**：加环境变量 `NODE_VERSION = 22`。

### 8. 分支搞错

Quartz 5 的代码在 **`v5`** 分支，不是 `main`。Cloudflare 的 Production branch 和 Syncer 的 Branch 都必须填 `v5`，否则找不到代码 / 不更新。

### 9. 域名之前绑过 GitHub Pages

旧的 DNS 记录（指向 `xxx.github.io` 的 CNAME，或 `185.199.x.x` 的 A 记录）要在 Cloudflare 的 DNS → Records 里删掉，否则冲突。删 DNS 前看清楚，别误删邮箱等其它记录。

### 10. 令牌权限搜不到

生成令牌时，权限搜索框要搜权限**名称** `Contents`，不是搜 "read/write"。读写级别是选中后在右边下拉里调。

### 11. 发布时提示「index.md 被删」

正常现象。Syncer 让仓库内容 = 你标记的笔记集合，默认首页 `index.md` 没被你标记所以它要删。**测试时先取消勾选这条删除**，等你自己写一篇 `index` 当首页（标 `publish: true`）再替换。

---

## 核心经验，一句话版

- **三件套各司其职**：Quartz 做网站 / Syncer 投喂笔记 / Cloudflare 托管。
- **默认私密，手动公开**：`publish: true` 是唯一的发布闸门。
- **网上教程多是 Quartz v4 的**，注意 v5 的差异：`v5` 分支、`npx quartz plugin install --from-config`、TUI 等都是 v5 才有的。
- **遇到 build 失败先看日志最后几行**：八成是分支(`v5`)、Node 版本(`22`)、或插件未安装这三件事之一。
- **私有仓库 + 公开网站**是完全正常的组合：仓库管「谁能看源码」，网站公开是 Cloudflare 那边独立的事。

搭完之后的日常就一句话：**在 Obsidian 写笔记 → 想公开的标 `publish: true` → 发布中心点一下 → 几分钟后上线。**

祝你也搭出自己的花园 🌱
