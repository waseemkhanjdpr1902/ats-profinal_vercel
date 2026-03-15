import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      {/* Hero */}
      <div style={{ display: "inline-block", padding: "4px 16px", borderRadius: 100, background: "rgba(124,110,230,.1)", border: "1px solid rgba(124,110,230,.3)", fontSize: 13, color: "#7c6ee6", fontWeight: 500, marginBottom: 22 }}>
        AI-Powered Resume Tools
      </div>
      <h1 style={{ fontSize: "clamp(36px,6vw,68px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, background: "linear-gradient(135deg,#eeeef5,#7c6ee6,#06d6a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        Beat the ATS.<br />Land the Interview.
      </h1>
      <p style={{ color: "#6b6b85", fontSize: 18, maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.7 }}>
        Score your resume against any job description and build an ATS-optimised CV — powered by AI.
      </p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 80 }}>
        <Link href="/checker" style={{ padding: "13px 28px", borderRadius: 12, background: "linear-gradient(135deg,#7c6ee6,#a855f7)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 20px rgba(124,110,230,.4)" }}>
          Check ATS Score →
        </Link>
        <Link href="/pricing" style={{ padding: "13px 28px", borderRadius: 12, background: "transparent", color: "#eeeef5", fontWeight: 600, fontSize: 15, textDecoration: "none", border: "1px solid #1e1e35" }}>
          View Pricing
        </Link>
      </div>

      {/* Feature cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {[
          { icon: "🎯", title: "ATS Score Checker", desc: "Paste resume + job description. Get instant score, matched/missing keywords and tips.", color: "#7c6ee6" },
          { icon: "🏗️", title: "AI CV Builder", desc: "Fill in your details. Get a clean, formatted, ATS-ready CV you can print or save as PDF.", color: "#06d6a0" },
          { icon: "💳", title: "Simple Pricing", desc: "Free: 2 checks/day. Pro: ₹299/month for unlimited access, CV builder and more.", color: "#f59e0b" },
        ].map(f => (
          <div key={f.title} style={{ padding: 24, borderRadius: 14, background: "#0f0f1a", border: "1px solid #1e1e35", textAlign: "left" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
            <div style={{ color: "#6b6b85", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
