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
import { Printer, Download } from "lucide-react";


const BRAND = {
  primary: "#900881", // purple
  accent: "#f60052",  // magenta
  dark: "#2d0030",
  light: "#fdf2fa",
  grey: "#6B7A90"
};


const baseChannels = [
  { name: "Univision / UniMás", reach: 140000 },
  { name: "La Tricolor Radio", reach: 120000 },
  { name: "OTT / CTV", reach: 100000 },
  { name: "Search & Social", reach: 85000 },
  { name: "Creators", reach: 40000 }
];


const baseInvestment = [
  { channel: "Univision / UniMás", pct: 35 },
  { channel: "La Tricolor Radio", pct: 20 },
  { channel: "OTT / CTV", pct: 25 },
  { channel: "Search & Social", pct: 15 },
  { channel: "Creators", pct: 5 }
];

const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : n);

export default function EntravisionProposal() {
  const [budget, setBudget] = useState(60000);
  const [flightWeeks, setFlightWeeks] = useState(6);
  const [focusSplit, setFocusSplit] = useState({
    spanishFirst: 50,
    bilingual: 35,
    english: 15
  });
  const [selectedTab, setSelectedTab] = useState("overview");

  const channelReach = useMemo(() => {
    const factor = budget / 50000;
    return baseChannels.map((c) => ({
      ...c,
      reach: Math.round(c.reach * factor * (flightWeeks / 4))
    }));
  }, [budget, flightWeeks]);

  const investmentMix = useMemo(() => {
    return baseInvestment.map((i) => ({
      ...i,
      dollars: Math.round((i.pct / 100) * budget)
    }));
  }, [budget]);

  const estimatedImpact = useMemo(() => {
    const totalImpr = channelReach.reduce((s, c) => s + c.reach, 0);
    const impressionsToVisit = 1000;
    const impressionsToAppointment = 18000;
    const visits = Math.round(totalImpr / impressionsToVisit);
    const appointments = Math.round(totalImpr / impressionsToAppointment);
    const cpv = Math.round(budget / Math.max(1, visits));
    return { totalImpr, visits, appointments, cpv };
  }, [channelReach, budget]);

  const barData = channelReach.map((c) => ({ name: c.name, reach: c.reach }));
  const pieData = [
    { name: "Spanish-first", value: focusSplit.spanishFirst },
    { name: "Bilingual", value: focusSplit.bilingual },
    { name: "English-dominant", value: focusSplit.english }
  ];
  const colors = [BRAND.primary, BRAND.accent, BRAND.grey];

  function downloadPDF() {
    window.print();
  }

  function updateSplit(part, newVal) {
    newVal = Math.max(0, Math.min(100, Math.round(newVal)));
    const otherKeys = Object.keys(focusSplit).filter((k) => k !== part);
    const otherTotal = otherKeys.reduce((s, k) => s + focusSplit[k], 0);

    if (otherTotal === 0) {
      const even = Math.round((100 - newVal) / otherKeys.length);
      const updated = { ...focusSplit, [part]: newVal };
      otherKeys.forEach((k) => {
        updated[k] = even;
      });
      return setFocusSplit(updated);
    }

    const remaining = 100 - newVal;
    const updated = { ...focusSplit, [part]: newVal };
    otherKeys.forEach((k) => {
      updated[k] = Math.round((focusSplit[k] / otherTotal) * remaining);
    });

    const sum = Object.values(updated).reduce((s, v) => s + v, 0);
    if (sum !== 100) {
      const diff = 100 - sum;
      updated[otherKeys[0]] = updated[otherKeys[0]] + diff;
    }

    setFocusSplit(updated);
  }

  const zipPerformance = [
    { zip: "89502", impressions: 42000 },
    { zip: "89506", impressions: 36000 },
    { zip: "89512", impressions: 31000 },
    { zip: "89431", impressions: 27000 },
    { zip: "89509", impressions: 23000 }
  ];

  const funnelData = [
    { stage: "Awareness", pct: 100 },
    { stage: "Site Visits", pct: 19 },
    { stage: "Calls/ Forms", pct: 11 },
    { stage: "Appointment", pct: 8 }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900" aria-label="Entravision CHA Proposal Microsite">
      <main className="max-w-6xl mx-auto p-6">
        {/* HERO */}
        <header
  className="rounded-2xl overflow-hidden shadow-xl"
  style={{
    background: BRAND.primary
  }}
>
          <div className="p-8 md:p-12 text-white">
            <div className="max-w-3xl">
            <img
  src="/ev.png"
  alt="Entravision Logo"
  className="h-12 w-auto object-contain" 
/> 
<h1 className="font-heading text-4xl font-extrabold text-white">
               CULTURALLY-POWERED GROWTH FOR COMMUNITY HEALTH ALLIANCE
              </h1>
              <p className="mt-3 text-sm md:text-base opacity-90">
                A strategic bilingual media plan across Univision, UniMás, La Tricolor, OTT/CTV, digital, and creators—
                built to increase appointments, preventive screenings, and community trust in Reno–Sparks.
              </p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs">Spanish & Bilingual</span>
                <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs">Univision + UniMás</span>
                <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs">La Tricolor Radio</span>
                <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs">OTT / CTV</span>
              </div>
            </div>
          </div>
        </header>
        {/* BODY */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <aside className="col-span-1 bg-white p-5 rounded-xl shadow-md border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">Interactive Controls</h3>
            <p className="text-sm text-slate-600 mt-2">
              Adjust budget, flight length, and audience focus. Projections update live.
            </p>

            <div className="mt-4">
              <label className="text-sm font-medium">Campaign Budget — ${budget.toLocaleString()}</label>
              <input
                type="range"
                min="20000"
                max="200000"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mt-3"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$20k</span>
                <span>$200k</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Flight Length — {flightWeeks} weeks</label>
              <input
                type="range"
                min="2"
                max="16"
                step="1"
                value={flightWeeks}
                onChange={(e) => setFlightWeeks(Number(e.target.value))}
                className="w-full mt-3"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>2w</span>
                <span>16w</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Audience Focus</label>
              <div className="mt-2 space-y-2">
                <div>
                  <div className="flex justify-between text-xs">
                    <span>Spanish-first</span>
                    <strong>{focusSplit.spanishFirst}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focusSplit.spanishFirst}
                    onChange={(e) => updateSplit("spanishFirst", Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span>Bilingual</span>
                    <strong>{focusSplit.bilingual}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focusSplit.bilingual}
                    onChange={(e) => updateSplit("bilingual", Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              </div>
              <div className="mt-1 text-xs text-slate-500">English-dominant: {focusSplit.english}%</div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={downloadPDF}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#910f95] to-[#f60052] text-white shadow"
              >
                <Printer size={16} /> Print / Save PDF
              </button>
              <button
                onClick={() => alert("Download package (assets + summary) — connect backend to enable.")}
                className="px-3 py-2 rounded-lg border border-slate-200"
              >
                <Download size={14} /> Export
              </button>
            </div>

            <div className="mt-6 text-xs text-slate-600">
              <div>
                <strong>Total Impressions:</strong> {estimatedImpact.totalImpr.toLocaleString()}
              </div>
              <div>
                <strong>Estimated Site Visits:</strong> {estimatedImpact.visits.toLocaleString()}
              </div>
              <div>
                <strong>Estimated Appointments:</strong> {estimatedImpact.appointments.toLocaleString()}
              </div>
              <div>
                <strong>Cost per Visit:</strong> ${estimatedImpact.cpv.toLocaleString()}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="col-span-2 bg-white p-6 rounded-xl shadow-md border border-slate-100">
            <nav className="flex gap-3 mb-4">
              <button
                onClick={() => setSelectedTab("overview")}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedTab === "overview" ? "bg-slate-100 text-slate-900" : "text-slate-500"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab("plan")}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedTab === "plan" ? "bg-slate-100 text-slate-900" : "text-slate-500"
                }`}
              >
                Plan
              </button>
              <button
                onClick={() => setSelectedTab("measurement")}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedTab === "measurement" ? "bg-slate-100 text-slate-900" : "text-slate-500"
                }`}
              >
                Measurement
              </button>
            </nav>

            {selectedTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Campaign Overview</h2>
                <p className="mt-2 text-slate-600">
               <b>Goal: </b> Help Community Health Alliance drive appointment bookings and awareness for primary care, dental, behavioral health, women’s health, and immunizations among Hispanic families in Reno–Sparks.

</p> 
<p className="mt-2 text-slate-600"><b> Approach:</b>  Blend trusted Spanish-language TV & radio with high-precision OTT/CTV and performance digital to meet families where they watch, listen, and search—always with culturally fluent creative and measurable outcomes.


                </p>

                

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Audience Mix (Pie) */}
                  <div className="p-4 border rounded-lg">
                  <h4 className="text-lg font-semibold">Audience Mix</h4>
                    <div style={{ width: "100%", height: 280 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={48}
                            outerRadius={90}
                            label={({ percent }) => `${Math.round(percent * 100)}%`}
                          >
                            {pieData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Channel Reach Bar */}
                  <div className="p-4 border rounded-lg">
                  <h4 className="text-lg font-semibold">Channel Reach (scaled)</h4>
                    <div className="text-xs text-gray-500 mt-1">Interactive: Move budget control to see effect on projected reach. Hover on bar for channel.</div>
                    <div style={{ width: "100%", height: 240 }}>
                      <ResponsiveContainer>
                        <BarChart data={barData} margin={{ top: 20, right: 10, left: 22, bottom: 5 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(val) => Intl.NumberFormat().format(val)} />
                          <Tooltip formatter={(val) => Intl.NumberFormat().format(val)} />
                          <Bar dataKey="reach">
                            {barData.map((entry, idx) => (
                              <Cell key={`bar-${idx}`} fill={BRAND.accent} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg border">
                    <h5 className="text-sm font-semibold">Total Impressions</h5>
                    <div className="mt-2 text-2xl font-bold">{estimatedImpact.totalImpr.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 mt-1">Across all channels & flight.</div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h5 className="text-sm font-semibold">Estimated Site Visits</h5>
                    <div className="mt-2 text-2xl font-bold">{estimatedImpact.visits.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 mt-1">Based on modeled conversion rate.</div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h5 className="text-sm font-semibold">Estimated Appointments</h5>
                    <div className="mt-2 text-2xl font-bold">{estimatedImpact.appointments.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 mt-1">Primary care, dental, preventive.</div>
                  </div>
                </div>




                {/* Key Messages */}
                <div className="mt-6 p-4 rounded-lg border">
                  <h4 className="text-lg font-semibold">Key Messages</h4>
                  <ul className="mt-3 list-disc ml-5 text-slate-600">
                    <li><b>“Salud con Confianza”</b> — Healthcare your family can trust, in Spanish and English.</li>
                    <li><b>Preventive care first:</b> immunizations, dental, behavioral health, women’s health.</li>
                    <li><b>Community-based trust:</b> CHA clinics serving Reno–Sparks families for decades.</li>
                  </ul>
                </div>

                {/* ZIPs + Funnel */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold">Top ZIP Codes by Impressions</h4>
                    <div style={{ width: "100%", height: 220 }} className="mt-3">
                      <ResponsiveContainer>
                        <BarChart layout="vertical" data={zipPerformance}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="zip" type="category" width={80} />
                          <Tooltip formatter={(v) => Intl.NumberFormat().format(v)} />
                          <Bar dataKey="impressions" fill={BRAND.primary} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold">Appointment Funnel</h4>
                    <div style={{ width: "100%", height: 220 }} className="mt-3">
                      <ResponsiveContainer>
                        <ComposedChart data={funnelData}>
                          <XAxis dataKey="stage" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip formatter={(v) => `${v}%`} />
                          <Bar dataKey="pct" fill={BRAND.accent} />
                          <Area type="monotone" dataKey="pct" stroke={BRAND.primary} fillOpacity={0.06} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

 

                </div>
                <div className="mt-6 p-4 rounded-lg border">
                <h4 className="text-sm font-semibold text-slate-700">Reno Media Powerhouse</h4>

                <img
    src="/channels.png"
    alt="Reno Media Powerhouse"
    className="mt-3 rounded-lg w-full h-auto object-contain"
  />
  <p className="text-xs text-slate-500 mt-2">
    Our robust digital portfolio, three broadcast stations, and creative execution
    provide your brand with unmatched reach and connection to Reno consumers.
  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-gray-500">Monthly Hispanic Reach (est.)</div>
                    <div className="text-2xl font-bold mt-2">{fmt(200000)}</div>
                    <div className="text-xs text-gray-500 mt-1">Hispanic households in Reno DMA</div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-gray-500">Spanish Streaming Usage</div>
                    <div className="text-2xl font-bold mt-2">88%</div>
                    <div className="text-xs text-gray-500 mt-1">Streaming penetration among target demo</div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-gray-500">Radio Affinity</div>
                    <div className="text-2xl font-bold mt-2">87%</div>
                    <div className="text-xs text-gray-500 mt-1">La Tricolor weekly reach (est.)</div>
                  </div>
                </div>
               
              </div>
              

              
            )}
            {/* ----- Part 3: Plan, Measurement, CTA, Footer ----- */}

            {selectedTab === "plan" && (
              <div>
                <h2 className="text-2xl font-bold">Recommended Media Plan</h2>
                <p className="mt-2 text-slate-600">
                  A culturally-powered, bilingual plan: blend Entravision broadcast & radio trust with OTT/CTV precision and Spanish-first digital to drive CHA appointments and preventive care.
                </p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold">Channel Allocations (Suggested)</h4>
                    <div className="mt-3 space-y-2">
                      {investmentMix.map((r, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="text-sm">{r.channel}</div>
                          <div className="text-sm font-semibold">{r.pct}% — ${fmt(r.dollars)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-xs text-gray-600">
                     This mix is an initial recommendation only.
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold">Spend Mix by Channel</div>
                      
                      </div>
                      <div className="text-sm text-gray-500">Total: <strong>${fmt(budget)}</strong></div>
                    </div>

                    <div style={{ width: "100%", height: 290 }} className="mt-3">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={investmentMix.map((m) => ({ name: m.channel, value: m.dollars }))}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            innerRadius={40}
                            label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                          >
                            {investmentMix.map((e, i) => (<Cell key={i} fill={["#910f95", "#f60052", "#000000", "#6b7a90", "#8b5cf6"][i % 5]} />))}
                          </Pie>
                          <Legend />
                          <Tooltip formatter={(v) => `$${Intl.NumberFormat().format(v)}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-3 text-xs text-gray-600">Recommended: push linear TV + radio for mass trust and appointment awareness; OTT + search to capture intent and convert.</div>
                  </div>
                </div>

                {/* Flight & Creative */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-lg font-semibold">Recommended Placements and Messaging</h4>
                  <ol className="mt-3 ml-5 text-gray-600 list-decimal">
                    <li><b> Search + Spanish Social:</b> Capture "clinica cerca de mí", "dentista económico", "vacunas para niños"; Spanish creative and appointment landing pages.</li>
                    <li><b>Health Awareness on Univision News: </b>Weekly 15s/30s in local news + lower‑third banners. Rotate messages by service line and seasonal needs (flu, school immunizations).</li>
                    <li><b>OTT/CTV Near‑Clinic Targeting:</b> Geo‑fence neighborhoods around CHA locations; language targeting; clear CTA to schedule online or call.</li>
                    <li><b>La Tricolor Endorsements & Remotes:</b> On‑air talent invites families to clinics; on‑site remotes for vaccination days and dental checkups; live reads in Spanish.</li>
                  
                  </ol>
                </div>

                {/* Deliverables / Packages */}
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
                <h2 className="text-2xl font-bold">Measurement & Reporting</h2>
                <p className="mt-2 text-slate-600">Entravision measurement will combine broadcast reach, radio conversions, household match, digital attribution, and cohort lift for appointments.</p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                  <h4 className="text-lg font-semibold"> KPIs</h4>
                    <ul className="mt-2 text-sm text-gray-600 list-disc ml-5">
                      <li>Impressions, Reach, Frequency (by channel)</li>
                      <li>Video completion rate (VCR), CTR, Click-to-call</li>
                      <li>Site appointments, form fills, calls (Spanish landing pages)</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                  <h4 className="text-lg font-semibold">Attribution & Lift</h4>
                    <p className="text-sm text-gray-600 mt-2">We'll run exposed vs control cohorts by ZIP to measure incremental visits & appointments. Call tracking and appointment funnel mapping included.</p>
                  </div>
                </div>

                <div className="mt-6 p-4 border rounded-lg">
                <h4 className="text-lg font-semibold">Post-Campaign Deliverables</h4>
                  <ol className="ml-5 list-decimal text-sm text-gray-600">
                    <li>Executive summary & KPI results (bilingual)</li>
                    <li>Attribution & lift study: appointments & footfall</li>
                    <li>Creative performance + optimization roadmap</li>
                  </ol>
                </div>

   
              </div>
            )}
          </section>
        </section>

        {/* CTA */}
        <section className="mt-10 bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-extrabold" style={{ color: "#910f95" }}>Ready to activate Entravision for Community Health Alliance?</h3>
            <p className="text-sm text-gray-600 mt-2">Book a strategy call to get started.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => alert("Schedule kickoff (placeholder)")} className="px-4 py-2 rounded-lg" style={{ background: "#910f95", color: "#fff" }}>Schedule Kickoff</button>
            <button onClick={downloadPDF} className="px-4 py-2 rounded-lg border" style={{ borderColor: "#f60052", color: "#f60052" }}>Save as PDF</button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-500">© Entravision — Proposal prepared for Community Health Alliance.</footer>
      </main>
    </div>
  );
}
