# Street Corner Foodie · Cloudflare R2 部署方案

> **目标**：GitHub 只放代码；约 6 GB 图片放 **R2**；静态页放 **Cloudflare Pages**。  
> 与 [DEPLOY.md](./DEPLOY.md) 互补；以 R2 为图片真源时，本方案为主路径。

---

## 1 · 架构总览

```text
┌─────────────────────────────────────────────────────────────────┐
│  GitHub（master）                                                 │
│  web/src · docs · 无 asserts/ · 无 design/                       │
└────────────────────────────┬────────────────────────────────────┘
                             │ push → GitHub Actions
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Build job（ubuntu）                                              │
│  1. 从 R2 拉 asserts/（或 runner 缓存）→ junction public/asserts   │
│  2. npm run images:quick → public/scf-img/                       │
│  3. PUBLIC_ASSET_ORIGIN=… npm run build → dist/（仅页面 + 引用 URL）│
│  4. rclone/wrangler 增量同步 asserts + scf-img → R2              │
│  5. 从 dist 删除 asserts/、scf-img/ → 上传「瘦 dist」到 Pages       │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────────┐
│ Cloudflare Pages     │               │ Cloudflare R2            │
│ streetcornerfoodie…  │               │ 桶：scf-assets（示例名）    │
│ ~50–200 MB dist      │               │ asserts/**  (~2.8 GB)    │
│ HTML / _astro / …    │               │ scf-img/**  (~2–3 GB)    │
└─────────────────────┘               └───────────┬─────────────┘
                                                  │
                                                  ▼
                                    ┌─────────────────────────┐
                                    │ 自定义域名（R2 公开访问）   │
                                    │ assets.streetcornerfoodie.com │
                                    │ 或 pub-*.r2.dev（仅测试）   │
                                    └─────────────────────────┘
```

**浏览器请求**

| 类型 | URL 示例 |
|------|----------|
| 页面 | `https://streetcornerfoodie.com/cn/…` → Pages |
| 原图 | `https://assets.streetcornerfoodie.com/asserts/Gourmet%20recipe2/…` → R2 |
| 衍生品 | `https://assets.streetcornerfoodie.com/scf-img/{hash}/720.webp` → R2 |

构建时通过环境变量 **`PUBLIC_ASSET_ORIGIN`**（实现见下文「阶段 3」）把页面里的 `/asserts/`、`/scf-img/` 写成绝对 CDN 地址。

---

## 2 · 前置条件

| 项 | 说明 |
|----|------|
| Cloudflare 账号 | 已添加域名 `streetcornerfoodie.com`（或先用 `*.pages.dev` 测） |
| 本地 | 完整 `asserts/`、`web/` 可构建；Windows 用 junction `web\public\asserts` |
| GitHub | 已有 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`（见 [DEPLOY.md](./DEPLOY.md)） |
| 工具（本机一次性上传） | [Wrangler](https://developers.cloudflare.com/workers/wrangler/) 或 [rclone](https://rclone.org/) |

**R2 免费档（参考）**：10 GB 存储 + 出站免费；你当前约 6 GB 在免费存储内，出站不计费。

---

## 3 · 阶段 0 · Cloudflare 控制台（一次性）

### 3.1 创建 R2 桶

1. Dashboard → **R2** → **Create bucket**
2. 名称示例：`scf-assets`（全局唯一，可自定）
3. 位置：选离主要访客近的（亚太可先 **APAC**）

### 3.2 允许公开读（自定义域名，推荐）

**前置（必做，否则报 “domain was not found on your account”）**

R2 自定义域名**只接受**「已在本 Cloudflare **账号**内、且 **DNS 由 Cloudflare 托管**」的域名，例如 `example.com`、`www.example.com`、`assets.example.com`。  
填 `assets.streetcornerfoodie.com` 之前，必须先有 **Zone** `streetcornerfoodie.com`：

1. Dashboard → **Websites** → **Add a site** → 输入 `streetcornerfoodie.com`
2. 在域名注册商把 **Nameserver** 改成 Cloudflare 给出的两条（或按「仅 DNS」流程接入）
3. 等站点状态为 **Active**（橙云可用）
4. 确认 R2 桶与 Pages 在**同一** Cloudflare 账号（右上角切换账号核对）

仅把 Pages 绑在 `*.pages.dev`、或域名还在 GoDaddy/阿里云 DNS **未迁入 Cloudflare**，都会出现：

> *That domain was not found on your account. Public bucket access supports only domains on your account and managed through Cloudflare DNS.*

**绑定 R2 域名**

1. 桶 → **Settings** → **Public access** → **Allow Access**（或 **Connect domain**）
2. **Custom Domain** → 填 **`assets.streetcornerfoodie.com`**（不要带 `https://` 或路径）
3. Cloudflare 会在该 Zone 下**自动**创建指向 R2 的 DNS 记录（一般无需手填 CNAME）
4. **Minimum TLS version (advanced)** 保持默认即可；与 “domain not found” 无关
5. 记下源站根 URL：`https://assets.streetcornerfoodie.com`（**无尾斜杠**）

