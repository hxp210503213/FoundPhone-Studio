/**
 * 离线笔记条目（除 memo_draft 外的常规笔记）。
 *
 * - 全部只属于左奇函（visibleTo 只有 zuo_qihan）；
 * - memo_draft 是跨轮回残留（保留在 data.ts 的 clues 里），不在此重复定义；
 * - 这里只扩数据和列表显示用的条目，不动微信/通知/门禁/邮件。
 */

export type OfflineNote = {
  id: string;
  title: string;
  content: string;
  /** 写下这条笔记的集训日。 */
  dayWritten: number;
  visibleTo: ["zuo_qihan"];
  visualState: "normal" | "smudged" | "blurred";
};

/**
 * 置顶的「已抹除」名单：只有左奇函记得被抹除者的名字。
 * 文字边缘轻微模糊（CSS blur），像被橡皮擦过。
 * 内容后续批次随轮回重置自动追加（批次②的重置管线）。
 */
export const erasedNote: OfflineNote = {
  id: "note_000",
  title: "已抹除",
  content: "第一轮：陈浚铭。\n第二轮：张函瑞。\n第三轮：——",
  dayWritten: 0,
  visibleTo: ["zuo_qihan"],
  visualState: "blurred",
};

/** 玩家第一次打开离线笔记时看到的旁白。 */
export const NOTES_INTRO =
  "你打开这个文件夹。置顶那条写着两个名字。你不记得自己是什么时候写的。但笔迹是你的。";

export const offlineNotes: OfflineNote[] = [
  {
    id: "note_001",
    title: "第 3 天凌晨",
    content: "天台门禁 02:17 有人刷过。未登记卡。工作人员说那天没人上天台。",
    dayWritten: 3,
    visibleTo: ["zuo_qihan"],
    visualState: "normal",
  },
  {
    id: "note_002",
    title: "课程表对不上",
    content:
      "第 1 天上午舞蹈下午声乐，第 3 天通知改成上午声乐下午舞蹈。通知发布时间 07:12，比正常早。谁改的？",
    dayWritten: 3,
    visibleTo: ["zuo_qihan"],
    visualState: "normal",
  },
  {
    id: "note_003",
    title: "COVER 奖励",
    content:
      "先说排名前三优先选曲，又说统一安排。陈奕恒在群里提过。两条说法对不上。",
    dayWritten: 3,
    visibleTo: ["zuo_qihan"],
    visualState: "normal",
  },
  {
    id: "note_004",
    title: "名单",
    content: "集训名单只有 7 个人。陈浚铭数过。第 8 个是谁？我数了三遍，还是 7 个。",
    dayWritten: 3,
    visibleTo: ["zuo_qihan"],
    visualState: "normal",
  },
];
