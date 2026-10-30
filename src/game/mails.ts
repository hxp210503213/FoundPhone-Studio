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
  /** 附件是集训名单：正文附上带跳号的名单（被抹除者名字消失）。 */
  roster?: boolean;
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
    roster: true,
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
  {
    id: "mail_003",
    app: "mail",
    from: "公司行政",
    subject: "关于集训名单的更正",
    content: "因训练安排调整，集训名单更新如下，请以本版为准。",
    attachment: "集训名单_第4代_修正版.pdf",
    day: 7,
    time: "第7天 09:00",
    visibleTo: [...ALL],
    hint: {
      text: "上一版 7 个，这一版 6 个。又少了一个。",
      requiresSeen: ["group_d7_cjm"],
    },
    roster: true,
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
  /** 从第几轮起出现（默认第 1 轮）。 */
  fromCycle?: number;
  /** 是否为系统消息（无头像灰色居中样式由 skin 处理）。 */
  system?: boolean;
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
  // ---- 第一轮第 4—10 天（批次②） ----
  {
    id: "group_d4_wlj",
    app: "wechat",
    thread: "宿舍群",
    sender: "王橹杰",
    content: "我数了一下，我们本来是不是八个人？现在群里只有七个头像。",
    day: 4,
    time: "第4天 10:14",
  },
  {
    id: "group_d4_cjm",
    app: "wechat",
    thread: "宿舍群",
    sender: "陈浚铭",
    content: "你数错了吧。",
    day: 4,
    time: "第4天 10:20",
  },
  {
    id: "group_d5_zhr",
    app: "wechat",
    thread: "宿舍群",
    sender: "张函瑞",
    content:
      "伴奏文件里那段声音，第 5 天夜里也有。像有人在数数。一、二、三……数到七就停了。",
    day: 5,
    time: "第5天 13:02",
  },
  {
    id: "group_d5_csh",
    app: "wechat",
    thread: "宿舍群",
    sender: "陈思罕",
    content: "为什么是七？",
    day: 5,
    time: "第5天 13:05",
  },
  {
    id: "group_d6_csh",
    app: "wechat",
    thread: "宿舍群",
    sender: "陈思罕",
    content:
      "你们看步数，第 5 天夜里 03:00—03:10，所有人的步数都是 0，但门禁记录里有刷卡。谁在刷？",
    day: 6,
    time: "第6天 11:47",
  },
  {
    id: "group_d7_cjm",
    app: "wechat",
    thread: "宿舍群",
    sender: "陈浚铭",
    content: "名单怎么又变了？我昨天看还是 7 个。",
    day: 7,
    time: "第7天 09:30",
  },
  {
    // 轮回重置后出现的系统消息：群成员已更新
    id: "group_member_updated",
    app: "wechat",
    thread: "宿舍群",
    sender: "系统消息",
    content: "群成员已更新。",
    day: 1,
    time: "第1天 00:00",
    fromCycle: 2,
    system: true,
  },
];

export function mailsFor(view: CharacterId): Mail[] {
  return mails.filter((m) => (m.visibleTo as string[]).includes(view));
}

/**
 * 微信私聊：左奇函 ↔ 杨博文的初始聊天记录（三条）+ 第一批跨轮回消息。
 * 两个视角都可见；提示/hint 按 hintFor 指定的视角渲染，
 * 呼吸边框仅杨博文视角渲染（由 WeChatSkin 处理）。
 */
export type PrivateMessage = {
  id: string;
  app: "wechat";
  thread: string;
  sender: "杨博文" | "左奇函";
  content: string;
  day: number;
  time: string;
  /** 是否为机主发出（气泡靠右）。 */
  outgoing: boolean;
  /** 点开后底部灰色小字的提示文本。 */
  hintText?: string;
  /** 只有该视角能看到 hint / 未回复标记。 */
  hintFor?: CharacterId;
  /** 该视角下这条消息显示"未回复"灰色小字。 */
  noReplyFor?: CharacterId;
};

