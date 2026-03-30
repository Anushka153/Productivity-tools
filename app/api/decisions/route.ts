import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data } = await supabase
    .from('decisions')
    .select('*')
    .order('created_at', { ascending: false });

  return Response.json({ decisions: data || [] });
}

export async function POST(req: Request) {
  const { decision, reasoning, outcome } = await req.json();

  const { data } = await supabase
    .from('decisions')
    .insert({ decision, reasoning, outcome })
    .select()
    .single();

  return Response.json({ decision: data });
}

export async function PUT(req: Request) {
  const { id, decision, reasoning, outcome } = await req.json();

  await supabase
    .from('decisions')
    .update({ decision, reasoning, outcome })
    .eq('id', id);

  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await supabase.from('decisions').delete().eq('id', id);

  return Response.json({ ok: true });
}
