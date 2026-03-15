"use client";
import { useEffect, useState } from "react";

declare global { interface Window { Razorpay: new (o: RzpOpts) => { open(): void }; } }
interface RzpOpts { key: string; amount: number; currency: string; name: string; description: string; order_id: string; handler(r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): void; theme?: { color?: string }; modal?: { ondismiss?(): void }; }

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setIsPro(localStorage.getItem("plan") === "pro");
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);

  const upgrade = async () => {
    setLoading(true); setMsg("");
    try {
      const amount = yearly ? 249900 : 29900;
      const r = await fetch("/api/order", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ amount }) });
      const order = await r.json();
      if (!r.ok) throw new Error(order.error);

      new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount, currency: "INR",
        name: "ATSPro", description: `Pro – ${yearly?"₹2,499/year":"₹299/month"}`,
        order_id: order.id,
        theme: { color: "#7c6ee6" },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (res) => {
          const v = await fetch("/api/verify", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(res) });
          const vd = await v.json();
          if (vd.ok) {
            localStorage.setItem("plan", "pro");
            setIsPro(true);
            setMsg("🎉 Payment successful! You now have Pro access.");
          } else { setMsg("⚠️ Payment verification failed."); }
          setLoading(false);
        },
      }).open();
    } catch(e: unknown) { setMsg("⚠️ " + (e instanceof Error ? e.message : "Error")); setLoading(false); }
  };

  const card = (hi: boolean) => ({ padding: 32, borderRadius: 16, background: "#0f0f1a", border: hi ? "1.5px solid #7c6ee6" : "1px solid #1e1e35", position: "relative" as const, boxShadow: hi ? "0 0 40px rgba(124,110,230,.1)" : "none" });

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(28px,4vw,46px)", marginBottom: 10 }}>Simple Pricing</h1>
        <p style={{ color: "#6b6b85", fontSize: 16 }}>Start free. Upgrade anytime.</p>
      </div>

      {/* Toggle */}
      <div style={{ display: "flex", gap: 4, background: "#0f0f1a", border: "1px solid #1e1e35", borderRadius: 10, padding: 4, width: "fit-content", margin: "0 auto 40px" }}>
        {["Monthly","Yearly"].map((l,i) => (
          <button key={l} onClick={()=>setYearly(i===1)} style={{ padding:"8px 22px", borderRadius:8, border:"none", cursor:"pointer", fontWeight:600, fontSize:13, background: yearly===(i===1) ? "linear-gradient(135deg,#7c6ee6,#a855f7)" : "transparent", color: yearly===(i===1) ? "#fff" : "#6b6b85" }}>
            {l}{i===1&&<span style={{ marginLeft:6, padding:"2px 8px", borderRadius:100, background:"rgba(6,214,160,.2)", color:"#06d6a0", fontSize:11, fontWeight:700 }}>-30%</span>}
          </button>
        ))}
      </div>

      {msg && (
        <div style={{ padding:"12px 18px", borderRadius:10, background: msg.startsWith("🎉")?"rgba(6,214,160,.1)":"rgba(239,68,68,.1)", border:`1px solid ${msg.startsWith("🎉")?"rgba(6,214,160,.3)":"rgba(239,68,68,.3)"}`, color: msg.startsWith("🎉")?"#06d6a0":"#ef4444", fontSize:14, marginBottom:24, textAlign:"center" }}>
          {msg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 18 }}>
        {/* Free */}
        <div style={card(false)}>
          <div style={{ fontWeight:800, fontSize:22, marginBottom:6 }}>Free</div>
          <div style={{ fontWeight:800, fontSize:40, marginBottom:16 }}>₹0 <span style={{ fontSize:15, fontWeight:400, color:"#6b6b85" }}>/forever</span></div>
          {["2 ATS checks per day","Basic keyword analysis","Score breakdown"].map(f=><div key={f} style={{ display:"flex",gap:9,fontSize:14,color:"#eeeef5",marginBottom:10 }}><span style={{ color:"#06d6a0" }}>✓</span>{f}</div>)}
          {["CV Builder","Unlimited checks","Detailed tips"].map(f=><div key={f} style={{ display:"flex",gap:9,fontSize:14,color:"#6b6b85",marginBottom:10 }}><span>✗</span>{f}</div>)}
          <button disabled style={{ marginTop:16, width:"100%", padding:13, borderRadius:12, background:"#1e1e35", color:"#6b6b85", border:"none", fontWeight:700, fontSize:14 }}>Current Plan</button>
        </div>

        {/* Pro */}
        <div style={card(true)}>
          {!isPro && <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", padding:"4px 16px", borderRadius:100, background:"linear-gradient(135deg,#7c6ee6,#a855f7)", color:"#fff", fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>🔥 Most Popular</div>}
          <div style={{ fontWeight:800, fontSize:22, marginBottom:6 }}>Pro</div>
          <div style={{ fontWeight:800, fontSize:40, marginBottom: yearly?2:16 }}>{yearly?"₹2,499":"₹299"} <span style={{ fontSize:15, fontWeight:400, color:"#6b6b85" }}>/{yearly?"year":"month"}</span></div>
          {yearly && <div style={{ fontSize:13, color:"#06d6a0", marginBottom:14 }}>Just ₹208/month — save ₹1,089/year</div>}
          {["Unlimited ATS checks","AI CV Builder","12 keyword suggestions","5 detailed improvement tips","Priority support"].map(f=><div key={f} style={{ display:"flex",gap:9,fontSize:14,color:"#eeeef5",marginBottom:10 }}><span style={{ color:"#06d6a0" }}>✓</span>{f}</div>)}
          {isPro ? (
            <button style={{ marginTop:16, width:"100%", padding:13, borderRadius:12, background:"linear-gradient(135deg,#06d6a0,#059669)", color:"#fff", border:"none", fontWeight:700, fontSize:14 }}>✓ You have Pro!</button>
          ) : (
            <button onClick={upgrade} disabled={loading} style={{ marginTop:16, width:"100%", padding:13, borderRadius:12, background: loading?"#1e1e35":"linear-gradient(135deg,#7c6ee6,#a855f7)", color: loading?"#6b6b85":"#fff", border:"none", cursor: loading?"not-allowed":"pointer", fontWeight:700, fontSize:14, boxShadow:"0 4px 20px rgba(124,110,230,.3)" }}>
              {loading ? "Opening payment..." : `Upgrade to Pro — ${yearly?"₹2,499/year":"₹299/month"}`}
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop:40, textAlign:"center", display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
        {["🔒 Razorpay Secured","💳 UPI & Cards Accepted","🔄 Cancel Anytime"].map(t=>(
          <span key={t} style={{ fontSize:13, color:"#6b6b85", padding:"6px 16px", borderRadius:100, border:"1px solid #1e1e35" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
