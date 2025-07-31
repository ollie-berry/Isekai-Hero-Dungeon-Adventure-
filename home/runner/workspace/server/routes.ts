import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { commandRequestSchema, gameStateSchema, type GameState } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate game content using DeepSeek API
  app.post("/api/generate", async (req, res) => {
    try {
      const { command, sessionId } = commandRequestSchema.parse(req.body);
      
      let currentSession = null;
      let currentGameState: GameState | null = null;

      // Get existing session if provided
      if (sessionId) {
        currentSession = await storage.getGameSession(sessionId);
        if (currentSession) {
          currentGameState = gameStateSchema.parse(currentSession.gameState);
        }
      }

      // If no session exists, create initial game state
      if (!currentGameState) {
        currentGameState = {
          room: "你站在异世界地下城的入口大厅。古老的石柱支撑着高大的拱顶，墙壁上镶嵌着发光的魔法水晶。地面铺着磨损的石板，远处传来神秘的回声。作为转生的勇者，你感受到体内涌动的力量。",
          objects: ["魔法水晶", "古老石桌", "勇者装备箱"],
          exits: ["north", "east", "west"],
          enemy: null,
          loot: { name: "新手剑", desc: "锋利的铁剑，适合初学者使用" },
          effect: "你感受到了异世界的魔力在体内觉醒",
          playerHp: 12,
          playerMaxHp: 12,
          inventory: ["勇者徽章"],
        };
      }

      // Call DeepSeek API
      const newGameState = await queryDeepSeekAPI(command, currentGameState);
      
      // Create or update session
      let session;
      if (currentSession) {
        session = await storage.updateGameSession(currentSession.id, newGameState, command);
      } else {
        session = await storage.createGameSession({
          userId: null,
          gameState: newGameState,
          lastCommand: command,
        });
      }

      res.json({
        gameState: newGameState,
        sessionId: session?.id,
        success: true,
      });

    } catch (error) {
      console.error("Error in /api/generate:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: error.errors,
        });
      }

      res.status(500).json({
        message: "Failed to generate game content",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get game session
  app.get("/api/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getGameSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      const gameState = gameStateSchema.parse(session.gameState);
      res.json({
        gameState,
        sessionId: session.id,
        lastCommand: session.lastCommand,
      });

    } catch (error) {
      console.error("Error getting session:", error);
      res.status(500).json({
        message: "Failed to get session",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function queryDeepSeekAPI(playerInput: string, currentState: GameState): Promise<GameState> {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error("DeepSeek API key not found in environment variables");
  }

  try {
    const systemPrompt = `你是一个文字地牢冒险游戏引擎，请根据玩家的输入，返回一个当前游戏状态的 JSON 格式描述，必须严格符合如下结构：

当前游戏状态：
${JSON.stringify(currentState, null, 2)}

{
  "room": "房间描述，简洁但有画面感，比如：'你站在一间潮湿的石室中，墙上挂着破烂的布幔。'",
  "objects": ["房间内可以互动的对象，如：石桌、宝箱、雕像等"],
  "exits": ["可以离开的方向，如：north", "south", "east", "west"],
  "enemy": {"name": "敌人名称，如哥布林", "hp": 敌人当前血量（整数）, "maxHp": 敌人最大血量（整数）}，如果没有敌人请设置为 null，
  "loot": {"name": "道具名称，如红药水瓶", "desc": "道具描述，如'可以恢复2点生命值'"}，如果没有请设为 null，
  "effect": "当前回合的额外效果描述，比如'你受到敌人攻击，失去2点生命'，没有请设为 null",
  "playerHp": 玩家当前血量（整数）,
  "playerMaxHp": 玩家最大血量（整数）,
  "inventory": ["背包物品1", "背包物品2"]
}

请根据玩家的输入内容合理生成结果。例如：

- 如果玩家输入"向北走"，你应更换房间描述、可能更新 exits、objects 和 enemy。
- 如果玩家输入"攻击哥布林"，你应处理战斗逻辑，例如敌人掉血、是否死亡、是否反击等。
- 如果玩家输入"使用红药水"，请在 effect 中描述其效果，并适当移除 loot。

返回的 JSON 必须结构完整、字段齐全、键名固定，避免包含任何解释性文字或代码块标记。

游戏风格偏向轻度奇幻，不要太过黑暗。保持语言清晰简洁，适合普通玩家阅读。对象名称要丰富多样，包括：宝箱、钥匙、剑、盾、书籍、王冠、宝石、金币、锤子、斧头、卷轴、奖杯、药水、魔法道具、星石等。`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: playerInput }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content received from DeepSeek API");
    }

    // Parse the JSON response from DeepSeek
    let parsedState;
    try {
      // Clean the response in case there's extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      parsedState = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse DeepSeek response:", content);
      throw new Error("Invalid JSON response from DeepSeek API");
    }

    // Validate and return the parsed state
    return gameStateSchema.parse(parsedState);

  } catch (error) {
    console.error("DeepSeek API error:", error);
    
    // Fallback: return current state with a simple response
    return {
      ...currentState,
      room: `你执行了命令："${playerInput}"，但是什么也没有发生。`,
      effect: "系统暂时无法处理你的命令，请稍后再试。",
    };
  }
}
