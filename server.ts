import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      time: new Date().toISOString(),
    });
  });

  // Forge Assistant Career Guidance Endpoint
  app.post('/api/forge-assistant', async (req, res) => {
    try {
      const { message, history, studentContext } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const client = getAIClient();

      if (!client || !process.env.GEMINI_API_KEY) {
        // Safe fallback indicator: Frontend will execute rich context-aware rules engine
        res.json({
          fallback: true,
          reason: 'API key not configured or client unavailable',
        });
        return;
      }

      const targetRole = studentContext?.profile?.targetRole || 'Mechanical Design Engineer';
      const readinessScore = studentContext?.stats?.readinessScore ?? 72;
      const readinessStatus = studentContext?.stats?.scoreInterpretation?.status || 'On Track';
      const skillsSummary = (studentContext?.skills || [])
        .map((s: any) => `${s.name} (${s.level})`)
        .join(', ');
      const projectsSummary = (studentContext?.projects || [])
        .map((p: any) => `${p.title} [Status: ${p.status}, Skills: ${(p.skills || []).join(', ')}]`)
        .join('; ');
      const goalsSummary = (studentContext?.goals || [])
        .map((g: any) => `${g.title} [Progress: ${g.progressPercentage}%, Completed: ${g.completed}, Linked: ${g.linkedSkill || 'None'}]`)
        .join('; ');

      const systemInstruction = `You are Forge Assistant, the personal career development guide embedded inside SkillForge for engineering students.
Your mission is to help students decide: "What should I learn, build, or improve next to become more career ready?"
You analyze the student's actual SkillForge data:
- Target Career Role: ${targetRole}
- Career Readiness Score: ${readinessScore}% (${readinessStatus})
- Skills & Proficiency: ${skillsSummary || 'None registered yet'}
- Projects: ${projectsSummary || 'None registered yet'}
- Learning Goals: ${goalsSummary || 'None registered yet'}

RESPONSE RULES:
- Professional, concise, practical, career-focused, direct, easy for students to understand.
- Ground your answer in their actual data. If they ask what to learn next, prioritize their major skill gaps for ${targetRole}.
- Avoid long essays. Keep responses focused on 1-3 crisp paragraphs or bullet points.
- If you recommend a learning goal, specify a clear goal title.
- If you recommend a project, specify a clear project title and focus.
- Never use robotic cliches, emojis overload, or generic motivational fluff.
- End your response with 1-2 actionable suggestions formatted on their own lines as:
ACTION_GOAL: <Specific Goal Title> | <Skill Name> | <Priority: High/Medium/Low>
ACTION_PROJECT: <Specific Project Title> | <Category: Academic/Personal/Capstone> | <Comma-separated skills>`;

      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // Add recent history if present (up to 4 turns)
      if (Array.isArray(history) && history.length > 0) {
        const recent = history.slice(-4);
        for (const h of recent) {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const rawText = response.text || '';

      // Parse structured action tags if present
      const actionGoalMatch = rawText.match(/ACTION_GOAL:\s*([^|\n]+)\s*\|\s*([^|\n]+)\s*\|\s*([^\n]+)/i);
      const actionProjectMatch = rawText.match(/ACTION_PROJECT:\s*([^|\n]+)\s*\|\s*([^|\n]+)\s*\|\s*([^\n]+)/i);

      // Clean the text from raw action directives for presentation
      const cleanedContent = rawText
        .replace(/ACTION_GOAL:[^\n]+/gi, '')
        .replace(/ACTION_PROJECT:[^\n]+/gi, '')
        .trim();

      const actions: any[] = [];

      if (actionGoalMatch) {
        actions.push({
          id: `goal-${Date.now()}`,
          type: 'create_goal',
          label: `Create Goal: ${actionGoalMatch[1].trim()}`,
          payload: {
            title: actionGoalMatch[1].trim(),
            skill: actionGoalMatch[2].trim(),
            priority: (actionGoalMatch[3].trim() as any) || 'High',
          },
        });
      }

      if (actionProjectMatch) {
        const projSkills = actionProjectMatch[3].split(',').map((s) => s.trim());
        actions.push({
          id: `project-${Date.now()}`,
          type: 'add_project',
          label: `Add Project: ${actionProjectMatch[1].trim()}`,
          payload: {
            title: actionProjectMatch[1].trim(),
            category: actionProjectMatch[2].trim() || 'Academic',
            skills: projSkills,
          },
        });
      }

      res.json({
        fallback: false,
        content: cleanedContent,
        actions,
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, signaling frontend fallback:', err?.message);
      res.json({
        fallback: true,
        reason: 'Error calling model service, fallback engaged gracefully',
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillForge server listening on port ${PORT}`);
  });
}

startServer();
