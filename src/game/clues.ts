/**
 * 线索 → App 内容 的投影。
 *
 * 线索本身存在 src/game/data.ts；这里只决定"当前轮次/视角下要不要把它
 * 作为一条记录塞进对应 App 的内容列表"，不改 App 自身的渲染代码。
 *
 * 已接入：
 * - offline_notes：左奇函的隐藏文件夹，常驻（不受轮次限制），涂抹效果；
 * - album（相册）：杨博文视角第 2 轮起出现被恢复的截图，呼吸边框。
 */
import type { Item } from "../schema";
import { findCharacter, gameData, type CharacterId, type Clue } from "./data";
import type { AccessSettings } from "./access";

/** 只有左奇函能碰到本机隐藏文件夹。 */
export function canSeeOfflineNotes(view: CharacterId): boolean {
  return view === "zuo_qihan";
}

/** 杨博文的直觉标记：只有他、且第 2 轮起才恢复出相册残留。 */
export function canSeeAlbumResidue(view: CharacterId, cycle: number): boolean {
  return (
    findCharacter(view)?.intuitionMarker === true && cycle >= 2
  );
}

function toItem(clue: Clue): Item {
  return {
    id: clue.id,
    title: clue.title,
    body: clue.content,
    richText: "",
    meta: {
      origin: "clue",
      visualState: clue.visualState,
      fromCycle: String(clue.availableFromCycle),
    },
    time: "",
    sender: "",
    avatar: "",
    kind: "note",
    media: "",
    hidden: false,
    unlock: "",
    password: "",
    folder: "",
    favorite: false,
    outgoing: false,
    read: false,
    likes: 0,
    comments: [],
  };
}

/** 取某条线索（未定义时返回 undefined）。 */
export function clueById(id: string): Clue | undefined {
  return gameData.clues.find((c) => c.id === id);
}

/**
 * 把当前可见的线索投影成 App 内容条目。
 * 不修改入参 items，返回新数组；线索已存在则不重复插入。
 */
export function withClues(
  app: string,
  items: Item[],
  view: CharacterId,
  cycle: number,
  access: AccessSettings,
): Item[] {
  const extra: Item[] = [];
  if (app === "offline_notes") {
    // 常驻：任何轮次都在，但只有左奇函的视角能看到文件夹
    if (canSeeOfflineNotes(view) && access.offlineNotesOpen) {
      for (const c of gameData.clues.filter((x) => x.app === "offline_notes"))
        if (!items.some((i) => i.id === c.id)) extra.push(toItem(c));
    }
  } else if (app === "album" || app === "photos") {
    if (canSeeAlbumResidue(view, cycle)) {
      for (const c of gameData.clues.filter((x) => x.app === "album"))
        if (!items.some((i) => i.id === c.id)) extra.push(toItem(c));
    }
  }
  return extra.length ? [...items, ...extra] : items;
}

/** 详情页是否要给呼吸边框：被恢复的相册残留，且玩家已点开。 */
export function needsBreathingFrame(
  app: string,
  itemId: string,
  access: AccessSettings,
): boolean {
  return (
    (app === "album" || app === "photos") &&
    itemId === "album_residue" &&
    access.albumDetailOpen
  );
}

/** 涂抹效果：离线笔记里那条没写完的草稿。 */
export function isSmudged(itemId: string): boolean {
  return clueById(itemId)?.visualState === "smudged";
}
