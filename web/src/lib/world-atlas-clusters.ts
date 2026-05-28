import type { WorldAtlasScene } from "./world-atlas-payload";
import { t, type Lang } from "./i18n";

export interface SceneCluster {
  key: string;
  sceneIds: string[];
  center: [number, number];
  scenes: WorldAtlasScene[];
}

export function geoDist(a: [number, number], b: [number, number]): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function clusterKey(ids: string[]): string {
  return [...ids].sort().join("|");
}

function centroid(geos: [number, number][]): [number, number] {
  if (geos.length === 0) return [0, 0];
  let lng = 0;
  let lat = 0;
  for (const [x, y] of geos) {
    lng += x;
    lat += y;
  }
  return [lng / geos.length, lat / geos.length];
}

/** Per-scene metro bucket for Hainan (multi-city province). */
const HAINAN_SCENE_METRO: Record<string, string> = {
  qilou: "haikou",
  fucheng: "haikou",
  laobacha: "haikou",
  wanlv: "haikou",
  jiari_haitan: "haikou",
  bay: "haikou",
  sanyawan: "sanya",
  dadonghai: "sanya",
  riyue_bay: "wanning",
  fenjiezhou: "lingshui",
  rainforest: "wuzhishan",
  dongjiao_yelin: "wenchang",
  fushan_coffee: "chengmai",
};

/** Metro split for provinces whose street scenes span distant cities (e.g. Hainan). */
function sceneMetroKey(s: WorldAtlasScene): string {
  const regionKey = `${s.countryId}__${s.regionId}`;
  if (regionKey === "cn__hainan") {
    const mapped = HAINAN_SCENE_METRO[s.sceneId];
    if (mapped) return mapped;
    return s.geo[1] >= 19.35 ? "haikou" : "sanya";
  }
  return "default";
}

/** Group scenes in one province; optional metro buckets then WGS84 union-find. */
export function clusterRegionScenes(
  scenes: WorldAtlasScene[],
  regionKey: string,
  thresholdDeg = 0.12,
): SceneCluster[] {
  const members = scenes.filter((s) => `${s.countryId}__${s.regionId}` === regionKey);
  if (members.length === 0) return [];

  const metroBuckets = new Map<string, WorldAtlasScene[]>();
  for (const s of members) {
    const mk = sceneMetroKey(s);
    const list = metroBuckets.get(mk) ?? [];
    list.push(s);
    metroBuckets.set(mk, list);
  }

  const clusters: SceneCluster[] = [];
  for (const bucket of metroBuckets.values()) {
    clusters.push(...clusterBucket(bucket, thresholdDeg));
  }
  return clusters;
}

function clusterBucket(members: WorldAtlasScene[], thresholdDeg: number): SceneCluster[] {
  if (members.length === 0) return [];
  if (members.length === 1) {
    const s = members[0]!;
    return [
      {
        key: clusterKey([s.id]),
        sceneIds: [s.id],
        center: s.geo,
        scenes: [s],
      },
    ];
  }

  const metro = sceneMetroKey(members[0]!);
  if (metro !== "default") {
    const scenes = [...members].sort((a, b) => a.sceneId.localeCompare(b.sceneId));
    const sceneIds = scenes.map((s) => s.id);
    return [
      {
        key: clusterKey(sceneIds),
        sceneIds,
        center: centroid(scenes.map((s) => s.geo)),
        scenes,
      },
    ];
  }

  const parent = members.map((_, i) => i);
  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]!]!;
      i = parent[i]!;
    }
    return i;
  };
  const unite = (a: number, b: number): void => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[rb] = ra;
  };

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      if (geoDist(members[i]!.geo, members[j]!.geo) <= thresholdDeg) unite(i, j);
    }
  }

  const buckets = new Map<number, WorldAtlasScene[]>();
  for (let i = 0; i < members.length; i++) {
    const r = find(i);
    const list = buckets.get(r) ?? [];
    list.push(members[i]!);
    buckets.set(r, list);
  }

  return [...buckets.values()].map((group) => {
    const scenes = [...group].sort((a, b) => a.sceneId.localeCompare(b.sceneId));
    const sceneIds = scenes.map((s) => s.id);
    return {
      key: clusterKey(sceneIds),
      sceneIds,
      center: centroid(scenes.map((s) => s.geo)),
      scenes,
    };
  });
}

export function clusterForScene(clusters: SceneCluster[], sceneMeta: string): SceneCluster | undefined {
  return clusters.find((c) => c.sceneIds.includes(sceneMeta));
}

/** Fan/spider positions around hub (geo degrees). */
export function spiderGeoPositions(
  center: [number, number],
  count: number,
  radiusDeg: number,
): [number, number][] {
  if (count <= 0) return [];
  if (count === 1) return [center];

  const start = -Math.PI / 2;
  const span = count <= 4 ? Math.PI * 0.95 : Math.PI * 1.25;
  const out: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const angle = start + span * (t - 0.5);
    out.push([
      center[0] + Math.cos(angle) * radiusDeg,
      center[1] + Math.sin(angle) * radiusDeg * 0.82,
    ]);
  }
  return out;
}

export function spiderRadiusForZoom(regionZoom: number): number {
  return Math.max(0.08, 0.65 / Math.max(regionZoom, 4));
}

export const CLUSTER_HUB_META_PREFIX = "__cluster__";

export function clusterHubMeta(clusterKey: string): string {
  return `${CLUSTER_HUB_META_PREFIX}${clusterKey}`;
}

export function parseClusterHubMeta(meta: string): string | null {
  if (!meta.startsWith(CLUSTER_HUB_META_PREFIX)) return null;
  return meta.slice(CLUSTER_HUB_META_PREFIX.length);
}

const METRO_CITY: Record<string, { zh: string; en: string; ja: string }> = {
  haikou: { zh: "海口", en: "Haikou", ja: "海口" },
  sanya: { zh: "三亚", en: "Sanya", ja: "三亚" },
  wanning: { zh: "万宁", en: "Wanning", ja: "万寧" },
  lingshui: { zh: "陵水", en: "Lingshui", ja: "陵水" },
  wenchang: { zh: "文昌", en: "Wenchang", ja: "文昌" },
  chengmai: { zh: "澄迈", en: "Chengmai", ja: "澄邁" },
  wuzhishan: { zh: "五指山", en: "Wuzhishan", ja: "五指山" },
};

/** Localized city label for a scene cluster (metro bucket or scene short name). */
export function clusterCityLabel(cluster: SceneCluster, lang: Lang): string {
  if (cluster.scenes.length === 0) return "";
  const first = cluster.scenes[0]!;
  const metro = sceneMetroKey(first);
  if (metro !== "default") {
    const pack = METRO_CITY[metro];
    if (pack) return t(pack, lang);
  }
  return first.name.split(" · ")[0]?.trim() || first.name;
}
