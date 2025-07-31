import { Skull, Server } from "lucide-react";

export function TerminalHeader() {
  return (
    <header className="terminal-border bg-terminal-panel p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skull className="text-terminal-red text-2xl animate-glow" />
          <h1 className="text-2xl font-bold text-terminal-red">转生成为异世界勇者与地下城冒险</h1>
          <span className="text-terminal-purple text-sm">Isekai Hero Dungeon Adventure v1.0</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-terminal-red rounded-full animate-blink"></div>
            <span>DeepSeek API</span>
          </div>
          <div className="text-terminal-purple">
            <Server className="inline mr-1" size={16} />
            Vercel Ready
          </div>
        </div>
      </div>
    </header>
  );
}