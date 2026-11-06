"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  ArrowRight,
  RotateCcw,
  Heart,
  Award,
  Zap,
  ShieldCheck,
  Flame,
  Laugh,
  MessageCircle,
  Stars,
  Compass,
  Lock,
  Unlock,
  Loader2,
  Gift,
  CheckCircle2,
  Download,
  Volume2,
  VolumeX,
  Camera,
} from "lucide-react";
import { TOOL_THEMES, ToolThemeConfig } from "@/lib/tool-themes";

interface ResultClientViewProps {
  session: {
    id: string;
    toolType: string;
    status: string;
    fullResult?: Record<string, any> | null;
    preview?: any;
    paidAt?: any;
    pricePaise?: number;
    isFirstFree?: boolean;
  };
}

/**
 * Synthesizes a magical 5-note celestial chord chime using the native Web Audio API.
 * 100% self-contained: No external audio assets or network requests needed.
 */
function playCelebrationChime() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Ascending celestial frequencies: C5, E5, G5, B5, C6
    const frequencies = [523.25, 659.25, 783.99, 987.77, 1046.5];
    const now = ctx.currentTime;

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.09);

      // Bell chime envelope
      gain.gain.setValueAtTime(0.001, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.09 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.95);
    });
  } catch {
    // Graceful fallback if audio is blocked by browser autoplay policy
  }
}

