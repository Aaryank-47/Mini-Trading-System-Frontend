import React, { useState, useRef } from 'react'
import { Settings as SettingsIcon, User, Shield, Bell, Key, Smartphone, Moon, History, LogOut, CheckCircle2, ShieldAlert, FileKey, Copy, Fingerprint, Eye, Zap, Plus } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '../store/userSlice'

export default function Settings() {
  const user = useSelector(s => s.user.currentUser)
  const dispatch = useDispatch()
  const containerRef = useRef(null)
  
  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    containerRef.current.style.setProperty('--mouse-x', `${x}px`)
    containerRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  const [activeTab, setActiveTab] = useState('profile')

  const TABS = [
    { id: 'profile', label: 'Identity Profile', icon: User, desc: 'Manage your KYC and basic identity' },
    { id: 'security', label: 'Security & Auth', icon: Shield, desc: '2FA, Biometrics, and Active Sessions' },
    { id: 'apikeys', label: 'Developer API', icon: Key, desc: 'Manage keys for algorithmic trading' },
    { id: 'preferences', label: 'App Preferences', icon: SettingsIcon, desc: 'Theme, routing, and UI settings' },
  ]

  // Mock sessions
  const sessions = [
    { device: 'MacBook Pro 16"', os: 'macOS Sonoma', browser: 'Chrome', active: true, ip: '192.168.1.45', loc: 'New York, USA', time: 'Active Now' },
    { device: 'iPhone 15 Pro', os: 'iOS 17.2', browser: 'Nexus Mobile App', active: false, ip: '172.56.21.9', loc: 'New York, USA', time: '2 hours ago' }
  ]

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[calc(100vh-60px)] overflow-hidden font-sans pb-16" 
      onMouseMove={handleMouseMove}
      style={{ '--mouse-x': '-1000px', '--mouse-y': '-1000px' }}
    >
      
      {/* Background Masking System - Silver / Slate Institutional Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 min-h-screen" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div className="fixed inset-0 pointer-events-none z-0 min-h-screen" style={{ backgroundImage: `linear-gradient(to right, rgba(148, 163, 184, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.35) 1px, transparent 1px)`, backgroundSize: '60px 60px', maskImage: `radial-gradient(700px circle at var(--mouse-x) var(--mouse-y), black, transparent)`, WebkitMaskImage: `radial-gradient(700px circle at var(--mouse-x) var(--mouse-y), black, transparent)` }} />
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-screen min-h-screen" style={{ background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(148, 163, 184, 0.06), transparent 50%)` }} />

      <div className="relative z-10 max-w-[1300px] mx-auto space-y-8 pt-8 px-4 md:px-8 anim-fade">
        
        {/* Massive 3D Header Component */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="px-2.5 py-1 rounded-md bg-[#94A3B8]/10 border border-[#94A3B8]/30 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse shadow-[0_0_5px_#34D399]" />
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-widest">Account Configured</span>
                 </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white drop-shadow-md">
                 System Configurations
              </h1>
           </div>

           <div className="flex items-center gap-4 bg-[rgba(10,10,12,0.8)] border border-white/10 px-5 py-3 rounded-[16px] backdrop-blur-md shadow-lg">
               <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-inner">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" alt="profile" className="w-full h-full object-cover scale-110" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[14px] font-black text-white">{user?.name || "Merry Crypto"}</span>
                  <span className="text-[12px] font-bold text-zinc-500">ID: NXS-8492001</span>
               </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Pro Sidebar Menu */}
          <div className="lg:col-span-4 order-2 lg:order-1 space-y-6">
            <div className="relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.8)] backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-3">
               {TABS.map(tab => {
                 const isActive = activeTab === tab.id;
                 return (
                   <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-[16px] transition-all duration-300 text-left mb-1 group relative overflow-hidden ${
                      isActive ? 'bg-[#94A3B8]/10 shadow-inner' : 'hover:bg-white/5'
                    }`}
                   >
                     {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[#94A3B8] rounded-r-md shadow-[0_0_10px_#94A3B8]" />}
                     
                     <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-[#94A3B8] text-black shadow-lg' : 'bg-white/5 border border-white/5 text-zinc-400 group-hover:text-white'}`}>
                       <tab.icon size={20} />
                     </div>
                     <div className="flex flex-col">
                       <span className={`text-[15px] font-black tracking-wide ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>{tab.label}</span>
                       <span className={`text-[11px] font-medium leading-tight mt-0.5 ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>{tab.desc}</span>
                     </div>
                   </button>
                 )
               })}
            </div>

            <button 
              onClick={() => dispatch(clearUser())}
              className="w-full relative overflow-hidden rounded-[20px] border border-[#EF4444]/20 bg-[rgba(10,10,12,0.8)] backdrop-blur-3xl shadow-lg p-5 flex items-center justify-between group hover:border-[#EF4444]/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-all"
            >
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-[12px] bg-[#EF4444]/10 flex items-center justify-center border border-[#EF4444]/20 group-hover:bg-[#EF4444] group-hover:text-white text-[#EF4444] transition-colors">
                   <LogOut size={16} />
                 </div>
                 <div className="flex flex-col text-left">
                    <span className="font-bold text-[14px] text-[#EF4444]">Sign Out Securely</span>
                    <span className="text-[11px] font-medium text-zinc-500">Terminate all active web sessions</span>
                 </div>
               </div>
            </button>
          </div>

          {/* Epic Main Content Container */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,12,0.8)] backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] min-h-[600px] flex flex-col">
              
              {/* Profile State */}
              {activeTab === 'profile' && (
                <div className="p-10 anim-fade-1 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                     <h2 className="text-[24px] font-black text-white tracking-tight">Identity Profile</h2>
                     <span className="px-3 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold uppercase tracking-widest border border-[#10B981]/20 flex items-center gap-2">
                       <CheckCircle2 size={12}/> KYC Verified
                     </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
                    <div className="relative w-28 h-28 rounded-full border-4 border-white/5 overflow-hidden group cursor-pointer shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <span className="text-[11px] font-bold text-white uppercase tracking-widest">Change</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                       <h3 className="text-xl font-bold text-white">Public Profile</h3>
                       <p className="text-sm text-zinc-400 font-medium">This information will be displayed on P2P trading boards if enabled.</p>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest pl-1">Legal Name</label>
                        <input type="text" defaultValue={user?.name || "Merry Crypto"} className="w-full bg-[rgba(0,0,0,0.4)] border border-white/10 rounded-[14px] px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#94A3B8] transition-all font-bold text-[15px] shadow-inner" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative">
                          <input type="email" defaultValue={user?.email || "hello@nexus.com"} disabled className="w-full bg-[rgba(0,0,0,0.6)] border border-white/5 rounded-[14px] px-5 py-4 text-zinc-500 cursor-not-allowed font-bold text-[15px]" />
                          <Shield size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                        </div>
                        <span className="text-[11px] text-rose-500 font-medium pl-1">Contact support to change email.</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                    <button className="px-8 py-4 rounded-[14px] bg-gradient-to-r from-[#94A3B8] to-[#64748B] text-white font-black uppercase tracking-widest text-[13px] hover:brightness-110 shadow-[0_10px_20px_rgba(148,163,184,0.3)] transition-all">
                      Save Profile Status
                    </button>
                  </div>
                </div>
              )}

              {/* Security State */}
              {activeTab === 'security' && (
                <div className="p-10 anim-fade-1 h-full">
                   <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                     <h2 className="text-[24px] font-black text-white tracking-tight">Security & Auth Protocol</h2>
                   </div>

                   {/* Security Score Widget */}
                   <div className="relative overflow-hidden bg-gradient-to-br from-[#10B981]/10 to-[rgba(0,0,0,0.5)] border border-[#10B981]/20 rounded-[20px] p-6 mb-8 flex items-center justify-between shadow-inner">
                      <div className="absolute right-0 top-0 w-64 h-64 bg-[#10B981]/5 rounded-full blur-[40px] pointer-events-none" />
                      <div className="relative z-10 w-full flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="relative w-16 h-16 flex items-center justify-center">
                            {/* SVG Progress Circle */}
                            <svg className="w-16 h-16 transform -rotate-90">
                               <circle cx="32" cy="32" r="28" stroke="rgba(16,185,129,0.2)" strokeWidth="6" fill="transparent" />
                               <circle cx="32" cy="32" r="28" stroke="#10B981" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset="40" className="animate-[spin_2s_ease-out]" />
                            </svg>
                            <span className="absolute font-black text-white text-[16px]">85%</span>
                          </div>
                          <div>
                            <h3 className="text-[16px] font-black text-white drop-shadow-md tracking-wide">Account Security: High</h3>
                            <p className="text-[12px] font-medium text-[#34D399]">1 security recommendation pending.</p>
                          </div>
                        </div>
                        <button className="px-5 py-2.5 rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] font-bold text-[12px] hover:bg-[#10B981] hover:text-black transition-colors uppercase tracking-widest hidden sm:block">
                           Review
                        </button>
                      </div>
                   </div>

                   <h3 className="text-[12px] font-black text-zinc-500 uppercase tracking-widest mb-4">Multi-Factor Authentication</h3>
                   <div className="space-y-3 mb-10">
                     <div className="flex items-center justify-between p-5 rounded-[16px] border border-[#94A3B8]/20 bg-[rgba(255,255,255,0.02)] transition-colors">
                       <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-[12px] bg-[#94A3B8]/10 border border-[#94A3B8]/20 flex items-center justify-center"><Fingerprint size={20} className="text-[#94A3B8]" /></div>
                         <div className="flex flex-col">
                           <p className="font-black text-[15px] text-white">Biometric Login</p>
                           <p className="text-[12px] text-zinc-400 font-medium leading-relaxed">Require TouchID/FaceID upon opening the terminal.</p>
                         </div>
                       </div>
                       <div className="w-14 h-7 rounded-full bg-[#10B981] relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                          <div className="absolute right-1 top-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
                       </div>
                     </div>

                     <div className="flex items-center justify-between p-5 rounded-[16px] border border-white/5 bg-[rgba(255,255,255,0.02)] transition-colors">
                       <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-[12px] bg-zinc-800 border border-white/10 flex items-center justify-center"><Key size={20} className="text-zinc-500" /></div>
                         <div className="flex flex-col">
                           <p className="font-black text-[15px] text-white">Hardware Key (YubiKey)</p>
                           <p className="text-[12px] text-zinc-400 font-medium leading-relaxed mt-0.5">Physical USB/NFC key required for withdrawals.</p>
                         </div>
                       </div>
                       <button className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-bold text-[12px] hover:bg-white/10 transition-colors">Setup</button>
                     </div>
                   </div>

                   <h3 className="text-[12px] font-black text-zinc-500 uppercase tracking-widest mb-4">Active Sessions</h3>
                   <div className="space-y-3">
                      {sessions.map((ses, i) => (
                        <div key={i} className="flex justify-between items-center p-5 rounded-[16px] border border-white/5 bg-[rgba(0,0,0,0.3)]">
                           <div className="flex items-center gap-4">
                             <MonitorIcon type={ses.browser} active={ses.active} />
                             <div className="flex flex-col">
                               <p className="text-[14px] font-bold text-white flex items-center gap-2">
                                 {ses.device} 
                                 {ses.active && <span className="bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded text-[9px] uppercase tracking-widest border border-[#10B981]/30">Current</span>}
                               </p>
                               <p className="text-[12px] text-zinc-500 font-medium mt-1">{ses.loc} • {ses.ip}</p>
                             </div>
                           </div>
                           <div className="text-right flex flex-col items-end">
                              <p className={`text-[12px] font-bold ${ses.active ? 'text-[#34D399]' : 'text-zinc-500'}`}>{ses.time}</p>
                              {!ses.active && <button className="text-[11px] font-bold text-rose-500 mt-1 hover:underline">Revoke</button>}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Developer APIs State */}
              {activeTab === 'apikeys' && (
                <div className="p-10 anim-fade-1 h-full flex flex-col">
                   <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                     <div className="flex flex-col">
                       <h2 className="text-[24px] font-black text-white tracking-tight">Algorithmic API Keys</h2>
                       <p className="text-sm font-medium text-zinc-500 flex items-center gap-2 mt-1">
                         <Zap size={14} className="text-[#94A3B8]" /> High-Frequency limit: 50 req/sec
                       </p>
                     </div>
                     <button className="px-6 py-3 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[12px] hover:brightness-90 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex items-center gap-2">
                       <Plus size={16}/> Create API Key
                     </button>
                   </div>
                   
                   <div className="flex-1 flex flex-col items-center justify-center py-10">
                      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                         <div className="absolute inset-0 border-[3px] border-dashed border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                         <div className="w-20 h-20 bg-white/5 rounded-full border border-white/10 flex items-center justify-center shadow-lg">
                           <FileKey size={32} className="text-zinc-500" />
                         </div>
                      </div>
                      <p className="text-[18px] font-black tracking-tight text-white mb-2">No Active Keys Generated</p>
                      <p className="text-[13px] text-zinc-500 text-center max-w-[320px] leading-relaxed font-medium">Generate an API key to connect automated trading bots, Python scripts, or third-party portfolio trackers to your Nexus institutional account.</p>
                   </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                 <div className="p-10 anim-fade-1 h-full">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                      <h2 className="text-[24px] font-black text-white tracking-tight">Application Preferences</h2>
                    </div>

                    <div className="space-y-8">
                       <div className="p-6 rounded-[20px] bg-[rgba(0,0,0,0.3)] border border-white/5">
                          <h3 className="text-[14px] font-bold text-white mb-4">Interface Theme</h3>
                          <div className="grid grid-cols-2 gap-4 max-w-[400px]">
                            <div className="border-2 border-[#94A3B8] bg-black/60 rounded-xl p-4 cursor-pointer flex flex-col items-center gap-2 shadow-[0_0_20px_rgba(148,163,184,0.1)] relative">
                               <div className="absolute top-2 right-2 w-4 h-4 bg-[#94A3B8] rounded-full border-2 border-black flex items-center justify-center">
                                 <div className="w-1.5 h-1.5 bg-black rounded-full" />
                               </div>
                               <Moon size={24} className="text-[#94A3B8]" />
                               <span className="text-[12px] font-black text-white uppercase tracking-widest mt-1">Dark Mode</span>
                            </div>
                            <div className="border-2 border-white/5 bg-white/5 rounded-xl p-4 cursor-not-allowed flex flex-col items-center gap-2 opacity-40">
                               <Moon size={24} className="text-zinc-500" />
                               <span className="text-[12px] font-black text-white uppercase tracking-widest mt-1">Light Mode</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-4">Note: Light mode disabled for institutional safety.</p>
                       </div>
                    </div>
                 </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MonitorIcon({ type, active }) {
  return (
    <div className={`w-12 h-12 rounded-[14px] bg-white/5 border ${active ? 'border-[#34D399]/30' : 'border-white/10'} flex items-center justify-center relative`}>
      <Smartphone size={20} className={active ? 'text-[#34D399]' : 'text-zinc-500'} />
    </div>
  )
}
