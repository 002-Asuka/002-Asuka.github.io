# OrangeOne的博客

一个用来发随笔的中文博客。使用你提供的雪山与金色草地照片作为背景，主页上方展示博客名称，下方左侧为头像卡片、右侧为随笔列表，保留透明毛玻璃效果。支持手机阅读、Markdown 文章、时间归档和草稿。

视觉方向参考 [XinghuisamaBlogs](https://github.com/heiehiehi/XinghuisamaBlogs)，页面代码独立实现。背景位于 `public/images/golden-field.webp`，由用户提供的原图生成网页压缩版本。

主页头像位于 `public/images/avatar.webp`，可替换为自己的图片。

GitHub Pages 免费版支持本博客，首次发布采用公开仓库。参考项目中的 AI 助手等服务端功能不包含在此静态博客内。

## 平时怎么发文章（不用在电脑上安装软件）

1. 打开 GitHub 仓库的 `src/content/posts` 文件夹。
2. 点击 **Add file → Create new file**，文件名写成 `2026-10-09-my-day.md`。日期和名字换成自己的，名字用英文字母与连字符。
3. 复制下面的模板，改标题、日期和正文：

```markdown
---
title: 今天想记下的一件事
description: 一句话简介。
date: 2026-10-09
tags: [日常]
draft: false
---

今天的正文。从这里开始写。

## 也可以有小标题

一段话，**一些重点**。

> 想留住的一句话。
```

4. 点击 **Commit changes**，提交到 `main`。Actions 构建成功后网站会自动更新。

未写完的文章把 `draft` 设为 `true`，网站不会展示；这只是隐藏网页内容，Markdown 文件仍在仓库中。日期用于排序，不是定时发布开关。首页的示例随笔可以改写，也可以删除。

### 发图片

把图片上传到文章文件所在的 `src/content/posts` 文件夹，再写 `![图片说明](./photo.jpg)`，Astro 会处理并打包本地图片。也可以使用可信图片链接。不要把图片路径写成电脑上的 `C:\...`。

### 换名字和自我介绍

- 修改根目录 `site.json` 的 `title`、`description`、`author`。
- 修改 `src/pages/about.astro` 中的介绍文字。

## 首次发布到 GitHub Pages

1. 在 `002-Asuka` 账号下新建公开仓库 `002-Asuka.github.io`。如果这个仓库已经存在，不要覆盖它；可新建 `notes`，配置会自动适配子路径。
2. 上传本项目的源文件，包括 `.github/workflows/deploy.yml`、`pnpm-lock.yaml` 和其他配置文件。不要上传 `node_modules`、`.astro`、`.pnpm-store`、`.qa`、`dist`。
3. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
4. 在 **Actions → Publish blog → Run workflow** 手动运行一次，或者提交一次改动。
5. 等待成功，Pages 页面会显示网站的真实地址。

工作流在每次向 `main` 提交时自动发布。若用其他仓库名，GitHub 构建时会自动从仓库信息推导站点地址和路径，不用改代码；本地预览新仓库路径时需同步改 `site.json` 的 `repository`。

## 本地写作（可选）

需要 Node.js 24 和 pnpm 11.25.0。

```shell
pnpm install
pnpm dev
pnpm new "我的一篇随笔" my-note
pnpm build
```

`pnpm new` 默认创建草稿；把 `draft` 改为 `false` 后发布。文件名将成为文章网址，发布后尽量不改文件名，以免旧链接失效。

## 架构

- Astro 7：构建静态页面，阅读不需要 JavaScript。
- `src/content/posts/*.md`：文章。
- `src/pages`：首页、归档、关于和文章页面。
- `src/styles/global.css`：样式。
- GitHub Actions + GitHub Pages：自动构建发布。

参考：[Astro 部署说明](https://docs.astro.build/en/guides/deploy/github/) · [GitHub Pages 配置说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
