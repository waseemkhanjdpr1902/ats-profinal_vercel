"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const inp = { width: "100%", background: "#07070f", border: "1px solid #1e1e35", borderRadius: 8, padding: "9px 12px", color: "#eeeef5", fontSize: 13, outline: "none", fontFamily: "inherit" };
const card = { background: "#0f0f1a", border: "1px solid #1e1e35", borderRadius: 14, padding: 22, marginBottom: 16 };
const g2 = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12 };
const g3 = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 };

export default function Builder() {
  const [isPro, setIsPro] = useState(false);
  const [tab, setTab] = useState<"form"|"preview">("form");
  const [loading, setLoading] = useState(false);
  const [cv, setCv] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [loc, setLoc] = useState(""); const [li, setLi] = useState(""); const [role, setRole] = useState("");
  const [sum, setSum] = useState(""); const [skills, setSkills] = useState(""); const [certs, setCerts] = useState("");
  const [exps, setExps] = useState([{ title:"", company:"", dates:"", resp:"" }]);
  const [edus, setEdus] = useState([{ degree:"", inst:"", year:"", details:"" }]);

  useEffect(() => { setIsPro(localStorage.getItem("plan") === "pro"); }, []);

  if (!isPro) return (
    <div style={{ maxWidth: 560, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
      <h1 style={{ fontWeight: 800, fontSize: 28, marginBottom: 12 }}>CV Builder is Pro Only</h1>
      <p style={{ color: "#6b6b85", lineHeight: 1.7, marginBottom: 32 }}>Upgrade to Pro for ₹299/month to unlock the AI CV Builder + unlimited ATS checks.</p>
      <Link href="/pricing" style={{ padding: "13px 32px", borderRadius: 12, background: "linear-gradient(135deg,#7c6ee6,#a855f7)", color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
        Upgrade to Pro →
      </Link>
    </div>
  );

  const addE = () => setExps([...exps, { title:"", company:"", dates:"", resp:"" }]);
  const addEd = () => setEdus([...edus, { degree:"", inst:"", year:"", details:"" }]);
  const updE = (i: number, f: string, v: string) => { const a=[...exps]; (a[i] as Record<string,string>)[f]=v; setExps(a); };
  const updEd = (i: number, f: string, v: string) => { const a=[...edus]; (a[i] as Record<string,string>)[f]=v; setEdus(a); };

  const generate = async () => {
    if (!name||!email) { setError("Name and email are required."); return; }
    setLoading(true); setError(""); setCv(null);
    try {
      const r = await fetch("/api/cv", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name, email, phone, location: loc, linkedin: li, targetRole: role, summary: sum, skills, certifications: certs, workExperience: exps.filter(e=>e.title||e.company), education: edus.filter(e=>e.degree) }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setCv(d); setTab("preview");
    } catch(e: unknown) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  };

  const print = () => {
    if (!ref.current) return;
    const w = window.open("","","width=820,height=1000");
    if (!w) return;
    w.document.write(`<html><head><title>CV</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Georgia,serif;font-size:11pt;color:#111;padding:40px 44px;line-height:1.5}h1{font-size:22pt;font-weight:bold;margin-bottom:4px}.ct{font-size:9.5pt;color:#555;margin-bottom:14px}.st{font-size:9.5pt;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1.5px solid #111;padding-bottom:3px;margin:15px 0 9px}.er{display:flex;justify-content:space-between}.et{font-size:11pt;font-weight:bold}.dt{font-size:9.5pt;color:#666;font-style:italic}ul{padding-left:16px;margin:4px 0}li{font-size:10.5pt;margin-bottom:3px}.sk{font-size:10.5pt;line-height:1.6;margin-bottom:4px}</style></head><body>${ref.current.innerHTML}</body></html>`);
    w.document.close(); w.focus(); setTimeout(()=>{w.print();w.close();},300);
  };

  type ExpItem = { title: string; company: string; dates: string; bullets: string[] };
  type EduItem = { degree: string; institution: string; year: string; details: string };
  type Skills = { technical: string[]; soft: string[] };

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "44px 20px" }}>
      <h1 style={{ fontWeight: 800, fontSize: "clamp(24px,4vw,40px)", marginBottom: 8 }}>AI CV Builder</h1>
      <p style={{ color: "#6b6b85", marginBottom: 26 }}>Fill in your details — AI writes and formats your CV.</p>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, background: "#0f0f1a", border: "1px solid #1e1e35", borderRadius: 10, padding: 4, width: "fit-content", marginBottom: 24 }}>
        {(["form","preview"] as const).map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{ padding: "8px 22px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: tab===t ? (t==="form" ? "linear-gradient(135deg,#7c6ee6,#a855f7)" : "linear-gradient(135deg,#06d6a0,#059669)") : "transparent", color: tab===t ? "#fff" : "#6b6b85" }}>
            {t==="form" ? "📝 Fill Details" : "👁️ Preview CV"}
          </button>
        ))}
      </div>

      {tab==="form" && (
        <>
          <div style={card}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>👤 Personal Information</div>
            <div style={g3}>
              {[["Full Name *",name,setName,"John Smith"],["Email *",email,setEmail,"john@email.com"],["Phone",phone,setPhone,"+91 98765 43210"],["Location",loc,setLoc,"Mumbai"],["LinkedIn",li,setLi,"linkedin.com/in/john"],["Target Role",role,setRole,"Software Engineer"]].map(([l,v,s,p])=>(
                <div key={l as string}><label style={{ display:"block", fontSize:12, color:"#6b6b85", marginBottom:5 }}>{l as string}</label>
                <input value={v as string} onChange={e=>(s as (v:string)=>void)(e.target.value)} placeholder={p as string} style={inp} /></div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>✍️ Summary (optional)</div>
            <textarea value={sum} onChange={e=>setSum(e.target.value)} placeholder="Brief overview of your experience and expertise..." style={{ ...inp, minHeight: 80 }} />
          </div>

          <div style={card}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>💼 Work Experience</div>
            {exps.map((ex,i)=>(
              <div key={i} style={{ padding:14, background:"#07070f", borderRadius:10, border:"1px solid #1e1e35", marginBottom:12 }}>
                <div style={{ ...g3, marginBottom:10 }}>
                  {([["Job Title","title","Software Engineer"],["Company","company","Acme Corp"],["Dates","dates","Jan 2022–Present"]] as [string,string,string][]).map(([l,f,p])=>(
                    <div key={f}><label style={{ display:"block", fontSize:12, color:"#6b6b85", marginBottom:5 }}>{l}</label>
                    <input value={(ex as Record<string,string>)[f]} onChange={e=>updE(i,f,e.target.value)} placeholder={p} style={inp} /></div>
                  ))}
                </div>
                <label style={{ display:"block", fontSize:12, color:"#6b6b85", marginBottom:5 }}>Responsibilities & Achievements</label>
                <textarea value={ex.resp} onChange={e=>updE(i,"resp",e.target.value)} placeholder="Led development of... Increased revenue by 30%..." style={{ ...inp, minHeight:80 }} />
              </div>
            ))}
            <button onClick={addE} style={{ padding:"7px 18px", borderRadius:8, background:"transparent", border:"1px dashed #7c6ee6", color:"#7c6ee6", fontSize:13, cursor:"pointer" }}>+ Add Job</button>
          </div>

          <div style={card}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>🎓 Education</div>
            {edus.map((ed,i)=>(
              <div key={i} style={{ ...g3, padding:14, background:"#07070f", borderRadius:10, border:"1px solid #1e1e35", marginBottom:10 }}>
                {([["Degree","degree","B.Sc Computer Science"],["Institution","inst","University of..."],["Year","year","2020"],["Details","details","First Class"]] as [string,string,string][]).map(([l,f,p])=>(
                  <div key={f}><label style={{ display:"block", fontSize:12, color:"#6b6b85", marginBottom:5 }}>{l}</label>
                  <input value={(ed as Record<string,string>)[f]} onChange={e=>updEd(i,f,e.target.value)} placeholder={p} style={inp} /></div>
                ))}
              </div>
            ))}
            <button onClick={addEd} style={{ padding:"7px 18px", borderRadius:8, background:"transparent", border:"1px dashed #7c6ee6", color:"#7c6ee6", fontSize:13, cursor:"pointer" }}>+ Add Education</button>
          </div>

          <div style={card}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>⚡ Skills & Certifications</div>
            <div style={g2}>
              <div><label style={{ display:"block", fontSize:12, color:"#6b6b85", marginBottom:5 }}>Skills (comma separated)</label><textarea value={skills} onChange={e=>setSkills(e.target.value)} placeholder="Python, React, SQL, AWS..." style={{ ...inp, minHeight:80 }} /></div>
              <div><label style={{ display:"block", fontSize:12, color:"#6b6b85", marginBottom:5 }}>Certifications (comma separated)</label><textarea value={certs} onChange={e=>setCerts(e.target.value)} placeholder="AWS Architect, PMP..." style={{ ...inp, minHeight:80 }} /></div>
            </div>
          </div>

          {error && <div style={{ padding:"11px 16px", borderRadius:10, background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", color:"#ef4444", fontSize:14, marginBottom:14 }}>⚠️ {error}</div>}

          <button onClick={generate} disabled={loading} style={{ width:"100%", padding:14, borderRadius:12, background: loading ? "#1e1e35" : "linear-gradient(135deg,#06d6a0,#059669)", color:"#fff", fontWeight:700, fontSize:15, border:"none", cursor: loading?"not-allowed":"pointer" }}>
            {loading ? <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}><span className="spinner"/>Generating your CV...</span> : "✨ Generate My CV"}
          </button>
        </>
      )}

      {tab==="preview" && (
        <>
          {cv ? (
            <>
              <button onClick={print} style={{ marginBottom:16, padding:"9px 22px", borderRadius:10, background:"linear-gradient(135deg,#7c6ee6,#a855f7)", color:"#fff", border:"none", cursor:"pointer", fontSize:14, fontWeight:600 }}>🖨️ Print / Save as PDF</button>
              <div ref={ref} style={{ background:"#fff", color:"#111", padding:"44px 48px", borderRadius:12, fontFamily:"Georgia,serif", lineHeight:1.5, boxShadow:"0 20px 60px rgba(0,0,0,.5)" }}>
                <h1 style={{ fontSize:24, fontWeight:"bold", marginBottom:4, fontFamily:"Georgia,serif" }}>{cv.name as string}</h1>
                <div className="ct" style={{ fontSize:10.5, color:"#555", marginBottom:14 }}>{[cv.email,cv.phone,cv.location,cv.linkedin].filter(Boolean).join("  •  ")}</div>
                {cv.summary && <div style={{ marginBottom:14 }}><div style={{ fontSize:9.5, fontWeight:"bold", textTransform:"uppercase", letterSpacing:1.5, borderBottom:"1.5px solid #111", paddingBottom:3, marginBottom:8 }}>Professional Summary</div><p style={{ fontSize:11, lineHeight:1.6 }}>{cv.summary as string}</p></div>}
                {(cv.experience as ExpItem[])?.length > 0 && <div style={{ marginBottom:14 }}><div style={{ fontSize:9.5, fontWeight:"bold", textTransform:"uppercase", letterSpacing:1.5, borderBottom:"1.5px solid #111", paddingBottom:3, marginBottom:10 }}>Work Experience</div>{(cv.experience as ExpItem[]).map((e,i)=><div key={i} style={{ marginBottom:12 }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}><strong style={{ fontSize:11.5 }}>{e.title}{e.company?` — ${e.company}`:""}</strong><span style={{ fontSize:10, color:"#666", fontStyle:"italic" }}>{e.dates}</span></div><ul style={{ paddingLeft:16, margin:"4px 0" }}>{e.bullets.map((b,j)=><li key={j} style={{ fontSize:11, marginBottom:3 }}>{b}</li>)}</ul></div>)}</div>}
                {(cv.education as EduItem[])?.length > 0 && <div style={{ marginBottom:14 }}><div style={{ fontSize:9.5, fontWeight:"bold", textTransform:"uppercase", letterSpacing:1.5, borderBottom:"1.5px solid #111", paddingBottom:3, marginBottom:10 }}>Education</div>{(cv.education as EduItem[]).map((e,i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><div><strong style={{ fontSize:11.5 }}>{e.degree}</strong><div style={{ fontSize:11, color:"#444" }}>{e.institution}{e.details?` — ${e.details}`:""}</div></div><span style={{ fontSize:10, color:"#666", fontStyle:"italic" }}>{e.year}</span></div>)}</div>}
                {((cv.skills as Skills)?.technical?.length > 0 || (cv.skills as Skills)?.soft?.length > 0) && <div style={{ marginBottom:14 }}><div style={{ fontSize:9.5, fontWeight:"bold", textTransform:"uppercase", letterSpacing:1.5, borderBottom:"1.5px solid #111", paddingBottom:3, marginBottom:10 }}>Skills</div>{(cv.skills as Skills).technical?.length>0&&<div style={{ fontSize:11, marginBottom:4 }}><strong>Technical: </strong>{(cv.skills as Skills).technical.join(" • ")}</div>}{(cv.skills as Skills).soft?.length>0&&<div style={{ fontSize:11 }}><strong>Professional: </strong>{(cv.skills as Skills).soft.join(" • ")}</div>}</div>}
                {(cv.certifications as string[])?.length > 0 && (cv.certifications as string[])[0] && <div><div style={{ fontSize:9.5, fontWeight:"bold", textTransform:"uppercase", letterSpacing:1.5, borderBottom:"1.5px solid #111", paddingBottom:3, marginBottom:10 }}>Certifications</div><ul style={{ paddingLeft:16 }}>{(cv.certifications as string[]).map((c,i)=><li key={i} style={{ fontSize:11, marginBottom:3 }}>{c}</li>)}</ul></div>}
              </div>
            </>
          ) : (
            <div style={{ padding:"60px 24px", textAlign:"center", background:"#0f0f1a", borderRadius:14, border:"1px dashed #1e1e35" }}>
              <div style={{ fontSize:44, marginBottom:14 }}>📄</div>
              <p style={{ color:"#6b6b85", marginBottom:20 }}>Fill the form and click Generate first.</p>
              <button onClick={()=>setTab("form")} style={{ padding:"10px 24px", borderRadius:10, background:"linear-gradient(135deg,#06d6a0,#059669)", color:"#fff", border:"none", cursor:"pointer", fontWeight:600 }}>Go to Form →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
