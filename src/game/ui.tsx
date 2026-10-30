/**
 * 剧情层叠加在手机外壳上的最小界面元素。
 *
 * 只做三件事：
 * 1. 状态栏左侧「第 X 日」+ 右侧临时按钮（切换视角 / 下一轮）；
 * 2. 左奇函专用的「文件」入口 →「离线笔记」→ memo_draft；
 * 3. 相册残留的呼吸边框与涂抹样式。
 *
 * 不接管桌面网格渲染（那部分交给 src/game/bridge.ts 合并后的 Work），
 * 不改动手机外壳尺寸、壁纸、Dock 与子页面返回逻辑。
 */
import { useState } from "react";
import { ChevronLeft, FileText, Folder, X } from "lucide-react";
import { findCharacter, type GameState } from "./data";
import { canSeeOfflineNotes, clueById, isSmudged } from "./clues";
import type { AccessSettings } from "./access";
import type { GameStore } from "./store";
import "./game-overlay.css";

/** 状态栏左侧：第 X 日 */
export function CycleBadge({ cycle }: { cycle: number }) {
  return (
    <span className="game-cycle-badge" title="集训第几日">
      第 {cycle} 日
    </span>
  );
}

/** 状态栏右侧的临时调试按钮组。正式版本会替换为结算逻辑。 */
export function ViewSwitch({
  state,
  toggleView,
  nextCycle,
}: {
  state: GameState;
  toggleView: () => void;
  nextCycle: () => void;
}) {
  const name = findCharacter(state.currentView)?.name ?? state.currentView;
  return (
    <div className="game-switch">
      <button
        className="game-switch-btn game-switch-view"
        onClick={toggleView}
        aria-label={`切换视角（当前${name}）`}
        title="切换视角"
      >
        {name}
      </button>
      <button
        className="game-switch-btn game-switch-cycle"
        onClick={nextCycle}
        aria-label="强制进入下一轮"
        title="强制进入下一轮（测试用）"
      >
        下一轮
      </button>
    </div>
  );
}

/**
 * 左奇函专用的文件入口。点击后展开「离线笔记」文件夹并显示 memo_draft。
 * 杨博文视角不渲染此组件。
 */
export function FileManagerLayer({
  state,
  access,
  setAccess,
  onBack,
}: {
  state: GameState;
  access: AccessSettings;
  setAccess: GameStore["setAccess"];
  onBack: () => void;
}) {
  const [detail, setDetail] = useState(false);
  const draft = clueById("memo_draft");
  if (!canSeeOfflineNotes(state.currentView)) return null;

  if (!access.offlineNotesOpen) {
    return (
      <div className="game-file-layer">
        <button className="game-file-entry" onClick={() => setAccess({ offlineNotesOpen: true })}>
          <Folder size={17} />
          离线笔记
        </button>
      </div>
    );
  }

  return (
    <div className="game-file-layer open">
      <div className="game-file-head">
        <button
          onClick={() => {
            if (detail) setDetail(false);
            else if (access.offlineNotesOpen) setAccess({ offlineNotesOpen: false });
            else onBack();
          }}
          aria-label="返回"
        >
          <ChevronLeft size={16} />
          {detail ? "离线笔记" : "文件"}
        </button>
        <strong>离线笔记</strong>
        <button
          onClick={() => {
            setDetail(false);
            setAccess({ offlineNotesOpen: false });
            onBack();
          }}
          aria-label="关闭文件"
        >
          <X size={15} />
        </button>
      </div>
      {detail ? (
        <div className="game-note-detail">
          <h3>{draft?.title}</h3>
          {draft && isSmudged(draft.id) ? (
            <p className="game-note-body">
              <span>{draft.content.slice(0, Math.max(0, draft.content.length - 3))}</span>
              <span className="game-smudge" aria-label="被反复涂抹的字迹" />
            </p>
          ) : (
            <p className="game-note-body">{draft?.content}</p>
          )}
          <small className="game-note-meta">本机保存 · 未同步云端</small>
        </div>
      ) : (
        <ul className="game-file-list">
          <li>
            <button onClick={() => setDetail(true)}>
              <FileText size={20} />
              <span>
                <strong>{draft?.title ?? "未命名"}</strong>
                {draft && isSmudged(draft.id) ? (
                  <em className="game-smudge-line">
                    <span className="game-smudge" />
                  </em>
                ) : (
                  <em>{draft?.content}</em>
                )}
              </span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

/** 相册残留详情页的呼吸边框容器。 */
export function BreathingFrame({ children }: { children: React.ReactNode }) {
  return <div className="game-breath-frame">{children}</div>;
}
