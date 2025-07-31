import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gameSessions = pgTable("game_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  gameState: jsonb("game_state").notNull(),
  lastCommand: text("last_command"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gameEnemySchema = z.object({
  name: z.string(),
  hp: z.number(),
  maxHp: z.number().optional(),
});

export const gameLootSchema = z.object({
  name: z.string(),
  desc: z.string(),
});

export const gameStateSchema = z.object({
  room: z.string(),
  objects: z.array(z.string()),
  exits: z.array(z.string()),
  enemy: gameEnemySchema.nullable(),
  loot: gameLootSchema.nullable(),
  effect: z.string().nullable(),
  playerHp: z.number().default(10),
  playerMaxHp: z.number().default(10),
  inventory: z.array(z.string()).default([]),
});

export const commandRequestSchema = z.object({
  command: z.string().min(1, "命令不能为空"),
  sessionId: z.string().nullable().optional(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type GameState = z.infer<typeof gameStateSchema>;
export type GameEnemy = z.infer<typeof gameEnemySchema>;
export type GameLoot = z.infer<typeof gameLootSchema>;
export type CommandRequest = z.infer<typeof commandRequestSchema>;
