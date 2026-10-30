import { describe, expect, it } from "vitest";
import { findNotice, notices, noticesFor } from "./notices";

const ALL = [
  "zuo_qihan",
  "yang_bowen",
  "wang_lujie",
  "zhang_hanrui",
  "zhang_guiyuan",
  "chen_yiheng",
  "chen_junming",
  "chen_sihan",
];

describe("notices 日常通知数据", () => {
  it("共 6 条，id 与规范一致", () => {
    expect(notices.map((n) => n.id)).toEqual([
      "notice_001",
      "notice_002",
      "notice_003",
      "notice_004",
      "notice_005",
      "notice_006",
    ]);
  });

  it("全部属于 fj_trainee，day 在 1—3", () => {
    for (const n of notices) {
      expect(n.app).toBe("fj_trainee");
      expect(n.day).toBeGreaterThanOrEqual(1);
      expect(n.day).toBeLessThanOrEqual(3);
    }
  });

  it("每条对 8 个角色全部可见", () => {
    for (const n of notices) expect(n.visibleTo).toEqual(ALL);
  });

  it("通知标签（course+staff）有 4 条，排名标签（assessment）有 2 条", () => {
    expect(noticesFor("zuo_qihan", ["course", "staff"])).toHaveLength(4);
    expect(noticesFor("zuo_qihan", ["assessment"])).toHaveLength(2);
  });

  it("按天正序排列", () => {
    const days = noticesFor("yang_bowen", ["course", "staff", "assessment"]).map(
      (n) => n.day,
    );
    expect(days).toEqual([...days].sort((a, b) => a - b));
  });

  it("关键内容与规范一致", () => {
    expect(findNotice("notice_001")?.title).toBe("集训第 1 天课程安排");
    expect(findNotice("notice_006")?.content).toBe("集训期间天台暂不开放，请勿自行前往。");
    expect(findNotice("notice_005")?.content).toContain("COVER 奖励细则");
  });

  it("切换视角时通知相同（visibleTo 全包含）", () => {
    expect(noticesFor("zuo_qihan", ["course"])).toEqual(
      noticesFor("yang_bowen", ["course"]),
    );
  });
});
