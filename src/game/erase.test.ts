import { describe, expect, it } from "vitest";
import { erasedIn, erasedNames, rosterLines } from "./erase";
import { erasedNote, NOTES_INTRO, offlineNotes } from "./notes";

describe("抹除机制", () => {
  it("第 1 轮无人缺席（抹除发生在轮末）", () => {
    expect(erasedIn(1)).toEqual([]);
    expect(erasedNames(1)).toEqual([]);
  });

  it("第 2 轮起陈浚铭缺席", () => {
    expect(erasedNames(2)).toEqual(["陈浚铭"]);
  });

  it("第 3 轮起陈浚铭、张函瑞都缺席", () => {
    expect(erasedNames(3)).toEqual(["陈浚铭", "张函瑞"]);
  });

  it("第 2 轮名单行号跳号：缺 4 与 7", () => {
    const lines = rosterLines(2);
    expect(lines).not.toContain("4. 陈浚铭");
    expect(lines.some((l) => l.startsWith("5."))).toBe(true);
    expect(lines).toHaveLength(7);
  });

  it("第 3 轮名单只剩 6 行", () => {
    expect(rosterLines(3)).toHaveLength(6);
  });

  it("note_000 存在且为置顶模糊笔记", () => {
    expect(erasedNote.id).toBe("note_000");
    expect(erasedNote.visualState).toBe("blurred");
    expect(erasedNote.content).toContain("陈浚铭");
    expect(erasedNote.content).toContain("张函瑞");
    // 常规笔记列表不包含 note_000（它单独置顶）
    expect(offlineNotes.some((n) => n.id === "note_000")).toBe(false);
  });

  it("首开旁白存在", () => {
    expect(NOTES_INTRO).toContain("笔迹是你的");
  });
});
