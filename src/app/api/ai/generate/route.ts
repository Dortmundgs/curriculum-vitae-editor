import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  prompt: string;
  context?: Record<string, string>;
  apiKey?: string;
}

const SYSTEM_PROMPT = `You are a professional CV writing assistant specializing in ATS-optimized, impactful resumes.

Guidelines:
- Write in a professional, concise tone using active voice and strong action verbs
- Focus on achievements, outcomes, and quantifiable impact — not just duties
- For bullet-point descriptions: return plain text, one item per line, no markdown, no leading dashes or bullets
- For professional summaries: return a single paragraph of 2–4 compelling sentences
- For skill lists: return skill names only, one per line
- Be specific and relevant to the provided job title or industry
- Never add generic filler phrases like "results-driven" or "team player" unless contextually justified`;

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { prompt, context = {}, apiKey } = body;

    const key = process.env.OPENAI_API_KEY || apiKey;

    if (!key) {
      return NextResponse.json(
        { error: 'No API key configured. Add your OpenAI key in the AI Settings panel.' },
        { status: 401 }
      );
    }

    const contextLines = Object.entries(context)
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    const fullPrompt = contextLines ? `${prompt}\n\nContext:\n${contextLines}` : prompt;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: fullPrompt },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({})) as { error?: { message?: string } };
      const errMsg = errData.error?.message || `OpenAI returned HTTP ${response.status}`;
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>;
    };
    const result = data.choices[0]?.message?.content?.trim() ?? '';

    return NextResponse.json({ result });
  } catch (e) {
    console.error('[AI generate]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
