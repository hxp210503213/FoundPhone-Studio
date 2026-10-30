/**
 * 剧情状态（十日轮回 / 双视角）的最小实现。
 *
 * 用 React 自带的 useState + Context，不引入外部状态库。
 * 现有 player 存档（IndexedDB 的 Runtime）不受影响，两者互不覆盖：
 * 这里只保存跨 App、跨页面的少量全局字段。
 */
import {
  createElement,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initialGameState, type CharacterId, type GameState } from "./data";
import type { AccessSettings } from "./access";

export type GameStore = {
  state: GameState;
  /** 切换视角；同一角色不变。 */
  setView: (view: CharacterId) => void;
  /** 在两个主角之间来回切。 */
  toggleView: () => void;
  /** 临时按钮：进入下一轮，重置信任与碎片，保留残留线索。 */
  nextCycle: () => void;
  /** 推进到下一集训日；第 10 天夜里由调用方触发重置流程。 */
  nextDay: () => void;
  /** 仅改信任值，供后续剧情使用。 */
  setTrust: (value: number) => void;
  access: AccessSettings;
  setAccess: (patch: Partial<AccessSettings>) => void;
};

const VIEWS: CharacterId[] = ["zuo_qihan", "yang_bowen"];

export const defaultAccess: AccessSettings = {
  fileManager: false,
  offlineNotesOpen: false,
  albumDetailOpen: false,
  seen: [],
};

const GameContext = createContext<GameStore | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => ({ ...initialGameState }));
  const [access, setAccessState] = useState<AccessSettings>(defaultAccess);

  const setView = useCallback((view: CharacterId) => {
    setState((s) => (s.currentView === view ? s : { ...s, currentView: view }));
  }, []);

  const toggleView = useCallback(() => {
    setState((s) => ({
      ...s,
      currentView:
        VIEWS[(VIEWS.indexOf(s.currentView) + 1) % VIEWS.length] ??
        "zuo_qihan",
    }));
  }, []);

  const nextCycle = useCallback(() => {
    setState((s) => ({
      ...s,
      currentCycle: s.currentCycle + 1,
      currentDay: 1,
      trust: 0,
      fragmentsBowen: 0,
    }));
  }, []);

  const nextDay = useCallback(() => {
    setState((s) => ({
      ...s,
      currentDay: Math.min(10, s.currentDay + 1),
    }));
  }, []);

  const setTrust = useCallback((value: number) => {
    setState((s) => ({ ...s, trust: value }));
  }, []);

  const setAccess = useCallback((patch: Partial<AccessSettings>) => {
    setAccessState((a) => ({ ...a, ...patch }));
  }, []);

  const value = useMemo(
    () => ({ state, setView, toggleView, nextCycle, nextDay, setTrust, access, setAccess }),
    [state, setView, toggleView, nextCycle, nextDay, setTrust, access, setAccess],
  );

  return createElement(GameContext.Provider, { value }, children);
}

/** 未包 Provider 时返回 null，调用方据此降级为 origin/main 原有行为。 */
export function useGame(): GameStore | null {
  return useContext(GameContext);
}
