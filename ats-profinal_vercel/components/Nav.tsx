"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Nav() {
  const path = usePathname();
  const [pro, setPro] = useState(false);
  useEffect(() => { setPro(localStorage.getItem("plan") === "pro"); }, []);

  const link = (href: string, label: string) => (
    <Link key={href} href={href} style={{
      padding: "6px 14px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500,
      color: path === href ? "#fff" : "#6b6b85",
      background: path === href ? "rgba(124,110,230,.2)" : "transparent",
      border: path === href ? "1px solid rgba(124,110,230,.4)" : "1px solid transparent",
    }}>{label}</Link>
  );

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 99, background: "rgba(7,7,15,.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid #1e1e35" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#7c6ee6,#06d6a0)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>A</span>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#eeeef5" }}>ATSPro</span>
        </Link>
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {link("/", "Home")}
          {link("/checker", "ATS Checker")}
          {link("/builder", "CV Builder")}
          {link("/pricing", "Pricing")}
          {pro && <span style={{ marginLeft: 6, padding: "3px 10px", borderRadius: 100, background: "rgba(6,214,160,.15)", border: "1px solid rgba(6,214,160,.3)", fontSize: 11, color: "#06d6a0", fontWeight: 700 }}>PRO</span>}
        </div>
      </div>
    </nav>
  );
}
