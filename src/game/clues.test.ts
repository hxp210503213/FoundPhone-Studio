import { describe, expect, it } from "vitest";
import { gameData, cluesFor, permanentClues } from "./data";
import {
  canSeeAlbumResidue,
  canSeeOfflineNotes,
  clueById,
  isSmudged,
  needsBreathingFrame,
  withClues,
} from "./clues";
import { initialGameState } from "./data";

const closed = {
  fileManager: false,
  offlineNotesOpen: false,
  albumDetailOpen: false,
};

describe("clues 数据", () => {
  it("两条跨轮回残留线索字段齐全", () => {
    expect(gameData.clues.map((c) => c.id)).toEqual([
      "memo_draft",
      "album_residue",
    ]);
    const memo = clueById("memo_draft");
    expect(memo).toMatchObject({
      app: "offline_notes",
      owner: "zuo_qihan",
      recoverableBy: "yang_bowen",
      availableFromCycle: 2,
      visualState: "smudged",
    });
    expect(memo?.content).toBe("别让他去天台。别让他信考核排名。别让他——");
    const album = clueById("album_residue");
    expect(album).toMatchObject({
      app: "album",
      visualState: "recovered",
      availableFromCycle: 2,
    });
    expect(album?.content).toContain("一张被删掉又恢复的照片");
  });
});

describe("跨轮回残留的可见性", () => {
  it("只有左奇函能看离线笔记", () => {
    expect(canSeeOfflineNotes("zuo_qihan")).toBe(true);
    expect(canSeeOfflineNotes("yang_bowen")).toBe(false);
  });

  it("相册残留只在第 2 轮起对杨博文可见", () => {
    expect(canSeeAlbumResidue("yang_bowen", 1)).toBe(false);
    expect(canSeeAlbumResidue("yang_bowen", 2)).toBe(true);
    expect(canSeeAlbumResidue("zuo_qihan", 5)).toBe(false);
  });

  it("第 1 轮杨博文相册里没有 album_residue", () => {
    const items = withClues("album", [], "yang_bowen", 1, closed);
    expect(items).toHaveLength(0);
  });

  it("第 2 轮杨博文相册里出现 album_residue", () => {
    const items = withClues("album", [], "yang_bowen", 2, closed);
    expect(items.map((i) => i.id)).toEqual(["album_residue"]);
    expect(items[0].meta.visualState).toBe("recovered");
  });

  it("左奇函任何轮次都能在离线笔记里看到 memo_draft", () => {
    for (const cycle of [1, 2, 7]) {
      const items = withClues(
        "offline_notes",
        [],
        "zuo_qihan",
        cycle,
        { ...closed, offlineNotesOpen: true },
      );
      expect(items.map((i) => i.id)).toEqual(["memo_draft"]);
    }
  });

  it("杨博文视角没有离线笔记入口，也就拿不到 memo_draft", () => {
    const items = withClues(
      "offline_notes",
      [],
      "yang_bowen",
      3,
      { ...closed, offlineNotesOpen: true },
    );
    expect(items).toHaveLength(0);
  });

  it("重复投影不会产生重复条目", () => {
    const once = withClues("album", [], "yang_bowen", 2, closed);
    const twice = withClues("album", once, "yang_bowen", 2, closed);
    expect(twice).toHaveLength(1);
  });

  it("呼吸边框只在点开残留详情后出现", () => {
    expect(needsBreathingFrame("album", "album_residue", closed)).toBe(false);
    expect(
      needsBreathingFrame("album", "album_residue", {
        ...closed,
        albumDetailOpen: true,
      }),
    ).toBe(true);
    expect(
      needsBreathingFrame("album", "other", {
        ...closed,
        albumDetailOpen: true,
      }),
    ).toBe(false);
  });

  it("memo_draft 带涂抹视觉状态", () => {
    expect(isSmudged("memo_draft")).toBe(true);
    expect(isSmudged("album_residue")).toBe(false);
  });
});

describe("轮回与视角状态", () => {
  it("初始为第 1 轮、左奇函视角", () => {
    expect(initialGameState.currentCycle).toBe(1);
    expect(initialGameState.currentView).toBe("zuo_qihan");
  });

  it("线索查询按 APP 过滤", () => {
    expect(cluesFor("album", "yang_bowen", 2).map((c) => c.id)).toEqual([
      "album_residue",
    ]);
    expect(cluesFor("album", "yang_bowen", 1)).toHaveLength(0);
    expect(permanentClues("offline_notes")).toHaveLength(0);
  });
});
