<p align="center">
  <a href="README.md">中文</a> · <a href="README.en.md">English</a> · <a href="README.ja.md">日本語</a>
</p>

<p align="center">
  <a href="https://streetcornerfoodie.com" aria-label="街角グルメ">
    <img src="docs/brand/scf-logo-mark.svg" alt="Street Corner Foodie logo" />
  </a>
</p>

# Street Corner Foodie · 街角グルメ

*世界の街角を曲がるたび、味と街が立ち上がる。*

**[streetcornerfoodie.com](https://streetcornerfoodie.com)** · 世界の屋台料理と街並みのジオラマ図鑑

---

**街角グルメ**は **Gourmet recipe2** ポスター、**mini-zine** 小冊子、**Street View** 街角の三つの画風を、ひとつの Web 体験につなぎます。国と都市を切り替え、料理から街角シーンまで一枚の地図でたどれます。

| | |
|---|---|
| ローカル開発 | `cd web && npm install && npm run dev` → http://localhost:4321 |
| デプロイ | [docs/DEPLOY.md](docs/DEPLOY.md) · [docs/DEPLOY-R2.md](docs/DEPLOY-R2.md) |
| ドキュメント | [docs/README.md](docs/README.md) · [BRAND.md](BRAND.md) · [AGENTS.md](AGENTS.md) |

---

## 画面プレビュー

<p align="center">
  <img src="docs/brand/cn_hainan_medal.png" alt="海南地域章" />
</p>

### 1 · ランディング

Bento 型トップ：世界地図と都市カードの連動、リアルタイム気温、ポスター／小冊子のピックアップ、ブランド宣言。

![ランディング · Bento 地図と都市カード](docs/screenshots/01-landing-home.png)

### 2 · 世界の街角 · World Atlas

全画面地図：国・地域ごとの光点クラスタ。ピンをフォーカスするとランディングの都市カードと同期。中／英／日の UI と三国テーマカラー。

![世界の街角 · World Atlas](docs/screenshots/02-world-atlas.png)

### 3 · 美食ポスター · Posters

ポスターギャラリー：国・省・味で絞り込み、**Gourmet recipe2** の 3D 等角ミニチュア定稿を閲覧。

![ポスターギャラリー · 海南](docs/screenshots/03-gallery-posters.png)

### 4 · レシピ小冊子 · Mini-Zine

小冊子ギャラリーとリーダー：**mini-zine** 六ページ叙事、サムネイルページ送り、拡大表示。

![小冊子ギャラリー · 海南](docs/screenshots/04-gallery-zines.png)

### 5 · 街角探索 · Street Explorer

21:9 夜景ジオラマ、シーン一覧、時間帯／画幅切替。各画面に屋台・店招など地域の食が入ります。

![街角探索 · 海口府城](docs/screenshots/05-street-explorer.png)

---

## リポジトリ構成

```
meishi/
├── asserts/     # ポスター · 小冊子 · 街角（ローカル junction、.gitignore 参照）
├── docs/        # 地域ドキュメント · スタイル仕様 · 上記スクリーンショット
├── web/         # Astro 4 フロントエンド
├── BRAND.md
└── AGENTS.md
```

---

## ライセンス

| 内容 | ライセンス |
|------|------------|
| コード（`web/`、スクリプト、ドキュメント本文など） | [MIT](LICENSE) |
| ビジュアル素材（ポスター／小冊子／街角／ブランド画像／README スクリーンショットなど） | [非商用](LICENSE-ASSETS.md) |

© 2026 [Street Corner Foodie · 街角グルメ](https://streetcornerfoodie.com)
