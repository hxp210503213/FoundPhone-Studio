/**
 * 抹除机制（批次①地基）。
 *
 * 设定：每失败一轮，随机抹除一个人。被抹除者从所有 APP 中消失：
 * 微信消息变空白气泡、相册照片变灰色方块、名单少一行（行号跳号）、
 * 健康步数记录消失。只有左奇函的离线笔记 note_000 还留着名字。
 *
 * 抹除发生在"该轮结束时"：
 * - 第 1 轮结束 → 陈浚铭被抹除（第 2 轮起缺席）；
 * - 第 2 轮结束 → 张函瑞被抹除（第 3 轮起缺席）。
 */

export type Erasure = {
  /** 哪一轮结束时被抹除。 */
  cycle: number;
  characterId: string;
  name: string;
};

export const erasures: Erasure[] = [
  { cycle: 1, characterId: "chen_junming", name: "陈浚铭" },
  { cycle: 2, characterId: "zhang_hanrui", name: "张函瑞" },
];

/** 当前轮次里已缺席的人（在第 X 轮时，所有 < X 轮结束被抹除者都缺席）。 */
export function erasedIn(cycle: number): Erasure[] {
  return erasures.filter((e) => e.cycle < cycle);
}

/** 当前轮次里已缺席者的名字。 */
export function erasedNames(cycle: number): string[] {
  return erasedIn(cycle).map((e) => e.name);
}

/**
 * 集训名单渲染（行号跳号）：被抹除者的名字消失，但行号保留跳号。
 * 例：第 2 轮名单为 1.左奇函 2.杨博文 3.王橹杰 5.张函瑞 …
 */
export function rosterLines(cycle: number): string[] {
  const all = [
    "左奇函",
    "杨博文",
    "王橹杰",
    "张函瑞",
    "张桂源",
    "陈奕恒",
    "陈浚铭",
    "陈思罕",
  ];
  const gone = new Set(erasedNames(cycle));
  return all
    .map((name, i) => ({ name, no: i + 1 }))
    .filter((x) => !gone.has(x.name))
    .map((x) => `${x.no}. ${x.name}`);
}
