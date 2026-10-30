/**
 * 时代峰峻（fj_trainee）子页面：通知 / 排名 / 反馈 三个标签。
 *
 * 数据来自 src/game/notices.ts；按 currentView 过滤 visibleTo。
 * 复用现有 AppWindow 容器与返回逻辑（onBack），只新增一个详情层级。
 */
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useGame } from "./store";
import { findNotice, noticesFor, type Notice, type NoticeType } from "./notices";
import "./game-overlay.css";

const TYPE_LABEL: Record<NoticeType, string> = {
  course: "课程",
  assessment: "考核",
  staff: "工作人员",
};

type TabKey = "notices" | "ranking" | "feedback";
const TABS: { key: TabKey; label: string }[] = [
  { key: "notices", label: "通知" },
  { key: "ranking", label: "排名" },
  { key: "feedback", label: "反馈" },
];

export function FjTraineeSkin({ onBack }: { onBack: () => void }) {
  const game = useGame();
  const view = game?.state.currentView ?? "zuo_qihan";
  const [tab, setTab] = useState<TabKey>("notices");
  const [detailId, setDetailId] = useState("");

  const daily = noticesFor(view, ["course", "staff"]);
  const ranking = noticesFor(view, ["assessment"]);
  const detail: Notice | undefined = detailId ? findNotice(detailId) : undefined;

  if (detail) {
    return (
      <div className="catalog-skin fj-trainee">
        <header className="app-nav catalog-nav">
          <button aria-label="返回通知列表" onClick={() => setDetailId("")}>
            <ChevronLeft size={22} />
            通知
          </button>
          <strong>{TYPE_LABEL[detail.type]}</strong>
          <div />
        </header>
        <div className="catalog-scroll fj-notice-detail">
          <h1>{detail.title}</h1>
          <small className="fj-notice-day">集训第 {detail.day} 天</small>
          <p className="fj-notice-body">{detail.content}</p>
          <button className="fj-back-btn" onClick={() => setDetailId("")}>
            返回通知列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-skin fj-trainee">
      <header className="app-nav catalog-nav">
        <button aria-label="返回" onClick={onBack}>
          <ChevronLeft size={22} />
        </button>
        <strong>时代峰峻</strong>
        <div />
      </header>
      <div className="fj-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={tab === t.key ? "active" : ""}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="catalog-scroll">
        {tab === "notices" && (
          <div className="fj-notice-list">
            {daily.map((n) => (
              <button
                key={n.id}
                className="fj-notice-item"
                onClick={() => setDetailId(n.id)}
              >
                <small className="fj-notice-day">第 {n.day} 天 · {TYPE_LABEL[n.type]}</small>
                <strong>{n.title}</strong>
                <p>{n.content}</p>
              </button>
            ))}
            {daily.length === 0 && <p className="fj-empty">暂无通知</p>}
          </div>
        )}
        {tab === "ranking" && (
          <div className="fj-notice-list">
            {ranking.map((n) => (
              <button
                key={n.id}
                className="fj-notice-item"
                onClick={() => setDetailId(n.id)}
              >
                <small className="fj-notice-day">第 {n.day} 天 · 考核</small>
                <strong>{n.title}</strong>
                <p>{n.content}</p>
              </button>
            ))}
            {ranking.length === 0 && <p className="fj-empty">暂无排名</p>}
          </div>
        )}
        {tab === "feedback" && <p className="fj-empty">暂无反馈内容</p>}
      </div>
    </div>
  );
}
