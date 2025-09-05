// ProposalMicrosite.jsx — KOLO × Reno Orthopedic Centre interactive proposal (JS, Tailwind + Recharts)
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
  primary: "#0b336f",
  accent: "#f3202e",
  black: "#000000",
  white: "#ffffff",
  light: "#f7f9fb",
  muted: "#6b7a90"
};

const KOLO_INSIGHTS = {
  market: "Reno, NV (DMA)",
  population: 752585,
  households: 294364,
  adults25_54_pct: 38,
  reach_weekly_linear_hh: 120000,
  avg_monthly_digital_uv: 850000
};

const baselineChannels = [
  { name: "Linear TV", reach: 120000 },
  { name: "Streaming / CTV", reach: 200000 },
  { name: "Digital Display", reach: 150000 },
  { name: "Geo-Fencing", reach: 52000 },
  { name: "Paid Social", reach: 90000 }
];

const baseInvestment = [
  { channel: "Linear TV", pct: 35 },
  { channel: "Streaming / CTV", pct: 30 },
  { channel: "Display", pct: 15 },
  { channel: "Geo-Fencing", pct: 10 },
  { channel: "Paid Social", pct: 10 }
];

const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : n);

/* tiny palette for charts */
const CHART_COLORS = [BRAND.primary, BRAND.accent, "#0b7fbf", "#f7a23a", "#444444"];
/* ---------- helper sample data for ZIPs, funnel, competitor ---------- */
const zipPerformance = [
  { zip: "89501", impressions: 54000 },
  { zip: "89502", impressions: 47000 },
  { zip: "89509", impressions: 39000 },
  { zip: "89511", impressions: 32000 },
  { zip: "89512", impressions: 28000 }
];

const appointmentFunnel = [
  { stage: "Impressions", pct: 100 },
  { stage: "Site Visits", pct: 18 },
  { stage: "Calls / Forms", pct: 9 },
  { stage: "Appointments", pct: 6 }
];

const competitorShare = [
  { name: "KOLO", share: 48 },
  { name: "Competitor A", share: 20 },
  { name: "Competitor B", share: 14 },
  { name: "Digital-only", share: 18 }
];

