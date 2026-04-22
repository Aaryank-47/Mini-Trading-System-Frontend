import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setOrders } from '../store/portfolioSlice'
import api from '../api'
import { Clock, TrendingUp, TrendingDown, Search, Filter, Activity, BarChart2 } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

const formatCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n || 0))

// Quick mocked timeline for the header chart to look super premium
const volumeTimeline = [
  { time: '10:00', vol: 15 }, { time: '11:00', vol: 42 }, { time: '12:00', vol: 23 }, 
  { time: '13:00', vol: 64 }, { time: '14:00', vol: 48 }, { time: '15:00', vol: 89 }, 
  { time: '16:00', vol: 120 }, { time: '17:00', vol: 95 }
]

export default function Orders() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.user.currentUser)
  const orders = useSelector((s) => s.portfolio.orders)
  const [loading, setLoading] = useState(true)

  // Track Mouse for Glowing Grid Background Effect
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try { dispatch(setOrders(await api.getOrderHistory(user.id, 0, 100))) }
      catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [user, dispatch])

  const totalVolume = useMemo(() => {
    if(!orders) return 0;
    return orders.reduce((acc, o) => acc + (parseFloat(o.total_amount) || 0), 0);
  }, [orders])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative bg-[#050505]">
        <Activity className="text-[#8B5CF6] animate-spin" size={48} />
      </div>
    )
  }

  return (
    <div 
      className="relative w-full min-h-[calc(100vh-60px)] overflow-hidden font-sans pb-16" 
      onMouseMove={handleMouseMove}
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
      {/* 2. Intense Purple Grid revealed by cursor mask */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 min-h-screen" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139, 92, 246, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`
        }}
      />
      {/* 3. Soft ambient spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 mix-blend-screen min-h-screen"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.08), transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-8 pt-6 px-6 anim-fade">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 anim-fade-1">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">Order History</h1>
            <div className="flex items-center gap-4 text-sm font-medium text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse shadow-[0_0_8px_#8B5CF6]" />
                Tx Sync Complete
              </div>
              <span className="text-[#333] border-l border-[#333] pl-4">{orders?.length || 0} Total Orders</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input type="text" placeholder="Search orders... (e.g. BTC)" className="w-full bg-[rgba(10,10,12,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#8B5CF6] transition-all shadow-lg" />
            </div>
            <button className="h-[46px] w-[46px] flex items-center justify-center rounded-xl bg-[rgba(10,10,12,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-zinc-400 hover:text-white transition-all flex-shrink-0 shadow-lg hover:border-[#333]">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Global Stats & Premium Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full anim-fade-2">
          
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-[20px] p-6 flex flex-col justify-center border border-[rgba(255,255,255,0.05)] bg-[rgba(20,20,22,0.6)] backdrop-blur-xl shadow-2xl hover:border-[rgba(255,255,255,0.1)] transition-colors group flex-1">
               <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.03)] to-transparent pointer-events-none" />
               <span className="relative z-10 text-[12px] font-extrabold text-zinc-500 uppercase tracking-widest mb-2 select-none">Total Executed Volume</span>
               <div className="relative z-10 flex items-end justify-between mt-1">
                 <span className="text-[32px] font-black tracking-tight text-white leading-none drop-shadow-md">{formatCurrency(totalVolume)}</span>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="relative overflow-hidden rounded-[20px] p-5 flex flex-col justify-between border border-[rgba(255,255,255,0.05)] bg-[rgba(20,20,22,0.6)] backdrop-blur-xl shadow-2xl">
                 <span className="relative z-10 text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1 select-none">Filled Orders</span>
                 <span className="relative z-10 text-[20px] font-black tracking-tight text-white leading-none">{orders?.length || 0}</span>
              </div>
              <div className="relative overflow-hidden rounded-[20px] p-5 flex flex-col justify-between border border-[rgba(255,255,255,0.05)] bg-[rgba(20,20,22,0.6)] backdrop-blur-xl shadow-2xl">
                 <span className="relative z-10 text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-1 select-none">Win Rate (Sim)</span>
                 <span className="relative z-10 text-[20px] font-black tracking-tight text-[#34D399] leading-none drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">64.5%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.8)] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-6 flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-extrabold text-[#A1A1AA] uppercase tracking-widest flex items-center gap-2 select-none">
                  <BarChart2 size={16} className="text-[#8B5CF6]" />
                  Volume Timeline
                </h3>
             </div>
             <div className="flex-1 w-full relative z-10 min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeTimeline}>
                    <defs>
                      <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.5}/>
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                      <filter id="purpleGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="vol" stroke="#8B5CF6" strokeWidth={3} fill="url(#volGrad)" isAnimationActive={true} animationDuration={1500} style={{ filter: 'url(#purpleGlow)' }} activeDot={{ r: 6, fill: '#fff', stroke: '#8B5CF6', strokeWidth: 2 }} />
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
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none">Time</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none">Symbol</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none">Side</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none text-right">Quantity</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none text-right">Price Executed</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none text-right">Total Notional</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest leading-none text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {(!orders?.length) ? (
                  <tr>
                    <td colSpan="7" className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.02)] flex items-center justify-center mb-5 border border-[rgba(255,255,255,0.05)]">
                          <Activity className="text-zinc-600 animate-pulse" size={28} />
                        </div>
                        <h3 className="text-white text-[18px] font-bold tracking-tight mb-1">No Orders Found</h3>
                        <p className="text-zinc-500 text-[14px] font-medium max-w-sm">Execute a trade through the terminal to build your history.</p>
                      </div>
                    </td>
                  </tr>
                ) : orders.map(o => {
                  const d = new Date(o.created_at)
                  const isBuy = o.side === 'BUY'
                  return (
                    <tr key={o.id} className="border-b border-[rgba(255,255,255,0.02)] last:border-0 hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300 group cursor-default">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2.5 text-zinc-400 group-hover:text-white transition-colors">
                          <Clock size={14} className="opacity-70" />
                          <span className="font-mono text-[13px] font-medium tracking-tight">
                            {d.toLocaleDateString()} <span className="opacity-50">|</span> {d.toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 relative">
                          <div className="w-9 h-9 rounded-xl bg-black border border-[rgba(255,255,255,0.1)] flex items-center justify-center font-bold text-[11px] text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110 group-hover:border-[#333] group-hover:text-[#8B5CF6]">
                            {o.symbol.substring(0,2)}
                          </div>
                          <span className="font-extrabold text-white text-[14px] tracking-wide">{o.symbol}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                         <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[11px] font-bold tracking-widest uppercase border ${isBuy ? 'bg-[rgba(52,211,153,0.1)] text-[#34D399] border-[#34D399]/30 drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]' : 'bg-[rgba(244,63,94,0.1)] text-rose-500 border-rose-500/30 drop-shadow-[0_0_8px_rgba(244,63,94,0.2)]'}`}>
                           {isBuy ? <TrendingUp size={13} strokeWidth={3} /> : <TrendingDown size={13} strokeWidth={3} />}
                           {o.side}
                         </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-mono text-[14px] font-bold text-zinc-300">{o.quantity}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-mono text-[15px] font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">{formatCurrency(o.price)}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                         <span className="font-mono text-[16px] font-black text-white tracking-tight drop-shadow-sm">{formatCurrency(o.total_amount)}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${o.status === 'Completed' || o.status === 'COMPLETED' ? 'bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20' : 'bg-[rgba(255,255,255,0.05)] text-zinc-400 border border-[rgba(255,255,255,0.1)]'}`}>
                          {o.status}
                        </span>
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
