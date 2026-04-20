import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BarChart2, Activity, Briefcase, ListOrdered, Settings, LogOut, HelpCircle, X, Crown } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { clearUser } from '../store/userSlice'

export default function Sidebar({ isOpen, setIsOpen }) {
  const dispatch = useDispatch()
  
  const handleSignOut = () => {
    dispatch(clearUser())
  }
  const mainNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Markets', path: '/market', icon: BarChart2 },
    { name: 'Trade', path: '/trade', icon: Activity },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Orders', path: '/orders', icon: ListOrdered },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[90] md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-[100] flex flex-col h-full flex-shrink-0 w-[240px] 
        bg-[#050505] border-r border-[#1C1C1D] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Header / Logo */}
        <div className="h-[80px] flex items-center justify-between px-6 border-b border-[#1C1C1D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center bg-[#10B981] rounded-3xl">
              <span className="font-extrabold text-[#050505] text-[16px] tracking-tight -mb-[1px]">NX</span>
            </div>
            <span className="text-[16px] font-bold tracking-tight text-white">
              Nexus Terminal
            </span>
          </div>
          <button 
            onClick={() => setIsOpen && setIsOpen(false)}
            className="md:hidden text-[#71717A] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-5 flex flex-col">
          <div className="px-4 mb-2">
            <span className="text-[10px] font-bold text-[#52525B] uppercase tracking-wider pl-3">Menu</span>
          </div>
          
          <nav className="flex flex-col space-y-1 px-3">
            {mainNav.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-colors outline-none
                  ${isActive 
                    ? 'bg-[#1E1E1E] text-white font-medium' 
                    : 'text-[#8B8B93] hover:text-white hover:bg-[#121212] font-medium'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon size={18} className={isActive ? 'text-[#10B981]' : 'text-[#8B8B93]'} strokeWidth={isActive ? 2 : 1.5} />
                    <span className="text-[14px]">{link.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="px-4 mb-2 mt-8">
            <span className="text-[10px] font-bold text-[#52525B] uppercase tracking-wider pl-3">Preferences</span>
          </div>
          
          <nav className="flex flex-col space-y-1 px-3 mb-auto">
            <NavLink
              to="/settings"
              onClick={() => setIsOpen && setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-colors outline-none
                ${isActive 
                  ? 'bg-[#1E1E1E] text-white font-medium' 
                  : 'text-[#8B8B93] hover:text-white hover:bg-[#121212] font-medium'}`
              }
            >
              {({ isActive }) => (
                <>
                   <Settings size={18} className={isActive ? 'text-white' : 'text-[#8B8B93]'} strokeWidth={1.5} />
                   <span className="text-[14px]">Settings</span>
                </>
              )}
            </NavLink>
            
            <NavLink
              to="/support"
              onClick={() => setIsOpen && setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-colors outline-none
                ${isActive 
                  ? 'bg-[#1E1E1E] text-white font-medium' 
                  : 'text-[#8B8B93] hover:text-white hover:bg-[#121212] font-medium w-full text-left'}`
              }
            >
              {({ isActive }) => (
                <>
                  <HelpCircle size={18} className={isActive ? 'text-white' : 'text-[#8B8B93]'} strokeWidth={1.5} />
                  <span className="text-[14px]">Support</span>
                </>
              )}
            </NavLink>
          </nav>
          
          <div className="px-4 mt-6">
            <div className="p-3.5 rounded-[12px] relative overflow-hidden border border-[#D4AF37]/20 bg-gradient-to-br from-[#1A1813] to-[#0A0A0A] group">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(253,224,139,0.03),transparent)] pointer-events-none" />
              <div className="flex items-center gap-2 mb-1.5 relative z-10">
                <Crown size={15} className="text-[#D4AF37]" strokeWidth={2.5} />
                <span className="text-[11px] font-black text-[#FDE08B] tracking-widest uppercase">Nexus Pro</span>
              </div>
              <p className="text-[11px] text-[#8B8B93] font-medium leading-[1.4] mb-3 relative z-10">
                Unlock 0% taker fees and real-time indicators.
              </p>
              <button className="relative z-10 w-full py-1.5 rounded-md bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold text-[12px] hover:brightness-110 transition-all shadow-[0_4px_10px_rgba(212,175,55,0.2)]">
                Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#1C1C1D]">
          <button 
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[8px] text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E] transition-colors border border-transparent hover:border-[#333] font-medium text-[13px]"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
