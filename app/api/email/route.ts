import Anthropic from '@anthropic-ai/sdk';

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await claude.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [
      {
        role: 'user',
        content: `Write a formal, polished email based on this request:

"${prompt}"

Rules:
- Max 150 words
- No "I hope this email finds you well"
- No "passionate" or "excited"
- Sound professional and direct
- Include Subject line at the top`,
      },
    ],
  });

  const email = (response.content[0] as { text: string }).text;
  return Response.json({ email });
}
