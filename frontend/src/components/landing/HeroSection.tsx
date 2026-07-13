"use client";

import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Play, Shield, Globe2, Activity } from "lucide-react";
import HeroGlobe from "../3d/HeroGlobe";
import Link from "next/link";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-brand-primary">
      {/* Dynamic light backdrop overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-secondary via-brand-primary to-brand-primary" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#3B82F6]/5 via-transparent to-transparent pointer-events-none" />

      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-8 relative z-20 grid lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left Content (Grid Column 7) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-8 text-left"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.05)]"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider text-accent-cyan uppercase font-display">
              OSINT & Fact-Checking Engine Active
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl lg:text-7xl font-display font-extrabold leading-[1.08] tracking-tight text-white"
          >
            Deep-Analysis <br />
            Fact Verification <br />
            <span className="gradient-text">Powered by Gemini.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg text-text-secondary max-w-xl leading-relaxed font-sans"
          >
            Identify misinformation network flows, extract factual claims, and map public propagation networks with enterprise-grade natural language forensics.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Link
              href="/dashboard"
              className="px-8 py-4 gradient-button rounded-full text-base font-bold flex items-center gap-2 group"
            >
              Start Investigation Free
              <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </Link>
            
            <button 
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-how-it-works"));
                }
              }}
              className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all text-base font-semibold flex items-center gap-2 hover:border-white/20 hover:text-white text-text-secondary cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Demo
            </button>
          </motion.div>

          {/* Tech Stats Counters */}
          <motion.div 
            variants={itemVariants}
            className="pt-8 border-t border-white/5 grid grid-cols-3 gap-6 text-left max-w-lg"
          >
            <div>
              <p className="text-2xl font-bold font-display text-white">99.4%</p>
              <p className="text-xs text-text-secondary uppercase tracking-wider mt-1">Accuracy index</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-white">0.24s</p>
              <p className="text-xs text-text-secondary uppercase tracking-wider mt-1">Average Response</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-white">10M+</p>
              <p className="text-xs text-text-secondary uppercase tracking-wider mt-1">Claims Audited</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right 3D Visualizer (Grid Column 5) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 h-[650px] w-full relative hidden lg:block"
        >
          {/* Main 3D Canvas */}
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 7.5], fov: 42 }}>
              <ambientLight intensity={0.4} />
              <HeroGlobe />
            </Canvas>
          </div>

          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-cyan/15 blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="absolute top-1/3 left-2/3 w-64 h-64 bg-accent-purple/10 blur-[100px] rounded-full pointer-events-none -z-10" />
          
          {/* Cyber card overlay widgets */}
          <div className="absolute bottom-12 left-4 glass-card p-4 flex items-center gap-3 backdrop-blur-lg shadow-2xl border border-white/5 max-w-[220px]">
            <div className="p-2 bg-accent-cyan/10 rounded-lg text-accent-cyan">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">System integrity</p>
              <p className="text-sm font-bold text-white">100% Secured</p>
            </div>
          </div>

          <div className="absolute top-24 right-4 glass-card p-4 flex items-center gap-3 backdrop-blur-lg shadow-2xl border border-white/5 max-w-[220px]">
            <div className="p-2 bg-accent-purple/10 rounded-lg text-accent-purple">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Fact Checking</p>
              <p className="text-sm font-bold text-white">Realtime Audit</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
