/**
 * 数据层 → 桌面渲染 的桥接。
 *
 * 现有桌面完全由 Work.apps（{id,name,installed,visible,dock,folder,icon}）驱动，
 * 这里把 src/game/data.ts 的 gameData.apps 翻译成同样的结构，
 * 不新增任何渲染逻辑、不改动 HomeLauncher / Phone。
 *
 * 规则：
 * - installed 恒为 true：这些 App 开局即装；
 * - visible 对应 homeIcon：offline_notes 不进桌面（只能从文件管理进入）；
 * - dock 恒为 false：底部 Dock 保持原样；
 * - folder 留空：玩家在桌面长按仍可自行分组。
 */
import type { Work } from "../schema";
import { gameData, type AppId, type CharacterId } from "./data";

export type GameAppConfig = Work["apps"][number];

/** 当前视角角色可见的 App，翻译为桌面可用的 AppConfig 列表。 */
export function gameAppsFor(view: CharacterId): GameAppConfig[] {
  return gameData.apps
    .filter((app) => (app.visibleTo as readonly string[]).includes(view))
    .map((app) => ({
      id: app.id,
      name: app.name,
      installed: true,
      visible: app.homeIcon,
      dock: false,
      folder: "",
      icon: "",
    }));
}

/** 当前视角下应显示在桌面的 App id（供测试与调试使用）。 */
export function homeAppIdsFor(view: CharacterId): AppId[] {
  return gameAppsFor(view)
    .filter((app) => app.visible)
    .map((app) => app.id as AppId);
}

/**
 * 把这些 App 合并进 Work 的 apps 列表：已存在则覆盖基础字段（保留玩家自定义图标
 * 与文件夹归属），不存在则追加。返回新数组，不修改入参。
 */
export function mergeGameApps(
  apps: Work["apps"],
  view: CharacterId,
): Work["apps"] {
  const incoming = new Map(gameAppsFor(view).map((app) => [app.id, app]));
  const merged = apps.map((app) => {
    const next = incoming.get(app.id);
    if (!next) return app;
    incoming.delete(app.id);
    return {
      ...next,
      icon: app.icon || next.icon,
      // 桌面分组交给玩家：目录一律保持空，长按可自行拖进文件夹
      folder: "",
    };
  });
  return [...merged, ...incoming.values()];
}

/** 对 Work 应用合并，返回新的 Work。 */
export function withGameApps(work: Work, view: CharacterId): Work {
  return { ...work, apps: mergeGameApps(work.apps, view) };
}