> **临时测试**：桶 → Public access → 启用 **`pub-xxxx.r2.dev`**，把 `PUBLIC_ASSET_ORIGIN` 设为该 URL；生产仍应用自定义子域。

| 现象 | 处理 |
|------|------|
| domain not found | 先完成上表「前置」；子域必须在已 Active 的 apex 下 |
| 域名在别的 CF 账号 | 把 Zone 迁到本账号，或在本账号重新 Add site |
| 只想先传图、不管域名 | 用 `pub-*.r2.dev` + rclone，稍后再绑 `assets.` |

### 3.3 CORS（若控制台有配置项）

允许站点源访问图片时设置：

| 项 | 值 |
|----|-----|
| Allowed Origins | `https://streetcornerfoodie.com`, `https://*.pages.dev`, `http://localhost:4321` |
| Allowed Methods | `GET`, `HEAD` |
| Allowed Headers | `*` |

（也可用 Wrangler `r2 bucket cors` 写入 JSON。）

### 3.4 API Token（CI 用）

在 **My Profile → API Token** 创建，权限至少：

- Account → **R2** → Edit  
- Account → **Cloudflare Pages** → Edit（已有可复用）

Secrets（GitHub → Settings → Secrets）：

| Secret | 说明 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | 已有 |
| `CLOUDFLARE_ACCOUNT_ID` | 已有 |
| `R2_BUCKET_NAME` | 例 `scf-assets` |

Variables：

| Variable | 示例 |
|----------|------|
| `SITE_URL` | `https://streetcornerfoodie.com` |
| `PUBLIC_ASSET_ORIGIN` | `https://assets.streetcornerfoodie.com` |

---

## 4 · 阶段 1 · 本机首次上传 R2（真源入库）

在**有完整 `asserts/` 的机器**上执行。

### 4.1 生成 scf-img（若尚未生成）

```powershell
cd d:\work\moli_project\meishi\web
npm ci
# junction 已指向 ..\..\asserts
npm run images:quick
```

### 4.2 用 Wrangler 同步到 R2

```powershell
cd d:\work\moli_project\meishi\web
npx wrangler login

# 上传原图（路径与站点一致：桶内键为 asserts/...）
npx wrangler r2 object put --help
# 批量建议用 rclone（见下）或仓库脚本 scripts/sync-r2-assets.ps1（若已添加）
```

**推荐 rclone**（大目录增量同步）：

```ini
# %AppData%\rclone\rclone.conf 片段
[scf-r2]
type = s3
provider = Cloudflare
access_key_id = <R2 Access Key ID>
secret_access_key = <R2 Secret Access Key>
endpoint = https://<ACCOUNT_ID>.r2.cloudflarestorage.com
acl = private
```

```powershell
# 从仓库根执行
rclone sync "d:\work\moli_project\meishi\asserts" scf-r2:scf-assets/asserts --progress
rclone sync "d:\work\moli_project\meishi\web\public\scf-img" scf-r2:scf-assets/scf-img --progress
```

R2 Access Key：Dashboard → R2 → **Manage R2 API Tokens** → 创建仅写/读写该桶的 token。

### 4.3 校验

浏览器打开（替换路径为真实文件）：

- `https://assets.streetcornerfoodie.com/asserts/Gourmet%20recipe2/cn/hainan/某个已定稿_poster.png`
- `https://assets.streetcornerfoodie.com/scf-img/<hash>/720.webp`

能 200 即 R2 + 域名 OK。

---

## 5 · 阶段 2 · 构建「瘦 dist」部署 Pages

原则：**不要把 6 GB 打进 Pages**，只上传 HTML/JS/CSS。

### 5.1 本机完整构建

```powershell
cd d:\work\moli_project\meishi\web
$env:SITE_URL = "https://streetcornerfoodie.com"
$env:PUBLIC_ASSET_ORIGIN = "https://assets.streetcornerfoodie.com"
npm run sync:web-posters
npm run images:quick
npm run build
```

### 5.2 从 dist 移除大目录（再部署）

```powershell
Remove-Item -Recurse -Force dist\asserts, dist\scf-img -ErrorAction SilentlyContinue
(Get-ChildItem dist -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
# 预期几十～两百 MB 量级
```

### 5.3 部署 Pages

```powershell
npx wrangler pages deploy dist --project-name=street-corner-foodie --branch=main
```

---

## 6 · 阶段 3 · 代码改动（构建时 CDN 前缀）

当前站点写死 `/asserts/`、`/scf-img/`。上线 R2 需增加**单一前缀**（实现时二选一）：

