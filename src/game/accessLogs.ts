/**
 * 门禁记录（access_log）数据。
 * log_003 是第七步的第一条异常痕迹：凌晨两点的未登记卡。
 */
import type { CharacterId } from "./data";
import type { NoticeHint } from "./notices";

export type AccessLog = {
  id: string;
  app: "access_log";
  /** 集训第几天。 */
  day: number;
  time: string;
  location: string;
  card: string;
  result: "正常" | "异常";
  visibleTo: CharacterId[];
  hint?: NoticeHint;
};

const ALL: CharacterId[] = [
  "zuo_qihan",
  "yang_bowen",
  "wang_lujie",
  "zhang_hanrui",
  "zhang_guiyuan",
  "chen_yiheng",
  "chen_junming",
  "chen_sihan",
];

export const accessLogs: AccessLog[] = [
  {
    id: "log_001",
    app: "access_log",
    day: 1,
    time: "22:05",
    location: "训练楼大门",
    card: "张桂源",
    result: "正常",
    visibleTo: [...ALL],
  },
  {
    id: "log_002",
    app: "access_log",
    day: 2,
    time: "06:58",
    location: "宿舍楼门禁",
    card: "陈思罕",
    result: "正常",
    visibleTo: [...ALL],
  },
  {
    id: "log_003",
    app: "access_log",
    day: 3,
    time: "02:00",
    location: "天台方向楼梯间",
    card: "未登记卡",
    result: "异常",
    visibleTo: [...ALL],
    hint: {
      text: "凌晨两点，未登记卡，天台方向。工作人员说那天没人上天台。",
      requiresSeen: [],
    },
  },
  {
    id: "log_004",
    app: "access_log",
    day: 3,
    time: "21:30",
    location: "训练楼大门",
    card: "王橹杰",
    result: "正常",
    visibleTo: [...ALL],
  },
];

export function accessLogsFor(view: CharacterId): AccessLog[] {
  return accessLogs.filter((l) => (l.visibleTo as string[]).includes(view));
}

export function findAccessLog(id: string): AccessLog | undefined {
  return accessLogs.find((l) => l.id === id);
}
