"use client";
import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Package, DollarSign, ShoppingCart, Users, ChevronDown } from "lucide-react";
import { useOrders, calcTotals } from "@/lib/store/ordersContext";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const typeColors: Record<string,string> = {
  Indica: "#a78bfa", Sativa: "#4ade80", Hybrid: "#60a5fa", CBD: "#fbbf24",
};

// ── Demo data (Test Month only) ───────────────────────────────────────────────
const DEMO_MONTHLY = [
  { month: "Jan", revenue: 4820,  orders: 12 },
  { month: "Feb", revenue: 5310,  orders: 14 },
  { month: "Mar", revenue: 6040,  orders: 16 },
  { month: "Apr", revenue: 5780,  orders: 15 },
  { month: "May", revenue: 7200,  orders: 19 },
  { month: "Jun", revenue: 8450,  orders: 22 },
  { month: "Jul", revenue: 9120,  orders: 24 },
];

// ── Build month dropdown — only months up to today ────────────────────────────
function buildMonthOptions() {
  const today = new Date();
  const curYear  = today.getFullYear();
  const curMonth = today.getMonth(); // 0-indexed — only current month to start
  return [{
    label: `${MONTH_NAMES[curMonth]} ${curYear}`,
    value: `${curYear}-${String(curMonth + 1).padStart(2, "0")}`,
  }];
}

