# Street Corner Foodie · Web 部署

> 静态站点（`output: "static"`）。产物：`web/dist/`。  
> **推荐**：Cloudflare Pages + GitHub Actions（[deploy-cloudflare.yml](../../.github/workflows/deploy-cloudflare.yml)）。  
> **图片约 6 GB、不进 Git**：见 **[DEPLOY-R2.md](./DEPLOY-R2.md)**（R2 + 瘦 Pages 分包）。

## 正式域名

| 项 | 值 |
|----|-----|
| 目标域名 | **`streetcornerfoodie.com`**（见 [BRAND.md](../../BRAND.md)） |
| 构建变量 | GitHub **Repository variable** `SITE_URL` = `https://streetcornerfoodie.com` |
| 备用 | 未绑域名前可用 `https://street-corner-foodie.pages.dev` |

`SITE_URL` 写入 `astro.config.mjs` → canonical、sitemap、Open Graph。

## 本地构建

```bash
cd web
npm ci
ln -sf ../../asserts public/asserts   # Linux/macOS；Windows 用 junction
npm run sync:web-posters
npm run images:quick   # 或 npm run images（全尺寸）
SITE_URL=https://streetcornerfoodie.com npm run build
npm run preview
```

### 预览 `dist` 时注意

- **不要**用资源管理器双击 `dist/index.html`（`file://` 下模块脚本与气温 API 均无法正常工作）。
- **不要**用 Live Server 把仓库根目录当站点根（`/_astro/*.js` 会 404）。
- **请用** `npm run preview`（在 `web/` 目录），由 Astro 以 `http://localhost:4321` 正确托管 `dist/`。
- 首页气温卡片依赖联网访问 [Open-Meteo](https://open-meteo.com/)（浏览器 `fetch`）。

## Cloudflare Pages · 一次性设置

### 1. Cloudflare 账号

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**（可选，与 Actions 二选一）或仅 **Direct Upload** + 用本仓库 Actions 部署。

2. 若**仅用 GitHub Actions**（推荐与本仓库一致）：
   - 不必在 Dashboard 填 Build command（由 CI 构建后 `wrangler pages deploy` 上传 `dist`）。
   - 创建空项目名：**`street-corner-foodie`**（与 [wrangler.toml](../wrangler.toml) 一致）。

### 2. API Token

1. Cloudflare → **My Profile** → **API Tokens** → **Create Token**  
2. 模板：**Edit Cloudflare Workers**（含 Pages 部署权限）或自定义：
   - Account → **Cloudflare Pages** → **Edit**（缺此项时 deploy 报 `wrangler-action` / `exit code 1`）  
   - Account → **Account Settings** → **Read**  
3. 复制 token。  
4. **`CLOUDFLARE_ACCOUNT_ID`** 填仪表盘右侧 **Account ID**（32 位十六进制），**不是** Zone ID、不是邮箱。

**deploy 失败排查**：Actions → deploy job → **Deploy to Cloudflare Pages** 展开日志；常见 `Authentication error` / `10000` → 重建 Token 并更新 GitHub Secret。

### 3. GitHub Secrets / Variables

在仓库 **Settings → Secrets and variables → Actions**：

| 名称 | 类型 | 说明 |
|------|------|------|
| `CLOUDFLARE_API_TOKEN` | Secret | 上一步 token |
| `CLOUDFLARE_ACCOUNT_ID` | Secret | Cloudflare 仪表盘右侧 **Account ID** |
| `SITE_URL` | Variable | `https://scf.wu-jinsen.com`（或品牌域；无尾斜杠） |
| `PUBLIC_ASSET_ORIGIN` | Variable | `https://assets.wu-jinsen.com`（R2 自定义域；无尾斜杠） |

### 4. 自定义域名

1. Pages 项目 **street-corner-foodie** → **Custom domains** → **Set up a custom domain** → `streetcornerfoodie.com`（及可选 `www`）。  
2. 按提示在 DNS 添加 **CNAME** `streetcornerfoodie.com` → `street-corner-foodie.pages.dev`（或 Cloudflare 给出的 target）。  
3. 若域名已在 Cloudflare DNS，可一键 **Activate domain**。  
4. 确认 GitHub `SITE_URL` 与浏览器访问域名一致后，重新跑一次 deploy workflow。

### 5. 部署触发（自动）

| 事件 | GitHub Environment | Cloudflare 分支 | SITE_URL |
|------|------------------|-----------------|----------|
| Push **`main`** | production | `main` | `vars.SITE_URL` |
| Push **tag `v*`** | production | `main` | `vars.SITE_URL` |
| **Pull Request** | preview | `pr-<number>` | PR 预览子域（占位） |
| **workflow_dispatch** | 可选 preview / production | 手动 | 同上 |

Workflow：`.github/workflows/deploy-cloudflare.yml`  
手动：`Actions` → **deploy-cloudflare** → **Run workflow**。

### 6. 缓存

- [public/_headers](../public/_headers)：`/asserts/`、`/scf-img/`、`/_astro/` 长期缓存。  
- 大图勿提交 `public/scf-img/`（gitignore）；**每次 deploy 前 CI 会跑 `images:quick`**。

## Wrangler CLI（可选）

```bash
cd web
npm run build
npx wrangler pages deploy dist --project-name=street-corner-foodie --branch=main
```

需 `wrangler login` 或 `CLOUDFLARE_API_TOKEN` 环境变量。

## 其它托管

- **Vercel**：Root `web`，Build 同上，`SITE_URL` 环境变量。  
- **nginx**：`root` = `dist`；反代 `/asserts` 若分路径部署。

## CI（质量门）

`.github/workflows/scf-web.yml`：`check` + `build` + Lighthouse（与 deploy 独立；PR 可先绿再 deploy）。
