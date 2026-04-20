import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Calendar, List, SlidersHorizontal, Clock, ArrowUpRight, ArrowDownRight, Activity, Wallet, PieChart, TrendingUp, TrendingDown, Eye } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../api'
import { setBalance, setPortfolio } from '../store/portfolioSlice'

const fmtCur = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card px-4 py-3 border border-[rgba(255,255,255,0.1)] shadow-2xl">
        <p className="text-[16px] font-bold text-white mb-1 tracking-tight">
          {fmtCur(payload[0].value)}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <p className="text-[11px] text-[#A1A1AA] font-medium tracking-wide">TICK {payload[0].payload.time}</p>
        </div>
      </div>
    );
  }
  return null;
};

const getCoinColor = (sym) => {
  if (!sym) return 'bg-[rgba(255,255,255,0.05)] text-white border-[rgba(255,255,255,0.1)]';
  const base = sym.split('/')[0];
  const colors = {
    BTC: 'bg-[#F7931A]/10 text-[#F7931A] border-[#F7931A]/30',
    ETH: 'bg-[#627EEA]/10 text-[#627EEA] border-[#627EEA]/30',
    SOL: 'bg-[#14F195]/10 text-[#14F195] border-[#14F195]/30',
    XRP: 'bg-[#00AAE4]/10 text-[#00AAE4] border-[#00AAE4]/30',
    ADA: 'bg-[#0033AD]/10 text-[#8BCAFF] border-[#0033AD]/40',
  };
  return colors[base] || 'bg-[rgba(255,255,255,0.05)] text-white border-[rgba(255,255,255,0.1)]';
};