/* ---------- Main Component ---------- */
export default function ProposalMicrosite() {
  const [budget, setBudget] = useState(65000);
  const [flightWeeks, setFlightWeeks] = useState(6);
  const [audienceSplit, setAudienceSplit] = useState({
    women3564: 50,
    adults55plus: 30,
    general: 20
  });
  const [selectedTab, setSelectedTab] = useState("overview");

  // scale channel reach based on budget & flight
  const channelReach = useMemo(() => {
    const factor = budget / 50000; // baseline $50k
    return baselineChannels.map((c) => ({
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
    const impressionsPerVisit = 1100; // conservative
    const impressionsPerPatient = 23000;
    const visits = Math.round(totalImpr / impressionsPerVisit);
    const patients = Math.max(0, Math.round(totalImpr / impressionsPerPatient));
    const cpv = Math.round(budget / Math.max(1, visits));
    return { totalImpr, visits, patients, cpv };
  }, [channelReach, budget]);

  const barData = channelReach.map((c) => ({ name: c.name, reach: c.reach }));
  const audiencePie = [
    { name: "Women 35–64", value: audienceSplit.women3564 },
    { name: "Adults 55+", value: audienceSplit.adults55plus },
    { name: "General", value: audienceSplit.general }
  ];

  function updateSplit(part, newVal) {
    newVal = Math.max(0, Math.min(100, Math.round(newVal)));
    const otherKeys = Object.keys(audienceSplit).filter((k) => k !== part);
    const otherTotal = otherKeys.reduce((s, k) => s + audienceSplit[k], 0);
    if (otherTotal === 0) {
      const even = Math.round((100 - newVal) / otherKeys.length);
      const updated = { ...audienceSplit, [part]: newVal };
      otherKeys.forEach((k) => { updated[k] = even; });
      return setAudienceSplit(updated);
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
    window.print();
  }
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="max-w-6xl mx-auto p-6">
        {/* HERO */}
        <header className="rounded-2xl overflow-hidden shadow-lg" style={{ background: `linear-gradient(120deg, ${BRAND.primary}, ${BRAND.black} 60%, ${BRAND.accent})` }}>
          <div className="p-8 text-white">
            <div className="flex justify-between items-start gap-6">
              <div>
                <div className="uppercase text-xs tracking-widest font-bold">KOLO × Reno Orthopedic Centre</div>
                <h1 className="text-3xl md:text-4xl font-extrabold mt-3">Personalized Multiscreen Campaign — KOLO Reno</h1>
                <p className="mt-3 max-w-2xl text-sm opacity-90">
                  Use KOLO's unmatched local reach across broadcast, streaming, and digital to drive patient visits, build awareness, and convert prospective patients.
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs">Broadcast</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs">Streaming</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs">Digital + Geo</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs uppercase opacity-80">Prepared</div>
                <div className="text-sm font-semibold">{new Date().toLocaleDateString()}</div>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => setSelectedTab("overview")} className={`px-3 py-2 rounded-lg text-sm font-semibold ${selectedTab === "overview" ? "bg-white text-black" : "bg-white/10 text-white"}`}>Overview</button>
                  <button onClick={() => setSelectedTab("plan")} className={`px-3 py-2 rounded-lg text-sm font-semibold ${selectedTab === "plan" ? "bg-white text-black" : "bg-white/10 text-white"}`}>Plan</button>
                  <button onClick={() => setSelectedTab("measurement")} className={`px-3 py-2 rounded-lg text-sm font-semibold ${selectedTab === "measurement" ? "bg-white text-black" : "bg-white/10 text-white"}`}>Measurement</button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main grid */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <aside className="bg-white p-5 rounded-xl shadow-md border col-span-1">
            <h3 className="text-lg font-semibold">Interactive Controls</h3>
            <p className="text-sm text-gray-600 mt-2">Adjust budget & flight; charts update instantly.</p>

            <div className="mt-4">
              <label className="text-sm font-medium">Budget — ${fmt(budget)}</label>
              <input type="range" min="20000" max="300000" step="5000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full mt-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1"><span>$20k</span><span>$300k</span></div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Flight — {flightWeeks} weeks</label>
              <input type="range" min="2" max="20" step="1" value={flightWeeks} onChange={(e) => setFlightWeeks(Number(e.target.value))} className="w-full mt-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1"><span>2w</span><span>20w</span></div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Audience Focus</label>
              <div className="mt-2 space-y-2">
                <div>
                  <div className="flex justify-between text-xs"><span>Women 35–55</span><strong>{audienceSplit.women3564}%</strong></div>
                  <input type="range" min="0" max="100" value={audienceSplit.women3564} onChange={(e) => updateSplit("women3564", Number(e.target.value))} className="w-full mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-xs"><span>Adults 55+</span><strong>{audienceSplit.adults55plus}%</strong></div>
                  <input type="range" min="0" max="100" value={audienceSplit.adults55plus} onChange={(e) => updateSplit("adults55plus", Number(e.target.value))} className="w-full mt-1" />
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500">General: {audienceSplit.general}%</div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={downloadPDF} className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-[#0b336f] to-[#000000] text-white"><Printer size={14} /> Print</button>
              <button onClick={() => alert("Export package placeholder")} className="px-3 py-2 rounded-lg border">Export</button>
            </div>

            <div className="mt-4 text-xs text-gray-600 space-y-1">

            </div>
          </aside>

          {/* Main content */}
          <section className="col-span-2 bg-white p-6 rounded-xl shadow-md border">
            {/* Tabs already shown in header; still show small nav here */}
            <nav className="flex gap-3 mb-4">
              <button onClick={() => setSelectedTab("overview")} className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedTab === "overview" ? "bg-gray-100" : "text-gray-500"}`}>Overview</button>
              <button onClick={() => setSelectedTab("plan")} className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedTab === "plan" ? "bg-gray-100" : "text-gray-500"}`}>Plan</button>
              <button onClick={() => setSelectedTab("measurement")} className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedTab === "measurement" ? "bg-gray-100" : "text-gray-500"}`}>Measurement</button>
            </nav>

            {selectedTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold">Campaign Overview</h2>
                <p className="mt-2 text-gray-600">KOLO combines trusted local broadcast, premium streaming, and precision digital to reach decision-makers across Northern Nevada. This plan aligns KOLO’s audience strength with ROC’s service lines, appointment goals, and brand leadership.</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold">Audience Mix</h4>
                    <div style={{ width: "100%", height: 260 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={audiencePie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label>
                            {audiencePie.map((entry, idx) => (<Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />))}
                          </Pie>
                          <Legend />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold">Channel Reach (scaled)</h4>
                    <div style={{ width: "100%", height: 260 }}>
                      <ResponsiveContainer>
                        <BarChart data={barData} margin={{ top: 12, right: 20, left: 12, bottom: 6 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(v) => Intl.NumberFormat().format(v)} />
                          <Tooltip formatter={(v) => Intl.NumberFormat().format(v)} />
                          <Bar dataKey="reach" fill={BRAND.primary} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* KOLO viewership snapshot & competitor comparison */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="text-sm font-semibold">KOLO Snapshot</h5>
                    <div className="mt-3 text-2xl font-bold">{fmt(KOLO_INSIGHTS.avg_monthly_digital_uv)} UV / mo</div>
                    <div className="text-xs text-gray-500 mt-1">Digital reach (monthly avg)</div>
                    <div className="mt-3 text-sm">Households reachable weekly (Linear): <strong>{fmt(KOLO_INSIGHTS.reach_weekly_linear_hh)}</strong></div>
                  </div>

                  <div className="col-span-2 p-4 border rounded-lg">
                    <h5 className="text-sm font-semibold">Market Position — KOLO vs local</h5>
                    <div style={{ width: "100%", height: 140 }} className="mt-3">
                      <ResponsiveContainer>
                        <BarChart data={competitorShare} margin={{ left: 0 }}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="share" fill={BRAND.accent} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">KOLO leads local broadcast share — combine this with digital extensions to maximize clinic reach.</div>
                  </div>
                </div>

                {/* ZIPs + Funnel */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="text-sm font-semibold">Top ZIPs — Impressions</h5>
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
                    <div className="text-xs text-gray-500 mt-2">Focus geo-fencing and linear bursts in these ZIPs to maximize visits.</div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h5 className="text-sm font-semibold">Appointment Funnel</h5>
                    <div style={{ width: "100%", height: 220 }} className="mt-3">
                      <ResponsiveContainer>
                        <ComposedChart data={appointmentFunnel}>
                          <XAxis dataKey="stage" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="pct" barSize={24} fill={BRAND.primary} />
                          <Area type="monotone" dataKey="pct" stroke={BRAND.accent} fillOpacity={0.08} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Use retargeting to narrow drop-off between Visit → Appointment.</div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "plan" && (
              <div>
                <h2 className="text-2xl font-bold">Recommended Media Plan</h2>
                <p className="mt-2 text-gray-600">Video-forward allocation to drive tune-in and web traffic followed by display & geo retargeting for conversions.</p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold">Channel Allocations</h4>
                    <div className="mt-3 space-y-2">
                      {investmentMix.map((r, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="text-sm">{r.channel}</div>
                          <div className="text-sm font-semibold">{r.pct}% — ${fmt(r.dollars)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget breakdown pie */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold">Proposed Budget Allocation</div>
                        <div className="text-xs text-gray-500 mt-1">Adjust budget to see allocation impact</div>
                      </div>
                      <div className="text-sm text-gray-500">Total: <strong>${fmt(budget)}</strong></div>
                    </div>

                    <div style={{ width: "100%", height: 220 }} className="mt-3">
                      <ResponsiveContainer>
                        <PieChart>
                          {/* create breakdown example from investmentMix */}
                          <Pie
                            data={investmentMix.map((m) => ({ name: m.channel, value: m.pct }))}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            innerRadius={40}
                            label
                          >
                            {investmentMix.map((e, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}
                          </Pie>
                          <Legend />
                          <Tooltip formatter={(v) => `${v}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">Recommended: push video (Linear + CTV) early to generate awareness; follow with geo-targeted retargeting to convert.</div>
                  </div>
                </div>

                {/* Flight & Creative */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-lg font-semibold">Flight & Creative</h4>
                  <ol className="mt-3 ml-5 text-gray-600 list-decimal">
                    <li>Production: 30s hero TV spot, 15s OTT/CTV, :06 cutdowns for social.</li>
                    <li>Targeting: ZIP-level geofences around clinics; lookalike pools from patient lists.</li>
                    <li>Pacing: Weekly linear bursts for tune-in; continuous OTT and display for recency.</li>
                  </ol>
                </div>
              </div>
            )}

            {selectedTab === "measurement" && (
              <div>
                <h2 className="text-2xl font-bold">Measurement & Reporting</h2>
                <p className="mt-2 text-gray-600">KOLO measurement combines broadcast GRP, AudienceTrak (household match), and digital attribution to show impact on visits and conversions.</p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold">Live KPIs</h4>
                    <ul className="mt-2 text-sm text-gray-600 list-disc ml-5">
                      <li>Impressions, Reach, Frequency</li>
                      <li>Video completion rate (VCR), CTR</li>
                      <li>Site visits, appointment bookings, footfall</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold">Attribution & Lift</h4>
                    <p className="text-sm text-gray-600 mt-2">We’ll run cohort lift tests around flight windows: compare exposed vs control cohorts for site visits and appointments.</p>
                  </div>
                </div>

                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-sm font-semibold">Post-Campaign Deliverables</h4>
                  <ol className="ml-5 list-decimal text-sm text-gray-600">
                    <li>Executive summary and KPI results</li>
                    <li>Creative performance with recommended optimizations</li>
                    <li>Attribution & patient acquisition analysis</li>
                  </ol>
                </div>
              </div>
            )}
          </section>
        </section>

        {/* CTA */}
        <section className="mt-10 bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-extrabold" style={{ color: BRAND.primary }}>Ready to activate KOLO for ROC?</h3>
            <p className="text-sm text-gray-600 mt-2">Approve the plan and we’ll finalize IOs, lock inventory, and enable KOLO reporting for real-time optimization.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => alert("Schedule kickoff (placeholder)")} className="px-4 py-2 rounded-lg bg-[#0b336f] text-white">Schedule Kickoff</button>
            <button onClick={downloadPDF} className="px-4 py-2 rounded-lg border" style={{ borderColor: BRAND.accent }}>Download PDF</button>
          </div>
        </section>

        <footer className="mt-6 text-center text-sm text-gray-500">© KOLO — Proposal prepared for Reno Orthopedic Centre. This interactive preview is for on-screen review.</footer>
      </main>
    </div>
  );
}
