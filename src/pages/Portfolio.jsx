import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPortfolio, setPortfolioLoaded } from '../store/portfolioSlice'
import api from '../api'
import { ArrowUpRight, ArrowDownRight, PieChart, Activity, Wallet, TrendingUp, Search, SlidersHorizontal } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

const formatCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n || 0))
const fmtPct = (p) => {
  const val = Number(p || 0);
  return (val >= 0 ? '+' : '') + val.toFixed(2) + '%'
}

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

// Premium Mock Data for Portfolio Growth Timeline
const growthTimeline = [
  { time: 'Mon', val: 95000 }, { time: 'Tue', val: 96500 }, { time: 'Wed', val: 94200 }, 
  { time: 'Thu', val: 98100 }, { time: 'Fri', val: 102400 }, { time: 'Sat', val: 101000 }, 
  { time: 'Sun', val: 105650 }
]

export default function Portfolio() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((s) => s.user.currentUser)
  const portfolio = useSelector((s) => s.portfolio.portfolio)
  const portfolioLoaded = useSelector((s) => s.portfolio.portfolioLoaded)
  const [loading, setLoading] = useState(!portfolioLoaded)

  // Track mouse with CSS variables to avoid re-render loops in chart-heavy screens.
  const containerRef = useRef(null)
  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    containerRef.current.style.setProperty('--mouse-x', `${x}px`)
    containerRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try { dispatch(setPortfolio(await api.getPortfolio(user.id))) }
      catch (e) { console.error(e) }
      finally {
        dispatch(setPortfolioLoaded(true))
        setLoading(false)
      }
    }
    load()
    const iv = setInterval(load, 5000)
    return () => clearInterval(iv)
  }, [user, dispatch])

  useEffect(() => {
    setLoading(!portfolioLoaded)
  }, [portfolioLoaded])

  const pnl = portfolio?.total_unrealized_pnl || 0
  const pnlUp = pnl >= 0
  const currentVal = portfolio?.total_portfolio_value || 0;

  const displayTimeline = useMemo(() => {
    const data = [...growthTimeline];
    if (currentVal > 0) {
      data[data.length - 1] = { ...data[data.length - 1], val: currentVal };
    }
    return data;
  }, [currentVal]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative bg-[#050505]">
        <Activity className="text-[#06B6D4] animate-spin" size={48} />
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[calc(100vh-60px)] overflow-hidden font-sans pb-16" 
      onMouseMove={handleMouseMove}
      style={{ '--mouse-x': '-1000px', '--mouse-y': '-1000px' }}
    >
      {/* --- Interactive Glowing Grid Background --- */}
      {/* 1. Underlying dim base grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 min-h-screen" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* 2. Intense Cyan Grid revealed by cursor mask */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 min-h-screen" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), black, transparent)`,
          WebkitMaskImage: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), black, transparent)`
        }}
      />
      {/* 3. Soft ambient spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 mix-blend-screen min-h-screen"
        style={{
          background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(6, 182, 212, 0.08), transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-8 pt-6 px-6 anim-fade">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 anim-fade-1">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">My Portfolio</h1>
            <div className="flex items-center gap-4 text-sm font-medium text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse shadow-[0_0_8px_#06B6D4]" />
                Balances Synced
              </div>
              <span className="text-[#333] border-l border-[#333] pl-4">{portfolio?.holdings?.length || 0} Assets</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input type="text" placeholder="Search holdings..." className="w-full bg-[rgba(10,10,12,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#06B6D4] transition-all shadow-lg" />
            </div>
            <button className="h-[46px] w-[46px] flex items-center justify-center rounded-xl bg-[rgba(10,10,12,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-zinc-400 hover:text-white transition-all flex-shrink-0 shadow-lg hover:border-[#333]">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Global Stats & Premium Chart Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 w-full anim-fade-2">
          
          {/* Main Portfolio Balance Card */}
          <div className="lg:col-span-4 relative overflow-hidden rounded-[24px] p-8 flex flex-col border border-[rgba(255,255,255,0.05)] bg-[rgba(20,20,22,0.7)] backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] group hover:border-[rgba(6,182,212,0.3)] transition-colors duration-500">
             <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-150" style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
             
             <div className="flex items-center justify-between mb-4">
               <span className="text-[12px] font-extrabold text-[#A1A1AA] uppercase tracking-widest flex items-center gap-2">
                 <Wallet size={16} className="text-[#06B6D4]" /> Estimated Balance
               </span>
             </div>
             
             <div className="mb-8">
               <span className="text-[44px] font-black tracking-tight text-white leading-none drop-shadow-lg block">
                 {formatCurrency(portfolio?.total_portfolio_value)}
               </span>
               <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[13px] font-bold tracking-wide border ${pnlUp ? 'bg-[rgba(52,211,153,0.1)] text-[#34D399] border-[#34D399]/30 drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]' : 'bg-[rgba(244,63,94,0.1)] text-rose-500 border-rose-500/30 drop-shadow-[0_0_8px_rgba(244,63,94,0.2)]'}`}>
                 {pnlUp ? <ArrowUpRight size={16} strokeWidth={3} /> : <ArrowDownRight size={16} strokeWidth={3} />}
                 {pnlUp ? '+' : ''}{formatCurrency(pnl)} ({fmtPct(portfolio?.total_pnl_percentage)})
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4 pt-5 mt-auto border-t border-[rgba(255,255,255,0.05)]">
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-widest mb-1.5">Invested</p>
                  <p className="text-[15px] font-bold mono text-zinc-200">{formatCurrency(portfolio?.total_invested)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-widest mb-1.5">Available Cash</p>
                  <p className="text-[15px] font-bold mono text-zinc-200">{formatCurrency(portfolio?.wallet_balance)}</p>
                </div>
             </div>
          </div>

          {/* Portfolio Growth Timeline Chart */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.8)] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-6 flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-extrabold text-[#A1A1AA] uppercase tracking-widest flex items-center gap-2 select-none">
                  <TrendingUp size={16} className="text-[#06B6D4]" />
                  7D Portfolio Growth
                </h3>
             </div>
             <div className="flex-1 w-full relative z-10 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayTimeline}>
                    <defs>
                      <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.5}/>
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity={0}/>
                      </linearGradient>
                      <filter id="cyanGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <RechartsTooltip 
                      formatter={(val) => [formatCurrency(val), "Value"]}
                      contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="val" stroke="#06B6D4" strokeWidth={3} fill="url(#cyanGrad)" isAnimationActive={false} style={{ filter: 'url(#cyanGlow)' }} activeDot={{ r: 6, fill: '#fff', stroke: '#06B6D4', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="rounded-[24px] overflow-hidden border border-[rgba(255,255,255,0.05)] mt-8 anim-fade-3 bg-[rgba(10,10,12,0.8)] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)]">
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none">Asset</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none text-right">Quantity</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none text-right">Average Price</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none text-right">Market Price</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none text-right">Invested</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none text-right">Current Value</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none text-right">Implied P&L</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none text-center w-[180px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {(!portfolio?.holdings?.length) ? (
                  <tr>
                    <td colSpan="8" className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.02)] flex items-center justify-center mb-5 border border-[rgba(255,255,255,0.05)]">
                          <PieChart className="text-zinc-600 animate-pulse" size={28} />
                        </div>
                        <h3 className="text-white text-[18px] font-bold tracking-tight mb-1">No Holdings Yet</h3>
                        <p className="text-zinc-500 text-[14px] font-medium max-w-sm mb-4">Start trading to build up your digital asset portfolio.</p>
                        <button onClick={() => navigate('/trade')} className="px-6 py-2.5 rounded-xl bg-[#06B6D4]/10 text-[#06B6D4] font-extrabold text-[14px] hover:bg-[#06B6D4] hover:text-black transition-colors shadow-lg">Start Trading</button>
                      </div>
                    </td>
                  </tr>
                ) : portfolio.holdings.map(h => {
                  const hUp = h.unrealized_pnl >= 0;
                  return (
                    <tr key={h.symbol} className="border-b border-[rgba(255,255,255,0.02)] last:border-0 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-300 group">
                      <td className="py-4 px-6 md:py-5">
                        <div className="flex items-center gap-3 relative">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110 border ${getCoinColor(h.symbol)}`}>
                            {h.symbol.split('/')[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-extrabold text-white text-[15px] tracking-wide group-hover:text-[#06B6D4] transition-colors">{h.symbol}</span>
                            <span className="text-[12px] text-zinc-500 font-medium">Digital Asset</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-mono text-[15px] font-bold text-white shadow-sm">{h.quantity}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-mono text-[14px] font-semibold text-zinc-400">{formatCurrency(h.average_price)}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-mono text-[14px] font-semibold text-zinc-200">{formatCurrency(h.current_price)}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-mono text-[14px] font-medium text-zinc-500">{formatCurrency(h.total_invested)}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                         <span className="font-mono text-[16px] font-black text-white tracking-tight drop-shadow-sm">{formatCurrency(h.current_value)}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className={`flex flex-col items-end justify-center ${hUp ? 'text-[#34D399] drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]'}`}>
                          <span className="mono font-black text-[15px] tracking-tight">{hUp ? '+' : ''}{formatCurrency(h.unrealized_pnl)}</span>
                          <span className="text-[12px] font-bold">{fmtPct(h.pnl_percentage)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => navigate(`/trade/${h.symbol.replace('/','-')}`)} className="px-4 py-2 rounded-xl bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.2)] text-[#34D399] text-[12px] font-extrabold hover:bg-[#10B981] hover:text-black hover:border-[#10B981] transition-all shadow-md">BUY</button>
                          <button onClick={() => navigate(`/trade/${h.symbol.replace('/','-')}`)} className="px-4 py-2 rounded-xl bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.2)] text-rose-500 text-[12px] font-extrabold hover:bg-[#EF4444] hover:text-white hover:border-[#EF4444] transition-all shadow-md">SELL</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
