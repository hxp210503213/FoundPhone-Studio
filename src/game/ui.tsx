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
import {
  NOTES_INTRO,
  erasedNote,
  offlineNotes,
  type OfflineNote,
} from "./notes";
import type { AccessSettings } from "./access";
import { markSeenId } from "./hints";
import type { GameStore } from "./store";
import "./game-overlay.css";

/** 状态栏左侧：第 X 轮 · 第 Y 日 */
export function CycleBadge({ cycle, day }: { cycle: number; day?: number }) {
  return (
    <span className="game-cycle-badge" title="当前轮回与集训日">
      第 {cycle} 轮{day ? ` · 第 ${day} 日` : ""}
    </span>
  );
}

/** 状态栏右侧的临时调试按钮组。正式版本会替换为结算逻辑。 */
export function ViewSwitch({
  state,
  toggleView,
  nextCycle,
  nextDay,
  onReset,
}: {
  state: GameState;
  toggleView: () => void;
  nextCycle: () => void;
  /** 推进到下一集训日；第 10 天夜里由 onReset 接管。 */
  nextDay: () => void;
  /** 第 10 天夜里点「下一日」时触发的重置流程。 */
  onReset?: () => void;
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
        className="game-switch-btn game-switch-day"
        onClick={() => {
          if (state.currentDay >= 10) onReset?.();
          else nextDay();
        }}
        aria-label="推进到下一集训日"
        title="下一集训日（第 10 天夜里触发重置）"
      >
        下一日
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
  const [detailId, setDetailId] = useState<string | null>(null);
  const draft = clueById("memo_draft");
  if (!canSeeOfflineNotes(state.currentView)) return null;

  const detail = detailId ?? null;
  const isDraft = detail === "memo_draft";
  const detailNote = offlineNotes.find((n) => n.id === detail);
  /** 列表顺序：memo_draft（跨轮回残留）置顶，其余按 dayWritten 正序。 */
  const notes = [...offlineNotes].sort((a, b) => a.dayWritten - b.dayWritten);

  const renderBody = (content: string, smudged: boolean) =>
    smudged ? (
      <p className="game-note-body">
        <span>{content.slice(0, Math.max(0, content.length - 3))}</span>
        <span className="game-smudge" aria-label="被反复涂抹的字迹" />
      </p>
    ) : (
      <p className="game-note-body">{content}</p>
    );

  /** note_000：置顶的「已抹除」名单，文字边缘轻微模糊。 */
  const renderErasedBody = (content: string) => (
    <p className="game-note-body game-note-blur">
      {content.split("\n").map((line, i) => (
        <span key={i}>
          {line}
          {i < content.split("\n").length - 1 && <br />}
        </span>
      ))}
    </p>
  );

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
            if (detail) setDetailId(null);
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
            setDetailId(null);
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
          {isDraft ? (
            <>
              <h3>
                没写完 <em className="game-note-tag">未完成</em>
              </h3>
              {draft && renderBody(draft.content, isSmudged("memo_draft"))}
            </>
          ) : detail === "note_000" ? (
            <>
              <h3>
                {erasedNote.title}{" "}
                <em className="game-note-tag game-note-tag-muted">已抹除</em>
              </h3>
              {renderErasedBody(erasedNote.content)}
            </>
          ) : detailNote ? (
            <>
              <h3>{detailNote.title}</h3>
              {renderBody(detailNote.content, detailNote.visualState === "smudged")}
            </>
          ) : null}
          <small className="game-note-meta">本机保存 · 未同步云端</small>
        </div>
      ) : (
        <ul className="game-file-list">
          {!access.seen.includes("offline_notes_intro") && (
            <li>
              <button
                className="game-narration"
                onClick={() =>
                  setAccess({
                    seen: markSeenId(access.seen, "offline_notes_intro"),
                  })
                }
              >
                {NOTES_INTRO}
                <em>（点击继续）</em>
              </button>
            </li>
          )}
          <li>
            <button onClick={() => setDetailId("note_000")}>
              <FileText size={20} />
              <span>
                <strong>
                  {erasedNote.title}{" "}
                  <em className="game-note-tag game-note-tag-muted">已抹除</em>
                </strong>
                <em className="game-note-blur">{erasedNote.content.split("\n")[0]}</em>
              </span>
            </button>
          </li>
          {draft && (
            <li>
              <button onClick={() => setDetailId("memo_draft")}>
                <FileText size={20} />
                <span>
                  <strong>
                    没写完 <em className="game-note-tag">未完成</em>
                  </strong>
                  {isSmudged("memo_draft") ? (
                    <em className="game-smudge-line">
                      <span className="game-smudge" />
                    </em>
                  ) : (
                    <em>{draft.content}</em>
                  )}
                </span>
              </button>
            </li>
          )}
          {notes.map((note: OfflineNote) => (
            <li key={note.id}>
              <button onClick={() => setDetailId(note.id)}>
                <FileText size={20} />
                <span>
                  <strong>{note.title}</strong>
                  <em className="game-note-day">第 {note.dayWritten} 天记录</em>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 相册残留详情页的呼吸边框容器。 */
export function BreathingFrame({ children }: { children: React.ReactNode }) {
  return <div className="game-breath-frame">{children}</div>;
}
