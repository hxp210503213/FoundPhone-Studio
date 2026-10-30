/**
 * 异常痕迹的通用判定与投影辅助。
 *
 * 条件来源有两处：
 * - access.seen：专用 skin（通知 / 门禁）打开详情时手动登记；
 * - runtime read：微信群消息等真实 Item 被阅读后由引擎记录。
 * 两者取并集，任何一处见过即算"看过"。
 */
import type { AccessSettings } from "./access";
import type { CharacterId } from "./data";
import type { NoticeHint } from "./notices";

/** 该 hint 当前是否应当显示。 */
export function hintVisible(
  hint: NoticeHint | undefined,
  view: CharacterId,
  access: AccessSettings,
  read: string[],
): boolean {
  if (!hint) return false;
  if (hint.view ? hint.view !== view : view !== "zuo_qihan") return false;
  const known = new Set([...access.seen, ...read]);
  return hint.requiresSeen.every((id) => known.has(id));
}

/** 登记一个"已看过"的条目 id（去重，返回新数组；已存在则原样返回）。 */
export function markSeenId(seen: string[], id: string): string[] {
  return seen.includes(id) ? seen : [...seen, id];
}

/** 批量登记。 */
export function markSeenIds(seen: string[], ids: string[]): string[] {
  const set = new Set(seen);
  let changed = false;
  for (const id of ids)
    if (!set.has(id)) {
      set.add(id);
      changed = true;
    }
  return changed ? [...set] : seen;
}
