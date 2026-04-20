import React, { useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, Activity, Search, SlidersHorizontal, Star, Flame, Zap, BarChart2 } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

const formatCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0)
const fmtPct = (p) => (p >= 0 ? '+' : '') + (p || 0).toFixed(2) + '%'

const INFO = {
  'BTC/USDT': { name: 'Bitcoin', vol: '$42.5B', cap: '$1.2T' },
  'ETH/USDT': { name: 'Ethereum', vol: '$18.2B', cap: '$420B' },
  'SOL/USDT': { name: 'Solana', vol: '$4.1B', cap: '$65B' },
  'XRP/USDT': { name: 'Ripple', vol: '$1.5B', cap: '$33B' },
  'ADA/USDT': { name: 'Cardano', vol: '$800M', cap: '$20B' },
}

export default function Market() {
  const prices = useSelector((s) => s.market.prices)
  const prev = useSelector((s) => s.market.previousPrices)
  const history = useSelector((s) => s.market.priceHistory)
  const navigate = useNavigate()

  // High-Performance Cursor Mask Tracking
  const containerRef = useRef(null)
  
  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    containerRef.current.style.setProperty('--mouse-x', `${x}px`)
    containerRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  const symbols = useMemo(() => Object.entries(prices).map(([sym, price]) => {
    const p = prev[sym]
    const chPct = p ? ((price - p) / p) * 100 : 0
    const info = INFO[sym] || { name: sym.split('/')[0], vol: '$1.0B', cap: '$10B' }
    return { sym, price, chPct, ...info, history: history[sym] || [] }
  }), [prices, prev, history])

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden font-sans pb-16" 
      onMouseMove={handleMouseMove}
      style={{ '--mouse-x': '-1000px', '--mouse-y': '-1000px' }}
    >
      {/* Background Masking System - Emerald Green Institutional Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 min-h-screen" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div className="fixed inset-0 pointer-events-none z-0 min-h-screen" style={{ backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`, backgroundSize: '60px 60px', maskImage: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), black, transparent)`, WebkitMaskImage: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), black, transparent)` }} />
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-screen min-h-screen" style={{ background: `radial-gradient(1000px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.08), transparent 50%)` }} />

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-8 pt-6 pb-12 px-4 md:px-6 anim-fade font-sans">
        
        {/* Massive 3D Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8 relative">
           <div className="absolute left-0 top-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-[80px] pointer-events-none" />
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                 <div className="px-2.5 py-1 rounded-md bg-[#10B981]/10 border border-[#10B981]/30 flex items-center gap-2">
                    <Activity size={12} className="text-[#10B981]" />
                    <span className="text-[10px] uppercase font-bold text-[#10B981] tracking-widest">Real-time Trading Matrix</span>
                 </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white drop-shadow-md">
                 Market Heatmap
              </h1>
              <p className="text-[14px] text-zinc-500 font-medium mt-2">Live price action and institutional liquidity volume.</p>
           </div>
          
           <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
             <div className="relative flex-1 md:w-[320px]">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10B981]" size={18} />
               <input type="text" placeholder="Search pairs or contract addresses..." className="w-full bg-[rgba(0,0,0,0.6)] backdrop-blur-md border border-[#10B981]/30 rounded-2xl pl-12 pr-4 py-3.5 text-[14px] font-bold text-white placeholder-zinc-600 focus:outline-none focus:border-[#10B981] transition-all shadow-[0_0_30px_rgba(16,185,129,0.1)]" />
             </div>
             <button className="h-[52px] w-[52px] flex items-center justify-center rounded-2xl bg-[rgba(10,10,12,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-zinc-400 hover:text-[#10B981] hover:border-[#10B981]/50 transition-all flex-shrink-0 shadow-lg">
               <SlidersHorizontal size={20} />
             </button>
           </div>
        </div>

        {/* Global Market Mini-Widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 w-full anim-fade-2">
          {[
            { label: 'Total 24h Volume', value: '$124.8B', change: '+14.2%', icon: BarChart2, color: 'text-[#10B981]' },
            { label: 'Global Market Cap', value: '$2.8T', change: '+2.1%', icon: Activity, color: 'text-[#10B981]' },
            { label: 'Top Gainer', value: 'SOL', change: '+18.4%', icon: Flame, color: 'text-[#F59E0B]' },
            { label: 'BTC Dominance', value: '48.9%', change: '-0.4%', icon: Zap, color: 'text-rose-500' },
          ].map((stat, i) => (
            <div key={i} className="relative overflow-hidden rounded-[24px] p-6 flex flex-col justify-between border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.8)] backdrop-blur-3xl shadow-xl hover:border-[#10B981]/30 transition-all group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-[30px] group-hover:bg-[#10B981]/10 transition-colors pointer-events-none" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                 <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                 <stat.icon size={16} className={`${stat.color}`} />
              </div>
              <div className="relative z-10 flex items-end justify-between mt-1">
                <span className="text-[26px] font-black tracking-tighter text-white drop-shadow-md">{stat.value}</span>
                <span className={`text-[12px] font-bold px-2 py-1 rounded bg-black/40 ${stat.change.startsWith('+') ? 'text-[#10B981]' : 'text-rose-500'}`}>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Data Table */}
        <div className="rounded-[32px] overflow-hidden border border-[#10B981]/20 mt-8 anim-fade-3 bg-[rgba(10,10,12,0.8)] backdrop-blur-3xl shadow-[0_0_50px_rgba(16,185,129,0.05)]">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[rgba(16,185,129,0.05)] border-b border-[rgba(255,255,255,0.05)]">
                  <th className="py-6 px-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none">Asset / Project</th>
                  <th className="py-6 px-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none text-right">Last Price</th>
                  <th className="py-6 px-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none text-right">24h Change</th>
                  <th className="py-6 px-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none text-center w-[160px]">Action Trend (24H)</th>
                  <th className="py-6 px-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none text-right">Volume</th>
                  <th className="py-6 px-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none text-right">Liquidity Cap</th>
                  <th className="py-6 px-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none text-right w-[140px]">Terminal</th>
                </tr>
              </thead>
              <tbody>
                {symbols.map((s, i) => {
                  const up = s.chPct >= 0;
                  const sparkData = s.history.length > 5 ? s.history : [...s.history, ...Array(15).fill(s.price).map(x => x + (Math.random()-0.5)*(s.price*0.01))];
                  const chartColor = up ? '#10B981' : '#F43F5E';

                  return (
                    <tr key={s.sym} className="border-b border-white/5 last:border-0 hover:bg-[rgba(16,185,129,0.05)] hover:border-[#10B981]/20 transition-all duration-300 group cursor-pointer" onClick={() => navigate(`/trade/${s.sym.split('/')[0]}`)}>
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-4 relative">
                          <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center font-black text-[14px] text-[#10B981] shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#10B981] group-hover:text-black">
                            {s.sym.split('/')[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-extrabold text-white text-[16px] group-hover:text-[#10B981] transition-colors">{s.sym}</span>
                            <span className="text-[13px] text-zinc-500 font-bold">{s.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8 text-right">
                         <span className="font-mono text-[18px] font-black text-white tracking-tighter drop-shadow-sm">{formatCurrency(s.price)}</span>
                      </td>
                      <td className="py-5 px-8 text-right">
                         <div className={`flex items-center justify-end gap-1.5 text-[15px] font-black ${up ? 'text-[#10B981]' : 'text-rose-500'}`}>
                           {up ? <TrendingUp size={18} strokeWidth={3} /> : <TrendingDown size={18} strokeWidth={3} />}
                           {fmtPct(s.chPct)}
                         </div>
                      </td>

                      <td className="py-5 px-8 align-middle">
                        <div className="w-[140px] h-[40px] opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 ml-auto mr-auto">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sparkData.map(v => ({v}))}>
                              <defs>
                                <linearGradient id={`g-${i}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.6}/>
                                  <stop offset="100%" stopColor={chartColor} stopOpacity={0}/>
                                </linearGradient>
                                <filter id="glow">
                                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                  <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                  </feMerge>
                                </filter>
                              </defs>
                              <Area type="monotone" dataKey="v" stroke={chartColor} strokeWidth={2.5} fill={`url(#g-${i})`} isAnimationActive={true} animationDuration={1000} style={{ filter: 'url(#glow)' }} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <span className="text-[15px] font-extrabold text-zinc-300">{s.vol}</span>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <span className="text-[15px] font-extrabold text-zinc-300 drop-shadow-lg">{s.cap}</span>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/trade/${s.sym.split('/')[0]}`); }}
                          className="px-6 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-white/10 text-white text-[13px] font-black uppercase tracking-widest group-hover:bg-[#10B981] group-hover:text-black group-hover:border-[#10B981] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300"
                        >
                          Execute
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            {symbols.length === 0 && (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.02)] flex items-center justify-center mb-5 border border-[rgba(255,255,255,0.05)]">
                  <Activity className="text-zinc-600 animate-pulse" size={28} />
                </div>
                <h3 className="text-white text-[18px] font-bold tracking-tight mb-1">Awaiting Data</h3>
                <p className="text-zinc-500 text-[14px] font-medium max-w-sm">Connect to the WebSocket terminal engine to stream live market pairs.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
