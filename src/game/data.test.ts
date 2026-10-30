/**
 * 数据一致性测试：只校验数据层，不涉及任何界面渲染。
 */
import { describe, expect, it } from "vitest";
import {
  APP_IDS,
  CHARACTER_IDS,
  appsVisibleTo,
  findApp,
  findCharacter,
  gameData,
  getGameState,
  initialGameState,
} from "./data";

describe("gameData.characters", () => {
  it("包含 8 名角色且 id 顺序与规范一致", () => {
    expect(gameData.characters.map((c) => c.id)).toEqual([
      "zuo_qihan",
      "yang_bowen",
      "wang_lujie",
      "zhang_hanrui",
      "zhang_guiyuan",
      "chen_yiheng",
      "chen_junming",
      "chen_sihan",
    ]);
  });

  it("每名角色都有 id / name / role / personality / appAccess", () => {
    for (const c of gameData.characters) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.role).toBeTruthy();
      expect(c.personality).toBeTruthy();
      expect(Array.isArray(c.appAccess)).toBe(true);
      expect(c.appAccess.length).toBeGreaterThan(0);
    }
  });

  it("只有左奇函拥有 offline_notes", () => {
    const owners = gameData.characters
      .filter((c) => c.appAccess.includes("offline_notes"))
      .map((c) => c.id);
    expect(owners).toEqual(["zuo_qihan"]);
    expect(findCharacter("zuo_qihan")?.offlineNotes).toBe(true);
  });

  it("只有杨博文带 intuitionMarker，且看不到 offline_notes", () => {
    const marked = gameData.characters
      .filter((c) => c.intuitionMarker)
      .map((c) => c.id);
    expect(marked).toEqual(["yang_bowen"]);
    expect(findCharacter("yang_bowen")?.appAccess).not.toContain(
      "offline_notes",
    );
  });

  it("其余六名角色为基础 APP 列表", () => {
    const others = gameData.characters.filter(
      (c) => c.id !== "zuo_qihan" && c.id !== "yang_bowen",
    );
    expect(others).toHaveLength(6);
    for (const c of others) {
      expect(c.appAccess).toEqual([
        "fj_trainee",
        "schedule",
        "health_steps",
        "access_log",
      ]);
    }
  });
});

describe("gameData.apps", () => {
  it("包含 5 个 APP 且 id 顺序与规范一致", () => {
    expect(gameData.apps.map((a) => a.id)).toEqual([
      "fj_trainee",
      "schedule",
      "health_steps",
      "access_log",
      "offline_notes",
    ]);
  });

  it("名称与规范一致", () => {
    expect(gameData.apps.map((a) => a.name)).toEqual([
      "时代峰峻",
      "课程表",
      "健康步数",
      "门禁记录",
      "离线笔记",
    ]);
  });

  it("offline_notes 只对左奇函可见且不上桌面", () => {
    const app = findApp("offline_notes");
    expect(app?.visibleTo).toEqual(["zuo_qihan"]);
    expect(app?.homeIcon).toBe(false);
  });

  it("其余四个 APP 对 8 人全部可见", () => {
    for (const id of ["fj_trainee", "schedule", "health_steps", "access_log"]) {
      expect(findApp(id)?.visibleTo).toEqual(CHARACTER_IDS);
    }
  });

  it("visibleTo 中没有未知角色 id", () => {
    for (const app of gameData.apps) {
      for (const id of app.visibleTo) expect(CHARACTER_IDS).toContain(id);
    }
  });

  it("所有 appAccess 中的 id 都在 APP_IDS 中登记", () => {
    for (const c of gameData.characters) {
      for (const id of c.appAccess) expect(APP_IDS).toContain(id);
    }
  });

  it("appsVisibleTo 与 visibleTo 保持一致", () => {
    expect(appsVisibleTo("zuo_qihan").map((a) => a.id)).toEqual(APP_IDS);
    expect(appsVisibleTo("yang_bowen").map((a) => a.id)).toEqual([
      "fj_trainee",
      "schedule",
      "health_steps",
      "access_log",
    ]);
  });
});

describe("gameState", () => {
  it("初始值符合规范", () => {
    expect(initialGameState).toEqual({
      currentCycle: 1,
      currentView: "zuo_qihan",
      trust: 0,
      alert: 0,
      fragmentsBowen: 0,
    });
  });

  it("每次取到的是独立副本", () => {
    const a = getGameState();
    const b = getGameState();
    expect(a).not.toBe(b);
    a.trust = 9;
    expect(b.trust).toBe(0);
  });
});
