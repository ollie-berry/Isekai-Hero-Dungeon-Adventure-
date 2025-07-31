import { type User, type InsertUser, type GameSession, type InsertGameSession, type GameState } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getGameSession(id: string): Promise<GameSession | undefined>;
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  updateGameSession(id: string, gameState: GameState, lastCommand: string): Promise<GameSession | undefined>;
  deleteGameSession(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private gameSessions: Map<string, GameSession>;

  constructor() {
    this.users = new Map();
    this.gameSessions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGameSession(id: string): Promise<GameSession | undefined> {
    return this.gameSessions.get(id);
  }

  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = randomUUID();
    const now = new Date();
    const session: GameSession = {
      id,
      userId: insertSession.userId || null,
      gameState: insertSession.gameState,
      lastCommand: insertSession.lastCommand || null,
      createdAt: now,
      updatedAt: now,
    };
    this.gameSessions.set(id, session);
    return session;
  }

  async updateGameSession(id: string, gameState: GameState, lastCommand: string): Promise<GameSession | undefined> {
    const session = this.gameSessions.get(id);
    if (!session) return undefined;

    const updatedSession: GameSession = {
      ...session,
      gameState,
      lastCommand,
      updatedAt: new Date(),
    };
    this.gameSessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteGameSession(id: string): Promise<boolean> {
    return this.gameSessions.delete(id);
  }
}

export const storage = new MemStorage();
