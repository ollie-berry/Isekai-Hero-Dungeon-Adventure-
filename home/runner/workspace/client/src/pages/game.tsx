import { useState, useEffect } from "react";
import { TerminalHeader } from "../components/terminal-header";
import { GameStateDisplay } from "../components/game-state-display";
import { CommandInput } from "../components/command-input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateGameContent, getGameSession } from "../lib/game-api";
import { type GameState } from "@shared/schema";

export default function Game() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameLog, setGameLog] = useState<Array<{ message: string; type: string; timestamp: Date }>>([
    { message: "欢迎来到异世界！你作为勇者觉醒在地下城入口", type: "system", timestamp: new Date() }
  ]);
  const [lastResponse, setLastResponse] = useState<string>("");

  const queryClient = useQueryClient();

  // Load existing session if sessionId exists
  const { data: sessionData } = useQuery({
    queryKey: ["/api/session", sessionId],
    enabled: !!sessionId,
    queryFn: () => getGameSession(sessionId!),
  });

  const generateMutation = useMutation({
    mutationFn: generateGameContent,
    onSuccess: (data: any) => {
      setGameState(data.gameState);
      setSessionId(data.sessionId);
      setLastResponse(JSON.stringify(data.gameState, null, 2));
      
      // 记录游戏状态变化到日志
      if (data.gameState.effect) {
        addToGameLog(`效果: ${data.gameState.effect}`, "effect");
      }
      if (data.gameState.enemy) {
        addToGameLog(`遭遇敌人: ${data.gameState.enemy.name} (HP: ${data.gameState.enemy.hp})`, "enemy");
      }
      if (data.gameState.loot) {
        addToGameLog(`发现物品: ${data.gameState.loot.name}`, "loot");
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/session"] });
    },
    onError: (error) => {
      console.error("Failed to generate content:", error);
      addToGameLog("系统错误：无法生成游戏内容", "error");
    },
  });

  const addToGameLog = (message: string, type: string = "system") => {
    setGameLog(prev => [...prev, { message, type, timestamp: new Date() }]);
  };

  const handleCommand = (command: string) => {
    addToGameLog(`执行命令: ${command}`, "command");
    generateMutation.mutate({ 
      command, 
      sessionId: sessionId || undefined 
    });
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "command": return "text-terminal-red font-semibold";
      case "error": return "text-terminal-red";
      case "system": return "text-terminal-purple";
      case "effect": return "text-terminal-amber";
      case "enemy": return "text-terminal-red";
      case "loot": return "text-terminal-purple";
      default: return "text-terminal-text";
    }
  };

  // Initialize game state if we have session data
  if (sessionData && !gameState) {
    setGameState(sessionData.gameState);
    setLastResponse(JSON.stringify(sessionData.gameState, null, 2));
    addToGameLog("游戏会话已恢复", "system");
  }

  // Auto-start the game when component mounts
  useEffect(() => {
    if (!gameState && !sessionId && !generateMutation.isPending) {
      generateMutation.mutate({ command: "开始游戏", sessionId: undefined });
    }
  }, [gameState, sessionId, generateMutation]);

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text font-mono">
      {/* Scanlines Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0" 
           style={{
             backgroundImage: `linear-gradient(transparent 50%, rgba(255, 0, 0, 0.03) 50%)`,
             backgroundSize: `100% 4px`
           }}
      ></div>

      <div className="relative z-10 h-screen flex flex-col p-4 gap-4">
        
        <TerminalHeader />

        {/* Main Game Area */}
        <div className="flex-1 flex gap-4 min-h-0">
          
          {/* Game State Display - Expanded */}
          <main className="flex-1 flex flex-col gap-4">
            <GameStateDisplay 
              gameState={gameState} 
              isLoading={generateMutation.isPending}
            />
            <CommandInput 
              onCommand={handleCommand} 
              disabled={generateMutation.isPending}
            />
          </main>

          {/* Sidebar - Game Log Only */}
          <aside className="w-80 flex flex-col gap-4">
            {/* Game Log */}
            <section className="terminal-border bg-terminal-panel p-4 flex-1 overflow-hidden">
              <h3 className="font-semibold text-terminal-red mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                冒险日志
              </h3>
              
              <div className="bg-terminal-bg p-3 rounded border border-terminal-border h-full overflow-y-auto text-sm space-y-2">
                {gameLog.map((log, index) => (
                  <div key={index} className={`${getLogColor(log.type)} leading-relaxed`}>
                    <span className="text-terminal-text opacity-60 text-xs">
                      [{log.timestamp.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}]
                    </span>
                    <div className="mt-1">{log.message}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* System Status - Compact */}
            <section className="terminal-border bg-terminal-panel p-3">
              <h3 className="font-semibold text-terminal-purple mb-2 text-sm">系统状态</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>AI引擎:</span>
                  <span className={`flex items-center gap-1 ${!generateMutation.isError ? "text-terminal-red" : "text-terminal-red"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${!generateMutation.isError ? "bg-terminal-red" : "bg-terminal-red opacity-50"}`}></div>
                    {!generateMutation.isError ? "运行中" : "连接失败"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>响应时间:</span>
                  <span className="text-terminal-purple">{generateMutation.isPending ? "..." : "~1.2s"}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}