| 方案 | 做法 | 优点 |
|------|------|------|
| **A · 环境变量**（推荐） | `PUBLIC_ASSET_ORIGIN` + `publicAssetUrl()` 在 `scf-image.ts`、`assert-path.ts`、`posters.ts` 等统一前缀 | 清晰、本地不设变量仍走相对路径 |
| **B · Pages Worker** | Functions 把 `/asserts/*` 反代到 R2 | 可不改 Astro；需维护 Worker |

**方案 A 要点**（待实现）：

```ts
// web/src/lib/public-asset-origin.ts
export const PUBLIC_ASSET_ORIGIN =
  import.meta.env.PUBLIC_ASSET_ORIGIN?.replace(/\/$/, "") ?? "";

export function publicAssetUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return PUBLIC_ASSET_ORIGIN ? `${PUBLIC_ASSET_ORIGIN}${p}` : p;
}
```

- `getScfPicture` 返回的 `fallback` / srcset 走 `publicAssetUrl`
- `optimize-images.mjs` manifest 仍用 `/asserts/…` 作 key（构建机本地路径不变）
- 本地开发：**不设置** `PUBLIC_ASSET_ORIGIN` → 仍用 junction `/asserts/`

---

## 7 · 阶段 4 · GitHub Actions（推荐流水线）

在现有 [deploy-cloudflare.yml](../../.github/workflows/deploy-cloudflare.yml) 上调整：

```text
checkout
  → 安装 Node
  → [NEW] rclone sync R2:scf-assets/asserts → ../asserts（供 sharp 读）
  → ln -sf ../../asserts public/asserts
  → npm run sync:web-posters && npm run images:quick
  → env PUBLIC_ASSET_ORIGIN + SITE_URL → npm run build
  → [NEW] rclone sync public/scf-img → R2:scf-assets/scf-img
  → [NEW] rclone sync ../asserts → R2:scf-assets/asserts（仅变更，可选 nightly）
  → [NEW] rm -rf dist/asserts dist/scf-img
  → upload-artifact（瘦 dist）
  → wrangler pages deploy
```

**触发路径**：`web/**` 触发即可；**不必**再监听 `asserts/**`（图在 R2）。

**Secrets 额外**：`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`（或 rclone config 用 secret 写入）。

**仅改代码、未改图**：可跳过 R2→本地 asserts 全量拉取，用 cache 或 `--ignore-existing` 增量。

---

## 8 · 日常运维

| 操作 | 命令/方式 |
|------|-----------|
| 新菜海报入库到 `asserts/` | 本机 `Copy-Item` 按 [AGENTS.md](../../AGENTS.md) → `rclone sync asserts scf-r2:scf-assets/asserts` |
| 更新衍生品 | `npm run images:quick` → `rclone sync web/public/scf-img scf-r2:scf-assets/scf-img` |
| 只发版 UI | push `web/` → CI 不强制全量同步 asserts |
| 回滚页面 | Pages 部署历史回滚；R2 对象版本（若开启） |

**不要**把 `asserts/`、`design/` 提交 Git（已 `.gitignore`）。

---

## 9 · 费用与额度（粗算）

| 资源 | 约用量 | 免费档 |
|------|--------|--------|
| R2 存储 | ~6 GB | 10 GB ✅ |
| R2 出站 | 随访问量 | **$0** ✅ |
| Pages | 瘦 dist ~100 MB | 常规免费额度 |

超出 10 GB 存储：约 **$0.015/GB·月**（仍无出站费）。

---

## 10 · 验收清单

- [ ] `assets.` 域名能直接打开一张海报 PNG、一张 `scf-img` webp  
- [ ] 首页/国家页海报、街景、小志图片正常（非 404）  
- [ ] `dist` 部署包 **不含** `asserts/`、`scf-img/` 目录（或体积 &lt; 300 MB）  
- [ ] 本地 `npm run dev` 不设 `PUBLIC_ASSET_ORIGIN` 仍正常  
- [ ] 生产构建设 `PUBLIC_ASSET_ORIGIN` 后，页面源码里图片 URL 指向 `assets.` 域名  

---

## 11 · 实施顺序建议

1. **今天**：完成阶段 0 + 阶段 1（R2 桶、域名、本机 rclone 全量上传）  
2. **下一步**：实现阶段 3 的 `publicAssetUrl` + 本机阶段 2 瘦 dist 部署验证  
3. **再下一步**：改 CI（阶段 4）+ 更新 [DEPLOY.md](./DEPLOY.md) 指向本文  

需要我直接在仓库里实现 **阶段 3 代码** 和 **`scripts/sync-r2-assets.ps1`**、**CI workflow 补丁** 时，说一声即可。

---

© 2026 Street Corner Foodie · 内部运维文档
