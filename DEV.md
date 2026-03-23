# SKYW 官网开发文档

> 项目：skyw.group 官网
> 主库：https://github.com/SKY-ZOU/skyw
> 线上：https://skyw-website.netlify.app
> 本地：http://127.0.0.1:3030/zh-CN
> 更新：2026-03-20

---

## 团队分工

| 角色 | 负责人 | 职责 |
|------|--------|------|
| 统筹 | 远谋 | 架构决策、代码规范、部署 |
| 开发 | 智行 | 功能开发、动画优化、性能 |
| 内容 | 文澜 | 三语文案、业务详情、文章 |
| 商务 | 致远 | 联系方式、合作文案、法律条款 |
| 协调 | 朱莉 | 跨频道信息传递、进度汇总 |

---

## 当前进度（2026-03-08）

### ✅ 已完成
- KKR 风格重设计（首页 + 动画体系）已部署线上
- 后台 CRUD（文章 / 办公室 / 业务板块 / 设置）完整
- 三语框架（zh-CN / zh-TW / en）已搭建
- Turso 云端数据库已接入，本地 `.env.local` 已配置
- **彩带动画重构**：三层 SVG path morphing，独立节奏 7s/9s/11s，mirror 无缝循环
- **全站字体规范化**：10 级语义变量，硬编码全部清零（136 处）
- **首页移动端响应式**：Hero 高度、section 间距、卡片标题已适配

### 🔄 进行中
- 智行：彩带动画流畅度进一步优化（关键帧、层次感）

### 📋 待办
| 优先级 | 任务 | 负责人 |
|--------|------|--------|
| P0 | 彩带动画优化（入场飘入感、6帧、层次） | 智行 |
| P0 | 其余页面移动端响应式（About / Insights / Contact） | 智行 |
| P0 | 性能：图片 lazy loading，will-change 审查 | 智行 |
| P1 | 三语文案校对补全（zh-TW 繁体、En 专业术语） | 文澜 |
| P1 | 六个业务详情页内容填充 | 文澜 |
| P1 | 行业洞察首发文章 2-3 篇 | 文澜 |
| P2 | 联系我们页面办公室地址确认 | 致远 |
| P2 | 商务合作文案 | 致远 |
| P2 | 法律条款页内容（需 Sky 审核） | 致远 |

---

## 开发规范

### 字体系统
> **重要：调字体大小只改 `src/app/globals.css` 里的变量，不要逐页修改**

```css
/* 在 globals.css @theme 中 */
--font-size-micro:      0.6875rem;   /* 11px — 极小标注 */
--font-size-caption:    0.75rem;     /* 12px — 标签/辅助 */
--font-size-body-sm:    0.8125rem;   /* 13px — 小正文 */
--font-size-body-md:    0.875rem;    /* 14px — 按钮/导航 */
--font-size-body:       0.9375rem;   /* 15px — 主正文 */
--font-size-lead:       1.0625rem;   /* 17px — 引导段落 */
--font-size-display:    clamp(1.625rem, 4vw, 3rem);   /* 中展示标题 */
--font-size-display-lg: clamp(2rem, 5vw, 4rem);       /* 大展示标题 */
```

用法示例：`text-body-sm`、`text-display-lg`、`text-caption`

### 颜色系统
- 品牌金：`text-gold-400`（#D4AF37）
- 深海蓝：`bg-navy-950`（#070B14）
- 正文灰：`text-[#6c757d]` 或 `text-navy-950/60`

### 彩带组件
- 文件：`src/app/[locale]/HomeClient.tsx` → `HeroRibbon` 函数（第 70 行起）
- 三层 SVG path morphing，变量在文件顶部 `RIBBON_KEYFRAMES` / `RIBBON_CONFIG`
- 调节速度改 `RIBBON_CONFIG` 里的 `duration`；调节透明度改 `opacity`

### 本地开发
```bash
cd /Volumes/imac/开发项目/SKYW天汇基金官网
npm run dev:3030          # 后台拉起并等待健康检查通过
npm run dev:3030:status   # 检查 3030 是否稳定可访问
npm run dev:3030:logs     # 看最近日志
npm run dev:3030:stop     # 停掉本地联调服务
```

说明：
- `npm run dev` 仍保留前台模式，适合临时调试。
- 联调统一使用 `dev:3030`，会写日志到 `.tmp/next-3030.log`，并校验 `http://127.0.0.1:3030/zh-CN` 是否返回成功。
- 若端口看起来“时好时坏”，先执行 `npm run dev:3030:restart`，再看 `npm run dev:3030:logs`。

### 部署
```bash
# Sky 确认后，远谋执行：
cd /Users/mac/.gemini/antigravity/scratch/skyw
netlify deploy --prod --skip-functions-cache
```

---

## 技术栈
- Next.js 16 + React 19 + Tailwind CSS 4
- Framer Motion 12 + Lenis 平滑滚动
- Prisma v7 + Turso（libsql 云端 SQLite）
- next-intl 三语（zh-CN / zh-TW / en）
- Netlify 部署

---

## 决策记录

| 日期 | 决策 | 原因 |
|------|------|------|
| 2026-03-08 | 字体规范化，用 CSS 变量统一管理 | 硬编码 136 处导致调整困难 |
| 2026-03-08 | 彩带改为 SVG path morphing | 静态 SVG 缺乏动态感 |
| 2026-03-08 | `@prisma/adapter-libsql/web` 接 Turso | Netlify serverless 环境要求 |