export function ResultClientView({ session: initialSession }: ResultClientViewProps) {
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState(initialSession);
  const [copied, setCopied] = useState(false);
  const [paying, setPaying] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const chimePlayedRef = useRef(false);

  const isUnlocked = currentSession.status === "PAID" && Boolean(currentSession.fullResult);
  const data = currentSession.fullResult || {};
  const toolType = currentSession.toolType || "LOVE_CALCULATOR";
  const theme: ToolThemeConfig = TOOL_THEMES[toolType] || TOOL_THEMES.LOVE_CALCULATOR;

  // Extract names
  const name1 = data.name1 || (currentSession.preview?.teaserText?.match(/for (.*?) &/)?.[1]) || "";
  const name2 = data.name2 || (currentSession.preview?.teaserText?.match(/& (.*?)!/)?.[1]) || "";
  const singleName = data.name || (currentSession.preview?.teaserText?.match(/for (.*?)!/)?.[1]) || "";

  // Sound effect on reveal
  useEffect(() => {
    if (isUnlocked && soundEnabled && !chimePlayedRef.current) {
      chimePlayedRef.current = true;
      const timer = setTimeout(() => {
        playCelebrationChime();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked, soundEnabled]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playCelebrationChime();
    }
  };

  // Prepare share text
  const shareScore = data.score !== undefined ? `${data.score}%` : "";
  const shareTitle = data.title || data.category || data.fictionalArchetype || theme.name;
  const pairNames = name1 && name2 ? `${name1} & ${name2}` : singleName ? singleName : "Me";

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `https://funreveal.com/result/${currentSession.id}`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleWhatsAppShare = () => {
    const url = getShareUrl();
    const text = shareScore
      ? `💖 OMG! Our compatibility score is ${shareScore}! ✨\n${pairNames} = ${shareTitle} 💕\n\nCheck your result on FunReveal:\n${url}`
      : `✨ Check out my FunReveal result for ${theme.name}!\n${pairNames} = ${shareTitle} 🔮\n\nSee it here:\n${url}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FunReveal - ${theme.name}`,
          text: `Check out our ${shareScore ? `${shareScore} ` : ""}${theme.name} result!`,
          url,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  /**
   * Generates a 1080x1350 High-Resolution Instagram Story / WhatsApp Status Card
   * Directly client-side via HTML5 Canvas and triggers instant PNG download.
   */
  const handleDownloadStoryCard = async () => {
    setGeneratingImage(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      // 1. Cosmic Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
      bgGrad.addColorStop(0, "#0c0317");
      bgGrad.addColorStop(0.5, "#18062b");
      bgGrad.addColorStop(1, "#07010f");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1350);

      // 2. Ambient Glow Halos
      const glow1 = ctx.createRadialGradient(250, 250, 10, 250, 250, 450);
      glow1.addColorStop(0, "rgba(236, 72, 153, 0.22)");
      glow1.addColorStop(1, "transparent");
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, 1080, 1350);

      const glow2 = ctx.createRadialGradient(850, 950, 10, 850, 950, 450);
      glow2.addColorStop(0, "rgba(168, 85, 247, 0.22)");
      glow2.addColorStop(1, "transparent");
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, 1080, 1350);

      // 3. Decorative Frame & Border
      ctx.strokeStyle = "rgba(168, 85, 247, 0.35)";
      ctx.lineWidth = 3;
      ctx.strokeRect(50, 50, 980, 1250);

      // Corner Accents
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 5;
      const cornerSize = 40;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(50, 50 + cornerSize);
      ctx.lineTo(50, 50);
      ctx.lineTo(50 + cornerSize, 50);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(1030 - cornerSize, 50);
      ctx.lineTo(1030, 50);
      ctx.lineTo(1030, 50 + cornerSize);
      ctx.stroke();
      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(50, 1300 - cornerSize);
      ctx.lineTo(50, 1300);
      ctx.lineTo(50 + cornerSize, 1300);
      ctx.stroke();
      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(1030 - cornerSize, 1300);
      ctx.lineTo(1030, 1300);
      ctx.lineTo(1030, 1300 - cornerSize);
      ctx.stroke();

      // 4. Header Top Text
      ctx.fillStyle = "#d8b4fe";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "center";
      ctx.fillText("✦ FUNREVEAL // OFFICIAL COMPATIBILITY REPORT ✦", 540, 120);

      // 5. Tool Name
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 42px sans-serif";
      ctx.fillText(theme.name.toUpperCase(), 540, 180);

      // 6. Names Showcase Card
      ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
      ctx.strokeStyle = "rgba(236, 72, 153, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(140, 220, 800, 90, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 36px sans-serif";
      if (name1 && name2) {
        ctx.fillText(`${name1}   💕   ${name2}`, 540, 278);
      } else {
        ctx.fillText(`✨ ${pairNames}'s Profile`, 540, 278);
      }

      // 7. Circular Score Ring Gauge or Talisman
      const centerX = 540;
      const centerY = 550;
      const arcRadius = 150;

      if (scoreNum !== null) {
        // Track
        ctx.beginPath();
        ctx.arc(centerX, centerY, arcRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 22;
        ctx.stroke();

        // Glowing Score Arc
        const scoreEndAngle = -Math.PI / 2 + (scoreNum / 100) * (2 * Math.PI);
        ctx.beginPath();
        ctx.arc(centerX, centerY, arcRadius, -Math.PI / 2, scoreEndAngle);
        const arcGrad = ctx.createLinearGradient(350, 400, 700, 700);
        arcGrad.addColorStop(0, "#ec4899");
        arcGrad.addColorStop(0.5, "#a855f7");
        arcGrad.addColorStop(1, "#06b6d4");
        ctx.strokeStyle = arcGrad;
        ctx.lineWidth = 22;
        ctx.lineCap = "round";
        ctx.stroke();

        // Score Text
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 100px sans-serif";
        ctx.fillText(`${scoreNum}%`, centerX, centerY + 25);

        ctx.fillStyle = "#f472b6";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText("COMPATIBILITY INDEX", centerX, centerY + 65);
      } else if (data.luckyNumber !== undefined) {
        // Lucky Number Display
        ctx.beginPath();
        ctx.arc(centerX, centerY, arcRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
        ctx.strokeStyle = data.luckyColour?.hex || "#10b981";
        ctx.lineWidth = 8;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "900 110px sans-serif";
        ctx.fillText(`${data.luckyNumber}`, centerX, centerY + 35);
      }

      // 8. Verdict / Archetype Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 38px sans-serif";
      const titleText = data.title || data.category || data.fictionalArchetype || "High Compatibility";
      ctx.fillText(`“${titleText}”`, 540, 770);

      // 9. Synergy Dynamic Pillars
      const pillars = data.funAspects || data.vibePillars || data.domesticSynergy;
      if (pillars) {
        const entries = Object.entries(pillars).slice(0, 4);
        entries.forEach(([key, val], idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const px = 140 + col * 420;
          const py = 850 + row * 110;

          // Box
          ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
          ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(px, py, 380, 85, 16);
          ctx.fill();
          ctx.stroke();

          // Label
          ctx.textAlign = "left";
          ctx.fillStyle = "#e9d5ff";
          ctx.font = "bold 20px sans-serif";
          ctx.fillText(key.charAt(0).toUpperCase() + key.slice(1), px + 20, py + 38);

          // Value
          ctx.textAlign = "right";
          ctx.fillStyle = "#f472b6";
          ctx.font = "900 22px sans-serif";
          ctx.fillText(`${val}%`, px + 360, py + 38);

          // Bar
          ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
          ctx.fillRect(px + 20, py + 52, 340, 10);
          ctx.fillStyle = "#ec4899";
          ctx.fillRect(px + 20, py + 52, (Number(val) / 100) * 340, 10);
        });
      }

      // 10. Bottom Verified Watermark
      ctx.textAlign = "center";
      ctx.fillStyle = "#c084fc";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("✨ Generated on FunReveal.com • Test Your Bond ✨", 540, 1180);

      ctx.fillStyle = "rgba(216, 180, 254, 0.5)";
      ctx.font = "16px sans-serif";
      ctx.fillText("Entertainment & Cosmic Amusement Only", 540, 1220);

      // 11. Trigger Download
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Blob conversion failed");
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const cleanName = pairNames.replace(/[^a-zA-Z0-9]/g, "_");
        a.href = blobUrl;
        a.download = `FunReveal-${cleanName}-Certificate.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, "image/png");
    } catch (err: unknown) {
      console.error("Story card generation failed:", err);
      alert("Could not generate story card. Please try again.");
    } finally {
      setGeneratingImage(false);
    }
  };

  // Payment unlock handler (₹1)
  const handleUnlockPayment = async () => {
    setPaying(true);
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: currentSession.id }),
      });

      const order = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(order.message || "Failed to initiate payment");
      }

      // If demo mode or test order (local dev without Razorpay credentials)
      if (order.isDemo) {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: currentSession.id,
            razorpayOrderId: order.orderId,
            razorpayPaymentId: "pay_demo",
            razorpaySignature: "demo_sig",
          }),
        });

        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          const targetId = verifyData.unlockedSessionId || currentSession.id;
          if (targetId !== currentSession.id) {
            window.history.replaceState(null, "", `/result/${targetId}`);
          }
          const freshRes = await fetch(`/api/session/${targetId}`);
          const freshData = await freshRes.json();
          setCurrentSession(freshData);
          if (soundEnabled) playCelebrationChime();
          return;
        }
      }

      // Load official Razorpay checkout script dynamically
      const loadScript = () =>
        new Promise((resolve) => {
          if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

      await loadScript();

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "FunReveal",
        description: `Unlock ${theme.name} Report (₹1)`,
        order_id: order.orderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: currentSession.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            const targetId = verifyData.unlockedSessionId || currentSession.id;
            if (targetId !== currentSession.id) {
              window.history.replaceState(null, "", `/result/${targetId}`);
            }
            const freshRes = await fetch(`/api/session/${targetId}`);
            const freshData = await freshRes.json();
            setCurrentSession(freshData);
            if (soundEnabled) playCelebrationChime();
          }
        },
        prefill: {},
        theme: { color: "#ec4899" },
      };

      const RazorpayClass = (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay;
      const rzp = new RazorpayClass(options);
      rzp.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment process failed.";
      alert(msg);
    } finally {
      setPaying(false);
    }
  };

  // SVG Radial Gauge calculation
  const scoreNum = typeof data.score === "number" ? Math.min(Math.max(data.score, 0), 100) : null;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = scoreNum !== null ? circumference - (scoreNum / 100) * circumference : 0;

  // Next recommended tools
  const recommendedTools = [
    { name: "Love Calculator", href: "/tools/love-calculator", emoji: "💖", desc: "Calculate romantic compatibility" },
    { name: "Best Friend Test", href: "/tools/best-friend-test", emoji: "🏆", desc: "Interactive bond quiz" },
    { name: "Future Partner", href: "/tools/future-partner", emoji: "💫", desc: "Fictional soulmate generator" },
    { name: "Lucky Number", href: "/tools/lucky-number", emoji: "🍀", desc: "Lucky numbers & fortune vibes" },
  ].filter((t) => !t.href.includes(toolType.toLowerCase().replace(/_/g, "-")));

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden py-8 sm:py-12 lg:py-16">
      {/* Dynamic Ambient Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-3xl opacity-25 bg-gradient-to-br ${theme.ambientBg}`}
        />
        <div
          className={`absolute top-1/2 -right-32 w-[650px] h-[650px] rounded-full blur-3xl opacity-25 bg-gradient-to-tl ${theme.ambientBg}`}
        />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 bg-purple-900/40" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* First Free Result Celebratory Banner */}
        {currentSession.isFirstFree && isUnlocked && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/20 border border-emerald-500/40 text-center shadow-lg animate-in fade-in">
            <p className="text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
              <Gift className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>🎉 Welcome Gift: Your 1st Result is 100% FREE! (Next calculations are just ₹1)</span>
            </p>
          </div>
        )}

        {/* Top Floating Certificate Ribbon & Sound FX Toggle */}
        <div className="text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-emerald-500/15 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg shadow-purple-950/50">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin shrink-0" />
              <span>
                {isUnlocked ? (
                  <>
                    <span className="sm:hidden">COMPATIBILITY CERTIFICATE</span>
                    <span className="hidden sm:inline">OFFICIAL FUNREVEAL CERTIFICATE OF COMPATIBILITY</span>
                  </>
                ) : (
                  <>
                    <span className="sm:hidden">REPORT CALCULATED & READY</span>
                    <span className="hidden sm:inline">COMPATIBILITY REPORT CALCULATED & READY</span>
                  </>
                )}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-pink-300 shrink-0" />
            </div>

            {/* Sound FX Toggle Button */}
            <button
              type="button"
              onClick={toggleSound}
              title={soundEnabled ? "Mute Cosmic Chimes" : "Unmute Cosmic Chimes"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-purple-500/40 text-purple-200 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                  <span className="hidden sm:inline">Audio: On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-purple-400/60" />
                  <span className="hidden sm:inline">Audio: Muted</span>
                </>
              )}
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>
              {theme.name}
            </span>
          </h1>

          {/* Prominent Names Showcase */}
          {name1 && name2 ? (
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-4 pt-2 max-w-full">
              <div
                className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-white/10 border border-pink-500/40 backdrop-blur-md shadow-lg text-white font-extrabold text-base sm:text-xl md:text-2xl tracking-wide max-w-[130px] sm:max-w-[180px] md:max-w-xs truncate text-center"
                title={name1}
              >
                {name1}
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/40 animate-pulse text-lg sm:text-xl">
                {toolType === "FRIENDSHIP_CALCULATOR" || toolType === "BEST_FRIEND_TEST" ? "🤝" : "💘"}
              </div>
              <div
                className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-white/10 border border-purple-500/40 backdrop-blur-md shadow-lg text-white font-extrabold text-base sm:text-xl md:text-2xl tracking-wide max-w-[130px] sm:max-w-[180px] md:max-w-xs truncate text-center"
                title={name2}
              >
                {name2}
              </div>
            </div>
          ) : singleName ? (
            <div className="pt-2 max-w-full px-2">
              <span
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl bg-white/10 border border-purple-500/40 backdrop-blur-md text-white font-black text-lg sm:text-2xl tracking-wide shadow-lg inline-block max-w-full truncate"
                title={singleName}
              >
                ✨ {singleName}&apos;s Cosmic Profile
              </span>
            </div>
          ) : null}
        </div>

        {/* ======================================================== */}
        {/* CASE 1: LOCKED STATE (SUBSEQUENT RESULTS: ₹1 TO UNLOCK) */}
        {/* ======================================================== */}
        {!isUnlocked && (
          <div className="relative rounded-3xl bg-gradient-to-b from-purple-950/80 via-slate-950/90 to-purple-950/90 border-2 border-pink-500/50 p-6 sm:p-10 lg:p-12 shadow-[0_0_60px_rgba(236,72,153,0.3)] backdrop-blur-2xl text-center space-y-8 overflow-hidden">
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Full Personalized Report Sealed & Ready</span>
            </div>

            {/* Glowing Golden Lock & Masked Meter */}
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute -inset-8 rounded-full bg-pink-500/20 blur-3xl animate-pulse" />
              <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-purple-900/60 to-pink-900/60 border-4 border-pink-500/40 flex flex-col items-center justify-center shadow-2xl relative">
                <span className="text-5xl font-black text-pink-300 tracking-wider blur-[2px] select-none">
                  ?? %
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-200/80 mt-1">
                  COMPATIBILITY
                </span>
                <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-amber-500 text-purple-950 font-black text-[11px] shadow-lg flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>SEALED</span>
                </div>
              </div>
            </div>

            {/* Teaser Headline */}
            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Unlock Your Full Compatibility Report
              </h2>
              <p className="text-purple-200/80 text-sm sm:text-base leading-relaxed">
                Your deterministic scores, chemistry archetype, and deep pillars are calculated. Unlock instant access for just{" "}
                <span className="text-pink-300 font-extrabold">₹1 (1 Rupee)</span>!
              </p>
            </div>

            {/* What's Inside Checklist */}
            <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {[
                "Exact Compatibility %",
                "Cosmic Chemistry Archetype",
                "4 Synergy Dynamic Pillars",
                "Detailed Relationship Story",
                "Downloadable Story Certificate Card",
                "48-Hour Full Access",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.04] border border-purple-700/40 flex items-center gap-2.5 text-xs sm:text-sm text-purple-200 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Prominent ₹1 Unlock Button */}
            <div className="max-w-md mx-auto pt-2 space-y-3">
              <button
                type="button"
                onClick={handleUnlockPayment}
                disabled={paying}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-lg sm:text-xl shadow-[0_0_35px_rgba(236,72,153,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
              >
                {paying ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                    <span>Initiating Payment (₹1)...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-6 h-6 text-yellow-300 animate-pulse" />
                    <span>Pay ₹1 & Unlock Report Now</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-purple-300/70 font-medium">
                <span className="flex items-center gap-1">⚡ Instant Unlock</span>
                <span>•</span>
                <span className="flex items-center gap-1">🔒 UPI / GPay / PhonePe / Cards</span>
                <span>•</span>
                <span className="flex items-center gap-1">₹1 Only</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CASE 2: UNLOCKED STATE (GRAND CERTIFICATE / FULL REPORT) */}
        {/* ======================================================== */}
        {isUnlocked && (
          <div className="relative rounded-3xl bg-gradient-to-b from-purple-950/70 via-slate-950/80 to-purple-950/90 border-2 border-purple-500/40 p-6 sm:p-10 lg:p-12 shadow-[0_0_60px_rgba(168,85,247,0.25)] backdrop-blur-2xl overflow-hidden">
            {/* Decorative Corner Holographic Brackets */}
            <div className="hidden sm:block absolute top-4 left-4 text-purple-400/40 font-mono text-xs select-none">
              ✦ FUNREVEAL // VERIFIED REPORT
            </div>
            <div className="hidden sm:block absolute top-4 right-4 text-purple-400/40 font-mono text-xs select-none">
              ALGORITHM V1.0 ✦
            </div>

            <div className="space-y-8 sm:space-y-10">
              {/* 1. SCORE GAUGE / HERO STATUS */}
              {scoreNum !== null && (
                <div className="text-center pt-2">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    {/* Glowing background halo */}
                    <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-violet-500/30 blur-2xl animate-pulse" />

                    {/* SVG Animated Circular Progress Gauge */}
                    <svg className="w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 -rotate-90 transform drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                      <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="14"
                        fill="transparent"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="url(#scoreGradient)"
                        strokeWidth="14"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Center Score Counter */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="flex items-baseline">
                        <span className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter drop-shadow-md">
                          {scoreNum}
                        </span>
                        <span className="text-2xl sm:text-3xl text-pink-400 font-extrabold ml-1">%</span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-purple-300/80 mt-1">
                        COMPATIBILITY INDEX
                      </span>
                    </div>
                  </div>

                  {/* Score Status Badge */}
                  {data.title && (
                    <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                      &ldquo;{data.title}&rdquo;
                    </h2>
                  )}

                  {/* Categories */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {data.category && (
                      <Badge className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-extrabold text-sm shadow-lg shadow-pink-500/25">
                        🌟 {data.category}
                      </Badge>
                    )}
                    {data.friendshipCategory && (
                      <Badge className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-purple-500/25">
                        👑 {data.friendshipCategory}
                      </Badge>
                    )}
                    {data.communicationCategory && (
                      <Badge className="px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25">
                        💬 {data.communicationCategory}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* 2. SPECIAL TOOL: LUCKY NUMBER SHOWCASE */}
              {data.luckyNumber !== undefined && (
                <div className="text-center py-4">
                  <div className="relative inline-flex items-center justify-center mb-5">
                    <div
                      className="w-40 h-40 rounded-3xl flex items-center justify-center text-7xl font-black text-white shadow-2xl transition-transform hover:scale-105"
                      style={{
                        background: `radial-gradient(circle, ${data.luckyColour?.hex || "#10b981"}55, rgba(15,23,42,0.8))`,
                        border: `3px solid ${data.luckyColour?.hex || "#10b981"}`,
                        boxShadow: `0 0 50px ${data.luckyColour?.hex || "#10b981"}50`,
                      }}
                    >
                      {data.luckyNumber}
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    Cosmic Lucky Number: <span className="text-emerald-400">{data.luckyNumber}</span>
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: data.luckyColour?.hex || "#10b981" }}
                      />
                      Lucky Color: {data.luckyColour?.name || "Emerald"}
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold">
                      📅 Best Day: {data.luckyDayOfWeek || "Friday"}
                    </span>
                  </div>
                </div>
              )}

              {/* 3. SPECIAL TOOL: FUTURE PARTNER PROFILE */}
              {data.fictionalArchetype && (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-purple-950/50 to-pink-950/50 border border-indigo-500/40 text-center shadow-xl">
                  <p className="text-indigo-300 text-xs font-mono font-bold uppercase tracking-widest mb-2">
                    ✦ FICTIONAL SOULMATE PERSONA ✦
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                    {data.fictionalArchetype}
                  </h2>
                  {data.aestheticVibe && (
                    <p className="text-pink-200 text-base sm:text-lg italic font-medium max-w-xl mx-auto">
                      &ldquo;{data.aestheticVibe}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {/* VIRAL SHARE & STORY CARD DOWNLOAD STATION */}
              <div className="p-4 sm:p-6 rounded-2xl bg-purple-900/20 border border-purple-700/40 backdrop-blur-md">
                <div className="text-center mb-4">
                  <p className="text-white font-bold text-sm flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Share Your Certificate with Friends & Post on Stories!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* WhatsApp Direct Share Button */}
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="inline-flex items-center justify-center gap-2.5 px-4 sm:px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-green-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-transparent shrink-0" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Download Instagram/Snapchat Story Card Button */}
                  <button
                    type="button"
                    onClick={handleDownloadStoryCard}
                    disabled={generatingImage}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-pink-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {generatingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-white shrink-0" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-white shrink-0" />
                        <span>Download Story Card</span>
                      </>
                    )}
                  </button>

                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="sm:col-span-2 lg:col-span-1 inline-flex items-center justify-center gap-2.5 px-4 sm:px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-purple-500/40 text-white font-bold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="text-emerald-300">Link Copied! ✨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 text-purple-300 shrink-0" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* DETAILED VERDICT STORY & COMMENTARY */}
              {(data.description || data.partnerPersonality) && (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-purple-500/30 backdrop-blur-md relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Stars className="w-5 h-5 text-pink-400" />
                    <h3 className="text-white font-black text-lg tracking-tight">Cosmic Dynamic Analysis</h3>
                  </div>
                  <p className="text-purple-200/90 text-sm sm:text-base leading-relaxed">
                    {data.description || data.partnerPersonality}
                  </p>
                </div>
              )}

              {/* BEST FRIEND QUIZ SPECIFIC BREAKDOWN */}
              {data.resultExplanation && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-purple-500/30 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-purple-900/40 border border-purple-600/40 rounded-2xl p-4">
                      <p className="text-4xl font-black text-amber-400">
                        {data.matchingCount}/{data.totalQuestions}
                      </p>
                      <p className="text-purple-300/80 text-xs mt-1 font-bold uppercase tracking-wider">
                        Matching Answers
                      </p>
                    </div>
                    <div className="bg-purple-900/40 border border-purple-600/40 rounded-2xl p-4">
                      <p className="text-4xl font-black text-pink-400">{data.score}%</p>
                      <p className="text-purple-300/80 text-xs mt-1 font-bold uppercase tracking-wider">
                        Friendship Score
                      </p>
                    </div>
                  </div>
                  <p className="text-purple-200/90 text-sm sm:text-base leading-relaxed text-center italic">
                    &ldquo;{data.resultExplanation}&rdquo;
                  </p>
                </div>
              )}

              {/* 4 DYNAMIC PILLARS (PILLARS OF HARMONY / VIBE) */}
              {data.funAspects && (
                <div className="space-y-4">
                  <h3 className="text-white font-black text-lg flex items-center gap-2">
                    <span>💖</span> 4 Pillars of Love Dynamic
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(data.funAspects).map(([k, v]) => {
                      const icons: Record<string, unknown> = {
                        passion: Flame,
                        humor: Laugh,
                        communication: MessageCircle,
                        trust: ShieldCheck,
                      };
                      const Icon = (icons[k.toLowerCase()] as typeof Zap) || Zap;
                      const val = Number(v);
                      return (
                        <div
                          key={k}
                          className="p-4 rounded-2xl bg-white/[0.04] border border-purple-700/40 space-y-2 hover:border-pink-500/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-purple-200 font-bold text-sm flex items-center gap-2">
                              <Icon className="w-4 h-4 text-pink-400" />
                              {k.charAt(0).toUpperCase() + k.slice(1)}
                            </span>
                            <span className="text-pink-300 font-black text-base">{val}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-purple-950 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FRIENDSHIP PILLARS */}
              {data.vibePillars && (
                <div className="space-y-4">
                  <h3 className="text-white font-black text-lg flex items-center gap-2">
                    <span>🤝</span> Friendship Wavelength Pillars
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(data.vibePillars).map(([k, v]) => {
                      const val = Number(v);
                      const formatted = k.replace(/([A-Z])/g, " $1").trim();
                      return (
                        <div
                          key={k}
                          className="p-4 rounded-2xl bg-white/[0.04] border border-purple-700/40 space-y-2 hover:border-purple-500/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-purple-200 font-bold text-sm flex items-center gap-2">
                              <Zap className="w-4 h-4 text-purple-400" />
                              {formatted.charAt(0).toUpperCase() + formatted.slice(1)}
                            </span>
                            <span className="text-purple-300 font-black text-base">{val}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-purple-950 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MARRIAGE SYNERGY PILLARS */}
              {data.domesticSynergy && (
                <div className="space-y-4">
                  <h3 className="text-white font-black text-lg flex items-center gap-2">
                    <span>💍</span> Domestic & Life Synergy Pillars
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(data.domesticSynergy).map(([k, v]) => {
                      const val = Number(v);
                      const formatted = k.replace(/([A-Z])/g, " $1").trim();
                      return (
                        <div
                          key={k}
                          className="p-4 rounded-2xl bg-white/[0.04] border border-purple-700/40 space-y-2 hover:border-pink-500/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-purple-200 font-bold text-sm flex items-center gap-2">
                              <Heart className="w-4 h-4 text-pink-400" />
                              {formatted.charAt(0).toUpperCase() + formatted.slice(1)}
                            </span>
                            <span className="text-pink-300 font-black text-base">{val}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-purple-950 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500"
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CORE STRENGTHS / PILLS */}
              {(data.strengths || data.positiveCharacteristics || data.keyCharacteristics) && (
                <div className="space-y-3">
                  <h3 className="text-white font-black text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Key Superpowers & Characteristics
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {(data.strengths || data.positiveCharacteristics || data.keyCharacteristics || []).map(
                      (tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded-xl bg-purple-900/40 border border-purple-600/40 text-purple-200 text-xs sm:text-sm font-semibold shadow-sm"
                        >
                          ✨ {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* CURATED SHARED HOBBIES (FUTURE PARTNER) */}
              {data.fictionalInterests && (
                <div className="space-y-3">
                  <h3 className="text-white font-black text-lg flex items-center gap-2">
                    <span>🎯</span> Curated Shared Daydreams & Hobbies
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {data.fictionalInterests.map((interest: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-xl bg-indigo-900/40 border border-indigo-600/40 text-indigo-200 text-xs sm:text-sm font-semibold shadow-sm"
                      >
                        ☕ {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CINEMATIC MEET-CUTE (FUTURE PARTNER) */}
              {data.meetCuteScenario && (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-pink-950/40 via-purple-950/40 to-indigo-950/40 border border-pink-500/40 space-y-2">
                  <h4 className="text-pink-300 font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <span>🎬</span> Cinematic Meet-Cute Scenario
                  </h4>
                  <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed italic">
                    &ldquo;{data.meetCuteScenario}&rdquo;
                  </p>
                </div>
              )}

              {/* INSPIRATIONAL ENTERTAINMENT QUOTE */}
              {(data.entertainmentMessage ||
                data.friendshipMessage ||
                data.positiveMessage ||
                data.compatibilityMessage ||
                data.funCompatibilityMessage ||
                data.funPersonalitySummary ||
                data.humorousTakeaway) && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-violet-900/30 border border-purple-500/40 text-center">
                  <p className="text-white font-semibold text-sm sm:text-base leading-relaxed">
                    &ldquo;
                    {data.entertainmentMessage ||
                      data.friendshipMessage ||
                      data.positiveMessage ||
                      data.compatibilityMessage ||
                      data.funCompatibilityMessage ||
                      data.funPersonalitySummary ||
                      data.humorousTakeaway}
                    &rdquo;
                  </p>
                </div>
              )}

              {/* DISCLAIMER */}
              <div className="pt-4 border-t border-purple-800/40 text-center">
                <p className="text-xs text-purple-300/50 max-w-xl mx-auto leading-relaxed">
                  ⚖️ <strong>Entertainment & Whimsical Fun:</strong> This result is algorithmically calculated for smiles, friendly conversations, and amusement. Real bonds thrive on kindness, honesty, and quality time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION & NAVIGATION HUB */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="xl"
              onClick={() => router.push(window.location.pathname.replace(/\/result\/.*$/, "") || "/tools")}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-purple-600/50 text-white font-bold text-base"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Recalculate with New Names
            </Button>
            <Button
              size="xl"
              onClick={() => router.push("/tools")}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-base shadow-lg shadow-pink-500/25"
            >
              Explore All 6 Viral Tools <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Quick Recommendations Grid */}
          <div className="space-y-3 pt-4">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-pink-400" />
              Try Another Viral Calculation Next:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recommendedTools.slice(0, 3).map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-purple-800/40 hover:border-pink-500/40 transition-all flex items-center gap-3.5 group"
                >
                  <span className="text-3xl select-none group-hover:scale-110 transition-transform">
                    {tool.emoji}
                  </span>
                  <div>
                    <h5 className="text-white font-bold text-sm group-hover:text-pink-300 transition-colors">
                      {tool.name}
                    </h5>
                    <p className="text-purple-300/60 text-xs line-clamp-1">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
