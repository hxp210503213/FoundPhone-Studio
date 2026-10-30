import { describe, expect, it } from "vitest";
import { createEmptyWork } from "../demo";
import { validateWork } from "../schema";
import { getApp } from "../registry";
import { gameAppsFor, homeAppIdsFor, withGameApps } from "./bridge";

describe("数据层接入桌面结构", () => {
  it("左奇函视角：4 个 App 上桌面，offline_notes 不上桌面", () => {
    expect(homeAppIdsFor("zuo_qihan")).toEqual([
      "fj_trainee",
      "schedule",
      "health_steps",
      "access_log",
    ]);
  });

  it("杨博文视角：同样 4 个，且不含 offline_notes", () => {
    const apps = gameAppsFor("yang_bowen");
    expect(apps.map((a) => a.id)).not.toContain("offline_notes");
    expect(apps.every((a) => a.installed && a.visible && !a.dock)).toBe(true);
  });

  it("offline_notes 虽不可见，但仍为该角色已安装", () => {
    const note = gameAppsFor("zuo_qihan").find(
      (a) => a.id === "offline_notes",
    );
    expect(note).toBeDefined();
    expect(note?.installed).toBe(true);
    expect(note?.visible).toBe(false);
  });

  it("每个 gameData App 都在 registry 中登记了名称", () => {
    for (const app of gameAppsFor("zuo_qihan")) {
      expect(getApp(app.id).name).toBe(app.name);
    }
  });

  it("合并进 Work 后仍通过 schema 校验，且不重复", () => {
    const base = createEmptyWork();
    const merged = withGameApps(base, "zuo_qihan");
    expect(validateWork(merged)).toBeTruthy();
    expect(merged.apps.filter((a) => a.id === "fj_trainee")).toHaveLength(1);
    expect(merged.apps.length).toBe(base.apps.length);
    const ids = ["fj_trainee", "schedule", "health_steps", "access_log", "offline_notes"];
    expect(
      merged.apps.filter((a) => ids.includes(a.id)).every((a) => a.folder === ""),
    ).toBe(true);
  });

  it("重复合并不会产生重复条目（幂等）", () => {
    const once = withGameApps(createEmptyWork(), "zuo_qihan");
    const twice = withGameApps(once, "zuo_qihan");
    expect(twice.apps.length).toBe(once.apps.length);
    expect(twice.apps).toEqual(once.apps);
  });

  it("保留玩家自定义图标，并接管目录与可见性", () => {
    const base = createEmptyWork();
    const target = base.apps.find((a) => a.id === "fj_trainee");
    expect(target).toBeDefined();
    if (target) {
      target.icon = "时代";
      target.folder = "集训";
      target.visible = false;
    }
    const merged = withGameApps(base, "zuo_qihan");
    const app = merged.apps.find((a) => a.id === "fj_trainee");
    expect(app?.icon).toBe("时代");
    // 桌面分组由玩家决定，合并时统一清空目录
    expect(app?.folder).toBe("");
    expect(app?.name).toBe("时代峰峻");
    expect(app?.installed).toBe(true);
    expect(app?.visible).toBe(true);
  });
});
