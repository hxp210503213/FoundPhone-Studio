/**
 * 邮件（mail）数据：mail_001 / mail_002。
 * 投影进 mail App 的内容列表由 src/game/clues.ts 完成，
 * hint 写入 meta.hint，由详情视图以灰色小字渲染。
 */
import type { CharacterId } from "./data";
import type { NoticeHint } from "./notices";

export type Mail = {
  id: string;
  app: "mail";
  from: string;
  subject: string;
  content: string;
  attachment: string;
  day: number;
  time: string;
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

export const mails: Mail[] = [
  {
    id: "mail_001",
    app: "mail",
    from: "公司行政",
    subject: "集训须知（第 4 代练习生）",
    content:
      "集训期间统一住宿，考核前夜请勿外出。附件为本次集训名单，请核对。",
    attachment: "集训名单_第4代.pdf",
    day: 1,
    time: "第1天 09:00",
    visibleTo: [...ALL],
    hint: {
      text: "名单上只有 7 个人。第 8 个是谁？",
      requiresSeen: ["group_roster_cjm"],
    },
  },
  {
    id: "mail_002",
    app: "mail",
    from: "宿管",
    subject: "关于天台门禁的回复",
    content: "天台门禁已检修，集训期间不开放。如有异常请联系宿管。",
    attachment: "",
    day: 3,
    time: "第3天 18:40",
    visibleTo: [...ALL],
    hint: {
      text: "门禁已检修，那凌晨两点那条记录是什么？",
      requiresSeen: ["log_003"],
    },
  },
];

/** 微信宿舍群消息：辅助角色的发现通过群聊进入主线，两个视角都可见。 */
export type GroupMessage = {
  id: string;
  app: "wechat";
  thread: string;
  sender: string;
  content: string;
  day: number;
  time: string;
};

export const groupMessages: GroupMessage[] = [
  {
    id: "group_cover_qyi",
    app: "wechat",
    thread: "宿舍群",
    sender: "陈奕恒",
    content:
      "你们不觉得 COVER 奖励的说法前后不一样吗？先说优先选曲，又说统一安排。",
    day: 3,
    time: "第3天 12:21",
  },
  {
    id: "group_roster_cjm",
    app: "wechat",
    thread: "宿舍群",
    sender: "陈浚铭",
    content: "集训名单我数了一下，好像只有 7 个人。",
    day: 3,
    time: "第3天 12:33",
  },
];

export function mailsFor(view: CharacterId): Mail[] {
  return mails.filter((m) => (m.visibleTo as string[]).includes(view));
}
