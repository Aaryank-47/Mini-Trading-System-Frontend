import React, { useState, useRef } from 'react'
import { Bell, CheckCircle2, AlertTriangle, Zap, ArrowDownRight, ArrowUpRight, TrendingUp, Settings, Trash2, ShieldAlert } from 'lucide-react'

export default function Notifications() {
  const containerRef = useRef(null)
  
  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    containerRef.current.style.setProperty('--mouse-x', `${x}px`)
    containerRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  const [activeTab, setActiveTab] = useState('all')

  const NO_NOTIFICATIONS = [
    {
       id: 1, type: 'execution', title: 'Market Order Filled', desc: 'Bought 2.5 BTC at $64,201.00 USD via Smart Routing Engine.',
       time: '2 mins ago', unread: true, icon: TrendingUp, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30'
    },
    {
       id: 2, type: 'alert', title: 'Security Protocol Updated', desc: 'New IP detected from New York, USA. If this was not you, lock your account immediately.',
       time: '1 hour ago', unread: true, icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30'
    },
    {
       id: 3, type: 'system', title: 'Scheduled Maintenance', desc: 'API WebSocket drops expected for 5 minutes during epoch rollover at 00:00 UTC.',
       time: '5 hours ago', unread: false, icon: Zap, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30'
    },
    {
       id: 4, type: 'execution', title: 'Stop Loss Triggered', desc: 'Sold 50.0 SOL at $142.50 USD. Position closed to prevent further downside.',
       time: '1 day ago', unread: false, icon: ArrowDownRight, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30'
    },
    {
       id: 5, type: 'system', title: 'Deposit Successful', desc: 'Received wire transfer of $50,000 USD via ACH settlement layer.',
       time: '2 days ago', unread: false, icon: ArrowUpRight, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30'
    }
  ]

  const filtered = activeTab === 'all' ? NO_NOTIFICATIONS : NO_NOTIFICATIONS.filter(n => activeTab === 'unread' ? n.unread : n.type === activeTab)

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[calc(100vh-60px)] overflow-hidden font-sans pb-16" 
      onMouseMove={handleMouseMove}
      style={{ '--mouse-x': '-1000px', '--mouse-y': '-1000px' }}
    >
      
      {/* Background Masking System - Deep Violet Institutional Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 min-h-screen" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div className="fixed inset-0 pointer-events-none z-0 min-h-screen" style={{ backgroundImage: `linear-gradient(to right, rgba(139, 92, 246, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.4) 1px, transparent 1px)`, backgroundSize: '60px 60px', maskImage: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), black, transparent)`, WebkitMaskImage: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), black, transparent)` }} />
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-screen min-h-screen" style={{ background: `radial-gradient(1000px circle at var(--mouse-x) var(--mouse-y), rgba(139, 92, 246, 0.08), transparent 50%)` }} />

      <div className="relative z-10 max-w-[1000px] mx-auto space-y-8 pt-8 px-4 md:px-8 anim-fade">
        
        {/* Massive 3D Header Component */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8 relative">
           <div className="absolute right-0 top-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-[80px] pointer-events-none" />
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                 <div className="px-2.5 py-1 rounded-md bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center gap-2">
                    <Bell size={12} className="text-[#8B5CF6]" />
                    <span className="text-[10px] uppercase font-bold text-[#8B5CF6] tracking-widest">2 Unread Alerts</span>
                 </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white drop-shadow-md">
                 Notification Center
              </h1>
              <p className="text-[14px] text-zinc-500 font-medium mt-2">Real-time alerts for market executions, API hooks, and security logic.</p>
           </div>

           <div className="flex items-center gap-3 relative z-10">
              <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors tooltip relative group">
                 <CheckCircle2 size={18} className="text-zinc-400 group-hover:text-[#10B981]" />
                 <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Mark Read</span>
              </button>
              <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                 <Settings size={18} className="text-zinc-400 group-hover:text-white" />
              </button>
           </div>
        </div>

        {/* Dynamic Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {[
               { id: 'all', label: 'All Alerts' },
               { id: 'unread', label: 'Unread' },
               { id: 'execution', label: 'Order Fills' },
               { id: 'alert', label: 'Security' },
               { id: 'system', label: 'System Logs' },
            ].map(f => (
               <button 
                  key={f.id}
                  onClick={() => setActiveTab(f.id)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest transition-all ${
                     activeTab === f.id 
                     ? 'bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                     : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
               >
                  {f.label}
               </button>
            ))}
        </div>

        {/* Notifications Grid list */}
        <div className="space-y-4 pb-10">
            {filtered.length === 0 ? (
               <div className="py-20 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-[32px] bg-black/20 backdrop-blur-md">
                 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Bell size={32} className="text-zinc-600" />
                 </div>
                 <p className="text-[18px] font-black text-white mb-1">Inbox Zero</p>
                 <p className="text-[13px] text-zinc-500 font-medium">You have no new alerts in this category.</p>
               </div>
            ) : (
               filtered.map((n, idx) => (
                  <div 
                    key={n.id} 
                    className={`relative overflow-hidden rounded-[24px] border transition-all duration-300 group cursor-pointer hover:-translate-y-1 ${
                      n.unread 
                      ? 'bg-[rgba(20,20,25,0.8)] border-[#8B5CF6]/30 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:border-[#8B5CF6]/60' 
                      : 'bg-[rgba(10,10,12,0.6)] border-white/5 hover:border-white/20'
                    } backdrop-blur-3xl p-6 md:p-8 flex items-start gap-5`}
                  >
                     {n.unread && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#8B5CF6] m-6 shadow-[0_0_10px_#8B5CF6] animate-pulse" />}
                     
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border ${n.bg} ${n.border} shadow-inner`}>
                         <n.icon size={24} className={n.color} />
                     </div>

                     <div className="flex-1 min-w-0 pr-8">
                        <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-1 sm:gap-4 mb-2">
                           <h3 className={`text-[17px] font-black truncate tracking-wide ${n.unread ? 'text-white' : 'text-zinc-300'}`}>{n.title}</h3>
                           <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className={`text-[14px] leading-relaxed font-medium md:max-w-[85%] ${n.unread ? 'text-zinc-300' : 'text-zinc-500'}`}>
                           {n.desc}
                        </p>
                     </div>
                  </div>
               ))
            )}
        </div>

      </div>
    </div>
  )
}
