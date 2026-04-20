import React, { useState, useEffect, useRef } from 'react'
import { Search, Bell, Copy, Plus, Menu, Command, X, LayoutDashboard, LayoutGrid, Briefcase, History, TrendingUp, ChevronRight, Settings as SettingsIcon, HelpCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const fmtCur = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

const NAV_ROUTES = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, desc: 'Global account overview' },
  { name: 'Market', path: '/market', icon: LayoutGrid, desc: 'Real-time crypto prices' },
  { name: 'Trade Execution', path: '/trade', icon: TrendingUp, desc: 'Buy & Sell assets' },
  { name: 'Portfolio', path: '/portfolio', icon: Briefcase, desc: 'Holdings & P&L tracking' },
  { name: 'Orders Timeline', path: '/orders', icon: History, desc: 'Past transaction ledger' },
  { name: 'Settings', path: '/settings', icon: SettingsIcon, desc: 'System preferences & security' },
  { name: 'Support', path: '/support', icon: HelpCircle, desc: 'Knowledge base & ticketing' },
  { name: 'Notifications', path: '/notifications', icon: Bell, desc: 'View system alerts & execution logs' },
]

export default function Header({ onToggleMenu }) {
  const user = useSelector(s => s.user.currentUser)
  const { balance } = useSelector(s => s.portfolio)
  const navigate = useNavigate()

  const activeUser = user || { name: 'Merry Crypto', email: 'hello@nexus.com', id: '0000' };

  // Command Palette State
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  // Filter routes based on query
  const filteredRoutes = query.trim() === '' 
    ? NAV_ROUTES 
    : NAV_ROUTES.filter(r => r.name.toLowerCase().includes(query.toLowerCase()) || r.desc.toLowerCase().includes(query.toLowerCase()));

  // Keyboard Shortcuts Mapping
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(prev => !prev)
      }
      
      // Inside Search Palette logic
      if (isSearchOpen) {
        if (e.key === 'Escape') {
          setIsSearchOpen(false)
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => (prev < filteredRoutes.length - 1 ? prev + 1 : prev))
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (filteredRoutes.length > 0) {
            navigate(filteredRoutes[selectedIndex].path)
            setIsSearchOpen(false)
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, filteredRoutes, selectedIndex, navigate])

  // Reset selected index when query changes, and focus input when modal opens
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isSearchOpen])

  return (
    <>
      <header className="h-[80px] flex items-center justify-between px-6 lg:px-10 flex-shrink-0 bg-[rgba(3,3,3,0.6)] border-b border-white/5 backdrop-blur-2xl sticky top-0 z-40 transition-all">
        
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={onToggleMenu}
            className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors bg-white/5 border border-white/10"
          >
            <Menu size={20} />
          </button>
          <span className="text-white font-bold tracking-tight text-lg">Nexus</span>
        </div>

        {/* Left: Profile + Balances */}
        <div className="hidden md:flex items-center gap-8">
          
          {/* Real Image Profile Identifier */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/10 group-hover:border-[#34D399] transition-all duration-300 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[15px] font-bold text-white leading-tight group-hover:text-[#34D399] transition-colors">
                {activeUser.name}
              </h2>
              <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 font-medium mt-0.5">
                <span>{activeUser.email}</span>
                <Copy size={12} className="cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Global Balance Quick View - Minimalist variant */}
          <div className="hidden lg:flex flex-col border-l border-white/10 pl-8 h-[36px] justify-center">
            <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-1">Total Balance</span>
            <span className="text-[16px] font-black text-white tracking-wide leading-none">{fmtCur(balance || 0)}</span>
          </div>
        </div>

        {/* Right: Polished Actions */}
        <div className="flex items-center gap-4">
          
          {/* Command Palette Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hidden lg:flex items-center gap-3 h-10 px-4 rounded-xl text-zinc-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 shadow-sm"
          >
            <Search size={16} />
            <span className="text-sm font-medium">Search features...</span>
            <div className="flex items-center gap-1 ml-4 text-[11px] font-bold tracking-widest border border-white/10 bg-black/40 px-2 py-0.5 rounded shadow-inner">
              <Command size={10} /> K
            </div>
          </button>

          {/* Mobile Search Icon */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden flex relative w-10 h-10 rounded-full items-center justify-center text-zinc-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 shadow-sm"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
          <button 
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 shadow-sm"
          >
            <Bell size={18} />
            {/* Subtle Glowing Dot */}
            <span className="absolute top-[10px] right-[10px] w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] border border-[#030303]" />
          </button>

          {/* Glossy Premium CTA */}
          <button className="ml-2 px-6 h-10 rounded-full flex items-center gap-2 font-bold text-sm text-[#030303] bg-gradient-to-r from-[#34D399] to-[#10B981] hover:from-[#10B981] hover:to-[#059669] shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-[1px]">
            <span className="hidden sm:inline">Deposit Funds</span>
            <Plus size={18} strokeWidth={3} className="sm:hidden" />
            <Plus size={18} strokeWidth={2.5} className="hidden sm:block" />
          </button>
        </div>
      </header>

      {/* --- Global Command Palette Overlay --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 anim-fade">
          {/* Heavy Backdrop Blur + Dim */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
          
          {/* Main Modal */}
          <div className="relative w-full max-w-[650px] bg-[rgba(15,15,18,0.95)] backdrop-blur-3xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.8)] border border-white/10" style={{ borderRadius: '24px' }}>
            
            {/* Header / Input Area */}
            <div className="flex items-center px-6 h-16 border-b border-white/5 relative">
              <Search className="text-zinc-400 mr-4 flex-shrink-0" size={20} />
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, tools, or assets..."
                className="flex-1 bg-transparent border-none outline-none text-white text-[16px] placeholder:text-zinc-600 font-medium"
              />
              <div className="flex items-center justify-center border border-white/10 bg-white/5 px-2 py-0.5 rounded ml-4 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">ESC</span>
              </div>
            </div>

            {/* List Results Area */}
            <div className="max-h-[350px] overflow-y-auto p-3 scrollbar-hide">
              {filteredRoutes.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center">
                   <div className="w-12 h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center mb-4">
                     <Search size={20} className="text-zinc-600" />
                   </div>
                   <p className="text-zinc-400 font-bold text-[14px]">No results found.</p>
                   <p className="text-zinc-600 text-[12px] mt-1">Try searching for "Market" or "Trade".</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-4">Platform Pages</div>
                  {filteredRoutes.map((route, index) => {
                    const isSelected = selectedIndex === index;
                    const Icon = route.icon;
                    return (
                      <button
                        key={route.path}
                        onClick={() => {
                          navigate(route.path);
                          setIsSearchOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                          isSelected ? 'bg-white/10 shadow-sm border border-white/5' : 'bg-transparent border border-transparent hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#34D399]/20 text-[#34D399]' : 'bg-zinc-800 text-zinc-400'}`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className={`text-[14px] font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{route.name}</p>
                            <p className="text-[12px] text-zinc-500 font-medium">{route.desc}</p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-zinc-400 tracking-wider">ENTER</span>
                             <ChevronRight className="text-[#34D399]" size={18} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="px-6 py-3 border-t border-white/5 flex items-center gap-6" style={{ background: 'rgba(0,0,0,0.4)' }}>
              <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold">
                <div className="border border-white/10 bg-white/5 px-1.5 py-0.5 rounded shadow-sm">↑</div>
                <div className="border border-white/10 bg-white/5 px-1.5 py-0.5 rounded shadow-sm">↓</div>
                <span>to navigate</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold">
                <div className="border border-white/10 bg-white/5 px-2 py-0.5 rounded shadow-sm">↵</div>
                <span>to select</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
