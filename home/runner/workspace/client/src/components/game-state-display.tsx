import { Eye, FlashlightOff, DoorOpen, ArrowUp, ArrowRight, Skull, FlaskConical, Package, Key, Sword, Shield, BookOpen, Crown, Gem, Coins, Hammer, Axe, ScrollText, Trophy, Heart, Star, Zap } from "lucide-react";
import { type GameState } from "@shared/schema";

interface GameStateDisplayProps {
  gameState: GameState | null;
  isLoading: boolean;
}

export function GameStateDisplay({ gameState, isLoading }: GameStateDisplayProps) {
  if (isLoading) {
    return (
      <section className="terminal-border bg-terminal-panel p-6 flex-1 overflow-hidden">
        <h2 className="text-lg font-semibold text-terminal-green mb-4 flex items-center gap-2">
          <Eye size={20} />
          当前场景
        </h2>
        <div className="flex items-center justify-center h-full">
          <div className="text-terminal-amber">正在生成游戏内容...</div>
        </div>
      </section>
    );
  }

  if (!gameState) {
    return (
      <section className="terminal-border bg-terminal-panel p-6 flex-1 overflow-hidden">
        <h2 className="text-lg font-semibold text-terminal-green mb-4 flex items-center gap-2">
          <Eye size={20} />
          当前场景
        </h2>
        <div className="flex items-center justify-center h-full">
          <div className="text-terminal-text opacity-60">输入命令开始游戏...</div>
        </div>
      </section>
    );
  }

  const getObjectIcon = (obj: string) => {
    const objLower = obj.toLowerCase();
    if (objLower.includes("火把") || objLower.includes("torch")) return <FlashlightOff size={16} className="text-terminal-amber" />;
    if (objLower.includes("门") || objLower.includes("door")) return <DoorOpen size={16} className="text-terminal-red" />;
    if (objLower.includes("宝箱") || objLower.includes("箱子") || objLower.includes("chest")) return <Package size={16} className="text-terminal-purple" />;
    if (objLower.includes("钥匙") || objLower.includes("key")) return <Key size={16} className="text-terminal-amber" />;
    if (objLower.includes("剑") || objLower.includes("sword")) return <Sword size={16} className="text-terminal-red" />;
    if (objLower.includes("盾") || objLower.includes("shield")) return <Shield size={16} className="text-terminal-blue" />;
    if (objLower.includes("书") || objLower.includes("book")) return <BookOpen size={16} className="text-terminal-purple" />;
    if (objLower.includes("王冠") || objLower.includes("crown")) return <Crown size={16} className="text-terminal-amber" />;
    if (objLower.includes("宝石") || objLower.includes("gem")) return <Gem size={16} className="text-terminal-purple" />;
    if (objLower.includes("金币") || objLower.includes("coin")) return <Coins size={16} className="text-terminal-amber" />;
    if (objLower.includes("锤") || objLower.includes("hammer")) return <Hammer size={16} className="text-terminal-red" />;
    if (objLower.includes("斧") || objLower.includes("axe")) return <Axe size={16} className="text-terminal-red" />;
    if (objLower.includes("卷轴") || objLower.includes("scroll")) return <ScrollText size={16} className="text-terminal-purple" />;
    if (objLower.includes("奖杯") || objLower.includes("trophy")) return <Trophy size={16} className="text-terminal-amber" />;
    if (objLower.includes("药水") || objLower.includes("potion")) return <FlaskConical size={16} className="text-terminal-red" />;
    if (objLower.includes("魔法") || objLower.includes("magic")) return <Zap size={16} className="text-terminal-purple" />;
    if (objLower.includes("星") || objLower.includes("star")) return <Star size={16} className="text-terminal-amber" />;
    return <span className="w-4 h-4 inline-block text-terminal-red">◆</span>;
  };

  const getExitIcon = (exit: string) => {
    switch (exit.toLowerCase()) {
      case "north": return <ArrowUp size={16} />;
      case "east": return <ArrowRight size={16} />;
      case "south": return <span className="transform rotate-180 inline-block"><ArrowUp size={16} /></span>;
      case "west": return <span className="transform rotate-180 inline-block"><ArrowRight size={16} /></span>;
      default: return <span>→</span>;
    }
  };

  return (
    <section className="terminal-border bg-terminal-panel p-6 flex-1 overflow-hidden">
      <h2 className="text-lg font-semibold text-terminal-red mb-4 flex items-center gap-2">
        <Eye size={20} />
        当前场景
      </h2>
      
      <div className="space-y-4 overflow-y-auto h-full">
        {/* Room Description */}
        <div className="border-l-4 border-terminal-red pl-4">
          <h3 className="text-terminal-purple font-semibold mb-2">房间描述</h3>
          <p className="leading-relaxed">{gameState.room}</p>
        </div>

        {/* Interactive Objects */}
        {gameState.objects.length > 0 && (
          <div className="border-l-4 border-terminal-purple pl-4">
            <h3 className="text-terminal-purple font-semibold mb-2">可互动对象</h3>
            <div className="flex flex-wrap gap-2">
              {gameState.objects.map((obj, index) => (
                <span key={index} className="bg-terminal-bg px-3 py-1 rounded border border-terminal-border text-sm flex items-center gap-1">
                  {getObjectIcon(obj)}
                  {obj}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Available Exits */}
        {gameState.exits.length > 0 && (
          <div className="border-l-4 border-terminal-purple pl-4">
            <h3 className="text-terminal-purple font-semibold mb-2">可用出口</h3>
            <div className="grid grid-cols-2 gap-2">
              {gameState.exits.map((exit, index) => (
                <div key={index} className="bg-terminal-bg p-2 rounded border border-terminal-border text-center flex flex-col items-center gap-1">
                  {getExitIcon(exit)}
                  <span className="text-xs">向{exit === "north" ? "北" : exit === "south" ? "南" : exit === "east" ? "东" : "西"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enemy Information */}
        {gameState.enemy && (
          <div className="border-l-4 border-terminal-red pl-4">
            <h3 className="text-terminal-red font-semibold mb-2">敌人信息</h3>
            <div className="bg-terminal-bg p-3 rounded border border-terminal-red">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-terminal-red flex items-center gap-1">
                  <Skull size={16} />
                  {gameState.enemy.name}
                </span>
                <span className="text-sm text-terminal-amber">
                  HP: {gameState.enemy.hp}/{gameState.enemy.maxHp || gameState.enemy.hp}
                </span>
              </div>
              <div className="w-full bg-terminal-border rounded">
                <div 
                  className="bg-terminal-red h-2 rounded transition-all duration-300" 
                  style={{ 
                    width: `${(gameState.enemy.hp / (gameState.enemy.maxHp || gameState.enemy.hp)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Loot Information */}
        {gameState.loot && (
          <div className="border-l-4 border-terminal-purple pl-4">
            <h3 className="text-terminal-purple font-semibold mb-2">战利品</h3>
            <div className="bg-terminal-bg p-3 rounded border border-terminal-purple">
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical size={16} className="text-terminal-red" />
                <span className="font-semibold">{gameState.loot.name}</span>
              </div>
              <p className="text-sm text-terminal-text opacity-80">{gameState.loot.desc}</p>
            </div>
          </div>
        )}

        {/* Player Status */}
        <div className="border-l-4 border-terminal-red pl-4">
          <h3 className="text-terminal-red font-semibold mb-2">勇者状态</h3>
          <div className="bg-terminal-bg p-3 rounded border border-terminal-border">
            <div className="flex items-center justify-between mb-2">
              <span>生命值</span>
              <span className="text-terminal-purple">
                {gameState.playerHp}/{gameState.playerMaxHp}
              </span>
            </div>
            <div className="w-full bg-terminal-border rounded">
              <div 
                className="bg-terminal-red h-2 rounded transition-all duration-300" 
                style={{ width: `${(gameState.playerHp / gameState.playerMaxHp) * 100}%` }}
              ></div>
            </div>
            {gameState.inventory.length > 0 && (
              <div className="mt-3">
                <div className="text-sm text-terminal-purple mb-1">背包:</div>
                <div className="flex flex-wrap gap-1">
                  {gameState.inventory.map((item, index) => (
                    <span key={index} className="text-xs bg-terminal-bg border border-terminal-border px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Effect */}
        {gameState.effect && (
          <div className="border-l-4 border-terminal-amber pl-4">
            <h3 className="text-terminal-amber font-semibold mb-2">特殊效果</h3>
            <p className="text-terminal-amber">{gameState.effect}</p>
          </div>
        )}
      </div>
    </section>
  );
}