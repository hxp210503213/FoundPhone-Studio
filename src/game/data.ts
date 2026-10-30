/**
 * 《十日集训》数据层 v1
 * ------------------------------------------------------------------
 * 本文件只声明游戏数据，不包含任何界面、样式或页面切换逻辑。
 * 后续步骤（桌面渲染、App 入口、事件引擎）从这里读取数据，
 * 而不是把数据散落回组件里。
 *
 * 设计约束：
 * - 纯 JSON 兼容对象（无函数、无 Date、无外部依赖），可直接序列化、
 *   做快照与玩家存档对比；
 * - 所有 id 为稳定的下划线小写字符串，一经使用不得改名；
 * - 故事不含现实公司、现实人物或出道设定，一切机构与角色均为虚构。
 *
 * 许可：随项目以 MIT 许可证分发。
 */

/** 角色 id 的联合类型，供其他模块在编译期校验引用拼写。 */
export type CharacterId =
  | "zuo_qihan"
  | "yang_bowen"
  | "wang_lujie"
  | "zhang_hanrui"
  | "zhang_guiyuan"
  | "chen_yiheng"
  | "chen_junming"
  | "chen_sihan";

/** APP id 的联合类型。新增 App 时先在此处登记，再补进 APP 列表。 */
export type AppId =
  | "fj_trainee"
  | "schedule"
  | "health_steps"
  | "access_log"
  | "offline_notes";

export type Character = {
  id: CharacterId;
  name: string;
  /** 在剧情中的职能定位（叙事用途，不是职级）。 */
  role: string;
  /** 性格与行为特征，供对白生成与线索分配参考。 */
  personality: string;
  /** 该角色手机/视角中可见的 APP id 列表。 */
  appAccess: AppId[];
  /**
   * 仅左奇函：手机备忘录中未同步到云端的本地文件夹。
   * 桌面不显示图标，只能从文件管理进入；本步只建数据，入口后续再接。
   */
  offlineNotes?: boolean;
  /** 仅杨博文：直觉型记忆碎片标记，用于后续“似曾相识”触发判定。 */
  intuitionMarker?: boolean;
};

export type AppDefinition = {
  id: AppId;
  name: string;
  /** 能看到该 APP 的角色 id。 */
  visibleTo: CharacterId[];
  /**
   * 是否为桌面图标。false 表示必须经由其他入口（如文件管理）进入。
   * 该字段只描述数据属性，不产生任何渲染行为。
   */
  homeIcon: boolean;
  /** 一句话说明，供后续编辑器与检索使用。 */
  description: string;
};

export const CHARACTER_IDS: CharacterId[] = [
  "zuo_qihan",
  "yang_bowen",
  "wang_lujie",
  "zhang_hanrui",
  "zhang_guiyuan",
  "chen_yiheng",
  "chen_junming",
  "chen_sihan",
];

export const APP_IDS: AppId[] = [
  "fj_trainee",
  "schedule",
  "health_steps",
  "access_log",
  "offline_notes",
];

/**
 * 基础 APP 列表 = 除 offline_notes 外的全部 APP。
 * 由 APP_IDS 派生，避免两处手写导致不一致。
 */
export const BASE_APP_ACCESS: AppId[] = APP_IDS.filter(
  (id) => id !== "offline_notes",
);

const characters: Character[] = [
  {
    id: "zuo_qihan",
    name: "左奇函",
    role: "布局者 / 唯一保留完整记忆的人",
    personality:
      "ENTJ。防备心强，不愿麻烦别人，对人真诚，高敏感。习惯先把所有可能性摆好再行动，因此在这个反复重来的十天里最先察觉到不对劲。",
    appAccess: [
      "fj_trainee",
      "schedule",
      "health_steps",
      "access_log",
      "offline_notes",
    ],
    offlineNotes: true,
  },
  {
    id: "yang_bowen",
    name: "杨博文",
    role: "碎片记忆者 / 破局者",
    personality:
      "INTJ。有主见，体面，有野心也有规划，会自我施压，但能自我调理。记忆并不完整，却比任何人都更愿意相信那些“说不清的熟悉感”。",
    appAccess: ["fj_trainee", "schedule", "health_steps", "access_log"],
    intuitionMarker: true,
  },
  {
    id: "wang_lujie",
    name: "王橹杰",
    role: "信息枢纽",
    personality: "习惯把每个人的话都听进去再自己核对一遍，常翻“峰峻练习生”的通知和匿名反馈入口。",
    appAccess: ["fj_trainee", "schedule", "health_steps", "access_log"],
  },
  {
    id: "zhang_hanrui",
    name: "张函瑞",
    role: "声乐课 / 听觉细节",
    personality: "对声音细节敏感，能从工作人员发来的伴奏文件里听出多出来的一条音轨。",
    appAccess: ["fj_trainee", "schedule", "health_steps", "access_log"],
  },
  {
    id: "zhang_guiyuan",
    name: "张桂源",
    role: "舞蹈课 / 空间与时间感",
    personality: "熟悉集训宿舍到训练楼的路线和每一道门禁时间，靠身体记住的东西比靠脑子多。",
    appAccess: ["fj_trainee", "schedule", "health_steps", "access_log"],
  },
  {
    id: "chen_yiheng",
    name: "陈奕恒",
    role: "规则漏洞",
    personality: "擅长找规则漏洞，最早发现考核排名的奖励从来没有真正兑现过。",
    appAccess: ["fj_trainee", "schedule", "health_steps", "access_log"],
  },
  {
    id: "chen_junming",
    name: "陈浚铭",
    role: "社交 / 物资",
    personality: "负责与人打交道和采买物资，从通知和邮件里的采购备注看出不对劲。",
    appAccess: ["fj_trainee", "schedule", "health_steps", "access_log"],
  },
  {
    id: "chen_sihan",
    name: "陈思罕",
    role: "体能数据 / 睡眠监测",
    personality: "盯体能数据与睡眠监测，发现八个人的步数在第十天夜里同时归零。",
    appAccess: ["fj_trainee", "schedule", "health_steps", "access_log"],
  },
];