export default function Dashboard() {
  const dispatch = useDispatch()
  const user = useSelector(s => s.user.currentUser)
  const { prices, priceHistory, connected } = useSelector(s => s.market)
  const { balance } = useSelector(s => s.portfolio)
  
  const defaultSymbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'EUR/USD'];
  const [activeSymbol, setActiveSymbol] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('1H');

  // Track Mouse efficiently via DOM ref (0 re-renders)
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
    if (user && user.id) {
      api.getBalance(user.id).then(res => dispatch(setBalance(res.balance))).catch(console.error);
    }
  }, [user, dispatch]);

  const history = priceHistory[activeSymbol] || [];
  const chartData = useMemo(() => {
    if (history.length === 0) return [];
    return history.map((p, i) => ({ time: i, price: p }));
  }, [history]);

  const currentPrice = prices[activeSymbol] || 0;
  const startPrice = history[0] || currentPrice;
  const delta = currentPrice - startPrice;
  const pct = startPrice ? (delta / startPrice) * 100 : 0;
  const isUp = delta >= 0;

  const balStr = fmtCur(balance || 0);
  const integerPart = balStr.includes('.') ? balStr.split('.')[0] : balStr;
  const decimalPart = balStr.includes('.') ? `.${balStr.split('.')[1]}` : '.00';

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
          backgroundSize: '40px 40px',
        }}
      />
      {/* 2. Intense Spotlit Grid (Deep Blue variant for Dashboard) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 min-h-screen" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), black, transparent)`,
          WebkitMaskImage: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), black, transparent)`
        }}
      />
      {/* 3. Soft ambient spotlight blur */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 mix-blend-screen min-h-screen"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.08), transparent 40%)`,
        }}
      />

      <div className="relative z-10 w-full space-y-6 pt-2 anim-fade">
      {/* ── Top Header Section ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end mb-6 anim-fade-1 gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">Portfolio Overview</h1>
          <p className="text-[#A1A1AA] text-[13px] sm:text-sm font-medium">Welcome back, monitor your real-time analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-full border ${connected ? 'border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.1)]' : 'border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)]'} flex items-center gap-2`}>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-[#10B981]' : 'bg-[#EF4444]'} ${connected ? 'animate-pulse' : ''}`} />
            <span className={`text-[11px] font-bold tracking-wider uppercase ${connected ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {connected ? 'Platform Live' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Data Grid ── */}
      <div className="flex flex-col gap-6 anim-fade-2 w-full">
        
        {/* ROW 1: Chart & Watchlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          
          {/* Main Chart Card */}
          <div className="lg:col-span-8 card relative overflow-hidden flex flex-col h-[380px] md:h-[430px]">
            {/* Ambient Background Glow */}
            <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-[rgba(16,185,129,0.15)] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-[50px] -left-[50px] w-[200px] h-[200px] bg-[rgba(59,130,246,0.1)] rounded-full blur-[80px] pointer-events-none" />
            
            <div className="p-4 sm:p-6 pb-2 relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2 group cursor-pointer w-max outline-none focus:outline-none">
                  <div className="flex items-center gap-2 bg-[#1C1C1D] border border-[#333333] pl-2 pr-3 py-1.5 rounded-full shadow-md transition-all">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] tracking-tighter border ${getCoinColor(activeSymbol)}`}>
                      {activeSymbol.split('/')[0]}
                    </div>
                    <h2 className="text-[17px] font-extrabold text-white tracking-tight leading-none">{activeSymbol}</h2>
                    <svg className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                  <span className={`tag-${isUp ? 'green' : 'red'}`}>
                    {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(pct).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tighter">
                    {fmtCur(currentPrice)}
                  </span>
                  <span className="text-[12px] sm:text-sm font-medium text-[#A1A1AA]">Current Price</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2 bg-[rgba(0,0,0,0.4)] p-1 rounded-[14px] border border-[rgba(255,255,255,0.05)]">
                {['1H', '1D', '1W'].map(b => (
                  <button 
                    key={b} 
                    onClick={() => setTimeframe(b)}
                    className={`px-3 sm:px-4 py-1 sm:py-1.5 outline-none focus:outline-none rounded-[10px] text-[11px] sm:text-[12px] font-bold transition-all ${timeframe === b ? 'bg-[#34D399] text-black shadow-lg' : 'text-[#A1A1AA] hover:text-white'}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[280px] w-full mt-4 -ml-2 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isUp ? '#34D399' : '#F87171'} stopOpacity={0.4}/>
                      <stop offset="100%" stopColor={isUp ? '#34D399' : '#F87171'} stopOpacity={0.0}/>
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={isUp ? '#34D399' : '#F87171'} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#chartGradient)" 
                    isAnimationActive={false}
                    activeDot={{ r: 6, fill: '#fff', stroke: '#000', strokeWidth: 2 }}
                    style={{ filter: "url(#glow)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Grid Overlay inside chart area */}
            <div className="absolute inset-0 bottom-0 pointer-events-none" style={{ 
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,1) 100%)'
            }} />
          </div>

          {/* Main Watchlist */}
          <div className="lg:col-span-4 card flex flex-col overflow-hidden anim-fade-3 h-[400px] lg:h-[430px] w-full" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <div className="card-header border-b border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)] relative z-50">
              <h3 className="text-[13px] sm:text-sm font-bold text-white flex items-center gap-2 tracking-wide">
                <Eye size={16} className="text-[#34D399]" />
                Live Watchlist
              </h3>
              
              <div className="relative group">
                <button className="text-[#A1A1AA] group-hover:text-[#34D399] group-hover:rotate-180 transition-all outline-none py-1 px-1">
                  <List size={16} />
                </button>
                
                {/* Premium Solid Overlay Popup for Watchlist Filters (Hover Activated) */}
                <div 
                  className="absolute top-[100%] right-0 w-[180px] p-2 rounded-[14px] border border-[#222] shadow-[0_20px_40px_rgba(0,0,0,0.9)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] translate-y-2 group-hover:translate-y-0 bg-[#0A0A0A]" 
                >
                  <div className="flex flex-col gap-1">
                    <button className="w-full text-left px-3 py-2 text-[12px] font-bold text-white bg-[#1A1A1A] rounded-[8px] hover:bg-[#222] transition-colors flex items-center justify-between outline-none border border-[#333]">
                      All Assets
                      <div className="w-1.5 h-1.5 rounded-full bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    </button>
                    <button className="w-full text-left px-3 py-2 text-[12px] font-semibold text-[#A1A1AA] hover:text-white rounded-[8px] hover:bg-[#1A1A1A] transition-colors outline-none">
                      Favorites Only
                    </button>
                    <button className="w-full text-left px-3 py-2 text-[12px] font-semibold text-[#A1A1AA] hover:text-white rounded-[8px] hover:bg-[#1A1A1A] transition-colors outline-none">
                      Top Gainers
                    </button>
                    <button className="w-full text-left px-3 py-2 text-[12px] font-semibold text-[#A1A1AA] hover:text-white rounded-[8px] hover:bg-[#1A1A1A] transition-colors outline-none">
                      High Volume
                    </button>
                    <button className="w-full text-left px-3 py-2 text-[12px] font-semibold text-[#EF4444] hover:text-[#F87171] rounded-[8px] hover:bg-[#1A1A1A] transition-colors outline-none mt-1 border-t border-[#222] pt-2 rounded-t-[0px]">
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-2 space-y-1 overflow-y-auto w-full flex-1">
              {defaultSymbols.map((sym, idx) => {
                const p = prices[sym] || 0;
                const h = priceHistory[sym] || [];
                const sP = h[0] || p;
                const d = p - sP;
                const percentage = sP ? (d/sP)*100 : 0;
                const up = d >= 0;

                return (
                  <button 
                    key={sym}
                    onClick={() => setActiveSymbol(sym)}
                    className={`w-full flex items-center justify-between p-4 rounded-[14px] transition-all group outline-none focus:outline-none
                      ${activeSymbol === sym ? 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] shadow-lg' : 'border border-transparent hover:bg-[rgba(255,255,255,0.02)]'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] border shadow-sm ${getCoinColor(sym)}`}>
                        {sym.split('/')[0]}
                      </div>
                      <span className="font-bold text-white text-[14px]">{sym}</span>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-[14px] text-white tracking-tight">
                        {fmtCur(p)}
                      </span>
                      <span className={`text-[11px] font-semibold mt-0.5 ${up ? 'text-[#34D399]' : 'text-[#F87171]'}`}>
                        {up ? '+' : ''}{percentage.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            
            <div className="p-4 mt-auto w-full">
              <button className="btn-primary w-full shadow-[0_0_20px_rgba(52,211,153,0.15)] bg-[#34D399] hover:bg-[#10B981] text-black">
                Explore Markets
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: unified VIP grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
            {/* Detailed Total Balance Card (Matching User Screenshot) */}
            <div className="card relative overflow-hidden p-6 transition-transform hover:scale-[1.02] cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-[#333333]" style={{ background: 'linear-gradient(135deg, #2a2a2c 0%, #171718 100%)', borderRadius: '24px' }}>
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <h3 className="text-[#A1A1AA] text-[15px] font-bold tracking-wide mb-1">Total Balance</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[32px] font-black text-white tracking-tight">{integerPart}</span>
                    <span className="text-[20px] font-bold text-[#A1A1AA]">{decimalPart}</span>
                  </div>
                </div>
                
                <div className="w-[48px] h-[48px] rounded-[16px] bg-gradient-to-br from-[#FDE08B] via-[#D4AF37] to-[#B8860B] shadow-[0_4px_15px_rgba(212,175,55,0.3)] flex items-center justify-center border border-[#FDE08B]/40">
                  <Wallet size={24} className="text-black stroke-[2.5]" />
                </div>
              </div>

              {/* Avatars */}
              <div className="flex items-center mt-6 mb-8 relative z-10">
                <div className="flex -space-x-3">
                  <img className="w-8 h-8 rounded-full border-[2px] border-[#1C1C1D] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="User 1"/>
                  <img className="w-8 h-8 rounded-full border-[2px] border-[#1C1C1D] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User 2"/>
                  <img className="w-8 h-8 rounded-full border-[2px] border-[#1C1C1D] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User 3"/>
                  <div className="w-8 h-8 rounded-full border-[2px] border-[#1C1C1D] bg-black flex items-center justify-center text-white font-bold text-[14px] hover:bg-zinc-800 transition-colors z-10 transition-transform hover:scale-110">
                    +
                  </div>
                </div>
              </div>

              {/* Bottom: Account Info & Gold LineGraph */}
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <h4 className="text-[10px] font-extrabold text-[#A1A1AA] tracking-[0.1em] uppercase mb-1">Account Number</h4>
                  <p className="text-[15px] font-mono font-black text-white tracking-widest">**** 9934</p>
                </div>
                
                <div className="w-[110px] h-[35px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v:10},{v:15},{v:12},{v:22},{v:20},{v:30},{v:40}]}>
                       <Line 
                         type="linear" 
                         dataKey="v" 
                         stroke="url(#goldGradient)" 
                         strokeWidth={3} 
                         isAnimationActive={false} 
                         dot={(props) => {
                           if (props.index === 6) {
                             return <circle key="dot" cx={props.cx} cy={props.cy} r={3.5} fill="#fff" stroke="#FDE08B" strokeWidth={2} style={{ filter: 'drop-shadow(0px 0px 4px rgba(253,224,139,1))' }} />;
                           }
                           return null;
                         }}
                       />
                       <defs>
                          <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#B8860B" />
                            <stop offset="50%" stopColor="#D4AF37" />
                            <stop offset="100%" stopColor="#FDE08B" />
                          </linearGradient>
                       </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Active Positions VIP Card */}
            <div className="card relative overflow-hidden p-6 transition-transform hover:scale-[1.02] cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-[#333333]" style={{ background: 'linear-gradient(135deg, #2a2a2c 0%, #171718 100%)', borderRadius: '24px' }}>
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <h3 className="text-[#A1A1AA] text-[15px] font-bold tracking-wide mb-1">Active Positions</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[32px] font-black text-white tracking-tight">03</span>
                    <span className="text-[20px] font-bold text-[#A1A1AA] pt-1"> trades</span>
                  </div>
                </div>
                
                <div className="w-[48px] h-[48px] rounded-[16px] bg-gradient-to-br from-[#6EE7B7] via-[#10B981] to-[#047857] shadow-[0_4px_15px_rgba(16,185,129,0.3)] flex items-center justify-center border border-[#6EE7B7]/40">
                  <PieChart size={24} className="text-black stroke-[2.5]" />
                </div>
              </div>

              {/* Active Tokens */}
              <div className="flex items-center mt-6 mb-8 relative z-10">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-[2px] border-[#1C1C1D] bg-[#F7931A] flex items-center justify-center font-bold text-[10px] text-white shadow-lg relative z-30">BTC</div>
                  <div className="w-8 h-8 rounded-full border-[2px] border-[#1C1C1D] bg-[#627EEA] flex items-center justify-center font-bold text-[10px] text-white shadow-lg relative z-20">ETH</div>
                  <div className="w-8 h-8 rounded-full border-[2px] border-[#1C1C1D] bg-[#14F195] flex items-center justify-center font-bold text-[10px] text-black shadow-lg relative z-10">SOL</div>
                </div>
              </div>

              {/* Bottom: Sub Metric & Graph */}
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <h4 className="text-[10px] font-extrabold text-[#A1A1AA] tracking-[0.1em] uppercase mb-1">Win Rate</h4>
                  <p className="text-[15px] font-mono font-black text-[#10B981] tracking-widest">68.5%</p>
                </div>
                
                <div className="w-[110px] h-[35px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v:2},{v:5},{v:3},{v:7},{v:4},{v:6},{v:5}]}>
                       <Line 
                         type="linear" 
                         dataKey="v" 
                         stroke="url(#emeraldGradient)" 
                         strokeWidth={3} 
                         isAnimationActive={false} 
                         dot={(props) => {
                           if (props.index === 6) {
                             return <circle key="dot" cx={props.cx} cy={props.cy} r={3.5} fill="#fff" stroke="#6EE7B7" strokeWidth={2} style={{ filter: 'drop-shadow(0px 0px 4px rgba(110,231,183,1))' }} />;
                           }
                           return null;
                         }}
                       />
                       <defs>
                          <linearGradient id="emeraldGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#047857" />
                            <stop offset="50%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#6EE7B7" />
                          </linearGradient>
                       </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Daily Return VIP Card */}
            <div className="card relative overflow-hidden p-6 transition-transform hover:scale-[1.02] cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-[#333333]" style={{ background: 'linear-gradient(135deg, #2a2a2c 0%, #171718 100%)', borderRadius: '24px' }}>
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <h3 className="text-[#A1A1AA] text-[15px] font-bold tracking-wide mb-1">Daily Return</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[32px] font-black text-white tracking-tight">+2</span>
                    <span className="text-[20px] font-bold text-[#A1A1AA]">.4%</span>
                  </div>
                </div>
                
                <div className="w-[48px] h-[48px] rounded-[16px] bg-gradient-to-br from-[#93C5FD] via-[#3B82F6] to-[#1D4ED8] shadow-[0_4px_15px_rgba(59,130,246,0.3)] flex items-center justify-center border border-[#93C5FD]/40">
                  <TrendingUp size={24} className="text-black stroke-[2.5]" />
                </div>
              </div>

              {/* Overlapping Asset Bubbles (Matches avatar structure) */}
              <div className="flex items-center mt-6 mb-8 relative z-10">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-[2px] border-[#1C1C1D] bg-[#F7931A] flex items-center justify-center font-bold text-[10px] text-white shadow-lg relative z-30">BTC</div>
                  <div className="w-8 h-8 rounded-full border-[2px] border-[#1C1C1D] bg-[#14F195] flex items-center justify-center font-bold text-[10px] text-black shadow-lg relative z-20">SOL</div>
                  <div className="w-8 h-8 rounded-full border-[2px] border-[#1C1C1D] bg-[rgba(59,130,246,0.2)] flex items-center justify-center font-bold text-[14px] text-[#93C5FD] shadow-lg relative z-10 backdrop-blur-md">
                    +
                  </div>
                </div>
              </div>

              {/* Bottom: Sub Metric & Graph */}
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <h4 className="text-[10px] font-extrabold text-[#A1A1AA] tracking-[0.1em] uppercase mb-1">Est. Profit</h4>
                  <p className="text-[15px] font-mono font-black text-[#3B82F6] tracking-widest">+$4,200</p>
                </div>
                
                <div className="w-[110px] h-[35px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v:0},{v:1},{v:-0.5},{v:1.5},{v:2},{v:1.8},{v:2.4}]}>
                       <Line 
                         type="linear" 
                         dataKey="v" 
                         stroke="url(#blueGradient)" 
                         strokeWidth={3} 
                         isAnimationActive={false} 
                         dot={(props) => {
                           if (props.index === 6) {
                             return <circle key="dot" cx={props.cx} cy={props.cy} r={3.5} fill="#fff" stroke="#93C5FD" strokeWidth={2} style={{ filter: 'drop-shadow(0px 0px 4px rgba(147,197,253,1))' }} />;
                           }
                           return null;
                         }}
                       />
                       <defs>
                          <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#1D4ED8" />
                            <stop offset="50%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#93C5FD" />
                          </linearGradient>
                       </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* 3D Gold Card Added as 4th item in VIP Grid */}
            <div className="lg:col-span-2 h-[250px] w-full [perspective:1000px] group cursor-pointer anim-fade-4">
              <div className="w-full h-full relative transition-[transform] duration-[0.8s] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Card Front (Ultra Premium Gold) */}
                <div className="absolute inset-0 rounded-[24px] [backface-visibility:hidden] bg-gradient-to-br from-[#AA771C] via-[#D4AF37] to-[#8A5A19] p-6 flex flex-col justify-between overflow-hidden shadow-[0_20px_40px_rgba(212,175,55,0.3)] border border-[#FDE08B]/50">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FDE08B]/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -skew-x-45 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] pointer-events-none" />
                  <div className="flex justify-between items-start relative z-10 w-full pt-1 opacity-90">
                    <div className="flex flex-col">
                      <span className="text-[18px] font-black text-[#1A1A1A] tracking-widest uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] leading-tight">{user?.name || 'MERRY CRYPTO'}</span>
                      <span className="text-[10px] font-black text-[#1A1A1A] italic tracking-[0.4em] drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] mt-1">NEXUS RESERVE</span>
                    </div>
                    <div className="flex items-center text-[#1A1A1A] drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                       <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 4a23.6 23.6 0 0 1 0 16"/><path d="M13.5 6a18.6 18.6 0 0 1 0 12"/><path d="M18.5 8a13.6 13.6 0 0 1 0 8"/></svg>
                    </div>
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="w-11 h-8 rounded-[4px] bg-gradient-to-br from-[#E2C573] to-[#B38D35] border border-[#7A5B1C]/40 shadow-inner flex flex-col justify-evenly px-[2px] opacity-90 relative overflow-hidden">
                       <div className="absolute inset-0 border border-[#7A5B1C]/20 rounded-[4px]" />
                       <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#7A5B1C]/30" />
                       <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-[#7A5B1C]/30" />
                       <div className="absolute right-1/3 top-0 bottom-0 w-[1px] bg-[#7A5B1C]/30" />
                       <div className="w-full h-full rounded-[2px] border border-[#7A5B1C]/30 absolute inset-0 m-1" />
                    </div>
                    <p className="font-mono text-[20px] text-[#1A1A1A] font-black tracking-[0.16em] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">4920  8271  6638  4289</p>
                    <div className="flex justify-between items-end text-[#1A1A1A] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] w-full">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Member Since</span>
                        <span className="text-[13px] font-bold tracking-widest uppercase">2024</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Valid Thru</span>
                        <span className="text-[13px] font-bold tracking-widest">12/28</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Card Back (Ultra Premium Gold) */}
                <div className="absolute inset-0 rounded-[24px] [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-[#8A5A19] via-[#D4AF37] to-[#AA771C] border border-[#FDE08B]/50 flex flex-col overflow-hidden shadow-[0_20px_40px_rgba(212,175,55,0.3)]">
                  <div className="w-full h-12 bg-gradient-to-b from-[#111] to-[#000] mt-6 shadow-md" />
                  <div className="px-6 py-4 flex flex-col items-end flex-1">
                    <div className="w-full flex justify-between items-center mb-1 mt-1">
                       <span className="text-[9px] font-bold text-[#1A1A1A] tracking-widest uppercase opacity-80 drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]">Account Email</span>
                       <span className="text-[11px] font-black text-[#1A1A1A] drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]">{user?.email || 'user@nexus.io'}</span>
                    </div>
                    <div className="w-full h-9 bg-gradient-to-b from-[#EFEFEF] to-[#DCDCDC] rounded-[2px] flex items-center justify-end px-3 mt-1 shadow-inner relative" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }}>
                      <span className="text-black text-opacity-30 italic font-mono absolute left-8 tracking-[0.2em] text-[10px]">Authorized Signature</span>
                      <span className="font-mono text-[14px] font-black text-red-700 bg-white px-2 py-0.5 -mr-1 border border-zinc-300 italic transform -skew-x-12 shadow-sm">491</span>
                    </div>
                    <div className="flex justify-between w-full items-center mt-5 flex-1">
                      <div className="w-12 h-7 rounded-[3px] bg-[conic-gradient(from_0deg,#F0F8FF,#FFD700,#E6E6FA,#FF69B4,#F0F8FF)] opacity-80 mix-blend-screen shadow-[0_0_15px_rgba(255,215,0,0.6)] border border-white/50 relative overflow-hidden group-hover:animate-pulse">
                          <div className="absolute inset-0 flex items-center justify-center opacity-30 text-[8px] font-black text-black">NEXUS</div>
                      </div>
                      <p className="text-[8px] text-[#1A1A1A] text-right leading-relaxed font-bold tracking-wider opacity-90 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                        Property of Nexus Group.<br/>Misuse is a federal offense.<br/>If found call 1-800-NEXUS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ROW 3: Recent Activity Table */}
          <div className="w-full mt-2">
            <div className="card p-5 flex flex-col w-full anim-fade-4">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-white font-bold tracking-tight text-[15px]">Recent Activity</h3>
                <button className="text-[#34D399] text-[12px] font-bold hover:text-white transition-colors border border-transparent hover:border-[#34D399]/30 px-3 py-1.5 rounded-full">View All</button>
              </div>
              <div className="w-full overflow-auto scrollbar-hide">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="pb-3 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest pl-2">Asset</th>
                      <th className="pb-3 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Type</th>
                      <th className="pb-3 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest text-right">Amount</th>
                      <th className="pb-3 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest text-center w-[180px]">Live Trend</th>
                      <th className="pb-3 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest text-right pr-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { asset: 'BTC', type: 'Buy', amount: '+0.024', stat: 'Completed', time: '14:32', spark: [3,4,3,5,4,6,5,8,7,9,8,11,10,13,12,15] },
                      { asset: 'ETH', type: 'Sell', amount: '-1.500', stat: 'Pending', time: '09:15', spark: [15,14,15,12,13,10,11,8,9,6,7,4,5,2,3,1] },
                      { asset: 'SOL', type: 'Deposit', amount: '+45.00', stat: 'Completed', time: 'Yesterday', spark: [2,3,2,4,5,4,6,7,6,9,8,11,12,11,14,15] },
                      { asset: 'XRP', type: 'Buy', amount: '+1,500', stat: 'Completed', time: 'Oct 24', spark: [5,6,5,7,6,6,5,7,6,8,7,8,7,9,8,10] },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group cursor-pointer">
                        <td className="py-2.5 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center font-bold text-[10px] text-white">
                              {row.asset}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-[13px]">{row.asset}</span>
                              <span className="text-[10px] text-zinc-500">{row.time}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <span className={`text-[11px] font-bold ${row.type === 'Buy' || row.type === 'Deposit' ? 'text-[#34D399]' : 'text-zinc-300'}`}>{row.type}</span>
                        </td>
                        <td className="py-2.5 text-right">
                          <span className="font-mono text-[13px] font-bold text-white tracking-tight">{row.amount}</span>
                        </td>
                        <td className="py-2.5 px-6 align-middle">
                          <div className="w-[100px] sm:w-[130px] h-[35px] opacity-80 group-hover:opacity-100 transition-opacity">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={row.spark.map((v) => ({ v }))}>
                                <defs>
                                  <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={row.stat === 'Completed' && row.type !== 'Sell' ? '#34D399' : '#EF4444'} stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor={row.stat === 'Completed' && row.type !== 'Sell' ? '#34D399' : '#EF4444'} stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <Area 
                                  type="monotone" 
                                  dataKey="v" 
                                  stroke={row.stat === 'Completed' && row.type !== 'Sell' ? '#34D399' : '#EF4444'} 
                                  strokeWidth={2} 
                                  fill={`url(#gradient-${i})`}
                                  isAnimationActive={true}
                                  animationDuration={1500}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </td>
                        <td className="py-2.5 text-right pr-2">
                          <div className="flex justify-end">
                            <span className={`px-2 py-1 rounded-[6px] text-[9px] font-bold uppercase tracking-widest ${row.stat === 'Completed' ? 'bg-[#10B981]/10 text-[#10B981]' : 'border border-zinc-700 text-zinc-400'}`}>
                              {row.stat}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
  )
}
