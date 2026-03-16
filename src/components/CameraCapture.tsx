import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera, X, RefreshCw, Video, Square, Check, MapPin,
  Zap, AlertTriangle, Wifi, ChevronRight, ArrowLeft,
  Truck, Droplets, HeartPulse, School, Building2,
  Clock, Signal, Image as ImageIcon, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, getReverseGeocode, haversineKm } from '../lib/utils';
import { KENYA_DATA } from '../lib/kenyaData';
import { supabase } from '../lib/supabase';

interface CameraCaptureProps {
  onCapture: (
    blob: Blob,
    type: 'image' | 'video',
    metadata: {
      lat: number;
      lng: number;
      timestamp: string;
      county: string;
      ward: string;
      constituency: string;
      category: IssueCategory;
      severity: 'low' | 'medium' | 'high';
    }
  ) => void;
  onClose: () => void;
}

export type IssueCategory = 'roads' | 'water' | 'health' | 'schools' | 'infrastructure';

const CATEGORIES: { id: IssueCategory; labelEn: string; labelSw: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { id: 'roads', labelEn: 'Roads & Transport', labelSw: 'Barabara na Usafiri', icon: <Truck size={22} />, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'water', labelEn: 'Water & Sanitation', labelSw: 'Maji na Usafi', icon: <Droplets size={22} />, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
  { id: 'health', labelEn: 'Health Facilities', labelSw: 'Vituo vya Afya', icon: <HeartPulse size={22} />, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
  { id: 'schools', labelEn: 'Schools & Education', labelSw: 'Shule na Elimu', icon: <School size={22} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { id: 'infrastructure', labelEn: 'Public Infrastructure', labelSw: 'Miundombinu ya Umma', icon: <Building2 size={22} />, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
];

const GPS_ACCURACY_THRESHOLD = 50; // Dropped from 150m to 50m for stronger accuracy
const LEAP_DISTANCE_KM = 200;
const LEAP_TIME_MIN = 30;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

type Step = 'camera' | 'review' | 'category';

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [step, setStep] = useState<Step>('camera');

  // Camera state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [captureType, setCaptureType] = useState<'image' | 'video' | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [zoom, setZoom] = useState(1);
  const [showFlash, setShowFlash] = useState(false);
  const [captureTimestamp, setCaptureTimestamp] = useState<Date | null>(null);

  // GPS state
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'acquiring' | 'locked' | 'denied' | 'weak'>('acquiring');
  const [geocodedLocation, setGeocodedLocation] = useState<{ county: string; ward: string; constituency: string } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsStartTime] = useState(Date.now());
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Category & Severity
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | null>(null);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [lang, setLang] = useState<'en' | 'sw'>('en');

  // Progressive refinement
  const bestAccuracyRef = useRef<number>(Infinity);
  const locationRef = useRef(location);
  locationRef.current = location;

  // ---- GPS ----
  const handleGpsPosition = useCallback((pos: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = pos.coords;

    // Anti-spoofing
    const lastRaw = sessionStorage.getItem('last_gps');
    if (lastRaw) {
      try {
        const last = JSON.parse(lastRaw);
        const distKm = haversineKm(last.lat, last.lng, latitude, longitude);
        const timeDiffMin = (Date.now() - last.ts) / 60000;
        if (distKm > LEAP_DISTANCE_KM && timeDiffMin < LEAP_TIME_MIN) {
          setGpsError(`Unlikely location jump (${distKm.toFixed(0)}km in ${timeDiffMin.toFixed(0)}min). Be at the location.`);
          setGpsStatus('denied');
          return;
        }
      } catch { /* */ }
    }

    sessionStorage.setItem('last_gps', JSON.stringify({ lat: latitude, lng: longitude, ts: Date.now() }));

    if (accuracy <= bestAccuracyRef.current) {
      bestAccuracyRef.current = accuracy;
      setLocation({ lat: latitude, lng: longitude, accuracy });
    } else if (!locationRef.current) {
      setLocation({ lat: latitude, lng: longitude, accuracy });
    }

    setGpsStatus(accuracy > GPS_ACCURACY_THRESHOLD ? 'weak' : 'locked');
    setGpsError(null);
  }, []);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGpsStatus('denied');
      setGpsError('Your device does not support GPS.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      handleGpsPosition,
      () => { },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 }
    );

    const watchId = navigator.geolocation.watchPosition(
      handleGpsPosition,
      (err) => {
        if (!locationRef.current) {
          setGpsStatus('denied');
          setGpsError(
            err.code === 1 ? 'Location permission denied. Enable GPS in device settings.'
              : err.code === 3 ? 'GPS timed out. Move to an open area.'
                : 'GPS unavailable. Enable location and retry.'
          );
        }
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 30000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [handleGpsPosition]);

  // ---- Geocode ----
  useEffect(() => {
    if (!location) return;
    doGeocode(location.lat, location.lng);
  }, [location?.lat?.toFixed(4), location?.lng?.toFixed(4)]);

  const doGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      // 1. Try internal PostGIS reverse geocoding first (Most accurate)
      const { data, error } = await supabase.rpc('lookup_location', { lat, lng });
      if (!error && data && data.county) {
        setGeocodedLocation({
          county: data.county,
          constituency: data.constituency || '',
          ward: data.ward || ''
        });
        setIsGeocoding(false);
        return;
      }
    } catch (e) {
      console.warn('Internal geocoding failed:', e);
    }

    try {
      // 2. Fallback to external nominatim or offline data
      const addr = await getReverseGeocode(lat, lng);
      if (addr) {
        const matched = matchToKenyaData(addr);
        if (matched) {
          setGeocodedLocation(matched);
        } else {
          setGeocodedLocation({
            county: addr.county || addr.state_district || addr.state || 'Unknown County',
            constituency: addr.suburb || addr.city_district || addr.city || '',
            ward: addr.quarter || addr.neighbourhood || addr.residential || addr.village || ''
          });
        }
        setIsGeocoding(false);
        return;
      }
    } catch (e) {
      console.warn('Fallback Geocoding failed:', e);
    }

    setIsGeocoding(false);
  };

  const matchToKenyaData = (nominatimObj: any) => {
    if (!nominatimObj) return null;

    const tokens = [
      nominatimObj.county, nominatimObj.state_district, nominatimObj.state,
      nominatimObj.suburb, nominatimObj.neighbourhood, nominatimObj.city_district,
      nominatimObj.quarter, nominatimObj.residential, nominatimObj.village,
      nominatimObj.town, nominatimObj.city, nominatimObj.hamlet, nominatimObj.municipality
    ].filter(Boolean).map(s => String(s).toLowerCase().replace(/ county| constituency| ward/g, '').trim());

    if (tokens.length === 0) return null;

    let bestCounty = '';
    let bestConstituency = '';
    let bestWard = '';

    // 1. Identify the County
    for (const c of KENYA_DATA) {
      const cName = c.name.toLowerCase();
      if (tokens.some(t => t.includes(cName) || cName.includes(t))) {
        bestCounty = c.name;
        break;
      }
    }

    if (!bestCounty) return null;
    const countyObj = KENYA_DATA.find(c => c.name === bestCounty)!;

    // 2. Identify the Constituency (direct match first)
    for (const constObj of countyObj.constituencies) {
      const constName = constObj.name.toLowerCase();
      if (tokens.some(t => t.includes(constName) || constName.includes(t) || t === constName)) {
        bestConstituency = constObj.name;
        break;
      }
    }

    // 3. Identify the Ward (and derive Constituency if we missed it)
    for (const constObj of countyObj.constituencies) {
      // If we already know the constituency, restrict searches to it
      if (bestConstituency && bestConstituency !== constObj.name) continue;

      for (const ward of constObj.wards) {
        const wName = ward.toLowerCase();
        if (tokens.some(t => t.includes(wName) || wName.includes(t))) {
          bestWard = ward;
          // If we found the ward but were missing the constituency, now we have it!
          if (!bestConstituency) {
            bestConstituency = constObj.name;
          }
          break;
        }
      }
      if (bestWard) break;
    }

    const fallbackConstObj = countyObj.constituencies.find(c => c.name === bestConstituency) || countyObj.constituencies[0];

    return {
      county: bestCounty,
      constituency: bestConstituency || fallbackConstObj?.name || '',
      ward: bestWard || fallbackConstObj?.wards[0] || '',
    };
  };

  // ---- Camera ----
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => setRecordingTime(p => p + 0.1), 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && recordingTime >= 60) stopRecording();
  }, [recordingTime, isRecording]);

  const startCamera = async () => {
    try {
      if (stream) stream.getTracks().forEach(t => t.stop());
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true,
      });
      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
    } catch {
      setGpsError('Camera access denied. Allow camera to capture evidence.');
    }
  };

  const stopCamera = () => stream?.getTracks().forEach(t => t.stop());

  const takePhoto = () => {
    if (!videoRef.current) return;
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);

    // Burn in a subtle timestamp + GPS watermark for forensic integrity
    const now = new Date();
    setCaptureTimestamp(now);
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, canvas.height - 44, canvas.width, 44);
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    const ts = now.toISOString().replace('T', ' ').slice(0, 19);
    const gps = location ? `${location.lat.toFixed(5)}°N, ${location.lng.toFixed(5)}°E ±${location.accuracy.toFixed(0)}m` : 'GPS N/A';
    ctx.fillText(`${ts}  |  ${gps}  |  CivicEvidence.ke`, 12, canvas.height - 16);
    ctx.restore();

    canvas.toBlob(blob => {
      if (blob) {
        if (blob.size > MAX_IMAGE_SIZE) {
          setGpsError(`Photo is too large (${(blob.size / 1024 / 1024).toFixed(1)}MB). Max 10MB.`);
          setGpsStatus('denied');
          return;
        }
        setCapturedBlob(blob);
        setCaptureType('image');
        setStep('review');
      }
    }, 'image/jpeg', 0.88);
  };

  const startRecording = () => {
    if (!stream) return;
    const chunks: Blob[] = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType });
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      if (blob.size > MAX_VIDEO_SIZE) {
        setGpsError(`Video is too large (${(blob.size / 1024 / 1024).toFixed(1)}MB). Max 50MB.`);
        setGpsStatus('denied');
        setCapturedBlob(null);
        setStep('camera');
        return;
      }
      setCapturedBlob(blob);
      setCaptureType('video');
      setCaptureTimestamp(new Date());
      setStep('review');
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleProceedToCategory = () => setStep('category');

  const handleFinalConfirm = () => {
    if (!capturedBlob || !captureType || !location || !selectedCategory) return;
    stopCamera();
    onCapture(capturedBlob, captureType, {
      lat: location.lat,
      lng: location.lng,
      timestamp: captureTimestamp?.toISOString() || new Date().toISOString(),
      county: geocodedLocation?.county || '',
      ward: geocodedLocation?.ward || '',
      constituency: geocodedLocation?.constituency || '',
      category: selectedCategory,
      severity,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const gpsElapsedSec = Math.floor((Date.now() - gpsStartTime) / 1000)  // =============== GPS BLOCKED ===============
  if (gpsStatus === 'denied' && gpsError) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-950 flex flex-col items-center justify-center p-8 text-white text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-red-500/20"
        >
          <MapPin size={40} className="text-red-400" />
        </motion.div>
        <h2 className="text-3xl font-display font-black tracking-tight mb-3">GPS Required</h2>
        <p className="text-stone-400 text-sm leading-relaxed max-w-xs mb-2">{gpsError}</p>
        <p className="text-stone-600 text-[10px] uppercase tracking-widest mb-8">
          Evidence must include verified GPS coordinates
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setGpsError(null);
              setGpsStatus('acquiring');
              bestAccuracyRef.current = Infinity;
              navigator.geolocation.getCurrentPosition(
                handleGpsPosition,
                () => {
                  setGpsStatus('denied');
                  setGpsError('GPS still unavailable. Check device settings.');
                },
                { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
              );
            }}
            className="flex items-center gap-2 bg-emerald-600 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95"
          >
            <RefreshCw size={14} /> Retry GPS
          </button>
          <button onClick={onClose} className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">
            <X size={14} /> Close
          </button>
        </div>
      </div>
    );
  }

  // =============== CATEGORY SELECTION ===============
  if (step === 'category') {
    return (
      <div className="fixed inset-0 z-50 bg-stone-950 flex flex-col text-white overflow-y-auto">
        <div className="sticky top-0 bg-stone-950/95 backdrop-blur-xl px-6 pt-8 pb-4 flex items-center justify-between border-b border-white/5 z-10">
          <button onClick={() => setStep('review')} className="flex items-center gap-2 text-stone-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex gap-1.5">
            {(['en', 'sw'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={cn('px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all',
                  lang === l ? 'bg-white text-stone-900' : 'text-stone-500 hover:text-white bg-white/5')}>
                {l === 'en' ? '🇬🇧 EN' : '🇰🇪 SW'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 space-y-3">
          <div className="mb-8">
            <h2 className="text-3xl font-display font-black tracking-tight leading-tight">
              {lang === 'en' ? 'What type of\nissue is this?' : 'Tatizo la\naina gani?'}
            </h2>
            <p className="text-stone-500 text-sm mt-3 max-w-xs">
              {lang === 'en'
                ? 'This helps route your report to the right authority.'
                : 'Hii husaidia kupeleka ripoti yako kwa mamlaka sahihi.'}
            </p>
          </div>

          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300',
                selectedCategory === cat.id
                  ? 'border-white/30 bg-white/10 ring-1 ring-white/20 shadow-lg'
                  : 'border-white/5 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
              )}>
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center border shrink-0', cat.bg, cat.color)}>
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-white text-sm leading-tight">{cat.labelEn}</p>
                <p className="text-stone-600 text-[11px] font-medium mt-0.5">{cat.labelSw}</p>
              </div>
              <div className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                selectedCategory === cat.id
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-white/15'
              )}>
                {selectedCategory === cat.id && <Check size={14} className="text-white" />}
              </div>
            </motion.button>
          ))}

          {/* Severity Selection */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-stone-400 mb-3">
              {lang === 'en' ? 'Severity / Urgency' : 'Kiwango cha Haraka'}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverity(sev)}
                  className={cn(
                    'py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all',
                    severity === sev
                      ? sev === 'high' ? 'bg-red-500 border-red-400 text-white'
                        : sev === 'medium' ? 'bg-amber-500 border-amber-400 text-white'
                          : 'bg-emerald-500 border-emerald-400 text-white'
                      : 'bg-white/5 border-white/10 text-stone-500 hover:bg-white/10'
                  )}
                >
                  {sev}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-stone-500 font-medium mt-2 text-center">
              {severity === 'high' && (lang === 'en' ? 'Immediate danger to life or property.' : 'Hatari ya haraka kwa maisha au mali.')}
              {severity === 'medium' && (lang === 'en' ? 'Significant disruption, requires prompt attention.' : 'Usumbufu mkubwa, inahitaji tahadhari ya haraka.')}
              {severity === 'low' && (lang === 'en' ? 'Minor issue, needs eventual maintenance.' : 'Tatizo dogo, inahitaji matengenezo baadaye.')}
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-stone-950/95 backdrop-blur-xl p-6 border-t border-white/5">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {['Capture', 'Review', 'Category'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full transition-colors', i <= 2 ? 'bg-emerald-500' : 'bg-white/20')} />
                <span className="text-[8px] font-black uppercase tracking-widest text-stone-600">{s}</span>
                {i < 2 && <div className="w-6 h-px bg-white/10" />}
              </div>
            ))}
          </div>
          <button
            onClick={handleFinalConfirm}
            disabled={!selectedCategory}
            className="w-full bg-emerald-600 disabled:opacity-20 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-[0_0_40px_rgba(16,185,129,0.15)]">
            <Shield size={16} />
            {lang === 'en' ? 'Submit Evidence' : 'Tuma Ushahidi'}
          </button>
        </div>
      </div>
    );
  }

  // =============== MAIN CAMERA / REVIEW ===============
  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col text-white overflow-hidden">
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">

        {/* ===== Live Camera View ===== */}
        {step === 'camera' && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ transform: `scale(${zoom})` }}
            />

            {/* Shutter Flash */}
            <AnimatePresence>
              {showFlash && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white z-[100]" />
              )}
            </AnimatePresence>

            {/* HUD corners */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
              {/* Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
                <div className="absolute top-0 left-1/2 -translate-x-px w-0.5 h-2 bg-white/25" />
                <div className="absolute bottom-0 left-1/2 -translate-x-px w-0.5 h-2 bg-white/25" />
                <div className="absolute left-0 top-1/2 -translate-y-px w-2 h-0.5 bg-white/25" />
                <div className="absolute right-0 top-1/2 -translate-y-px w-2 h-0.5 bg-white/25" />
              </div>
            </div>

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/70 to-transparent pointer-events-auto">
              <button onClick={onClose}
                className="flex items-center gap-2 bg-black/40 hover:bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full transition-all border border-white/10">
                <X size={14} />
                <span className="text-[9px] uppercase tracking-[0.2em] font-black">Close</span>
              </button>

              <div className="flex flex-col items-end gap-1.5">
                {/* GPS chip */}
                <div className={cn(
                  'flex items-center gap-2 backdrop-blur-xl px-3 py-1.5 rounded-full border',
                  gpsStatus === 'locked' ? 'bg-emerald-500/20 border-emerald-500/30' :
                    gpsStatus === 'weak' ? 'bg-amber-500/20 border-amber-500/30' :
                      'bg-black/40 border-white/10'
                )}>
                  <div className={cn('w-1.5 h-1.5 rounded-full',
                    gpsStatus === 'locked' ? 'bg-emerald-400' :
                      'bg-amber-400 animate-pulse')} />
                  <span className="text-[9px] uppercase tracking-widest font-bold">
                    {gpsStatus === 'locked'
                      ? `Locked ±${location?.accuracy?.toFixed(0)}m`
                      : gpsStatus === 'weak'
                        ? `±${location?.accuracy?.toFixed(0)}m`
                        : 'Acquiring...'}
                  </span>
                </div>

                {/* Accuracy bar */}
                {location && gpsStatus !== 'locked' && (
                  <div className="w-28 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500 rounded-full"
                      animate={{ width: `${Math.min(100, Math.max(10, (1 - location.accuracy / (GPS_ACCURACY_THRESHOLD * 2)) * 100))}%` }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                )}

                {/* Coords */}
                {location && (
                  <span className="text-[8px] text-white/40 font-mono tracking-tight">
                    {location.lat.toFixed(5)}° {location.lng.toFixed(5)}°
                  </span>
                )}

                {/* Location name */}
                {geocodedLocation?.county ? (
                  <div className="bg-black/50 backdrop-blur-xl px-2.5 py-1 rounded-lg border border-white/10">
                    <span className="text-[8px] text-white/60 font-bold leading-none">
                      {[geocodedLocation.ward, geocodedLocation.constituency, geocodedLocation.county].filter(Boolean).join(' • ')}
                    </span>
                  </div>
                ) : isGeocoding ? (
                  <div className="bg-black/50 backdrop-blur-xl px-2.5 py-1 flex items-center gap-2 rounded-lg border border-white/10">
                    <div className="w-2 h-2 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
                    <span className="text-[8px] text-white/60 font-bold leading-none">
                      Mapping Area...
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Weak/Acquiring GPS banner */}
            <AnimatePresence>
              {gpsStatus === 'weak' && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="absolute top-20 left-4 right-4 bg-amber-500/90 backdrop-blur-xl rounded-xl p-2.5 flex items-center gap-2.5 shadow-lg"
                >
                  <AlertTriangle size={14} className="text-white shrink-0" />
                  <p className="text-[10px] text-white font-bold">
                    Weak signal (±{location?.accuracy?.toFixed(0)}m). Move outside for accurate mapping.
                  </p>
                </motion.div>
              )}
              {gpsStatus === 'acquiring' && !location && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="absolute top-20 left-4 right-4 bg-sky-500/90 backdrop-blur-xl rounded-xl p-2.5 flex items-center gap-2.5 shadow-lg"
                >
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  <p className="text-[10px] text-white font-bold">
                    Acquiring GPS Signal... Please wait before capturing.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              {/* Zoom slider */}
              <div className="max-w-[200px] mx-auto mb-5 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-[9px] font-bold text-white/30">1×</span>
                <input type="range" min="1" max="3" step="0.1" value={zoom}
                  onChange={e => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-white h-0.5 rounded-full appearance-none bg-white/15" />
                <span className="text-[9px] font-bold text-white/30">3×</span>
              </div>

              <div className="max-w-sm mx-auto flex items-center justify-between">
                {/* Flip camera */}
                <button onClick={() => setFacingMode(p => p === 'user' ? 'environment' : 'user')}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/15 transition-all active:scale-90">
                  <RefreshCw size={18} />
                </button>

                <div className="flex items-center gap-4">
                  {/* Video button */}
                  {!isRecording ? (
                    <button onClick={startRecording}
                      disabled={gpsStatus === 'acquiring' || isGeocoding || !location}
                      className="w-14 h-14 rounded-full bg-white/5 border-2 border-white/15 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all group">
                      <Video size={18} className="group-hover:text-red-400" />
                    </button>
                  ) : (
                    <button onClick={stopRecording}
                      className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse">
                      <Square size={18} fill="white" />
                    </button>
                  )}

                  {/* Photo shutter */}
                  {!isRecording && (
                    <button onClick={takePhoto}
                      disabled={gpsStatus === 'acquiring' || isGeocoding || !location}
                      className="w-20 h-20 rounded-full bg-white p-1 shadow-[0_0_50px_rgba(255,255,255,0.15)] active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <div className="w-full h-full rounded-full border-[3px] border-black/10 flex items-center justify-center bg-white">
                        <Camera size={24} className="text-black" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Timer / flash */}
                <div className="w-12 flex flex-col items-center gap-1">
                  {isRecording ? (
                    <div className="text-red-400 font-bold text-xs tabular-nums font-mono">
                      {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toFixed(0).padStart(2, '0')}
                    </div>
                  ) : (
                    <Zap size={18} className="text-amber-400" />
                  )}
                </div>
              </div>

              {/* Mode labels */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <span className={cn('text-[9px] font-black uppercase tracking-widest transition-colors',
                  isRecording ? 'text-red-400' : 'text-white/25')}>Video</span>
                <span className={cn('text-[9px] font-black uppercase tracking-widest transition-colors',
                  !isRecording ? 'text-white' : 'text-white/25')}>Photo</span>
              </div>
            </div>
          </>
        )}

        {/* ===== Review Screen ===== */}
        {step === 'review' && capturedBlob && (
          <div className="w-full h-full flex flex-col bg-[#050505]">
            <div className="flex-1 relative flex items-center justify-center p-3 min-h-0">
              <div className="relative max-w-4xl w-full h-full flex items-center justify-center rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                {captureType === 'image' ? (
                  <img src={URL.createObjectURL(capturedBlob)} className="w-full h-full object-contain" alt="Evidence" />
                ) : (
                  <video src={URL.createObjectURL(capturedBlob)} controls autoPlay className="w-full h-full object-contain" />
                )}

                {/* Top badge */}
                <div className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-emerald-400/20 flex items-center gap-2">
                  <Shield size={12} />
                  <span className="text-[9px] uppercase tracking-[0.25em] font-black text-white">Evidence Secured</span>
                </div>
              </div>
            </div>

            {/* Metadata cards */}
            <div className="px-4 py-2 shrink-0">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {/* Location */}
                {geocodedLocation?.county && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5 shrink-0">
                    <MapPin size={12} className="text-emerald-400" />
                    <div>
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Location</p>
                      <p className="text-[10px] font-bold text-white/80">{[geocodedLocation.ward, geocodedLocation.constituency, geocodedLocation.county].filter(Boolean).join(', ')}</p>
                    </div>
                  </div>
                )}
                {/* GPS */}
                {location && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5 shrink-0">
                    <Signal size={12} className="text-blue-400" />
                    <div>
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Accuracy</p>
                      <p className="text-[10px] font-bold text-white/80">±{location.accuracy.toFixed(0)}m</p>
                    </div>
                  </div>
                )}
                {/* Timestamp */}
                {captureTimestamp && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5 shrink-0">
                    <Clock size={12} className="text-amber-400" />
                    <div>
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Captured</p>
                      <p className="text-[10px] font-bold text-white/80">{captureTimestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                )}
                {/* File size */}
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5 shrink-0">
                  <ImageIcon size={12} className="text-purple-400" />
                  <div>
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Size</p>
                    <p className="text-[10px] font-bold text-white/80">{formatFileSize(capturedBlob.size)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 pt-2 bg-black border-t border-white/5">
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mb-3">
                {['Capture', 'Review', 'Category'].map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full transition-colors', i <= 1 ? 'bg-emerald-500' : 'bg-white/15')} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-stone-600">{s}</span>
                    {i < 2 && <div className="w-6 h-px bg-white/10" />}
                  </div>
                ))}
              </div>
              <div className="max-w-md mx-auto flex gap-3">
                <button onClick={() => { setCapturedBlob(null); setCaptureType(null); setCaptureTimestamp(null); setStep('camera'); }}
                  className="flex-1 h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 transition-all active:scale-95">
                  <RefreshCw size={14} className="text-white/40" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Retake</span>
                </button>
                <button onClick={handleProceedToCategory}
                  className="flex-[2] h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <span className="text-[10px] uppercase tracking-widest font-black">Select Category</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
