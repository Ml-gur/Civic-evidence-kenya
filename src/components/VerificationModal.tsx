import React, { useState, useRef } from 'react';
import {
    X, ThumbsUp, ThumbsDown, MapPin, Camera,
    CheckCircle2, AlertTriangle, ShieldAlert, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post } from '../lib/supabase';
import { haversineKm } from '../lib/utils';
import { cn } from '../lib/utils';

interface VerificationModalProps {
    post: Post;
    type: 'confirm' | 'dispute';
    userLocation: { lat: number; lng: number } | null;
    onSubmit: (payload: VerificationPayload) => Promise<void>;
    onClose: () => void;
}

export interface VerificationPayload {
    voteType: 'confirm' | 'dispute';
    verifierMethod: 'proximity' | 'media_corroborating' | 'dispute';
    disputeReason?: string;
    counterMediaBlob?: Blob;
}

const DISPUTE_REASONS = [
    'Incorrect location',
    'Outdated – issue already resolved',
    'Fabricated or edited media',
    'Out of scope for this platform',
    'Duplicate report',
    'Personal privacy violation',
];

const MAX_CONFIRM_KM = 50;

export const VerificationModal: React.FC<VerificationModalProps> = ({
    post, type, userLocation, onSubmit, onClose
}) => {
    const [disputeReason, setDisputeReason] = useState('');
    const [corroborating, setCorroborating] = useState<Blob | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCameraForCorroboration, setShowCameraForCorroboration] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const distanceKm = userLocation
        ? haversineKm(userLocation.lat, userLocation.lng, post.gps_lat, post.gps_long)
        : null;

    const isNearby = distanceKm !== null && distanceKm <= MAX_CONFIRM_KM;

    const startCorroborationCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
            setShowCameraForCorroboration(true);
        } catch {
            setError('Camera access denied. Cannot capture corroborating evidence.');
        }
    };

    const captureCorroboration = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
            if (blob) {
                setCorroborating(blob);
                streamRef.current?.getTracks().forEach(t => t.stop());
                setShowCameraForCorroboration(false);
            }
        }, 'image/jpeg', 0.85);
    };

    const canSubmitConfirm = isNearby || corroborating !== null;
    const canSubmitDispute = disputeReason.trim().length > 0;

    const handleSubmit = async () => {
        setError(null);
        if (type === 'confirm' && !canSubmitConfirm) {
            setError(`You must be within ${MAX_CONFIRM_KM} km or upload corroborating evidence.`);
            return;
        }
        if (type === 'dispute' && !canSubmitDispute) {
            setError('Please select a reason for your dispute.');
            return;
        }
        setSubmitting(true);
        try {
            await onSubmit({
                voteType: type,
                verifierMethod: type === 'dispute' ? 'dispute' : isNearby ? 'proximity' : 'media_corroborating',
                disputeReason: type === 'dispute' ? disputeReason : undefined,
                counterMediaBlob: corroborating ?? undefined,
            });
            onClose();
        } catch (err: any) {
            setError(err?.message || 'Submission failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className={cn(
                    'px-8 pt-8 pb-6 flex items-center justify-between',
                    type === 'confirm' ? 'bg-emerald-50' : 'bg-red-50'
                )}>
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            'w-12 h-12 rounded-2xl flex items-center justify-center',
                            type === 'confirm' ? 'bg-emerald-100' : 'bg-red-100'
                        )}>
                            {type === 'confirm'
                                ? <ThumbsUp size={22} className="text-emerald-600" />
                                : <ThumbsDown size={22} className="text-red-500" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-black tracking-tight">
                                {type === 'confirm' ? 'Confirm Report' : 'Dispute Report'}
                            </h2>
                            <p className="text-xs text-black/40 font-medium">
                                {type === 'confirm' ? 'Verify this issue exists' : 'Challenge this report'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-black/30 hover:text-black/60 transition-colors">
                        <X size={22} />
                    </button>
                </div>

                <div className="px-8 py-6 space-y-5">
                    {/* GPS Proximity status for CONFIRM */}
                    {type === 'confirm' && (
                        <div className={cn(
                            'rounded-2xl p-4 flex items-start gap-3 border',
                            isNearby
                                ? 'bg-emerald-50 border-emerald-100'
                                : distanceKm !== null
                                    ? 'bg-amber-50 border-amber-100'
                                    : 'bg-stone-50 border-stone-100'
                        )}>
                            <MapPin size={18} className={cn(
                                'mt-0.5 shrink-0',
                                isNearby ? 'text-emerald-500' : 'text-amber-500'
                            )} />
                            <div>
                                <p className="text-xs font-bold text-stone-800">
                                    {distanceKm === null
                                        ? 'Location not available'
                                        : isNearby
                                            ? `You are ${distanceKm.toFixed(1)} km from this location ✓`
                                            : `You are ${distanceKm.toFixed(0)} km away — too far to confirm by proximity`}
                                </p>
                                {!isNearby && (
                                    <p className="text-[10px] text-stone-500 mt-1 font-medium">
                                        Upload a fresh corroborating photo taken at the scene to confirm remotely.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Corroborating image capture (confirm) */}
                    {type === 'confirm' && !isNearby && (
                        <div>
                            {!corroborating && !showCameraForCorroboration && (
                                <button
                                    onClick={startCorroborationCamera}
                                    className="w-full border-2 border-dashed border-stone-200 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                                >
                                    <Camera size={28} className="text-stone-300" />
                                    <span className="text-xs font-bold text-stone-400">Capture corroborating evidence</span>
                                </button>
                            )}
                            {showCameraForCorroboration && (
                                <div className="rounded-2xl overflow-hidden border border-stone-200 bg-black">
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover" />
                                    <div className="p-4 flex gap-3">
                                        <button onClick={() => { streamRef.current?.getTracks().forEach(t => t.stop()); setShowCameraForCorroboration(false); }}
                                            className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-500">Cancel</button>
                                        <button onClick={captureCorroboration}
                                            className="flex-[2] py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">Capture Photo</button>
                                    </div>
                                </div>
                            )}
                            {corroborating && (
                                <div className="relative rounded-2xl overflow-hidden border border-emerald-200">
                                    <img src={URL.createObjectURL(corroborating)} alt="Corroborating" className="w-full aspect-video object-cover" />
                                    <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                                        <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                            <span className="text-xs font-bold text-emerald-700">Evidence captured</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setCorroborating(null)}
                                        className="absolute top-3 right-3 bg-white/80 backdrop-blur p-1.5 rounded-full">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* DISPUTE: reason selector */}
                    {type === 'dispute' && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Reason for dispute *</p>
                            <div className="space-y-2">
                                {DISPUTE_REASONS.map(reason => (
                                    <button
                                        key={reason}
                                        onClick={() => setDisputeReason(reason)}
                                        className={cn(
                                            'w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all border',
                                            disputeReason === reason
                                                ? 'bg-red-500 text-white border-red-500'
                                                : 'bg-stone-50 text-stone-600 border-stone-100 hover:border-red-200 hover:bg-red-50'
                                        )}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>

                            {/* Optional counter evidence */}
                            <div className="pt-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Counter-evidence (optional)</p>
                                {!corroborating && !showCameraForCorroboration && (
                                    <button onClick={startCorroborationCamera}
                                        className="w-full border border-dashed border-stone-200 rounded-xl p-4 flex items-center gap-3 hover:border-red-300 hover:bg-red-50/50 transition-all">
                                        <Camera size={18} className="text-stone-300" />
                                        <span className="text-xs font-medium text-stone-400">Add counter photo</span>
                                    </button>
                                )}
                                {showCameraForCorroboration && (
                                    <div className="rounded-xl overflow-hidden border border-stone-200 bg-black">
                                        <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover" />
                                        <div className="p-3 flex gap-2">
                                            <button onClick={() => { streamRef.current?.getTracks().forEach(t => t.stop()); setShowCameraForCorroboration(false); }}
                                                className="flex-1 py-2 rounded-lg border text-xs font-bold text-stone-500">Cancel</button>
                                            <button onClick={captureCorroboration}
                                                className="flex-[2] py-2 rounded-lg bg-red-500 text-white text-xs font-bold">Capture</button>
                                        </div>
                                    </div>
                                )}
                                {corroborating && (
                                    <div className="relative rounded-xl overflow-hidden border border-stone-200">
                                        <img src={URL.createObjectURL(corroborating)} alt="Counter" className="w-full aspect-video object-cover" />
                                        <button onClick={() => setCorroborating(null)}
                                            className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1.5 rounded-full">
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2">
                            <AlertTriangle size={14} className="text-red-500 shrink-0" />
                            <p className="text-xs font-semibold text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || (type === 'confirm' ? !canSubmitConfirm : !canSubmitDispute)}
                        className={cn(
                            'w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-3',
                            type === 'confirm'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                        )}
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Submitting...
                            </>
                        ) : type === 'confirm' ? 'Confirm This Report' : 'Submit Dispute'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
