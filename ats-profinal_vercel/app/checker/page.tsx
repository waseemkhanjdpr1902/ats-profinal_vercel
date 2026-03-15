"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const col = (v: number) => v >= 75 ? "#06d6a0" : v >= 50 ? "#f59e0b" : "#ef4444";
const S = {
  page: { maxWidth: 1040, margin: "0 auto", padding: "44px 20px" },
  card: { background: "#0f0f1a", border: "1px solid #1e1e35", borderRadius: 14, padding: 22, marginBottom: 16 },
  ta: { width: "100%", minHeight: 200, background: "#07070f", border: "1px solid #1e1e35", borderRadius: 10, padding: "12px 14px", color: "#eeeef5", fontSize: 13, lineHeight: 1.7, outline: "none", fontFamily: "inherit", resize: "vertical" as const },
  btn: { width: "100%", padding: 14, borderRadius: 12, background: "linear-gradient(135deg,#7c6ee6,#a855f7)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", marginBottom: 36 },
  btnOff: { width: "100%", padding: 14, borderRadius: 12, background: "#1e1e35", color: "#6b6b85", fontWeight: 700, fontSize: 15, border: "none", cursor: "not-allowed", marginBottom: 36 },
  err: { padding: "11px 16px", borderRadius: 10, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#ef4444", fontSize: 14, marginBottom: 14 },
  tag: (c: string) => ({ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 500 as const, background: `${c}18`, border: `1px solid ${c}44`, color: c }),
};

export default function Checker() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [used, setUsed] = useState(0);
  const FREE = 2;

  useEffect(() => {
    setIsPro(localStorage.getItem("plan") === "pro");
    const d = localStorage.getItem("checks");
    if (d) { const p = JSON.parse(d); if (p.date === new Date().toDateString()) setUsed(p.n); }
  }, []);

  const canGo = isPro || used < FREE;

  const run = async () => {
    if (!resume.trim() || !jd.trim()) { setError("Fill in both fields."); return; }
    if (!canGo) { setError("Free limit reached. Upgrade to Pro."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const r = await fetch("/api/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resume, jd, isPro }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setResult(d);
      if (!isPro) { const n = used + 1; setUsed(n); localStorage.setItem("checks", JSON.stringify({ date: new Date().toDateString(), n })); }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <h1 style={{ fontWeight: 800, fontSize: "clamp(24px,4vw,40px)", marginBottom: 8 }}>ATS Score Checker</h1>
      <p style={{ color: "#6b6b85", marginBottom: 20 }}>Paste your resume and job description to get an instant score.</p>

      {!isPro && (
        <div style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.2)", fontSize: 13, color: "#f59e0b", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          <span>Free: {used}/{FREE} checks used today</span>
          <Link href="/pricing" style={{ color: "#7c6ee6", fontWeight: 600, textDecoration: "none" }}>Upgrade to Pro →</Link>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={S.card}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>📄 Your Resume</div>
          <textarea style={S.ta} value={resume} onChange={e => setResume(e.target.value)} placeholder="Paste your full resume text here..." />
        </div>
        <div style={S.card}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>💼 Job Description</div>
          <textarea style={S.ta} value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the job description here..." />
        </div>
      </div>

      {error && <div style={S.err}>⚠️ {error} {error.includes("Upgrade") && <Link href="/pricing" style={{ color: "#7c6ee6", fontWeight: 600 }}> Click here →</Link>}</div>}

      <button onClick={run} disabled={loading || !canGo} style={canGo ? S.btn : S.btnOff}>
        {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}><span className="spinner" /> Analysing...</span> : !canGo ? "Free Limit Reached — Upgrade to Pro" : "⚡ Analyse ATS Score"}
      </button>

      {result && (
        <div className="fade-up">
          {/* Score overview */}
          <div style={{ ...S.card, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="46" fill="none" stroke="#1e1e35" strokeWidth="9" />
              <circle cx="60" cy="60" r="46" fill="none" stroke={col(result.score as number)} strokeWidth="9"
                strokeDasharray={`${2*Math.PI*46}`}
                strokeDashoffset={`${2*Math.PI*46*(1-(result.score as number)/100)}`}
                strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 1s ease" }} />
              <text x="60" y="55" textAnchor="middle" fill="#eeeef5" fontSize="20" fontWeight="700">{result.score as number}</text>
              <text x="60" y="70" textAnchor="middle" fill="#6b6b85" fontSize="9">ATS SCORE</text>
            </svg>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
                {(result.score as number) >= 75 ? "🟢 Strong Match" : (result.score as number) >= 50 ? "🟡 Needs Work" : "🔴 Low Match"}
              </div>
              <div style={{ color: "#6b6b85", fontSize: 14, marginBottom: 18 }}>{result.summary as string}</div>
              {[["Keyword Match", result.keywordMatch],["Format Score", result.formatScore],["Experience", result.experienceMatch],["Skills", result.skillsMatch]].map(([l, v]) => (
                <div key={l as string} style={{ marginBottom: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "#6b6b85" }}>{l as string}</span>
                    <span style={{ color: col(v as number), fontWeight: 600 }}>{v as number}%</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: "#1e1e35" }}>
                    <div style={{ height: "100%", width: `${v}%`, background: col(v as number), borderRadius: 3, transition: "width .8s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14, marginBottom: 14 }}>
            <div style={S.card}>
              <div style={{ fontWeight: 700, color: "#06d6a0", marginBottom: 12 }}>✓ Matched Keywords</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{(result.matched as string[]).map(k => <span key={k} style={S.tag("#06d6a0")}>{k}</span>)}</div>
            </div>
            <div style={S.card}>
              <div style={{ fontWeight: 700, color: "#ef4444", marginBottom: 12 }}>✗ Missing Keywords</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{(result.missing as string[]).map(k => <span key={k} style={S.tag("#ef4444")}>{k}</span>)}</div>
            </div>
          </div>

          {/* Tips */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
            <div style={S.card}>
              <div style={{ fontWeight: 700, color: "#06d6a0", marginBottom: 12 }}>💪 Strengths</div>
              {(result.strengths as string[]).map((s, i) => <div key={i} style={{ display: "flex", gap: 9, fontSize: 13, color: "#6b6b85", marginBottom: 8 }}><span style={{ color: "#06d6a0" }}>→</span>{s}</div>)}
            </div>
            <div style={S.card}>
              <div style={{ fontWeight: 700, color: "#7c6ee6", marginBottom: 12 }}>🔧 Improvements</div>
              {(result.tips as string[]).map((s, i) => <div key={i} style={{ display: "flex", gap: 9, fontSize: 13, color: "#6b6b85", marginBottom: 8 }}><span style={{ color: "#7c6ee6" }}>→</span>{s}</div>)}
            </div>
          </div>

          {!isPro && (
            <div style={{ marginTop: 16, padding: "18px 22px", borderRadius: 14, background: "rgba(124,110,230,.08)", border: "1px solid rgba(124,110,230,.25)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>🚀 Unlock Full Analysis</div>
                <div style={{ color: "#6b6b85", fontSize: 13 }}>12 keywords, 5 detailed tips, CV builder — just ₹299/month</div>
              </div>
              <Link href="/pricing" style={{ padding: "10px 22px", borderRadius: 10, background: "linear-gradient(135deg,#7c6ee6,#a855f7)", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Upgrade →</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
