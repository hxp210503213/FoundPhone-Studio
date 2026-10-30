/** 页面级访问开关：记录玩家是否已经走进某个入口。纯状态，不含渲染。 */
export type AccessSettings = {
  /** 是否已从桌面进入「文件」。 */
  fileManager: boolean;
  /** 是否已打开「离线笔记」文件夹。 */
  offlineNotesOpen: boolean;
  /** 是否已打开相册里那条被恢复的截图。 */
  albumDetailOpen: boolean;
};
