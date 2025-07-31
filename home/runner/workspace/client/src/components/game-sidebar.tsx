import { Code, History, Settings } from "lucide-react";

interface GameSidebarProps {
  lastResponse: string;
  gameLog: Array<{ message: string; type: string; timestamp: Date }>;
  isConnected: boolean;
  responseTime: string;
}

export function GameSidebar({ lastResponse, gameLog, isConnected, responseTime }: GameSidebarProps) {
  const formatJSON = (jsonString: string) => {
    if (!jsonString) return "";
    
    return jsonString
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
      .replace(/: (true|false|null)/g, ': <span class="json-boolean">$1</span>');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "command": return "text-terminal-red";
      case "error": return "text-terminal-red";
      case "system": return "text-terminal-purple";
      default: return "text-terminal-text";
    }
  };

  return (
    <aside className="w-80 flex flex-col gap-4">
      
      {/* API Response JSON */}
      <section className="terminal-border bg-terminal-panel p-4 flex-1 overflow-hidden">
        <h3 className="font-semibold text-terminal-purple mb-3 flex items-center gap-2">
          <Code size={20} />
          API 响应 (JSON)
        </h3>
        
        <div className="bg-terminal-bg p-3 rounded border border-terminal-border h-full overflow-y-auto text-xs">
          <pre 
            className="whitespace-pre-wrap" 
            dangerouslySetInnerHTML={{ 
              __html: lastResponse ? formatJSON(lastResponse) : "等待API响应..." 
            }}
          />
        </div>
      </section>

      {/* Game Log */}
      <section className="terminal-border bg-terminal-panel p-4 h-48 overflow-hidden">
        <h3 className="font-semibold text-terminal-red mb-3 flex items-center gap-2">
          <History size={20} />
          游戏日志
        </h3>
        
        <div className="bg-terminal-bg p-3 rounded border border-terminal-border h-32 overflow-y-auto text-sm space-y-1">
          {gameLog.map((log, index) => (
            <div key={index} className={getLogColor(log.type)}>
              <span className="text-terminal-text opacity-60">[{formatTime(log.timestamp)}]</span>{" "}
              {log.type === "command" && "> "}{log.message}
            </div>
          ))}
        </div>
      </section>

      {/* System Status */}
      <section className="terminal-border bg-terminal-panel p-4">
        <h3 className="font-semibold text-terminal-purple mb-3 flex items-center gap-2">
          <Settings size={20} />
          系统状态
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>DeepSeek API:</span>
            <span className={`flex items-center gap-1 ${isConnected ? "text-terminal-red" : "text-terminal-red"}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-terminal-red" : "bg-terminal-red"}`}></div>
              {isConnected ? "已连接" : "连接失败"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Vercel Function:</span>
            <span className="text-terminal-red flex items-center gap-1">
              <div className="w-2 h-2 bg-terminal-red rounded-full"></div>
              运行中
            </span>
          </div>
          <div className="flex justify-between">
            <span>响应时间:</span>
            <span className="text-terminal-purple">{responseTime}</span>
          </div>
          <div className="flex justify-between">
            <span>当前会话:</span>
            <span className="text-terminal-text">活跃</span>
          </div>
        </div>
      </section>
    </aside>
  );
}