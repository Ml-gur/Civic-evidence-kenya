import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Camera, MapPin, ShieldAlert, CheckCircle2, AlertTriangle, ChevronRight, Truck, Droplets, HeartPulse, School, Building2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

type Slide = 'intro' | 'scope' | 'location' | 'camera' | 'rules';

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState<Slide>('intro');
  const [lang, setLang] = useState<'en' | 'sw'>('en');

  const handleNext = () => {
    switch (currentSlide) {
      case 'intro': setCurrentSlide('scope'); break;
      case 'scope': setCurrentSlide('location'); break;
      case 'location': setCurrentSlide('camera'); break;
      case 'camera': setCurrentSlide('rules'); break;
      case 'rules': onComplete(); break;
    }
  };

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => handleNext(),
        () => handleNext() // Even if denied, we move on. App handles missing location gracefully.
      );
    } else {
      handleNext();
    }
  };

  const requestCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      handleNext();
    } catch (err) {
      handleNext(); // Even if denied, move on.
    }
  };

  const content = {
    en: {
      intro: {
        title: "Welcome to Citizen",
        desc: "The national ledger for public infrastructure integrity. Let's get you set up to verify reports and hold leaders accountable.",
        btn: "Get Started"
      },
      location: {
        title: "Verify Your Area",
        desc: "We need location access to ensure reports are anchored to actual county and ward boundaries, preventing fake reports from far away.",
        btn: "Allow Location Access",
        skip: "Skip for now"
      },
      camera: {
        title: "Capture Evidence",
        desc: "Camera access is needed to submit photo and video evidence directly from the app. Uploads from gallery are not permitted to ensure integrity.",
        btn: "Allow Camera Access",
        skip: "Skip for now"
      },
      rules: {
        title: "Community Rules",
        desc: "To maintain a high trust score, you must adhere to our strict community guidelines:",
        points: [
          "✅ You are allowed to report broken infrastructure, unfinished projects, and hazards.",
          "✅ You must be physically present at the location to submit or verify evidence.",
          "❌ It is illegal to post defamatory content, false accusations, or harass individuals.",
          "❌ Recording private spaces or violating individual privacy is strictly prohibited and will result in a ban."
        ],
        btn: "I Agree & Understand"
      }
    },
    sw: {
      intro: {
        title: "Karibu Citizen",
        desc: "Mfumo wa kitaifa wa kufuatilia uadilifu wa miundombinu ya umma. Tuweke mambo sawa ili uweze kuthibitisha ripoti.",
        btn: "Anza Sasa"
      },
      location: {
        title: "Thibitisha Eneo Lako",
        desc: "Tunahitaji idhini ya kutumia simu yako kujua ulipo ili kuhakikisha ripoti zinaambatanishwa na mipaka kamili ya kaunti na wodi.",
        btn: "Ruhusu Eneo",
        skip: "Ruka kwa sasa"
      },
      camera: {
        title: "Nasa Ushahidi",
        desc: "Tunahitaji idhini ya kamera ili kutuma picha na video moja kwa moja kutoka kwenye programu. Kupakia kutoka kwa matunzio kumezuiwa.",
        btn: "Ruhusu Kamera",
        skip: "Ruka kwa sasa"
      },
      rules: {
        title: "Sheria za Jamii",
        desc: "Ili kudumisha alama ya juu ya uaminifu, lazima ufuate miongozo yetu madhubuti:",
        points: [
          "✅ Unaruhusiwa kuripoti miundombinu iliyoharibika, miradi ambayo haijakamilika, na hatari.",
          "✅ Lazima uwepo eneo la tukio wakati wa kutuma au kuthibitisha ushahidi.",
          "❌ Ni kinyume cha sheria kuchapisha maudhui ya kashfa, tuhuma za uongo au kunyanyasa watu.",
          "❌ Kurekodi maeneo ya faragha au kukiuka faragha ya mtu binafsi ni marufuku na kutasababisha ufungiwe."
        ],
        btn: "Nakubali na Kuelewa"
      }
    }
  };

  const t = content[lang];

  return (
    <div className="fixed inset-0 bg-stone-900 z-[200] flex flex-col items-center justify-center text-white overflow-hidden safe-top safe-bottom">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-kenya-red/20 via-stone-900 to-stone-950 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-kenya-green/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Language Toggle */}
      <div className="absolute top-6 sm:top-8 right-4 sm:right-8 z-10 flex items-center gap-2 bg-stone-800/50 backdrop-blur-md p-1.5 rounded-full border border-stone-700">
        <button
          onClick={() => setLang('en')}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all ${lang === 'en' ? 'bg-white text-stone-900' : 'text-stone-400 hover:text-white'}`}
        >
          EN
        </button>
        <button
          onClick={() => setLang('sw')}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all ${lang === 'sw' ? 'bg-white text-stone-900' : 'text-stone-400 hover:text-white'}`}
        >
          SW
        </button>
        <Globe size={12} className="ml-1 mr-2 text-stone-400" />
      </div>

      <div className="w-full max-w-sm sm:max-w-md px-5 sm:px-6 relative z-10">
        <AnimatePresence mode="wait">
          {currentSlide === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/20 mb-4 shadow-2xl">
                <ShieldAlert className="text-kenya-red" size={48} />
              </div>
              <div className="space-y-4">
                <h1 style={{ fontSize: 'clamp(1.75rem, 8vw, 2.5rem)' }} className="font-display font-black tracking-tighter">{t.intro.title}</h1>
                <p className="text-stone-400 leading-relaxed font-medium text-sm sm:text-base">{t.intro.desc}</p>
              </div>
              <button
                onClick={handleNext}
                className="w-full bg-kenya-red text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-kenya-red/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {t.intro.btn}
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {currentSlide === 'scope' && (
            <motion.div
              key="scope"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col space-y-6"
            >
              <div className="space-y-2">
                <h2 style={{ fontSize: 'clamp(1.5rem, 7vw, 2rem)' }} className="font-display font-black tracking-tighter">
                  {lang === 'en' ? 'What can I report?' : 'Ninaweza kuripoti nini?'}
                </h2>
                <p className="text-stone-400 font-medium text-sm">
                  {lang === 'en'
                    ? 'Citizen Witness covers 5 infrastructure categories only. This keeps the platform focused and actionable.'
                    : 'Citizen Witness inashughulikia aina 5 tu za miundombinu. Hii inahifadhi jukwaa kwa njia inayofaa.'}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { en: 'Roads & Transport', sw: 'Barabara na Usafiri', icon: <Truck size={20} />, color: 'text-amber-400 bg-amber-500/10' },
                  { en: 'Water & Sanitation', sw: 'Maji na Usafi', icon: <Droplets size={20} />, color: 'text-blue-400 bg-blue-500/10' },
                  { en: 'Health Facilities', sw: 'Vituo vya Afya', icon: <HeartPulse size={20} />, color: 'text-red-400 bg-red-500/10' },
                  { en: 'Schools & Education', sw: 'Shule na Elimu', icon: <School size={20} />, color: 'text-emerald-400 bg-emerald-500/10' },
                  { en: 'Public Infrastructure', sw: 'Miundombinu ya Umma', icon: <Building2 size={20} />, color: 'text-purple-400 bg-purple-500/10' },
                ].map(cat => (
                  <div key={cat.en} className="flex items-center gap-4 bg-stone-800/50 rounded-2xl p-4 border border-stone-700/50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                      {cat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{cat.en}</p>
                      <p className="text-xs text-stone-500">{cat.sw}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-white text-stone-900 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {lang === 'en' ? 'Understood' : 'Nimeelewa'}
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {currentSlide === 'location' && (
            <motion.div
              key="location"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-kenya-green/20 blur-2xl rounded-full" />
                <div className="relative w-24 h-24 bg-stone-800 rounded-[2rem] flex items-center justify-center border border-kenya-green/30 mb-4">
                  <MapPin className="text-kenya-green" size={40} />
                </div>
              </div>
              <div className="space-y-4">
                <h2 style={{ fontSize: 'clamp(1.5rem, 7vw, 2rem)' }} className="font-display font-black tracking-tighter">{t.location.title}</h2>
                <p className="text-stone-400 leading-relaxed font-medium text-sm sm:text-base">{t.location.desc}</p>
              </div>
              <div className="w-full space-y-4">
                <button
                  onClick={requestLocation}
                  className="w-full bg-kenya-green text-stone-900 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-kenya-green/20 active:scale-95 transition-all"
                >
                  {t.location.btn}
                </button>
                <button onClick={handleNext} className="text-[10px] font-bold text-stone-500 uppercase tracking-widest hover:text-white transition-colors">
                  {t.location.skip}
                </button>
              </div>
            </motion.div>
          )}

          {currentSlide === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="w-24 h-24 bg-stone-800 rounded-[2rem] flex items-center justify-center border border-stone-700 mb-4 shadow-2xl">
                <Camera className="text-white" size={40} />
              </div>
              <div className="space-y-4">
                <h2 style={{ fontSize: 'clamp(1.5rem, 7vw, 2rem)' }} className="font-display font-black tracking-tighter">{t.camera.title}</h2>
                <p className="text-stone-400 leading-relaxed font-medium text-sm sm:text-base">{t.camera.desc}</p>
              </div>
              <div className="w-full space-y-4">
                <button
                  onClick={requestCamera}
                  className="w-full bg-white text-stone-900 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-white/10 active:scale-95 transition-all"
                >
                  {t.camera.btn}
                </button>
                <button onClick={handleNext} className="text-[10px] font-bold text-stone-500 uppercase tracking-widest hover:text-white transition-colors">
                  {t.camera.skip}
                </button>
              </div>
            </motion.div>
          )}

          {currentSlide === 'rules' && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col space-y-8"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                  <AlertTriangle className="text-amber-500" size={24} />
                </div>
                <h2 style={{ fontSize: 'clamp(1.5rem, 7vw, 2rem)' }} className="font-display font-black tracking-tighter">{t.rules.title}</h2>
              </div>

              <p className="text-stone-400 font-medium">{t.rules.desc}</p>

              <div className="space-y-4 bg-stone-800/50 border border-stone-700/50 p-6 rounded-3xl">
                {t.rules.points.map((point: string, idx: number) => (
                  <div key={idx} className="flex gap-3 text-sm text-stone-300 font-medium leading-relaxed">
                    <span className="shrink-0">{point.startsWith('✅') ? <CheckCircle2 size={18} className="text-kenya-green mt-0.5" /> : <ShieldAlert size={18} className="text-kenya-red mt-0.5" />}</span>
                    <span>{point.replace(/^[✅❌]\s/, '')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNext}
                  className="w-full bg-emerald-500 text-stone-900 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  {t.rules.btn}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {(['intro', 'scope', 'location', 'camera', 'rules'] as Slide[]).map((slide) => (
            <div
              key={slide}
              className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === slide ? 'w-8 bg-white' : 'w-2 bg-stone-700'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
