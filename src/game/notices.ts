/**
 * 时代峰峻（fj_trainee）小程序的通知数据。
 *
 * 本批只填第 1—3 天的"表面世界"日常内容，不埋任何跨轮回线索。
 * 后续异常痕迹会以同样的结构追加，靠 id 稳定引用。
 */
import type { CharacterId } from "./data";

export type NoticeType = "course" | "assessment" | "staff";

export type Notice = {
  id: string;
  app: "fj_trainee";
  type: NoticeType;
  title: string;
  content: string;
  /** 集训第几天（1—10）。 */
  day: number;
  visibleTo: CharacterId[];
};

export const notices: Notice[] = [
  {
    id: "notice_001",
    app: "fj_trainee",
    type: "course",
    title: "集训第 1 天课程安排",
    content:
      "上午舞蹈课，下午声乐课，晚上自由练习。请提前十分钟到训练楼 3 层签到。",
    day: 1,
    visibleTo: [
      "zuo_qihan",
      "yang_bowen",
      "wang_lujie",
      "zhang_hanrui",
      "zhang_guiyuan",
      "chen_yiheng",
      "chen_junming",
      "chen_sihan",
    ],
  },
  {
    id: "notice_002",
    app: "fj_trainee",
    type: "assessment",
    title: "月末考核排名（第 1 日）",
    content:
      "当前排名已更新，请在小程序内查看。排名前三位可优先选择下次考核曲目。",
    day: 1,
    visibleTo: [
      "zuo_qihan",
      "yang_bowen",
      "wang_lujie",
      "zhang_hanrui",
      "zhang_guiyuan",
      "chen_yiheng",
      "chen_junming",
      "chen_sihan",
    ],
  },
  {
    id: "notice_003",
    app: "fj_trainee",
    type: "staff",
    title: "集训期注意事项",
    content:
      "集训期间统一住宿，出门需报备。考核前夜请勿在楼内大声喧哗，以免影响他人休息。",
    day: 2,
    visibleTo: [
      "zuo_qihan",
      "yang_bowen",
      "wang_lujie",
      "zhang_hanrui",
      "zhang_guiyuan",
      "chen_yiheng",
      "chen_junming",
      "chen_sihan",
    ],
  },
  {
    id: "notice_004",
    app: "fj_trainee",
    type: "course",
    title: "声乐课伴奏文件已上传",
    content: "本次考核曲目伴奏已发至相册，请自行下载练习。",
    day: 2,
    visibleTo: [
      "zuo_qihan",
      "yang_bowen",
      "wang_lujie",
      "zhang_hanrui",
      "zhang_guiyuan",
      "chen_yiheng",
      "chen_junming",
      "chen_sihan",
    ],
  },
  {
    id: "notice_005",
    app: "fj_trainee",
    type: "assessment",
    title: "月末考核排名（第 2 日）",
    content: "排名已更新。COVER 奖励细则将在考核前公布。",
    day: 3,
    visibleTo: [
      "zuo_qihan",
      "yang_bowen",
      "wang_lujie",
      "zhang_hanrui",
      "zhang_guiyuan",
      "chen_yiheng",
      "chen_junming",
      "chen_sihan",
    ],
  },
  {
    id: "notice_006",
    app: "fj_trainee",
    type: "staff",
    title: "关于天台使用的说明",
    content: "集训期间天台暂不开放，请勿自行前往。",
    day: 3,
    visibleTo: [
      "zuo_qihan",
      "yang_bowen",
      "wang_lujie",
      "zhang_hanrui",
      "zhang_guiyuan",
      "chen_yiheng",
      "chen_junming",
      "chen_sihan",
    ],
  },
];

/** 某视角下、某类型的通知，按天正序排列。 */
export function noticesFor(
  view: CharacterId,
  types: NoticeType[],
): Notice[] {
  return notices
    .filter(
      (n) => types.includes(n.type) && (n.visibleTo as string[]).includes(view),
    )
    .sort((a, b) => a.day - b.day);
}

export function findNotice(id: string): Notice | undefined {
  return notices.find((n) => n.id === id);
}

/**
 * 第七步：异常痕迹通知。
 * hint 仅在满足条件时由 FjTraineeSkin 渲染（当前仅左奇函视角），
 * requiresSeen 为需要先看过的条目 id（通知 / 门禁记录 / 群消息均可）。
 */
export type NoticeHint = {
  text: string;
  /** 需要先看过的条目 id。 */
  requiresSeen: string[];
  /** 限定视角；缺省为仅左奇函。 */
  view?: CharacterId;
};

export type AnomalyNotice = Notice & { editedAt?: string; hint?: NoticeHint };

export const anomalyNotices: AnomalyNotice[] = [
  {
    id: "notice_007",
    app: "fj_trainee",
    type: "staff",
    title: "集训第 3 天课程调整",
    content: "因场地原因，下午声乐课调至上午，舞蹈课调至下午。请互相转告。",
    day: 3,
    visibleTo: [...notices[0].visibleTo],
    editedAt: "第3天 07:12",
    hint: {
      text: "第 1 天上午舞蹈、下午声乐；第 3 天上午声乐、下午舞蹈。时间被改过？",
      requiresSeen: ["notice_001"],
    },
  },
  {
    id: "notice_008",
    app: "fj_trainee",
    type: "assessment",
    title: "COVER 奖励说明（补充）",
    content: "COVER 奖励将根据月末考核排名发放，具体曲目由公司统一安排。",
    day: 3,
    visibleTo: [...notices[0].visibleTo],
    hint: {
      text: "优先选择？统一安排？两条说法对不上。",
      requiresSeen: ["notice_002", "group_cover_qyi"],
    },
  },
  {
    id: "notice_009",
    app: "fj_trainee",
    type: "staff",
    title: "天台使用补充说明",
    content: "天台门禁已检修，集训期间仍不开放。如发现门禁异常，请及时联系宿管。",
    day: 3,
    visibleTo: [...notices[0].visibleTo],
    hint: {
      text: "门禁已检修，那凌晨两点那条记录是什么？",
      requiresSeen: ["notice_006", "log_003"],
    },
  },
];

/** 某视角下的异常通知（通知/排名两个标签都可能用到）。 */
export function anomalyNoticesFor(view: CharacterId): AnomalyNotice[] {
  return anomalyNotices.filter((n) => (n.visibleTo as string[]).includes(view));
}
