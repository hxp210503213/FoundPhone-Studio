/**
 * 门禁记录（access_log）子页面。
 * 数据来自 src/game/accessLogs.ts；异常提示仅左奇函视角渲染。
 */
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useGame } from "./store";
import { accessLogsFor, findAccessLog } from "./accessLogs";
import { hintVisible, markSeenId } from "./hints";
import "./game-overlay.css";

export function AccessLogSkin({
  onBack,
  read = [],
}: {
  onBack: () => void;
  read?: string[];
}) {
  const game = useGame();
  const view = game?.state.currentView ?? "zuo_qihan";
  const access = game?.access ?? {
    fileManager: false,
    offlineNotesOpen: false,
    albumDetailOpen: false,
    seen: [],
  };
  const [detailId, setDetailId] = useState("");
  const logs = accessLogsFor(view).filter(
    (l) => l.day <= (game?.state.currentDay ?? Number.MAX_SAFE_INTEGER),
  );
  const detail = detailId ? findAccessLog(detailId) : undefined;

  const openDetail = (id: string) => {
    setDetailId(id);
    game?.setAccess({ seen: markSeenId(access.seen, id) });
  };

  if (detail) {
    const hint = hintVisible(detail.hint, view, access, read);
    return (
      <div className="catalog-skin access-log-skin">
        <header className="app-nav catalog-nav">
          <button aria-label="返回门禁列表" onClick={() => setDetailId("")}>
            <ChevronLeft size={22} />
            门禁
          </button>
          <strong>通行详情</strong>
          <div />
        </header>
        <div className="catalog-scroll fj-notice-detail">
          <h1>{detail.location}</h1>
          <small className="fj-notice-day">
            集训第 {detail.day} 天 · {detail.time} · {detail.result}
          </small>
          <p className="fj-notice-body">刷卡人：{detail.card}</p>
          {hint && detail.hint && (
            <small className="game-hint">{detail.hint.text}</small>
          )}
          <button className="fj-back-btn" onClick={() => setDetailId("")}>
            返回门禁列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-skin access-log-skin">
      <header className="app-nav catalog-nav">
        <button aria-label="返回" onClick={onBack}>
          <ChevronLeft size={22} />
        </button>
        <strong>门禁记录</strong>
        <div />
      </header>
      <div className="catalog-scroll">
        <div className="fj-notice-list">
          {logs.map((l) => (
            <button
              key={l.id}
              className="fj-notice-item"
              onClick={() => openDetail(l.id)}
            >
              <small className="fj-notice-day">
                第 {l.day} 天 · {l.time} · {l.result}
              </small>
              <strong>{l.location}</strong>
              <p>{l.card}</p>
            </button>
          ))}
          {logs.length === 0 && <p className="fj-empty">暂无记录</p>}
        </div>
      </div>
    </div>
  );
}
