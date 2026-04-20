import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../store/userSlice";
import api from "../api";
import toast from "react-hot-toast";
import {
  Zap,
  ArrowRight,
  Activity,
  ShieldCheck,
  BarChart3,
  MoveRight,
  ChevronLeft,
  TerminalSquare,
  Cpu,
  Globe2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Login() {
  const dispatch = useDispatch();
  const [mode, setMode] = useState("select");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    try {
      const user = await api.createUser({
        name: name.trim(),
        email: email.trim(),
      });
      dispatch(setCurrentUser(user));
      toast.success(`Welcome, ${user.name}!`, {
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
        },
      });
    } catch (err) {
      toast.error(err.message, {
        style: {
          background: "#18181b",
          color: "#ef4444",
          border: "1px solid rgba(239,68,68,0.2)",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExisting = async (e) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setLoading(true);
    try {
      let user;
      // TEMPORARY BYPASS FOR FAKE USER
      if (parseInt(userId) === 9999) {
        user = {
          id: 9999,
          name: "Test User",
          email: "test@nexus.com",
          balance: 1000000
        };
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
      } else {
        user = await api.getUser(parseInt(userId));
      }
      
      dispatch(setCurrentUser(user));
      toast.success(`Welcome back, ${user.name}!`, {
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
        },
      });
    } catch (err) {
      toast.error(err.message, {
        style: {
          background: "#18181b",
          color: "#ef4444",
          border: "1px solid rgba(239,68,68,0.2)",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#050505] text-white selection:bg-emerald-500/30 selection:text-white font-sans overflow-hidden">
      {/* VIBRANT BACKGROUND ORBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/15 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/15 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-indigo-500/10 blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 lg:p-16 relative z-10 border-r border-white/5 bg-black/10 backdrop-blur-3xl">
        {/* Subtle Grid overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(circle at center, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 30%, transparent 80%)",
          }}
        />

        {/* Top Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-100 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)] border border-emerald-300/30">
            <TerminalSquare
              size={20}
              className="text-[#050505] fill-[#050505]/20"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Nexus<span className="text-white/50 font-medium">Terminal</span>
          </span>
        </motion.div>

        {/* Center Content */}
        <div className="relative z-10 max-w-xl pr-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-8 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Operational
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6 text-white drop-shadow-sm"
          >
            Institutional-grade <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
              execution engine.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[17px] leading-relaxed text-[#a1a1aa] font-medium mb-10 max-w-[400px]"
          >
            Engineered for high-frequency trading with zero-latency websockets
            and unparalleled reliability.
          </motion.p>

          {/* Premium Data Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Latency Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative p-5 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden group cursor-default shadow-lg backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-400/40 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all duration-300">
                  <Cpu size={18} className="text-emerald-400" />
                </div>

                {/* Micro-sparkline animation */}
                <div className="flex items-end gap-1 h-6 pt-1">
                  <motion.div
                    animate={{ height: ["40%", "100%", "60%", "100%", "40%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                    className="w-1 bg-emerald-500/40 rounded-full"
                  />
                  <motion.div
                    animate={{ height: ["80%", "40%", "100%", "60%", "80%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                    className="w-1 bg-emerald-500/60 rounded-full"
                  />
                  <motion.div
                    animate={{ height: ["60%", "100%", "40%", "80%", "60%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                    className="w-[5px] bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-[13px] uppercase tracking-wider text-[#a1a1aa] font-semibold mb-1">
                  Order Latency
                </h3>
                <p className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-1">
                  1{" "}
                  <span className="text-lg text-emerald-400 font-medium">
                    ms
                  </span>
                </p>
              </div>
            </motion.div>

            {/* SLA Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative p-5 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden group cursor-default shadow-lg backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-400/40 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
                  <Globe2 size={18} className="text-blue-400" />
                </div>

                {/* Live Pulse */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 shadow-inner">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-px">
                    Live
                  </span>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-[13px] uppercase tracking-wider text-[#a1a1aa] font-semibold mb-1">
                  Uptime SLA
                </h3>
                <p className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-1">
                  99.9{" "}
                  <span className="text-lg text-blue-400 font-medium">%</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex justify-between items-center text-xs text-[#71717a] font-medium tracking-widest"
        >
          <p>© 2026 NEXUS INC.</p>
          <div className="flex gap-6 uppercase">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL - Authentication */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        {/* The Glass Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full max-w-[420px] p-8 sm:p-10 rounded-[32px] border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-2xl relative overflow-hidden group"
        >
          {/* Subtle top glare on the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <AnimatePresence mode="wait">
            {/* --- SELECT MODE --- */}
            {mode === "select" && (
              <motion.div
                key="select"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Mobile Logo */}
                <div className="lg:hidden flex justify-center mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    <TerminalSquare
                      size={24}
                      className="text-[#050505] fill-[#050505]/20"
                    />
                  </div>
                </div>

                <div className="mb-8 text-center sm:text-left">
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                    Welcome
                  </h2>
                  <p className="text-[15px] text-[#a1a1aa] font-medium">
                    Authenticate to access your terminal.
                  </p>
                </div>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode("create")}
                    className="w-full group flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#09090b] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors shadow-inner">
                        <BarChart3 size={20} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-white mb-0.5">
                          Create account
                        </h3>
                        <p className="text-xs text-[#a1a1aa] font-medium">
                          Start with ₹1M demo funds
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <MoveRight
                        size={16}
                        className="text-[#71717a] group-hover:text-white transition-colors"
                      />
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode("existing")}
                    className="w-full group flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#09090b] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors shadow-inner">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-white mb-0.5">
                          Sign in
                        </h3>
                        <p className="text-xs text-[#a1a1aa] font-medium">
                          Continue with your User ID
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <MoveRight
                        size={16}
                        className="text-[#71717a] group-hover:text-white transition-colors"
                      />
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* --- CREATE ACCOUNT --- */}
            {mode === "create" && (
              <motion.div
                key="create"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setMode("select")}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                    Provision Workspace
                  </h2>
                  <p className="text-[14px] text-[#a1a1aa] font-medium">
                    Initialize your dedicated trading environment.
                  </p>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white text-[15px] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider ml-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="john@company.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white text-[15px] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full !mt-8 py-3.5 rounded-xl font-bold text-[15px] bg-white text-black hover:bg-[#e4e4e7] transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Provisioning...</span>
                      </div>
                    ) : (
                      <>
                        Initialize <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* --- EXISTING USER --- */}
            {mode === "existing" && (
              <motion.div
                key="existing"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setMode("select")}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                    System Login
                  </h2>
                  <p className="text-[14px] text-[#a1a1aa] font-medium">
                    Verify identity to access terminal.
                  </p>
                </div>

                <form onSubmit={handleExisting} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider ml-1">
                      User ID / Key
                    </label>
                    <input
                      type="number"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                      min="1"
                      placeholder="e.g. 1"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white text-[16px] font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full !mt-8 py-3.5 rounded-xl font-bold text-[15px] bg-white text-black hover:bg-[#e4e4e7] transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <>
                        Authenticate <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
