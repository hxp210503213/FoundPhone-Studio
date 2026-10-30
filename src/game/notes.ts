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
  visualState: "normal" | "smudged";
};

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
