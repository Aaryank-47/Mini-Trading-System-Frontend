import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { setPortfolio, addOrder } from "../store/portfolioSlice";
import api from "../api";
import toast from "react-hot-toast";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Zap,
  Crosshair,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  YAxis,
} from "recharts";

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(n || 0),
  );
const fmtPct = (p) => {
  const val = Number(p || 0);
  return (val >= 0 ? "+" : "") + val.toFixed(2) + "%";
};

const getCoinColor = (sym) => {
  if (!sym) return 'bg-[#333] text-white border-[#444]';
  const base = sym.split('/')[0];
  const colors = {
    BTC: 'bg-[#F7931A] text-white border-[#F7931A]',
    ETH: 'bg-[#627EEA] text-white border-[#627EEA]',
    SOL: 'bg-[#14F195] text-black border-[#14F195]',
    XRP: 'bg-[#23292F] text-white border-[#23292F]',
    ADA: 'bg-[#0033AD] text-white border-[#0033AD]',
  };
  const fallbackColors = [
    'bg-[#EF4444] text-white border-[#EF4444]',
    'bg-[#3B82F6] text-white border-[#3B82F6]',
    'bg-[#10B981] text-white border-[#10B981]',
    'bg-[#F59E0B] text-white border-[#F59E0B]',
    'bg-[#8B5CF6] text-white border-[#8B5CF6]',
    'bg-[#EC4899] text-white border-[#EC4899]',
    'bg-[#06B6D4] text-white border-[#06B6D4]',
  ];
  if (colors[base]) return colors[base];
  const hash = base.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackColors[hash % fallbackColors.length];
};

// Generate an aggressive volatile mock intraday chart based on the selected price
const generateIntradayData = (basePrice) => {
  if (!basePrice) return [];
  let current = basePrice * 0.95; // start lower
  const data = [];
  for (let i = 0; i < 40; i++) {
    current = current + (Math.random() - 0.45) * (basePrice * 0.005);
    data.push({ time: `10:${i < 10 ? "0" + i : i}`, price: current });
  }
  data.push({ time: "Live", price: basePrice }); // End on actual live price
  return data;
};

