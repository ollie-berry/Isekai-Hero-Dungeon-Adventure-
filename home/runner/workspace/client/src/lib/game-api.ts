import { apiRequest } from "./queryClient";
import { type CommandRequest, type GameState } from "@shared/schema";

interface GameApiResponse {
  gameState: GameState;
  sessionId: string;
  success: boolean;
}

interface SessionApiResponse {
  gameState: GameState;
  sessionId: string;
  lastCommand: string;
}

export async function generateGameContent(request: CommandRequest): Promise<GameApiResponse> {
  const response = await apiRequest("POST", "/api/generate", request);
  return response.json();
}

export async function getGameSession(sessionId: string): Promise<SessionApiResponse> {
  const response = await apiRequest("GET", `/api/session/${sessionId}`);
  return response.json();
}