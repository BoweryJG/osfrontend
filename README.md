# MCP AI Frontend

A visually stunning, advanced dashboard for interacting with your MCP AI backend and Supabase logs.

## Features
- Modern, dark-themed UI (Material UI)
- Prompt input with model selection (GPT-4, Claude, Gemini, etc.)
- Real-time LLM responses in a chat-style interface
- Request/response history from Supabase
- Responsive and beautiful design

## Setup
1. `cd mcp-ai-frontend`
2. `npm install`
3. Edit `src/App.jsx` and fill in your Supabase URL and key at the top:
   ```js
   const SUPABASE_URL = 'your_supabase_url';
   const SUPABASE_KEY = 'your_supabase_key';
   ```
4. Make sure your backend is running at `http://localhost:3000` (or update `BACKEND_URL` if different).
5. Start the frontend:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

You can now:
- Enter prompts and get responses from your LLM backend
- View a history of requests and responses (from Supabase)
- Switch models and enjoy a beautiful, modern interface

---

For further customization or deployment, see the Vite and Material UI docs.
