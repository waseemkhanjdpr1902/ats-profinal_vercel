import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  try {
    const { resume, jd, isPro } = await req.json();
    if (!resume?.trim() || !jd?.trim())
      return NextResponse.json({ error: "Both fields are required." }, { status: 400 });
    if (!process.env.ANTHROPIC_API_KEY)
      return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set in environment variables." }, { status: 500 });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const msg = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: isPro ? 2000 : 1000,
      messages: [{
        role: "user",
        content: `You are an ATS expert. Analyse this resume against the job description.

RESUME:
${resume}

JOB DESCRIPTION:
${jd}

Return ONLY valid JSON, no markdown, no backticks:
{
  "score": <0-100>,
  "keywordMatch": <0-100>,
  "formatScore": <0-100>,
  "experienceMatch": <0-100>,
  "skillsMatch": <0-100>,
  "matched": [${isPro ? "up to 12 keywords" : "up to 5 keywords"}],
  "missing": [${isPro ? "up to 12 keywords" : "up to 5 keywords"}],
  "strengths": [${isPro ? "4 specific strengths" : "2 strengths"}],
  "tips": [${isPro ? "5 actionable improvements" : "2 basic tips"}],
  "summary": "2 sentence assessment"
}`
      }]
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const json = text.match(/\{[\s\S]*\}/);
    if (!json) throw new Error("Invalid AI response");
    return NextResponse.json(JSON.parse(json[0]));
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