export const privateMessages: PrivateMessage[] = [
  {
    id: "chat_001",
    app: "wechat",
    thread: "杨博文",
    sender: "杨博文",
    content: "你昨天是不是也没睡好？",
    day: 1,
    time: "第1天 23:12",
    outgoing: false,
  },
  {
    id: "chat_002",
    app: "wechat",
    thread: "杨博文",
    sender: "左奇函",
    content: "还行。你早点睡。",
    day: 1,
    time: "第1天 23:20",
    outgoing: true,
  },
  {
    id: "chat_003",
    app: "wechat",
    thread: "杨博文",
    sender: "杨博文",
    content: "我昨晚梦见你让我别去天台，但我不记得你什么时候说过。",
    day: 2,
    time: "第2天 07:41",
    outgoing: false,
    hintText: "他在第二轮也说过这句话。",
    hintFor: "zuo_qihan",
  },
  // ---- 第九步：第一批跨轮回消息（感情线第一层） ----
  // msg_006：第 2 天下午，两个视角正常显示；左奇函点开后见"他注意到了。"
  {
    id: "msg_006",
    app: "wechat",
    thread: "杨博文",
    sender: "杨博文",
    content:
      "你今天凌晨三点还在线。健康步数里你步数是 0，但微信显示在线。你没睡？",
    day: 2,
    time: "第2天 14:05",
    outgoing: false,
    hintText: "他注意到了。",
    hintFor: "zuo_qihan",
  },
  // msg_007：第 2 天晚上，陈述语气；左奇函视角"已读未回"。
  {
    id: "msg_007",
    app: "wechat",
    thread: "杨博文",
    sender: "杨博文",
    content: "左奇函，你是不是知道什么。",
    day: 2,
    time: "第2天 21:37",
    outgoing: false,
    noReplyFor: "zuo_qihan",
  },
  // msg_008：第 3 天早上，左奇函第一次主动开口；杨博文点开后见提示。
  {
    id: "msg_008",
    app: "wechat",
    thread: "杨博文",
    sender: "左奇函",
    content: "你可以不信我，但今晚别一个人行动。",
    day: 3,
    time: "第3天 08:02",
    outgoing: true,
    hintText: "他第一次说‘别一个人’。",
    hintFor: "yang_bowen",
  },
  // ---- 第 8 天：梦见床边的人（批次②） ----
  {
    id: "msg_d8",
    app: "wechat",
    thread: "杨博文",
    sender: "杨博文",
    content:
      "左奇函，我昨晚梦见一个人站在我床边，我看不清他的脸。他跟我说“别去天台”。声音像你，但不是你。",
    day: 8,
    time: "第8天 07:55",
    outgoing: false,
    hintText: "那是陈浚铭的声音。第一轮他消失前说的最后一句话。",
    hintFor: "zuo_qihan",
  },
  // ---- 第 10 天夜里：终局前私聊五连（批次②） ----
  {
    id: "msg_d10_a",
    app: "wechat",
    thread: "杨博文",
    sender: "杨博文",
    content: "我去叫陈浚铭。他今天不太对劲。",
    day: 10,
    time: "第10天 23:31",
    outgoing: false,
  },
  {
    id: "msg_d10_b",
    app: "wechat",
    thread: "杨博文",
    sender: "左奇函",
    content: "别去天台。",
    day: 10,
    time: "第10天 23:32",
    outgoing: true,
  },
  {
    id: "msg_d10_c",
    app: "wechat",
    thread: "杨博文",
    sender: "杨博文",
    content: "我没去天台。我在走廊。",
    day: 10,
    time: "第10天 23:44",
    outgoing: false,
  },
  {
    id: "msg_d10_d",
    app: "wechat",
    thread: "杨博文",
    sender: "左奇函",
    content: "回来。",
    day: 10,
    time: "第10天 23:45",
    outgoing: true,
  },
  {
    id: "msg_d10_e",
    app: "wechat",
    thread: "杨博文",
    sender: "杨博文",
    content: "我马上回。",
    day: 10,
    time: "第10天 23:51",
    outgoing: false,
  },
];

/**
 * 左奇函私聊草稿区：未发送的草稿，只在左奇函视角可见。
 * 不进入聊天流，不做逻辑联动，只让玩家自己发现对应关系。
 */
export type PrivateDraft = {
  id: string;
  content: string;
  /** 草稿状态标注。 */
  tag: string;
  /** 是否显示发送失败的红色感叹号。 */
  failed: boolean;
};

export const privateDrafts: PrivateDraft[] = [
  {
    id: "msg_005",
    content: "梦而已。别多想。",
    tag: "未发送",
    failed: true,
  },
  {
    id: "msg_draft_002",
    content: "第 3 天凌晨天台，别去。",
    tag: "第 2 轮写的，没发",
    failed: true,
  },
  {
    id: "msg_draft_003",
    content: "别去天台。这次别去。",
    tag: "未发送",
    failed: true,
  },
];
