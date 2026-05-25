export type Lang = "zh" | "en" | "ja";



export type Multilang = { zh: string; en: string; ja: string };



export type CountryId = "cn" | "jp" | "us" | "fr" | "uk" | "de" | "za" | "nz" | "antarctica";



export interface Country {

  id: CountryId;

  flag: string;

  name: Multilang;

  vstrip: string;

}



export interface RegionStats {

  poster: number;

  zine: number;

  street: number;

}



export interface Region {

  id: string;

  countryId: CountryId;

  name: Multilang;

  tagline: Multilang;

  flavors: { zh: string[]; en: string[]; ja: string[] };

  stats: RegionStats;

  hero: string | null;

  heroPath: string | null;

  /** 首页 landing 地图城市卡（basename） */
  heroLanding: string | null;

  /** `#posters` Tab 顶栏街景 wide（basename）；无则与 {@link hero} 相同逻辑 */
  heroPoster: string | null;

  /** `#zines` Tab 顶栏街景 wide（basename）；无则与 {@link hero} 相同逻辑 */
  heroZine: string | null;

  /** From md `web_editor_pick`; gallery sort priority. */

  editorPick?: string[];

  /** Curated daily atmosphere chip (not live weather). */

  atmosphere?: import("./region-atmosphere").RegionAtmosphere;

}



export interface ZineDish {

  slug: string;

  countryId: CountryId;

  regionId: string;

  path: string;

  storyWith: string | null;

  storyNoChar: string | null;

  recipeWith: string | null;

  recipeNoChar: string | null;

  /** `{slug}_narrative_01` … `_04` — extra story-mode spreads after `story_eating`. */
  narrativePages?: string[];

  placeholder?: boolean;

  name: Multilang;

}



export interface Poster {

  slug: string;

  countryId: CountryId;

  regionId: string;

  path: string;

  file: string | null;

  fileNoChar: string | null;

  /** Thumbnail from mini-zine when no `*_poster.png` yet. */
  fromZine?: boolean;

  name: Multilang;

  tags: { zh: string[]; en: string[]; ja: string[] };

  pin: string;

  desc: Multilang;

  /** Tokyo placeholders flag */

  placeholder?: boolean;

  emoji?: string;

  romaji?: string;

  bg1?: string;

  bg2?: string;

  glow?: string;

  ribbon?: string;

}

