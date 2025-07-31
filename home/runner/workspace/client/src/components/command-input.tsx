import { useState } from "react";
import { Send, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommandInputProps {
  onCommand: (command: string) => void;
  disabled?: boolean;
}

export function CommandInput({ onCommand, disabled }: CommandInputProps) {
  const [command, setCommand] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !disabled) {
      onCommand(command.trim());
      setCommand("");
    }
  };

  const quickCommands = [
    "查看背包",
    "查看状态", 
    "休息"
  ];

  return (
    <section className="terminal-border bg-terminal-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="text-terminal-red" size={20} />
        <h3 className="font-semibold text-terminal-red">命令输入</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-red">$</span>
          <Input 
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="输入命令 (例: 向北走, 攻击哥布林, 拿起钥匙)"
            className="w-full bg-terminal-bg border-terminal-border rounded px-8 py-3 focus:border-terminal-red focus:outline-none pl-8 text-terminal-text placeholder:text-terminal-text/50"
            disabled={disabled}
          />
        </div>
        <Button 
          type="submit"
          disabled={!command.trim() || disabled}
          className="bg-terminal-red text-black px-6 py-3 rounded font-semibold hover:bg-terminal-red/80 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
        >
          <Send size={16} />
          {disabled ? "处理中..." : "发送"}
        </Button>
      </form>
      
      {/* Quick Commands */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm text-terminal-text opacity-60 mr-2">快捷命令:</span>
        {quickCommands.map((cmd, index) => (
          <button 
            key={index}
            onClick={() => !disabled && onCommand(cmd)}
            disabled={disabled}
            className="text-xs bg-terminal-bg border border-terminal-border px-2 py-1 rounded hover:border-terminal-red transition-colors disabled:opacity-50"
          >
            {cmd}
          </button>
        ))}
      </div>
    </section>
  );
}