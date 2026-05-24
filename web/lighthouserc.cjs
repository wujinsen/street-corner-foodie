/** @type {import('@lhci/cli').Config} */
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      startServerCommand: "npm run preview -- --host 127.0.0.1 --port 4322",
      startServerReadyPattern: "4322",
      url: [
        "http://127.0.0.1:4322/",
        "http://127.0.0.1:4322/cn/hainan/",
        "http://127.0.0.1:4322/us/ny/",
      ],
      settings: {
        preset: "desktop",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
    },
    upload: {
      target: "temporary-public-storage",
      githubStatusCheck: false,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.65 }],
        "categories:accessibility": ["warn", { minScore: 0.78 }],
        "categories:best-practices": ["warn", { minScore: 0.85 }],
        "categories:seo": ["warn", { minScore: 0.85 }],
      },
    },
  },
};
