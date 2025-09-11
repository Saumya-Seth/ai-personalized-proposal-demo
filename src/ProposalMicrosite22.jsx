// EntravisionProposal.jsx
import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Area
} from "recharts";
import { Printer, Download, Calendar } from "lucide-react";

/*
  Entravision × Community Health Alliance — Interactive Microsite (JSX)
  Requirements: recharts, lucide-react (install with npm/yarn)
*/

const BRAND = {
  primary: "#910f95", // Entravision purple
  accent: "#f60052",  // Entravision red
  black: "#000000",
  white: "#ffffff",
  muted: "#f4f4f6",
  grey: "#6b7280"
};

const INSIGHTS = {
  market: "Reno-Sparks DMA",
  hispanicPopulation: 200000,
  pct18_34_hispanic: 32,
  spanish_first: 70,
  bilingual: 58,
  annual_expenditures: 3800000000, // $3.8B
  streaming_usage: 88,
  radio_reach: 87,
  audio: 65
};

const baseChannels = [
  { name: "Univision / UniMás (TV)", reach: 180000 }, // illustrative baseline
  { name: "La Tricolor 102.1 (Radio)", reach: 120000 },
  { name: "OTT / CTV (Hispanic-focused)", reach: 95000 },
  { name: "Digital (Search + Display)", reach: 74000 },
  { name: "Creators & Social", reach: 52000 }
];

const baseInvestment = [
  { channel: "TV (Univision/UniMás)", pct: 40 },
  { channel: "Radio (La Tricolor)", pct: 10 },
  { channel: "OTT / CTV", pct: 25 },
  { channel: "Search & Display", pct: 15 },
  { channel: "Creators / Social", pct: 10 }
];

// helper
const fmt = (n) =>
  typeof n === "number" ? (n >= 1000 ? n.toLocaleString() : String(n)) : n;

