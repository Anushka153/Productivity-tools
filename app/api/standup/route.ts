import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET() {
  const { data } = await supabase
    .from('standups')
    .select('*')
    .order('created_at', { ascending: false });

  return Response.json({ standups: data || [] });
}

export async function POST(req: Request) {
  const { yesterday, today, blockers } = await req.json();

  const response = await claude.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Format this standup clearly:

Yesterday: ${yesterday}
Today: ${today}
Blockers: ${blockers}

Format as:
✅ Yesterday
[content]

🎯 Today
[content]

🚧 Blockers
[content or "None"]`,
      },
    ],
  });

  const formatted = (response.content[0] as { text: string }).text;

  await supabase.from('standups').insert({
    yesterday,
    today,
    blockers,
    formatted,
  });

  return Response.json({ formatted });
}