const apps: AppDefinition[] = [
  {
    id: "fj_trainee",
    name: "时代峰峻",
    visibleTo: [...CHARACTER_IDS],
    homeIcon: true,
    description: "虚构的养成系娱乐公司小程序，包含打卡、月末考核排名、通知与匿名反馈入口。",
  },
  {
    id: "schedule",
    name: "课程表",
    visibleTo: [...CHARACTER_IDS],
    homeIcon: true,
    description: "集训期课程安排，记录声乐、舞蹈与体能课的时段和教室。",
  },
  {
    id: "health_steps",
    name: "健康步数",
    visibleTo: [...CHARACTER_IDS],
    homeIcon: true,
    description: "体能数据与睡眠监测，逐日累计步数与入睡时间。",
  },
  {
    id: "access_log",
    name: "门禁记录",
    visibleTo: [...CHARACTER_IDS],
    homeIcon: true,
    description: "集训宿舍与训练楼的门禁通行记录。",
  },
  {
    id: "offline_notes",
    name: "离线笔记",
    visibleTo: ["zuo_qihan"],
    homeIcon: false,
    description:
      "左奇函手机备忘录里一个未同步到云端的本地文件夹，不显示桌面图标，只能从文件管理进入；内容跨轮回保留。",
  },
];

/**
 * 跨轮回残留线索。
 * 这些数据本身不渲染，由渲染层根据 currentCycle / currentView 决定是否显示，
 * 并按 visualState 套用对应视觉状态。
 */
export type ClueVisualState = "smudged" | "recovered" | "clean";

export type Clue = {
  id: string;
  /** 承载线索的 APP id。 */
  app: AppId | string;
  /** 线索归属角色（谁手机上的东西）。 */
  owner: CharacterId;
  /** 线索正文；相册类线索为画面文字描述。 */
  content: string;
  /** 谁能恢复/看到这条线索。 */
  recoverableBy: CharacterId;
  /** 从第几轮起可见。 */
  availableFromCycle: number;
  visualState: ClueVisualState;
  /** 展示标题，供列表与详情使用。 */
  title: string;
};

const clues: Clue[] = [
  {
    id: "memo_draft",
    app: "offline_notes",
    owner: "zuo_qihan",
    content: "别让他去天台。别让他信考核排名。别让他——",
    recoverableBy: "yang_bowen",
    availableFromCycle: 2,
    visualState: "smudged",
    title: "没写完的草稿",
  },
  {
    id: "album_residue",
    app: "album",
    owner: "zuo_qihan",
    content: "集训宿舍楼顶天台，夜里，一张被删掉又恢复的照片",
    recoverableBy: "yang_bowen",
    availableFromCycle: 2,
    visualState: "recovered",
    title: "恢复的照片",
  },
];

export const gameData = {
  characters,
  apps,
  clues,
  /** 基础 APP 列表，供后续需要批量赋权时引用。 */
  baseAppAccess: BASE_APP_ACCESS,
} as const;

/** 全局状态初始值。getGameState() 每次返回一份新的深拷贝，避免跨模块共享引用。 */
export type GameState = {
  /** 当前轮回数，第一轮为 1。 */
  currentCycle: number;
  /** 当前集训日（轮内推进，1—10；第 10 天夜里触发重置）。 */
  currentDay: number;
  /** 当前视角角色，双男主切换使用。 */
  currentView: CharacterId;
  /** 左奇函 ↔ 杨博文 信任值。 */
  trust: number;
  /** 暂留字段，后续可不用。 */
  alert: number;
  /** 杨博文记忆进度（碎片数）。 */
  fragmentsBowen: number;
};

export const initialGameState: GameState = {
  currentCycle: 1,
  currentDay: 1,
  currentView: "zuo_qihan",
  trust: 0,
  alert: 0,
  fragmentsBowen: 0,
};

export function getGameState(): GameState {
  return { ...initialGameState };
}

/** 只读查询辅助：按 id 取角色，未找到返回 undefined。 */
export function findCharacter(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}

/** 只读查询辅助：按 id 取 APP 定义。 */
export function findApp(id: string): AppDefinition | undefined {
  return apps.find((a) => a.id === id);
}

/** 只读查询辅助：某角色可见的 APP 列表。 */
export function appsVisibleTo(id: string): AppDefinition[] {
  return apps.filter((a) => (a.visibleTo as readonly string[]).includes(id));
}

/**
 * 只读查询辅助：某 APP 上、当前轮次与视角下应显示的线索。
 * 规则：轮次 >= availableFromCycle，且视角角色在该 APP 的 visibleTo 内。
 */
export function cluesFor(app: string, view: CharacterId, cycle: number): Clue[] {
  const def = findApp(app);
  if (def && !(def.visibleTo as readonly string[]).includes(view)) return [];
  return clues.filter(
    (c) => c.app === app && cycle >= c.availableFromCycle,
  );
}

/** 从第 1 轮开始就存在的线索（可用于常驻文件夹），与跨轮回残留区分。 */
export function permanentClues(app: string): Clue[] {
  return clues.filter((c) => c.app === app && c.availableFromCycle <= 1);
}

export default gameData;
