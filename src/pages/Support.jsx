import React, { useState, useRef } from 'react'
import { HelpCircle, MessageSquare, Mail, Search, FileText, ChevronDown, Send, Zap, BookOpen, AlertOctagon, Clock, CheckCircle2, ServerCrash, Smartphone, Webhook } from 'lucide-react'

export default function Support() {
  const containerRef = useRef(null)
  
  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    containerRef.current.style.setProperty('--mouse-x', `${x}px`)
    containerRef.current.style.setProperty('--mouse-y', `${y}px`)
  }
  const [openFAQ, setOpenFAQ] = useState(0)

  const FAQS = [
    { q: "How do I withdraw funds to my Bank account via ACH?", a: "To initiate an ACH withdrawal, navigate to the Portfolio terminal and select 'Withdraw'. Connect your authorized checking account. Standard ACH transfers settle within 1-2 business days with zero transfer fees." },
    { q: "What is the fee structure for high-frequency algorithmic trading?", a: "Nexus operates on a volume-tiered maker/taker model. Base tier users incur a 0.10% taker fee. Nexus Pro accounts generating over $1M in 30-day volume unlock 0% taker fees and negative maker fees (rebates)." },
    { q: "How do I increase my API Rate Limits for WebSocket streams?", a: "Standard API keys are throttled at 50 requests per second. Institutional clients require a dedicated 'Pro' WebSocket stream capable of 500 RPS. You can upgrade via the Settings > API Keys portal." },
    { q: "What happens if my equity drops below maintenance margin?", a: "If your account leverage causes equity to drop below the 25% maintenance threshold, the Nexus liquidation engine will automatically close positions sequentially to restore margin safety. No margin calls are issued." }
  ]

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[calc(100vh-60px)] overflow-hidden font-sans pb-16" 
      onMouseMove={handleMouseMove}
      style={{ '--mouse-x': '-1000px', '--mouse-y': '-1000px' }}
    >
      
      {/* Background Masking System - Teal & Cyan Industrial Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 min-h-screen" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div className="fixed inset-0 pointer-events-none z-0 min-h-screen" style={{ backgroundImage: `linear-gradient(to right, rgba(20, 184, 166, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(45, 212, 191, 0.3) 1px, transparent 1px)`, backgroundSize: '60px 60px', maskImage: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), black, transparent)`, WebkitMaskImage: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), black, transparent)` }} />
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-screen min-h-screen" style={{ background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(20, 184, 166, 0.05), transparent 50%)` }} />

      <div className="relative z-10 max-w-[1300px] mx-auto space-y-8 pt-8 px-4 md:px-8 anim-fade">
        
        {/* Top: Live System Status Banner */}
        <div className="w-full relative overflow-hidden rounded-[16px] bg-[rgba(10,10,12,0.8)] border border-white/5 backdrop-blur-3xl shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center relative">
                 <div className="absolute inset-0 rounded-full border border-[#10B981] animate-ping opacity-20" />
                 <CheckCircle2 size={20} className="text-[#10B981]" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[14px] font-black text-white tracking-wide uppercase">All Systems Operational</span>
                 <span className="text-[12px] text-zinc-500 font-medium">Last updated: Just now</span>
              </div>
           </div>

           <div className="flex items-center gap-6 hidden sm:flex border-l border-white/10 pl-6 h-full">
              <div className="flex items-center gap-2">
                 <ServerCrash size={14} className="text-[#10B981]" />
                 <span className="text-[12px] font-bold text-zinc-300">Trading Engine: <span className="text-[#10B981]">12ms</span></span>
              </div>
              <div className="flex items-center gap-2">
                 <Webhook size={14} className="text-[#10B981]" />
                 <span className="text-[12px] font-bold text-zinc-300">WebSocket APIs: <span className="text-[#10B981]">Live</span></span>
              </div>
           </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(20,184,166,0.05)] to-[rgba(10,10,12,0.9)] backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-12 md:p-20 text-center flex flex-col items-center">
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#14B8A6] to-transparent absolute top-0" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 drop-shadow-lg">
                How can we help you?
            </h1>
            
            <div className="relative w-full max-w-[700px] mt-4 group">
                <div className="absolute inset-0 bg-[#14B8A6] rounded-[24px] blur-[20px] opacity-10 group-hover:opacity-20 transition-opacity" />
                <input 
                  type="text" 
                  placeholder="Search documentation, rate limits, fees, or API errors..."
                  className="relative w-full bg-[rgba(0,0,0,0.6)] border border-[#14B8A6]/30 rounded-[20px] py-5 pl-16 pr-6 text-white placeholder-zinc-500 font-bold text-[16px] focus:outline-none focus:border-[#14B8A6] transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)]" 
                />
                <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#14B8A6]" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] rounded-[14px] text-black font-black uppercase text-[12px] tracking-widest hover:brightness-110 shadow-lg">
                   Search
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Premium Contact Hub */}
            <div className="lg:col-span-5 space-y-6">
               
               {/* 24/7 Chat Module */}
               <div className="relative overflow-hidden rounded-[24px] border border-[#14B8A6]/20 bg-[rgba(10,10,12,0.8)] backdrop-blur-3xl shadow-xl p-8 group cursor-pointer hover:border-[#14B8A6]/50 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#14B8A6]/10 rounded-full blur-[40px]" />
                  <div className="flex justify-between items-start mb-10">
                     <div className="w-14 h-14 rounded-2xl bg-[#14B8A6]/10 border border-[#14B8A6]/30 flex items-center justify-center shadow-inner">
                        <MessageSquare size={24} className="text-[#14B8A6]" />
                     </div>
                     <div className="flex -space-x-3">
                        <img className="w-10 h-10 rounded-full border-[2px] border-[#0A0A0A] object-cover relative z-30" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Agent"/>
                        <img className="w-10 h-10 rounded-full border-[2px] border-[#0A0A0A] object-cover relative z-20" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" alt="Agent"/>
                        <div className="w-10 h-10 rounded-full border-[2px] border-[#0A0A0A] bg-[#14B8A6] flex items-center justify-center relative z-10 text-black font-black text-[12px]">+12</div>
                     </div>
                  </div>
                  <div>
                    <h3 className="text-[24px] font-black text-white tracking-tight mb-2">Live Support</h3>
                    <p className="text-[14px] text-zinc-400 font-medium leading-relaxed mb-6 max-w-[280px]">Connect directly with our tier-1 engineering and trading operations team.</p>
                    <button className="w-full py-4 rounded-[14px] bg-[#14B8A6]/10 text-[#14B8A6] font-bold text-[14px] border border-[#14B8A6]/20 group-hover:bg-[#14B8A6] group-hover:text-black transition-all flex justify-center items-center gap-2">
                       <Zap size={16} /> Start Chat — <span className="text-inherit font-medium opacity-80">&lt; 1 min wait</span>
                    </button>
                  </div>
               </div>

               {/* File Ticket Module */}
               <div className="relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.8)] backdrop-blur-3xl shadow-xl p-8 group cursor-pointer hover:border-white/20 transition-colors">
                  <div className="absolute right-6 top-8 text-zinc-600 group-hover:text-white transition-colors">
                     <Mail size={32} />
                  </div>
                  <h3 className="text-[18px] font-black text-white mb-2">Email Ticket</h3>
                  <p className="text-[13px] text-zinc-400 font-medium leading-relaxed mb-6 max-w-[250px]">Submit formal requests for account audits, API key issues, or trading disputes.</p>
                  <p className="text-[12px] font-bold text-zinc-300 uppercase tracking-widest bg-white/5 py-2 px-4 rounded-xl border border-white/5 inline-block">
                     support@nexus.io
                  </p>
               </div>

               {/* Dedicated Account Manager */}
               <div className="relative overflow-hidden rounded-[24px] border border-[#F59E0B]/20 bg-[rgba(10,10,12,0.8)] backdrop-blur-3xl shadow-xl p-8 [background-image:linear-gradient(135deg,rgba(245,158,11,0.05)_0%,transparent_100%)]">
                  <h3 className="text-[12px] font-black text-[#F59E0B] tracking-widest uppercase mb-4 flex items-center gap-2">
                     <AlertOctagon size={16} /> Institutional Clients
                  </h3>
                  <p className="text-[14px] text-white font-bold mb-1">Nexus VIP Program</p>
                  <p className="text-[13px] text-zinc-400 leading-relaxed mb-5">Institutional traders (volume $10M/month) receive a dedicated 24/7 account manager. Reach out to vip@nexus.io for onboarding.</p>
               </div>
            </div>

            {/* Right Column: Knowledge Base & Forms */}
            <div className="lg:col-span-7 space-y-6">
               <div className="relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.8)] backdrop-blur-3xl shadow-2xl p-8 md:p-10">
                  <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                    <h2 className="text-[24px] font-black text-white flex items-center gap-3 tracking-tight">
                       <BookOpen size={24} className="text-[#14B8A6]" /> High-Volume Topics
                    </h2>
                    <button className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest hover:text-[#14B8A6] transition-colors border border-transparent hover:border-[#14B8A6]/30 px-3 py-1.5 rounded-lg">View Library</button>
                  </div>

                  <div className="space-y-4">
                     {FAQS.map((f, idx) => {
                        const isOpen = openFAQ === idx;
                        return (
                          <div 
                            key={idx} 
                            onClick={() => setOpenFAQ(isOpen ? -1 : idx)}
                            className={`border ${isOpen ? 'border-[#14B8A6]/30 bg-[#14B8A6]/5' : 'border-white/5 bg-[rgba(0,0,0,0.3)]'} rounded-[16px] transition-all cursor-pointer overflow-hidden group`}
                          >
                             <div className="p-6 flex items-center justify-between">
                                <h4 className={`text-[15px] font-bold tracking-wide ${isOpen ? 'text-[#14B8A6]' : 'text-zinc-200 group-hover:text-white'}`}>{f.q}</h4>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isOpen ? 'border-[#14B8A6]/50 bg-[#14B8A6]/10' : 'border-white/5 bg-white/5'} transition-colors`}>
                                  <ChevronDown size={18} className={`text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#14B8A6]' : ''}`}/>
                                </div>
                             </div>
                             
                             <div className={`px-6 transition-all duration-300 ease-in-out ${isOpen ? 'pb-6 opacity-100 max-h-[300px]' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                <p className="text-[14px] text-zinc-400 leading-[1.8] font-medium pl-5 border-l-2 border-[#14B8A6]/50 relative">
                                   <span className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-[#14B8A6]" />
                                   {f.a}
                                </p>
                             </div>
                          </div>
                        )
                     })}
                  </div>

                  {/* Create Ticket Embed */}
                  <div className="mt-10 pt-8 border-t border-white/5">
                     <h3 className="text-[16px] font-bold text-white mb-6">Open a Support Ticket</h3>
                     <form className="space-y-5">
                       <div className="grid grid-cols-2 gap-5">
                         <div>
                           <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Subject Category</label>
                           <select className="w-full bg-[rgba(0,0,0,0.5)] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#14B8A6] font-medium text-[14px] appearance-none cursor-pointer">
                              <option>API Key Assistance</option>
                              <option>Deposit/Withdrawal Issue</option>
                              <option>Execution Failure / Slippage</option>
                              <option>Other Requirements</option>
                           </select>
                         </div>
                         <div>
                           <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Urgency Level</label>
                           <select className="w-full bg-[rgba(0,0,0,0.5)] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500 font-medium text-[14px] appearance-none cursor-pointer">
                              <option>Standard (24h)</option>
                              <option>High (4h response)</option>
                              <option>Critical (Trading is blocked)</option>
                           </select>
                         </div>
                       </div>
                       
                       <div>
                         <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Detailed Description</label>
                         <textarea 
                           rows={4} 
                           placeholder="Please include transaction hashes or order IDs if applicable..." 
                           className="w-full bg-[rgba(0,0,0,0.5)] border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#14B8A6] font-medium text-[14px] resize-none"
                         />
                       </div>

                       <div className="flex items-center justify-between mt-4 bg-[rgba(0,0,0,0.3)] p-4 rounded-xl border border-white/5 border-dashed">
                          <span className="text-[12px] text-zinc-500 font-medium flex items-center gap-2"><FileText size={16}/> Drag & drop screenshots or terminal logs here</span>
                          <button type="button" className="text-[12px] font-bold text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20">Browse Files</button>
                       </div>

                       <div className="pt-4 flex justify-end">
                         <button type="submit" disabled className="px-10 py-4 bg-[#14B8A6] text-black font-black uppercase tracking-widest rounded-xl hover:brightness-110 shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Send size={16} /> Submit Ticket
                         </button>
                       </div>
                     </form>
                  </div>

               </div>
            </div>

        </div>
      </div>
    </div>
  )
}
