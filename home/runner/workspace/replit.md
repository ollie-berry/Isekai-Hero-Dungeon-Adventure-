# 转生成为异世界勇者与地下城冒险 - Replit Project Guide

## Overview

This is a text-based isekai dungeon adventure game built with a modern full-stack architecture. The application features a terminal-style interface with red/black/purple color scheme where players can explore dungeons, fight enemies, and collect loot through text commands. The game uses AI (DeepSeek API) to generate dynamic content and responses based on player actions.

## Recent Changes (January 31, 2025)

✓ **Game Rebranding**: Changed game title from "文字地牢" to "转生成为异世界勇者与地下城冒险" (Isekai Hero Dungeon Adventure)
✓ **Visual Theme Update**: Redesigned color scheme from green/amber to red/black/purple terminal aesthetics
✓ **Enhanced Object Icons**: Added rich icon system with 15+ interactive object types (chests, keys, swords, shields, books, crowns, gems, etc.)
✓ **Improved AI Prompt**: Optimized DeepSeek prompt for better game content generation with detailed JSON structure requirements
✓ **UI Polish**: Updated all component colors to match new red/black/purple theme

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom terminal theme (dark colors, green accents)
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **State Management**: React Query (TanStack Query) for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Storage**: In-memory storage (MemStorage class) with interface for future database integration
- **API**: RESTful endpoints for game state management and AI content generation

### Key Components

#### Game Engine
- **Game State**: Tracks room descriptions, objects, exits, enemies, loot, player HP, and inventory
- **Command Processing**: Handles player text commands and generates appropriate responses
- **AI Integration**: Uses DeepSeek API to generate dynamic game content based on commands and current state

#### Data Models
- **Users**: Basic user system with username/password authentication (schema defined)
- **Game Sessions**: Persistent game sessions that store game state and command history
- **Game State Schema**: Structured data for room, objects, exits, enemy, loot, effects, and player stats

#### UI Components
- **Terminal Interface**: Dark theme with green text mimicking a classic terminal
- **Game State Display**: Shows current room description, objects, exits, enemy status, and player stats
- **Command Input**: Text input with quick command buttons and command history
- **Game Sidebar**: Displays API responses, game logs, and system status

### Data Flow

1. **Player Input**: User enters text command through the terminal interface
2. **Command Processing**: Frontend sends command and session ID to `/api/generate` endpoint
3. **AI Generation**: Server calls DeepSeek API with current game state and player command
4. **State Update**: New game state is generated and stored in session
5. **Response**: Updated game state is returned to frontend and displayed

### External Dependencies

#### Core Technologies
- **@neondatabase/serverless**: PostgreSQL database connection (Neon serverless)
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tool
- **@tanstack/react-query**: Server state management and caching
- **express**: Web server framework

#### UI Libraries
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe variant styling

#### Development Tools
- **vite**: Fast build tool and dev server
- **typescript**: Type safety
- **@replit/vite-plugin-***: Replit-specific development plugins

### Deployment Strategy

#### Vercel Configuration
- **Runtime**: Node.js 18.x serverless functions
- **API Routes**: Server endpoints proxied through `/api/*` routes
- **Static Assets**: Frontend built and served from `/dist/public`
- **Rewrites**: SPA routing handled with catch-all to `index.html`

#### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

#### Environment Requirements
- **DATABASE_URL**: PostgreSQL connection string (required for Drizzle)
- **DeepSeek API**: Configuration needed for AI content generation
- **NODE_ENV**: Environment detection for development/production modes

#### File Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route components
│   │   ├── lib/         # Utilities and API client
│   │   └── hooks/       # Custom React hooks
├── server/          # Express backend
│   ├── index.ts     # Main server file
│   ├── routes.ts    # API route definitions
│   ├── storage.ts   # Data access layer
│   └── vite.ts      # Development server setup
├── shared/          # Shared types and schemas
│   └── schema.ts    # Database and validation schemas
└── migrations/      # Database migration files
```

The application is designed to be easily deployable on Vercel while supporting local development with hot reload and type safety throughout the stack.