export default function EntravisionProposal() {
  // interactive state
  const [budget, setBudget] = useState(75000);
  const [flightWeeks, setFlightWeeks] = useState(4);
  const [audienceSplit, setAudienceSplit] = useState({
    hispanicFamilies: 55,
    bilingualAdults: 25,
    general: 20
  });
  const [selectedTab, setSelectedTab] = useState("overview");

  // scale channel reach using budget & flight (simple model)
  const channelReach = useMemo(() => {
    const factor = budget / 50000; // normalize to $50k baseline
    return baseChannels.map((c) => ({
      ...c,
      reach: Math.round(c.reach * factor * (flightWeeks / 4))
    }));
  }, [budget, flightWeeks]);

  const investmentMix = useMemo(
    () =>
      baseInvestment.map((i) => ({
        ...i,
        dollars: Math.round((i.pct / 100) * budget)
      })),
    [budget]
  );

  const estimatedImpact = useMemo(() => {
    const totalImpr = channelReach.reduce((s, c) => s + c.reach, 0);
    const impressionsPerVisit = 1200; // conservative
    const impressionsPerAppointment = 22000; // approximate
    const visits = Math.round(totalImpr / impressionsPerVisit);
    const appointments = Math.max(0, Math.round(totalImpr / impressionsPerAppointment));
    const cpv = Math.round(budget / Math.max(1, visits));
    return { totalImpr, visits, appointments, cpv };
  }, [channelReach, budget]);

  // charts
  const barData = channelReach.map((c) => ({ name: c.name, reach: c.reach }));
  const audiencePie = [
    { name: "Hispanic families", value: audienceSplit.hispanicFamilies },
    { name: "Bilingual adults", value: audienceSplit.bilingualAdults },
    { name: "General", value: audienceSplit.general }
  ];

  // sample ZIPs (placeholder numbers that match the micro-market idea)
  const zipPerformance = [
    { zip: "89502", impressions: Math.round(estimatedImpact.totalImpr * 0.18) },
    { zip: "89503", impressions: Math.round(estimatedImpact.totalImpr * 0.15) },
    { zip: "89509", impressions: Math.round(estimatedImpact.totalImpr * 0.13) },
    { zip: "89512", impressions: Math.round(estimatedImpact.totalImpr * 0.10) },
    { zip: "89521", impressions: Math.round(estimatedImpact.totalImpr * 0.08) }
  ];

  const funnelData = [
    { stage: "Impressions", pct: 100 },
    { stage: "Site Visits", pct: Math.max(5, Math.round((estimatedImpact.visits / Math.max(1, estimatedImpact.totalImpr)) * 100)) },
    { stage: "Contact / Call", pct: Math.max(1, Math.round((estimatedImpact.appointments / Math.max(1, estimatedImpact.totalImpr)) * 100 * 5)) },
    { stage: "Appointments", pct: Math.max(0, Math.round((estimatedImpact.appointments / Math.max(1, estimatedImpact.visits)) * 100)) }
  ];

  function updateSplit(part, newVal) {
    newVal = Math.max(0, Math.min(100, Math.round(newVal)));
    const otherKeys = Object.keys(audienceSplit).filter((k) => k !== part);
    const otherTotal = otherKeys.reduce((s, k) => s + audienceSplit[k], 0);
    if (otherTotal === 0) {
      const even = Math.round((100 - newVal) / otherKeys.length);
      const updated = { ...audienceSplit, [part]: newVal };
      otherKeys.forEach((k) => (updated[k] = even));
      setAudienceSplit(updated);
      return;
    }
    const remaining = 100 - newVal;
    const updated = { ...audienceSplit, [part]: newVal };
    otherKeys.forEach((k) => {
      updated[k] = Math.round((audienceSplit[k] / otherTotal) * remaining);
    });
    const sum = Object.values(updated).reduce((s, v) => s + v, 0);
    if (sum !== 100) {
      const diff = 100 - sum;
      updated[otherKeys[0]] = updated[otherKeys[0]] + diff;
    }
    setAudienceSplit(updated);
  }

  function downloadPDF() {
    // simple client-side print; for real PDF generation integrate jsPDF or html2pdf
    window.print();
  }

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "Inter, system-ui, -apple-system, 'Helvetica Neue', Arial" }}>
      <main className="max-w-6xl mx-auto p-6">
        {/* HERO */}
        <header
          className="rounded-2xl overflow-hidden shadow-md"
          style={{ background: `linear-gradient(120deg, ${BRAND.primary}, ${BRAND.black} 60%, ${BRAND.accent})`, color: "#fff" }}
        >
          <div className="p-8">
            <div className="flex items-start justify-between gap-6">
              <div style={{ maxWidth: "65%" }}>
                <div style={{ textTransform: "uppercase", fontWeight: 800, letterSpacing: 1 }}>Entravision × Community Health Alliance</div>
                <h1 style={{ fontSize: 28, margin: "12px 0 6px", fontWeight: 800 }}>Culturally-Powered Growth for Community Health Alliance</h1>
                <p style={{ opacity: 0.95, marginBottom: 12 }}>
                  Bilingual, culturally fluent plan across Univision/UniMás, La Tricolor, OTT/CTV, digital and creators—designed to increase appointments, preventive screenings, and long-term trust in Reno–Sparks.
                </p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => alert("Book strategy call placeholder")} style={{ background: BRAND.accent, border: "none", color: "#fff", padding: "10px 14px", borderRadius: 10, fontWeight: 700 }}>Book Strategy Call</button>
                  <button onClick={() => alert("Request audience map placeholder")} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", padding: "10px 14px", borderRadius: 10, fontWeight: 700 }}>Request Audience Map</button>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.9 }}>Prepared</div>
                <div style={{ fontWeight: 800, marginTop: 6 }}>{new Date().toLocaleDateString()}</div>

                <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setSelectedTab("overview")} style={{ padding: "8px 12px", borderRadius: 8, background: selectedTab === "overview" ? "#fff" : "transparent", color: selectedTab === "overview" ? "#000" : "#fff", border: "none", fontWeight: 700 }}>Overview</button>
                  <button onClick={() => setSelectedTab("plan")} style={{ padding: "8px 12px", borderRadius: 8, background: selectedTab === "plan" ? "#fff" : "transparent", color: selectedTab === "plan" ? "#000" : "#fff", border: "none", fontWeight: 700 }}>Plan</button>
                  <button onClick={() => setSelectedTab("measurement")} style={{ padding: "8px 12px", borderRadius: 8, background: selectedTab === "measurement" ? "#fff" : "transparent", color: selectedTab === "measurement" ? "#000" : "#fff", border: "none", fontWeight: 700 }}>Measurement</button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <section style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 18 }}>
          {/* Controls */}
          <aside style={{ background: "#fff", padding: 18, borderRadius: 12, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Interactive Controls</h3>
            <p style={{ marginTop: 8, color: "#475569" }}>Adjust budget, flight, and audience focus. Projections update live.</p>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>Campaign Budget — ${fmt(budget)}</label>
              <input
                type="range"
                min="20000"
                max="200000"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{ width: "100%", marginTop: 8 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}><span>$20k</span><span>$200k</span></div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>Flight Length — {flightWeeks} weeks</label>
              <input
                type="range"
                min="2"
                max="16"
                step="1"
                value={flightWeeks}
                onChange={(e) => setFlightWeeks(Number(e.target.value))}
                style={{ width: "100%", marginTop: 8 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}><span>2w</span><span>16w</span></div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>Audience Focus</label>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span>Hispanic families</span><strong>{audienceSplit.hispanicFamilies}%</strong></div>
                <input type="range" min="0" max="100" value={audienceSplit.hispanicFamilies} onChange={(e) => updateSplit("hispanicFamilies", Number(e.target.value))} style={{ width: "100%", marginTop: 6 }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 8 }}><span>Bilingual adults</span><strong>{audienceSplit.bilingualAdults}%</strong></div>
                <input type="range" min="0" max="100" value={audienceSplit.bilingualAdults} onChange={(e) => updateSplit("bilingualAdults", Number(e.target.value))} style={{ width: "100%", marginTop: 6 }} />
                <div style={{ marginTop: 8, color: "#64748b", fontSize: 12 }}>General: {audienceSplit.general}%</div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button onClick={downloadPDF} style={{ flex: 1, background: BRAND.primary, color: "#fff", padding: "10px 12px", borderRadius: 8, fontWeight: 800, border: "none", display: "flex", alignItems: "center", gap: 8 }}><Printer size={14} /> Print</button>
              <button onClick={() => alert("Export package placeholder")} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e6e9ee", background: "#fff" }}><Download size={14} /> Export</button>
            </div>

            <div style={{ marginTop: 14, fontSize: 13, color: "#475569" }}>
              <div><strong>Total Impressions:</strong> {fmt(estimatedImpact.totalImpr)}</div>
              <div style={{ marginTop: 6 }}><strong>Estimated Site Visits:</strong> {fmt(estimatedImpact.visits)}</div>
              <div style={{ marginTop: 6 }}><strong>Estimated Appointments:</strong> {fmt(estimatedImpact.appointments)}</div>
              <div style={{ marginTop: 6 }}><strong>Cost per Visit:</strong> ${fmt(estimatedImpact.cpv)}</div>
            </div>
          </aside>

          {/* Main content */}
          <section style={{ background: "#fff", padding: 18, borderRadius: 12, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
            {/* small nav */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button onClick={() => setSelectedTab("overview")} style={{ padding: "6px 10px", borderRadius: 999, background: selectedTab === "overview" ? "#f1f5f9" : "transparent", border: "none", fontWeight: 700 }}>Overview</button>
              <button onClick={() => setSelectedTab("plan")} style={{ padding: "6px 10px", borderRadius: 999, background: selectedTab === "plan" ? "#f1f5f9" : "transparent", border: "none", fontWeight: 700 }}>Plan</button>
              <button onClick={() => setSelectedTab("measurement")} style={{ padding: "6px 10px", borderRadius: 999, background: selectedTab === "measurement" ? "#f1f5f9" : "transparent", border: "none", fontWeight: 700 }}>Measurement</button>
            </div>

            {selectedTab === "overview" && (
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Executive Summary</h2>
                <p className="mt-2 text-slate-600">
               <b>Goal: </b> Help Community Health Alliance drive appointment bookings and awareness for primary care, dental, behavioral health, women’s health, and immunizations among Hispanic families in Reno–Sparks.

</p> 
<p className="mt-2 text-slate-600"><b> Approach:</b>  Blend trusted Spanish-language TV & radio with high-precision OTT/CTV and performance digital to meet families where they watch, listen, and search—always with culturally fluent creative and measurable outcomes.


                </p>

                {/* KPI strip */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 12 }}>
                  <div style={{ background: BRAND.muted, padding: 12, borderRadius: 10 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: BRAND.primary }}>{fmt(INSIGHTS.hispanicPopulation)}</div>
                    <div style={{ fontSize: 12, color: "#374151" }}>Hispanics in Reno DMA</div>
                  </div>
                  <div style={{ background: BRAND.muted, padding: 12, borderRadius: 10 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: BRAND.primary }}>{INSIGHTS.pct18_34_hispanic}%</div>
                    <div style={{ fontSize: 12, color: "#374151" }}>Of 18–34 is Hispanic</div>
                  </div>
                  <div style={{ background: BRAND.muted, padding: 12, borderRadius: 10 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: BRAND.primary }}>{INSIGHTS.spanish_first}%</div>
                    <div style={{ fontSize: 12, color: "#374151" }}>Spanish-first</div>
                  </div>
                  <div style={{ background: BRAND.muted, padding: 12, borderRadius: 10 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: BRAND.primary }}>${(INSIGHTS.annual_expenditures / 1_000_000_000).toFixed(1)}B</div>
                    <div style={{ fontSize: 12, color: "#374151" }}>Annual Hispanic expenditures</div>
                  </div>
                </div>

                {/* Audience + Channel charts */}
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eef2f7" }}>
                    <h4 style={{ margin: 0, fontWeight: 800 }}>Audience Mix</h4>
                    <div style={{ width: "100%", height: 240, marginTop: 8 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={audiencePie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label>
                            {audiencePie.map((entry, idx) => <Cell key={idx} fill={[BRAND.primary, BRAND.accent, BRAND.black][idx % 3]} />)}
                          </Pie>
                          <Legend />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eef2f7" }}>
                    <h4 style={{ margin: 0, fontWeight: 800 }}>Channel Reach (scaled)</h4>
                    <div style={{ width: "100%", height: 240, marginTop: 8 }}>
                      <ResponsiveContainer>
                        <BarChart data={barData} margin={{ top: 6, right: 6, left: 6, bottom: 6 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(v) => (v >= 1000 ? `${(v/1000).toFixed(0)}k` : v)} />
                          <Tooltip formatter={(v) => Intl.NumberFormat().format(v)} />
                          <Bar dataKey="reach">
                            {barData.map((entry, idx) => <Cell key={idx} fill={[BRAND.primary, BRAND.accent, BRAND.black, "#0b7fbf", "#f7a23a"][idx % 5]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* KOLO-like market snapshot (Entravision-specific) */}
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                  <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eef2f7" }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>Media Habits</div>
                    <ul style={{ marginTop: 8, color: "#475569" }}>
                      <li>Streaming Video Usage: <strong>{INSIGHTS.streaming_usage}%</strong></li>
                      <li>Radio Reach (La Tricolor): <strong>{INSIGHTS.radio_reach}%</strong></li>
                      <li>Online Audio / Podcasts: <strong>{INSIGHTS.audio}%</strong></li>
                      <li>Language: Spanish-first {INSIGHTS.spanish_first}%, Bilingual {INSIGHTS.bilingual}%</li>
                    </ul>
                  </div>

                  <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eef2f7" }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>Why Entravision for CHA</div>
                    <ul style={{ marginTop: 8, color: "#475569" }}>
                      <li>Trust at scale: Univision/UniMás programming + La Tricolor personalities.</li>
                      <li>Right-time reach: OTT + search capture intent near clinic moments.</li>
                      <li>Culturally fluent creative + Spanish messaging for family decision-makers.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "plan" && (
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Recommended Media Plan</h2>
                <p style={{ color: "#475569", marginTop: 8 }}>Blend Spanish-language mass reach with precision OTT and performance digital to drive appointments and preventive care.</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                  <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eef2f7" }}>
                    <h4 style={{ margin: 0, fontWeight: 800 }}>Channel Allocations (sample)</h4>
                    <div style={{ marginTop: 10 }}>
                      {investmentMix.map((r, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed #eef2f7" }}>
                          <div style={{ fontWeight: 700 }}>{r.channel}</div>
                          <div>{r.pct}% • ${fmt(r.dollars)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Replace previous budget chart with channel reach/households (credible Entravision numbers) */}
                  <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eef2f7" }}>
                  <h4 className="text-lg font-semibold">Monthly Audience Reach (Entravision)</h4>
                    <div style={{ width: "100%", height: 220, marginTop: 8 }}>
                      <ResponsiveContainer>
                        <BarChart data={[
                          { name: "Univision/UniMás", hh: 382000 },
                          { name: "OTT/CTV (Hispanic)", hh: 215000 },
                          { name: "Digital (Hispanic users)", hh: 94000 }
                        ]} margin={{ left: 8, right: 8 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                          <Tooltip formatter={(v) => Intl.NumberFormat().format(v)} />
                          <Bar dataKey="hh" >
                            <Cell fill={BRAND.primary} />
                            <Cell fill={BRAND.accent} />
                            <Cell fill={BRAND.black} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ marginTop: 8, color: "#475569", fontSize: 13 }}>
                      <strong>Insight:</strong> Entravision delivers mass, culturally trusted reach via TV + radio, extended with OTT and targeted digital.
                    </div>
                  </div>
                </div>

                {/* Flight & creative */}
                <div style={{ marginTop: 12, padding: 12, borderRadius: 10, border: "1px solid #eef2f7" }}>
                <h4 className="text-lg font-semibold">Flight & Creative</h4>
                  <ol style={{ marginTop: 8, color: "#475569" }}>
                    <li>Creative: bilingual :30/:15 TV & OTT; :06 cutdowns; Spanish social & search creative</li>
                    <li>Radio: talent endorsements + remotes for vaccination and dental days</li>
                    <li>Geo: ZIP-level geofences around clinics; clinic-radius retargeting</li>
                    <li>Measurement hooks: call tracking, form attribution, cohort lift</li>
                  </ol>
                </div>

                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-lg font-semibold">Deliverables Snapshot</h4>
                  <table className="w-full text-sm mt-2 border-collapse">
                    <thead>
                      <tr className="bg-gray-50"><th className="p-2 text-left">Channel</th><th className="p-2 text-left">Focus</th><th className="p-2 text-left">Estimate</th></tr>
                    </thead>
                    <tbody>
                      <tr><td className="p-2">Univision / UniMás (KREN/KRNS)</td><td className="p-2">Trust & Mass Reach</td><td className="p-2">~100k–140k HH/week</td></tr>
                      <tr className="bg-gray-50"><td className="p-2">La Tricolor 102.1</td><td className="p-2">On-air endorsements & remotes</td><td className="p-2">Live reads + remotes</td></tr>
                      <tr><td className="p-2">OTT / CTV</td><td className="p-2">Geo + Language Targeting</td><td className="p-2">ZIP-level reach & VCR</td></tr>
                      <tr className="bg-gray-50"><td className="p-2">Search & Social (Spanish)</td><td className="p-2">Intent capture & conversions</td><td className="p-2">Calls & bookings</td></tr>
                      <tr><td className="p-2">Creators & Audio</td><td className="p-2">Cultural resonance</td><td className="p-2">Local creator content & podcasts</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === "measurement" && (
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Measurement & Reporting</h2>
                <p style={{ color: "#475569", marginTop: 8 }}>Entravision measurement will show the impact on appointments and community health behaviors with match-back and lift testing.</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                  <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eef2f7" }}>
                    <h4 style={{ margin: 0, fontWeight: 800 }}>Live KPIs</h4>
                    <ul style={{ marginTop: 8, color: "#475569" }}>
                      <li>Impressions, Reach, Frequency by channel</li>
                      <li>Video completion, CTR, VCR for OTT</li>
                      <li>Calls, form fills, appointment starts</li>
                      <li>Foot-traffic attribution near clinic locations</li>
                    </ul>
                  </div>

                  <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eef2f7" }}>
                    <h4 style={{ margin: 0, fontWeight: 800 }}>Attribution & Lift</h4>
                    <p style={{ marginTop: 8, color: "#475569" }}>
                      Run exposed vs control cohort analysis across flight windows to quantify uplifts in visits and appointments. Provide weekly pacing dashboards and a final ROI + learnings report.
                    </p>
                  </div>
                </div>

                {/* ZIP performance + Funnel */}
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eef2f7" }}>
                    <h4 style={{ margin: 0, fontWeight: 800 }}>Top ZIPs — Impressions</h4>
                    <div style={{ width: "100%", height: 200, marginTop: 8 }}>
                      <ResponsiveContainer>
                        <BarChart layout="vertical" data={zipPerformance}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="zip" type="category" width={80} />
                          <Tooltip formatter={(v) => Intl.NumberFormat().format(v)} />
                          <Bar dataKey="impressions" fill={BRAND.primary} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>Use these ZIPs for geofencing and localized radio/OTT bursts.</div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eef2f7" }}>
                    <h4 style={{ margin: 0, fontWeight: 800 }}>Patient Journey Funnel</h4>
                    <div style={{ width: "100%", height: 220, marginTop: 8 }}>
                      <ResponsiveContainer>
                        <ComposedChart data={funnelData} margin={{ left: 8 }}>
                          <XAxis dataKey="stage" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="pct" barSize={28} fill={BRAND.primary} />
                          <Area type="monotone" dataKey="pct" stroke={BRAND.accent} fillOpacity={0.08} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>
                      Retargeting narrows drop-off between Visit → Contact → Appointment. Focus social/search retargeting on recent visitors.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </section>

        {/* CTA */}
        <section style={{ marginTop: 18, background: "#fff", padding: 18, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 8px 24px rgba(15,23,42,0.04)" }}>
          <div>
            <h3 style={{ margin: 0, color: BRAND.primary, fontWeight: 900 }}>Ready to activate Entravision for CHA?</h3>
            <p style={{ marginTop: 6, color: "#475569" }}>Finalize priorities, confirm budgets and flight, and we'll kickoff culturally-fluent creative and measurement.</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => alert("Schedule kickoff placeholder")} style={{ padding: "10px 14px", background: BRAND.primary, color: "#fff", borderRadius: 10, border: "none", fontWeight: 800 }}>Schedule Kickoff</button>
            <button onClick={downloadPDF} style={{ padding: "10px 14px", background: "#fff", borderRadius: 10, border: `2px solid ${BRAND.accent}`, color: BRAND.accent, fontWeight: 800 }}>Download PDF</button>
          </div>
        </section>

        <footer style={{ marginTop: 20, textAlign: "center", color: "#64748b" }}>
          © Entravision — Proposal prepared for Community Health Alliance • Colors: {BRAND.primary}, {BRAND.accent}, #000, #fff
        </footer>
      </main>
    </div>
  );
}
