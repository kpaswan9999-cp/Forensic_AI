"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Sun, Moon, X, FileText, Cpu, Database, ShieldCheck, 
  ArrowRight, Sparkles, Terminal, User, LogOut, LayoutDashboard
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }

    const handleOpen = () => setIsVideoOpen(true);
    window.addEventListener("open-how-it-works", handleOpen);
    return () => {
      window.removeEventListener("open-how-it-works", handleOpen);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      setDropdownOpen(false);
    }
  };

  // Automatic timer loop to highlight flowchart steps in sequence
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVideoOpen) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev < 3 ? prev + 1 : 0));
      }, 3000); // changes highlight every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isVideoOpen]);

  // Background 3D Particle Constellation animation loop
  useEffect(() => {
    if (!isVideoOpen) return;
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();

    // Create 45 float particles
    particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 1
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
      ctx.strokeStyle = "rgba(59, 130, 246, 0.08)";
      ctx.lineWidth = 1;

      // Update positions
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isVideoOpen]);

  const navHeight = useTransform(scrollY, [0, 100], ["80px", "60px"]);
  const navBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(11, 15, 25, 0.4)", "rgba(11, 15, 25, 0.8)"]
  );

  const steps = [
    {
      id: "01",
      icon: <FileText className="w-6 h-6 text-accent-cyan" />,
      title: "Input & Scan",
      desc: "You paste any news segment, WhatsApp message, or social media link into the scanner text box.",
      tech: "Input Scanner Layer"
    },
    {
      id: "02",
      icon: <Cpu className="w-6 h-6 text-accent-purple" />,
      title: "Extract Claims",
      desc: "Our AI automatically parses your text and isolates each individual fact, quote, or claim being asserted.",
      tech: "Gemini LLM Processing"
    },
    {
      id: "03",
      icon: <Database className="w-6 h-6 text-accent-pink" />,
      title: "Auditing Databases",
      desc: "The system matches the claims against thousands of verified news articles and fact-checking registries.",
      tech: "Qdrant Vector Search"
    },
    {
      id: "04",
      icon: <ShieldCheck className="w-6 h-6 text-accent-emerald" />,
      title: "Trust Verdict",
      desc: "You receive an overall credibility rating out of 100 explaining exactly what is true, misleading, or fake.",
      tech: "Consensus Reasoning Logic"
    }
  ];

  return (
    <>
      <motion.nav
        style={{ height: navHeight, backgroundColor: navBg }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 border-b border-white/5 backdrop-blur-md"
      >
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-accent-cyan via-accent-purple to-transparent opacity-40" />

        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldAlert className="w-8 h-8 text-accent-cyan" />
          </motion.div>
          <span className="font-display font-bold text-xl tracking-tighter gradient-text">
            FORENSIC.AI
          </span>
        </Link>

        {/* Navigation tabs */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-secondary">
          <Link href="/" className="hover:text-white transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent-cyan transition-all group-hover:w-full" />
          </Link>
          
          <button 
            onClick={() => setIsVideoOpen(true)}
            className="hover:text-white transition-colors relative group text-left cursor-pointer"
          >
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent-cyan transition-all group-hover:w-full" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <button className="p-2 text-text-secondary hover:text-white transition-colors">
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 dark:hidden" />
            </button>
          )}
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center font-bold text-white shadow-lg border border-white/10 hover:border-accent-cyan/40 transition relative overflow-hidden group"
              >
                {/* Glowing border ring */}
                <div className="absolute inset-0 border border-white/20 group-hover:border-accent-cyan/40 rounded-full transition-colors" />
                A
              </button>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 glass-card p-2 shadow-xl border border-white/10 rounded-2xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/5 space-y-0.5">
                      <p className="text-xs font-bold text-white">Forensic Analyst</p>
                      <p className="text-[10px] text-text-secondary">kpaswan@gmail.com</p>
                    </div>
                    
                    <div className="p-1 space-y-0.5">
                      <Link 
                        href="/dashboard"
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2 transition"
                      >
                        <LayoutDashboard size={14} className="text-accent-cyan" />
                        Analyst Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg text-accent-rose hover:bg-accent-rose/10 flex items-center gap-2 transition text-left"
                      >
                        <LogOut size={14} />
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-2 text-sm gradient-button rounded-full font-semibold"
              >
                Launch App
              </Link>
            </>
          )}
        </div>
      </motion.nav>

      {/* Stepped Walkthrough Flowchart Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-5xl bg-[#090D1A] border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative space-y-8 overflow-hidden"
            >
              {/* Background Particle Canvas */}
              <canvas ref={bgCanvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>

              {/* Title & Concept Description */}
              <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/15 border border-accent-cyan/20 text-accent-cyan text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles size={10} />
                  System Overview
                </div>
                <h3 className="text-3xl font-display font-extrabold text-white">How Forensic.AI Works</h3>
                <p className="text-text-secondary text-sm">
                  Our system verifies assertions automatically across multiple analysis stages. Hover over any block to tilt in 3D.
                </p>
              </div>

              {/* Horizontal Stepped Blocks */}
              <div className="grid md:grid-cols-4 gap-6 relative z-10">
                {steps.map((step, index) => {
                  const isCurrent = activeStep === index;
                  return (
                    <TiltCard
                      key={step.id}
                      step={step}
                      isCurrent={isCurrent}
                      onFocus={() => setActiveStep(index)}
                    />
                  );
                })}
              </div>

              {/* Connector lines indicators */}
              <div className="hidden md:flex justify-between items-center px-12 text-xs text-text-muted font-mono pt-2 relative z-10">
                <span>Scanner Received</span>
                <ArrowRight size={14} className="text-accent-cyan animate-pulse" />
                <span>Claims Isolated</span>
                <ArrowRight size={14} className="text-accent-purple animate-pulse" />
                <span>Evidence Audited</span>
                <ArrowRight size={14} className="text-accent-pink animate-pulse" />
                <span>Score graded</span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Subcomponent: 3D perspective tilting card with inner dynamic glare reflection
function TiltCard({ step, isCurrent, onFocus }: { step: any; isCurrent: boolean; onFocus: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rX: 0, rY: 0 });
  const [glare, setGlare] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position inside element
    const y = e.clientY - rect.top;  // y position inside element

    // Calculate rotation pitch/roll range (-10 to 10 degrees)
    const rX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
    const rY = ((x - rect.width / 2) / (rect.width / 2)) * 10;

    setTilt({ rX, rY });
    setGlare({ x, y, opacity: 0.15 });
    onFocus();
  };

  const handleMouseLeave = () => {
    setTilt({ rX: 0, rY: 0 });
    setGlare({ x: 0, y: 0, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.rX}deg) rotateY(${tilt.rY}deg) scale(${isCurrent ? 1.04 : 1})`,
        transition: "transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease"
      }}
      className={`glass-card p-6 flex flex-col justify-between h-64 border relative overflow-hidden cursor-pointer select-none ${
        isCurrent 
          ? "border-accent-cyan/40 bg-accent-cyan/[0.03] shadow-[0_0_30px_rgba(59,130,246,0.1)]" 
          : "border-white/5 hover:border-white/15"
      }`}
    >
      {/* Glare Sheen Layer */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 120px at ${glare.x}px ${glare.y}px, rgba(255,255,255,${glare.opacity}), transparent)`,
        }}
      />

      {/* Step ID Index */}
      <span className={`absolute top-4 right-4 text-xs font-mono font-bold ${isCurrent ? "text-accent-cyan" : "text-text-muted"}`}>
        {step.id}
      </span>

      {/* Header containing Icon & Step title */}
      <div className="space-y-4">
        <div className={`p-2.5 h-10 w-10 rounded-xl flex items-center justify-center border transition-colors ${
          isCurrent ? "bg-accent-cyan/10 border-accent-cyan/20" : "bg-white/5 border-white/10"
        }`}>
          {step.icon}
        </div>
        <h4 className="text-lg font-bold text-white leading-tight">{step.title}</h4>
      </div>

      {/* Description copy (simple language) */}
      <p className="text-xs text-text-secondary leading-relaxed flex-1 pt-3">
        {step.desc}
      </p>

      {/* Tiny Tech telemetry tag */}
      <div className="border-t border-white/5 pt-3 mt-3 flex items-center gap-1.5 text-[9px] font-mono text-text-muted">
        <Terminal size={10} className="text-accent-cyan" />
        {step.tech}
      </div>
    </div>
  );
}
