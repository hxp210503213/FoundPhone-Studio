import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Phone } from "../Phone";
import { validateWork, type Work } from "../schema";
import { GameProvider, useGame } from "../game/store";
import { withGameApps } from "../game/bridge";
import "../styles.css";
import "./player.css";

/**
 * 桌面图标按当前视角过滤：由 gameData.apps 的 visibleTo 决定谁看得到什么。
 * 视角变化时重新计算，避免写死图标列表。
 */
function ViewedPhone({ work }: { work: Work }) {
  const game = useGame();
  const view = game?.state.currentView ?? "zuo_qihan";
  const scoped = withGameApps(work, view);
  return <Phone work={scoped} />;
}

function StoryPlayer() {
  const [work, setWork] = useState<Work | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    const abort = new AbortController();
    fetch(
      new URLSearchParams(location.search).get("preview") === "test"
        ? "./test-work.json"
        : new URLSearchParams(location.search).get("template") === "blank"
          ? "./blank-work.json"
          : "./work.json",
      { signal: abort.signal },
    )
      .then((r) => {
        if (!r.ok) throw Error("缺少作品文件，请运行 npm run story:build");
        return r.json();
      })
      .then((x) => {
        const w = validateWork(x);
        document.title =
          w.title === "捡手机" ? "捡手机" : w.title + " · 捡手机";
        setWork(w);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e));
      });
    return () => abort.abort();
  }, []);
  return (
    <main className="story-runtime">
      {work ? (
        <GameProvider>
          <ViewedPhone work={work} />
        </GameProvider>
      ) : (
        <p role="status">{error || "正在打开手机…"}</p>
      )}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<StoryPlayer />);