export default function Trade() {
  const { symbol: routeSymbol } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.currentUser);
  const prices = useSelector((s) => s.market.prices);
  const symbolNames = useSelector((s) => s.market.symbolNames);
  const prev = useSelector((s) => s.market.previousPrices);
  const portfolio = useSelector((s) => s.portfolio.portfolio);

  const symbols = Object.keys(prices);
  const [sel, setSel] = useState(
    routeSymbol?.toUpperCase() || symbols[0] || "SBIN",
  );
  const [side, setSide] = useState("BUY");
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  // Track mouse with CSS variables to avoid re-render loops in chart-heavy screens.
  const containerRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    if (routeSymbol) setSel(routeSymbol.toUpperCase());
  }, [routeSymbol]);
  useEffect(() => {
    if (user)
      api
        .getPortfolio(user.id)
        .then((d) => dispatch(setPortfolio(d)))
        .catch(() => {});
  }, [user, dispatch]);

  const price = prices[sel] || 0;
  const pPrev = prev[sel];
  const ch = pPrev ? ((price - pPrev) / pPrev) * 100 : 0;
  const up = ch >= 0;

  const intradayData = useMemo(() => generateIntradayData(price), [sel, pPrev]);

  const q = Math.floor(Number(qty) || 0);
  const total = q * price;
  const hold = portfolio?.holdings?.find((h) => h.symbol === sel);
  const wallet = portfolio?.wallet_balance || 0;
  const hasValidPrice = Number(price) > 0;
  const canBuy = side === "BUY" && hasValidPrice && q > 0 && total <= wallet;
  const canSell = side === "SELL" && hasValidPrice && q > 0 && hold && q <= hold.quantity;
  const ok = side === "BUY" ? canBuy : canSell;
  const displayName = symbolNames[sel] || sel;

  const submit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    if (!hasValidPrice) {
      toast.error("Live price is unavailable right now. Please wait for market feed to recover.");
      return;
    }
    if (!ok || !user) return;
    submittingRef.current = true;
    setLoading(true);
    let orderPlaced = false;
    try {
      const order = await api.placeOrder({
        user_id: user.id,
        symbol: sel,
        qty: q,
        side,
      });
      orderPlaced = true;
      dispatch(addOrder({ ...order, symbol_name: symbolNames[sel] || sel }));
      toast.success(`${side} ${q} × ${displayName} (${sel}) @ ${formatCurrency(order.price)}`);
      setQty("");
    } catch (err) {
      const message = err?.response?.data?.detail || err?.message || "Order placement failed";
      toast.error(message);
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }

    // Refresh portfolio in background so the trade button unlocks immediately.
    if (orderPlaced) {
      void api
        .getPortfolio(user.id)
        .then((data) => dispatch(setPortfolio(data)))
        .catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[calc(100vh-60px)] overflow-hidden font-sans pb-16"
      onMouseMove={handleMouseMove}
      style={{ '--mouse-x': '-1000px', '--mouse-y': '-1000px' }}
    >
      {/* 1. Underlying dim base grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 min-h-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {/* 2. Intense Amber Grid revealed by cursor mask */}
      <div
        className="fixed inset-0 pointer-events-none z-0 min-h-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(245, 158, 11, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(245, 158, 11, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), black, transparent)`,
          WebkitMaskImage: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), black, transparent)`,
        }}
      />
      {/* 3. Soft ambient spotlight */}
      <div
        className="fixed inset-0 pointer-events-none z-0 mix-blend-screen min-h-screen"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(245, 158, 11, 0.08), transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-6 pt-6 px-4 md:px-6 anim-fade">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">
              Execution Deck
            </h1>
            <p className="text-[14px] text-zinc-400 font-medium tracking-wide">
              Direct access to institutional liquidity pools
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#F59E0B]">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse shadow-[0_0_8px_#F59E0B]" />
            System Online
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-col-reverse lg:flex-row pt-4">
          {/* Main Trading Area - Center for mobile, Middle for desktop */}
          <div className="lg:col-span-6 lg:order-2 order-1 space-y-6">
            {/* Live Chart Header */}
            <div className="relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.8)] backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col group transition-colors hover:border-[#F59E0B]/30">
              <div
                className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #F59E0B, transparent)",
                  transform: "translate(30%, -30%)",
                }}
              />

              <div className="flex flex-col p-6 md:p-8 border-b border-[rgba(255,255,255,0.05)] relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-[18px] shadow-lg border ${getCoinColor(sel)}`}
                    >
                      {sel}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-[28px] font-black tracking-tight text-white drop-shadow-md">
                          {sel}
                        </h2>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded bg-[rgba(255,255,255,0.1)] text-zinc-300 tracking-widest border border-[rgba(255,255,255,0.05)]">
                          Spot
                        </span>
                      </div>
                      <p className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                        {displayName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-[32px] sm:text-[38px] leading-none font-black mono tracking-tight drop-shadow-sm ${up ? "text-[#34D399]" : "text-rose-500"}`}
                    >
                      {formatCurrency(price)}
                    </p>
                    <div
                      className={`flex items-center justify-end gap-1.5 mt-2 text-[15px] font-bold ${up ? "text-[#34D399] drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" : "text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"}`}
                    >
                      {up ? (
                        <TrendingUp size={18} strokeWidth={3} />
                      ) : (
                        <TrendingDown size={18} strokeWidth={3} />
                      )}
                      {fmtPct(ch)}
                    </div>
                    </div>
                </div>
              </div>

              {/* Advanced Recharts Injection */}
              <div className="w-full h-[220px] relative z-10 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={intradayData}>
                    <defs>
                      <linearGradient
                        id="chartGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={up ? "#34D399" : "#EF4444"}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor={up ? "#34D399" : "#EF4444"}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <filter id="chartGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <RechartsTooltip
                      formatter={(val) => [formatCurrency(val), "Price"]}
                      contentStyle={{
                        backgroundColor: "#0A0A0A",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#fff", fontWeight: "bold" }}
                    />
                    <YAxis
                      type="number"
                      domain={["auto", "auto"]}
                      hide={true}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={up ? "#34D399" : "#EF4444"}
                      strokeWidth={3}
                      fill="url(#chartGrad)"
                      isAnimationActive={false}
                      style={{ filter: "url(#chartGlow)" }}
                      activeDot={{
                        r: 6,
                        fill: "#fff",
                        stroke: up ? "#34D399" : "#EF4444",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Premium Trading Form */}
            <div className="relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.8)] backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-6 md:p-8">
              {/* BUY/SELL Toggle */}
              <div className="flex bg-[rgba(0,0,0,0.4)] rounded-xl p-1 mb-8 shadow-inner border border-[rgba(255,255,255,0.02)]">
                {["BUY", "SELL"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSide(s)}
                    className="flex-1 py-3 sm:py-4 rounded-[10px] text-[14px] font-black uppercase tracking-widest transition-all duration-300"
                    style={{
                      background:
                        side === s
                          ? s === "BUY"
                            ? "#10B981"
                            : "#EF4444"
                          : "transparent",
                      color: side === s ? "#000" : "#A1A1AA",
                      boxShadow:
                        side === s
                          ? s === "BUY"
                            ? "0 0 20px rgba(16, 185, 129, 0.4)"
                            : "0 0 20px rgba(239, 68, 68, 0.4)"
                          : "none",
                    }}
                  >
                    {s} Position
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="relative z-10">
                {/* Quantity Input */}
                <div className="mb-6 group">
                  <label className="block text-[12px] font-bold text-zinc-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <Crosshair size={14} className="text-[#F59E0B]" /> Execution
                    Quantity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-5 text-[24px] sm:text-[32px] font-black mono text-white placeholder-zinc-700 focus:outline-none focus:border-[#F59E0B]/50 transition-all shadow-inner [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                      {["1", "10", "MAX"].map((n) => {
                        return (
                          <button
                            key={n}
                            type="button"
                            onClick={() => {
                              if (n === "MAX") {
                                if (side === "BUY")
                                  setQty(String((wallet / price).toFixed(4)));
                                if (side === "SELL")
                                  setQty(String(hold?.quantity || 0));
                              } else {
                                setQty(
                                  String(parseFloat(qty || 0) + parseFloat(n)),
                                );
                              }
                            }}
                            className="px-3 sm:px-4 py-2 rounded-xl text-[11px] font-black text-zinc-400 uppercase bg-[rgba(255,255,255,0.05)] hover:text-black hover:bg-[#F59E0B] transition-colors border border-[rgba(255,255,255,0.05)] shadow-md"
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Live Order Summary */}
                <div className="rounded-xl p-5 mb-8 space-y-4 bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.03)] backdrop-blur-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest">
                      Routing
                    </span>
                    <span className="text-[13px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                      <Zap
                        size={14}
                        className="text-[#F59E0B] fill-[#F59E0B]"
                      />{" "}
                      Direct Market
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest">
                      Slippage
                    </span>
                    <span className="mono text-[14px] font-semibold text-zinc-300">
                      0.05%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[rgba(255,255,255,0.05)]">
                    <span className="text-[15px] font-black text-[#F59E0B] uppercase tracking-widest drop-shadow-md">
                      Notional Value
                    </span>
                    <span className="mono text-[22px] font-black tracking-tight text-white drop-shadow-sm">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Validation Warnings */}
                {side === "BUY" && q > 0 && total > wallet && (
                  <div className="flex items-center gap-3 text-[13px] font-bold text-rose-500 mb-6 p-4 rounded-xl bg-[rgba(244,63,94,0.1)] border border-rose-500/20 shadow-inner">
                    <AlertCircle size={18} className="flex-shrink-0" />{" "}
                    Insufficient funds. Need {formatCurrency(total - wallet)}{" "}
                    more.
                  </div>
                )}
                {side === "SELL" && q > 0 && (!hold || q > hold.quantity) && (
                  <div className="flex items-center gap-3 text-[13px] font-bold text-rose-500 mb-6 p-4 rounded-xl bg-[rgba(244,63,94,0.1)] border border-rose-500/20 shadow-inner">
                    <AlertCircle size={18} className="flex-shrink-0" /> Invalid
                    quantity. Holding {hold?.quantity || 0} shares.
                  </div>
                )}

                {/* Submit Trigger Actions */}
                <button
                  type="submit"
                  disabled={!ok || loading}
                  className={`w-full py-5 rounded-2xl font-black text-[16px] uppercase tracking-widest transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center gap-3 cursor-pointer ${
                    !ok
                      ? "bg-[rgba(255,255,255,0.05)] text-zinc-600 border border-[rgba(255,255,255,0.1)]"
                      : side === "BUY"
                        ? "bg-[#10B981] text-black hover:bg-[#34D399] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
                        : "bg-[#EF4444] text-white hover:bg-[#F87171] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                  }`}
                >
                  {loading ? (
                    <>
                      <Activity size={20} className="animate-spin" /> Processing
                      Transaction...
                    </>
                  ) : (
                    <>CONFIRM {side} ORDER</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Instruments Library - Left for desktop, bottom for mobile */}
          <div className="lg:col-span-3 lg:order-1 order-2 space-y-6">
            <div className="relative overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.8)] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col h-[650px] lg:h-auto">
              <div className="p-5 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]">
                <span className="text-[12px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-[#F59E0B]" /> Market Liquidity
                </span>
              </div>
              <div className="divide-y divide-[rgba(255,255,255,0.02)] overflow-y-auto scrollbar-hide py-2 flex-col">
                {Object.entries(prices).map(([s, p]) => {
                  const c = prev[s] ? ((p - prev[s]) / prev[s]) * 100 : 0;
                  const isUp = c >= 0;
                  const isActive = sel === s;
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setSel(s);
                        navigate(`/trade/${s.replace("/", "-")}`, {
                          replace: true,
                        });
                      }}
                      className="w-full flex items-center justify-between px-5 py-4 transition-all duration-300 text-left group hover:bg-[rgba(255,255,255,0.02)]"
                      style={{
                        background: isActive
                          ? "rgba(245, 158, 11, 0.05)"
                          : "transparent",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {isActive && (
                          <div className="absolute left-0 w-[4px] h-[30px] rounded-r-md bg-[#F59E0B] shadow-[0_0_10px_#F59E0B]" />
                        )}
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] border ${getCoinColor(s)}`}
                        >
                          {s.split("/")[0]}
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`text-[14px] font-black tracking-wide ${isActive ? "text-[#F59E0B] drop-shadow-md" : "text-zinc-200 group-hover:text-white"}`}
                          >
                            {s}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-[13px] font-bold mono text-white">
                          {formatCurrency(p)}
                        </span>
                        <span
                          className={`text-[10px] font-black mono mt-0.5 ${isUp ? "text-[#34D399]" : "text-rose-500"}`}
                        >
                          {isUp ? "+" : ""}
                          {c.toFixed(2)}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Account Metrics - Right for desktop, bottom for mobile */}
          <div className="lg:col-span-3 lg:order-3 order-3 space-y-6">
            {/* Purchasing Power */}
            <div className="relative overflow-hidden rounded-[20px] p-6 border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.8)] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] group hover:border-[#F59E0B]/30 transition-colors">
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10 bg-[#F59E0B] blur-xl pointer-events-none transition-transform duration-700 group-hover:scale-150" />
              <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertCircle size={14} /> Purchasing Power
              </h3>
              <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5">
                Free Margin
              </p>
              <p className="text-[28px] font-black tracking-tight mono text-white drop-shadow-md">
                {formatCurrency(wallet)}
              </p>
            </div>

            {/* Current Position (If holding selected asset) */}
            {hold && (
              <div
                className="relative overflow-hidden rounded-[20px] p-6 border border-[rgba(255,255,255,0.05)] bg-[rgba(20,20,22,0.6)] backdrop-blur-3xl shadow-xl group border-l-[4px]"
                style={{
                  borderLeftColor:
                    hold.unrealized_pnl >= 0 ? "#34D399" : "#EF4444",
                }}
              >
                <div
                  className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full opacity-10 blur-xl pointer-events-none transition-transform duration-700 group-hover:scale-125"
                  style={{
                    background:
                      hold.unrealized_pnl >= 0 ? "#34D399" : "#EF4444",
                  }}
                />

                <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-5 flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.05)]">
                  Active Contract{" "}
                  <span className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.1)] text-white">
                    {sel}
                  </span>
                </h3>

                <div className="space-y-4">
                  {[
                    ["Size", hold.quantity + " Units"],
                    ["Cost Basis", formatCurrency(hold.average_price)],
                    ["Mark Value", formatCurrency(hold.current_value)],
                  ].map(([l, v]) => (
                    <div
                      key={l}
                      className="flex justify-between items-center text-[13px]"
                    >
                      <span className="text-zinc-500 font-bold uppercase tracking-widest text-[11px]">
                        {l}
                      </span>
                      <span className="mono font-black text-zinc-200">{v}</span>
                    </div>
                  ))}

                  <div className="flex justify-between items-end pt-4 mt-2 border-t border-[rgba(255,255,255,0.05)]">
                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[11px]">
                      Unrealized P&L
                    </span>
                    <div className="text-right">
                      <p
                        className={`mono font-black text-[22px] tracking-tight leading-none ${hold.unrealized_pnl >= 0 ? "text-[#34D399] drop-shadow-sm" : "text-rose-500 drop-shadow-sm"}`}
                      >
                        {hold.unrealized_pnl >= 0 ? "+" : ""}
                        {formatCurrency(hold.unrealized_pnl)}
                      </p>
                      <p
                        className={`mono font-black text-[11px] mt-1 ${hold.unrealized_pnl >= 0 ? "text-[#34D399]" : "text-rose-500"}`}
                      >
                        {fmtPct(hold.pnl_percentage)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