// ── Charts ────────────────────────────────────────────────────────────────────
function BarChart({ data, metric }: { data: { month: string; revenue: number; orders: number }[]; metric: "revenue" | "orders" }) {
  const max = Math.max(...data.map(d => d[metric]), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, padding: "0 4px" }}>
      {data.map(d => {
        const pct = (d[metric] / max) * 100;
        return (
          <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700 }}>
              {metric === "revenue" ? `$${(d[metric] / 1000).toFixed(1)}k` : d[metric]}
            </span>
            <div style={{ width: "100%", height: 100, display: "flex", alignItems: "flex-end" }}>
              <div style={{
                width: "100%", height: `${Math.max(pct, 3)}%`, borderRadius: "4px 4px 0 0",
                background: "linear-gradient(to top, #00f6ff, rgba(0,246,255,0.4))",
                transition: "height 0.4s ease",
              }} />
            </div>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 600 }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ segments }: { segments: { pct: number; color: string }[] }) {
  let cum = 0;
  const r = 52, cx = 64, cy = 64;
  return (
    <svg width={128} height={128} viewBox="0 0 128 128">
      {segments.filter(s => s.pct > 0).map(({ pct, color }, i) => {
        const toRad = (d: number) => (d * Math.PI) / 180;
        const start = (cum / 100) * 360 - 90;
        const sweep = (pct / 100) * 360 - 2;
        cum += pct;
        const x1 = cx + r * Math.cos(toRad(start));
        const y1 = cy + r * Math.sin(toRad(start));
        const x2 = cx + r * Math.cos(toRad(start + sweep));
        const y2 = cy + r * Math.sin(toRad(start + sweep));
        return (
          <path key={i}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
            fill={color} opacity={0.85} />
        );
      })}
      <circle cx={cx} cy={cy} r={34} fill="#111" />
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const MONTH_OPTIONS = buildMonthOptions();

export default function SalesAnalytics() {
  const { orders } = useOrders();
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const [period, setPeriod] = useState<string>("test");
  const isDemo = period === "test";

  // Orders filtered to the selected month (or all for demo)
  const periodOrders = useMemo(() => {
    if (isDemo) return orders;
    return orders.filter(o => o.submitted.startsWith(period));
  }, [orders, period, isDemo]);

  // Stats derived from the filtered orders
  const stats = useMemo(() => {
    const paidOrders  = periodOrders.filter(o => o.paymentStatus === "paid");
    const totalRevenue = paidOrders.reduce((s, o) => s + calcTotals(o.items).total, 0);
    const totalOrders  = periodOrders.length;
    const totalUnits   = periodOrders.flatMap(o => o.items).reduce((s, i) => s + i.qty, 0);
    const retailers    = new Set(periodOrders.map(o => o.retailer)).size;
    const pending      = periodOrders.filter(o => o.paymentStatus === "pending").length;

    // Type breakdown
    const typeMap: Record<string,number> = {};
    for (const o of periodOrders)
      for (const it of o.items)
        typeMap[it.type] = (typeMap[it.type] ?? 0) + it.qty;
    const typeTotal = Object.values(typeMap).reduce((a,b)=>a+b,0) || 1;
    const typeBreakdown = Object.entries(typeMap)
      .map(([type, units]) => ({ type, units, pct: Math.round(units/typeTotal*100), color: typeColors[type] ?? "#888" }))
      .sort((a,b) => b.units - a.units);

    // Brand breakdown
    const brandMap: Record<string,{units:number;revenue:number}> = {};
    for (const o of periodOrders)
      for (const it of o.items) {
        const b = /^(Gas Daddy|Slumber Party|Joker|FX|Halle Berry|Lemon Cherry Soap|Abracadabra|Sunset|67)/.test(it.name)
          ? "BLK Edition" : "AllDay Cannabis";
        if (!brandMap[b]) brandMap[b] = { units:0, revenue:0 };
        brandMap[b].units   += it.qty;
        brandMap[b].revenue += it.qty * it.unitPrice;
      }

    // Top products
    const prodMap: Record<string,{type:string;units:number;revenue:number}> = {};
    for (const o of periodOrders)
      for (const it of o.items) {
        if (!prodMap[it.name]) prodMap[it.name] = { type: it.type, units:0, revenue:0 };
        prodMap[it.name].units   += it.qty;
        prodMap[it.name].revenue += it.qty * it.unitPrice;
      }
    const topProducts = Object.entries(prodMap)
      .map(([name, d]) => ({ name, ...d }))
      .sort((a,b) => b.units - a.units)
      .slice(0, 6);

    return { totalRevenue, totalOrders, totalUnits, retailers, pending, typeBreakdown, brandMap, topProducts };
  }, [periodOrders]);

  // Bar chart: all-time monthly data for trend context (not filtered to selected month)
  const allMonthlyData = useMemo(() => {
    const monthlyMap: Record<string,{revenue:number;orders:number}> = {};
    for (const o of orders) {
      const m = o.submitted.slice(0, 7);
      if (!monthlyMap[m]) monthlyMap[m] = { revenue:0, orders:0 };
      monthlyMap[m].orders += 1;
      if (o.paymentStatus === "paid") monthlyMap[m].revenue += calcTotals(o.items).total;
    }
    return Object.entries(monthlyMap)
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([key, d]) => ({
        month: MONTH_NAMES[parseInt(key.slice(5,7))-1].slice(0,3),
        ...d,
      }));
  }, [orders]);

  const chartData = isDemo
    ? DEMO_MONTHLY
    : allMonthlyData.length
      ? allMonthlyData
      : [{ month: MONTH_NAMES[new Date().getMonth()].slice(0,3), revenue: 0, orders: 0 }];

  const recentOrders = [...periodOrders]
    .sort((a,b) => b.submitted.localeCompare(a.submitted))
    .slice(0, 5);

  const statusColor: Record<string,string> = {
    pending: "#fbbf24", paid: "#4ade80", declined: "#f87171",
  };

  const kpiRevenue = isDemo ? 47600         : stats.totalRevenue;
  const kpiOrders  = isDemo ? 122           : stats.totalOrders;
  const kpiUnits   = isDemo ? 1840          : stats.totalUnits;
  const kpiRetail  = isDemo ? 14            : stats.retailers;
  const kpiPending = isDemo ? 3             : stats.pending;

  const selStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer",
    background: active ? "#00f6ff" : "rgba(255,255,255,0.06)",
    color: active ? "#000" : "rgba(255,255,255,0.45)",
    fontSize: 12, fontWeight: 700,
  });

  const selectedLabel = isDemo ? "Demo" : (MONTH_OPTIONS.find(o => o.value === period)?.label ?? period);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Period selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <select value={period} onChange={e => setPeriod(e.target.value)} style={{
            background: "#111", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700,
            padding: "9px 36px 9px 14px", outline: "none", cursor: "pointer",
            appearance: "none", minWidth: 200,
          }}>
            <option value="test">⭐ Test Month (Demo)</option>
            {MONTH_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
        </div>

        {isDemo ? (
          <span style={{ color:"#fbbf24", fontSize:12, fontWeight:700, background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.3)", padding:"4px 10px", borderRadius:6 }}>
            Demo mode — sample data for client presentation
          </span>
        ) : (
          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>
            Showing real data for <strong style={{ color:"#fff" }}>{selectedLabel}</strong>
            {stats.totalOrders === 0 && " — no orders recorded yet"}
          </span>
        )}
      </div>

      {/* KPI cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        {[
          { label:"Revenue",         val:`$${kpiRevenue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`, sub: isDemo ? "Paid orders" : "Paid orders this period", Icon:DollarSign },
          { label:"Orders",          val:String(kpiOrders),  sub:`${kpiPending} pending payment`, Icon:ShoppingCart },
          { label:"Units Sold",      val:String(kpiUnits),   sub:"Across all SKUs",               Icon:Package },
          { label:"Active Retailers",val:String(kpiRetail),  sub:"Placed orders this period",     Icon:Users },
        ].map(({ label, val, sub, Icon }) => (
          <div key={label} style={{ background:"#111", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"22px 20px" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"rgba(0,246,255,0.08)", border:"1px solid rgba(0,246,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={18} color="#00f6ff" strokeWidth={1.75} />
              </div>
              {isDemo && (
                <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, fontWeight:700, color:"#4ade80" }}>
                  <TrendingUp size={12}/> +7.9%
                </span>
              )}
            </div>
            <p style={{ margin:"0 0 4px", color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</p>
            <p style={{ margin:"0 0 4px", color:"#fff", fontSize:"clamp(22px,3vw,32px)", fontWeight:800 }}>{val}</p>
            <p style={{ margin:0, color:"rgba(255,255,255,0.35)", fontSize:12 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + type breakdown */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16 }}>
        <div style={{ background:"#111", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"24px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <h3 style={{ margin:0, color:"#fff", fontSize:15, fontWeight:700 }}>
              Monthly Trend
              {isDemo && <span style={{ color:"#fbbf24", fontSize:11, fontWeight:600, marginLeft:8 }}>(demo)</span>}
            </h3>
            <div style={{ display:"flex", gap:4 }}>
              {(["revenue","orders"] as const).map(m => (
                <button key={m} onClick={()=>setMetric(m)} style={selStyle(metric===m)}>{m}</button>
              ))}
            </div>
          </div>
          {chartData.length === 0 || (chartData.length === 1 && chartData[0].revenue === 0 && chartData[0].orders === 0) ? (
            <div style={{ height:140, display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.25)", fontSize:13 }}>
              No orders recorded yet
            </div>
          ) : (
            <BarChart data={chartData} metric={metric} />
          )}
        </div>

        <div style={{ background:"#111", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"24px 20px" }}>
          <h3 style={{ margin:"0 0 16px", color:"#fff", fontSize:15, fontWeight:700 }}>Type Breakdown</h3>
          {(() => {
            const segs = isDemo
              ? [{ type:"Indica",pct:38,units:699,color:"#a78bfa" },{ type:"Sativa",pct:31,units:570,color:"#4ade80" },{ type:"Hybrid",pct:28,units:515,color:"#60a5fa" },{ type:"CBD",pct:3,units:56,color:"#fbbf24" }]
              : stats.typeBreakdown;
            if (!isDemo && segs.length === 0)
              return <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13, textAlign:"center", marginTop:40 }}>No data for this period</p>;
            return (
              <>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
                  <DonutChart segments={segs} />
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {segs.map(({ type, units, pct, color }) => (
                    <div key={type} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:9, height:9, borderRadius:"50%", background:color, flexShrink:0 }}/>
                      <span style={{ color:"rgba(255,255,255,0.6)", fontSize:13, flex:1 }}>{type}</span>
                      <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>{units} units</span>
                      <span style={{ color, fontSize:12, fontWeight:700, minWidth:32, textAlign:"right" }}>{pct}%</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Brand comparison + top products */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:"#111", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"24px 20px" }}>
          <h3 style={{ margin:"0 0 20px", color:"#fff", fontSize:15, fontWeight:700 }}>Brand Comparison</h3>
          {(() => {
            const brands = isDemo
              ? [{ brand:"AllDay Cannabis",units:1120,revenue:14532,color:"#00f6ff" },{ brand:"BLK Edition",units:720,revenue:12068,color:"#a78bfa" }]
              : Object.entries(stats.brandMap).map(([brand,d]) => ({ brand, ...d, color: brand==="BLK Edition"?"#a78bfa":"#00f6ff" }));
            if (!isDemo && brands.length === 0)
              return <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13, textAlign:"center", marginTop:20 }}>No data for this period</p>;
            const maxU = Math.max(...brands.map(b=>b.units), 1);
            return brands.map(({ brand, units, revenue, color }) => (
              <div key={brand} style={{ marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ color:"#fff", fontSize:13, fontWeight:700 }}>{brand}</span>
                  <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>{units} units · ${revenue.toFixed(0)}</span>
                </div>
                <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:999, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(units/maxU)*100}%`, background:color, borderRadius:999, transition:"width 0.4s ease" }}/>
                </div>
              </div>
            ));
          })()}
        </div>

        <div style={{ background:"#111", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"24px 20px" }}>
          <h3 style={{ margin:"0 0 16px", color:"#fff", fontSize:15, fontWeight:700 }}>Top Products by Units</h3>
          {(() => {
            const prods = isDemo
              ? [
                  { name:"Gas Daddy",     type:"Indica", units:148, revenue:2368 },
                  { name:"Jelly Bean",    type:"Indica", units:132, revenue:1662 },
                  { name:"Dream Catcher", type:"Sativa", units:118, revenue:1574 },
                  { name:"Joker",         type:"Hybrid", units:105, revenue:1838 },
                  { name:"Hippie Vibes",  type:"Sativa", units: 98, revenue:1330 },
                  { name:"Slumber Party", type:"Indica", units: 91, revenue:1502 },
                ]
              : stats.topProducts;
            if (!isDemo && prods.length === 0)
              return <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13, textAlign:"center", marginTop:20 }}>No data for this period</p>;
            return (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {prods.map(({ name, type, units, revenue }, i) => (
                  <div key={name} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ color:"rgba(255,255,255,0.25)", fontSize:12, fontWeight:700, minWidth:18, textAlign:"right" }}>{i+1}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ margin:0, color:"#fff", fontSize:13, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{name}</p>
                    </div>
                    <span style={{ background:typeColors[type]??"#888", color:"#000", fontSize:9, fontWeight:800, padding:"2px 7px", borderRadius:999, textTransform:"uppercase" }}>{type}</span>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ margin:0, color:"#fff", fontSize:13, fontWeight:700 }}>{units}</p>
                      <p style={{ margin:0, color:"rgba(255,255,255,0.35)", fontSize:11 }}>${revenue.toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ background:"#111", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"24px 20px" }}>
        <h3 style={{ margin:"0 0 16px", color:"#fff", fontSize:15, fontWeight:700 }}>
          {isDemo ? "Recent Orders" : `Orders in ${selectedLabel}`}
        </h3>
        {recentOrders.length === 0 ? (
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13, textAlign:"center", padding:"24px 0" }}>No orders for this period</p>
        ) : (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"110px 1fr 130px 100px 140px", gap:12, padding:"8px 12px",
              color:"rgba(255,255,255,0.3)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>
              <span>Order</span><span>Retailer</span><span>Date</span><span>Total</span><span>Status</span>
            </div>
            {recentOrders.map(o => (
              <div key={o.id} style={{ display:"grid", gridTemplateColumns:"110px 1fr 130px 100px 140px", gap:12,
                padding:"12px", borderTop:"1px solid rgba(255,255,255,0.05)", alignItems:"center" }}>
                <span style={{ color:"#00f6ff", fontSize:12, fontFamily:"monospace", fontWeight:700 }}>{o.orderNumber}</span>
                <span style={{ color:"#fff", fontSize:13, fontWeight:600 }}>{o.retailer}</span>
                <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>{o.submitted.split(" ")[0]}</span>
                <span style={{ color:"#fff", fontSize:13, fontWeight:700 }}>${calcTotals(o.items).total.toFixed(2)}</span>
                <span style={{
                  display:"inline-flex", alignItems:"center", gap:5,
                  background:`${statusColor[o.paymentStatus]}18`, color:statusColor[o.paymentStatus],
                  fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:999, textTransform:"capitalize",
                }}>{o.paymentStatus}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
