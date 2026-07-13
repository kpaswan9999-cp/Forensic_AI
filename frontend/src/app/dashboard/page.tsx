"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, History as HistoryIcon, Network, Activity, Settings as SettingsIcon, 
  Bell, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ShieldAlert, 
  Share2, BarChart2, Server, HelpCircle, Info, RefreshCw, Sliders, Check,
  Home, ArrowRight, ShieldCheck, Database
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "new" | "history" | "network" | "analytics" | "settings">("overview");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);

  // Session Route Guard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        router.push("/login");
      } else {
        setIsAuthChecking(false);
      }
    }
  }, [router]);


  
  // Custom mock history list
  const [investigationHistory, setInvestigationHistory] = useState([
    {
      id: 1,
      text: "Elon Musk bought Twitter in 2022 for $44 billion and renamed it to X.",
      date: "Just now",
      score: 85,
      verdict: "TRUE"
    },
    {
      id: 2,
      text: "WhatsApp forward: ATMs to close for 3 days starting tomorrow.",
      date: "2 hours ago",
      score: 10,
      verdict: "FALSE"
    },
    {
      id: 3,
      text: "Scientists confirm drinking bleach cures COVID-19.",
      date: "1 day ago",
      score: 5,
      verdict: "FALSE"
    }
  ]);

  // Loading logs sequence to simulate deep forensics
  const loadingSteps = [
    "Initializing Forensic Pipeline...",
    "Extracting assertions & named entities...",
    "Connecting to Fact-Checking registries...",
    "Querying News and Media indexes...",
    "Calculating source integrity ratios...",
    "Gemini model performing reasoning consensus...",
    "Compiling final reports..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
      
      // Prepend to history
      const newHistoryItem = {
        id: Date.now(),
        text: text.length > 60 ? text.substring(0, 60) + "..." : text,
        date: "Just now",
        score: data.overall_score || 50,
        verdict: data.overall_score > 70 ? "TRUE" : data.overall_score > 40 ? "PARTIALLY_TRUE" : "FALSE"
      };
      setInvestigationHistory(prev => [newHistoryItem, ...prev]);

    } catch (err: any) {
      setError(err.message || "Failed to connect to the backend API.");
    } finally {
      setLoading(false);
    }
  };

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case "TRUE":
        return "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
      case "FALSE":
        return "bg-accent-rose/10 text-accent-rose border-accent-rose/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
      default:
        return "bg-accent-amber/10 text-accent-amber border-accent-amber/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "TRUE":
        return <CheckCircle2 size={16} />;
      case "FALSE":
        return <XCircle size={16} />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-secondary via-brand-primary to-brand-primary" />
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <RefreshCw className="w-8 h-8 text-accent-cyan" />
          </motion.div>
          <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Verifying Authorization Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-primary text-text-primary flex font-sans selection:bg-accent-cyan/20">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-brand-secondary m-4 hidden lg:flex flex-col rounded-3xl overflow-hidden h-[calc(100vh-32px)] sticky top-4">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <ShieldAlert className="w-6 h-6 text-accent-cyan group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-display font-extrabold text-lg tracking-tight gradient-text">FORENSIC.AI</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveTab("overview")} className="w-full text-left">
            <NavItem icon={<Home size={18} />} label="Overview Hub" active={activeTab === "overview"} />
          </button>
          <button onClick={() => setActiveTab("new")} className="w-full text-left">
            <NavItem icon={<Search size={18} />} label="New Investigation" active={activeTab === "new"} />
          </button>
          <button onClick={() => setActiveTab("history")} className="w-full text-left">
            <NavItem icon={<HistoryIcon size={18} />} label="Audit History" active={activeTab === "history"} />
          </button>
          <button onClick={() => setActiveTab("network")} className="w-full text-left">
            <NavItem icon={<Network size={18} />} label="Source Network" active={activeTab === "network"} />
          </button>
          <button onClick={() => setActiveTab("analytics")} className="w-full text-left">
            <NavItem icon={<Activity size={18} />} label="Analytics Suite" active={activeTab === "analytics"} />
          </button>
          <button onClick={() => setActiveTab("settings")} className="w-full text-left">
            <NavItem icon={<SettingsIcon size={18} />} label="System Config" active={activeTab === "settings"} />
          </button>
        </nav>
        
        {/* Pro Badge & Account info */}
        <div className="p-4 m-4 rounded-2xl bg-brand-tertiary border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan">Resume Active</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-accent-cyan/10 text-accent-cyan rounded">PRO</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Gemini Flash 3.5 API and full vector engine active.
          </p>
        </div>

        <div className="p-4 border-t border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center font-bold text-white shadow-lg">
            A
          </div>
          <div>
            <p className="text-sm font-semibold">Forensic Analyst</p>
            <p className="text-xs text-text-secondary">kpaswan@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen max-w-6xl mx-auto p-4 lg:p-8 w-full overflow-hidden">
        
        {/* Topbar */}
        <header className="flex justify-between items-center mb-8 bg-brand-secondary/40 p-4 rounded-2xl border border-white/5 backdrop-blur-lg">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-text-secondary">
            <span>Core Hub</span>
            <span className="text-text-muted">/</span>
            <span className="text-text-primary capitalize">{activeTab === "overview" ? "Overview" : activeTab === "new" ? "Investigation" : activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-emerald/5 border border-accent-emerald/20 text-accent-emerald text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse"></span>
              Live Pipeline Active
            </div>
            <button className="p-2 rounded-full hover:bg-white/5 transition text-text-secondary hover:text-white">
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Tab Contents */}
        <div className="flex-1 flex flex-col">
          
          {/* TAB 0: Overview Hub (Default Page) */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              {/* Welcome Banner */}
              <div className="glass-card p-6 lg:p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 via-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold bg-accent-cyan/10 text-accent-cyan px-2.5 py-1 rounded uppercase tracking-wider font-mono">Control Panel</span>
                    <h2 className="text-3xl font-display font-extrabold text-white">Welcome back, Analyst</h2>
                    <p className="text-text-secondary text-sm max-w-xl">
                      Monitor claims databases, verify assertions with Google Gemini, and examine media networks from a unified dashboard.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 shrink-0">
                    <button 
                      onClick={() => setActiveTab("new")}
                      className="px-6 py-3 gradient-button rounded-full text-xs font-bold flex items-center gap-2"
                    >
                      <Search size={14} />
                      Start New Audit
                    </button>
                  </div>
                </div>
              </div>

              {/* Status and Analytics grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card p-6 space-y-4 border-l-2 border-l-accent-cyan">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Semantic Database</p>
                    <Database size={16} className="text-accent-cyan" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-display font-extrabold text-white">Qdrant Indexed</p>
                    <p className="text-xs text-accent-emerald font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald"></span>
                      124,102 Records Live
                    </p>
                  </div>
                </div>

                <div className="glass-card p-6 space-y-4 border-l-2 border-l-accent-purple">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Verification Core</p>
                    <Server size={16} className="text-accent-purple" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-display font-extrabold text-white">Gemini 3.5 Flash</p>
                    <p className="text-xs text-text-secondary">RAG Validation Enabled</p>
                  </div>
                </div>

                <div className="glass-card p-6 space-y-4 border-l-2 border-l-accent-emerald">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">System Integrity</p>
                    <ShieldCheck size={16} className="text-accent-emerald" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-display font-extrabold text-white">100% Secured</p>
                    <p className="text-xs text-accent-emerald font-semibold">Audit logs verified</p>
                  </div>
                </div>
              </div>

              {/* Main row grid split (Recent audits + Quick links) */}
              <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Left: Recent Audits list */}
                <div className="lg:col-span-8 glass-card p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-display font-bold text-white">Recent Audits</h3>
                    <button onClick={() => setActiveTab("history")} className="text-xs font-bold text-accent-cyan hover:underline flex items-center gap-1">
                      View Ledger <ArrowRight size={12} />
                    </button>
                  </div>

                  <div className="divide-y divide-white/5">
                    {investigationHistory.slice(0, 3).map((item) => (
                      <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-white line-clamp-1">"{item.text}"</h4>
                          <p className="text-xs text-text-muted">{item.date}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${getVerdictStyles(item.verdict)}`}>
                            {item.verdict.replace("_", " ")}
                          </span>
                          <span className="text-sm font-bold font-mono text-white">{item.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Quick Tools */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="glass-card p-6 space-y-4">
                    <h3 className="text-md font-display font-bold text-white">Quick Tools</h3>
                    
                    <button 
                      onClick={() => setActiveTab("network")}
                      className="w-full p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-accent-cyan/30 transition-all text-left flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Network size={12} className="text-accent-cyan" />
                          Source Network
                        </p>
                        <p className="text-[11px] text-text-secondary">Map misinformation propagation</p>
                      </div>
                      <ArrowRight size={14} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button 
                      onClick={() => setActiveTab("analytics")}
                      className="w-full p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-accent-purple/30 transition-all text-left flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Activity size={12} className="text-accent-purple" />
                          Analytics Suite
                        </p>
                        <p className="text-[11px] text-text-secondary">Analyze audit volumes and categories</p>
                      </div>
                      <ArrowRight size={14} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          )}
          
          {/* TAB 1: New Investigation */}
          {activeTab === "new" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              <div className="glass-card p-6 lg:p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 via-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <h2 className="text-2xl font-display font-bold mb-1">Verify Digital Content</h2>
                <p className="text-text-secondary text-sm mb-6">Extract claims, run hybrid RAG matches, and cross-reference information instantly.</p>
                
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste a WhatsApp forward, tweet, news headline, or article segment here to fact-check..."
                    className="w-full h-44 bg-[#05050A] border border-white/10 rounded-2xl p-6 text-white placeholder-text-muted focus:outline-none focus:border-accent-cyan/40 focus:ring-1 focus:ring-accent-cyan/40 transition-all resize-none shadow-inner leading-relaxed"
                  />
                  <div className="absolute bottom-4 right-4 text-xs font-mono text-text-muted">
                    {text.length} chars
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-text-secondary flex items-center gap-1.5 cursor-help">
                      <Server size={12} className="text-accent-cyan" />
                      Gemini 3.5 Flash
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-text-secondary flex items-center gap-1.5">
                      <Share2 size={12} className="text-accent-purple" />
                      Social Scraper
                    </span>
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || text.length === 0}
                    className="px-8 py-3.5 gradient-button rounded-full flex items-center gap-2 text-sm font-semibold"
                  >
                    {loading ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <RefreshCw className="w-4 h-4" />
                        </motion.div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Run Forensics</span>
                      </>
                    )}
                  </button>
                </div>

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 rounded-xl bg-brand-tertiary/50 border border-white/5 flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-cyan"></span>
                    </span>
                    <div className="flex-1">
                      <p className="text-xs text-text-secondary font-mono">
                        {loadingSteps[loadingStep]}
                      </p>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <div className="mt-6 p-4 bg-accent-rose/10 border border-accent-rose/20 text-accent-rose rounded-xl flex items-center gap-3 text-sm">
                    <AlertTriangle size={16} /> {error}
                  </div>
                )}
              </div>

              {/* Dynamic Results Dashboard */}
              <AnimatePresence>
                {result && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    
                    {/* Overall Audit Result */}
                    <div className="glass-card p-6 lg:p-8 grid md:grid-cols-3 gap-8 items-center border-l-4 border-l-accent-cyan">
                      <div className="col-span-2 space-y-4">
                        <div>
                          <span className="text-[10px] font-bold bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded uppercase tracking-widest font-mono">Forensic Verdict</span>
                          <h3 className="text-2xl font-display font-bold text-white mt-2">Audit Investigation Complete</h3>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          Analyzed {result.claims_analyzed} factual statements found inside the text. Verdict metrics calculated via network verification.
                        </p>
                        
                        {result.risk_flags && result.risk_flags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {result.risk_flags.map((flag: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-accent-rose/10 border border-accent-rose/20 text-accent-rose rounded-full text-xs font-semibold">
                                ⚠️ {flag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-center justify-center border-l border-white/5 pl-8">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                            <motion.circle
                              initial={{ strokeDashoffset: 352 }}
                              animate={{ strokeDashoffset: 352 - (352 * result.overall_score) / 100 }}
                              transition={{ duration: 1.2 }}
                              cx="64" cy="64" r="56"
                              stroke="currentColor" strokeWidth="6" fill="transparent"
                              strokeDasharray="352"
                              className={
                                result.overall_score > 70 ? "text-accent-emerald" :
                                result.overall_score > 40 ? "text-accent-amber" : "text-accent-rose"
                              }
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-display font-bold tracking-tighter text-white">{result.overall_score}</span>
                            <span className="text-[10px] text-text-secondary uppercase">Score</span>
                          </div>
                        </div>
                        <div className={`mt-4 px-4 py-1 rounded-full font-bold text-xs border uppercase tracking-wider ${
                          result.overall_score > 70 ? "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20" :
                          result.overall_score > 40 ? "bg-accent-amber/10 text-accent-amber border-accent-amber/20" : 
                          "bg-accent-rose/10 text-accent-rose border-accent-rose/20"
                        }`}>
                          {result.grade}
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Claims */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-display font-semibold text-white">Segmented Claims Verdict</h3>
                      
                      <div className="grid gap-4">
                        {result.detailed_results?.map((item: any, i: number) => {
                          const isExpanded = expandedClaim === i;
                          return (
                            <div key={i} className="glass-card overflow-hidden">
                              <div className="p-5 flex justify-between items-start gap-4 border-b border-white/5">
                                <div className="space-y-1">
                                  <p className="text-xs text-text-secondary font-mono">Claim #{i+1}</p>
                                  <h4 className="text-base font-semibold leading-relaxed text-white">"{item.claim}"</h4>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-wide ${getVerdictStyles(item.verdict)}`}>
                                    {getVerdictIcon(item.verdict)}
                                    {item.verdict.replace("_", " ")}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="bg-[#0A0A14]/60 p-5 space-y-4">
                                <div>
                                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Forensic Reasoning</p>
                                  <p className="text-sm text-text-secondary leading-relaxed">{item.summary}</p>
                                </div>

                                {item.corrected_claim && (
                                  <div className="p-4 bg-accent-emerald/5 border border-accent-emerald/15 rounded-xl space-y-1.5 shadow-inner">
                                    <p className="text-[10px] font-bold text-accent-emerald uppercase tracking-wider flex items-center gap-1.5">
                                      <CheckCircle2 size={12} />
                                      Factual Context / Correct News
                                    </p>
                                    <p className="text-xs text-text-primary leading-relaxed">
                                      {item.corrected_claim}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* TAB 2: History */}
          {activeTab === "history" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-display font-bold mb-2">Audit Ledger</h3>
                <p className="text-text-secondary text-sm mb-6">Historical record of all fact-check operations run on this system.</p>
                
                <div className="divide-y divide-white/5">
                  {investigationHistory.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white line-clamp-1">"{item.text}"</h4>
                        <p className="text-xs text-text-muted">{item.date}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded border uppercase tracking-wider font-semibold ${getVerdictStyles(item.verdict)}`}>
                          {item.verdict.replace("_", " ")}
                        </span>
                        <span className="text-sm font-bold font-mono text-white">{item.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Source Network Map */}
          {activeTab === "network" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-display font-bold mb-1">Information Flow Graph</h3>
                <p className="text-text-secondary text-sm mb-6">Dynamic mapping showing nodes that propagate checked claims across networks.</p>
                
                <div className="relative w-full h-[450px] rounded-2xl bg-[#04040A] border border-white/5 overflow-hidden flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full">
                    <line x1="200" y1="200" x2="350" y2="120" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="200" y1="200" x2="180" y2="350" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="2" />
                    <line x1="350" y1="120" x2="500" y2="180" stroke="rgba(255, 0, 127, 0.2)" strokeWidth="1.5" />
                    <line x1="180" y1="350" x2="320" y2="280" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2" />
                    <line x1="320" y1="280" x2="500" y2="180" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.5" />
                    <line x1="200" y1="200" x2="320" y2="280" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
                    
                    <circle cx="200" cy="200" r="14" fill="#3B82F6" className="animate-pulse" />
                    <circle cx="200" cy="200" r="28" stroke="#3B82F6" strokeWidth="1" fill="transparent" opacity="0.4" />
                    
                    <circle cx="350" cy="120" r="10" fill="#6366F1" />
                    <circle cx="180" cy="350" r="12" fill="#FF007F" />
                    <circle cx="500" cy="180" r="8" fill="#F59E0B" />
                    <circle cx="320" cy="280" r="9" fill="#3B82F6" />
                    
                    <text x="220" y="205" fill="#FFF" fontSize="11" fontWeight="bold">SOURCE POINT (Claim)</text>
                    <text x="365" y="125" fill="#94A3B8" fontSize="10">Reuters Index</text>
                    <text x="195" y="355" fill="#94A3B8" fontSize="10">Reddit Threads</text>
                    <text x="515" y="185" fill="#94A3B8" fontSize="10">Twitter Bots (Low Trust)</text>
                    <text x="335" y="285" fill="#94A3B8" fontSize="10">AP Verify API</text>
                  </svg>
                  
                  <div className="absolute top-4 right-4 glass-card p-4 space-y-2 border border-white/10 max-w-[200px] text-xs">
                    <p className="font-bold text-white uppercase tracking-wider">Network Metrics</p>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Node Count:</span>
                      <span className="text-white font-bold">14 Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Risk Factor:</span>
                      <span className="text-accent-rose font-bold">Low Propagation</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: Analytics */}
          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card p-6 space-y-2">
                  <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Detection Rate</p>
                  <p className="text-3xl font-display font-extrabold text-white">99.4%</p>
                  <p className="text-xs text-accent-emerald font-semibold">+0.2% vs previous model</p>
                </div>
                <div className="glass-card p-6 space-y-2">
                  <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Audit Confidence</p>
                  <p className="text-3xl font-display font-extrabold text-white">88.2%</p>
                  <p className="text-xs text-text-secondary">Weighted validation average</p>
                </div>
                <div className="glass-card p-6 space-y-2">
                  <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Vector Index size</p>
                  <p className="text-3xl font-display font-extrabold text-white">124k</p>
                  <p className="text-xs text-accent-purple font-semibold">Qdrant records indexed</p>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-display font-bold mb-2">Audits Over Time</h3>
                <p className="text-text-secondary text-sm mb-6">Volume of claims verified per category weekly.</p>
                
                <div className="w-full h-64 rounded-xl bg-[#04040A] p-4 flex flex-col justify-between border border-white/5">
                  <div className="flex-1 flex items-end gap-6 pt-4 px-2">
                    {[
                      { week: "W1", politics: 60, health: 40 },
                      { week: "W2", politics: 80, health: 50 },
                      { week: "W3", politics: 75, health: 90 },
                      { week: "W4", politics: 110, health: 70 },
                      { week: "W5", politics: 95, health: 80 }
                    ].map((data, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full flex justify-center gap-1.5 h-full items-end max-h-[160px]">
                          <div 
                            className="w-4 rounded-t bg-gradient-to-t from-accent-purple to-accent-pink shadow-[0_0_10px_rgba(99,102,241,0.2)]" 
                            style={{ height: `${(data.politics / 120) * 100}%` }} 
                          />
                          <div 
                            className="w-4 rounded-t bg-gradient-to-t from-accent-cyan to-[#00A8FF] shadow-[0_0_10px_rgba(59,130,246,0.2)]" 
                            style={{ height: `${(data.health / 120) * 100}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-mono text-text-secondary">{data.week}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-white/5 pt-4 flex gap-4 text-xs font-semibold text-text-secondary">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-accent-purple" /> Politics claims</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-accent-cyan" /> Health & Biotech</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 5: Settings */}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass-card p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-display font-bold mb-1">System Architecture Settings</h3>
                  <p className="text-text-secondary text-sm">Configure core limits, vector DB scopes, and fallback rules.</p>
                </div>
                
                <div className="space-y-4 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center py-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-white">Default Logic Model</p>
                      <p className="text-xs text-text-secondary">Choose the model for semantic reasoning</p>
                    </div>
                    <select className="bg-brand-tertiary border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-accent-cyan">
                      <option>Gemini 3.5 Flash (Default)</option>
                      <option>Gemini 3.1 Pro (Heavy)</option>
                      <option>Mock Demo Mode</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center py-3 border-t border-white/5">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-white">Vector Storage Indexing</p>
                      <p className="text-xs text-text-secondary">Scope of Qdrant vector database query limits</p>
                    </div>
                    <input 
                      type="number" 
                      defaultValue={10} 
                      className="w-16 bg-brand-tertiary border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white text-center focus:outline-none focus:border-accent-cyan"
                    />
                  </div>

                  <div className="flex justify-between items-center py-3 border-t border-white/5">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-white">Enable Cache Logs</p>
                      <p className="text-xs text-text-secondary">Saves queries temporarily in Redis for performance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-cyan"></div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
      active 
        ? "bg-gradient-to-r from-accent-cyan/15 to-transparent text-accent-cyan border-l-2 border-accent-cyan" 
        : "text-text-secondary hover:text-white hover:bg-white/5 border-l-2 border-transparent"
    }`}>
      {icon}
      {label}
    </div>
  );
}
