import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogIn, User, Lock, AlertCircle, Armchair, Lamp, Sofa, Bed, ArrowLeft } from "lucide-react";

interface LoginProps {
  onLogin: (user: import('../types').User) => void;
  onBack: () => void;
}

export function Login({ onLogin, onBack }: LoginProps) {
  const [loginType, setLoginType] = useState<"designer" | "admin">("designer");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // Using AuthService abstraction (which simulates the backend for now)
    const { AuthService } = await import('../lib/db');
    
    if (isSignUp) {
      const { user, error: authError } = await AuthService.signUp(email, name, loginType);
      if (authError || !user) {
        setError(authError?.message || "Registration failed.");
      } else {
        onLogin(user);
      }
    } else {
      const { user, error: authError } = await AuthService.signIn(email, loginType);
      if (authError || !user) {
        setError(authError?.message || "Invalid credentials.");
      } else {
        if (password === (loginType === 'designer' ? 'password' : 'adminpass')) {
          onLogin(user);
        } else {
          setError("Invalid email or password.");
        }
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0B1120] overflow-hidden selection:bg-blue-500/30">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
        
        {/* Floating Furniture Icons */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0] 
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[15%] text-blue-500/10"
        >
          <Armchair size={120} strokeWidth={1} />
        </motion.div>
        
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -10, 0] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[10%] text-indigo-500/10"
        >
          <Lamp size={160} strokeWidth={1} />
        </motion.div>

        <motion.div 
          animate={{ 
            x: [0, 20, 0],
            rotate: [0, 15, 0] 
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[25%] right-[10%] text-purple-500/10"
        >
          <Sofa size={140} strokeWidth={1} />
        </motion.div>

        <motion.div 
          animate={{ 
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, -5, 0] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[25%] right-[20%] text-blue-600/10"
        >
          <Bed size={100} strokeWidth={1} />
        </motion.div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBWMGg0MHY0MEgwdnoiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8cGF0aCBkPSJNMCAwdjQwSDBWMHptNDAgMHY0MGgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz4KPHBhdGggZD0iTTAgMGg0MHYwaC00MHptMCA0MGg0MHYwaC00MHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-50"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] p-6 sm:p-0"
      >
        <div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 border border-white/5 p-8 sm:p-10 relative overflow-hidden">
          
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2 group z-20"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-xl relative ${
              loginType === 'designer' 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20' 
                : 'bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-purple-500/20'
            }`}>
              <LogIn size={28} className="text-white relative z-10" />
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-2xl inset-ring-1 inset-ring-white/20 mix-blend-overlay"></div>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold tracking-tight text-white mb-2"
            >
              FurniStudio
            </motion.h1>
            <motion.p 
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-400 font-medium"
            >
              Professional Design Platform
            </motion.p>
          </div>

          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex relative bg-black/40 rounded-xl p-1.5 mb-8 border border-white/5"
          >
            {/* Sliding Pill Indicator */}
            <motion.div
              layoutId="loginTypeIndicator"
              className="absolute top-1.5 bottom-1.5 rounded-lg bg-gray-800 border border-white/10 shadow-sm"
              initial={false}
              animate={{
                left: loginType === "designer" ? "0.375rem" : "50%",
                width: "calc(50% - 0.375rem)"
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
            
            <button
              type="button"
              onClick={() => {
                setLoginType("designer");
                setError("");
                setEmail("");
                setPassword("");
                setName("");
              }}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                loginType === "designer" 
                  ? "text-white" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Designer
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginType("admin");
                setError("");
                setEmail("");
                setPassword("");
                setName("");
              }}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                loginType === "admin" 
                  ? "text-white" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Admin
            </button>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-xs font-semibold tracking-wide text-gray-400 uppercase mb-2 ml-1" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white placeholder:text-gray-600 font-medium"
                      placeholder="Jane Doe"
                      required={isSignUp}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-xs font-semibold tracking-wide text-gray-400 uppercase mb-2 ml-1" htmlFor="email">
                {loginType === "designer" ? "Designer Email" : "Administrator Email"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white placeholder:text-gray-600 font-medium"
                  placeholder={loginType === "designer" ? "designer@furnistudio.com" : "admin@furnistudio.com"}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-xs font-semibold tracking-wide text-gray-400 uppercase mb-2 ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white placeholder:text-gray-600 font-medium tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 text-sm text-red-400 bg-red-950/40 p-3.5 rounded-xl border border-red-500/20">
                    <AlertCircle size={18} className="shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center items-center py-3.5 px-4 font-semibold rounded-xl text-white overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111827] disabled:opacity-70 disabled:cursor-not-allowed ${
                loginType === 'designer' 
                  ? 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500' 
                  : 'bg-purple-600 hover:bg-purple-500 focus:ring-purple-500'
              }`}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isSignUp ? "Registering..." : "Authenticating..."}</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? "Create Account" : (loginType === 'designer' ? "Sign In to Workspace" : "Access Admin Portal")}</span>
                  </>
                )}
              </div>
            </motion.button>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center mt-4"
            >
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setPassword("");
                }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </motion.div>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-500 font-medium">
              Secure System Access &bull; v2.0
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
