import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { formattingInstructions } from './config/formattingRules';

dotenv.config();

const router = express.Router();

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

const CLIENT_ID = getEnvVar('CLIENT_ID');
const CLIENT_SECRET = getEnvVar('CLIENT_SECRET');
const REALM = getEnvVar('REALM');
const AGENT_ID = getEnvVar('AGENT_ID');

async function getAccessToken(): Promise<string> {
  const res = await fetch(
    `https://idm.stackspot.com/${REALM}/oidc/oauth/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    }
  );

  if (!res.ok) throw new Error('Erro ao obter token: ' + (await res.text()));
  const data = await res.json();
  return data.access_token;
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const token = await getAccessToken();

    let userMessage = '';

    if (req.body.trip) {
      const trip = req.body.trip;

      const initialPrompt = `
        Olá, meu nome é ${trip.user}. 
        Meu destino é ${trip.destination}, 
        viajarei por ${trip.days} dias, 
        e minhas preferências são: ${trip.preferences}. 
        Por favor, forneça sugestões e dicas úteis.
      `;

      userMessage = `${initialPrompt}\n\n${formattingInstructions}`;
    } else if (req.body.message) {
      userMessage = req.body.message;
    } else {
      return res
        .status(400)
        .json({ error: 'Body inválido: informe trip ou message' });
    }

    const agentRes = await fetch(
      `https://genai-inference-app.stackspot.com/v1/agent/${AGENT_ID}/chat`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'viajAI',
        },
        body: JSON.stringify({
          streaming: true,
          user_prompt: userMessage,
          stackspot_knowledge: false,
          return_ks_in_response: true,
        }),
      }
    );

    const reader = agentRes.body?.getReader();
    let fullMessage = '';

    if (reader) {
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));
          for (const line of lines) {
            try {
              const json = JSON.parse(line.replace(/^data: /, ''));
              if (json.message) fullMessage += json.message;
            } catch {}
          }
        }
      }
    }

    res.json({ message: fullMessage });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao se comunicar com o agente' });
    return;
  }
});

export default router;
