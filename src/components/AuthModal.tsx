import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const finalUsername = username.trim() || `Citizen_${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: finalUsername }
          }
        });
        if (signUpError) throw signUpError;

        if (data.user && data.session === null) {
          setError("Verification email sent! Please check your inbox to activate your account.");
          return; // Don't close modal yet so they can read the message
        }
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-md card-radius overflow-hidden shadow-2xl"
          >
            <div className="p-6 sm:p-10 space-y-6 sm:space-y-8 safe-bottom">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-kenya-red rounded-xl sm:rounded-2xl flex items-center justify-center text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)' }} className="font-display font-black tracking-tight">
                    {isLogin ? 'WELCOME BACK' : 'JOIN THE WATCH'}
                  </h2>
                </div>
                <button onClick={onClose} className="text-black/20 hover:text-black transition-colors p-1">
                  <X size={22} />
                </button>
              </div>

              <div className="bg-kenya-red/5 p-4 rounded-2xl border border-kenya-red/10">
                <p className="text-[10px] font-bold text-kenya-red uppercase tracking-widest leading-relaxed">
                  {isLogin
                    ? "Sign in to dispute reports, post evidence, and build your trust score."
                    : "Create an account to contribute evidence, verify reports, and help secure our republic's future."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full bg-black/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:bg-black/10 transition-all"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:bg-black/10 transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-black/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:bg-black/10 transition-all"
                  />
                </div>

                {error && <p className="text-[10px] font-bold text-kenya-red uppercase tracking-widest text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-kenya-black text-white py-4 rounded-2xl font-display font-black text-sm uppercase tracking-widest shadow-xl shadow-black/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[10px] font-black text-black/40 uppercase tracking-widest hover:text-black transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
