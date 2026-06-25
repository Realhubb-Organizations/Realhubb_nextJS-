"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Set a session cookie so proxy.ts allows /admin access
      document.cookie = "realhubb-admin-session=1; path=/; max-age=86400; SameSite=Strict";
      router.push("/admin/dashboard");
    } catch (err: any) {
      const msg =
        err.code === "auth/user-not-found" || err.code === "auth/invalid-credential"
          ? "No account found with these credentials."
          : err.code === "auth/wrong-password"
          ? "Incorrect password."
          : err.code === "auth/invalid-email"
          ? "Invalid email address."
          : err.code === "auth/too-many-requests"
          ? "Too many attempts. Try again later."
          : "Login failed. Check your credentials.";
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl bg-white ${shake ? "animate-shake" : ""}`}>
        
        {/* ── Left branding panel ── */}
        <div className="hidden md:flex flex-col justify-between bg-navy p-10 w-80 shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8L8 20v20h10V28h12v12h10V20L24 8z" fill="white" />
                </svg>
              </div>
              <div>
                <p className="text-white font-normal text-lg leading-none">RealHubb</p>
                <p className="text-gold text-[10px] tracking-widest uppercase mt-1 font-semibold">Admin Portal</p>
              </div>
            </div>
            <div className="space-y-4 pt-6">
              {[
                "Manage Property Listings",
                "Publish Blog Posts",
                "Upload Images via Cloudinary",
                "Manage Developers & Team",
                "Live Firestore Database",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <span className="text-white/80 text-sm font-light">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/30 text-xs">realhubb.in · Bengaluru</p>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 bg-white flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-sm space-y-8">
            <div>
              <h1 className="text-2xl font-normal text-navy font-heading">Welcome back</h1>
              <p className="text-gray-400 text-sm mt-1">Sign in to your admin dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@realhubb.in"
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-slate-50 text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/10 focus:border-navy transition"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl bg-slate-50 text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/10 focus:border-navy transition"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy hover:bg-navy/90 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-60 shadow-md hover:shadow-lg text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>

            <p className="text-center text-gray-400 text-xs">🔒 Secured by Firebase Authentication</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
        .animate-shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  );
}
