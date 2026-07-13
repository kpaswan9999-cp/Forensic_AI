"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Mail, Lock, User, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple Validation
    if (mode === "signup" && !name) {
      setError("Please enter your name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // Simulate authentication pipeline
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Redirect to Home after showing checkmark
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true");
        }
        router.push("/");
      }, 1000);
    }, 1800);
  };

  return (
    <main className="min-h-screen bg-brand-primary flex items-center justify-center relative p-4 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-secondary via-brand-primary to-brand-primary" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#3B82F6]/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating back home button */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="flex items-center gap-2 group text-text-secondary hover:text-white transition">
          <ShieldAlert className="w-5 h-5 text-accent-cyan" />
          <span className="font-display font-bold text-sm tracking-tight">FORENSIC.AI</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Top subtle glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent" />

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-extrabold text-white">
              {mode === "signin" ? "Access Audit Hub" : "Create Analyst Account"}
            </h1>
            <p className="text-xs text-text-secondary mt-2">
              {mode === "signin" 
                ? "Enter your credentials to enter the forensic dashboard" 
                : "Register to begin logging and auditing digital assertions"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Toggle Name Input for Sign Up */}
            <AnimatePresence initial={false}>
              {mode === "signup" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-1.5"
                >
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#05050A] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-text-muted focus:outline-none focus:border-accent-cyan/40 focus:ring-1 focus:ring-accent-cyan/40 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@forensic.ai"
                  className="w-full bg-[#05050A] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-text-muted focus:outline-none focus:border-accent-cyan/40 focus:ring-1 focus:ring-accent-cyan/40 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</label>
                {mode === "signin" && (
                  <a href="#" className="text-[10px] font-semibold text-accent-cyan hover:underline">Forgot?</a>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#05050A] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-text-muted focus:outline-none focus:border-accent-cyan/40 focus:ring-1 focus:ring-accent-cyan/40 transition-all"
                />
              </div>
            </div>

            {/* Feedback messages */}
            {error && (
              <div className="p-3 bg-accent-rose/10 border border-accent-rose/20 text-accent-rose rounded-lg text-xs flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* Action button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 gradient-button rounded-xl flex items-center justify-center gap-2 text-sm font-semibold mt-6 relative overflow-hidden"
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <RefreshCw size={16} />
                  </motion.div>
                  <span>Verifying Ledger...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={16} className="text-[#121212]" />
                  <span className="text-[#121212]">Analyst Verified</span>
                </>
              ) : (
                <>
                  <span>{mode === "signin" ? "Log In" : "Sign Up"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-6 text-center text-xs text-text-secondary">
            {mode === "signin" ? (
              <>
                New to Forensic.AI?{" "}
                <button onClick={() => setMode("signup")} className="text-accent-cyan font-bold hover:underline">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="text-accent-cyan font-bold hover:underline">
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
