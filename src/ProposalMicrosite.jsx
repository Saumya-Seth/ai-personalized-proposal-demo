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

// Spectrum Reach-inspired palette
const BRAND = {
  primary: "#001b33", // deep navy
  secondary: "#137EBD", // spectrum blue
  accent: "#0099d8", // spectrum cyan
  dark: "#001020",
  light: "#F2F7FB",
  grey: "#6B7A90"
};

// Channels (baseline reach at $50k / 4 weeks)
const baseChannels = [
  { name: "Linear TV", reach: 160000 },
  { name: "Streaming / CTV", reach: 220000 },
  { name: "Digital Display", reach: 150000 },
  { name: "Retargeting", reach: 60000 },
  { name: "Paid Social", reach: 90000 }
];

// Investment mix (% of budget)
const baseInvestment = [
  { channel: "Linear TV", pct: 35 },
  { channel: "Streaming / CTV", pct: 35 },
  { channel: "Display", pct: 15 },
  { channel: "Retargeting", pct: 10 },
  { channel: "Paid Social", pct: 5 }
];

const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : n);

export default function SpectrumReachProposal() {
  const [budget, setBudget] = useState(60000);
  const [flightWeeks, setFlightWeeks] = useState(6);
  const [focusSplit, setFocusSplit] = useState({
    women3555: 50,
    adults55: 30,
    general: 20
  });
  const [selectedTab, setSelectedTab] = useState("overview");

  const channelReach = useMemo(() => {
    const factor = budget / 50000; // normalize to $50k baseline
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
    const impressionsToVisit = 1200;
    const impressionsToPatient = 25000;
    const visits = Math.round(totalImpr / impressionsToVisit);
    const patients = Math.max(0, Math.round(totalImpr / impressionsToPatient));
    const cpv = Math.round(budget / Math.max(1, visits));
    return { totalImpr, visits, patients, cpv };
  }, [channelReach, budget]);

  const barData = channelReach.map((c) => ({ name: c.name, reach: c.reach }));
  const pieData = [
    { name: "Women 35–55", value: focusSplit.women3555 },
    { name: "Adults 55+", value: focusSplit.adults55 },
    { name: "General", value: focusSplit.general }
  ];

  const colors = [BRAND.accent, BRAND.secondary, BRAND.primary];

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

  // ----- ADDED SAMPLE DATA that were missing -----
  const zipPerformance = [
    { zip: "89501", impressions: 54000 },
    { zip: "89502", impressions: 47000 },
    { zip: "89509", impressions: 39000 },
    { zip: "89511", impressions: 32000 },
    { zip: "89512", impressions: 28000 }
  ];

  const funnelData = [
    { stage: "Impressions", pct: 100 },
    { stage: "Site Visits", pct: 19 },
    { stage: "Appointments", pct: 8 },
    { stage: "New Patients", pct: 6 }
  ];
  // ------------------------------------------------

  return (
    <div className="min-h-screen bg-white text-gray-900" aria-label="Spectrum Reach ROC Proposal Microsite">
      <main className="max-w-6xl mx-auto p-6">
        {/* Hidden gradient def for subtle charts */}
        <svg style={{ display: "none" }} aria-hidden="true">
          <defs>
            <linearGradient id="sr-grad" x1="0" x2="1">
              <stop offset="0" stopColor={BRAND.light} />
              <stop offset="1" stopColor="#EAF8FF" />
            </linearGradient>
          </defs>
        </svg>

        {/* HERO */}
        <header
          className="rounded-2xl overflow-hidden shadow-xl"
          style={{
            background: `linear-gradient(120deg, ${BRAND.primary}, ${BRAND.secondary} 55%, ${BRAND.accent})`
          }}
        >
          <div className="p-8 md:p-12 text-white">
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-2xl">
                <div className="uppercase text-xs tracking-widest text-sky-100 font-bold">
                  Spectrum Reach × Reno Orthopedic Centre
                </div>
                <h1 className="text-3xl md:text-5xl mt-2 font-extrabold leading-tight">
                  Strategic Multiscreen Proposal for ROC
                </h1>
                <p className="mt-3 text-sm md:text-base opacity-90">
                  A data-driven plan spanning Linear TV, Streaming/CTV, Display, and Retargeting.
                  Powered by Spectrum Reach first-party data and measured through AudienceTrak.
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs">Linear + CTV</span>
                  <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs">Display</span>
                  <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs">Retargeting</span>
                  <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs">AudienceTrak</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs uppercase opacity-80">Prepared</div>
                <div className="text-sm font-semibold">{new Date().toLocaleDateString()}</div>
                <div className="mt-4 flex gap-3 justify-end">
                  <button
                    onClick={() => setSelectedTab("overview")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      selectedTab === "overview" ? "bg-white text-blue-800" : "bg-white/10 text-white"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setSelectedTab("plan")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      selectedTab === "plan" ? "bg-white text-blue-800" : "bg-white/10 text-white"
                    }`}
                  >
                    Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* BODY */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <aside className="col-span-1 bg-white p-5 rounded-xl shadow-md border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">Interactive Controls</h3>
            <p className="text-sm text-slate-600 mt-2">Adjust budget and flight; projections update live.</p>

            <div className="mt-4">
              <label className="text-sm font-medium">Campaign Budget — ${budget.toLocaleString()}</label>
              <input
                type="range"
                min="20000"
                max="250000"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mt-3"
                aria-label="Campaign budget"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$20k</span>
                <span>$250k</span>
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
                aria-label="Flight length"
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
                    <span>Women 35–55</span>
                    <strong>{focusSplit.women3555}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focusSplit.women3555}
                    onChange={(e) => updateSplit("women3555", Number(e.target.value))}
                    className="w-full mt-2"
                    aria-label="Women 35–55 focus"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span>Adults 55+</span>
                    <strong>{focusSplit.adults55}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focusSplit.adults55}
                    onChange={(e) => updateSplit("adults55", Number(e.target.value))}
                    className="w-full mt-2"
                    aria-label="Adults 55+ focus"
                  />
                </div>
              </div>
              <div className="mt-1 text-xs text-slate-500">General: {focusSplit.general}%</div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={downloadPDF}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#001b33] to-[#137EBD] text-white shadow"
                aria-label="Print or save PDF"
              >
                <Printer size={16} /> Print / Save PDF
              </button>
              <button
                onClick={() => alert("Download package (assets + summary) — connect to backend to enable.")}
                className="px-3 py-2 rounded-lg border border-slate-200"
                aria-label="Export package"
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
                <strong>Est. New Patients:</strong> {estimatedImpact.patients.toLocaleString()}
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
                  This plan unifies Spectrum Reach’s Linear + CTV scale with precision digital to reach Women 35–55 and Adults 55+,
                  driving clinic visits and patient inquiries for ROC.
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Audience Mix (Donut) */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-700">Audience Mix</h4>
                    <div style={{ width: "100%", height: 280 }}>
                      <ResponsiveContainer>
                        <PieChart aria-label="Audience focus pie chart">
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
                    <h4 className="text-sm font-semibold text-slate-700">Channel Reach (baseline scaled)</h4>
                    <div style={{ width: "100%", height: 240 }}>
                      <ResponsiveContainer>
                        <BarChart data={barData} margin={{ top: 20, right: 10, left: 22, bottom: 5 }} aria-label="Channel reach bar chart">
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(val) => Intl.NumberFormat().format(val)} />
                          <Tooltip formatter={(val) => Intl.NumberFormat().format(val)} />
                          <Bar dataKey="reach">
                            {barData.map((entry, idx) => (
                              <Cell key={`cellb-${idx}`} fill={BRAND.secondary} />
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
                    <div className="text-xs text-slate-500 mt-1">Across selected channels & flight.</div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h5 className="text-sm font-semibold">Estimated Site Visits</h5>
                    <div className="mt-2 text-2xl font-bold">{estimatedImpact.visits.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 mt-1">Modeled at 1 per ~1.2k impressions.</div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h5 className="text-sm font-semibold">Estimated New Patients</h5>
                    <div className="mt-2 text-2xl font-bold">{estimatedImpact.patients.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 mt-1">Illustrative, adjust post-IO.</div>
                  </div>
                </div>

                {/* Key Messages */}
                <div className="mt-6 p-4 rounded-lg border">
                  <h4 className="text-lg font-semibold">Key Messages</h4>
                  <ul className="mt-3 list-disc ml-5 text-slate-600">
                    <li>Trusted care close to home — ROC specialties and locations.</li>
                    <li>"Get Back to Moving" — Advanced orthopedic treatments to help you recover faster and stronger.</li>
                    <li>"Your Mobility, Our Mission" — Helping you get back to the activities you love, pain-free.</li>
                  </ul>
                </div>

                <div className="mt-6 p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Target Areas & ZIP Performance</h2>
                    <div className="text-sm text-slate-500">Top performing ZIPs (sample)</div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm font-semibold">Top ZIP Codes — Impressions</div>
                      <div style={{ width: "100%", height: 220 }} className="mt-3">
                        <ResponsiveContainer>
                          <BarChart layout="vertical" data={zipPerformance} margin={{ left: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="zip" type="category" width={80} />
                            <Tooltip formatter={(v) => Intl.NumberFormat().format(v)} />
                            <Bar dataKey="impressions" fill={BRAND.secondary} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">Prioritize geofence and linear bursts in top ZIPs for best ROI.</div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="text-sm font-semibold">Appointment Funnel</div>
                      <div style={{ width: "100%", height: 220 }} className="mt-3">
                        <ResponsiveContainer>
                          <ComposedChart data={funnelData}>
                            <XAxis dataKey="stage" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(v) => `${v}%`} />
                            <Bar dataKey="pct" fill={BRAND.primary} />
                            <Area type="monotone" dataKey="pct" stroke={BRAND.accent} fillOpacity={0.06} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">From awareness to conversion — shows expected drop-off and where to optimize.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "plan" && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Recommended Media Plan</h2>
                <p className="mt-2 text-slate-600">Balanced allocation for efficient reach, sustained frequency, and bottom-funnel conversions.</p>

                <div className="mt-4 space-y-3">
                  {investmentMix.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-3/12 text-sm font-semibold text-slate-700">{row.channel}</div>
                      <div className="w-6/12 text-sm text-slate-600">Allocation: {row.pct}% — ${row.dollars.toLocaleString()}</div>
                      <div className="w-3/12 text-right text-sm text-slate-500">{Math.round((row.dollars / budget) * 100)}% of current budget</div>
                    </div>
                  ))}
                </div>

                

                <div className="mt-6 p-4 rounded-lg border">
                  <h4 className="text-lg font-semibold">Flight & Creative</h4>
                  <ol className="mt-3 ml-5 text-slate-600 list-decimal">
                    <li>Creative: 30s/15s TV & CTV, :06 cutdowns, display banners, social.</li>
                    <li>Geo: Reno DMA with city overlays; clinic radii for retargeting pools.</li>
                    <li>Optimization: Cross-screen frequency caps; AudienceTrak pacing & lift.</li>
                  </ol>
                </div>

                <div className="mt-6 p-4 rounded-lg border">
                  <h4 className="text-lg font-semibold">Optimization Strategy (Real-time data + audience insights = better results)</h4>
                  <ol className="mt-3 ml-5 text-slate-600 list-decimal">
                    <li>
                      <b>Smart Audience Shifts</b> — Move investment dynamically toward high-performing segments.
                    </li>
                    <li>
                      <b>Geo:</b> Reno DMA with city overlays; clinic radii for retargeting pools.
                    </li>
                    <li>
                      <b>Optimization: </b>Cross-screen frequency caps; AudienceTrak pacing & lift.
                    </li>
                  </ol>
                </div>

                <div className="mt-6 p-4 rounded-lg border">
                  <h4 className="text-lg font-semibold">Deliverables Snapshot</h4>
                  <table className="w-full text-sm mt-2 border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="p-2 text-left">Channel</th>
                        <th className="p-2 text-left">Focus</th>
                        <th className="p-2 text-left">Estimate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2">Linear TV</td>
                        <td className="p-2">Awareness</td>
                        <td className="p-2">~100k–150k HH/week</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-2">Streaming / CTV</td>
                        <td className="p-2">Engagement</td>
                        <td className="p-2">~220k impressions (baseline)</td>
                      </tr>
                      <tr>
                        <td className="p-2">Digital Display</td>
                        <td className="p-2">Consideration</td>
                        <td className="p-2">~150k impressions</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-2">Retargeting</td>
                        <td className="p-2">Conversion</td>
                        <td className="p-2">~60k impressions</td>
                      </tr>
                      <tr>
                        <td className="p-2">Paid Social</td>
                        <td className="p-2">Support</td>
                        <td className="p-2">~90k reach</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === "measurement" && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Measurement & Reporting</h2>
                <p className="mt-2 text-slate-600">AudienceTrak provides transparent, daily reporting across Linear + Digital. We’ll deliver mid-flight optimizations and a final performance readout.</p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold">Live KPIs</h4>
                    <ul className="mt-2 text-sm text-slate-600 list-disc ml-5">
                      <li>Reach, Frequency, Impressions</li>
                      <li>Video completion rate (VCR), CTR</li>
                      <li>Site actions (appointments, calls, form fills)</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-semibold">Attribution</h4>
                    <p className="text-sm text-slate-600 mt-2">
                      Match back site visits and conversions by exposure cohort; leverage geo-based lift for Linear plus CTV view-through.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-sm font-semibold">Post-Campaign Deliverable</h4>
                  <ol className="ml-5 list-decimal text-sm text-slate-600">
                    <li>Executive summary & KPI performance</li>
                    <li>Creative insights & optimization roadmap</li>
                    <li>Attribution review & patient acquisition learnings</li>
                  </ol>
                </div>
              </div>
            )}
          </section>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex items-start gap-8 flex-col md:flex-row">
            <div className="flex-1">
              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-[#001b33] via-[#137EBD] to-[#0099d8] bg-clip-text text-transparent leading-tight">
                Ready to Launch with Spectrum Reach?
              </h3>
              <p className="mt-4 text-lg text-slate-700 leading-relaxed max-w-xl">
                Together, <span className="font-semibold text-[#001b33]">Spectrum Reach</span> and ROC can deliver a measurable, cross-screen campaign that moves patients from awareness to conversion.
              </p>
            </div>

            <aside className="w-full md:w-72 p-4 border rounded-lg">
              <h4 className="font-semibold">Contacts & Next Steps</h4>
              <p className="text-sm text-slate-600 mt-2">Confirm objectives, finalize budget tier, and approve creative to begin trafficking.</p>
              <div className="mt-3">
                <button onClick={() => alert("Add your scheduling link")} className="w-full mt-3 py-2 rounded-lg border text-white" style={{ backgroundColor: BRAND.primary, borderColor: BRAND.primary }}>
                  Schedule Kickoff
                </button>
                <button onClick={downloadPDF} className="w-full mt-3 py-2 rounded-lg border text-[#001b33]" style={{ backgroundColor: BRAND.accent, borderColor: BRAND.accent }}>
                  Save as PDF
                </button>
              </div>
            </aside>
          </div>
        </section>

        <footer className="mt-8 text-center text-sm text-slate-500">
          © Spectrum Reach — Proposal prepared for ROC. This interactive microsite is designed for on-screen review.
        </footer>
      </main>
    </div>
  );
}
