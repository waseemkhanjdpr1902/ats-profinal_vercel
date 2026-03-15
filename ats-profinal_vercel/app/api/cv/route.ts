import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!process.env.ANTHROPIC_API_KEY)
      return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set." }, { status: 500 });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const msg = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2500,
      messages: [{
        role: "user",
        content: `Create a professional ATS-optimised CV. Use strong action verbs. Quantify achievements where possible.

DATA: ${JSON.stringify(data, null, 2)}

Return ONLY valid JSON, no markdown:
{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "summary": "2-3 sentence professional summary",
  "experience": [{ "title": "", "company": "", "dates": "", "bullets": ["• verb + achievement"] }],
  "education": [{ "degree": "", "institution": "", "year": "", "details": "" }],
  "skills": { "technical": ["skill"], "soft": ["skill"] },
  "certifications": ["cert"]
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
